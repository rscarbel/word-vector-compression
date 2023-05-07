const getWordToken = require("./getWordToken");

const tokenizeParagraph = async (paragraph) => {
  const parsedParagraph = paragraph.toLowerCase();
  const words = parsedParagraph.split(" ");

  const tokenizedParagraph = [];
  for (const word of words) {
    const token = await getWordToken(word.trim().toLowerCase());
    if (token) {
      tokenizedParagraph.push(token);
    }
  }

  return tokenizedParagraph;
};

module.exports = tokenizeParagraph;
