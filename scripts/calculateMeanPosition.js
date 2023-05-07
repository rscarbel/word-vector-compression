const calculateMeanPosition = (points) => {
  if (points.length === 0) {
    throw new Error("Invalid input. Expected a non-empty array.");
  }

  const dimensionSize = points[0].length;

  const numPoints = points.length;
  const meanPosition = new Array(dimensionSize).fill(0);

  for (let i = 0; i < numPoints; i++) {
    const point = points[i];

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
