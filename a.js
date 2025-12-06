function sum({ a, b }) {
  return a + b;
}

const x = await sum({ a: 1, b: 2 });
console.log("--", x);
