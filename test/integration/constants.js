import { expect } from 'chai';
import streamer from '../../src/streamer';
import tokenizer from '../../src/lexer/index';
import parser from '../../src/parser/index';
import World from '../../src/world/index';
import { evaluate } from '../../src/parser/evaluators';

const run = (script, world) => {
  const stream = streamer(script);
  const tokenized = tokenizer(stream);
  const ast = parser(tokenized);

  evaluate(ast, world);
};

describe('constant assignment', () => {
  it('assigns constants of strings, numbers and booleans', () => {
    const script = `
      stringConst = "stringConst";
      numberConst = 10;
      booleanConst = true;
    `;
    const world = new World();

    run(script, world);

    expect(world.constants.stringConst).to.equal('stringConst');
    expect(world.constants.numberConst).to.equal(10);
    expect(world.constants.booleanConst).to.be.true;
  });

  it('assigns constants of type function', () => {
    const script = `
      func = fn(){};
    `;
    const world = new World();

    run(script, world);

    expect(typeof world.constants.func).to.equal('function');
  });

  it.skip('assigns constants to a scope', () => {
    const script = `
      func = fn (stringConst) {
        scopedConst = stringConst;
      };
    `;
    const world = new World();

    run(script, world);

    expect(world.constants.func()).to.equal('function');
  });
});
