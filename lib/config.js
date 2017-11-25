const { execSync } = require('child_process');

module.exports = {
  react: 'https://github.com/undead25/rsg-react.git',
  user: execSync('git config --get user.name').toString().trim()
};
