const {
  isKeyword,
  isDigit,
  isIDStart,
  isID,
  isOpChar,
  isPunc,
  isWhitespace
} = require('./matchers');

function readWhile(input, predicate, str = '') {
  if (!input.eof() && predicate(input.peek())) {
    const concatenated = str + input.next();
    return readWhile(input, predicate, concatenated);
  }
  return str;
}

function readNumber(input) {
  let hasDot = false;
  const number = readWhile(input, (character) => {
    if (character === '.') {
      if (hasDot) {
        return false;
      }
      hasDot = true;
      return true;
    }
    return isDigit(character);
  });
  return {
    type: 'num',
    value: parseFloat(number)
  };
}

function readIdent(input) {
  const id = readWhile(input, isID);
  const type = isKeyword(id) ? 'keyword' : 'const';
  return {
    type,
    value: id
  };
}

function readEscaped(input, end) {
  let escaped = false;
  let str = '';
  input.next();

  while (!input.eof()) {
    const character = input.next();
    if (escaped) {
      str += character;
      escaped = false;
    } else if (character === '\\') {
      escaped = true;
    } else if (character === end) {
      break;
    } else {
      str += character;
    }
  }
  return str;
}

function readString(input) {
  const value = readEscaped(input, '"');
  return {
    type: 'str',
    value
  };
}

function skipComment(input) {
  readWhile(input, character => character !== '\n');
  input.next();
}

function readNext(input) {
  readWhile(input, isWhitespace);
  if (input.eof()) {
    return null;
  }
  const character = input.peek();

  if (character === '#') {
    skipComment(input);
    return readNext(input);
  }

  if (character === '"') {
    return readString(input);
  }

  if (isDigit(character)) {
    return readNumber(input);
  }

  if (isIDStart(character)) {
    return readIdent(input);
  }

  if (isPunc(character)) {
    return {
      type: 'punc',
      value: input.next()
    };
  }

  if (isOpChar(character)) {
    return {
      type: 'op',
      value: readWhile(input, isOpChar)
    };
  }

  return input.fail(`Unable to process character: ${character}`);
}

module.exports = {
  readWhile,
  readNumber,
  readIdent,
  readEscaped,
  readString,
  skipComment,
  readNext
};
