import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home/home";
import Main from "./components/Mainmenu/mainmenu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
