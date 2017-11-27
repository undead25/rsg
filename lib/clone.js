const fs = require('fs-extra');
const { spawn } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

const cloneRepo = (repoUrl, next) => {
  const clone = spawn('git', ['clone', repoUrl]);
  console.log();
  const spinner = ora('template downloading...').start();

  clone.on('close', code => {
    if (code === 0) {
      spinner.clear();
      spinner.succeed(chalk.green('Template downloads succeed!\n'));
      const repoName = repoUrl.split('/').reverse()[0].replace(/.git/, '')
      next(repoName);
    } else {
      spinner.fail(`Failed to download repo ${chalk.red.underline(repoUrl)}`);
    }
  });
}

module.exports = cloneRepo;
