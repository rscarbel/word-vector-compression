const matrixWithWords = require("./matrixWithWords");
const dbscanWithAllData = require("./operations_using_matrices/DBSCAN/dbscanWithAllData");
const inflection = require("inflection");
const { default: cluster } = require("cluster");

const MINIMUM_DISTANCE = 3;
const epsilon = 4;

const calculateConversationFlow = async (conversation) => {
  lowerCaseConversation = conversation.toLowerCase();
  const matrix = await matrixWithWords(lowerCaseConversation);

  const minPts = Math.ceil(matrix.length * 0.012) + 1;

  const dbscanResult = await dbscanWithAllData(matrix, epsilon, minPts);
  const clusterWords = dbscanResult.clusterWords || [];
  const flattenedClusterWords = dbscanResult.flattenedClusterWords || [];

  const topicProgression = [];

  const sentences = lowerCaseConversation.split(/(?<=[.?!])\s+(?=[A-Z])/);

  sentences.forEach((sentence, i) => {
    const replaceSpecialCharacterWithSpace = sentence.replace(
      /[^a-zA-Z0-9-]/g,
      " "
    );
    const words = replaceSpecialCharacterWithSpace.split(/\s+/);
    const sentenceTopics = new Set();

    words.forEach((word) => {
      const singlularWord = inflection.singularize(word);
      if (
        flattenedClusterWords.includes(singlularWord) &&
        !topicProgression[i - 1]?.includes(singlularWord)
      ) {
        sentenceTopics.push(singlularWord);
      }
    });

    topicProgression.push(sentenceTopics);
  });

  const message = `Topics:<br>${topicProgression.join(" <br> ")}`;

  return {
    message,
    error: null,
  };
};

module.exports = calculateConversationFlow;
