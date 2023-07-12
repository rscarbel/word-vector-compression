const pool = require("../../db");

const executeQuery = async (query, queryValues) => {
  try {
    const res = await pool.query({
      name: "fetch-word-vectors",
      text: query,
      values: queryValues,
    });
    return res.rows;
  } catch (err) {
    console.error("Error in getWordVectors:", err);
    return [];
  }
};

const getWordVectors = async (words) => {
  const placeholders = words.map((_, i) => `$${i + 1}`).join(",");
  const query = `SELECT word, vector FROM word_vectors WHERE word IN (${placeholders})`;
  const values = words;

  return await executeQuery(query, values);
};

module.exports = getWordVectors;
