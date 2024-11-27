import { messageQueue } from "./bullQueue.js";
import OpenAI from "openai";
import { config } from "dotenv";

import { callGPT } from "./src/components/helpers.js";
import { v4 as uuidv4 } from "uuid";
import * as mysql from "mysql2";

// setting the env variables
const result = config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

messageQueue.process(async (job) => {
  const { sessionId, chatHistory } = job.data; // Extract data from the job

  try {
    // Save the chat history to the database
    const query = "INSERT INTO chatData (sessionId, chatHistory) VALUES (?, ?)";
    pool.query(
      query,
      [sessionId, JSON.stringify(chatHistory)],
      (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
        } else {
          console.log("Data inserted successfully:", result);
        }
      }
    );
  } catch (err) {
    console.error("Error processing job:", err);
  }
});
