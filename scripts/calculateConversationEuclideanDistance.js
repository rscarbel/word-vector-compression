const calculateMeanPosition = require("./calculateMeanPosition");
const getVectorSpaceMatrix = require("./getVectorSpaceMatrix");

const calculateConversationEuclideanDistance = async (
  conversation1,
  conversation2
) => {
  try {
    const matrix1 = await getVectorSpaceMatrix(conversation1);
    const matrix2 = await getVectorSpaceMatrix(conversation2);
    const meanPosition1 = calculateMeanPosition(matrix1);
    const meanPosition2 = calculateMeanPosition(matrix2);
    let sumOfSquares = 0;

    for (let i = 0; i < meanPosition1.length; i++) {
      const diff = meanPosition1[i] - meanPosition2[i];
      sumOfSquares += diff * diff;
    }

    return Math.sqrt(sumOfSquares);
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = calculateConversationEuclideanDistance;
