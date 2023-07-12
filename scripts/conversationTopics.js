const convertToMatrixByWords = require("./convertToMatrixByWords");
const DBSCAN = require("./operations_using_matrices/DBSCAN/DBSCAN");
const getNearestNeighbor = require("./database_interactions/getNearestNeighbor");
const calculateMeanPosition = require("./operations_using_matrices/calculateMeanPosition");
const { error } = require("console");

const conversationTopics = async (conversation) => {
  let message = "";
  const matrix = await convertToMatrixByWords(conversation, true);

  if (matrix.length === 0) {
    return {
      message:
        "No words in one or both conversations. Please note, stop words are not included in the comparison.",
      error: "Not enough words.",
    };
  }

  const minPts = Math.ceil(matrix.length * 0.012) + 1;
  const epsilon = 4;

  const dbscanResult = await DBSCAN(matrix, epsilon, minPts);
  const clusters = dbscanResult.clusters || [];
  const noise = dbscanResult.noise || [];
  const clusterWords = dbscanResult.clusterWords || [];

  const clustersWithMultipleNodes = clusters.filter(
    (cluster) => cluster.length > 1
  );

  const topicWords = await Promise.all(
    clustersWithMultipleNodes.map(async (cluster) => {
      const location = calculateMeanPosition(cluster);
      const nearestNeighbor = await getNearestNeighbor(location);
      return nearestNeighbor.word;
    })
  );

  message += `DBSCAN with epsilon = ${epsilon} and minPts = ${minPts}.`;
  message += `<br>${clusters.length} topics in conversation.<br>`;
  if (topicWords.length) {
    message += `<br><strong>Primary Concept(s):</strong><br>${topicWords.join(
      ", "
    )}`;
  }
  message += `<br><strong>Primary Words:</strong><br>${clusterWords.join(
    ", "
  )}.<br>--------------------------<br>`;
  message += `<br><strong>Noise:</strong><br>${noise.join(", ")}.`;

  if (error) console.error("Error in conversationTopics:", error);

  return {
    message,
    error: null,
  };
};

module.exports = conversationTopics;
