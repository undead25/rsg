#!/usr/bin/env node
const commander = require('commander');
const ora = require('ora');
const chalk = require('chalk');

const generate = require('../lib/generate');
const pkg = require('../package.json');
let project;

commander
  .version(pkg.version)
  .usage(`${chalk.blue('<project-name>')} ${chalk.green('[options]')}`)
  .action(name => (project = name))
  .option('-v', 'version', () => ora().info(pkg.version))
  .parse(process.argv);

if (!project) {
  console.log();
  ora().fail(chalk.redBright('Please specify the project name:'));
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('<project-name>')} \n`);
  ora().info('For example:');
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('my-project')} \n`);
  ora().info('For help:');
  console.log(`  ${chalk.blue('rsg')} ${chalk.green('--help')} \n`);
  process.exit(1);
}

generate();
