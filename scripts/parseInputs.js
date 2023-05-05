const tokenizeParagraph = require("./tokenizeParagraph");
const discreteCosineTransform = require("./discreteCosineTransform");
const downsampleNormalize = require("./downsampleNormalize");
const cosineSimilarity = require("./cosineSimilarity");

const parseInputs = (conversation1, conversation2) => {
  const tokenizedConversationArray1 = tokenizeParagraph(conversation1);
  const tokenizedConversationArray2 = tokenizeParagraph(conversation2);
  const transformedArr1 = discreteCosineTransform(tokenizedConversationArray1);
  const transformedArr2 = discreteCosineTransform(tokenizedConversationArray2);
  const size =
    transformedArr1.length < transformedArr2.length
      ? transformedArr1.length
      : transformedArr2.length;
  const downsampledArr1 = downsampleNormalize(transformedArr1, size);
  const downsampledArr2 = downsampleNormalize(transformedArr2, size);
  const similarity = cosineSimilarity(downsampledArr1, downsampledArr2);
  return similarity;
};

module.exports = parseInputs;
