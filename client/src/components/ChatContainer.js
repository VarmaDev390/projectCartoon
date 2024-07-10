import React, { useContext } from "react";
import { ContextApp } from "../utils/Context";
import { LuPanelLeftOpen } from "react-icons/lu";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { RiSendPlane2Fill } from "react-icons/ri";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";
import { callExternalAPI } from "../utils/OpenAi";
import { fetchSessions } from "./Helpers";

function ChatContainer() {
  const {
    setShowSlide,
    showSlide,
    setMobile,
    Mobile,
    chatValue,
    setChatValue,
    setMessage,
    message,
    setSessionId,
    sessionId,
    setSessions,
    // handleKeyPress,
    // handleSend,
  } = useContext(ContextApp);
  const navigate = useNavigate();
  console.log("Session ID:", sessionId);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    console.log("inside handlesend");
    console.log("Session ID:", sessionId);

    const text = chatValue;
    setChatValue("");
    setMessage([...message, { content: text, role: "user" }]);
    let url = "";
    let tempSessionId = "";
    if (!sessionId) {
      url = "http://localhost:3001/chat";
    } else {
      url = `http://localhost:3001/chat/:${sessionId}`;
    }
    try {
      const response = await callExternalAPI(url, "POST", { message: text });
      if (!response.body) {
        throw new Error("No response body");
      }
      const reader = response.body.getReader();
      let receivedText = "";
      let done = false;
      if (!sessionId) {
        const { value: initialChunk, done: initialDone } = await reader.read();
        if (initialDone) {
          throw new Error("No initial chunk received");
        }

        const initialText = new TextDecoder().decode(initialChunk);
        const initialData = JSON.parse(initialText);
        tempSessionId = initialData.sessionId;
        await setSessionId(initialData.sessionId);
        console.log("Session ID:", initialData.sessionId);
      }

      setMessage((prevMessages) => [
        ...prevMessages,
        { content: "", role: "assistant" },
      ]);

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (value) {
          const chunk = new TextDecoder().decode(value);
          receivedText += chunk;

          setMessage((prevMessages) => {
            const lastMessageIndex = prevMessages.length - 1;
            const updatedMessages = [...prevMessages];
            updatedMessages[lastMessageIndex] = {
              ...updatedMessages[lastMessageIndex],
              content: receivedText,
            };
            return updatedMessages;
          });
        }
        done = streamDone;
      }
      if (!sessionId) {
        navigate(`/chat/:${tempSessionId}`);
      }
      const data = await fetchSessions();
      setSessions(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className={
        showSlide
          ? "h-screen w-screen bg-gray-700 flex items-start justify-between flex-col p-2"
          : "h-screen w-full lg:w-[calc(100%-300px)] bg-gray-700 flex items-start justify-between flex-col p-2"
      }
    >
      <span
        className="rounded px-3 py-[9px] hidden lg:flex items-center justify-center cursor-pointer text-white m-1 hover:bg-gray-600 duration-200"
        title="Open sidebar"
        onClick={() => setShowSlide(!showSlide)}
      >
        {showSlide && <LuPanelLeftOpen />}
      </span>
      <span
        className="rounded px-3 py-[9px] lg:hidden flex items-center justify-center cursor-pointer text-white mt-0 mb-3 border border-gray-600"
        title="Open sidebar"
        onClick={() => setMobile(!Mobile)}
      >
        <HiOutlineMenuAlt2 fontSize={20} />
      </span>
      {/* chat section */}
      <Chat />
      {/* chat input section */}
      <div className=" w-full  m-auto flex items-center justify-center flex-col gap-2 my-2">
        <span className="flex gap-2 items-center justify-center bg-gray-600 rounded-lg shadow-md w-[90%] lg:w-2/5 xl:w-1/2">
          <input
            type="text"
            placeholder="Send a message"
            className="h-full  text-white bg-transparent px-3 py-4 w-full border-none outline-none text-base"
            value={chatValue}
            onChange={(e) => setChatValue(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <RiSendPlane2Fill
            title="send message"
            className={
              chatValue.length <= 0
                ? "text-gray-400 cursor-auto mx-3 text-xl"
                : "text-white cursor-pointer mx-3 text-3xl bg-green-500 p-1 rounded shadow-md "
            }
            onClick={handleSend}
          />
        </span>
        <p className="lg:text-xs text-gray-400 text-center text-[10px]">
          Free Research Preview. ChatGPT may produce inaccurate information
          about people, places, or facts. ChatGPT August 3 Version
        </p>
      </div>
    </div>
  );
}

export default ChatContainer;
