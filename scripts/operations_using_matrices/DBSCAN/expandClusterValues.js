const rangeQueryValues = require("./rangeQueryValues");
const arePointsEqual = require("./arePointsEqual");

const expandClusterValues = (
  data,
  neighbors,
  cluster,
  eps,
  minPts,
  visited
) => {
  cluster.add(data[neighbors[0]]);
  for (let i = 1; i < neighbors.length; i++) {
    let pointId2 = neighbors[i];
    if (!visited.has(pointId2)) {
      visited.add(pointId2);
      let neighbors2 = rangeQueryValues(data, pointId2, eps);
      if (neighbors2.length >= minPts) {
        neighbors.push(...neighbors2.filter((n) => !visited.has(n)));
      }
    }
    if (
      !Array.from(cluster).find((clustPoint) =>
        arePointsEqual(clustPoint, data[pointId2])
      )
    ) {
      cluster.add(data[pointId2]);
    }
  }
};

module.exports = expandClusterValues;
