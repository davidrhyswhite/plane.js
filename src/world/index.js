import standardLib from './standard-lib';

function checkScope(scope, name) {
  if (Object.prototype.hasOwnProperty.call(scope.constants, name)) {
    return scope;
  }
  if (typeof scope.parent !== 'undefined') {
    return checkScope(scope.parent, name);
  }

  return false;
}

export default class World {
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
