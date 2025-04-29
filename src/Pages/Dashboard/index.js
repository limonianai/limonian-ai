// src/Pages/Dashboard/index.js
import React from 'react';
import { Container } from 'reactstrap';
import "../../assets/scss/custom/limonian-theme.scss";

const Dashboard = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <div className="welcome-section">
          <h2>Welcome to Limonian AI Portal</h2>
          <p>Access your AI tools and assistants designed to accelerate your workflows.</p>
        </div>
        
        <div className="department-tools">
          <h2>AI Tools</h2>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-icon">💬</div>
              <h3>AI Chat</h3>
              <p>Chat with our advanced AI to get answers to your questions.</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon">📊</div>
              <h3>Data Analysis</h3>
              <p>Analyze data with AI-powered insights and visualizations.</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon">📝</div>
              <h3>Content Generator</h3>
              <p>Generate high-quality content with AI assistance.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;