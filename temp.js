const Metalsmith = require('metalsmith');
var render = require('consolidate').handlebars.render;

// const metalsmith = Metalsmith(__dirname)
//   .source('./lib')
//   .use(template)
//   .build(function(err){
//     if (err) throw err;
//   });

// console.log(metalsmith.metadata())

function template(files, metalsmith, done) {
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();
  console.log(files[keys[0]].contents.toString())
  // async.each(keys, run, done);

  // function run(file, done){
  //   var str = files[file].contents.toString();
  //   render(str, metadata, function(err, res){
  //     if (err) return done(err);
  //     files[file].contents = new Buffer(res);
  //     done();
  //   });
  // }
}

const fs = require('fs');
const path = require('path');

// console.log(fs.readdirSync('./lib'))
var test = fs.readFileSync('./test.json').toString();

test = test.replace(/{{name}}/g, 'abc')
  .replace(/{{author}}/, 'leo');
console.log(test)
fs.writeFileSync('./test.json', test)