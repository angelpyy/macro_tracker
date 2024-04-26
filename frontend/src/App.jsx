import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";

function App() {
  let navigate = useNavigate();

  return (
    <div>
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
      </Routes>
    </div>
  );
}

export default App;