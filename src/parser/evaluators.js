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

module.exports = {
  applyOperator,
  makeFunction,
  evaluate
};