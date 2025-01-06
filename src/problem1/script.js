const validatePositiveInteger = (n) => {
  if (typeof n !== "number" || !Number.isInteger(n) || n <= 0) {
    throw new Error("Input must be a positive integer.");
  }
};

const sum_to_n_a = (n) => {
  validatePositiveInteger(n);

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

const sum_to_n_b = (n) => {
  validatePositiveInteger(n);

  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (sum, current) => sum + current,
    0
  );
};

const sum_to_n_c = (n) => {
  validatePositiveInteger(n);
  return (n * (n + 1)) / 2;
};

const n = 6;
console.log(
  `sum A: ${sum_to_n_a(n)} - sum B: ${sum_to_n_b(n)} - sum C: ${sum_to_n_c(n)}`
);
