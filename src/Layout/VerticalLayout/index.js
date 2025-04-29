// src/Layout/VerticalLayout/index.js
import React from 'react';
import '../../assets/scss/custom/limonian-theme.scss';

const VerticalLayout = ({ children }) => {
  return (
    <div className="limonian-layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-img">L</div>
              <h1>Limonian AI</h1>
            </div>
            <div className="user-profile">
              <div className="user-info">
                <div className="user-name">{localStorage.getItem('username') || 'User'}</div>
                <div className="user-dept">{localStorage.getItem('userDepartment') || 'Department'}</div>
              </div>
              <div className="avatar">{(localStorage.getItem('username') || 'U').charAt(0)}</div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <div className="app-container">
            <div className="app-sidebar">
              <div className="sidebar-section">
                <h3>Main</h3>
                <ul className="sidebar-menu">
                  <li>
                    <a href="/dashboard" className={window.location.pathname === '/dashboard' ? 'active' : ''}>
                      <div className="menu-icon">📊</div>
                      <span>Dashboard</span>
                    </a>
                  </li>
                  <li>
                    <a href="/chat" className={window.location.pathname === '/chat' ? 'active' : ''}>
                      <div className="menu-icon">💬</div>
                      <span>AI Chat</span>
                    </a>
                  </li>
                </ul>
              </div>
              
              <div className="sidebar-section">
                <h3>Account</h3>
                <ul className="sidebar-menu">
                  <li>
                    <a href="/login" onClick={() => localStorage.clear()}>
                      <div className="menu-icon">🚪</div>
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="app-content">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="copyright">© {new Date().getFullYear()} Limonian Co., Ltd. All rights reserved.</div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerticalLayout;