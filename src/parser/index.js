import { makeTopLevel } from './makers';

export default function parse(input, makeTopLevelFunc = makeTopLevel) {
  const body = makeTopLevelFunc(input, []);

  return {
    type: 'Program',
    body
  };
}
