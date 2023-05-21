const getWordMatrix = require("./database_interactions/getWordMatrix");
const stopWords = require("../stopWords");

const convertToMatrixByWords = async (paragraph, keepWords = false) => {
  const replaceSpecialCharacterWithSpace = paragraph.replace(
    /[^a-zA-Z0-9-]/g,
    " "
  );
  const words = replaceSpecialCharacterWithSpace.split(/\s+/);
  const vectorSpaceMatrix = [];

  for (const word of words) {
    const trimmedWord = word.trim();

    if (trimmedWord.length < 3) continue;
    if (stopWords.includes(trimmedWord.toLowerCase())) continue;

    const matrixPoint = await getWordMatrix(trimmedWord);

    if (!matrixPoint) continue;

    if (keepWords) matrixPoint.push(trimmedWord);

    vectorSpaceMatrix.push(matrixPoint);
  }

  return vectorSpaceMatrix;
};

module.exports = convertToMatrixByWords;
