const euclideanDistance = require("../euclideanDistance");

const directedHausdorffDistance = (setA, setB) => {
  let maxDistance = -Infinity;

  setA.forEach((pointA) => {
    let minDistance = Infinity;

    setB.forEach((pointB) => {
      let distance = euclideanDistance(pointA, pointB);
      minDistance = Math.min(minDistance, distance);
    });

    maxDistance = Math.max(maxDistance, minDistance);
  });

  return maxDistance;
};

module.exports = directedHausdorffDistance;
