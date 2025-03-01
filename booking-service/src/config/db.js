const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "bookingdb",
    password: "mostwanted3z",
    port: 5432,
});

module.exports = pool;
