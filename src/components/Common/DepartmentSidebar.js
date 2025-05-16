// src/components/Common/DepartmentSidebar.js - Tamamen Düzeltilmiş
import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../../assets/scss/custom/limonian-theme.scss';

const DepartmentSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // localStorage'dan departman bilgisini al
  const userDepartment = localStorage.getItem("userDepartment") || "General";
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  
  // Admin kullanıcı için departman adını düzelt
  const displayDepartment = isAdmin ? "Admin" : userDepartment;
  
  console.log('DepartmentSidebar - Current department:', userDepartment);
  console.log('DepartmentSidebar - Is admin:', isAdmin);
  console.log('DepartmentSidebar - Display department:', displayDepartment);

  return (
    <div className="app-sidebar">
      {/* Department Info */}
      <div className="sidebar-section">
        <div className="department-info">
        
        </div>
      </div>

      {/* Yazilim Departmanı için özel menu */}
      {userDepartment === 'Yazilim' && (
        <>
          <div className="sidebar-section">
            <h3>Geliştirme</h3>
            <ul className="sidebar-menu">
              <li>
                <Link 
                  to="/yazilim/dashboard"
                  className={location.pathname === "/yazilim/dashboard" ? "active" : ""}
                >
                  <div className="menu-icon">📊</div>
                  <span>Yazılım Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/chat"
                  className={location.pathname === "/chat" ? "active" : ""}
                >
                  <div className="menu-icon">💬</div>
                  <span>AI Chat</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/yazilim/code-test"
                  className={location.pathname === "/yazilim/code-test" ? "active" : ""}
                >
                  <div className="menu-icon">🧪</div>
                  <span>AI Kod Testi</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/yazilim/projects"
                  className={location.pathname === "/yazilim/projects" ? "active" : ""}
                >
                  <div className="menu-icon">📁</div>
                  <span>Projeler</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Araçlar</h3>
            <ul className="sidebar-menu">
              <li>
                <Link 
                  to="/yazilim/deployment"
                  className={location.pathname === "/yazilim/deployment" ? "active" : ""}
                >
                  <div className="menu-icon">🚀</div>
                  <span>Deployment</span>
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Admin Departmanı için özel menu */}
      {isAdmin && (
        <div className="sidebar-section">
          <h3>Yönetim</h3>
          <ul className="sidebar-menu">
            <li>
              <Link 
                to="/admin/dashboard"
                className={location.pathname === "/admin/dashboard" ? "active" : ""}
              >
                <div className="menu-icon">📊</div>
                <span>Admin Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/chat"
                className={location.pathname === "/chat" ? "active" : ""}
              >
                <div className="menu-icon">💬</div>
                <span>AI Chat</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users"
                className={location.pathname === "/admin/users" ? "active" : ""}
              >
                <div className="menu-icon">👥</div>
                <span>Kullanıcı Yönetimi</span>
              </Link>
            </li>
            <li>
  <Link 
    to="/admin/create-user"
    className={location.pathname === "/admin/create-user" ? "active" : ""}
  >
    <div className="menu-icon">👤</div>
    <span>Kullanıcı Oluştur</span>
  </Link>
</li>
             <li>
              <Link 
                to="/admin/chat-interactions"
                className={location.pathname === "/admin/chat-interactions" ? "active" : ""}
              >
                <div className="menu-icon">📋</div>
                <span>Tüm Sohbetler</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/reports"
                className={location.pathname === "/admin/reports" ? "active" : ""}
              >
                <div className="menu-icon">📈</div>
                <span>Raporlar</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Hiçbir özel departman yoksa varsayılan menu */}
      {!isAdmin && userDepartment !== 'Yazilim' && (
        <div className="sidebar-section">
          <h3>Genel</h3>
          <ul className="sidebar-menu">
            <li>
              <Link 
                to="/chat"
                className={location.pathname === "/chat" ? "active" : ""}
              >
                <div className="menu-icon">💬</div>
                <span>AI Chat</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Help Section */}
      <div className="sidebar-section">
        <h3>Yardım</h3>
        <ul className="sidebar-menu">
          <li>
            <Link to="/how-to-use" className={location.pathname === "/how-to-use" ? "active" : ""}>
              <div className="menu-icon">❓</div>
              <span>Nasıl Kullanılır</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Account Section */}
      <div className="sidebar-section">
        <h3>Hesap</h3>
        <ul className="sidebar-menu">
          <li>
            <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
              <div className="menu-icon">👤</div>
              <span>Profil</span>
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="sidebar-logout-btn"
            >
              <div className="menu-icon">🚪</div>
              <span>Çıkış Yap</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DepartmentSidebar;