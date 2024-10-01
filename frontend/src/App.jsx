import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddStudent from "./components/addStudent";
import Home from "./components/home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addstudent" element={<AddStudent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
