import { makeTopLevel } from './makers';

export default function parse(input, makeTopLevelFunc = makeTopLevel) {
  const prog = makeTopLevelFunc(input, []);

  return {
    type: 'prog',
    prog
  };
}
