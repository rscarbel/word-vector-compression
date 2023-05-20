const rangeQuery = require("./rangeQuery");
const expandCluster = require("./expandCluster");

const dbscan = (data, eps, minPts) => {
  let clusters = [];
  let visited = new Set();
  let noise = new Set();

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
      expandCluster(data, neighbors, cluster, eps, minPts, visited, noise);
      clusters.push(cluster);
    }
  }

  // Ignore outliers/noise
  return clusters;
};

module.exports = dbscan;
