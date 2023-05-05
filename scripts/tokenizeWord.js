const tokenizeWord = (str) => {
  if (!str) return 0;
  const constant = 4;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += Math.floor(
      constant *
        (i + 1) ** 1.3 *
        str.charCodeAt(i) ** (1 + 1 / (i + 1)) *
        (str.charCodeAt(i) + Math.log(i + 2)) *
        Math.log((i + 2) ** 1.5) ** (1 + Math.log(1 / (i + 2)))
    );
  }
  return hash;
};

module.exports = tokenizeWord;
