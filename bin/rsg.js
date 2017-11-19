#!/usr/bin/env node
const commander = require('commander');
const ora = require('ora');
const pkg = require('../package.json');

commander
  .version(pkg.version)
  .option('-v', 'version', () => ora().info(pkg.version))
  .parse(process.argv);
