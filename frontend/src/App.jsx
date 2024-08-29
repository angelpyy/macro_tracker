import React, { useEffect, useState } from "react";
import { Routes, Route, Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MeowcroNavbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import HomePage from "./components/HomePage";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
      <AuthProvider>
        <MeowcroNavbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;