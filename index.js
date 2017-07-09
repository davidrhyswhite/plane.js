const streamer = require('./src/streamer');
const tokenizer = require('./src/lexer');
const parser = require('./src/parser');
const World = require('./src/world');
const { evaluate } = require('./src/parser/evaluators');

const world = new World();

const run = (script) => {
  const stream = streamer(script);
  const tokenized = tokenizer(stream);
  const ast = parser(tokenized);

  evaluate(ast, world);
};

module.exports = {
  run
};
