import streamer from './streamer';
import tokenizer from './lexer/index';
import parser from './parser/index';
import World from './world/index';
import { evaluate } from './evaluators';

const world = new World();

export default function run(script) {
  const stream = streamer(script);
  const tokenized = tokenizer(stream);
  const ast = parser(tokenized);

  evaluate(ast, world);
}
