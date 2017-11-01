#!/usr/bin/env node
const chalk = require('chalk');
const inquirer = require('inquirer');
const commander = require('commander');

const pkg = require('../package.json');

const flow = () => {
  console.log('\n  ' + chalk.bgGreen(chalk.black(' Welcome to rsg hack! \n')))
  inquirer.prompt({
    type: 'list',
    name: 'develop',
    message: 'What do you want to develop?',
    choices: [
      'Web Application',
      'Library',
      'Node RESTful',
      'UI Components'
    ]
  }).then(answer1 => {
    if (answer1.develop === 'Web Application') {
      inquirer.prompt({
        type: 'list',
        name: 'framework',
        message: 'Please choose a framework',
        choices: [
          'React',
          'Angular',
          'Vue'
        ]
      }).then(answer2 => {
        inquirer.prompt({ type: 'confirm', name: 'confirm', message: 'Are you sure?' }).then(answer3 => {
          console.error(answer3);
        });
      })
    } else {
      console.log('Sorry, this is under designing!');
    }
  });
}

if (process.argv.length < 3) flow();

commander
  .version(pkg.version)
  .option('-v', 'version', () => console.log(pkg.version))
  .parse(process.argv);
