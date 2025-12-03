<h1> 1. Difference between var, let, and const </h1>

var is the old way of creating variables. It can behave unpredictably because it does not follow block limits.

let is the modern way. It stays inside the block where it is created and its value can change.

const is also block-scoped, but its value cannot change after it is set.

<h1> 2. Difference between map, forEach, and filter </h1>

forEach runs a function on each item but does not return a new array.

map creates a new array by transforming each item.

filter creates a new array containing only the items that pass a condition.

<h1>3. What are arrow functions in ES6</h1>

Arrow functions are a shorter and cleaner way to write functions. They work like normal functions but use simpler syntax.
Example : const add = (a, b) => a + b

<h1>4. How destructuring works in ES6</h1>

Destructuring lets you quickly extract values from arrays or objects into separate variables. It reduces extra code and makes assignments shorter.
Example: const { name, age } = { name: "John", age: 25 }

<h1>5. Template literals in ES6</h1>

Template literals allow you to create strings more easily. You can insert variables directly and write multi-line text. They are cleaner than the old plus-sign string joining method.
Example: const msg = `Hello ${name}!`;

