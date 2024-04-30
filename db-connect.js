import mysql from "mysql2";

import "dotenv/config";
import fs from "fs";

const dbConfig = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  ssl: { ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") },
});

dbConfig.connect((error) => {
  if (error) {
    console.error("Error connecting to the database: ", error);
    return;
  }
  console.log("Connected to MySQL database.");
});

export default dbConfig;
