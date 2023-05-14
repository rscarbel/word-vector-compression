const pool = require("../db");

const getVectorValues = (row) => {
  const vectorValues = [];
  for (let i = 1; i <= 300; i++) {
    vectorValues.push(row[`vector${i}`]);
  }
  return vectorValues;
};

const generateVectorColumns = () => {
  const columns = [];
  for (let i = 1; i <= 300; i++) {
    columns.push(`vector${i}`);
  }
  return columns.join(", ");
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
  const sanitizedWord = word
    .replace(/[^a-zA-Z]|(\[[0-9]+\])/g, "")
    .toLowerCase();
  const vectorColumns = generateVectorColumns();
  const query = `SELECT ${vectorColumns} FROM common_crawl_300 WHERE word = $1 OR word = $2`;
  const values = [word, sanitizedWord];

  const result = await executeQuery(query, values);
  if (result) {
    return result;
  } else {
    console.error("Word not found in the common_crawl_300 table:", word);
    return null;
  }
};

module.exports = getWordMatrix;
