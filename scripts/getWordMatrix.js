const pool = require("../db");

const getVectorValues = (row) => {
  const vectorValues = [];
  for (let i = 1; i <= 300; i++) {
    vectorValues.push(row[`vector${i}`]);
  }
  return vectorValues;
};

const executeQuery = async (query, queryValues) => {
  try {
    const res = await pool.query(query, queryValues);
    if (res.rows.length > 0) {
      return getVectorValues(res.rows[0]);
    }
    return null;
  } catch (err) {
    console.error("Error in getWordMatrix:", err);
    return null;
  }
};

const getWordMatrix = async (word) => {
  const query = "SELECT * FROM common_crawl_300 WHERE word = $1";
  const wordWithoutPunctuation = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  const values = [word];
  const secondAttemptValues = [wordWithoutPunctuation];

  const result = await executeQuery(query, values);
  if (result) {
    return result;
  } else {
    const secondAttemptResult = await executeQuery(query, secondAttemptValues);
    if (secondAttemptResult) {
      console.log("After removing punctuation, found:", word);
      return secondAttemptResult;
    }
    console.error("Word not found in the common_crawl_300 table:", word);
    return null;
  }
};

module.exports = getWordMatrix;
