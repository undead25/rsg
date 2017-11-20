const Metalsmith = require('metalsmith');
const render = require('consolidate').handlebars.render;
const ora = require('ora');
const match = require('minimatch')
const { execSync } = require('child_process');

const prompt = require('./prompt');

/**
 * Template plugin for metalsmith
 * @param {Object} files files information
 * @param {Metalsmith} metalsmith Metalsmith Object
 * @param {Function} done callback to trigger the next step
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
  });
}

const filterFiles = (files, metalsmith, done) => {
  const { filters } = metalsmith.metadata();
  const fileNames = Object.keys(files);
  Object.keys(filters).forEach(glob => {
    fileNames.forEach(file => {
      if (match(file, glob, { dot: true })) {
        const condition = filters[glob];
        if (!metalsmith.metadata()[condition]) {
          console.log(file)
        }
        // console.log(condition)
        // if (!evaluate(condition, metalsmith.metadata())) {
        //   delete files[file]
        // }
      }
    })
  })
}

const getUser = () => execSync('git config --get user.name').toString().trim();

const getConfig = (files, metalsmith, done) => {
  Object.keys(files).forEach(file => {
    if (file === 'meta.json') {
      const { filters } = JSON.parse(files[file].contents.toString());
      metalsmith.metadata({ filters });
      done();
    }
  })
}

const generate = () => {
  const metalsmith = Metalsmith(process.cwd());
  const metadata = {
    name: 'test',
    author: getUser()
  }

  metalsmith.source('./download')
    .metadata(metadata)
    .use(getConfig)
    .use(prompt)
    .use(filterFiles)
    .use(renderTemplate)
    .build(err => err && ora().fail(err))
}

generate()

// module.exports = generate;
