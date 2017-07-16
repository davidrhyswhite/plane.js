import {
  isKeyword,
  isDigit,
  isIDStart,
  isID,
  isOpChar,
  isPunc,
  isWhitespace
} from './matchers';

export function readWhile(input, predicate, str = '') {
  if (!input.eof() && predicate(input.peek())) {
    const concatenated = str + input.next();
    return readWhile(input, predicate, concatenated);
  }
  return str;
}

export function readNumber(input) {
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

export function readIdent(input) {
  const id = readWhile(input, isID);
  const type = isKeyword(id) ? 'keyword' : 'const';
  return {
    type,
    value: id
  };
}

export function readEscaped(input, end) {
  let escaped = false;
  let str = '';
  input.next();

  while (!input.eof()) {
    const isTemplateExpression = (input.peek() === '$' && input.lookAhead() === '{');
    const character = input.next();
    if (isTemplateExpression) {
      input.next();
      const id = readWhile(input, isID);
      return {
        ids: [id],
        strings: [str, readEscaped(input, '"')]
      };
    }
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

export function readString(input) {
  const value = readEscaped(input, '"');
  const type = (typeof value === 'string') ? 'str' : 'template';

  return {
    type,
    value
  };
}

export function skipComment(input) {
  readWhile(input, character => character !== '\n');
  input.next();
}

export function readNext(input) {
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
