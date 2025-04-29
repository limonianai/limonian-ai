// src/Pages/Authentication/Login.js
import React, { useState } from "react";
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
  FormFeedback,
  Label,
} from "reactstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple mock login - replace with your actual API call
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("username", "Admin");
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("department", "IT");
      navigate("/dashboard");
    } else if (username === "user" && password === "user123") {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("username", "User");
      localStorage.setItem("isAdmin", "false");
      localStorage.setItem("department", "R&D");
      navigate("/chat");
    } else {
      setError("Invalid credentials. Try admin/admin123 or user/user123");
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} xl={4}>
            <Card className="auth-card">
              <CardBody className="p-4">
                <div className="text-center mb-4">
                  <div className="logo-img mx-auto">L</div>
                  <h2 className="mt-3">Limonian AI</h2>
                  <p className="text-muted">Sign in to continue</p>
                </div>
                
                {error && <Alert color="danger">{error}</Alert>}
                
                <Form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <Label className="form-label">Username</Label>
                    <Input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <Label className="form-label">Password</Label>
                    <Input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn">
                      Sign In
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="mb-0 text-muted">
                      Demo credentials:<br />
                      Admin: admin/admin123<br />
                      User: user/user123
                    </p>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;