const matrixWithWords = require("./matrixWithWords");
const calculateMeanPosition = require("./operations_using_matrices/calculateMeanPosition");
const vectorCosineSimilarity = require("./operations_using_matrices/vectorCosineSimilarity");
const euclideanDistance = require("./operations_using_matrices/euclideanDistance");
const hausdorffDistance = require("./operations_using_matrices/hausdorffDistance");
const { error } = require("console");

const compareTwoConversations = async (conversation1, conversation2) => {
  let message = "";

  const processedCoversation1 = await matrixWithWords(conversation1);
  const processedCoversation2 = await matrixWithWords(conversation2);

  if (
    processedCoversation1.length === 0 ||
    processedCoversation2.length === 0
  ) {
    return {
      matrixMean1: null,
      matrixMean2: null,
      distance: "N/A",
      cosineSimilarity: "N/A",
      error:
        "No words in one or both conversations. Please note, stop words are not included in the comparison.",
    };
  }
  const matrix1 = processedCoversation1.map((row) => row.matrixPoint);
  const matrix2 = processedCoversation2.map((row) => row.matrixPoint);
  const matrixMean1 = calculateMeanPosition(matrix1);
  const matrixMean2 = calculateMeanPosition(matrix2);
  const hausdorff = hausdorffDistance(matrix1, matrix2);

  let cosineSimilarity = 1;
  let distance = 0;

  if (hausdorff[0] === "a=b" && hausdorff[1] === 0) {
    message = "The conversations are identical.";
  } else if (hausdorff[0] === "a>b" && hausdorff[1] === 0) {
    message = "Conversation 2 is a subset of conversation 1.";
  } else if (hausdorff[0] === "b<a" && hausdorff[1] === 0) {
    message = "Conversation 1 is a subset of conversation 2.";
  } else {
    cosineSimilarity = vectorCosineSimilarity(matrixMean1, matrixMean2);
    distance = euclideanDistance(matrixMean1, matrixMean2);
  }

  console.log("hausdorff:", hausdorff);

  if (error) console.error("Error in compareTwoConversations:", error);

  return {
    matrixMean1,
    matrixMean2,
    cosineSimilarity,
    distance,
    message,
    error: null,
  };
};

module.exports = compareTwoConversations;
