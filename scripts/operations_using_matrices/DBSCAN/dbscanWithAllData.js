const rangeQuery = require("./rangeQuery");
const expandClusterWithCounts = require("./expandClusterWithCounts");

const MINIMUM_COUNT = 1;

// the node structure is an array of objects like this: [{ word: string, matrixPoints: [float], count: integer }]
const dbscanWithAllData = (nodes, eps, minPts) => {
  const clusters = [];
  const visited = new Set();

  const values = nodes.map((node) => node.matrixPoint);

  let flattenedClusterWords = [];
  let clusterWords = [];
  let clusterLocations = [];

  for (let pointId = 0; pointId < values.length; pointId++) {
    if (visited.has(pointId)) {
      continue;
    }
    visited.add(pointId);

    const neighbors = rangeQuery(values, pointId, eps);

    if (neighbors.length + nodes[pointId].count - MINIMUM_COUNT >= minPts) {
      const cluster = [];
      expandClusterWithCounts(
        nodes,
        values,
        neighbors,
        cluster,
        eps,
        minPts,
        visited
      );
      clusters.push(cluster);

      const words = cluster.map((item) => item.word);
      const locations = cluster.map((item) => item.matrixPoint);

      clusterWords.push(words);
      clusterLocations.push(locations);
      flattenedClusterWords = [...flattenedClusterWords, ...words];
    }
  }

  return {
    flattenedClusterWords,
    clusterWords,
    clusterLocations,
  };
};

module.exports = dbscanWithAllData;
