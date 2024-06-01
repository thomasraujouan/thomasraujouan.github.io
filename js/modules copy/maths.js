const padicValuation = function (n, p) {
  let valuation = 0;
  while (n % p === 0) {
    n /= p;
    valuation++;
  }
  return valuation;
};

export { padicValuation };
