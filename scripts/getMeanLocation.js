const tokenizeParagraph = require("./tokenizeParagraph");
const discreteCosineTransform = require("./operations_using_matrices/discreteCosineTransform");
const downsampleNormalize = require("./downsampleNormalize");
const cosineSimilarity = require("./cosineSimilarity");
const getVectorSpaceMatrix = require("./convertToMatrix");
const calculateMeanPosition = require("./operations_using_matrices/calculateMeanPosition");

const getMeanLocation = async (conversation) => {
  const matrix = await getVectorSpaceMatrix(conversation);
  const meanPosition = calculateMeanPosition(matrix2);
};
module.exports = getMeanLocation;