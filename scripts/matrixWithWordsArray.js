const getWordVectors = require("./database_interactions/getWordVectors");
const inflection = require("inflection");
const stopWords = require("../stopWords");

const matrixWithWordsArray = async (paragraph) => {
  const replaceSpecialCharacterWithSpace = paragraph.replace(
    /[^a-zA-Z0-9-]/g,
    " "
  );
  const words = replaceSpecialCharacterWithSpace.split(/\s+/);
  const wordCount = new Map();

  words.forEach((word) => {
    const trimmedWord = word.trim();
    const singularWord = inflection.singularize(trimmedWord) || trimmedWord;

    if (singularWord.length < 3 || stopWords.has(singularWord)) return;

    wordCount.set(singularWord, (wordCount.get(singularWord) || 0) + 1);
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

module.exports = matrixWithWordsArray;
