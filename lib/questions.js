const inquirer = require('inquirer');
const config = require('./config');

/**
 * Prompt question to gather the options for templates rendering.
 * @param {Object} files files information
 * @param {Metalsmith} metalsmith Metalsmith Object
 * @param {Function} done callback to trigger the next step
 */
module.exports = async (files, metalsmith, done) => {
  const metadata = metalsmith.metadata();
  const { prompts, project } = metadata;
  !prompts && done();

  // temp questions
  let data = [];
  Object.keys(prompts).forEach(name => {
    let { type, message, choices, when } = prompts[name];

    // cache when condition for override
    const _when = when;
    if (when) when = answer => answer[_when];

    // set type input's default value for package.json
    let inputVal;
    name === 'name' && (inputVal = project);
    name === 'author' && (inputVal = config.user);
    name === 'description' && (inputVal = project);

    let options = { type, message, name, choices, when }
    type === 'input' && (options.default = inputVal);

    data.push({ ...options });
  });

  const answers = await inquirer.prompt(data);
  metalsmith.metadata({ ...metadata, ...answers });
  done();
}
