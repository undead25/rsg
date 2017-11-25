/**
 * Remove files whick do not match the config from meta.json file.
 * @param {Object} files files information
 * @param {Metalsmith} metalsmith Metalsmith Object
 * @param {Function} done callback to trigger the next step
 */
module.exports = (files, metalsmith, done) => {
  const { filters } = metalsmith.metadata();
  !filters && done();
  const fileNames = Object.keys(files);
  Object.keys(filters).forEach(filterFile => {
    fileNames.forEach(file => {
      if (file === filterFile) {
        // string condition, such as 'typescript', 'sass'...
        const condition = filters[filterFile];

        // eslint-disable-next-line no-new-func
        const evaluate = new Function('data', `with (data) {return ${condition}}`);
        // console.log(condition, !evaluate(metalsmith.metadata()), file);

        // delete files if math the condition
        !evaluate(metalsmith.metadata()) && delete files[file];
      }
    })
  });
  done();
}
