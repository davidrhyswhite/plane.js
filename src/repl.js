const repl = require('repl');
const { run } = require('../index');
const pkg = require('../package');

function planeEval(cmd, context, filename, callback) {
  callback(null, run(cmd));
}

// eslint-disable-next-line no-console
console.log(`✈ plane.js REPL, version: ${pkg.version}`);

repl.start({
  prompt: '✈ ',
  eval: planeEval
});
