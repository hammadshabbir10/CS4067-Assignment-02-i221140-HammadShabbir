const { Pool } = require("pg");

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "userdb",
    password: "mostwanted3z",
    port: 5432,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error", err));

module.exports = pool;
