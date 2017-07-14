import World from '../src/world/index';

function clearWorlds() {
  global.plane = {
    worlds: []
  };
}

export default class TestWorld extends World {
  constructor(parent, rootWorld) {
    super(parent);
    if (rootWorld === true) {
      clearWorlds();
    }
    global.plane.worlds.push(this);
  }
  extend() {
    return new TestWorld(this);
  }
}
