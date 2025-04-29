import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import '../../assets/scss/custom/limonian-theme.scss';

const MainLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="limonian-layout">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="app-container">
            <Sidebar />
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;