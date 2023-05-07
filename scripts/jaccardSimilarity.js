const jaccardSimilarity = (str1, str2) => {
  const str1Arr = new Set(str1.split(" "));
  const str2Arr = new Set(str2.split(" "));
  const intersection = [...str1Arr].filter((word) => str2Arr.has(word));
  const union = new Set([...str1Arr, ...str2Arr]);
  return intersection.length / union.size;
};

module.exports = jaccardSimilarity;
