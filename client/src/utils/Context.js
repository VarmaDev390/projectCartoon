// import { createContext, useEffect, useRef, useState } from "react";
// import { sendMsgToAI } from "./OpenAi";
// export const ContextApp = createContext();

// const AppContext = ({ children }) => {
//   const [showSlide, setShowSlide] = useState(false);
//   const [Mobile, setMobile] = useState(false);
//   const [chatValue, setChatValue] = useState("");
//   const [message, setMessage] = useState([
//     {
//       text: "Hi, I'm ChatGPT, a powerful language model created by OpenAI. My primary function is to assist users in generating human-like text based on the prompts and questions I receive. I have been trained on a diverse range of internet text up until September 2021, so I can provide information, answer questions, engage in conversations, offer suggestions, and more on a wide array of topics. Please feel free to ask me anything or let me know how I can assist you today!",
//       isBot: true,
//     },
//   ]);
//   const msgEnd = useRef(null);

//   useEffect(() => {
//     msgEnd.current.scrollIntoView();
//   }, [message]);

//   // button Click function
//   const handleSend = async () => {
//     const text = chatValue;
//     setChatValue("");
//     setMessage([...message, { text, isBot: false }]);
//     const res = await sendMsgToAI(text);
//     setMessage([
//       ...message,
//       { text, isBot: false },
//       { text: res, isBot: true },
//     ]);
//   };

//   // Enter Click function
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSend();
//     }
//   };

//   // Query Click function
//   const handleQuery = async (e) => {
//     const text = e.target.innerText;
//     setMessage([...message, { text, isBot: false }]);
//     const res = await sendMsgToAI(text);
//     setMessage([
//       ...message,
//       { text, isBot: false },
//       { text: res, isBot: true },
//     ]);
//   };
//   return (
//     <ContextApp.Provider
//       value={{
//         showSlide,
//         setShowSlide,
//         Mobile,
//         setMobile,
//         chatValue,
//         setChatValue,
//         handleSend,
//         message,
//         msgEnd,
//         handleKeyPress,
//         handleQuery,
//       }}
//     >
//       {children}
//     </ContextApp.Provider>
//   );
// };
// export default AppContext;
import "event-source";
import { createContext, useEffect, useRef, useState } from "react";
import { sendMsgToAI } from "./OpenAi";
// import { useNavigate } from "react-router-dom";

export const ContextApp = createContext();

const AppContext = ({ children }) => {
  const [showSlide, setShowSlide] = useState(false);
  const [Mobile, setMobile] = useState(false);
  const [chatValue, setChatValue] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);

  // const navigate = useNavigate();
  const [message, setMessage] = useState([]);
  const msgEnd = useRef(null);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [message]);

  // button Click function
  // const handleSend = async () => {
  //   console.log("insinde handlesend");
  //   // text contains the question entered by the user (chatvalue holds the data entered by the user)
  // const text = chatValue;
  // setChatValue("");
  //   // updating the message varaible which is used for displaying on the page (message varaible used for displaying text on the webpage)
  //   setMessage([...message, { content: text, role: "user" }]);
  //   // if (false) {
  //   const response = await fetch("http://localhost:3001/chat", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ message: text }),
  //   });
  //   console.log("response", response);
  //   // if (response.ok) {
  //   //   console.log("inside resp");

  //   //   const eventSource = new EventSource(`http://localhost:3001/chat`);
  //   //   eventSource.onmessage = (event) => {
  //   //     const parsedData = JSON.parse(event.data);
  //   //     setMessage((prevMessages) => [
  //   //       ...prevMessages,
  //   //       { content: parsedData, role: "system" },
  //   //     ]);
  //   //   };

  //   //   eventSource.addEventListener("sessionId", (event) => {
  //   //     console.log("sessionId", event.data);
  //   //     setSessionId(event.data);
  //   //   });

  //   //   eventSource.onerror = (error) => {
  //   //     console.error("EventSource failed:", error);
  //   //     eventSource.close();
  //   //   };
  //   // } else {
  //   //   console.error("Failed to send the initial message");
  //   // }

  //   // }

  //   // setMessage([
  //   //   ...message,
  //   //   { text, isBot: false },
  //   //   { text: res, isBot: true },
  //   // ]);
  // };

  // const handleSend = async () => {
  //   const text = chatValue;
  //   setChatValue("");
  //   setMessage([...message, { content: text, role: "user" }]);
  //   try {
  //     const response = await fetch("http://localhost:3001/chat", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ message: text }),
  //     });

  //     if (!response.body) {
  //       throw new Error("No response body");
  //     }

  //     const reader = response.body.getReader();
  //     let receivedText = "";
  //     let done = false;

  //     const { value: initialChunk, done: initialDone } = await reader.read();
  //     if (initialDone) {
  //       throw new Error("No initial chunk received");
  //     }

  //     const initialText = new TextDecoder().decode(initialChunk);
  //     const initialData = JSON.parse(initialText);
  //     // const sessionId = initialData.sessionId;
  //     setSessionId(initialData.sessionId);
  //     console.log("Session ID:", sessionId);

  //     setMessage((prevMessages) => [
  //       ...prevMessages,
  //       { content: "", role: "assistant" },
  //     ]);

  //     while (!done) {
  //       const { value, done: streamDone } = await reader.read();
  //       if (value) {
  //         const chunk = new TextDecoder().decode(value);
  //         receivedText += chunk;

  //         setMessage((prevMessages) => {
  //           const lastMessageIndex = prevMessages.length - 1;
  //           const updatedMessages = [...prevMessages];
  //           updatedMessages[lastMessageIndex] = {
  //             ...updatedMessages[lastMessageIndex],
  //             content: receivedText,
  //           };
  //           return updatedMessages;
  //         });
  //       }
  //       done = streamDone;
  //     }
  //     navigate(`/chat/${sessionId}`);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  // // Enter Click function
  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     handleSend();
  //   }
  // };

  // Query Click function
  const handleQuery = async (e) => {
    const text = e.target.innerText;
    setMessage([...message, { text, isBot: false }]);
    const res = await sendMsgToAI(text);
    setMessage([
      ...message,
      { text, isBot: false },
      { text: res, isBot: true },
    ]);
  };
  return (
    <ContextApp.Provider
      value={{
        showSlide,
        setShowSlide,
        Mobile,
        setMobile,
        chatValue,
        setChatValue,
        // handleSend,
        message,
        msgEnd,
        // handleKeyPress,
        handleQuery,
        sessionId,
        setSessionId,
        setMessage,
        setSessions,
        sessions,
      }}
    >
      {children}
    </ContextApp.Provider>
  );
};
export default AppContext;
