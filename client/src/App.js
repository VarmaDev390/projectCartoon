// import Home from "./Page/Home";

// function App() {
//   return (
//     <div className="overflow-hidden">
//       <Home />
//     </div>
//   );
// }

// export default App;

import Home from "./Page/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat/:sessionId" element={<Home />} />
        <Route path="/chat" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
