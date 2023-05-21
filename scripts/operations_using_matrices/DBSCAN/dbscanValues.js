const rangeQueryValues = require("./rangeQueryValues");
const expandClusterValues = require("./expandClusterValues");

const dbscanValues = (nodes, eps, minPts) => {
  let clusters = [];
  let visited = new Set();
  let noise = new Set();

  for (let pointId = 0; pointId < nodes.length; pointId++) {
    if (visited.has(pointId)) {
      continue;
    }
    visited.add(pointId);

    let neighbors = rangeQueryValues(nodes, pointId, eps);
    if (neighbors.length < minPts) {
      noise.add(nodes[pointId]);
    } else {
      let cluster = new Set();
      expandClusterValues(nodes, neighbors, cluster, eps, minPts, visited);
      clusters.push(Array.from(cluster)); // convert the Set to an Array here.
    }
  }

  noise = Array.from(noise); // convert the Set to an Array here.

  return { clusters, noise };
};

module.exports = dbscanValues;
