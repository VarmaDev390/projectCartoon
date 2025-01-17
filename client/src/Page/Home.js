// import React from "react";
// import LeftNav from "../components/LeftNav";
// import ChatContainer from "../components/ChatContainer";
// import Mobile from "../components/Mobile";

// function Home() {
//   return (
//     <div className="flex w-screen relative">
//       <LeftNav />
//       <ChatContainer />
//       <span className="flex lg:hidden">
//         <Mobile />
//       </span>
//     </div>
//   );
// }

// export default Home;

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LeftNav from "../components/LeftNav";
import ChatContainer from "../components/ChatContainer";
import Mobile from "../components/Mobile";
import { ContextApp } from "../utils/Context";
import NoService from "../components/NoService";

function Home() {
  const { sessionId } = useParams();
  const [message, setMessage] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // const { setSessionId } = useContext(ContextApp);
  const navigate = useNavigate();
  console.log("sessionId", sessionId);

  // const toggleDialog = () => {
  //   setIsDialogOpen((prev) => !prev);
  // };

  // Fetch data when sessionId changes
  useEffect(() => {
    if (sessionId) {
      const baseUrl = process.env.REACT_APP_API;
      axios
        .get(`${baseUrl}/chat/:${sessionId}`)
        .then((response) => {
          console.log("sessiondata", response.data);
          setMessage(response.data);
          // setSessionId(sessionId);
        })
        .catch((error) => {
          console.error("Error fetching session messages:", error);
        });
    }
  }, [sessionId]);

  return (
    <div className="flex w-screen relative">
      <NoService isOpen={isDialogOpen} />
      <LeftNav message={message} setMessage={setMessage} />
      <ChatContainer message={message} setMessage={setMessage} />
      <span className="flex lg:hidden">
        <Mobile message={message} setMessage={setMessage} />
      </span>
    </div>
  );
}

export default Home;
