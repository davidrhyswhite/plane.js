(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.plane = factory());
}(this, (function () { 'use strict';

var streamer = function (input) {
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

  const peek = () => input.charAt(position);

  const eof = () => (peek() === '');

  const fail = (msg) => {
    throw new Error(`${msg} (${line}:${column})`);
  };

  return {
    next,
    peek,
    eof,
    fail
  };
};

const KEYWORDS = ['if', 'else', 'fn', 'true', 'false'];
const OPERATORS = ['+', '-', '*', '/', '%', '=', '&', '|', '<', '>', '!'];
const PUNCTUATIONS = ['', ',', ';', '(', ')', '{', '}', '[', ']', ''];
const WHITESPACE = [' ', '\t', '\n'];

const NON_STARTING_IDENTIFIERS = ['?', '!', '-', '<', '>', '=', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function isKeyword(x) {
  const keywords = ` ${KEYWORDS.join(' ')} `;
  return keywords.indexOf(` ${x} `) >= 0;
}

function isDigit(character) {
  return /[0-9]/i.test(character);
}

function isIDStart(character) {
  return /[a-z]/i.test(character);
}

function isID(character) {
  return isIDStart(character) || NON_STARTING_IDENTIFIERS.join('').indexOf(character) >= 0;
}

function isOpChar(character) {
  return OPERATORS.join('').indexOf(character) >= 0;
}

function isPunc(character) {
  return PUNCTUATIONS.join('').indexOf(character) >= 0;
}

function isWhitespace(character) {
  return WHITESPACE.join('').indexOf(character) >= 0;
}

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

function lexer(input) {
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

function isPunc$1(input, character) {
  const token = input.peek();
  if (token && token.type === 'punc' && (!character || token.value === character)) {
    return token;
  }
  return false;
}

function isKeyword$1(input, keyword) {
  const token = input.peek();
  if (token && token.type === 'keyword' && (!keyword || token.value === keyword)) {
    return token;
  }
  return false;
}

function isOperator(input, operator) {
  const token = input.peek();
  if (token && token.type === 'op' && (!operator || token.value === operator)) {
    return token;
  }
  return false;
}

function skipPunc(input, character) {
  if (isPunc$1(input, character)) {
    input.next();
  } else {
    input.fail(`Expecting punctuation: ${character}`);
  }
}

function skipKeyword(input, keyword) {
  if (isKeyword$1(input, keyword)) {
    input.next();
  } else {
    input.fail(`Expecting keyword: "${keyword}"`);
  }
}



function unexpected(input) {
  input.fail(`Unexpected token: ${JSON.stringify(input.peek())}`);
}

/* eslint no-use-before-define: ["error", { "functions": false }] */

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
  '**': 20
};

const FALSE = {
  type: 'bool',
  value: false
};

function delimited(input, start, stop, separator, parser) {
  const a = [];
  let first = true;
  skipPunc(input, start);
  while (!input.eof()) {
    if (isPunc$1(input, stop)) {
      break;
    }
    if (first) {
      first = false;
    } else {
      skipPunc(input, separator);
    }
    if (isPunc$1(input, stop)) {
      break;
    }
    a.push(parser(input));
  }
  skipPunc(input, stop);
  return a;
}

function parseConstName(input) {
  const name = input.next();
  if (name.type !== 'const') {
    input.fail('Expecting constant name');
  }
  return name.value;
}

function parseCall(input, func) {
  const args = delimited(input, '(', ')', ',', parseExpression);
  return {
    type: 'call',
    func,
    args
  };
}

function parseBool(input) {
  const value = (input.next().value === 'true');
  return {
    type: 'bool',
    value
  };
}

function maybeCall(input, expression) {
  const exp = expression();
  return isPunc$1(input, '(') ? parseCall(input, exp) : exp;
}

function parseLambda(input) {
  const constants = delimited(input, '(', ')', ',', parseConstName);
  const body = parseExpression(input);
  return {
    type: 'fn',
    constants,
    body
  };
}

function parseIf(input) {
  skipKeyword(input, 'if');
  const condition = parseExpression(input);
  const then = parseExpression(input);
  const conditional = {
    type: 'if',
    condition,
    then
  };
  if (isKeyword$1(input, 'else')) {
    input.next();
    return Object.assign({}, conditional, {
      else: parseExpression(input)
    });
  }
  return conditional;
}

function parseProg(input) {
  const prog = delimited(input, '{', '}', ';', parseExpression);
  if (prog.length === 0) {
    return FALSE;
  }
  if (prog.length === 1) {
    return prog[0];
  }
  return {
    type: 'prog',
    prog
  };
}

function parseAtom(input, fn) {
  return fn(input, () => {
    if (isPunc$1(input, '(')) {
      input.next();
      const expression = parseExpression(input);
      skipPunc(input, ')');
      return expression;
    }
    if (isPunc$1(input, '{')) {
      return parseProg(input);
    }
    if (isKeyword$1(input, 'if')) {
      return parseIf(input);
    }
    if (isKeyword$1(input, 'true') || isKeyword$1(input, 'false')) {
      return parseBool(input);
    }
    if (isKeyword$1(input, 'fn')) {
      input.next();
      return parseLambda(input);
    }
    const token = input.next();
    if (token.type === 'const' || token.type === 'num' || token.type === 'str') {
      return token;
    }
    return unexpected(input);
  });
}

function maybeBinary(input, left, precedence) {
  const token = isOperator(input);
  if (token) {
    const newPrecedence = PRECEDENCE[token.value];
    if (newPrecedence > precedence) {
      input.next();
      const type = token.value === '=' ? 'assign' : 'binary';
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

function makeTopLevel(input, currentLines) {
  if (input.eof()) {
    return currentLines;
  }
  const newLines = currentLines.concat([parseExpression(input)]);
  skipPunc(input, ';');

  return makeTopLevel(input, newLines);
}

function parseExpression(input) {
  return maybeCall(input, () => maybeBinary(input, parseAtom(input, maybeCall), 0));
}

function parse(input) {
  const prog = makeTopLevel(input, []);

  return {
    type: 'prog',
    prog
  };
}

var standardLib = function (world) {
  // eslint-disable-next-line no-console
  world.def('log', val => console.log(val));
};

function checkScope(scope, name) {
  if (Object.prototype.hasOwnProperty.call(scope.constants, name)) {
    return scope;
  }
  if (typeof scope.parent !== 'undefined') {
    return checkScope(scope.parent, name);
  }

  return false;
}

class World {
  constructor(parent) {
    this.constants = Object.create(parent ? parent.constants : null);
    this.parent = parent;
    standardLib(this);
  }

  extend() {
    return new World(this);
  }

  lookup(name) {
    const scope = checkScope(this, name);
    return scope;
  }

  get(name) {
    if (name in this.constants) {
      return this.constants[name];
    }
    throw new Error(`Undefined constant: "${name}"`);
  }

  set(name, value) {
    const scope = this.lookup(name);
    if (!scope && this.parent) {
      throw new Error(`Undefined constant: "${name}"`);
    }
    if ((scope || this).constants[name]) {
      throw new Error(`Attempting to reassign constant: "${name}"`);
    }
    (scope || this).constants[name] = value;
    return scope;
  }

  def(name, value) {
    this.constants[name] = value;
    return this.constants;
  }
}

const num = (x) => {
  if (typeof x !== 'number') {
    throw new Error(`Expected number but got: "${x}"`);
  }
  return x;
};

const div = (x) => {
  if (num(x) === 0) {
    throw new Error('Unable to divide number by zero');
  }
  return x;
};

function applyOperator(operator, left, right) {
  switch (operator) {
    case '+': {
      return num(left) + num(right);
    }
    case '-': {
      return num(left) - num(right);
    }
    case '*': {
      return num(left) * num(right);
    }
    case '/': {
      return num(left) / div(right);
    }
    case '%': {
      return num(left) % div(right);
    }
    case '**': {
      return num(left) ** num(right);
    }
    case '&&': {
      return left !== false && right;
    }
    case '||': {
      return left !== false ? left : right;
    }
    case '<': {
      return num(left) < num(right);
    }
    case '>': {
      return num(left) > num(right);
    }
    case '<=': {
      return num(left) <= num(right);
    }
    case '>=': {
      return num(left) >= num(right);
    }
    case '==': {
      return left === right;
    }
    case '!=': {
      return left !== right;
    }
    case '|>': {
      return right(left);
    }
    default: {
      throw new Error(`Unable to process operator ${operator}`);
    }
  }
}

function makeFunction(env, expression, evaluateFn) {
  const names = expression.constants;
  const scope = env.extend();

  return function fn(...args) {
    let i = 0;

    names.forEach((name) => {
      scope.def(name, (i < args.length) ? args[i] : false);
      i += 1;
    });

    return evaluateFn(expression.body, scope);
  };
}

function evaluate(expression, world) {
  switch (expression.type) {
    case 'num':
    case 'str':
    case 'bool': {
      return expression.value;
    }
    case 'const': {
      return world.get(expression.value);
    }
    case 'assign': {
      if (expression.left.type !== 'const') {
        throw new Error(`Cannot assign to ${JSON.stringify(expression.left)}`);
      }
      return world.set(expression.left.value, evaluate(expression.right, world));
    }
    case 'binary': {
      const left = evaluate(expression.left, world);
      const right = evaluate(expression.right, world);
      return applyOperator(expression.operator, left, right);
    }
    case 'fn': {
      return makeFunction(world, expression, evaluate);
    }
    case 'if': {
      const condition = evaluate(expression.condition, world);
      if (condition !== false) {
        return evaluate(expression.then, world);
      }
      return expression.else ? evaluate(expression.else, world) : false;
    }
    case 'prog': {
      let val = false;
      expression.prog.forEach((exp) => {
        val = evaluate(exp, world);
      });
      return val;
    }
    case 'call': {
      const func = evaluate(expression.func, world);
      return func(...expression.args.map(arg => evaluate(arg, world)));
    }
    default: {
      throw new Error(`Unable to process expression: ${expression.type}`);
    }
  }
}

const world = new World();

function run(script) {
  const stream = streamer(script);
  const tokenized = lexer(stream);
  const ast = parse(tokenized);

  evaluate(ast, world);
}

return run;

})));
