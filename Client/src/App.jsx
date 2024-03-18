import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Screen/home";
import Main from "./Screen/mainmenu";
import ThTable from "./Screen/3x3";
import FoTable from "./Screen/4x4";
import FiTable from "./Screen/5x5";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/tr" element={<ThTable />} />
        <Route path="/fo" element={<FoTable />} />
        <Route path="/fi" element={<FiTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
