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

  const currentTime = new Date().getTime();
  const dbscanResult = await dbscanWithAllData(matrix, epsilon, minPts);
  const newTime = new Date().getTime();
  const timeElapsed = newTime - currentTime;
  const timeInSeconds = timeElapsed / 1000;
  console.log("DBSCAN runtime (seconds):", timeInSeconds);
  const flattenedClusterWords = dbscanResult.flattenedClusterWords || [];

  const sentences = lowerCaseConversation.split(/(?<=[.!?])\s+(?=\D|$)/);

  console.log("sentences:", sentences.length);

  const sentenceMembership = [];

  sentences.forEach((sentence, i) => {
    const replaceSpecialCharacterWithSpace = sentence.replace(
      /[^a-zA-Z0-9-]/g,
      " "
    );
    const words = replaceSpecialCharacterWithSpace.split(/\s+/);

    const sentenceComposition = [];
    const foundWords = [];
    totalTopicCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const singularWord = inflection.singularize(word) || word;
      const isTopic = flattenedClusterWords.includes(singularWord);

      if (!isTopic) continue;

      totalTopicCount++;

      if (!foundWords.includes(singularWord)) {
        foundWords.push(singularWord);
        sentenceComposition.push({
          word: singularWord,
          count: 1,
        });
      } else {
        for (let j = 0; j < sentenceComposition.length; j++) {
          if (sentenceComposition[j].word === singularWord) {
            sentenceComposition[j].count++;
          }
        }
      }
    }

    for (let i = 0; i < sentenceComposition.length; i++) {
      const roundedPercentage = Math.round(
        (sentenceComposition[i].count / totalTopicCount) * 100
      );
      sentenceComposition[i].percentage = `${roundedPercentage}%`;
    }

    sentenceMembership.push(sentenceComposition);
  });

  prettifiedSentenceMembership = sentenceMembership
    .map((sentence) => {
      return sentence
        .map((word) => {
          return `${word.word} (${word.percentage})`;
        })
        .join(", ");
    })
    .join("<br>");

  const message = `
  <strong>Topics:</strong><br>${flattenedClusterWords.join(", ")}
  <br>---------------------<br>
  <strong>Sentence Membership:</strong><br>${prettifiedSentenceMembership}`;

  return {
    message,
    error: null,
  };
};

module.exports = calculateConversationFlow;
