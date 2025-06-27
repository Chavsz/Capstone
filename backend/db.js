const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "chavy2003", //Use your postgres password
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || "jwt_auth_multiuser"
});

module.exports = pool;