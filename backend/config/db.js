const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port:Number(process.env.MYSQL_PORT),
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection Failed ❌", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

module.exports = db;
