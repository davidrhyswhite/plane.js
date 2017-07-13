const repl = require('repl');
const pkg = require('../package');

function setupEval(run) {
  return function planeEval(cmd, context, filename, callback) {
    callback(null, run(cmd));
  };
}

module.exports = function runner(run) {
  // eslint-disable-next-line no-console
  console.log(`✈ plane.js REPL, version: ${pkg.version}`);

  repl.start({
    prompt: '✈ ',
    eval: setupEval(run)
  });
};
