const makers = require('./makers');

function parse(input) {
  const prog = makers.makeTopLevel(input, []);

  return {
    type: 'prog',
    prog
  };
}

module.exports = parse;
