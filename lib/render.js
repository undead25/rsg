const render = require('consolidate').handlebars.render;
const ora = require('ora');

/**
 * Template plugin for metalsmith
 * @param {Object} files files information
 * @param {Metalsmith} metalsmith Metalsmith Object
 * @param {Function} done callback to trigger the next step
 */
module.exports = (files, metalsmith, done) => {
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
  });
}
