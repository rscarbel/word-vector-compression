const getWordMatrix = require("./database_interactions/getWordMatrix");
const stopWords = require("../stopWords");

const convertToMatrix = async (paragraph, keepWords = false) => {
  const words = paragraph.split(/\s+/);
  const vectorSpaceMatrix = [];

  for (const word of words) {
    const trimmedWord = word.trim();

    if (trimmedWord === "") continue;
    if (!trimmedWord.match(/[a-z0-9]/i)) continue;
    if (stopWords.includes(trimmedWord.toLowerCase())) continue;

    const matrixPoint = await getWordMatrix(trimmedWord);

    if (!matrixPoint) continue;

    if (keepWords) matrixPoint.push(trimmedWord);

    vectorSpaceMatrix.push(matrixPoint);
  }

  return vectorSpaceMatrix;
};

module.exports = convertToMatrix;
