const pointsEqual = (point1, point2) => {
  for (let i = 0; i < point1.length; i++) {
    if (point1[i] !== point2[i]) {
      return false;
    }
  }
  return true;
};

module.exports = pointsEqual;
