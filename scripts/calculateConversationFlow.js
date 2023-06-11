const matrixWithWords = require("./matrixWithWords");
const dbscanWithAllData = require("./operations_using_matrices/DBSCAN/dbscanWithAllData");
const inflection = require("inflection");

const epsilon = 3;

const calculateConversationFlow = async (conversation) => {
  lowerCaseConversation = conversation.toLowerCase();
  const timeBeforeLookup = new Date().getTime();
  const matrix = await matrixWithWords(lowerCaseConversation);
  const timeAfterLookup = new Date().getTime();
  const lookupTimeElapsed = timeAfterLookup - timeBeforeLookup;
  const lookupTimeInSeconds = lookupTimeElapsed / 1000;

  const minPts = Math.ceil(matrix.length * 0.012) + 1;

  const timeBeforeDBSCAN = new Date().getTime();
  const dbscanResult = await dbscanWithAllData(matrix, epsilon, minPts);
  const timeAfterDBSCAN = new Date().getTime();
  const timeElapsed = timeAfterDBSCAN - timeBeforeDBSCAN;
  const DBSCANTime = timeElapsed / 1000;
  const flattenedClusterWords = dbscanResult.flattenedClusterWords || [];

  const sentences = lowerCaseConversation.split(/(?<=[.!?])\s+(?=\D|$)/);

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
      const roundedPercentage = (
        sentenceComposition[i].count / totalTopicCount
      ).toFixed(2);
      sentenceComposition[i].percentage = roundedPercentage;
    }
    if (sentenceComposition.length)
      sentenceMembership.push(sentenceComposition);
  });

  prettifiedSentenceMembership = sentenceMembership
    .map((sentence) => {
      return `[&nbsp;${sentence
        .map((word) => {
          return `${word.word}: ${word.percentage}`;
        })
        .join(", ")}&nbsp;] `;
    })
    .join("<br>");

  const message = `
  <strong>Database Lookup Time:</strong> ${lookupTimeInSeconds} seconds<br>
  <strong>Algorithm Time:</strong> ${DBSCANTime} seconds<br>
  <strong>Topics:</strong><br>${flattenedClusterWords.join(", ")}
  <br>---------------------<br>
  <strong>Number of sentences:</strong> ${sentences.length}<br>
  <strong>Sentence Membership:</strong><br>${prettifiedSentenceMembership}`;

  return {
    message,
    error: null,
  };
};

module.exports = calculateConversationFlow;
