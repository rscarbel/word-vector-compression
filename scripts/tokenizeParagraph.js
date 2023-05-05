const wordMap = require("../wordMap");
const tokenizeWord = require("./tokenizeWord");

// This function is not intelligently tokenizing words, to make the algorithm work accurately, this needs to reference a word vector
const tokenizeParagraph = (paragraph) => {
  const parsedParagraph = paragraph.replace(/[^a-zA-Z\n]/g, " ").toLowerCase();
  const tokenizedParagraph = parsedParagraph.split(" ").map((word) => {
    const token = wordMap[word.trim().toLowerCase()];
    return token ? token : tokenizeWord(word); // if token is not found, we'll just make one up
  });
  const filteredTokenizedParagraph = tokenizedParagraph.filter((token) => {
    return token;
  });
  return filteredTokenizedParagraph;
};

module.exports = tokenizeParagraph;

// optimizations here could be to lemetize words, and perhaps remove stop words
