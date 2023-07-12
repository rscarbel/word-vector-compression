const matrixWithWords = require("./matrixWithWords");
const DBSCAN = require("./operations_using_matrices/DBSCAN/DBSCAN");
const inflection = require("inflection");
const PRONOUNS = require("../constants/PRONOUNS");
const FUNCTION_WORDS = require("../constants/FUNCTION_WORDS");

const epsilon = 3;

const calculateConversationFlow = async (conversation) => {
  lowerCaseConversation = conversation.toLowerCase();
  const timeBeforeLookup = new Date().getTime();
  const matrix = await matrixWithWords(lowerCaseConversation);
  const timeAfterLookup = new Date().getTime();
  const lookupTimeElapsed = timeAfterLookup - timeBeforeLookup;
  const lookupTimeInSeconds = lookupTimeElapsed / 1000;

  const minPts = Math.ceil(matrix.length * 0.006) + 1;

  const timeBeforeDBSCAN = new Date().getTime();
  const dbscanResult = await DBSCAN(matrix, epsilon, minPts);
  const timeAfterDBSCAN = new Date().getTime();
  const timeElapsed = timeAfterDBSCAN - timeBeforeDBSCAN;
  const DBSCANTime = timeElapsed / 1000;
  const flattenedClusterWords = dbscanResult.flattenedClusterWords || [];

  const sentences = lowerCaseConversation.split(/(?<=[.!?])\s+(?=\D|$)/);

  const sentenceMembership = [];

  sentences.forEach((sentence, i) => {
    const replaceSpecialCharacterWithSpace = sentence.replace(
      /[^a-zA-Z\d-' ]/g,
      " "
    );
    const words = replaceSpecialCharacterWithSpace.split(/\s+/);

    const sentenceComposition = [];
    totalTopicCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const singularWord = inflection.singularize(word) || word;
      const isTopic = flattenedClusterWords.includes(singularWord);

      let color = null;
      if (PRONOUNS.has(singularWord)) {
        color = "green";
      } else if (FUNCTION_WORDS.has(singularWord)) {
        color = "red";
      }

      if (!isTopic && color === null) continue;

      if (isTopic) {
        totalTopicCount++;
      }

      let compositionEntry = sentenceComposition.find(
        (x) => x.word === singularWord
      );
      if (!compositionEntry) {
        sentenceComposition.push({
          word: singularWord,
          count: 1,
          color: color,
        });
      } else {
        compositionEntry.count++;
      }
    }

    for (let i = 0; i < sentenceComposition.length; i++) {
      if (sentenceComposition[i].color) continue; // Skip non-topic words for percentage calculation
      const roundedPercentage = (
        sentenceComposition[i].count / totalTopicCount
      ).toFixed(2);
      sentenceComposition[i].percentage = roundedPercentage;
    }
    if (sentenceComposition.length)
      sentenceMembership.push(sentenceComposition);
  });

  let compressedData = {};

  sentenceMembership.forEach((line, index) => {
    line.forEach((topic) => {
      let topicName = topic.word;
      let topicWeight = parseFloat(topic.percentage);
      if (!compressedData[topicName]) {
        compressedData[topicName] = {
          count: 1,
          totalWeight: topicWeight,
          color: topic.color,
          sequences: [
            {
              start: index,
              end: index,
              weight: topicWeight,
            },
          ],
        };
      } else {
        if (
          compressedData[topicName].sequences.slice(-1)[0].end ===
          index - 1
        ) {
          compressedData[topicName].sequences.slice(-1)[0].end = index;
          compressedData[topicName].sequences.slice(-1)[0].weight +=
            topicWeight;
        } else {
          compressedData[topicName].sequences.push({
            start: index,
            end: index,
            weight: topicWeight,
          });
        }
        compressedData[topicName].count++;
        compressedData[topicName].totalWeight += topicWeight;
      }
    });
  });

  const prettifiedCompressedSentences = Object.entries(compressedData)
    .map(([topicName, sentence]) => {
      return `<br><span style="color: ${
        sentence.color
      }"><strong>${topicName}</strong>: ${sentence.sequences
        .map((word) => {
          const length = word.end - word.start + 1;
          const weight = sentence.color
            ? ""
            : `, weight: ${word.weight.toFixed(2)}`;
          if (length === 1) {
            return `{ start: ${word.start}${weight}, length: ${length} }`;
          }
          return `{ range: ${word.start}-${word.end}, ${weight}, length: ${
            word.end - word.start + 1
          } }`;
        })
        .join(",&nbsp;&nbsp;&nbsp;")}</span><br> `;
    })
    .join("<br><br>");

  const prettifiedSentenceMembership = sentenceMembership
    .map((sentence) => {
      return `[&nbsp;${sentence
        .map((word) => {
          const colorSpan = word.color
            ? `<strong><span style="color: ${word.color}">${word.word}</span></strong>`
            : `<strong>${word.word}</strong>`;
          return `${colorSpan}: ${word.percentage || "0"}`;
        })
        .join(", ")}&nbsp;] `;
    })
    .join("<br><br>");

  const message = `
  <strong>Database Lookup Time:</strong> ${lookupTimeInSeconds} seconds<br><br>
  <strong>Algorithm Time:</strong> ${DBSCANTime} seconds<br><br>
  <strong>Topics:</strong><br>${flattenedClusterWords.join(", ")}<br>
  <br>---------------------<br><br>
  <strong>Number of sentences:</strong> ${sentences.length}<br><br>
  <strong>Sentence Membership:</strong><br><br>${prettifiedSentenceMembership}<br><br>
  <br><br>---------------------<br><br>
  <br><br>---------------------<br><br>
  <strong>CompressedSentence Membership:</strong><br>${prettifiedCompressedSentences}`;

  return {
    message,
    error: null,
  };
};

module.exports = calculateConversationFlow;
