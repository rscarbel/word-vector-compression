const jaccardSimilarity = (str1, str2) => {
  const str1Arr = str1.split(" ");
  const str2Arr = str2.split(" ");
  const intersection = str1Arr.filter((word) => str2Arr.includes(word));
  const union = [...str1Arr, ...str2Arr];
  return intersection.length / union.length;
};

module.exports = jaccardSimilarity;
