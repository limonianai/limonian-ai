import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./assets/scss/custom/limonian-theme.scss";

// Import pages
import Login from "./Pages/Authentication/Login";
import Dashboard from "./Pages/Dashboard";
import Chat2 from "./Routes/Chat";
import { AuthProtected } from "./Routes/AuthProtected";
import Chat from "./Pages/Chat/Chat";

// Import layouts
import VerticalLayout from "./Layout/VerticalLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <AuthProtected>
            <VerticalLayout>
              <Dashboard />
            </VerticalLayout>
          </AuthProtected>
        } />
        
        <Route path="/chat" element={
          <AuthProtected>
            <VerticalLayout>
              <Chat />
            </VerticalLayout>
          </AuthProtected>
        } />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;