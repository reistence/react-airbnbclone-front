import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import About from "./pages/About";
import AdvancedSearch from "./pages/AdvancedSearch";
import Home from "./pages/Home";
import "./styles/general.scss";
import { AppContext } from "./Contexts/AppContext";
import EstatePage from "./pages/EstatePage";

function App() {
  const [city, setCity] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <AppHeader></AppHeader>
        <AppContext.Provider value={{ city, setCity }}>
          <main style={{ paddingTop: "70px" }}>
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route
                path="/advancedSearch"
                element={<AdvancedSearch></AdvancedSearch>}
              ></Route>
              <Route path="/about" element={<About></About>}></Route>
              <Route
                path="/estate/:slug"
                element={<EstatePage></EstatePage>}
              ></Route>
            </Routes>
          </main>
        </AppContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
