const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "multitenant_db",
  password: "2905",
  port: 5432,
});

module.exports = pool;