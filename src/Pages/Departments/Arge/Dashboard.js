// src/Pages/Departments/Arge/Dashboard.js - Rakip analizi linki eklendi
// Ar-Ge departmanı dashboard'u

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Database, 
  Search, 
  Brain,
  Beaker,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import '../../Dashboard/DashboardNew.css';
import './Dashboard.css';

const ArgeDashboard = () => {
  const [stats, setStats] = useState({
    totalAnalysis: 47,
    activeProjects: 12,
    dataPoints: 1847,
    insights: 23
  });

  const [recentActivity, setRecentActivity] = useState([
    { 
      id: 1, 
      type: 'analysis', 
      message: 'Olive Young ürün analizi tamamlandı', 
      time: '2 saat önce',
      status: 'success'
    },
    { 
      id: 2, 
      type: 'research', 
      message: 'Yeni pazar araştırması başlatıldı', 
      time: '4 saat önce',
      status: 'progress'
    },
    { 
      id: 3, 
      type: 'insight', 
      message: 'Trend analizi raporunda önemli bulgular', 
      time: '6 saat önce',
      status: 'info'
    },
    { 
      id: 4, 
      type: 'data', 
      message: 'Veri toplama işlemi başarıyla tamamlandı', 
      time: '1 gün önce',
      status: 'success'
    },
    { 
      id: 5, 
      type: 'project', 
      message: 'Yeni Ar-Ge projesi onay aşamasında', 
      time: '2 gün önce',
      status: 'pending'
    }
  ]);

  // GÜNCELLENEN HIZLI AKSIYONLAR - RAKİP ANALİZİ EKLENDİ
  const [quickActions] = useState([
    {
      title: 'Ürün Analizi',
      description: 'Pazar ürünlerini analiz et',
      icon: <BarChart3 size={20} />,
      action: '/arge/product-analysis',
      color: 'blue'
    },
    {
      title: 'Rakip Analizi',
      description: 'Rakipleri karşılaştır ve analiz et',
      icon: <Target size={20} />,
      action: '/arge/competitor-analysis',
      color: 'teal'
    },
    {
      title: 'Trend Araştırması',
      description: 'Pazar trendlerini keşfet',
      icon: <TrendingUp size={20} />,
      action: '/arge/trend-research',
      color: 'purple'
    },
    {
      title: 'AI Analiz',
      description: 'Yapay zeka destekli analiz',
      icon: <Brain size={20} />,
      action: '/chat',
      color: 'gold'
    }
  ]);

  const username = localStorage.getItem('username') || 'Ar-Ge Uzmanı';

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
        <p>Ar-Ge dashboard'unuza hoş geldiniz. Ürün analizlerinizi, pazar araştırmalarınızı ve trend takiplerinizi buradan yönetebilirsiniz.</p>
      </div>

      <div className="limonian-dashboard-stats">
        <div className="limonian-stat-grid">
          <div className="limonian-stat-card">
            <div className="limonian-stat-icon blue">
              <BarChart3 size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Toplam Analiz</div>
              <div className="limonian-stat-value">{stats.totalAnalysis}</div>
            </div>
          </div>

          <div className="limonian-stat-card">
            <div className="limonian-stat-icon teal">
              <Beaker size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Aktif Projeler</div>
              <div className="limonian-stat-value">{stats.activeProjects}</div>
            </div>
          </div>

          <div className="limonian-stat-card">
            <div className="limonian-stat-icon purple">
              <Database size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Veri Noktaları</div>
              <div className="limonian-stat-value">{stats.dataPoints.toLocaleString()}</div>
            </div>
          </div>

          <div className="limonian-stat-card">
            <div className="limonian-stat-icon gold">
              <Target size={24} />
            </div>
            <div className="limonian-stat-content">
              <div className="limonian-stat-title">Bulgular</div>
              <div className="limonian-stat-value">{stats.insights}</div>
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
              <div className="arge-activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="arge-activity-item">
                    <div className={`arge-activity-icon ${activity.status}`}>
                      {activity.type === 'analysis' && <BarChart3 size={16} />}
                      {activity.type === 'research' && <Search size={16} />}
                      {activity.type === 'insight' && <Zap size={16} />}
                      {activity.type === 'data' && <Database size={16} />}
                      {activity.type === 'project' && <Beaker size={16} />}
                    </div>
                    <div className="arge-activity-content">
                      <div className="arge-activity-message">{activity.message}</div>
                      <div className="arge-activity-time">{activity.time}</div>
                    </div>
                    <div className={`arge-activity-status ${activity.status}`}>
                      <div className="status-dot"></div>
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
              <div className="arge-quick-actions">
                {quickActions.map((action, index) => (
                  <a 
                    key={index} 
                    href={action.action}
                    className={`arge-quick-action-btn ${action.color}`}
                  >
                    <div className="arge-action-icon">
                      {action.icon}
                    </div>
                    <div className="arge-action-content">
                      <div className="arge-action-title">{action.title}</div>
                      <div className="arge-action-description">{action.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Research Progress */}
      <Row className="mt-4">
        <Col lg={6}>
          <div className="limonian-chart-card">
            <div className="limonian-chart-header">
              <h2>Araştırma İlerlemesi</h2>
            </div>
            <div className="limonian-chart-body">
              <div className="arge-progress-list">
                <div className="arge-progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Pazar Analizi</span>
                    <span className="progress-percent">85%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '85%', backgroundColor: '#4285f4' }}></div>
                  </div>
                </div>
                
                <div className="arge-progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Kullanıcı Davranış Analizi</span>
                    <span className="progress-percent">72%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '72%', backgroundColor: '#12c4b4' }}></div>
                  </div>
                </div>
                
                <div className="arge-progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Rekabet Analizi</span>
                    <span className="progress-percent">58%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '58%', backgroundColor: '#9c27b0' }}></div>
                  </div>
                </div>
                
                <div className="arge-progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Trend Projeksiyonu</span>
                    <span className="progress-percent">41%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '41%', backgroundColor: '#f1ba85' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        
        <Col lg={6}>
          <div className="limonian-chart-card">
            <div className="limonian-chart-header">
              <h2>Bu Hafta Yapılacaklar</h2>
            </div>
            <div className="limonian-chart-body">
              <div className="arge-todo-list">
                <div className="arge-todo-item completed">
                  <div className="todo-checkbox checked">
                    <Activity size={12} />
                  </div>
                  <span className="todo-text">Olive Young ürün analizi</span>
                </div>
                
                <div className="arge-todo-item">
                  <div className="todo-checkbox">
                  </div>
                  <span className="todo-text">Rekabet analizi raporu hazırlama</span>
                </div>
                
                <div className="arge-todo-item">
                  <div className="todo-checkbox">
                  </div>
                  <span className="todo-text">Yeni veri kaynağı entegrasyonu</span>
                </div>
                
                <div className="arge-todo-item">
                  <div className="todo-checkbox">
                  </div>
                  <span className="todo-text">Trend analizi sunumu</span>
                </div>
                
                <div className="arge-todo-item">
                  <div className="todo-checkbox">
                  </div>
                  <span className="todo-text">AI model optimizasyonu</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ArgeDashboard;