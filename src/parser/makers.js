/* eslint no-use-before-define: ["error", { "functions": false }] */

import {
  isPunc,
  isKeyword,
  isOperator,
  skipPunc,
  skipKeyword,
  unexpected
} from './matchers';

const PRECEDENCE = {
  '=': 1,
  '||': 2,
  '&&': 3,
  '<': 7,
  '>': 7,
  '<=': 7,
  '>=': 7,
  '==': 7,
  '!=': 7,
  '|>': 8,
  '+': 10,
  '-': 10,
  '*': 20,
  '/': 20,
  '%': 20,
  '**': 30
};

const FALSE = {
  type: 'Boolean',
  value: false
};

export function delimited(input, start, stop, separator, parser) {
  const a = [];
  let first = true;
  skipPunc(input, start);
  while (!input.eof()) {
    if (isPunc(input, stop)) {
      break;
    }
    if (first) {
      first = false;
    } else {
      skipPunc(input, separator);
    }
    if (isPunc(input, stop)) {
      break;
    }
    a.push(parser(input));
  }
  skipPunc(input, stop);
  return a;
}

export function parseConstName(input) {
  const name = input.next();
  console.log(name);
  if (name.type !== 'VariableDeclarator') {
    input.fail('Expecting constant name');
  }
  return name.value;
}

export function parseCall(input, func) {
  const args = delimited(input, '(', ')', ',', parseExpression);
  return {
    type: 'CallExpression',
    func,
    args
  };
}

export function parseBool(input) {
  const value = (input.next().value === 'true');
  return {
    type: 'Boolean',
    value
  };
}

export function maybeCall(input, expression) {
  const exp = expression();
  return isPunc(input, '(') ? parseCall(input, exp) : exp;
}

export function parseFunction(input) {
  const constants = delimited(input, '(', ')', ',', parseConstName);
  const body = parseExpression(input);
  return {
    type: 'FunctionExpression',
    constants,
    body
  };
}

export function parseIf(input) {
  skipKeyword(input, 'if');
  const condition = parseExpression(input);
  const then = parseExpression(input);
  const conditional = {
    type: 'if',
    condition,
    then
  };
  if (isKeyword(input, 'else')) {
    input.next();
    return Object.assign({}, conditional, {
      else: parseExpression(input)
    });
  }
  return conditional;
}

export function parseProg(input) {
  const body = delimited(input, '{', '}', ';', parseExpression);
  if (body.length === 0) {
    return FALSE;
  }
  if (body.length === 1) {
    return body[0];
  }
  return {
    type: 'Program',
    body
  };
}

export function parseAtom(input, fn) {
  return fn(input, () => {
    if (isPunc(input, '(')) {
      input.next();
      const expression = parseExpression(input);
      skipPunc(input, ')');
      return expression;
    }
    if (isPunc(input, '{')) {
      return parseProg(input);
    }
    if (isKeyword(input, 'if')) {
      return parseIf(input);
    }
    if (isKeyword(input, 'true') || isKeyword(input, 'false')) {
      return parseBool(input);
    }
    if (isKeyword(input, 'fn')) {
      input.next();
      return parseFunction(input);
    }
    const token = input.next();
    if (token.type === 'const' || token.type === 'num' || token.type === 'str') {
      return token;
    }
    return unexpected(input);
  });
}

export function maybeBinary(input, left, precedence) {
  const token = isOperator(input);
  if (token) {
    const newPrecedence = PRECEDENCE[token.value];
    if (newPrecedence > precedence) {
      input.next();
      const type = token.value === '=' ? 'VariableDeclaration' : 'BinaryExpression';
      const right = maybeBinary(input, parseAtom(input, maybeCall), newPrecedence);
      return maybeBinary(input, {
        type,
        left,
        operator: token.value,
        right
      }, precedence);
    }
  }
  return left;
}

export function makeTopLevel(input, currentLines) {
  if (input.eof()) {
    return currentLines;
  }
  const newLines = currentLines.concat([parseExpression(input)]);
  skipPunc(input, ';');

  return makeTopLevel(input, newLines);
}

export function parseExpression(input) {
  return maybeCall(input, () => maybeBinary(input, parseAtom(input, maybeCall), 0));
}
