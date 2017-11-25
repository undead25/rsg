const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs-extra');
const Metalsmith = require('metalsmith');
const handlebars = require('handlebars');

const init = require('./init');
const questions = require('./questions');
const filter = require('./filter');
const render = require('./render');

module.exports = async project => {
  handlebars.registerHelper('if_eq', (a, b, opts) => a === b ? opts.fn(this) : opts.inverse(this));

  const metalsmith = Metalsmith(process.cwd());
  if (fs.pathExistsSync(project)) {
    console.log();
    ora().info(`Project ${chalk.blue.bold(`${project}`)} exists, please try using a new project name.\n`);
    process.exit(1);
  }

  init(project, () => {
    const { filters, prompts, template } = fs.readJsonSync(`${project}/meta.json`);
    const metadata = { project, filters, prompts, template };

    metalsmith
      .clean(false)
      .metadata(metadata)
      .source(`./${project}/${template}`)
      .destination(`./${project}/build`)
      .use(questions)
      .use(filter)
      .use(render)
      .build(err => err && ora().fail(err));
  });
}
