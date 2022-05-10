import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EnterName from "./components/EnterName/EnterName";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<EnterName />} />
      </Routes>
    </Router>
  );
};

export default App;
