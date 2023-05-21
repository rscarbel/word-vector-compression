const convertToMatrix = require("./convertToMatrix");
const dbscan = require("./operations_using_matrices/DBSCAN/dbscan");
const { error } = require("console");

const conversationTopics = async (conversation) => {
  let message = "";
  const matrix = await convertToMatrix(conversation, true);

  if (matrix.length === 0) {
    return {
      message:
        "No words in one or both conversations. Please note, stop words are not included in the comparison.",
      error: "Not enough words.",
    };
  }

  const minPts = Math.ceil(Math.pow(matrix.length, 1 / 5) + 1);

  const dbscanResult = await dbscan(matrix, 1.5, minPts, true);
  const clusters = dbscanResult.clusters || [];
  const noise = dbscanResult.noise || [];

  console.log("dbscanResult:", dbscanResult);

  message += `<br>${clusters.length} topics in conversation.`;
  message += `<br>Topics in conversation: ${clusters}.`;
  message += `<br>Noise in conversation: ${noise.join(", ")}.`;

  if (error) console.error("Error in conversationTopics:", error);

  return {
    message,
    error: null,
  };
};

module.exports = conversationTopics;
