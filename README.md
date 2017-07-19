# ✈ Plane.js

![Travis CI Build](https://travis-ci.org/davidrhyswhite/plane.js.svg?branch=master)

A simple, functional, compiles to JavaScript syntax.

### Overview

Plane.js uses only a small number of keywords from JavaScript, namely `if`, `else`, `true` and `false`, strings are represented with a double quote `"` only and numbers work as expected. It's introduced the `fn` keyword for function definitions but this will be removed soon in favour of matching functions based on their `(){}` signature.

### TODO

##### For v1.0.0

- [x] Block scoping;
- [ ] `()(){}` partially applied closure syntax;
- [ ] Removing `fn` keyword for function definitions;
- [x] Unix style piping `|` for nested calls, implemented as `|>`;
- [x] String interpolation;
- [ ] Ability to use the (.) operator;
- [ ] Update parser to produce a valid [ESTree Spec](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)

##### Beyond

- [ ] `import`, `export` syntax;
- [ ] Pattern matching;
- [ ] Array literals using the `[];` declaration;
- [ ] Object literals using the `{};` declaration;
- [ ] `as` keyword for ` import * as named`;
- [ ] `Object` and `Array` left assignment destructuring;
- [ ] Enhanced destructuring with the unary rest operator `...`;
- [ ] Last expression explicitly returned by default from functions;
- [ ] Type checking;

## Installation

    npm install -g plane.js

Plain.js exports two versions, the `dist/plain.js` which

## Usage

Once installed you will have access to the `plane` CLI:

    plane run 'negate = fn(value, func) { !func(value) };'

### Node.js / AMD

The Node.js or AMD version is built into the `dist/plain.js`, this exports a single function, when you require this file in with either Node.js or an AMD based environment. Since this is compiled in a UMD format it "should" work as a script within the browser giving you a `plane` function attached to the window object.

* Note you will still need a modern browser with this option as there is no additional transpiling happening.

### Modern browsers

If you're running a modern browser then it makes sense to use the `dist/plain.es.js` version, similarly this exports a single function to pass your script in to be interpreted and run.

Both the `plain.js` and `plain.es.js` versions are distributed with minified

### REPL

Plane.js has a small REPL to test and try scripts in:

    plane repl

The REPL is a very, very simple extension to the Node.js `node` environment, so you can still use the handy `.exit`, `.editor`, `.clear`, `.save` and `.load` commands. A

## Syntax

### Assignments

All assignments are final in plane.js, there is no concept of variables, only constants hence the ability to drop any `var`, `let` or `const` statements. Once `Object` and `Array`s are introduced they will be frozen upon creation.

Strings in plane.js are simply declared with only the `"` double quote syntax, this was chosen over a `'` single quote as it aligns more closely with the JSON specification.

```javascript
numbers = 42;
booleans = true;
strings = "Strings are only double quoted, no single quotes.";
```

The preceding would be compiled into the following ES6 code:

```javascript
const numbers = 42;
const booleans = true;
const strings = "Strings are only double quoted, no single quotes.";
```

### Operators

The following operators work almost the same as their JavaScript counterparts, with the exception that they only work on values of type `Number`. This means you're unable to concatenate two strings together using the `+` addition operator. Instead with strings you can use interpolation, see below.

| Plane.js      | Type           |
| ------------- | -------------- |
| +             | Assignment     |
| -             | Subtraction    |
| *             | Multiplication |
| /             | Division       |
| **            | Exponential    |

### Strings

Strings in Plane.js can only be created with double quotes, single quotes `'` and back-ticks \` are not supported and will cause a syntax error.

```javascript
name = "David";
nickname = "Dave";
log("Hi ${name}, may I call you ${nickname}?");
```

### Conditionals

In the following example the equality operator `==` will be compiled to `===`.

##### Equality operators

Plane.js has less equality operators that JavaScript, opting for the strict equality of `===` and `!==`.

| Plane.js      | JavaScript    |
| ------------- | ------------- |
| <             | <             |
| >             | >             |
| <=            | <=            |
| >=            | >=            |
| ==            | ===           |
| !=            | !==           |

```javascript
number = 10;
if (number == 10) {
  log("Number is 10!");
} else {
  log("Number is not 10... ¯\_(ツ)_/¯");
};
```

### Functions

Plane.js has no formal function declaration such as `function cube(x) {}` that we have in JavaScript, instead a function is assigned to a constant.

```javascript
cube = fn(x) {
  x * x * x
};
```

The preceding would be compiled to the following ES6 code:

```javascript
const cube = function (x) {
  return x * x * x;
};
```

### Piping

Piping is useful when composing many small functions with and input -> output, leaving a readable chain where your source code processes in the same order as your code, take the following JavaScript assignment expression:

```javascript
const myNumber = Math.round(Math.sqrt(Math.PI));
```

If we read this as our code is written it would be 'call math round then call math square then pass in PI', which is not the order of execution which would be more like 'Take PI, call math square then round that'. Unix has long provided a piping mechanism to achieve that and the newer Elixir programming language provides the `|>` pipe right operator which is very readable.

Plain.js hopes to allow you to write the preceding example as:

```javascript
myNumber = Math.PI |> Math.sqrt |> Math.round;
```

## Testing

### Unit

The unit tests are easily runnable with:

    npm test

### Linting

ESLint is running across the project for a consistent style:

    npm run lint

## Why...

### Another syntax?

The intentions of plane.js are to remove many of the constructs of JavaScript and start from scratch with a smaller, cleaner more functional approach. My initial aim was to learn more about lexers and parsers and how programming languages are written in general so I can more easily contribute to the discussions around the future of ECMAScript and understand the difficulties faced (by the TC39 team) adding new constructs / ideas to such a project.

### Plane?

Well the NPM registry is pretty full of decent names these days and I wanted a name signifying that it's a plain / simple almost like syntactically version of JavaScript. As plain.js was taken, I opted for the homonym version of that word.

## Contributing

1. Fork it ( http://github.com/davidrhyswhite/plane.js/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT).
