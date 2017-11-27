const chalk = require('chalk');
const inquirer = require('inquirer');

const config = require('./config');
const clone = require('./clone');

module.exports = async (project, next) => {
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
        'React'
        // 'Angular',
        // 'Vue'
      ]
    });

    await clone(config[framework.toLowerCase()], next);
  };
};
