const fs = require('fs-extra');
const { spawn } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

const cloneRepo = (repo, project, next) => {
  fs.ensureDirSync(project);

  const clone = spawn('git', ['clone', repo, project]);
  console.log();
  const spinner = ora('template downloading...').start();

  clone.on('close', code => {
    if (code === 0) {
      spinner.clear();
      spinner.succeed(chalk.green('Template downloads succeed!\n'));
      next();
    } else {
      spinner.fail(`Failed to download repo ${chalk.red.underline(repo)}`);
    }
  });
}

module.exports = cloneRepo;
