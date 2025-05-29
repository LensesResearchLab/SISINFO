module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require test/support/**/*.ts',
    '--require test/steps/**/*.ts',
    '--format progress',
    'test/features/**/*.feature'
  ].join(' ')
};