const ora = require('ora');
const Metalsmith = require('metalsmith');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const render = require('consolidate').handlebars.render;

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

const init = async (files, metalsmith, done) => {
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
      // @todo clone appropriate repo
      done();
      // const { typescript } = await inquirer.prompt({
      //   type: 'confirm',
      //   name: 'typescript',
      //   message: 'Using TypeScript?'
      // });

      // const { sass } = await inquirer.prompt({
      //   type: 'confirm',
      //   name: 'sass',
      //   message: 'Using Sass for style?'
      // });

      // const { less } = await inquirer.prompt({
      //   type: 'confirm',
      //   name: 'less',
      //   message: 'Using Less for style?'
      // });

      // await metalsmith.metadata({ ...metalsmith.metadata(), typescript, sass, less });
      // done();
    } else {
      ora().info('Woking in progress & thanks for your intention!');
      done();
    }
  };
};

const questions = (files, metalsmith, done) => {
  const { prompts } = metalsmith.metadata();
  console.log(prompts)
  !prompts && done();
  Object.keys(prompts).forEach(prompt => {
    const { type, message } = prompts[prompt];
    inquirer.prompt({
      type, message, name: prompt
    });
  });
}

const generate = () => {
  const metalsmith = Metalsmith(process.cwd());
  const metadata = {
    name: 'test',
    author: getUser()
  }

  metalsmith.source('./download')
    .metadata(metadata)
    .use(init)
    .use(getConfig)
    .use(questions)
    .use(filterFiles)
    .use(renderTemplate)
    .build(err => err && ora().fail(err));
}

generate()

// module.exports = generate;