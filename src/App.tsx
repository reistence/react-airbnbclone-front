import { useState } from "react";
import AppHeader from "./components/AppHeader";
import "./styles/general.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <AppHeader></AppHeader>
      <main style={{ paddingTop: "70px", height: "100%" }}></main>
    </div>
  );
}

export default App;
