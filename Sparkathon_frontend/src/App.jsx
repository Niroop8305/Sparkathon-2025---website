import React from "react";
// Remove token from localStorage on every app load (for development)
localStorage.removeItem("token");
import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    // exp is in seconds, Date.now() is in ms
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
}

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = isTokenValid(token);
  console.log("Token:", token);
  if (token && !isAuthenticated) {
    localStorage.removeItem("token");
  }
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;
