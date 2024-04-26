var sum_to_n_a = function (n) {
  if (!Number.isInteger(n)) throw Error(`Please input the integer value`);

  let sum = 0;
  for (var i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

var sum_to_n_b = function (n) {
  if (!Number.isInteger(n)) throw Error(`Please input the integer value`);

  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (prev, curr) => prev + curr,
    0
  );
};

var sum_to_n_c = function (n) {
  if (!Number.isInteger(n)) throw Error(`Please input the integer value`);

  return (n * (n + 1)) / 2;
};

const sumA = sum_to_n_a(6);
const sumB = sum_to_n_b(6);
const sumC = sum_to_n_c(6);
console.log(`sum A: ${sumA} - sum B: ${sumB} - sum C: ${sumC}`);
