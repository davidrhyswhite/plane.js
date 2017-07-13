
export function isPunc(input, character) {
  const token = input.peek();
  if (token && token.type === 'punc' && (!character || token.value === character)) {
    return token;
  }
  return false;
}

export function isKeyword(input, keyword) {
  const token = input.peek();
  if (token && token.type === 'keyword' && (!keyword || token.value === keyword)) {
    return token;
  }
  return false;
}

export function isOperator(input, operator) {
  const token = input.peek();
  if (token && token.type === 'op' && (!operator || token.value === operator)) {
    return token;
  }
  return false;
}

export function skipPunc(input, character) {
  if (isPunc(input, character)) {
    input.next();
  } else {
    input.fail(`Expecting punctuation: ${character}`);
  }
}

export function skipKeyword(input, keyword) {
  if (isKeyword(input, keyword)) {
    input.next();
  } else {
    input.fail(`Expecting keyword: "${keyword}"`);
  }
}

export function skipOperator(input, operator) {
  if (isOperator(input, operator)) {
    input.next();
  } else {
    input.fail(`Expecting operator: "${operator}"`);
  }
}

export function unexpected(input) {
  input.fail(`Unexpected token: ${JSON.stringify(input.peek())}`);
}
