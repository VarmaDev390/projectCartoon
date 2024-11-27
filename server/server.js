import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import { chatBotAI } from "./src/routes/chatRoutes.js";
import { config } from "dotenv";
import OpenAI from "openai";
import { callGPT } from "./src/components/helpers.js";
import { v4 as uuidv4 } from "uuid";
import * as mysql from "mysql2";
import Redis from "ioredis";
import { messageQueue } from "./bullQueue.js";

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

const cartoonApp = express();
const PORT = process.env.PORT || 3001;

cartoonApp.use(bodyParser.json());
cartoonApp.use(cors());

// for chatting with a new session
// cartoonApp.post("/chat", async (req, res) => {
//   // create a new sessionId
//   const sessionId = uuidv4();
//   const message = req.body.message;
//   console.log("message", message);
//   // define the role and context for your chatbot
//   let messagesArr = [
//     {
//       role: "system",
//       content: "Act as an expert based on the knowledge of cartoon characters",
//     },
//     {
//       role: "user",
//       content: message,
//     },
//   ];

//   let [collectedContent, role] = ["", ""];

//   try {
//     res.write(JSON.stringify({ sessionId }));

//     const stream = await callGPT(openai, messagesArr);
//     // after getting the data as stream we add all the chunks to a single string
//     for await (const chunk of stream) {
//       if (chunk.choices[0].delta.role) role = chunk.choices[0].delta.role;
//       if (chunk.choices[0]?.delta?.content) {
//         collectedContent += chunk.choices[0].delta.content;
//         res.write(chunk.choices[0].delta.content || "");
//         // console.log(chunk.choices[0].delta);
//       }
//     }
//     // adding the collected chuncks and role as an object for saving it to db
//     messagesArr.push({
//       role: role,
//       content: collectedContent,
//     });

//     // store the chat history in the db

//     const query = "INSERT INTO chatData (sessionId, chatHistory) VALUES (?, ?)";
//     pool.query(
//       query,
//       [sessionId, JSON.stringify(messagesArr)],
//       (err, result) => {
//         if (err) {
//           console.error("Error inserting data:", err);
//           res.status(500).json({ error: "Error storing chat data" });
//         } else {
//           console.log("Data inserted successfully:", result);
//           res.end();
//         }
//       }
//     );
//   } catch (err) {
//     console.error("Error during query execution:", err);
//     res.status(500).json({ error: "Error during query execution" });
//   }

//   console.log("messagesArr", messagesArr);
// });

// for chatting with a new session
cartoonApp.post("/chat", async (req, res) => {
  // create a new sessionId
  const sessionId = uuidv4();
  const message = req.body.message;

  console.log("message", message);
  // define the role and context for your chatbot
  let messagesArr = [
    {
      role: "system",
      content: "Act as an expert based on the knowledge of cartoon characters",
    },
    {
      role: "user",
      content: message,
    },
  ];

  let [collectedContent, role] = ["", ""];

  try {
    res.write(JSON.stringify({ sessionId }));

    const stream = await callGPT(openai, messagesArr);
    // after getting the data as stream we add all the chunks to a single string
    for await (const chunk of stream) {
      if (chunk.choices[0].delta.role) role = chunk.choices[0].delta.role;
      if (chunk.choices[0]?.delta?.content) {
        collectedContent += chunk.choices[0].delta.content;
        res.write(chunk.choices[0].delta.content || "");
        // console.log(chunk.choices[0].delta);
      }
    }

    // Push job to Bull for heavy processing (e.g., saving to database)
    await messageQueue.add({
      sessionId,
      chatHistory: [...messagesArr, { role, content: collectedContent }],
    });
    //   // adding the collected chuncks and role as an object for saving it to db
    //   messagesArr.push({
    //     role: role,
    //     content: collectedContent,
    //   });

    //   // store the chat history in the db

    //   const query = "INSERT INTO chatData (sessionId, chatHistory) VALUES (?, ?)";
    //   pool.query(
    //     query,
    //     [sessionId, JSON.stringify(messagesArr)],
    //     (err, result) => {
    //       if (err) {
    //         console.error("Error inserting data:", err);
    //         res.status(500).json({ error: "Error storing chat data" });
    //       } else {
    //         console.log("Data inserted successfully:", result);
    //         res.end();
    //       }
    //     }
    //   );
    // } catch (err) {
    //   console.error("Error during query execution:", err);
    //   res.status(500).json({ error: "Error during query execution" });
    // }

    // console.log("messagesArr", messagesArr);
    // Close the response stream
    res.end();
  } catch (err) {
    console.error("Error processing message:", err);
    res.status(500).json({ error: "Error processing the message" });
  }
});

// getting all the sessions in the database
cartoonApp.get("/chat/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId.slice(1);
  console.log("sessionId", sessionId);

  try {
    let chatHistory = [];

    const query = `SELECT chatHistory FROM chatData WHERE sessionId = ?`;
    pool.query(query, [sessionId], async (err, result) => {
      if (result.length > 0 && result[0].chatHistory) {
        console.log("has history", result);

        chatHistory = result[0].chatHistory;
        console.log("chatHistory", chatHistory);

        res.json(chatHistory);
      } else {
        return res.status(404).json({ error: "No chat history found" });
      }
    });
  } catch (error) {
    console.log("Error in querying", error);
    return res.status(500).json({ error: "Error in querying" });
  }
});

// for chatting with a specific session
cartoonApp.post("/chat/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId.slice(1);
  console.log("sessionId", sessionId);
  const message = req.body.message;
  console.log("message", message);

  let chatHistory = [];
  let conversationObj = {};
  //get the chat history from db using sessionId

  // store the chat history in the db
  try {
    const query = `SELECT chatHistory FROM chatData WHERE sessionId = ?`;
    pool.query(query, [sessionId], async (err, result) => {
      if (result.length > 0 && result[0].chatHistory) {
        console.log("has history");

        chatHistory = result[0].chatHistory;
        conversationObj = [
          {
            role: "user",
            content: message,
          },
        ];
      } else {
        return res.status(404).json({ error: "No chat history found" });
      }

      chatHistory.push(...conversationObj);
      // console.log("chatHistory", chatHistory);

      let [collectedContent, role] = ["", ""];

      const stream = await callGPT(openai, chatHistory);
      // after getting the data as stream we add all the chunks to a single string
      for await (const chunk of stream) {
        if (chunk.choices[0].delta.role) role = chunk.choices[0].delta.role;
        if (chunk.choices[0]?.delta?.content) {
          collectedContent += chunk.choices[0].delta.content;
          res.write(chunk.choices[0].delta.content || "");
          // console.log(chunk.choices[0].delta);
        }
      }
      chatHistory.push({
        role: role,
        content: collectedContent,
      });
      console.log("chatHistory", chatHistory);

      const updateQuery = `UPDATE chatData SET chatHistory = ? WHERE sessionId = ?`;
      pool.query(
        updateQuery,
        [JSON.stringify(chatHistory), sessionId],
        (err) => {
          if (err) {
            console.error("Error inserting chat history:", err);
            res.status(500).json({ error: "Error storing chat data" });
          } else {
            console.log("Chat history updated successfully.");
            res.end();
          }
        }
      );
    });
  } catch (err) {
    console.error("Error during query execution:", err);
    res.status(500).json({ error: "Error during query execution" });
  }
});

// for getting all the chat messages inside a session
cartoonApp.get("/chats", async (req, res) => {
  console.log("Inside /chats endpoint");
  try {
    const query =
      "SELECT sessionId, chatHistory FROM chatData ORDER BY updated_at DESC";
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching chat sessions:", err);
        return res.status(500).json({ error: "Error fetching chat sessions" });
      }
      const sessions = results.map((row) => {
        let chatHistory;
        // try {
        //   chatHistory = JSON.parse(row.chatHistory);
        // } catch (e) {
        //   console.warn("Failed to parse chatHistory:", e.message);
        chatHistory = row.chatHistory;
        // }
        return { sessionId: row.sessionId, chatHistory };
      });
      res.json(sessions);
    });
  } catch (error) {
    console.error("Error in querying:", error);
    return res.status(500).json({ error: "Error in querying" });
  }
});

cartoonApp.get("/sampleEndpoint", (req, res) => {
  res.json({ message: "All good" });
});

cartoonApp.listen(PORT, () =>
  console.log("Example app is listening on port 3001.")
);
