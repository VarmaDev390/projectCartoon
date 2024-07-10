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
    const baseUrl = process.env.REACT_APP_API;
    console.log("baseUrl", baseUrl);
    let response = await axios.get(`${baseUrl}/chats`);
    return response.data;
  } catch (err) {
    console.error("Error fetching chat sessions:", err);
    throw err;
  }
};
