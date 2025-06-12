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
  Star,
  Award,
  Tag
} from 'lucide-react';
import axiosInstance from '../../../helpers/axiosConfig';
import './ProductAnalysis.css';

const ProductAnalysis = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
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
    // Kore Won (원) ve diğer para birimlerini parse et
    const cleanPrice = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanPrice) || 0;
  };

  // Benzersiz markaları al
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

  // Filtreleme ve sıralama
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
      
      let matchesPrice = true;
      if (filterType === 'expensive') matchesPrice = parsePrice(product.price) > 20000; // 20000원+
      if (filterType === 'cheap') matchesPrice = parsePrice(product.price) <= 20000;
      if (filterType === 'discounted') matchesPrice = product.originalPrice && parsePrice(product.originalPrice) > parsePrice(product.price);
      
      return matchesSearch && matchesBrand && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          const rankA = parseInt(a.rank) || 999;
          const rankB = parseInt(b.rank) || 999;
          return rankA - rankB;
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'brand':
          return (a.brand || '').localeCompare(b.brand || '');
        case 'price-asc':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc':
          return parsePrice(b.price) - parsePrice(a.price);
        case 'discount':
          const discountA = a.originalPrice ? ((parsePrice(a.originalPrice) - parsePrice(a.price)) / parsePrice(a.originalPrice)) * 100 : 0;
          const discountB = b.originalPrice ? ((parsePrice(b.originalPrice) - parsePrice(b.price)) / parsePrice(b.originalPrice)) * 100 : 0;
          return discountB - discountA;
        default:
          return 0;
      }
    });

  // İstatistikler
  const stats = {
    totalProducts: products.length,
    avgPrice: products.length > 0 
      ? (products.reduce((sum, p) => sum + parsePrice(p.price), 0) / products.length).toFixed(0)
      : 0,
    maxPrice: products.length > 0 
      ? Math.max(...products.map(p => parsePrice(p.price))).toFixed(0)
      : 0,
    minPrice: products.length > 0 
      ? Math.min(...products.map(p => parsePrice(p.price))).toFixed(0)
      : 0,
    uniqueBrands: uniqueBrands.length,
    discountedProducts: products.filter(p => p.originalPrice && parsePrice(p.originalPrice) > parsePrice(p.price)).length
  };

  // İndirim oranını hesapla
  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice) return 0;
    const original = parsePrice(originalPrice);
    const current = parsePrice(currentPrice);
    if (original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
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
              <div className="stat-value">{stats.avgPrice}원</div>
              <div className="stat-label">Ortalama Fiyat</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon trending">
              <TrendingUp size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.maxPrice}원</div>
              <div className="stat-label">En Yüksek Fiyat</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon star">
              <Tag size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.uniqueBrands}</div>
              <div className="stat-label">Benzersiz Marka</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon star">
              <Star size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.discountedProducts}</div>
              <div className="stat-label">İndirimli Ürün</div>
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
              placeholder="Ürün adı veya marka adında ara..."
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
                <option value="expensive">Pahalı (20,000원+)</option>
                <option value="cheap">Uygun (≤20,000원)</option>
                <option value="discounted">İndirimli</option>
              </select>
            </div>

            <div className="filter-item">
              <select 
                value={brandFilter} 
                onChange={(e) => setBrandFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tüm Markalar</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-item">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="rank">Ranking Sırası</option>
                <option value="name">İsme Göre</option>
                <option value="brand">Markaya Göre</option>
                <option value="price-asc">Fiyat: Düşük → Yüksek</option>
                <option value="price-desc">Fiyat: Yüksek → Düşük</option>
                <option value="discount">İndirim Oranına Göre</option>
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
                  {/* Ranking Badge */}
                  {product.rank && (
                    <div className="ranking-badge">
                      <Award size={12} />
                      <span>#{product.rank}</span>
                    </div>
                  )}

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

                    {/* Discount Badge */}
                    {product.originalPrice && calculateDiscount(product.originalPrice, product.price) > 0 && (
                      <div className="discount-badge">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    {/* Brand */}
                    {product.brand && (
                      <div className="product-brand">
                        <Tag size={12} />
                        <span>{product.brand}</span>
                      </div>
                    )}

                    <h3 className="product-name" title={product.name}>
                      {product.name || 'İsimsiz Ürün'}
                    </h3>
                    
                    <div className="product-pricing">
                      {/* Original Price (crossed out if there's a discount) */}
                      {product.originalPrice && parsePrice(product.originalPrice) > parsePrice(product.price) && (
                        <div className="original-price">
                          {product.originalPrice}
                        </div>
                      )}
                      
                      {/* Current Price */}
                      <div className="current-price">
                        {product.price || 'Fiyat Yok'}
                      </div>
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