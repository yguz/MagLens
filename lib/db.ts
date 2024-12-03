import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "postgres",
  password: "password",
  database: "chat_app",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

export default db;
