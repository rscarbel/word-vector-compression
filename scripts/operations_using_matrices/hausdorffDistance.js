const directedHausdorffDistance = require("./directedHausdorffDistance");

const hausdorffDistance = (setA, setB) => {
  const aToB = directedHausdorffDistance(setA, setB);
  const bToA = directedHausdorffDistance(setB, setA);

  if (aToB > bToA) {
    return ["a>b", bToA];
  } else if (bToA > aToB) {
    return ["b<a", aToB];
  } else {
    return ["a=b", aToB];
  }
};

module.exports = hausdorffDistance;
