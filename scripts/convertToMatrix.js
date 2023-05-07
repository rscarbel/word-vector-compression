const getWordMatrix = require("./getWordMatrix");
const stopWords = require("../stopWords");

const convertToMatrix = async (paragraph) => {
  const parsedParagraph = paragraph.replace(/[^a-zA-Z ]/g, " ").toLowerCase();
  const words = parsedParagraph.split(" ");
  const vectorSpaceMatrix = [];

  for (const word of words) {
    word.trim();
    if (stopWords.includes(word) || word === "") {
      continue;
    }
    const matrixPoint = await getWordMatrix(word.trim().toLowerCase());
    if (matrixPoint) {
      vectorSpaceMatrix.push(matrixPoint);
    }
  }

  return vectorSpaceMatrix;
};

module.exports = convertToMatrix;
