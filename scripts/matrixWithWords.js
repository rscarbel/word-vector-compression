const getWordMatrix = require("./database_interactions/getWordMatrix");
const inflection = require("inflection");
const stopWords = require("../stopWords");

const matrixWithWords = async (paragraph) => {
  const replaceSpecialCharacterWithSpace = paragraph.replace(
    /[^a-zA-Z0-9-]/g,
    " "
  );
  const words = replaceSpecialCharacterWithSpace.split(/\s+/);
  const foundWords = [];
  const vectorSpaceMatrix = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const trimmedWord = word.trim();
    const singularWord = inflection.singularize(trimmedWord) || trimmedWord;

    if (singularWord.length < 3) continue;
    if (stopWords.includes(singularWord)) continue;

    const matrixPoint = await getWordMatrix(singularWord);

    if (!matrixPoint) continue;

    if (!foundWords.includes(singularWord)) {
      foundWords.push(singularWord);
      vectorSpaceMatrix.push({
        word: singularWord,
        matrixPoint: matrixPoint,
        count: 1,
      });
    } else {
      for (let j = 0; j < vectorSpaceMatrix.length; j++) {
        if (vectorSpaceMatrix[j].word === singularWord) {
          vectorSpaceMatrix[j].count++;
        }
      }
    }
  }
  return vectorSpaceMatrix;
};

module.exports = matrixWithWords;
