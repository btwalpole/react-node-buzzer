import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import EnterName from "./components/EnterName/EnterName";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" exact element={<EnterName />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
