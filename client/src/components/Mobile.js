import React, { useContext, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { MdClose } from "react-icons/md";
import { ContextApp } from "../utils/Context";
import { useNavigate } from "react-router-dom";
import { fetchSessions } from "./Helpers.js";
import axios from "axios";

function Mobile({ setMessage }) {
  const { Mobile, setMobile, setSessionId, setSessions, sessions } =
    useContext(ContextApp);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFetchSessions = async () => {
      try {
        const response = await fetchSessions();
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
    <div className="absolute left-0 top-0 w-full z-50  bg-black/40 flex justify-between items-start">
      <div
        className={
          Mobile
            ? "h-screen bg-gray-900 w-[300px]  flex items-center justify-between p-2 text-white flex-col translate-x-0"
            : "hidden"
        }
      >
        <div className="flex items-start justify-between w-full">
          <span
            className="border border-gray-600  rounded w-full py-2 text-xs flex gap-1 items-center justify-center cursor-pointer "
            onClick={() => {
              setSessionId("");
              setMessage([]);
              navigate(`/chat`);
            }}
          >
            <AiOutlinePlus fontSize={18} />
            New Chat
          </span>
        </div>
        {/* middle section  */}
        {/* <div className="h-[80%] w-full p-2 flex items-start justify-start flex-col overflow-hidden overflow-y-auto text-sm scroll my-2">
          
          <span
            className="rounded w-full py-3 px-2 text-xs my-2 flex gap-1 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden truncate whitespace-nowrap"
            value={"What is Programming?"}
            onClick={handleQuery}
          >
            <span className="flex gap-2 items-center justify-center text-base">
              <FiMessageSquare />
              <span className="text-sm">What is Programming?</span>
            </span>
          </span>
          <span
            className="rounded w-full py-3 px-2 text-xs my-2 flex gap-2 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden truncate whitespace-nowrap "
            value={"How to use an API?"}
            onClick={handleQuery}
          >
            <span className="flex gap-2 items-center justify-center text-base">
              <FiMessageSquare />
              <span className="text-sm">How to use an API?</span>
            </span>
          </span>
        </div> */}
        <div className="h-[80%] w-full p-2 flex items-start justify-start flex-col overflow-hidden overflow-y-auto text-sm scroll my-2">
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
      {Mobile && (
        <span
          className="border border-gray-600 text-white m-2 rounded px-3 py-[9px] flex items-center justify-center cursor-pointer"
          title="Close sidebar"
          onClick={() => setMobile(!Mobile)}
        >
          <MdClose />
        </span>
      )}
    </div>
  );
}

export default Mobile;
