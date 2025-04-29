import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import '../../assets/scss/custom/limonian-theme.scss';

const Sidebar = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);
  const [userDept, setUserDept] = useState("General");

  useEffect(() => {
    // Check if user is admin
    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);

    // Get user department
    const dept = localStorage.getItem("department") || "General";
    setUserDept(dept);

    // Set active path based on current location
    setActivePath(location.pathname);
  }, [location]);

  return (
    <div className="app-sidebar">
      <div className="sidebar-section">
        <h3>Main</h3>
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard" className={activePath === "/dashboard" ? "active" : ""}>
              <div className="menu-icon">📊</div>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/chat" className={activePath === "/chat" ? "active" : ""}>
              <div className="menu-icon">💬</div>
              <span>AI Assistant</span>
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin/list-users" className={activePath === "/admin/list-users" ? "active" : ""}>
                <div className="menu-icon">👥</div>
                <span>Users</span>
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link to="/admin/chat-interactions" className={activePath === "/admin/chat-interactions" ? "active" : ""}>
                <div className="menu-icon">🔍</div>
                <span>Chat History</span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Department</h3>
        <ul className="sidebar-menu">
          <li>
            <Link to="#" className="active">
              <div className="menu-icon">{getDepartmentIcon(userDept)}</div>
              <span>{userDept}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Account</h3>
        <ul className="sidebar-menu">
          <li>
            <Link to="/userprofile" className={activePath === "/userprofile" ? "active" : ""}>
              <div className="menu-icon">👤</div>
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/howto" className={activePath === "/howto" ? "active" : ""}>
              <div className="menu-icon">❓</div>
              <span>Help</span>
            </Link>
          </li>
          <li>
            <Link to="/logout">
              <div className="menu-icon">🚪</div>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Helper function to get appropriate icon for department
const getDepartmentIcon = (department) => {
  const deptIcons = {
    "General": "🏢",
    "R&D": "🧪",
    "Marketing": "📢",
    "Sales": "💰",
    "IT": "💻",
    "HR": "👥",
    "Finance": "💼",
    "CRM": "🤝",
    "İk": "👥",
    "Yazılım": "💻",
    "Grafik": "🎨",
    "Sosyal Medya": "📱"
  };

  return deptIcons[department] || "🏢";
};

export default Sidebar;