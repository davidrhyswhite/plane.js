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
  it('interpolates a single constant into the string', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const script = 'name = "David";message = "Welcome ${name}!";log(message);';
    const world = new World();
    const application = run(script, world);

    const expectedAST = {
      type: 'string-template',
      expressions: [
        {
          type: 'const',
          value: 'name'
        }
      ],
      quasis: [
        {
          type: 'str',
          value: 'Welcome '
        },
        {
          type: 'str',
          value: '!'
        }
      ]
    };

    const templateAST = application.ast.prog[1].right;
    expect(templateAST).to.deep.equal(expectedAST);
  });

  it('interpolates a multiple constants into the string', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const script = 'name = "David";nickname = "Davey";message = "Welcome ${name}! How is ${nickname} today?";log(message);';
    const world = new World();
    const application = run(script, world);

    const expectedAST = {
      type: 'string-template',
      expressions: [
        {
          type: 'const',
          value: 'name'
        },
        {
          type: 'const',
          value: 'nickname'
        }
      ],
      quasis: [
        {
          type: 'str',
          value: 'Welcome '
        },
        {
          type: 'str',
          value: '! How is '
        },
        {
          type: 'str',
          value: ' today?'
        }
      ]
    };

    const templateAST = application.ast.prog[2].right;
    expect(templateAST).to.deep.equal(expectedAST);
  });
  it('interpolates expressions into the string');
  it('interpolates calls into the string');
});
