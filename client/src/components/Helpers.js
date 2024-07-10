import axios from "axios";

// export const fetchSessions = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let response = await axios.get("http://localhost:3001/chats");
//       resolve(response.data);
//     } catch (err) {
//       console.error("Error fetching chat sessions:", err);
//       reject(err);
//     }
//   });
// };

export const fetchSessions = async () => {
  try {
    let response = await axios.get("http://localhost:3001/chats");
    return response.data;
  } catch (err) {
    console.error("Error fetching chat sessions:", err);
    throw err;
  }
};
