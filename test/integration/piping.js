const { expect } = require('chai');
const streamer = require('../../src/streamer');
const tokenizer = require('../../src/lexer');
const parser = require('../../src/parser');
const World = require('../../src/world');
const { evaluate } = require('../../src/parser/evaluators');

const run = (script, world) => {
  const stream = streamer(script);
  const tokenized = tokenizer(stream);
  const ast = parser(tokenized);

  evaluate(ast, world);
};

describe('Pipe operator', () => {
  it('passes the output of the left expression to the right expression as a function call', () => {
    const script = `
      square = fn(x) {
        x * x;
      };
      cube = fn(x) {
        x * x * x;
      };
      squaredAndCubed = 2 |> square |> cube;
    `;
    const world = new World();

    run(script, world);

    expect(world.constants.squaredAndCubed).to.equal(64);
  });
});
