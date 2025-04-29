// src/Routes/AuthProtected.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthProtected = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export { AuthProtected };