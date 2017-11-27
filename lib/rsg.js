const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs-extra');
const Metalsmith = require('metalsmith');
const handlebars = require('handlebars');

const init = require('./init');
const questions = require('./questions');
const filter = require('./filter');
const render = require('./render');

const rsg = project => {
  handlebars.registerHelper('if_eq', (a, b, opts) => a === b ? opts.fn(this) : opts.inverse(this));

  const metalsmith = Metalsmith(process.cwd());
  if (fs.pathExistsSync(project)) {
    console.log();
    ora().info(`Project ${chalk.blue.bold(`${project}`)} exists, please try using a new project name.\n`);
    process.exit(1);
  }

  init(project, repoName => {
    const { filters, prompts, template } = fs.readJsonSync(`${repoName}/meta.json`);
    const metadata = { project, filters, prompts, template };

    metalsmith
      .metadata(metadata)
      .source(template)
      .destination(project)
      .use(questions)
      .use(filter)
      .use(render)
      .build((err, files) => {
        if (err) {
          ora().fail(err);
          fs.removeSync(repoName);
          process.exit(1);
        }
        fs.removeSync(repoName);

        // success messages
        console.log()
        ora().succeed(chalk.green(` rsg initial ${project} succeed! \n`));
        console.log(`To get started, please run commands belown: \n\n cd ${project} \n npm i && npm start\n`);
      });
  });
}

module.exports = rsg;
