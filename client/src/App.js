import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import EnterName from "./components/EnterName/EnterName";
import Home from "./components/Home/Home"
import Buzzer from "./components/Buzzer/Buzzer";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" exact element={<EnterName />} />
          <Route path="/home" element={<Home />} />
          <Route path="/buzzer" element={<Buzzer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
