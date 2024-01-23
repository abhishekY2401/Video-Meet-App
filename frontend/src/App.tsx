import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import { Register } from "./components/Register";
import { Login } from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<Register />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
