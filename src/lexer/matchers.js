const KEYWORDS = [' ', 'if', 'then', 'else', 'fn', 'true', 'false', ' '].join(' ');


function isKeyword(x) {
  return KEYWORDS.indexOf(` ${x} `) >= 0;
}

function isDigit(character) {
  return /[0-9]/i.test(character);
}

function isIDStart(character) {
  return /[a-z]/i.test(character);
}

function isID(character) {
  return isIDStart(character) || '?!-<>=0123456789'.indexOf(character) >= 0;
}

function isOpChar(character) {
  return '+-*/%=&|<>!'.indexOf(character) >= 0;
}

function isPunc(character) {
  return ',;(){}[]'.indexOf(character) >= 0;
}

function isWhitespace(character) {
  return ' \t\n'.indexOf(character) >= 0;
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
