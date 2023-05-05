const cosineSimilarity = (
  tokenizedConversationArray1,
  tokenizedConversationArray2
) => {
  const N = tokenizedConversationArray1.length;
  let sum = 0;
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < N; i++) {
    sum += tokenizedConversationArray1[i] * tokenizedConversationArray2[i];
    sum1 += tokenizedConversationArray1[i] ** 2;
    sum2 += tokenizedConversationArray2[i] ** 2;
  }

  return sum / (Math.sqrt(sum1) * Math.sqrt(sum2));
};

module.exports = cosineSimilarity;
