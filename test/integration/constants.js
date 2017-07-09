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
