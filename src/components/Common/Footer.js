import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import '../../assets/scss/custom/limonian-theme.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <Container fluid>
        <div className="copyright">
          © {currentYear} Limonian Co., Ltd. All rights reserved.
        </div>
        <div className="footer-links">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
          <Link to="/howto">Support</Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;