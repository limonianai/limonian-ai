// src/Pages/Departments/Arge/TurkeyCompliance.js
// Türkiye uygunluk kontrol sistemi

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Spinner, Alert } from 'reactstrap';
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileText,
  Download,
  Upload,
  Zap,
  AlertCircle,
  Info,
  Eye,
  Database,
  Globe,
  Award
} from 'lucide-react';
import Chart from 'react-apexcharts';
import axiosInstance from '../../../helpers/axiosConfig';
import './TurkeyCompliance.css';

const TurkeyCompliance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [complianceHistory, setComplianceHistory] = useState([]);

  // Mock yasaklı madde veritabanı
  const bannedSubstances = [
    {
      name: 'Hydroquinone',
      turkishName: 'Hidrokinon',
      cas: '123-31-9',
      reason: 'Cilt hassasiyeti ve potansiyel karsinojen risk',
      category: 'Beyazlatıcı Ajan',
      regulation: 'Kozmetik Yönetmeliği Ek-II',
      severity: 'high'
    },
    {
      name: 'Mercury compounds',
      turkishName: 'Cıva Bileşikleri',
      cas: '7439-97-6',
      reason: 'Ağır metal toksisitesi, nörotoksik etki',
      category: 'Ağır Metal',
      regulation: 'Kozmetik Yönetmeliği Ek-II',
      severity: 'high'
    },
    {
      name: 'Retinoic acid',
      turkishName: 'Retinoik Asit',
      cas: '302-79-4',
      reason: 'Hamilelikte teratojenik risk',
      category: 'Retinoid',
      regulation: 'Kozmetik Yönetmeliği Ek-III',
      severity: 'medium'
    },
    {
      name: 'Formaldehyde',
      turkishName: 'Formaldehit',
      cas: '50-00-0',
      reason: 'Potansiyel karsinojen, allerjen',
      category: 'Koruyucu',
      regulation: 'Kozmetik Yönetmeliği Ek-VI',
      severity: 'medium'
    }
  ];

  // Mock sertifika gereksinimleri
  const certificationRequirements = [
    {
      type: 'halal',
      name: 'Helal Sertifikası',
      authority: 'Diyanet İşleri Başkanlığı',
      required: false,
      description: 'İslami kurallara uygun üretim belgesi'
    },
    {
      type: 'organic',
      name: 'Organik Sertifikası',
      authority: 'Tarım ve Orman Bakanlığı',
      required: false,
      description: 'Organik tarım ürünleri belgesi'
    },
    {
      type: 'gmp',
      name: 'İyi Üretim Uygulamaları',
      authority: 'Sağlık Bakanlığı',
      required: true,
      description: 'Kozmetik üretim kalite standartları'
    },
    {
      type: 'notification',
      name: 'Ürün Bildirimi',
      authority: 'Sağlık Bakanlığı TITUBB',
      required: true,
      description: 'Kozmetik ürün pazar öncesi bildirim'
    }
  ];

  // Mock analiz geçmişi
  useEffect(() => {
    const mockHistory = [
      {
        id: 1,
        productName: 'Vitamin C Serum',
        date: '2024-06-10',
        status: 'compliant',
        issues: 0,
        score: 95
      },
      {
        id: 2,
        productName: 'Anti-Aging Cream',
        date: '2024-06-09',
        status: 'warning',
        issues: 2,
        score: 78
      },
      {
        id: 3,
        productName: 'Whitening Lotion',
        date: '2024-06-08',
        status: 'non-compliant',
        issues: 5,
        score: 42
      }
    ];
    setComplianceHistory(mockHistory);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    // Mock API call simulation
    setTimeout(() => {
      const mockResults = analyzeProduct(searchQuery);
      setAnalysisResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  const analyzeProduct = (productName) => {
    // Mock INCI analizi
    const mockIngredients = [
      'Aqua', 'Glycerin', 'Cetearyl Alcohol', 'Sodium Hyaluronate', 
      'Retinol', 'Tocopherol', 'Phenoxyethanol', 'Parfum'
    ];

    const detectedIssues = [];
    let complianceScore = 85;

    // Yasaklı madde kontrolü
    const foundBannedSubstances = bannedSubstances.filter(banned => 
      mockIngredients.some(ingredient => 
        ingredient.toLowerCase().includes(banned.name.toLowerCase().split(' ')[0])
      )
    );

    foundBannedSubstances.forEach(banned => {
      detectedIssues.push({
        type: 'banned_substance',
        severity: banned.severity,
        substance: banned.name,
        reason: banned.reason,
        regulation: banned.regulation
      });
      complianceScore -= banned.severity === 'high' ? 20 : 10;
    });

    // Konsantrasyon kontrolleri
    if (mockIngredients.includes('Retinol')) {
      detectedIssues.push({
        type: 'concentration_limit',
        severity: 'medium',
        substance: 'Retinol',
        reason: 'Maksimum konsantrasyon: %0.3',
        regulation: 'Kozmetik Yönetmeliği Ek-III'
      });
      complianceScore -= 5;
    }

    // Etiketleme gereksinimleri
    const missingLabels = [];
    if (Math.random() > 0.7) {
      missingLabels.push('Türkçe içerik listesi');
      complianceScore -= 5;
    }
    if (Math.random() > 0.8) {
      missingLabels.push('Üretici bilgileri');
      complianceScore -= 3;
    }

    const status = complianceScore >= 80 ? 'compliant' : 
                  complianceScore >= 60 ? 'warning' : 'non-compliant';

    return {
      productName,
      ingredients: mockIngredients,
      complianceScore: Math.max(complianceScore, 0),
      status,
      issues: detectedIssues,
      bannedSubstances: foundBannedSubstances,
      missingLabels,
      certifications: certificationRequirements,
      recommendations: generateRecommendations(detectedIssues, complianceScore),
      analyzedAt: new Date().toISOString()
    };
  };

  const generateRecommendations = (issues, score) => {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push({
        priority: 'high',
        action: 'Ürün formülasyonunu gözden geçirin',
        description: 'Yasaklı maddeler nedeniyle formülasyon değişikliği gerekli'
      });
    }

    if (issues.some(i => i.type === 'concentration_limit')) {
      recommendations.push({
        priority: 'medium',
        action: 'Aktif madde konsantrasyonlarını kontrol edin',
        description: 'Yasal limitlere uygun konsantrasyon ayarlaması yapın'
      });
    }

    recommendations.push({
      priority: 'low',
      action: 'Ürün etiketlemesini güncelleyin',
      description: 'Türkçe etiket gereksinimlerini tamamlayın'
    });

    return recommendations;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Mock file analysis
      const fileContent = `Mock INCI: Aqua, Glycerin, Cetearyl Alcohol, Retinol, Phenoxyethanol`;
      setSearchQuery(fileContent);
    }
  };

  const exportReport = () => {
    if (!analysisResults) return;
    
    const reportData = {
      ...analysisResults,
      generatedAt: new Date().toISOString(),
      reportType: 'Turkey Compliance Analysis'
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance_report_${analysisResults.productName.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'compliant': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'non-compliant': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'compliant': return <CheckCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'non-compliant': return <XCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="turkey-compliance-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="page-icon">
              <Shield size={24} />
            </div>
            <div>
              <h1>Türkiye Uygunluk Kontrol</h1>
              <p>Kozmetik ürünlerin Türkiye yasal gereksinimlerine uygunluk analizi</p>
            </div>
          </div>
          <div className="header-actions">
            {analysisResults && (
              <button className="action-btn export-btn" onClick={exportReport}>
                <Download size={16} />
                <span>Rapor İndir</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="compliance-tabs">
        <button 
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={16} />
          <span>Ürün Analizi</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'database' ? 'active' : ''}`}
          onClick={() => setActiveTab('database')}
        >
          <Database size={16} />
          <span>Yasaklı Maddeler</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <Award size={16} />
          <span>Sertifikasyonlar</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && (
        <div className="tab-content">
          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-methods">
                <div className="search-input-group">
                  <div className="search-box">
                    <Search size={20} />
                    <textarea
                      placeholder="INCI listesini girin veya ürün adını yazın..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-textarea"
                      rows={3}
                    />
                  </div>
                  <button 
                    className="search-btn" 
                    onClick={handleSearch}
                    disabled={loading || !searchQuery.trim()}
                  >
                    {loading ? <Spinner size="sm" /> : <Zap size={16} />}
                    <span>{loading ? 'Analiz Ediliyor...' : 'Analiz Et'}</span>
                  </button>
                </div>

                <div className="file-upload-section">
                  <label className="file-upload-btn">
                    <Upload size={16} />
                    <span>Dosya Yükle</span>
                    <input
                      type="file"
                      accept=".txt,.pdf,.xlsx"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {uploadedFile && (
                    <span className="uploaded-file">{uploadedFile.name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResults && (
            <div className="analysis-results">
              <div className="results-header">
                <div className="product-info">
                  <h2>{analysisResults.productName}</h2>
                  <div className="analysis-meta">
                    <span>Analiz Tarihi: {new Date(analysisResults.analyzedAt).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
                <div className="compliance-score">
                  <div className="score-circle">
                    <div className="score-value">{analysisResults.complianceScore}</div>
                    <div className="score-label">Uygunluk Skoru</div>
                  </div>
                  <div className={`status-badge ${analysisResults.status}`}>
                    {getStatusIcon(analysisResults.status)}
                    <span>
                      {analysisResults.status === 'compliant' ? 'Uygun' :
                       analysisResults.status === 'warning' ? 'Dikkat' : 'Uygun Değil'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="results-grid">
                {/* Issues Section */}
                <div className="result-card issues-card">
                  <div className="card-header">
                    <AlertTriangle size={20} />
                    <h3>Tespit Edilen Sorunlar ({analysisResults.issues.length})</h3>
                  </div>
                  <div className="card-body">
                    {analysisResults.issues.length > 0 ? (
                      <div className="issues-list">
                        {analysisResults.issues.map((issue, index) => (
                          <div key={index} className={`issue-item ${issue.severity}`}>
                            <div className="issue-icon">
                              {issue.severity === 'high' ? <XCircle size={16} /> : <AlertTriangle size={16} />}
                            </div>
                            <div className="issue-content">
                              <div className="issue-title">{issue.substance}</div>
                              <div className="issue-reason">{issue.reason}</div>
                              <div className="issue-regulation">{issue.regulation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-issues">
                        <CheckCircle size={32} />
                        <p>Kritik sorun tespit edilmedi</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="result-card recommendations-card">
                  <div className="card-header">
                    <Zap size={20} />
                    <h3>Öneriler</h3>
                  </div>
                  <div className="card-body">
                    <div className="recommendations-list">
                      {analysisResults.recommendations.map((rec, index) => (
                        <div key={index} className={`recommendation-item ${rec.priority}`}>
                          <div className="rec-priority">{rec.priority.toUpperCase()}</div>
                          <div className="rec-content">
                            <div className="rec-action">{rec.action}</div>
                            <div className="rec-description">{rec.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ingredients Analysis */}
                <div className="result-card ingredients-card">
                  <div className="card-header">
                    <FileText size={20} />
                    <h3>İçerik Analizi</h3>
                  </div>
                  <div className="card-body">
                    <div className="ingredients-list">
                      {analysisResults.ingredients.map((ingredient, index) => {
                        const isBanned = analysisResults.bannedSubstances.some(banned => 
                          ingredient.toLowerCase().includes(banned.name.toLowerCase().split(' ')[0])
                        );
                        return (
                          <div key={index} className={`ingredient-item ${isBanned ? 'banned' : 'safe'}`}>
                            <span className="ingredient-name">{ingredient}</span>
                            {isBanned && <AlertTriangle size={14} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="result-card certifications-card">
                  <div className="card-header">
                    <Award size={20} />
                    <h3>Gerekli Sertifikalar</h3>
                  </div>
                  <div className="card-body">
                    <div className="certifications-list">
                      {analysisResults.certifications.map((cert, index) => (
                        <div key={index} className={`certification-item ${cert.required ? 'required' : 'optional'}`}>
                          <div className="cert-status">
                            {cert.required ? <AlertCircle size={16} /> : <Info size={16} />}
                          </div>
                          <div className="cert-content">
                            <div className="cert-name">{cert.name}</div>
                            <div className="cert-authority">{cert.authority}</div>
                            <div className="cert-description">{cert.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Analysis History */}
          <div className="history-section">
            <div className="history-header">
              <h3>Son Analizler</h3>
            </div>
            <div className="history-list">
              {complianceHistory.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-product">{item.productName}</div>
                  <div className="history-date">{new Date(item.date).toLocaleDateString('tr-TR')}</div>
                  <div className={`history-status ${item.status}`}>
                    {getStatusIcon(item.status)}
                    <span>{item.score}%</span>
                  </div>
                  <div className="history-issues">{item.issues} sorun</div>
                  <button className="history-view-btn">
                    <Eye size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="tab-content">
          <div className="database-section">
            <div className="database-header">
              <h3>Yasaklı Maddeler Veritabanı</h3>
              <p>Türkiye'de kozmetik ürünlerde kullanımı yasaklanan maddeler</p>
            </div>
            <div className="substances-grid">
              {bannedSubstances.map((substance, index) => (
                <div key={index} className={`substance-card ${substance.severity}`}>
                  <div className="substance-header">
                    <div className="substance-name">{substance.name}</div>
                    <div className={`severity-badge ${substance.severity}`}>
                      {substance.severity === 'high' ? 'Yüksek Risk' : 'Orta Risk'}
                    </div>
                  </div>
                  <div className="substance-details">
                    <div className="detail-item">
                      <span className="detail-label">Türkçe:</span>
                      <span>{substance.turkishName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">CAS No:</span>
                      <span>{substance.cas}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Kategori:</span>
                      <span>{substance.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Yasaklama Nedeni:</span>
                      <span>{substance.reason}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Yasal Dayanak:</span>
                      <span>{substance.regulation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="tab-content">
          <div className="certificates-section">
            <div className="certificates-header">
              <h3>Sertifikasyon Gereksinimleri</h3>
              <p>Türkiye pazarında kozmetik ürün satışı için gerekli belgeler</p>
            </div>
            <div className="certificates-grid">
              {certificationRequirements.map((cert, index) => (
                <div key={index} className={`certificate-card ${cert.required ? 'required' : 'optional'}`}>
                  <div className="certificate-header">
                    <div className="certificate-icon">
                      {cert.required ? <Shield size={24} /> : <Award size={24} />}
                    </div>
                    <div className="certificate-title">
                      <h4>{cert.name}</h4>
                      <span className={`requirement-badge ${cert.required ? 'required' : 'optional'}`}>
                        {cert.required ? 'Zorunlu' : 'İsteğe Bağlı'}
                      </span>
                    </div>
                  </div>
                  <div className="certificate-body">
                    <div className="certificate-authority">
                      <span className="authority-label">Yetki:</span>
                      <span>{cert.authority}</span>
                    </div>
                    <div className="certificate-description">
                      {cert.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurkeyCompliance;