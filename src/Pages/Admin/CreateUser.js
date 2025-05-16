// src/Pages/Admin/CreateUser.js - Modern styled version
import React, { useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Lock, Shield, Building2, ArrowLeft, Check, X } from 'lucide-react';
import './CreateUser.css';

const CreateUser = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    role: 'User', 
    department: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const departmentOptions = [
    { value: '', label: 'Departman seçin', disabled: true },
    { value: 'İk', label: 'İnsan Kaynakları'},
    { value: 'Yazilim', label: 'Yazılım'},
    { value: 'Grafik', label: 'Grafik Tasarım'},
    { value: 'Sosyal Medya', label: 'Sosyal Medya'},
    { value: 'CRM', label: 'CRM'},
    { value: 'Arge', label: 'Ar-Ge'}
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Kullanıcı adı gereklidir';
    } else if (formData.username.length < 3) {
      errors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    }
    
    if (!formData.password) {
      errors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    if (!formData.department) {
      errors.department = 'Departman seçimi gereklidir';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await axiosInstance.post('/admin/create-user', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      setMessage({ 
        type: 'success', 
        text: response.message || 'Kullanıcı başarıyla oluşturuldu!' 
      });
      
      // Reset form after successful creation
      setFormData({ username: '', password: '', role: 'User', department: '' });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Kullanıcı oluşturulurken bir hata oluştu.' 
      });
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUsers = () => {
    navigate('/admin/users');
  };
  return (
    <div className="create-user-page">
      <div className="create-user-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBackToUsers}>
            <ArrowLeft size={20} />
            <span>Kullanıcılara Dön</span>
          </button>
          <div className="page-info">
            <div className="page-icon">
              <UserPlus size={24} />
            </div>
            <div>
              <h1>Yeni Kullanıcı Oluştur</h1>
              <p>Sisteme yeni bir kullanıcı ekleyin</p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message-alert ${message.type}`}>
          <div className="alert-icon">
            {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
          </div>
          <span>{message.text}</span>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="create-user-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <User size={16} />
              <span>Kullanıcı Adı</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Kullanıcı adını girin"
              className={`form-input ${validationErrors.username ? 'error' : ''}`}
              required
            />
            {validationErrors.username && (
              <span className="error-message">{validationErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              <span>Şifre</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifre girin"
              className={`form-input ${validationErrors.password ? 'error' : ''}`}
              required
            />
            {validationErrors.password && (
              <span className="error-message">{validationErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              <Shield size={16} />
              <span>Rol</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="User">Normal Kullanıcı</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="department" className="form-label">
              <Building2 size={16} />
              <span>Departman</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-select ${validationErrors.department ? 'error' : ''}`}
              required
            >
              {departmentOptions.map(option => (
                <option 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.icon ? `${option.icon} ${option.label}` : option.label}
                </option>
              ))}
            </select>
            {validationErrors.department && (
              <span className="error-message">{validationErrors.department}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="btn-spinner" />
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Kullanıcı Oluştur</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview Card */}
        {formData.username && (
          <div className="preview-card">
            <h3>Önizleme</h3>
            <div className="preview-content">
              <div className="preview-avatar">
                {formData.username.charAt(0).toUpperCase()}
              </div>
              <div className="preview-details">
                <div className="preview-username">{formData.username}</div>
                <div className="preview-role">
                  {formData.role === 'Admin' ? 'Admin' : 'Kullanıcı'}
                </div>
                <div className="preview-department">
                  {formData.department && (
                    <>
                      <span>{departmentOptions.find(opt => opt.value === formData.department)?.label}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUser;