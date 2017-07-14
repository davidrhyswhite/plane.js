import { expect } from 'chai';
import sinon from 'sinon';

import parse from '../../src/parser/index';

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
      const makeTopLevel = sandbox.stub().returns([]);
      const input = sandbox.spy();

      const ast = parse(input, makeTopLevel);

      expect(makeTopLevel.calledWith(input, [])).to.be.true;
      expect(ast).to.deep.equal(expectedAST);
    });
  });
});
