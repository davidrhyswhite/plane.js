module.exports = function standardLib(world) {
  // eslint-disable-next-line no-console
  world.def('log', val => console.log(val));
};
