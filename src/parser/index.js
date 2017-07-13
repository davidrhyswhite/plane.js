import { makeTopLevel } from './makers';

export default function parse(input) {
  const prog = makeTopLevel(input, []);

  return {
    type: 'prog',
    prog
  };
}
