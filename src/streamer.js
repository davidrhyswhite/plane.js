export default function (input) {
  let position = 0;
  let line = 1;
  let column = 0;

  const next = () => {
    const character = input.charAt(position);
    position += 1;
    if (character === '\n') {
      line += 1;
      column = 0;
    } else {
      column += 1;
    }
    return character;
  };

  const lookAhead = () => {
    const character = input.charAt(position + 1);
    return character;
  };

  const peek = () => input.charAt(position);

  const eof = () => (peek() === '');

  const fail = (msg) => {
    throw new Error(`${msg} (${line}:${column})`);
  };

  return {
    next,
    lookAhead,
    peek,
    eof,
    fail
  };
}
