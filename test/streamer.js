import { expect } from 'chai';
import streamer from '../src/streamer';

describe('streamer', () => {
  describe('.peek()', () => {
    it('finds the character at the current index', () => {
      const source = 'sum = fn(x, y) x + y;';
      const stream = streamer(source);

      expect(stream.peek()).to.equal('s');
    });
  });

  describe('.next()', () => {
    it('moves the current index along 1 space', () => {
      const source = 'sum = fn(x, y) x + y;';
      const stream = streamer(source);

      stream.next();
      expect(stream.peek()).to.equal('u');

      stream.next();
      expect(stream.peek()).to.equal('m');
    });
  });

  describe('.eof()', () => {
    it('returns false if not at the end of the line', () => {
      const source = 's';
      const stream = streamer(source);

      expect(stream.eof()).to.be.false;
    });

    it('returns true if not at the end of the line', () => {
      const source = 's';
      const stream = streamer(source);
      stream.next();

      expect(stream.eof()).to.be.true;
    });
  });
});
