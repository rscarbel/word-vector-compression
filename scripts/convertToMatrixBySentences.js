const convertToMatrixByWords = require("./convertToMatrixByWords");

const convertToMatrixBySentences = async (paragraph) => {
  const removeNumbers = paragraph.replace(/[0-9]/g, "");

  const sentences = removeNumbers.split(/[.\n?!:]+/);

  const vectorSpaceMatrix = [];

  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i].length <= 1) continue;
    const matrix = await convertToMatrixByWords(sentences[i]);
    vectorSpaceMatrix.push(matrix);
  }

  return vectorSpaceMatrix;
};

module.exports = convertToMatrixBySentences;
