const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

// const logger = require('./logger');

const repo = 'https://github.com/undead25/rsg-react.git2';
const targetPath = 'test';


// const clone = spawn('git', ['clone', repo, targetPath]);

// console.log(targetPath)
// clone.on('data', data => {
//   console.log(data)
// })

// path.basename(path.resolve('test'))
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
// fs.emptyDir(targetPath)

// module.exports = clone;