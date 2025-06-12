// src/Pages/Departments/Arge/CompetitorAnalysis.js
// Ar-Ge departmanı için rakip analizi sayfası

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Spinner, Alert } from 'reactstrap';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  DollarSign,
  BarChart3,
  Download,
  Eye,
  Star,
  ShoppingCart,
  Target,
  Zap,
  Award,
  Globe,
  Share2
} from 'lucide-react';
import Chart from 'react-apexcharts';
import axiosInstance from '../../../helpers/axiosConfig';
import './CompetitorAnalysis.css';

const CompetitorAnalysis = () => {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - gerçek implementasyonda API'den gelecek
  const mockCompetitors = [
    {
      id: 1,
      name: 'L\'Oréal Paris',
      logo: '/api/placeholder/60/60',
      category: 'Premium',
      marketShare: 18.5,
      productCount: 847,
      avgPrice: 89.90,
      rating: 4.3,
      socialFollowers: 2850000,
      website: 'https://loreal-paris.com.tr',
      strengths: ['Global marka', 'Güçlü AR-GE', 'Premium positioning'],
      weaknesses: ['Yüksek fiyat', 'Sınırlı yerel adaptasyon'],
      recentLaunches: ['Revitalift Laser X3', 'True Match Foundation'],
      marketingStrategy: 'Influencer partnerships, TV ads, Digital campaigns'
    },
    {
      id: 2,
      name: 'Maybelline',
      logo: '/api/placeholder/60/60',
      category: 'Mass Market',
      marketShare: 15.2,
      productCount: 623,
      avgPrice: 45.60,
      rating: 4.1,
      socialFollowers: 1920000,
      website: 'https://maybelline.com.tr',
      strengths: ['Uygun fiyat', 'Trend odaklı', 'Geniş dağıtım'],
      weaknesses: ['Kalite algısı', 'Premium segment yokluğu'],
      recentLaunches: ['SuperStay Matte Ink', 'Lash Sensational'],
      marketingStrategy: 'Social media focus, Young demographics, Beauty tutorials'
    },
    {
      id: 3,
      name: 'MAC Cosmetics',
      logo: '/api/placeholder/60/60',
      category: 'Professional',
      marketShare: 8.7,
      productCount: 456,
      avgPrice: 156.50,
      rating: 4.6,
      socialFollowers: 1450000,
      website: 'https://maccosmetics.com.tr',
      strengths: ['Profesyonel kalite', 'Sanatçı desteği', 'Renk çeşitliliği'],
      weaknesses: ['Dar segment', 'Yüksek fiyat'],
      recentLaunches: ['Studio Fix Fluid', 'Retro Matte Lipstick'],
      marketingStrategy: 'Professional partnerships, Exclusive launches, Premium events'
    },
    {
      id: 4,
      name: 'The Ordinary',
      logo: '/api/placeholder/60/60',
      category: 'Skincare',
      marketShare: 12.1,
      productCount: 89,
      avgPrice: 32.90,
      rating: 4.4,
      socialFollowers: 980000,
      website: 'https://theordinary.com',
      strengths: ['Şeffaf formüller', 'Uygun fiyat', 'Bilimsel yaklaşım'],
      weaknesses: ['Karmaşık ürün yelpazesi', 'Packaging'],
      recentLaunches: ['Hyaluronic Acid 2%', 'Niacinamide 10%'],
      marketingStrategy: 'Education-focused, Minimalist approach, Science communication'
    },
    {
      id: 5,
      name: 'Flormar',
      logo: '/api/placeholder/60/60',
      category: 'Local',
      marketShare: 22.3,
      productCount: 734,
      avgPrice: 28.75,
      rating: 3.9,
      socialFollowers: 1200000,
      website: 'https://flormar.com.tr',
      strengths: ['Yerel marka', 'Uygun fiyat', 'Geniş dağıtım'],
      weaknesses: ['Kalite algısı', 'İnovasyon eksikliği'],
      recentLaunches: ['Perfect Coverage Foundation', 'Jelly Look Lipgloss'],
      marketingStrategy: 'Local celebrities, TV advertising, Retail partnerships'
    }
  ];

  useEffect(() => {
    // Mock data yükleme
    setCompetitors(mockCompetitors);
    setLastUpdated(new Date());
    generateAnalysisData(mockCompetitors);
  }, []);

  const generateAnalysisData = (data) => {
    // Veri kontrolü ekle
    if (!data || data.length === 0) {
      setAnalysisData(null);
      return;
    }

    // Market share chart data
    const marketShareData = {
      series: data.map(c => c.marketShare),
      options: {
        chart: { type: 'donut', background: 'transparent' },
        labels: data.map(c => c.name),
        colors: ['#4285f4', '#12c4b4', '#9c27b0', '#f1ba85', '#e79476'],
        legend: { 
          position: 'bottom', 
          labels: { colors: '#e0e0e0' },
          fontSize: '14px'
        },
        dataLabels: { 
          enabled: true,
          style: { fontSize: '14px', colors: ['#fff'] }
        },
        plotOptions: {
          pie: {
            donut: { size: '60%' }
          }
        },
        tooltip: {
          theme: 'dark',
          y: { formatter: (val) => `${val}%` }
        }
      }
    };

    // Price comparison
    const priceComparisonData = {
      series: [{
        name: 'Ortalama Fiyat',
        data: data.map(c => c.avgPrice)
      }],
      options: {
        chart: { 
          type: 'bar', 
          background: 'transparent',
          toolbar: { show: false }
        },
        xaxis: { 
          categories: data.map(c => c.name),
          labels: { style: { colors: '#a0a0a0' } }
        },
        yaxis: {
          labels: { 
            style: { colors: '#a0a0a0' },
            formatter: (val) => `₺${val}`
          }
        },
        colors: ['#4285f4'],
        dataLabels: { enabled: false },
        grid: {
          borderColor: 'rgba(66, 133, 244, 0.1)',
          strokeDashArray: 5
        },
        tooltip: {
          theme: 'dark',
          y: { formatter: (val) => `₺${val}` }
        }
      }
    };

    // Social media followers
    const socialData = {
      series: [{
        name: 'Takipçi Sayısı',
        data: data.map(c => Math.round(c.socialFollowers / 1000))
      }],
      options: {
        chart: { 
          type: 'line', 
          background: 'transparent',
          toolbar: { show: false }
        },
        xaxis: { 
          categories: data.map(c => c.name),
          labels: { style: { colors: '#a0a0a0' } }
        },
        yaxis: {
          labels: { 
            style: { colors: '#a0a0a0' },
            formatter: (val) => `${val}K`
          }
        },
        colors: ['#12c4b4'],
        stroke: { width: 3, curve: 'smooth' },
        markers: { size: 6 },
        grid: {
          borderColor: 'rgba(66, 133, 244, 0.1)',
          strokeDashArray: 5
        },
        tooltip: {
          theme: 'dark',
          y: { formatter: (val) => `${val}K takipçi` }
        }
      }
    };

    setAnalysisData({
      marketShare: marketShareData,
      priceComparison: priceComparisonData,
      socialMedia: socialData
    });
  };

  const handleBrandSelect = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const exportAnalysis = () => {
    const exportData = {
      competitors,
      analysisDate: new Date().toISOString(),
      selectedBrands: selectedBrands.map(id => 
        competitors.find(c => c.id === id)
      ).filter(Boolean)
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `competitor_analysis_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const calculateTotalMarketValue = () => {
    if (!competitors || competitors.length === 0) return '0';
    return competitors.reduce((total, comp) => 
      total + (comp.marketShare * comp.avgPrice * comp.productCount), 0
    ).toLocaleString('tr-TR');
  };

  const getTopPerformer = (metric) => {
    if (!competitors || competitors.length === 0) {
      return { name: 'N/A', marketShare: 0, rating: 0, socialFollowers: 0 };
    }
    
    switch(metric) {
      case 'market':
        return competitors.reduce((max, comp) => 
          comp.marketShare > max.marketShare ? comp : max
        );
      case 'rating':
        return competitors.reduce((max, comp) => 
          comp.rating > max.rating ? comp : max
        );
      case 'social':
        return competitors.reduce((max, comp) => 
          comp.socialFollowers > max.socialFollowers ? comp : max
        );
      default:
        return competitors[0];
    }
  };

  return (
    <div className="competitor-analysis-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="page-icon">
              <Target size={24} />
            </div>
            <div>
              <h1>Rakip Analizi Merkezi</h1>
              <p>Pazar rakiplerini analiz edin ve stratejik avantaj elde edin</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn refresh-btn" onClick={() => window.location.reload()}>
              <RefreshCw size={16} />
              <span>Yenile</span>
            </button>
            <button className="action-btn export-btn" onClick={exportAnalysis}>
              <Download size={16} />
              <span>Dışa Aktar</span>
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="last-updated">
            Son güncelleme: {lastUpdated.toLocaleString('tr-TR')}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon market">
              <BarChart3 size={20} />
            </div>
            <div className="metric-content">
              <div className="metric-value">₺{calculateTotalMarketValue()}</div>
              <div className="metric-label">Toplam Pazar Değeri</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon leader">
              <Award size={20} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{getTopPerformer('market').name}</div>
              <div className="metric-label">Pazar Lideri</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon rating">
              <Star size={20} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{getTopPerformer('rating').rating}</div>
              <div className="metric-label">En Yüksek Rating</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon social">
              <Share2 size={20} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{(getTopPerformer('social').socialFollowers / 1000000).toFixed(1)}M</div>
              <div className="metric-label">En Çok Takipçi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="analysis-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          <span>Genel Bakış</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'detailed' ? 'active' : ''}`}
          onClick={() => setActiveTab('detailed')}
        >
          <Eye size={16} />
          <span>Detaylı Analiz</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          <Target size={16} />
          <span>Karşılaştırma</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Pazar Payı Dağılımı</h3>
              </div>
              <div className="chart-body">
                {analysisData && analysisData.marketShare ? (
                  <Chart
                    options={analysisData.marketShare.options}
                    series={analysisData.marketShare.series}
                    type="donut"
                    height={300}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-dim)' }}>
                    Veri yükleniyor...
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Fiyat Karşılaştırması</h3>
              </div>
              <div className="chart-body">
                {analysisData && analysisData.priceComparison ? (
                  <Chart
                    options={analysisData.priceComparison.options}
                    series={analysisData.priceComparison.series}
                    type="bar"
                    height={300}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-dim)' }}>
                    Veri yükleniyor...
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Sosyal Medya Takipçileri</h3>
              </div>
              <div className="chart-body">
                {analysisData && analysisData.socialMedia ? (
                  <Chart
                    options={analysisData.socialMedia.options}
                    series={analysisData.socialMedia.series}
                    type="line"
                    height={300}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-dim)' }}>
                    Veri yükleniyor...
                  </div>
                )}
              </div>
            </div>

            <div className="insights-card">
              <div className="insights-header">
                <h3>Önemli Bulgular</h3>
              </div>
              <div className="insights-list">
                <div className="insight-item">
                  <Zap size={16} />
                  <span>Flormar yerel pazarda %22.3 pay ile lider konumda</span>
                </div>
                <div className="insight-item">
                  <TrendingUp size={16} />
                  <span>The Ordinary yüksek kalite/fiyat oranı ile öne çıkıyor</span>
                </div>
                <div className="insight-item">
                  <Users size={16} />
                  <span>L'Oréal sosyal medyada en aktif marka</span>
                </div>
                <div className="insight-item">
                  <Award size={16} />
                  <span>MAC profesyonel segmentte en yüksek rating'e sahip</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'detailed' && (
        <div className="tab-content">
          <div className="competitors-grid">
            {competitors.map((competitor) => (
              <div key={competitor.id} className="competitor-card">
                <div className="competitor-header">
                  <div className="competitor-logo">
                    <img src={competitor.logo} alt={competitor.name} />
                  </div>
                  <div className="competitor-info">
                    <h3>{competitor.name}</h3>
                    <span className="category-badge">{competitor.category}</span>
                  </div>
                  <div className="competitor-actions">
                    <a href={competitor.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="competitor-stats">
                  <div className="stat-row">
                    <span className="stat-label">Pazar Payı:</span>
                    <span className="stat-value">{competitor.marketShare}%</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Ürün Sayısı:</span>
                    <span className="stat-value">{competitor.productCount}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Ort. Fiyat:</span>
                    <span className="stat-value">₺{competitor.avgPrice}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Rating:</span>
                    <div className="rating-display">
                      <Star size={14} fill="#f1ba85" />
                      <span>{competitor.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="competitor-details">
                  <div className="detail-section">
                    <h4>Güçlü Yönler</h4>
                    <ul className="strengths-list">
                      {competitor.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>Zayıf Yönler</h4>
                    <ul className="weaknesses-list">
                      {competitor.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>Son Ürün Lansmanları</h4>
                    <div className="recent-launches">
                      {competitor.recentLaunches.map((launch, idx) => (
                        <span key={idx} className="launch-tag">{launch}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="tab-content">
          <div className="comparison-section">
            <div className="comparison-header">
              <h3>Marka Karşılaştırması</h3>
              <p>Karşılaştırmak istediğiniz markaları seçin</p>
            </div>

            <div className="brand-selector">
              {competitors.map((competitor) => (
                <label key={competitor.id} className="brand-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(competitor.id)}
                    onChange={() => handleBrandSelect(competitor.id)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="brand-name">{competitor.name}</span>
                </label>
              ))}
            </div>

            {selectedBrands.length > 0 && (
              <div className="comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>Özellik</th>
                      {selectedBrands.map(brandId => {
                        const brand = competitors.find(c => c.id === brandId);
                        return <th key={brandId}>{brand?.name}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pazar Payı</td>
                      {selectedBrands.map(brandId => {
                        const brand = competitors.find(c => c.id === brandId);
                        return <td key={brandId}>{brand?.marketShare}%</td>;
                      })}
                    </tr>
                    <tr>
                      <td>Ortalama Fiyat</td>
                      {selectedBrands.map(brandId => {
                        const brand = competitors.find(c => c.id === brandId);
                        return <td key={brandId}>₺{brand?.avgPrice}</td>;
                      })}
                    </tr>
                    <tr>
                      <td>Ürün Sayısı</td>
                      {selectedBrands.map(brandId => {
                        const brand = competitors.find(c => c.id === brandId);
                        return <td key={brandId}>{brand?.productCount}</td>;
                      })}
                    </tr>
                    <tr>
                      <td>Rating</td>
                      {selectedBrands.map(brandId => {
                        const brand = competitors.find(c => c.id === brandId);
                        return <td key={brandId}>{brand?.rating}</td>;
                      })}
                    </tr>
                    <tr>
                      <td>Sosyal Medya</td>
                      {selectedBrands.map(brandId => {
                        const brand = competitors.find(c => c.id === brandId);
                        return <td key={brandId}>{(brand?.socialFollowers / 1000000).toFixed(1)}M</td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;