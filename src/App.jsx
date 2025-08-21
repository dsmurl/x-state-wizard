import "./App.css";
import { Home } from "./pages/Home.js";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Home />
    </>
  );
}

export default App;
