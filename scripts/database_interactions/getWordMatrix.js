const pool = require("../../db");

const VECTOR_COLUMNS = Array.from(
  { length: 300 },
  (_, i) => `vector${i + 1}`
).join(", ");

const getVectorValues = (row) =>
  Array.from({ length: 300 }, (_, i) => row[`vector${i + 1}`]);

const executeQuery = async (query, queryValues) => {
  try {
    const res = await pool.query({
      name: "fetch-word-vector",
      text: query,
      values: queryValues,
    });
    return res.rows.length > 0 ? getVectorValues(res.rows[0]) : null;
  } catch (err) {
    console.error("Error in getWordMatrix:", err);
    return null;
  }
};

const getWordMatrix = async (word) => {
  const sanitizedWord = word
    .replace(/[^a-zA-Z]|(\[[0-9]+\])/g, "")
    .toLowerCase();
  const query = `SELECT ${VECTOR_COLUMNS} FROM common_crawl_300 WHERE word = $1 OR word = $2`;
  const values = [word, sanitizedWord];

  const result = await executeQuery(query, values);

  if (!result) {
    console.error("Word not found in the common_crawl_300 table:", word);
  }

  return result;
};

module.exports = getWordMatrix;
