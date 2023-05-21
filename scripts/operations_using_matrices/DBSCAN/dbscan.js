const rangeQuery = require("./rangeQuery");
const expandCluster = require("./expandCluster");

const dbscan = (nodes, eps, minPts) => {
  // nodes is an array of arrays, where each array is a point and the last element is the word, e.g. [[1, 2, 3, "hello"], [4, 5, 6, "world"]]
  const data = nodes.map((node) => node.slice(0, node.length - 1));
  let clusters = [];
  let wordClusters = [];
  let visited = new Set();
  let noise = new Set();
  // creating a map for fast lookup
  let dataMap = new Map(data.map((value, index) => [value, index]));

  for (let pointId = 0; pointId < data.length; pointId++) {
    if (visited.has(pointId)) {
      continue;
    }
    visited.add(pointId);

    let neighbors = rangeQuery(data, pointId, eps);
    if (neighbors.length < minPts) {
      noise.add(pointId);
    } else {
      let cluster = [];
      let clusterIds = [];
      expandCluster(data, neighbors, cluster, eps, minPts, visited, noise);

      for (let i = 0; i < cluster.length; i++) {
        let pointId2 = dataMap.get(cluster[i]);
        if (pointId2 !== undefined) {
          clusterIds.push(pointId2);
        }
      }
      wordClusters.push(clusterIds);
      clusters.push(cluster);
    }
  }

  const noiseWords = [...noise].map(
    (noiseId) => nodes[noiseId][nodes[noiseId].length - 1]
  );

  const clusterWords = wordClusters.map((cluster) =>
    cluster.map((clusterId) => nodes[clusterId][nodes[clusterId].length - 1])
  );

  return { clusters, clusterWords, noise: noiseWords };
};


module.exports = dbscan;
