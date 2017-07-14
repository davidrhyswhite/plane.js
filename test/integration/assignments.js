import { expect } from 'chai';
import streamer from '../../src/streamer';
import tokenizer from '../../src/lexer/index';
import parser from '../../src/parser/index';
import TestWorld from '../test-world';
import { evaluate } from '../../src/evaluators';

const run = (script) => {
  const stream = streamer(script);
  const tokenized = tokenizer(stream);
  const ast = parser(tokenized);
  const world = new TestWorld(undefined, true);

  evaluate(ast, world);

  return { stream, tokenized, ast };
};

describe('constant assignment', () => {
  it('assigns constants of strings, numbers and booleans', () => {
    const script = `
      stringConst = "stringConst";
      numberConst = 10;
      booleanConst = true;
    `;

    run(script);
    const [programWorld] = global.plane.worlds;

    expect(programWorld.constants.stringConst).to.equal('stringConst');
    expect(programWorld.constants.numberConst).to.equal(10);
    expect(programWorld.constants.booleanConst).to.be.true;
  });

  it('assigns constants of type function', () => {
    const script = `
      func = fn(){};
    `;

    run(script);
    const [programWorld] = global.plane.worlds;

    expect(typeof programWorld.constants.func).to.equal('function');
  });

  it('assigns constants to a scope', () => {
    const script = `
      globalConst = 10;
      func = fn() {
        globalConst = 20;
      };
      func();
    `;

    run(script);

    const [programWorld, funcWorld] = global.plane.worlds;

    expect(programWorld.constants.globalConst).to.equal(10);
    expect(funcWorld.constants.globalConst).to.equal(20);
  });
});
