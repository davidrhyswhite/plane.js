# ✈ Plane.js syntax

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
