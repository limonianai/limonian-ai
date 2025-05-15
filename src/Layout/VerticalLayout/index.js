// src/Layout/VerticalLayout/index.js - Import'u kontrol edin
import React from 'react';
import DepartmentSidebar from '../../components/Common/DepartmentSidebar'; // Bu satır doğru mu?
import '../../assets/scss/custom/limonian-theme.scss';

// Eski Sidebar import'u varsa, onu silin:
// import Sidebar from '../../components/Common/Sidebar'; // BU SATIR VARSA SİLİN

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
              <div className="avatar">{(localStorage.getItem('username') || 'U').charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <div className="app-container">
            {/* DepartmentSidebar kullandığınızdan emin olun */}
            <DepartmentSidebar />
            
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