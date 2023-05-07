const calculateMeanPosition = (vectorMatrix) => {
  if (vectorMatrix.length === 0) {
    throw new Error("Invalid input. Expected a non-empty array.");
  }

  const dimensionSize = vectorMatrix[0].length;

  const numPoints = vectorMatrix.length;
  const meanPosition = new Array(dimensionSize).fill(0);

  for (let i = 0; i < numPoints; i++) {
    const point = vectorMatrix[i];

    if (point.length !== dimensionSize) {
      throw new Error(
        `Invalid input. Expected ${dimensionSize}-dimensional points.`
      );
    }

    for (let j = 0; j < dimensionSize; j++) {
      meanPosition[j] += point[j];
    }
  }

  for (let j = 0; j < dimensionSize; j++) {
    meanPosition[j] /= numPoints;
  }

  return meanPosition;
};

module.exports = calculateMeanPosition;
