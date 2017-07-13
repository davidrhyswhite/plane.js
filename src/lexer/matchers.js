import {
  KEYWORDS,
  NON_STARTING_IDENTIFIERS,
  OPERATORS,
  PUNCTUATIONS,
  WHITESPACE
} from '../constants';

export function isKeyword(x) {
  const keywords = ` ${KEYWORDS.join(' ')} `;
  return keywords.indexOf(` ${x} `) >= 0;
}

export function isDigit(character) {
  return /[0-9]/i.test(character);
}

export function isIDStart(character) {
  return /[a-z]/i.test(character);
}

export function isID(character) {
  return isIDStart(character) || NON_STARTING_IDENTIFIERS.join('').indexOf(character) >= 0;
}

export function isOpChar(character) {
  return OPERATORS.join('').indexOf(character) >= 0;
}

export function isPunc(character) {
  return PUNCTUATIONS.join('').indexOf(character) >= 0;
}

export function isWhitespace(character) {
  return WHITESPACE.join('').indexOf(character) >= 0;
}
