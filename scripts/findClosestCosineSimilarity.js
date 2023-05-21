const convertToMatrixByWords = require("./convertToMatrixByWords");
const calculateMeanPosition = require("./operations_using_matrices/calculateMeanPosition");
const vectorCosineSimilarity = require("./operations_using_matrices/vectorCosineSimilarity");

const findClosestCosineSimilarity = async (
  primaryConversation,
  conversations
) => {
  const primaryMatrix = await convertToMatrixByWords(primaryConversation);

  if (primaryMatrix.length === 0) {
    return {
      closestConversation: null,
      closestCosineSimilarity: "N/A",
      error:
        "No words in primary conversation. Please note, stop words are not included in the comparison.",
    };
  }
  const primaryMean = calculateMeanPosition(primaryMatrix);

  let closestCosineSimilarity = -Infinity;
  let closestConversation = null;

  for (let i = 0; i < conversations.length; i++) {
    const conversation = conversations[i];
    const matrix = await convertToMatrixByWords(conversation);
    if (matrix.length === 0) {
      continue;
    }
    const mean = calculateMeanPosition(matrix);
    const cosineSimilarity = vectorCosineSimilarity(primaryMean, mean);

    if (cosineSimilarity > closestCosineSimilarity) {
      closestCosineSimilarity = cosineSimilarity;
      closestConversation = conversation;
    }
  }

  return {
    closestConversation,
    closestCosineSimilarity,
    error: null,
  };
};

module.exports = findClosestCosineSimilarity;
