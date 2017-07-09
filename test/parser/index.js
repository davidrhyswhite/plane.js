const { expect } = require('chai');
const sinon = require('sinon');

const parse = require('../../src/parser');
const makers = require('../../src/parser/makers');

const sandbox = sinon.sandbox.create();

describe('Parser', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('.parse()', () => {
    it('calls .makeTopLevel and returns the AST', () => {
      const expectedAST = {
        type: 'prog',
        prog: []
      };
      const input = sandbox.spy();
      sandbox.stub(makers, 'makeTopLevel').returns([]);

      const ast = parse(input);

      expect(makers.makeTopLevel.calledWith(input, [])).to.be.true;
      expect(ast).to.deep.equal(expectedAST);
    });
  });
});
