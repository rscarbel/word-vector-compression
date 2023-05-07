require("dotenv").config();
const { Pool } = require("pg");
const { PGUSER, PGDATABASE, PGHOST, PGPORT } = process.env;

const pool = new Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: "",
  port: PGPORT,
});

module.exports = pool;
