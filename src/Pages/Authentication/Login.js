// src/Pages/Authentication/Login.js - Basit ve stabil version
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  Label,
} from "reactstrap";
import axiosInstance from "../../helpers/axiosConfig";
import "./LoginNew.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sadece token kontrolü
    const token = localStorage.getItem("token");
    if (token) {
      // Var olan session varsa redirect
      window.location.href = '/';
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/account/login", { username, password });

      if (response && response.token) {
        // localStorage'ı set et
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("isAdmin", String(response.isAdmin));
        localStorage.setItem("userId", String(response.userid));
        localStorage.setItem("userDepartment", response.department);
        
        console.log('Login successful, department:', response.department);
        
        // Hard redirect - bu kesin çalışır
        window.location.href = '/';
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="limonian-login">
      <div className="limonian-login-background">
        <div className="limonian-animated-bg"></div>
      </div>
      
      <Container className="limonian-login-container">
        <Row className="justify-content-center">
          <Col lg={4} md={6} sm={8} xs={11}>
            <div className="limonian-login-logo">
              <div className="limonian-logo-icon">L</div>
              <h1>Limonian AI</h1>
            </div>
            
            <Card className="limonian-login-card">
              <CardBody className="limonian-login-card-body">
                <div className="limonian-login-header">
                  <h2>Hoşgeldiniz</h2>
                  <p>Limonian AI Portal'a giriş yapın</p>
                </div>

                {error && (
                  <Alert color="danger" className="limonian-login-alert">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleLogin} className="limonian-login-form">
                  <div className="limonian-form-group">
                    <Label className="limonian-form-label">Kullanıcı Adı</Label>
                    <Input
                      type="text"
                      className="limonian-form-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Kullanıcı adınızı giriniz"
                      required
                    />
                  </div>

                  <div className="limonian-form-group">
                    <Label className="limonian-form-label">Şifre</Label>
                    <Input
                      type="password"
                      className="limonian-form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Şifrenizi giriniz"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="limonian-login-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="limonian-loading-spinner"></span>
                    ) : (
                      "Giriş Yap"
                    )}
                  </button>
                </Form>
              </CardBody>
            </Card>

            <div className="limonian-login-footer">
              <p>© {new Date().getFullYear()} Limonian AI. Tüm hakları saklıdır.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;