const KEYWORDS = ['if', 'else', 'fn', 'true', 'false'];
const OPERATORS = ['+', '-', '*', '/', '%', '=', '&', '|', '<', '>', '!'];
const PUNCTUATIONS = ['', ',', ';', '(', ')', '{', '}', '[', ']', ''];
const WHITESPACE = [' ', '\t', '\n'];
const IDENTIFIERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const NON_STARTING_IDENTIFIERS = ['?', '!', '-', '<', '>', '=', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

module.exports = {
  KEYWORDS,
  OPERATORS,
  PUNCTUATIONS,
  WHITESPACE,
  IDENTIFIERS,
  NON_STARTING_IDENTIFIERS
};
