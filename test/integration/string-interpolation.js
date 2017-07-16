import { expect } from 'chai';
import streamer from '../../src/streamer';
import tokenizer from '../../src/lexer/index';
import parser from '../../src/parser/index';
import World from '../../src/world/index';
import { evaluate } from '../../src/evaluators';

const run = (script, world) => {
  const stream = streamer(script);
  const tokenized = tokenizer(stream);
  const ast = parser(tokenized);

  evaluate(ast, world);

  return { stream, tokenized, ast };
};

describe('String interpolation', () => {
  it.only('interpolates like a boss!', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const script = 'name = "David";message = "Welcome ${name}!";log(message);';

    const world = new World();

    const application = run(script, world);

    const expectedAST = {
      type: 'string-template',
      expressions: [
        {
          type: 'const',
          value: 'name',
          range: [11, 15]
        }
      ],
      quasis: [
        {
          type: 'str',
          value: 'Welcome ',
          range: [0, 11]
        },
        {
          type: 'str',
          value: '!',
          range: [15, 18]
        }
      ]
    };

    const templateAST = application.ast.prog[1].right;
    console.log(JSON.stringify(templateAST, null, 2));



    expect(templateAST).to.deep.equal(expectedAST);
  });
});
