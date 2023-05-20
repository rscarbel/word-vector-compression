const dfd = require("danfojs-node");
const { PCA } = require("ml-pca");

const reduceDimensionality = async (inputData) => {
  // convert the 2D array to a DataFrame
  const df = new dfd.DataFrame(inputData);

  // convert dataframe to 2D array
  const data = df.values;

  // apply PCA
  const pca = new PCA(data);

  // get the first N principal components that explain, for instance, 95% of the variance
  let explainedVariance = pca.getExplainedVariance();
  let N = 0;
  let totalVariance = 0;
  for (let variance of explainedVariance) {
    totalVariance += variance;
    N++;
    if (totalVariance >= 0.95) {
      break;
    }
  }

  // get the reduced data
  const reducedData = pca.predict(data, { nComponents: N });

  return reducedData;
};

module.exports = reduceDimensionality;
