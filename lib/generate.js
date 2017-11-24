const ora = require('ora');
const Metalsmith = require('metalsmith');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const render = require('consolidate').handlebars.render;

const clone = require('./clone');
const { react } = require('./config');

/**
 * Template plugin for metalsmith
 * @param {Object} files files information
 * @param {Metalsmith} metalsmith Metalsmith Object
 * @param {Function} done callback to trigger the next step
 */
const renderTemplate = (files, metalsmith, done) => {
  const metadata = metalsmith.metadata();
  Object.keys(files).forEach(file => {
    // string contents of each file
    const contents = files[file].contents.toString();

    // only render files have mustaches
    if (/{{([^{}]+)}}/g.test(contents)) {
      render(contents, metadata, (err, res) => {
        err && ora().fail(err);
        files[file].contents = Buffer.from(res);
        done();
      })
    };
  });
}

const filterFiles = (files, metalsmith, done) => {
  const { filters } = metalsmith.metadata();
  !filters && done();

  const fileNames = Object.keys(files);
  Object.keys(filters).forEach(filterFile => {
    fileNames.forEach(file => {
      if (file === filterFile) {
        const condition = filters[filterFile];
        !metalsmith.metadata()[condition] && delete files[file];
      }
    })
  });
  done();
}

const getUser = () => execSync('git config --get user.name').toString().trim();

const getConfig = (files, metalsmith, done) => {
  Object.keys(files).forEach(file => {
    if (file === 'meta.json') {
      const { filters, prompts } = JSON.parse(files[file].contents.toString());
      metalsmith.metadata({ filters, prompts });
      done();
    }
  })
};

const init = async () => {
  console.log('\n  ' + chalk.bgGreen(chalk.black(' Welcome to rsg hack! \n')));
  const { target } = await inquirer.prompt({
    type: 'list',
    name: 'target',
    message: 'Which type of app you want to develop?',
    choices: [
      'Web Application'
      // 'Library',
      // 'Node RESTful',
      // 'UI Components'
    ]
  })

  if (target === 'Web Application') {
    const { framework } = await inquirer.prompt({
      type: 'list',
      name: 'framework',
      message: 'Please choose a framework',
      choices: [
        'React',
        'Angular',
        'Vue'
      ]
    });

    if (framework === 'React') {
      await clone(react.repo, react.pathname);
      return react.pathname;
    } else {
      ora().info('Woking in progress & thanks for your intention!');
    }
  };
};

const questions = async (files, metalsmith, done) => {
  const metadata = metalsmith.metadata();
  const { prompts } = metadata;
  !prompts && done();

  let data = [];
  Object.keys(prompts).forEach(name => {
    const { type, message } = prompts[name];
    let inputVal;
    name === 'name' && (inputVal = 'abc');
    name === 'author' && (inputVal = getUser());
    name === 'description' && (inputVal = 'abc');

    let options = { type, message, name }
    type === 'input' && (options.default = inputVal);
    data.push({ ...options });
  });

  const answers = await inquirer.prompt(data);
  metalsmith.metadata({ ...metadata, ...answers });
  done();
}

const generate = async () => {
  const metalsmith = Metalsmith(process.cwd());
  const filesPath = await init();

  filesPath && metalsmith.source(filesPath)
    .use(getConfig)
    .use(questions)
    .use(filterFiles)
    .use(renderTemplate)
    .build(err => err && ora().fail(err));
}

module.exports = generate;
