require("dotenv").config();
const { Pool } = require("pg");
const { PGUSER, PGDATABASE, PGHOST, PGPORT, PGPASSWORD } = process.env;

const pool = new Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
});

module.exports = pool;
