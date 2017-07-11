# ✈ Plane.js

![Travis CI Build](https://travis-ci.org/davidrhyswhite/plane.js.svg?branch=master)

A simple, functional compile to JS syntax.

### TODO

##### For v1.0.0

- [ ] Block scoping;
- [ ] Pattern matching;
- [ ] `()(){}` partially applied closure syntax;
- [ ] Removing `fn` keyword for function definitions;
- [x] Unix style piping `|` for nested calls, implemented as `|>`;

##### Beyond

- [ ] Type checking;

## Installation

    npm install -g plane.js

## Usage

Once installed you will have access to the `plane` compiler on your command line:

    plane run 'negate = fn(value, func) { !func(value) };'

### REPL

Plane.js has a small REPL to test and try scripts in:

    plane repl

## Testing

### Unit

The unit tests are easily runnable with:

    npm test

### Integration

Integration test are important for any new feature added or removed to ensure compatibility and test a feature fully through to compilation and running, the can be run individually with:

    npm run test:integration

### Linting

ESLint is running across the project for a consistent style:

    npm run lint

## Why another syntax?

The intentions of plane.js are to remove many of the constructs of JavaScript and start from scratch with a smaller, cleaner more functional approach. My initial aim was to learn more about lexers and parsers and how programming languages are written in general so I can more easily contribute to the discussions around the future of ECMAScript and understand the difficulties faced (by the TC39 team) adding new constructs / ideas to such a project.

## Contributing

1. Fork it ( http://github.com/davidrhyswhite/plane.js/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT).
