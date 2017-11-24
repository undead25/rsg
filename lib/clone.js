const fs = require('fs-extra');
const { spawn } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

const cloneRepo = async (repo, path) => {
  console.log(path)
  console.log(fs.pathExistsSync(path))
  return;
  const clone = spawn('git', ['clone', repo]);
  const spinner = ora('template downloading...').start();

  clone.on('close', code => {
    if (code === 0) {
      spinner.succeed('template downloads succeed!');
    } else {
      spinner.fail(`Failed to download repo ${chalk.red.underline(repo)}`);
    }
  });
}

module.exports = cloneRepo;
