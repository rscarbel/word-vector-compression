const tokenizeParagraph = require("./tokenizeParagraph");
const discreteCosineTransform = require("./discreteCosineTransform");
const downsampleNormalize = require("./downsampleNormalize");
const cosineSimilarity = require("./cosineSimilarity");

const parseInputs = async (pool, conversation1, conversation2) => {
  const tokenizedConversation1 = await tokenizeParagraph(pool, conversation1);
  const tokenizedConversation2 = await tokenizeParagraph(pool, conversation2);
  const size =
    tokenizedConversation1.length < tokenizedConversation2.length
      ? tokenizedConversation1.length
      : tokenizedConversation2.length;
  const downsampledArr1 = downsampleNormalize(tokenizedConversation1, size);
  const downsampledArr2 = downsampleNormalize(tokenizedConversation2, size);
  const similarity = cosineSimilarity(downsampledArr1, downsampledArr2);
  return similarity;
};

module.exports = parseInputs;
