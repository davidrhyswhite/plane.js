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

const isTemplateExpression = input => (input.peek() === '$' && input.lookAhead() === '{');

export function readEscaped(input, end, string = '', expressions = [], quasis = []) {
  let escaped = false;
  input.next();

  while (!input.eof()) {
    const character = input.next();
    if (isTemplateExpression(input)) {
      quasis.push({ type: 'str', value: string + character });
      input.next();
      input.next();
      const id = readIdent(input);
      expressions.push(id);

      return readEscaped(input, '"', '', expressions, quasis);
    }
    if (escaped) {
      // eslint-disable-next-line no-param-reassign
      string += character;
      escaped = false;
    } else if (character === '\\') {
      escaped = true;
    } else if (character === end) {
      break;
    } else {
      // eslint-disable-next-line no-param-reassign
      string += character;
    }
  }
  if (expressions.length > 0 || quasis.length > 0) {
    quasis.push({ type: 'str', value: string });
    return {
      expressions,
      quasis
    };
  }
  return string;
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
