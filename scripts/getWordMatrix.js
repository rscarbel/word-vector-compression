const getWordMatrix = async (pool, word) => {
  const query = "SELECT * FROM word_vectors WHERE word = $1";
  const values = [word];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      const vectorValues = [];

      for (let i = 1; i <= 50; i++) {
        vectorValues.push(row[`vector${i}`]);
      }

      return vectorValues;
    } else {
      console.error("Word not found in the word_vectors table:", word);
      return null;
    }
  } catch (err) {
    console.error("Error in getWordMatrix:", err);
    return null;
  }
};

module.exports = getWordMatrix;
