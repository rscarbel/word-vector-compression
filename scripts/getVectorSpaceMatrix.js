const getWordMatrix = require("./getWordMatrix");
const stopWords = require("../stopWords");

const getVectorSpaceMatrix = async (pool, paragraph) => {
  const parsedParagraph = paragraph.toLowerCase();
  const words = parsedParagraph.split(" ");
  const vectorSpaceMatrix = [];

  for (const word of words) {
    if (stopWords.includes(word)) {
      continue;
    }
    const matrixPoint = await getWordMatrix(pool, word.trim().toLowerCase());
    if (matrixPoint) {
      vectorSpaceMatrix.push(matrixPoint);
    }
  }

  return vectorSpaceMatrix;
};

module.exports = getVectorSpaceMatrix;
