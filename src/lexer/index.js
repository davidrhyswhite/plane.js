import { readNext } from './readers';

export default function lexer(input) {
  let current = null;

  function peek() {
    return current || (current = readNext(input));
  }

  function next() {
    const token = current;
    current = null;
    return token || readNext(input);
  }

  function eof() {
    return peek() === null;
  }

  return {
    next,
    peek,
    eof,
    fail: input.fail
  };
}
