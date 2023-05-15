const pool = require("../../db");

const getNearestNeighbor = async (vector) => {
  const generateColumnNames = () => {
    const columnNames = [];
    for (let i = 1; i <= 300; i++) {
      columnNames.push(`vector${i}`);
    }
    return columnNames.join(", ");
  };

  const generateDistanceExpression = () => {
    return vector
      .map((value, index) => {
        return `POWER(vector${index + 1} - ${value}, 2)`;
      })
      .join(" + ");
  };

  const query = `
    SELECT word, 
      SQRT(${generateDistanceExpression()}) as distance
    FROM common_crawl_300
    ORDER BY distance ASC
    LIMIT 1;
  `;

  try {
    const res = await pool.query(query);
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      console.error("No vectors found in the table");
      return null;
    }
  } catch (err) {
    console.error("Error in getNearestNeighbor:", err);
    return null;
  }
};

module.exports = getNearestNeighbor;
