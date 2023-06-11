const euclideanDistance = require("../euclideanDistance");

/**
 *
 * @param {array} data
 * @param {number} pointId
 * @param {number} eps
 * @returns {array} neighbors indexes
 * @example
 * rangeQuery(data,57,4); // => [0, 1]
 *
 */
const rangeQuery = (data, pointId, eps) => {
  let neighbors = [];
  for (let i = 0; i < data.length; i++) {
    if (euclideanDistance(data[i], data[pointId]) <= eps) {
      neighbors.push(i);
    }
  }
  return neighbors;
};

module.exports = rangeQuery;
