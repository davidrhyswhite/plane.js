import { expect } from 'chai';
import streamer from '../../src/streamer';
import tokenizer from '../../src/lexer/index';
import parser from '../../src/parser/index';
import World from '../../src/world/index';
import { evaluate } from '../../src/evaluators';

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
