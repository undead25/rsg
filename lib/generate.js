const Metalsmith = require('metalsmith');
const render = require('consolidate').handlebars.render;
const ora = require('ora');
const { execSync } = require('child_process');

const metadata = {
  name: 'test-repo',
  author: 'undead25'
}

/**
 * Template plugin for metalsmith
 * @param {Object} files files information
 * @param {Metalsmith} metalsmith Metalsmith Object
 * @param {Function} done done
 */
const renderTemplate = (files, metalsmith, done) => {
  const metadata = metalsmith.metadata();
  Object.keys(files).forEach(file => {
    // string contents of each file
    const contents = files[file].contents.toString();

    // only render files have mustaches
    if (/{{([^{}]+)}}/g.test(contents)) {
      render(contents, metadata, (err, res) => {
        err && ora().fail(err);
        files[file].contents = Buffer.from(res);
        done();
      })
    };
  })
}

const getUser = () => {
  
}

const generage = () => {
  const metalsmith = Metalsmith(process.cwd());

  metalsmith.source('./template')
    .metadata(metadata)
    .use(renderTemplate)
    .build(err => err && ora().fail(err))
}

module.exports = generage;
