const getWordVectors = require("./database_interactions/getWordVectors");
const inflection = require("inflection");
const STOP_WORDS = require("../constants/STOP_WORDS");

const matrixWithWords = async (paragraph) => {
  const replaceSpecialCharacterWithSpace = paragraph.replace(
    /[^a-zA-Z\d-' ]/g,
    " "
  );

  const words = replaceSpecialCharacterWithSpace.split(/\s+/);
  const wordCount = new Map();

  words.forEach((word) => {
    const trimmedWord = word.trim();
    const singularWord = inflection.singularize(trimmedWord) || trimmedWord;

    if (singularWord.length < 3 || STOP_WORDS.has(singularWord)) return;

    const currentCount = wordCount.get(singularWord);
    wordCount.set(singularWord, currentCount ? currentCount + 1 : 1);
  });

  const wordsArray = Array.from(wordCount.keys());
  const matrixRows = await getWordVectors(wordsArray);
  const vectorSpaceMatrix = matrixRows.map((row) => ({
    word: row.word,
    matrixPoint: row.vector,
    count: wordCount.get(row.word),
  }));

  return vectorSpaceMatrix;
};

module.exports = matrixWithWords;
