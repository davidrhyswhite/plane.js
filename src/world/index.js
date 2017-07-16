import standardLib from './standard-lib';

function checkScope(scope, name) {
  if (name in scope.constants) {
    return scope;
  }
  if (typeof scope.parent !== 'undefined') {
    return checkScope(scope.parent, name);
  }

  return false;
}

export default class World {
  constructor(parent) {
    this.constants = Object.create(null);
    this.parent = parent;
    standardLib(this);
  }

  extend() {
    const kepler = new World(this);
    return kepler;
  }

  lookup(name) {
    const scope = checkScope(this, name);
    return scope;
  }

  get(name) {
    const scope = this.lookup(name);
    if (scope !== false) {
      return scope.constants[name];
    }
    throw new Error(`Undefined constant: "${name}"`);
  }

  set(name, value) {
    if (this.constants[name]) {
      throw new Error(`Attempting to reassign constant: "${name}"`);
    }
    this.constants[name] = value;
    return this;
  }
}
