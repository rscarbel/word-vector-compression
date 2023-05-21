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

  const minPts = Math.ceil(Math.pow(matrix.length, 1 / 3));

  const dbscanResult = await dbscan(matrix, 1.5, minPts, true);
  const clusters = dbscanResult.clusters || [];
  const noise = dbscanResult.noise || [];

  message += `DBSCAN with epsilon = 1.5 and minPts = ${minPts}.`;
  message += `<br>${clusters.length} topics in conversation.<br>`;
  message += `<br>Topics in conversation: ${clusters.join(
    ", "
  )}.<br>--------------------------<br>`;
  message += `<br>Noise in conversation: ${noise.join(", ")}.`;

  if (error) console.error("Error in conversationTopics:", error);

  return {
    message,
    error: null,
  };
};

module.exports = conversationTopics;
