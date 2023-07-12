const pool = require("../../db");

const executeQuery = async (query, queryValues) => {
  try {
    const res = await pool.query({
      name: "fetch-word-vector",
      text: query,
      values: queryValues,
    });
    return res.rows.length > 0 ? res.rows[0].vector : null;
  } catch (err) {
    console.error("Error in getWordMatrix:", err);
    return null;
  }
};

const getWordMatrix = async (word) => {
  const query = `SELECT vector FROM word_vectors WHERE word = $1`;
  const values = [word];

  const result = await executeQuery(query, values);

  if (!result) {
    console.error("Word not found in the word_vectors table:", word);
  }

  return result;
};

module.exports = getWordMatrix;
