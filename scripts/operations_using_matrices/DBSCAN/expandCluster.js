const rangeQuery = require("./rangeQuery");
const arePointsEqual = require("./arePointsEqual");

const expandCluster = (data, neighbors, cluster, eps, minPts, visited) => {

  cluster.push(data[neighbors[0]]);

  for (let i = 1; i < neighbors.length; i++) {
    let pointId2 = neighbors[i];

    if (!visited.has(pointId2)) {
      visited.add(pointId2);

      let neighbors2 = rangeQuery(data, pointId2, eps);

      if (neighbors2.length >= minPts) {
        neighbors.push(...neighbors2.filter((n) => !visited.has(n)));
      }
    }

    if (
      !cluster.some((clusterPoint) =>
        arePointsEqual(clusterPoint, data[pointId2])
      )
    ) {
      cluster.push(data[pointId2]);
    }
  }
};

module.exports = expandCluster;
