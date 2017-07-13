import { expect } from 'chai';
import {
  isKeyword,
  isDigit,
  isIDStart,
  isID,
  isOpChar,
  isPunc,
  isWhitespace
} from '../../src/lexer/matchers';

import {
  KEYWORDS,
  OPERATORS,
  PUNCTUATIONS,
  WHITESPACE,
  IDENTIFIERS,
  NON_STARTING_IDENTIFIERS
} from '../../src/constants';

const DIGITS = [1, 2, 3, 10, 11, 44.3];

describe('Lexer', () => {
  describe('-> matchers', () => {
    describe('.isKeyword()', () => {
      KEYWORDS.forEach((keyword) => {
        it(`returns true for the following keyword: "${keyword}"`, () => {
          expect(isKeyword(keyword)).to.be.true;
        });
      });

      it('returns false for non keywords', () => {
        expect(isKeyword('switch')).to.be.false;
      });
    });

    describe('.isDigit()', () => {
      DIGITS.forEach((digit) => {
        it(`returns true for digits: "${digit}"`, () => {
          expect(isDigit(digit)).to.be.true;
        });
      });

      it('returns false for strings', () => {
        expect(isDigit('switch')).to.be.false;
      });

      it('returns false for objects', () => {
        expect(isDigit({})).to.be.false;
      });

      it('returns false for booleans', () => {
        expect(isDigit(true)).to.be.false;
      });
    });

    describe('.isIDStart()', () => {
      IDENTIFIERS.forEach((identifier) => {
        it(`returns true for identifiers: "${identifier}"`, () => {
          expect(isIDStart(identifier)).to.be.true;
        });
      });
      NON_STARTING_IDENTIFIERS.forEach((identifier) => {
        it(`returns false for the following non-starting identifiers: "${identifier}"`, () => {
          expect(isIDStart(identifier)).to.be.false;
        });
      });
      OPERATORS.forEach((operator) => {
        it(`returns false for the following operators: "${operator}"`, () => {
          expect(isIDStart(operator)).to.be.false;
        });
      });
    });
    describe('.isID()', () => {
      IDENTIFIERS.forEach((identifier) => {
        it(`returns true for identifiers: "${identifier}"`, () => {
          expect(isID(identifier)).to.be.true;
        });
      });
      NON_STARTING_IDENTIFIERS.forEach((identifier) => {
        it(`returns true for the following non-starting identifiers: "${identifier}"`, () => {
          expect(isID(identifier)).to.be.true;
        });
      });
    });
    describe('.isOpChar()', () => {
      OPERATORS.forEach((operator) => {
        it(`returns true for operators: "${operator}"`, () => {
          expect(isOpChar(operator)).to.be.true;
        });
      });
    });

    describe('.isPunc()', () => {
      PUNCTUATIONS.forEach((punctuation) => {
        it(`returns true for punctuations: "${punctuation}"`, () => {
          expect(isPunc(punctuation)).to.be.true;
        });
      });
    });
    describe('.isWhitespace()', () => {
      WHITESPACE.forEach((space) => {
        it(`returns true for punctuations: "${space}"`, () => {
          expect(isWhitespace(space)).to.be.true;
        });
      });
    });
  });
});
