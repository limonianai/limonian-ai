// src/Pages/Admin/ListUsers.js - Yeni style ile kullanıcı listesi
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Trash2, MessageSquare, ChevronLeft, ChevronRight,UserPlus  } from 'lucide-react';
import './listUsers.css';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/list-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response);
    } catch (err) {
      setMessage({ type: 'error', text: 'Kullanıcıları çekerken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const deleteUser = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await axiosInstance.delete(`/admin/delete-user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla silindi.' });
        setUsers(users.filter((user) => user.Id !== id));
        
        // Success message'ı 3 saniye sonra kaldır
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: 'Kullanıcı silinirken bir hata oluştu.' });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const viewUserChats = (userId) => {
    navigate(`/admin/chat-interactions?userId=${userId}`);
  };

  // Filtreleme ve sayfalama
  const filteredUsers = users.filter((user) =>
    user.Username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.Department?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 const handleCreateUser = () => {
    navigate('/admin/create-user');
  };

  // Role badge rengi
  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'role-badge admin';
    return 'role-badge user';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner className="loading-spinner" />
        <p>Kullanıcılar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="list-users-page">
      <div className="list-users-header">
        <div className="header-left">
          <div className="page-icon">
            <Users size={24} />
          </div>
          <div>
            <h1>Kullanıcı Yönetimi</h1>
            <p>Tüm kullanıcıları görüntüleyin ve yönetin</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Toplam Kullanıcı</span>
            <span className="stat-value">{users.length}</span>
          </div>
           <button className="create-user-btn" onClick={handleCreateUser}>
            <UserPlus size={16} />
            <span>Kullanıcı Ekle</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
        </div>
      )}

      <div className="search-container">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Kullanıcı adı veya departman ara..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="users-table-container">
        <div className="users-table">
          <div className="table-header">
            <div className="table-cell">ID</div>
            <div className="table-cell">Kullanıcı</div>
            <div className="table-cell">Rol</div>
            <div className="table-cell">Departman</div>
            <div className="table-cell">İşlemler</div>
          </div>
          
          <div className="table-body">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <div key={user.Id} className="table-row">
                  <div className="table-cell user-id">#{user.Id}</div>
                  <div className="table-cell user-info">
                    <span className="username">{user.Username}</span>
                  </div>
                  <div className="table-cell">
                    <span className={getRoleBadgeClass(user.Role)}>
                      {user.Role === 'admin' ? 'Admin' : 'Kullanıcı'}
                    </span>
                  </div>
                  <div className="table-cell department-cell">
                    <span className="department-name">
                      {user.Department || 'Atanmamış'}
                    </span>
                  </div>
                  <div className="table-cell actions-cell">
                    <button
                      className="action-btn view-chats"
                      onClick={() => viewUserChats(user.Id)}
                      title="Sohbetleri Görüntüle"
                    >
                      <MessageSquare size={16} />
                      <span>Sohbetler</span>
                    </button>
                    <button
                      className="action-btn delete-user"
                      onClick={() => deleteUser(user.Id)}
                      title="Kullanıcıyı Sil"
                    >
                      <Trash2 size={16} />
                      <span>Sil</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Users size={48} />
                <h3>Kullanıcı bulunamadı</h3>
                <p>Arama kriterlerinize uygun kullanıcı bulunmuyor.</p>
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
    </div>
  );
};

export default ListUsers;