import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import About from "./pages/About";
import AdvancedSearch from "./pages/AdvancedSearch";
import Home from "./pages/Home";
import "./styles/general.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <AppHeader></AppHeader>
        <main style={{ paddingTop: "70px", height: "100%" }}>
          <Routes>
            <Route path="/" element={<Home></Home>}></Route>
            <Route
              path="/advancedSearch"
              element={<AdvancedSearch></AdvancedSearch>}
            ></Route>
            <Route path="/about" element={<About></About>}></Route>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
