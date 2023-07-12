const rangeQuery = require("./rangeQuery");
const arePointsEqual = require("./arePointsEqual");

const MINIMUM_COUNT = 1;

/**
 *
 * @param {array} data array of nodes
 * @param {array} values array of the matrix values
 * @param {array} neighbors array of the neighbors indexes
 * @param {array} cluster array of the cluster nodes
 * @param {number} eps epsilon
 * @param {number} minPts minimum number of points
 * @param {array} visited set of visited nodes
 * @returns {void}
 * @description Expand the cluster with the neighbors of the neighbors, this mutates the cluster array
 */
const expandCluster = (
  data,
  values,
  neighbors,
  cluster,
  eps,
  minPts,
  visited
) => {
  cluster.push(data[neighbors[0]]);

  for (let i = 1; i < neighbors.length; i++) {
    let pointId2 = neighbors[i];

    if (!visited.has(pointId2)) {
      visited.add(pointId2);

      let neighbors2 = rangeQuery(values, pointId2, eps);

      if (neighbors2.length + data[pointId2].count - MINIMUM_COUNT >= minPts) {
        neighbors.push(...neighbors2.filter((n) => !visited.includes(n)));
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
