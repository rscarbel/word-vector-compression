const pool = require("../../db");

const getNearestNeighbor = async (vector) => {
  let columnNames = [];
  for (let i = 1; i <= 300; i++) {
    columnNames.push(`vector${i}`);
  }
  columnNames = columnNames.join(", ");

  const generateDistanceExpression = () => {
    let expression = "";
    for (let i = 0; i < vector.length; i++) {
      expression += `POWER(vector${i + 1} - ${vector[i]}, 2)`;
      if (i < vector.length - 1) {
        expression += " + ";
      }
    }
    return expression;
  };

  const query = `
    SELECT word, 
      (${generateDistanceExpression()}) as distance
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
