const getWordMatrix = require("./getWordMatrix");
const stopWords = require("../stopWords");

const convertToMatrix = async (paragraph) => {
  const words = paragraph.split(" ");
  const vectorSpaceMatrix = [];

  for (const word of words) {
    const trimmedWord = word.trim();

    if (trimmedWord === "") continue;
    if (!trimmedWord.match(/[a-z]/i)) continue;
    if (stopWords.includes(trimmedWord.toLowerCase())) continue;

    const matrixPoint = await getWordMatrix(trimmedWord);

    if (matrixPoint) vectorSpaceMatrix.push(matrixPoint);
  }

  return vectorSpaceMatrix;
};

module.exports = convertToMatrix;
