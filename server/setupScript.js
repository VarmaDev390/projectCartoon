import * as mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const initialScript = () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  pool.getConnection((err, connection) => {
    if (err) {
      return console.error(
        "Error connecting to the MySQL server: " + err.message
      );
    }

    console.log("Connected to the MySQL server.");

    // Table creation query
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS chatData (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sessionId varchar(255),
        chatHistory JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    const alterTable = `
    ALTER TABLE chatData  
MODIFY COLUMN sessionId varchar(255);  
    `;

    connection.query(alterTable, (err, results) => {
      if (err) {
        console.error("Error creating table: " + err.message);
      } else {
        console.log("Table created or already exists.");
      }

      // Release the connection back to the pool
      connection.release();

      // End the pool
      pool.end((err) => {
        if (err) {
          console.error("Error closing the connection pool: " + err.message);
        } else {
          console.log("Connection pool closed.");
        }
      });
    });
  });
};

initialScript();
