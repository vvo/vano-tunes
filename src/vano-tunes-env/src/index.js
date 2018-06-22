const dotenvExtended = require('dotenv-extended');
const dotenvParseVariables = require('dotenv-parse-variables');

module.exports = dotenvParseVariables(
  dotenvExtended.load({
    assignToProcessEnv: false,
    silent: false,
    errorOnMissing: true,
    errorOnExtra: true,
  })
);
