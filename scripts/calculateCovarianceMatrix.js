const calculateCovarianceMatrix = (points, meanPosition) => {
  const numPoints = points.length;
  const numDimensions = points[0].length;
  const covarianceMatrix = new Array(numDimensions);

  for (let i = 0; i < numDimensions; i++) {
    covarianceMatrix[i] = new Array(numDimensions).fill(0);
  }

  for (let i = 0; i < numPoints; i++) {
    const deviationVector = points[i].map(
      (value, index) => value - meanPosition[index]
    );

    for (let j = 0; j < numDimensions; j++) {
      for (let k = 0; k < numDimensions; k++) {
        covarianceMatrix[j][k] += deviationVector[j] * deviationVector[k];
      }
    }
  }

  for (let i = 0; i < numDimensions; i++) {
    for (let j = 0; j < numDimensions; j++) {
      covarianceMatrix[i][j] /= numPoints;
    }
  }

  return covarianceMatrix;
};

module.exports = calculateCovarianceMatrix;
