import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MeowcroNavbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import HomePage from "./components/HomePage";

function App() {
  let navigate = useNavigate();

  return (
    <div>
      <MeowcroNavbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/home" element={<HomePage />} />
        </Route> 
      </Routes>
    </div>
  );
}

export default App;