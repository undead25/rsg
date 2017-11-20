const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

const prompt = async (files, metalsmith, done) => {
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
      const { typescript } = await inquirer.prompt({
        type: 'confirm',
        name: 'typescript',
        message: 'Using TypeScript?'
      });

      const { sass } = await inquirer.prompt({
        type: 'confirm',
        name: 'sass',
        message: 'Using Sass for style?'
      });

      const { less } = await inquirer.prompt({
        type: 'confirm',
        name: 'less',
        message: 'Using Less for style?'
      });

      await metalsmith.metadata({ ...metalsmith.metadata(), typescript, sass, less });
      done();
    } else {
      ora().info('Woking in progress & thanks for your intention!')
    }
  };
}

module.exports = prompt;
