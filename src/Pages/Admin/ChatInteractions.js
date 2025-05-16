// src/Pages/Admin/ChatInteractions.js - Table Layout Version
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Spinner, Alert } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Download, MessageSquare, User, Calendar, ArrowLeft, ChevronLeft, ChevronRight, Eye, ExternalLink } from 'lucide-react';
import * as XLSX from 'xlsx';
import './ChatInteractionsTable.css';

const ChatInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const interactionsPerPage = 15;
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const endpoint = userId ? `/admin/chat-interactions?userId=${userId}` : '/admin/chat-interactions';
      const response = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInteractions(response);
    } catch (err) {
      setMessage({ type: 'error', text: 'Sohbet geçmişi alınırken bir hata oluştu.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const downloadExcel = () => {
    const dataToExport = interactions.map((interaction) => ({
      'Kullanıcı Adı': interaction.Username,
      'Sohbet Başlığı': interaction.Title,
      'Mesaj': interaction.Message,
      'Yanıt': interaction.Response,
      'Tarih': new Date(interaction.Timestamp).toLocaleString('tr-TR'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sohbetler');

    const filename = userId ? `Kullanici_${userId}_Sohbetler.xlsx` : 'Tum_Sohbetler.xlsx';
    XLSX.writeFile(workbook, filename);
    
    setMessage({ type: 'success', text: 'Excel dosyası başarıyla indirildi!' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Filtreleme ve sayfalama
  const filteredInteractions = interactions.filter((interaction) =>
    interaction.Username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interaction.Message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interaction.Title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastInteraction = currentPage * interactionsPerPage;
  const indexOfFirstInteraction = indexOfLastInteraction - interactionsPerPage;
  const currentInteractions = filteredInteractions.slice(indexOfFirstInteraction, indexOfLastInteraction);
  const totalPages = Math.ceil(filteredInteractions.length / interactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBackToUsers = () => {
    navigate('/admin/users');
  };

  // Text'i kısaltma fonksiyonu
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Tarih formatı
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modal açma
  const openModal = (interaction) => {
    setSelectedInteraction(interaction);
    setShowModal(true);
  };

  // Modal kapatma
  const closeModal = () => {
    setShowModal(false);
    setSelectedInteraction(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner className="loading-spinner" />
        <p>Sohbetler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="chat-interactions-table-page">
      <div className="chat-interactions-header">
        <div className="header-left">
          {userId && (
            <button className="back-btn" onClick={handleBackToUsers}>
              <ArrowLeft size={20} />
              <span>Kullanıcılara Dön</span>
            </button>
          )}
          <div className="page-info">
            <div className="page-icon">
              <MessageSquare size={24} />
            </div>
            <div>
              <h1>{userId ? 'Kullanıcı Sohbetleri' : 'Tüm Sohbet Geçmişi'}</h1>
              <p>
                {userId ? `Kullanıcı ID: ${userId}` : 'Sistemdeki tüm sohbet etkileşimleri'}
              </p>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <div className="stats-chip">
            <span>{filteredInteractions.length} sohbet</span>
          </div>
          <button className="download-btn" onClick={downloadExcel}>
            <Download size={16} />
            <span>Excel İndir</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
        </div>
      )}

      <div className="controls-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Kullanıcı adı, mesaj veya başlık ara..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <div className="interactions-table">
          <div className="table-header">
            <div className="table-cell header-cell">Kullanıcı</div>
            <div className="table-cell header-cell">Sohbet Başlığı</div>
            <div className="table-cell header-cell">Kullanıcı Mesajı</div>
            <div className="table-cell header-cell">AI Yanıtı</div>
            <div className="table-cell header-cell">Tarih</div>
            <div className="table-cell header-cell">İşlem</div>
          </div>
          
          <div className="table-body">
            {currentInteractions.length > 0 ? (
              currentInteractions.map((interaction) => (
                <div key={interaction.Id} className="table-row">
                  <div className="table-cell user-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        {interaction.Username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="username">{interaction.Username}</span>
                    </div>
                  </div>
                  <div className="table-cell title-cell">
                    <span className="chat-title">
                      {interaction.Title || 'Başlıksız Sohbet'}
                    </span>
                  </div>
                  <div className="table-cell message-cell">
                    <div className="message-preview">
                      {truncateText(interaction.Message, 100)}
                    </div>
                  </div>
                  <div className="table-cell response-cell">
                    <div className="response-preview">
                      {truncateText(interaction.Response, 100)}
                    </div>
                  </div>
                  <div className="table-cell date-cell">
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{formatDate(interaction.Timestamp)}</span>
                    </div>
                  </div>
                  <div className="table-cell action-cell">
                    <button
                      className="view-btn"
                      onClick={() => openModal(interaction)}
                      title="Detayları Görüntüle"
                    >
                      <Eye size={14} />
                      <span>Detay</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <MessageSquare size={48} />
                <h3>Sohbet bulunamadı</h3>
                <p>
                  {userId 
                    ? 'Bu kullanıcıya ait sohbet kaydı bulunmuyor.'
                    : 'Arama kriterlerinize uygun sohbet bulunamadı.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            <span>Önceki</span>
          </button>
          
          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`pagination-number ${index + 1 === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span>Sonraki</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedInteraction && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sohbet Detayı</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <label>Kullanıcı:</label>
                <span>{selectedInteraction.Username}</span>
              </div>
              <div className="detail-section">
                <label>Başlık:</label>
                <span>{selectedInteraction.Title || 'Başlıksız Sohbet'}</span>
              </div>
              <div className="detail-section">
                <label>Tarih:</label>
                <span>{formatDate(selectedInteraction.Timestamp)}</span>
              </div>
              <div className="detail-section">
                <label>Kullanıcı Mesajı:</label>
                <div className="message-full user-message-full">
                  {selectedInteraction.Message}
                </div>
              </div>
              <div className="detail-section">
                <label>AI Yanıtı:</label>
                <div className="message-full ai-response-full">
                  {selectedInteraction.Response}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInteractions;