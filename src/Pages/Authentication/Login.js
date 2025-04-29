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
import "./Login.css";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      navigate(isAdmin ? "/dashboard" : "/chat");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/account/login", { username, password });

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("isAdmin", response.isAdmin);
        localStorage.setItem("userId", response.userid);
        localStorage.setItem("userDepartment", response.department);

        if (response.isAdmin) {
          navigate("/dashboard");
        } else {
          navigate("/chat");
        }
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} xl={4}>
            <Card className="login-card">
              <CardBody className="p-4">
                <div className="text-center mb-4">
                  <h4 className="login-title">Hoşgeldiniz!</h4>
                  <p className="text-muted">LimonianAI için giriş yapınız.</p>
                </div>

                {error && <Alert color="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <Label className="form-label">Kullanıcı Adı</Label>
                    <Input
                      type="text"
                      className="login-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Kullanıcı adınızı giriniz"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Şifre</Label>
                    <Input
                      type="password"
                      className="login-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Şifrenizi giriniz"
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="login-button">Giriş Yap</button>
                  </div>
                </Form>
              </CardBody>
            </Card>

            <div className="mt-5 text-center">
              <p className="text-white-50">
                © {new Date().getFullYear()} LimonianAI. Crafted by Behlül.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
