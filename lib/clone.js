const fs = require('fs-extra');
const { spawn } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

const clone = (repo, targetPath) => {
  fs.ensureDir(targetPath).then(() => {
    const clone = spawn('git', ['clone', repo, targetPath]);
    const spinner = ora('template downloading...').start();

    clone.on('close', code => {
      if (code === 0) {
        spinner.succeed('template downloads succeed!');
      } else {
        spinner.fail(`Failed to download repo ${chalk.red.underline(repo)}`);
      }
    });
  })
}

// const repo = 'https://github.com/undead25/rsg-react.git';
// const targetPath = 'test';

module.exports = clone;
