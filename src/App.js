// src/App.js - Basit ve stabil route yapısı
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./assets/scss/custom/limonian-theme.scss";

// Import pages
import Login from "./Pages/Authentication/Login";
import Chat from "./Pages/Chat/Chat";
import AdminDashboard from "./Pages/Dashboard";
import YazilimDashboard from "./Pages/Departments/Yazilim/Dashboard";
import CodeTest from "./Pages/Departments/Yazilim/CodeTest";
import ListUsers from "./Pages/Admin/listUsers";
import ChatInteractions from "./Pages/Admin/ChatInteractions";
import CreateUser from "./Pages/Admin/CreateUser";
import ArgeDashboard from "./Pages/Departments/Arge/Dashboard";
import ProductAnalysis from "./Pages/Departments/Arge/ProductAnalysis";
// Import layouts
import VerticalLayout from "./Layout/VerticalLayout";

// Basit Auth Check
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userDepartment = localStorage.getItem("userDepartment");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/chat" replace />;
  }
 
  return children;
};

// Root Redirect
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userDepartment = localStorage.getItem("userDepartment");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (userDepartment === "Yazilim") {
    return <Navigate to="/yazilim/dashboard" replace />;
  }

  return <Navigate to="/chat" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        
        {/* Root */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <VerticalLayout>
              <AdminDashboard />
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <VerticalLayout>
              <ListUsers />
            </VerticalLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/chat-interactions" element={
  <ProtectedRoute requireAdmin={true}>
    <VerticalLayout>
      <ChatInteractions />
    </VerticalLayout>
  </ProtectedRoute>
} />
<Route path="/admin/create-user" element={
  <ProtectedRoute requireAdmin={true}>
    <VerticalLayout>
      <CreateUser />
    </VerticalLayout>
  </ProtectedRoute>
} />

        {/* Yazilim */}
        <Route path="/yazilim/dashboard" element={
          <ProtectedRoute>
            <VerticalLayout>
              <YazilimDashboard />
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/yazilim/code-test" element={
          <ProtectedRoute>
            <VerticalLayout>
              <CodeTest />
            </VerticalLayout>
          </ProtectedRoute>
        } />
        {/* Arge */}
        <Route path="/arge/dashboard" element={
          <ProtectedRoute>
            <VerticalLayout>
              <ArgeDashboard />
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/arge/product-analysis" element={
          <ProtectedRoute>
            <VerticalLayout>
              <ProductAnalysis />
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/arge/trend-research" element={
          <ProtectedRoute>
            <VerticalLayout>
              <div className="limonian-dashboard">
                <h1>Trend Araştırması</h1>
                <p>Bu sayfa geliştirilecek.</p>
              </div>
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/arge/data-collection" element={
          <ProtectedRoute>
            <VerticalLayout>
              <div className="limonian-dashboard">
                <h1>Veri Toplama</h1>
                <p>Bu sayfa geliştirilecek.</p>
              </div>
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/arge/reports" element={
          <ProtectedRoute>
            <VerticalLayout>
              <div className="limonian-dashboard">
                <h1>Raporlar</h1>
                <p>Bu sayfa geliştirilecek.</p>
              </div>
            </VerticalLayout>
          </ProtectedRoute>
        } />
        {/* Common */}
        <Route path="/chat" element={
          <ProtectedRoute>
            <VerticalLayout>
              <Chat />
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/how-to-use" element={
          <ProtectedRoute>
            <VerticalLayout>
              <div className="limonian-dashboard">
                <h1>Nasıl Kullanılır</h1>
                <p>Bu sayfa geliştirilecek.</p>
              </div>
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <VerticalLayout>
              <div className="limonian-dashboard">
                <h1>Profil</h1>
                <p>Bu sayfa geliştirilecek.</p>
              </div>
            </VerticalLayout>
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;