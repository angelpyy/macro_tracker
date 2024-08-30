import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch('api/user',  {
          headers:{
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to authenticate");
        }
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("An error occurred while checking authentication status", error);
        await logout();
      }
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("An error occurred while fetching user data", error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Login failed!");
      }
      localStorage.setItem("token", responseData.token);
      setIsAuthenticated(true);
      fetchUserData(responseData.token);
      navigate("/home");
    } catch (error) {
      console.error("An error occurred while logging in", error);
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed!");
      }
      localStorage.setItem("token", responseData.token);
      setIsAuthenticated(true);
      fetchUserData(responseData.token);
      navigate("/home");
    } catch (error) {
      console.error("An error occurred while registering", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  }

  const handleUnauthorized = () => {
    logout();
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, handleUnauthorized  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
