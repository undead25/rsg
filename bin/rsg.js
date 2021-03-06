#!/usr/bin/env node
const commander = require('commander');
const ora = require('ora');
const chalk = require('chalk');

const rsg = require('../lib/rsg');
const pkg = require('../package.json');
let project;

commander
  .version(pkg.version)
  .usage(`${chalk.blue('<project-name>')} ${chalk.green('[options]')}`)
  .action(name => (project = name))
  .option('-v', 'version', () => ora().info(pkg.version))
  .parse(process.argv);

const errorLog = err => {
  console.log();
  ora().fail(chalk.redBright(err));
  console.log(`  Usage: ${chalk.blue('rsg')} ${chalk.green('<project-name>')} \n`);
  ora().info('For example:');
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('my-project')} \n`);
  ora().info('For help:');
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('--help')} \n`);
  process.exit(1);
}

!project && errorLog('Please specify the project name.')

process.argv.length > 3 && errorLog('Too many arguments.')

rsg(project);
