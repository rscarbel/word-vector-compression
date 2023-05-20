const convertToMatrix = require("./convertToMatrix");
const calculateMeanPosition = require("./operations_using_matrices/calculateMeanPosition");
const vectorCosineSimilarity = require("./operations_using_matrices/vectorCosineSimilarity");
const euclideanDistance = require("./operations_using_matrices/euclideanDistance");
const dbscan = require("./operations_using_matrices/DBSCAN/dbscan");
const hausdorffDistance = require("./operations_using_matrices/hausdorffDistance");
const { error } = require("console");

const compareTwoConversations = async (conversation1, conversation2) => {
  let message = "";
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

  const minPts = Math.ceil(Math.pow(matrix1.length, 1 / 5) + 1);
  const dbscan1 = await dbscan(matrix1, 1.5, minPts);
  message += `<br>${dbscan1.length} topics in conversation 1.`;
  const dbscan2 = await dbscan(matrix2, 1.5, minPts);
  message += `<br>${dbscan2.length} topics in conversation 2.`;

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
