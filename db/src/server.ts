import express, { Request, Response } from "express";
import { Pool } from "pg";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import fetch from "node-fetch"; // Ensure you have node-fetch installed for the API call

const app = express();
const port = 3000;

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: "postgres", // replace with your PostgreSQL username
  host: "localhost",
  database: "chat_app", // use the database you created
  password: "password", // replace with your password
  port: 5433,
});

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
