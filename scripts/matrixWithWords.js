const getWordMatrix = require("./database_interactions/getWordMatrix");
const inflection = require("inflection");
const stopWords = require("../stopWords");

const matrixWithWords = async (paragraph) => {
  const replaceSpecialCharacterWithSpace = paragraph.replace(
    /[^a-zA-Z0-9-]/g,
    " "
  );
  const words = replaceSpecialCharacterWithSpace.split(/\s+/);
  const wordCount = new Map();
  const vectorSpaceMatrix = [];

  words.forEach((word) => {
    const trimmedWord = word.trim();
    const singularWord = inflection.singularize(trimmedWord) || trimmedWord;

    if (singularWord.length < 3 || stopWords.has(singularWord)) return;

    wordCount.set(singularWord, (wordCount.get(singularWord) || 0) + 1);
  });

  const wordsArray = Array.from(wordCount.keys());
  const matrixPoints = await Promise.all(wordsArray.map(getWordMatrix));

  matrixPoints.forEach((matrixPoint, index) => {
    if (matrixPoint) {
      vectorSpaceMatrix.push({
        word: wordsArray[index],
        matrixPoint: matrixPoint,
        count: wordCount.get(wordsArray[index]),
      });
    }
  });

  return vectorSpaceMatrix;
};

module.exports = matrixWithWords;
