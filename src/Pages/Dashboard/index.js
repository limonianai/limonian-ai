import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Card, CardBody, Row, Col, Container, Spinner, Progress } from 'reactstrap';
import Chart from 'react-apexcharts';
import { Calendar, Clock, Users, MessageSquare, FileText, Award } from 'lucide-react';
import './DashboardNew.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, interactions: 0, files: 0 });
  const [topUsers, setTopUsers] = useState([]);
  const [departmentData, setDepartmentData] = useState({ labels: [], series: [] });
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weeklyInteractions, setWeeklyInteractions] = useState([]);
  
  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Format date
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  };

  // Format time
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('tr-TR', options);
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchDepartmentStats();
    fetchSummary();
    generateMockWeeklyData(); // In a real app, replace with actual data fetch
  }, []);

  const generateMockWeeklyData = () => {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const data = days.map(day => ({
      day,
      count: Math.floor(Math.random() * 40) + 10,
    }));
    setWeeklyInteractions(data);
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(response);

      const topUsersResponse = await axiosInstance.get('/admin/top-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTopUsers(topUsersResponse);

      const fileCountResponse = await axiosInstance.get('/admin/file-count', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats((prevStats) => ({ ...prevStats, files: fileCountResponse.count }));
    } catch (err) {
      console.error('Dashboard verileri alınırken hata oluştu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/department-chat-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const labels = response.map((item) => item.Department || 'Bilinmeyen');
      const series = response.map((item) => item.ChatCount);
      setDepartmentData({ labels, series });
    } catch (err) {
      console.error('Departman bazında chat kullanım istatistikleri alınırken hata oluştu:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('https://limonianai.online/api/admin/summary', {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      if (!response.body) {
        throw new Error('Yanıt akışı başlatılamadı.');
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let receivedLength = 0;
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
        setProgress(Math.min((receivedLength / 10000) * 100, 100));
  
        let chunk = decoder.decode(value, { stream: true });
        chunk = chunk.replace(/【\d+:\d+†source】/g, '');
        chunk = chunk.replace(/^{"summary":"|"}$/g, '');
        chunk = chunk.replace(/\\n/g, '<br>');
        
        result += chunk;
        setSummary((prev) => prev + chunk);
      }
  
      setProgress(100);
    } catch (err) {
      console.error('Özet alınırken hata oluştu:', err);
      setProgress(0);
    }
  };

  const weeklyChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    colors: ['#12c4b4'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#4285f4',
            opacity: 0.4
          },
          {
            offset: 100,
            color: '#12c4b4',
            opacity: 0.1
          },
        ]
      },
    },
    xaxis: {
      categories: weeklyInteractions.map(item => item.day),
      labels: {
        style: {
          colors: '#a0a0a0'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#a0a0a0'
        }
      }
    },
    grid: {
      borderColor: 'rgba(66, 133, 244, 0.1)',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const weeklyChartSeries = [
    {
      name: 'Etkileşimler',
      data: weeklyInteractions.map(item => item.count)
    }
  ];

  // Render each stat card with icon
  const renderStatCard = (icon, title, value, color) => (
    <div className="limonian-stat-card">
      <div className={`limonian-stat-icon ${color}`}>
        {icon}
      </div>
      <div className="limonian-stat-content">
        <div className="limonian-stat-title">{title}</div>
        <div className="limonian-stat-value">{value}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="limonian-loading">
        <div className="limonian-loading-spinner"></div>
        <p>Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="limonian-dashboard">
      <div className="limonian-dashboard-header">
        <div className="limonian-date-display">
          <div className="limonian-date-icon">
            <Calendar size={20} />
          </div>
          <span>{formatDate(currentTime)}</span>
        </div>
        <div className="limonian-time-display">
          <div className="limonian-time-icon">
            <Clock size={20} />
          </div>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>

      <div className="limonian-dashboard-welcome">
        <h1>Limonian AI Yönetim Paneli</h1>
        <p>Sistem kullanım istatistiklerini, etkileşimleri ve özetleri bu panelden takip edebilirsiniz.</p>
      </div>

      <div className="limonian-dashboard-stats">
        <div className="limonian-stat-grid">
          {renderStatCard(<Users size={24} />, "Toplam Kullanıcı", stats.users, "blue")}
          {renderStatCard(<MessageSquare size={24} />, "Toplam Sohbet", stats.interactions, "teal")}
          {renderStatCard(<FileText size={24} />, "Toplam Dosya", stats.files, "purple")}
          {renderStatCard(<Award size={24} />, "Aktif Kullanıcılar", topUsers.length, "gold")}
        </div>
      </div>

      <div className="limonian-dashboard-charts">
        <Row>
          <Col lg={7}>
            <div className="limonian-chart-card">
              <div className="limonian-chart-header">
                <h2>Haftalık Etkileşim</h2>
                <div className="limonian-chart-legend">
                  <span className="limonian-chart-dot"></span>
                  <span>Etkileşim Sayısı</span>
                </div>
              </div>
              <div className="limonian-chart-body">
                <Chart
                  options={weeklyChartOptions}
                  series={weeklyChartSeries}
                  type="area"
                  height={280}
                />
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="limonian-chart-card">
              <div className="limonian-chart-header">
                <h2>Departman Kullanımı</h2>
              </div>
              <div className="limonian-chart-body">
                <Chart
                  options={{
                    labels: departmentData.labels,
                    legend: { position: 'bottom', horizontalAlign: 'center', labels: { colors: '#e0e0e0' } },
                    colors: ['#4285f4', '#12c4b4', '#9c27b0', '#f1ba85', '#e79476', '#943d2c'],
                    stroke: { width: 0 },
                    dataLabels: {
                      enabled: false,
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '55%',
                        }
                      }
                    }
                  }}
                  series={departmentData.series}
                  type="donut"
                  height={280}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="limonian-dashboard-bottom">
        <Row>
          <Col lg={7}>
            <div className="limonian-summary-card">
              <div className="limonian-summary-header">
                <h2>Sistem Özeti</h2>
                <div className="limonian-summary-progress">
                  <Progress value={progress} className="limonian-progress" />
                </div>
              </div>
              <div className="limonian-summary-body">
                <div className="limonian-summary-content" dangerouslySetInnerHTML={{ __html: summary.replace(/\\n/g, '<br>') }}></div>
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="limonian-users-card">
              <div className="limonian-users-header">
                <h2>En Aktif Kullanıcılar</h2>
              </div>
              <div className="limonian-users-body">
                <ul className="limonian-users-list">
                  {topUsers.map((user, index) => (
                    <li key={user.UserId} className="limonian-user-item">
                      <div className="limonian-user-rank">{index + 1}</div>
                      <div className="limonian-user-avatar">{user.Username.charAt(0)}</div>
                      <div className="limonian-user-info">
                        <div className="limonian-user-name">{user.Username}</div>
                        <div className="limonian-user-dept">{user.Department || 'Genel'}</div>
                      </div>
                      <div className="limonian-user-stats">
                        <div className="limonian-user-messages">
                          <MessageSquare size={14} />
                          <span>{user.MessageCount}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;