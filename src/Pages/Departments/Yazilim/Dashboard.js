// src/Pages/Departments/Yazilim/Dashboard.js
// Örnek Yazılım Departmanı Dashboard'u

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { Code, GitBranch, Cpu, Activity, Bug, CheckCircle } from 'lucide-react';
import '../../Dashboard/DashboardNew.css';

const YazilimDashboard = () => {
  const [stats, setStats] = useState({
    activeProjects: 12,
    codeReviews: 8,
    deployments: 15,
    bugs: 3
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'deployment', message: 'Frontend v2.1.0 başarıyla deploy edildi', time: '2 saat önce' },
    { id: 2, type: 'review', message: 'Login sistemi kodu incelendi', time: '4 saat önce' },
    { id: 3, type: 'bug', message: 'Chat sistemi bug\'ı düzeltildi', time: '6 saat önce' },
    { id: 4, type: 'commit', message: 'Database optimizasyonu commit\'lendi', time: '1 gün önce' }
  ]);

  const username = localStorage.getItem('username') || 'Geliştirici';

  return (
    <div className="limonian-dashboard">
      <div className="limonian-dashboard-header">
        <div className="limonian-date-display">
          <span>{new Date().toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <div className="limonian-dashboard-welcome">
        <h1>Merhaba, {username}!</h1>
        <p>Yazılım geliştirme dashboard'unuza hoş geldiniz. Projelerinizi, kod incelemelerinizi ve deployment'larınızı buradan takip edebilirsiniz.</p>
      </div>

      <div className="limonian-dashboard-stats">
        <div className="limonian-stat-grid">
          <div className="limonian-stat-card">
            <div className="limonian-stat-icon blue">
              <Code size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Aktif Projeler</div>
              <div className="limonian-stat-value">{stats.activeProjects}</div>
            </div>
          </div>

          <div className="limonian-stat-card">
            <div className="limonian-stat-icon teal">
              <GitBranch size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Kod İncelemeleri</div>
              <div className="limonian-stat-value">{stats.codeReviews}</div>
            </div>
          </div>

          <div className="limonian-stat-card">
            <div className="limonian-stat-icon purple">
              <Cpu size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Deployment'lar</div>
              <div className="limonian-stat-value">{stats.deployments}</div>
            </div>
          </div>

          <div className="limonian-stat-card">
            <div className="limonian-stat-icon gold">
              <Bug size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Açık Bug'lar</div>
              <div className="limonian-stat-value">{stats.bugs}</div>
            </div>
          </div>
        </div>
      </div>

      <Row>
        <Col lg={8}>
          <div className="limonian-chart-card">
            <div className="limonian-chart-header">
              <h2>Son Aktiviteler</h2>
            </div>
            <div className="limonian-chart-body">
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'deployment' && <Cpu size={16} />}
                      {activity.type === 'review' && <GitBranch size={16} />}
                      {activity.type === 'bug' && <Bug size={16} />}
                      {activity.type === 'commit' && <CheckCircle size={16} />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-message">{activity.message}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
        
        <Col lg={4}>
          <div className="limonian-chart-card">
            <div className="limonian-chart-header">
              <h2>Hızlı Başlat</h2>
            </div>
            <div className="limonian-chart-body">
              <div className="quick-actions">
                <button className="quick-action-btn">
                  <Code size={20} />
                  <span>Yeni Proje</span>
                </button>
                <button className="quick-action-btn">
                  <GitBranch size={20} />
                  <span>Kod İnceleme</span>
                </button>
                <button className="quick-action-btn">
                  <Cpu size={20} />
                  <span>Deploy Et</span>
                </button>
                <button className="quick-action-btn">
                  <Activity size={20} />
                  <span>Test Çalıştır</span>
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default YazilimDashboard;