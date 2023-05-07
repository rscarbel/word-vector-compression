const directedHausdorffDistance = require("./directedHausdorffDistance");

const hausdorffDistance = (setA, setB) => {
  return Math.max(
    directedHausdorffDistance(setA, setB),
    directedHausdorffDistance(setB, setA)
  );
};

module.exports = hausdorffDistance;
