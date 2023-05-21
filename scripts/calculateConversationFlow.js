const convertToMatrixBySentences = require("./convertToMatrixBySentences");
const dbscanValues = require("./operations_using_matrices/DBSCAN/dbscanValues");
const getNearestNeighbor = require("./database_interactions/getNearestNeighbor");
const euclideanDistance = require("./operations_using_matrices/euclideanDistance");
const calculateMeanPosition = require("./operations_using_matrices/calculateMeanPosition");
const { error } = require("console");

const MINIMUM_DISTANCE = 3;

const calculateConversationFlow = async (conversation) => {
  const topics = [];
  const matrix = await convertToMatrixBySentences(conversation);

  if (matrix.length === 0) {
    return {
      message:
        "No words in one or both conversations. Please note, stop words are not included in the comparison.",
      error: "Not enough words.",
    };
  }

  const meanPositions = matrix.map((sentence) => {
    return calculateMeanPosition(sentence);
  });

  let clusters = [];
  let noise = [];

  const meanPositionsLimit = meanPositions.length;

  if (meanPositionsLimit > 0) {
    // Initialize the first cluster with the first point
    clusters.push([0]);

    for (let i = 1; i < meanPositionsLimit; i++) {
      const position = meanPositions[i];

      // Check if the current point is within MINIMUM_DISTANCE to any point in the latest cluster
      let inCluster = clusters[clusters.length - 1].some((index) => {
        const clusterPoint = meanPositions[index];
        return euclideanDistance(clusterPoint, position) < MINIMUM_DISTANCE;
      });

      if (inCluster) {
        // If so, add the current point to the current cluster
        clusters[clusters.length - 1].push(i);
      } else {
        // If not, start a new cluster with the current point
        clusters.push([i]);
        // And add the previous point to the noise list (if it is not already part of a larger cluster)
        if (clusters[clusters.length - 2].length === 1) {
          noise.push(clusters[clusters.length - 2][0]);
          clusters = clusters
            .slice(0, -2)
            .concat([
              clusters[clusters.length - 2].concat(
                clusters[clusters.length - 1]
              ),
            ]);
        }
      }
    }
  }

  const minPts = Math.ceil(matrix.length * 0.01) + 1;
  const epsilon = 4;

  for (let i = 0; i < clusters.length; i++) {
    const dbscanResult = await dbscanValues(clusters[i], epsilon, minPts);
    const subClusters = dbscanResult.clusters || [];
    const longestSubCluster = subClusters.reduce((a, b) => {
      return a.length > b.length ? a : b;
    }, []);
    const subClusterPoints = longestSubCluster.map((index) => {
      return meanPositions[index];
    });
    const location = calculateMeanPosition(subClusterPoints);
    const nearestNeighbor = await getNearestNeighbor(location);
    topics.push(nearestNeighbor.word);
  }

  const message = `Topics:<br>${topics.join(" => ")}`;

  return {
    message,
    error: null,
  };
};

module.exports = calculateConversationFlow;
