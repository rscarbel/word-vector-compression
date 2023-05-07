const euclideanDistance = (pointA, pointB) => {
  let sum = 0;
  for (let i = 0; i < pointA.length; i++) {
    sum += Math.pow(pointA[i] - pointB[i], 2);
  }
  return Math.sqrt(sum);
};

module.exports = euclideanDistance;
