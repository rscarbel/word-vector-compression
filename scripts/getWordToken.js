const pool = require("../db");

const getWordToken = async (word) => {
  const query = "SELECT * FROM word_tokens WHERE word = $1";
  const values = [word];
  try {
    const res = await pool.query(query, values);
    return res.rows.length > 0 ? res.rows[0].token : null;
  } catch (err) {
    console.error("Error in getWordToken:", err);
    return null;
  }
};

module.exports = getWordToken;
