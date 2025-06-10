// src/Pages/Departments/Arge/ProductAnalysis.js
// Ar-Ge departmanı için ürün analiz sayfası

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Spinner, Alert } from 'reactstrap';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  TrendingUp, 
  Package, 
  DollarSign,
  BarChart3,
  Download,
  Eye,
  Star
} from 'lucide-react';
import axiosInstance from '../../../helpers/axiosConfig';
import './ProductAnalysis.css';

const ProductAnalysis = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [lastUpdated, setLastUpdated] = useState(null);

  const username = localStorage.getItem('username') || 'Ar-Ge Uzmanı';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      const response = await axiosInstance.get('/products/oliveyoung', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      
      const products = Array.isArray(response) ? response : response.data || [];
      
      setProducts(products);
      setLastUpdated(new Date());
      
      if (products.length === 0) {
        setError('Henüz ürün verisi bulunamadı.');
      }
    } catch (err) {
      console.error('Ürün verisi alınırken hata:', err);
      setError('Ürün verileri alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanPrice = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanPrice) || 0;
  };

  // Filtreleme ve sıralama
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'expensive') return matchesSearch && parsePrice(product.price) > 50;
      if (filterType === 'cheap') return matchesSearch && parsePrice(product.price) <= 50;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-asc':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc':
          return parsePrice(b.price) - parsePrice(a.price);
        default:
          return 0;
      }
    });

  // İstatistikler
  const stats = {
    totalProducts: products.length,
    avgPrice: products.length > 0 
      ? (products.reduce((sum, p) => sum + parsePrice(p.price), 0) / products.length).toFixed(2)
      : 0,
    maxPrice: products.length > 0 
      ? Math.max(...products.map(p => parsePrice(p.price))).toFixed(2)
      : 0,
    minPrice: products.length > 0 
      ? Math.min(...products.map(p => parsePrice(p.price))).toFixed(2)
      : 0
  };

  const exportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `olive_young_products_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="product-analysis-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="page-icon">
              <BarChart3 size={24} />
            </div>
            <div>
              <h1>Ürün Analiz Merkezi</h1>
              <p>Olive Young pazaryeri ürün analizi ve trend takibi</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn refresh-btn" onClick={handleRefresh} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              <span>Yenile</span>
            </button>
            <button className="action-btn export-btn" onClick={exportData} disabled={products.length === 0}>
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

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon packages">
              <Package size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Toplam Ürün</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon price">
              <DollarSign size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.avgPrice}</div>
              <div className="stat-label">Ortalama Fiyat</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon trending">
              <TrendingUp size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.maxPrice}</div>
              <div className="stat-label">En Yüksek Fiyat</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon star">
              <Star size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.minPrice}</div>
              <div className="stat-label">En Düşük Fiyat</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-filter-group">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Ürün adında ara..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <div className="filter-item">
              <Filter size={16} />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tüm Ürünler</option>
                <option value="expensive">Pahalı ($50+)</option>
                <option value="cheap">Uygun (≤$50)</option>
              </select>
            </div>
            
            <div className="filter-item">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">İsme Göre</option>
                <option value="price-asc">Fiyat: Düşük → Yüksek</option>
                <option value="price-desc">Fiyat: Yüksek → Düşük</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="results-info">
          {filteredAndSortedProducts.length} ürün gösteriliyor
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert color="danger" className="error-alert">
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <Spinner className="loading-spinner" />
          <p>Ürün verileri alınıyor...</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="products-section">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="products-grid">
              {filteredAndSortedProducts.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-image-container">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="product-image-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>
                      <Package size={32} />
                    </div>
                    <div className="product-overlay">
                      {product.link && (
                        <a 
                          href={product.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="view-product-btn"
                          title="Ürünü görüntüle"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name" title={product.name}>
                      {product.name || 'İsimsiz Ürün'}
                    </h3>
                    <div className="product-price">
                      {product.price || 'Fiyat Yok'}
                    </div>
                  </div>
                  
                  <div className="product-actions">
                    <button className="analyze-btn" title="Analiz Et">
                      <Eye size={14} />
                      <span>Analiz Et</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Package size={64} />
              <h3>Ürün Bulunamadı</h3>
              <p>
                {searchQuery 
                  ? 'Arama kriterlerinize uygun ürün bulunamadı.'
                  : 'Henüz analiz edilecek ürün bulunmuyor. Yenile butonunu kullanarak verileri güncelleyin.'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductAnalysis;