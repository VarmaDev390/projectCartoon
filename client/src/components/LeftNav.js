// import React, { useContext, useEffect } from "react";
// import { AiOutlinePlus } from "react-icons/ai";
// import { LuPanelLeftClose } from "react-icons/lu";
// import { FiUser, FiMessageSquare } from "react-icons/fi";
// import { SlOptions } from "react-icons/sl";
// import { ContextApp } from "../utils/Context";
// import { useNavigate } from "react-router-dom";
// import { fetchSessions } from "./Helpers.js";
// import axios from "axios";
// function LeftNav() {
//   const {
//     setShowSlide,
//     showSlide,

//     setSessionId,
//     setMessage,
//     setSessions,
//     sessions,
//   } = useContext(ContextApp);
//   const navigate = useNavigate();
//   // console.log("sessions", sessions);

//   useEffect(() => {
//     const handleFetchSessions = async () => {
//       try {
//         const response = await fetchSessions();
//         setSessions(response);
//       } catch (error) {
//         console.error("Error fetching chat sessions:", error);
//       }
//     };

//     handleFetchSessions();
//   }, []);

//   const handleSessionClick = (sessionId) => {
//     setSessionId(sessionId);

//     // console.log("sessionId", sessionId);

//     // Fetch the session messages from the backend
//     const baseUrl = process.env.REACT_APP_API;
//     axios
//       .get(`${baseUrl}/chat/:${sessionId}`)
//       .then((response) => {
//         console.log("sessiondata", response.data);
//         setMessage(response.data);
//         navigate(`/chat/${sessionId}`);
//       })
//       .catch((error) => {
//         console.error("Error fetching session messages:", error);
//       });
//   };
//   return (
//     // top section
//     <div
//       className={
//         !showSlide
//           ? "h-screen bg-gray-900 w-[300px] border-r border-gray-500 hidden lg:flex items-center justify-between p-2 text-white flex-col translate-x-0"
//           : "hidden"
//       }
//     >
//       <div className="flex items-start justify-between w-full">
//         <span
//           className="border border-gray-600  rounded w-[80%] py-2 text-xs flex gap-1 items-center justify-center cursor-pointer"
//           onClick={() => {
//             setSessionId("");
//             setMessage([]);
//             navigate(`/chat`);
//           }}
//         >
//           <AiOutlinePlus fontSize={18} />
//           New Chat
//         </span>
//         <span
//           className="border border-gray-600  rounded px-3 py-[9px] flex items-center justify-center cursor-pointer"
//           title="Close sidebar"
//           onClick={() => setShowSlide(!showSlide)}
//         >
//           <LuPanelLeftClose />
//         </span>
//       </div>
//       {/* middle section  */}

//       <div className="h-[80%] w-full p-2 flex items-start justify-start flex-col overflow-hidden overflow-y-auto text-sm scroll my-2">
//         {sessions.map((session) => (
//           <span
//             key={session.sessionId}
//             className="rounded w-full py-3 px-2 text-xs my-2 flex gap-2 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden truncate whitespace-nowrap"
//             onClick={() => handleSessionClick(session.sessionId)}
//           >
//             <span className="flex gap-2 items-center justify-center text-base">
//               <FiMessageSquare />
//               <span className="text-sm">Session: {session.sessionId}</span>
//             </span>
//           </span>
//         ))}
//       </div>
//       {/* bottom section  */}
//       <div className="w-full border-t border-gray-600 flex flex-col gap-2 items-center justify-center p-2">
//         <span className="rounded w-full py-2 px-2 text-xs flex gap-1 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300">
//           <span className="flex gap-1 items-center justify-center text-sm">
//             <FiUser />
//             Upgrade to Plus
//           </span>
//           <span className="rounded-md bg-yellow-200 px-1.5 py-0.5 text-xs font-medium uppercase text-gray-800">
//             NEW
//           </span>
//         </span>
//         <span className="rounded w-full py-2 px-2 text-xs flex gap-1 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300">
//           <span className="flex gap-2 items-center justify-center text-sm font-bold">
//             <img
//               src="/user.jpg"
//               alt="user"
//               className="w-8 h-8 object-cover rounded-sm"
//             />
//             User
//           </span>
//           <span className="rounded-md  px-1.5 py-0.5 text-xs font-medium uppercase text-gray-500">
//             <SlOptions />
//           </span>
//         </span>
//       </div>
//     </div>
//   );
// }

// export default LeftNav;

import React, { useContext, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { LuPanelLeftClose } from "react-icons/lu";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { ContextApp } from "../utils/Context";
import { useNavigate } from "react-router-dom";
import { fetchSessions } from "./Helpers.js";
import axios from "axios";

function LeftNav({ setMessage }) {
  const {
    setShowSlide,
    showSlide,

    setSessionId,

    setSessions,
    sessions,
  } = useContext(ContextApp);
  const navigate = useNavigate();
  // console.log("sessions", sessions);

  useEffect(() => {
    const handleFetchSessions = async () => {
      try {
        const response = await fetchSessions();
        console.log("response in fetcheesino", response);
        setSessions(response);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    };

    handleFetchSessions();
  }, []);

  const handleSessionClick = (sessionId) => {
    setSessionId(sessionId);
    navigate(`/chat/${sessionId}`);
  };
  return (
    // top section
    <div
      className={
        !showSlide
          ? "h-screen bg-gray-900 w-[300px] border-r border-gray-500 hidden lg:flex items-center justify-between p-2 text-white flex-col translate-x-0"
          : "hidden"
      }
    >
      <div className="flex items-start justify-between w-full">
        <span
          className="border border-gray-600  rounded w-[80%] py-2 text-xs flex gap-1 items-center justify-center cursor-pointer"
          onClick={() => {
            setSessionId("");
            setMessage([]);
            navigate(`/chat`);
          }}
        >
          <AiOutlinePlus fontSize={18} />
          New Chat
        </span>
        <span
          className="border border-gray-600  rounded px-3 py-[9px] flex items-center justify-center cursor-pointer"
          title="Close sidebar"
          onClick={() => setShowSlide(!showSlide)}
        >
          <LuPanelLeftClose />
        </span>
      </div>
      {/* middle section  */}

      <div className="h-[80%] w-full p-2 flex items-start justify-start flex-col overflow-hidden overflow-y-auto text-sm scroll my-2">
        {/* {sessions.map((session) => (
          <span
            key={session.sessionId}
            className="rounded w-full py-3 px-2 text-xs my-2 flex gap-2 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden truncate whitespace-nowrap"
            onClick={() => handleSessionClick(session.sessionId)}
          >
            <span className="flex gap-2 items-center justify-center text-base">
              <FiMessageSquare />
              <span className="text-sm">Session: {session.sessionId}</span>
            </span>
          </span>
        ))} */}
        {sessions.map((session) => {
          // Extract the latest user message
          const userMessages = session.chatHistory.filter(
            (chat) => chat.role === "user"
          );
          const firstUserMessage =
            userMessages.length > 0
              ? userMessages[0].content
              : "No messages yet";

          // Truncate message if it's too long
          const truncatedMessage =
            firstUserMessage.length > 30
              ? firstUserMessage.slice(0, 30) + "..."
              : firstUserMessage;

          return (
            <span
              key={session.sessionId}
              className="rounded w-full py-3 px-2 text-xs my-2 flex gap-2 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden truncate whitespace-nowrap"
              onClick={() => handleSessionClick(session.sessionId)}
            >
              <span className="flex gap-2 items-center justify-center text-base">
                <FiMessageSquare />
                {/* Display the truncated user message */}
                <span className="text-sm">{truncatedMessage}</span>
              </span>
            </span>
          );
        })}
      </div>
      {/* bottom section  */}
      <div className="w-full border-t border-gray-600 flex flex-col gap-2 items-center justify-center p-2">
        <span className="rounded w-full py-2 px-2 text-xs flex gap-1 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300">
          <span className="flex gap-1 items-center justify-center text-sm">
            <FiUser />
            Upgrade to Plus
          </span>
          <span className="rounded-md bg-yellow-200 px-1.5 py-0.5 text-xs font-medium uppercase text-gray-800">
            NEW
          </span>
        </span>
        <span className="rounded w-full py-2 px-2 text-xs flex gap-1 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300">
          <span className="flex gap-2 items-center justify-center text-sm font-bold">
            <img
              src="/user.jpg"
              alt="user"
              className="w-8 h-8 object-cover rounded-sm"
            />
            User
          </span>
          <span className="rounded-md  px-1.5 py-0.5 text-xs font-medium uppercase text-gray-500">
            <SlOptions />
          </span>
        </span>
      </div>
    </div>
  );
}

export default LeftNav;
