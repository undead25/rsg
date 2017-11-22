#!/usr/bin/env node
const commander = require('commander');
const ora = require('ora');
const chalk = require('chalk');
const pkg = require('../package.json');

let project;

commander
  .version(pkg.version)
  .usage(`${chalk.blue('<project-directory>')} ${chalk.green('[options]')}`)
  .action(name => {
    project = name;
  })
  .option('-v', 'version', () => ora().info(pkg.version))
  .parse(process.argv);

if (!project) {
  ora().fail(chalk.redBright('Please specify the project directory:'));
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('<project-directory>')} \n`);
  ora().info('For example:');
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('my-project')} \n`);
  ora().info('For help:');
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('--help')} \n`);
  process.exit(1);
}
