const convertToMatrix = require("./convertToMatrix");
const calculateMeanPosition = require("./operations_using_matrices/calculateMeanPosition");
const vectorCosineSimilarity = require("./operations_using_matrices/vectorCosineSimilarity");
const euclideanDistance = require("./operations_using_matrices/euclideanDistance");

const compareTwoConversations = async (conversation1, conversation2) => {
  const matrix1 = await convertToMatrix(conversation1);
  const matrix2 = await convertToMatrix(conversation2);

  if (matrix1.length === 0 || matrix2.length === 0) {
    return {
      matrixMean1: null,
      matrixMean2: null,
      distance: "N/A",
      cosineSimilarity: "N/A",
      error:
        "No words in one or both conversations. Please note, stop words are not included in the comparison.",
    };
  }
  const matrixMean1 = calculateMeanPosition(matrix1);
  const matrixMean2 = calculateMeanPosition(matrix2);
  const cosineSimilarity = vectorCosineSimilarity(matrixMean1, matrixMean2);
  const distance = euclideanDistance(matrixMean1, matrixMean2);

  return {
    matrixMean1,
    matrixMean2,
    cosineSimilarity,
    distance,
    error: null,
  };
};

module.exports = compareTwoConversations;
