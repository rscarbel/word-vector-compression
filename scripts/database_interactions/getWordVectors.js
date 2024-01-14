const pool = require("../../db");

const executeQuery = async (query, queryValues, queryName) => {
  try {
    const res = await pool.query({
      name: queryName || "query-" + Date.now(),
      text: query,
      values: queryValues,
    });
    return res.rows;
  } catch (err) {
    console.error("Error in executeQuery:", err);
    return [];
  }
};

const getWordVectors = async (words) => {
  const placeholders = words.map((_, i) => `$${i + 1}`).join(",");
  const query = `SELECT word, vector FROM word_vectors WHERE word IN (${placeholders})`;
  const values = words.map((word) => word.toString()); // Ensure each word is a string

  return await executeQuery(query, values);
};

module.exports = getWordVectors;

const getSingleWordVector = async (word) => {
  const query = `SELECT word, vector FROM word_vectors WHERE word = $1`;
  const values = [word.toString()];

  return await executeQuery(query, values);
};
