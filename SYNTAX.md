# ✈ Plane.js syntax

### Assignments

All assignments are final in plane.js, there is no concept of variables, only constants hence the ability to drop any `var`, `let` or `const` statements. Once `Object` and `Array`s are introduced they will be frozen upon creation.

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
