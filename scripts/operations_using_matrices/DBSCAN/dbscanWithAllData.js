const rangeQuery = require("./rangeQuery");
const expandClusterWithCounts = require("./expandClusterWithCounts");

const MINIMUM_COUNT = 1;

// the node structure is an array of objects like this: [{ word: string, matrixPoints: [float], count: integer }]
const dbscanWithAllData = (nodes, eps, minPts) => {
  const values = [];
  const clusters = [];
  const visited = new Set();
  const noise = new Set();

  for (let i = 0; i < nodes.length; i++) {
    values.push(nodes[i].matrixPoint);
  }

  for (let pointId = 0; pointId < values.length; pointId++) {
    if (visited.has(pointId)) {
      continue;
    }
    visited.add(pointId);

    const neighbors = rangeQuery(values, pointId, eps);

    if (neighbors.length + nodes[pointId].count - MINIMUM_COUNT < minPts) {
      noise.add(pointId);
    } else {
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
    }
  }

  const flattenedClusterWords = [];
  const clusterWords = [];
  const clusterLocations = [];

  for (let i = 0; i < clusters.length; i++) {
    words = [];
    locations = [];
    const cluster = clusters[i];
    for (let j = 0; j < cluster.length; j++) {
      word = cluster[j].word;
      words.push(word);
      flattenedClusterWords.push(word);
      locations.push(cluster[j].matrixPoint);
    }
    clusterWords.push(words);
    clusterLocations.push(locations);
  }

  return {
    flattenedClusterWords,
    clusterWords,
    clusterLocations,
  };
};

module.exports = dbscanWithAllData;
