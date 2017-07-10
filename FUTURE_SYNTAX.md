# ✈ Plane.js syntax

Below are a list of the future proposed syntax for plane.js.

### Native Object and Array's

Currently there is no support for `Object` and `Array` shorthand expressions, once the object or array has been created it is unmutable, no further data or properties can be added.

```javascript
object = {
  prop: "A string property"
};
array = [1, 2, 3];
```

The preceding would be compiled into the following ES6 code:

```javascript
const object = Object.freeze({
  prop: "A string property"
});
const array = Object.freeze([1, 2, 3]);
```

Frozen objects and arrays allow us to create fully un-mutable data types within JavaScript.

### String interpolation

Template strings were a great addition in ES6, but they co course require the additional syntactic sugar of a "\`" back tick character. Plane.js will simplify this allowing interpolation within standard strings, this should negate the need to use the `+` operator to concatenate strings:

```javascript
name = "David";
greeting = "Hello ${name}";
```

### Unless conditional

Plane.js proposes an `unless` statement, this can make for very readable code when the conditional condition follows the expression. Look at the following ES6 code, which should be easily transpilable from an `unless` statement.

```javascript
const number = 10;
const numberIsTen = (number == 10);
if (!numberIsTen) {
  someCode();
};
```

We could write this slightly more elegantly using the `unless` statement:

```javascript
number = 10;
numberIsTen = (number == 10);
unless (numberIsTen) {
  someCode();
};
```

Or reverse the conditional condition and expression, which gives the reader the chance to say 'run someCode unless the numberIsTen', without the need to negate the boolean:

```javascript
{
  someCode();
} unless (numberIsTen);
```

Or take it a step further with a single line, where unless really shines:

```javascript
someCode() unless (numberIsTen);
```

### Functions

The hope of plane.js is to remove many of the JavaScript keywords and instead provide simple, structures to create object, arrays and functions. This means removing the current `fn: Function` keyword in favour of a `(){}` data type.

Many times in JavaScript we like to return a partially applied inner closure, more common within functional programming, plane.js proposes that all function expressions return the last value within that expression, but also proposes a new `()()` closure syntax. Given the following compile JS, it would be good to rewrite that as:

```javascript
const negate = function (func) {
  return function (x) {
    return !func(x);
  };
};
```

Since `(){}` denotes a function declaration, we can safely assume that we will assign a constant named negate a function that takes a single argument to match the preceding JavaScript.

```javascript
negate (func) {
  (x) {
    !func(x);
  };
};
```

We can take this syntax a step further and safely assume `()(){}` is a function that returns another function allowing us to write:

```javascript
negate (func)(x) {
  !func(x);
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
