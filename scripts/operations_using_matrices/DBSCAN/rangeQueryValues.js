const euclideanDistance = require("../euclideanDistance");

const rangeQueryValues = (data, pointId, eps) => {
  let neighbors = [];
  for (let i = 0; i < data.length; i++) {
    if (euclideanDistance(data[i], data[pointId]) <= eps) {
      neighbors.push(i);
    }
  }
  return neighbors;
};

module.exports = rangeQueryValues;
