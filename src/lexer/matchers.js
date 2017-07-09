const {
  KEYWORDS,
  NON_STARTING_IDENTIFIERS,
  OPERATORS,
  PUNCTUATIONS,
  WHITESPACE
} = require('../constants');

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

module.exports = {
  isKeyword,
  isDigit,
  isIDStart,
  isID,
  isOpChar,
  isPunc,
  isWhitespace
};
