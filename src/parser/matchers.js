
function isPunc(input, character) {
  const token = input.peek();
  if (token && token.type === 'punc' && (!character || token.value === character)) {
    return token;
  }
  return false;
}

function isKeyword(input, keyword) {
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
  if (isPunc(input, character)) {
    input.next();
  } else {
    input.fail(`Expecting punctuation: ${character}`);
  }
}

function skipKeyword(input, keyword) {
  if (isKeyword(input, keyword)) {
    input.next();
  } else {
    input.fail(`Expecting keyword: "${keyword}"`);
  }
}

function skipOperator(input, operator) {
  if (isOperator(input, operator)) {
    input.next();
  } else {
    input.fail(`Expecting operator: "${operator}"`);
  }
}

function unexpected(input) {
  input.fail(`Unexpected token: ${JSON.stringify(input.peek())}`);
}

module.exports = {
  isPunc,
  isKeyword,
  isOperator,
  skipPunc,
  skipKeyword,
  skipOperator,
  unexpected
};
