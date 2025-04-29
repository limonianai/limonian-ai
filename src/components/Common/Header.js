import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import '../../assets/scss/custom/limonian-theme.scss';

const Header = () => {
  // Get user information from localStorage
  const username = localStorage.getItem("username") || "User";
  const department = localStorage.getItem("userDepartment") || "General";
  
  // Get user's initial for avatar
  const getUserInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="header">
      <Container fluid>
        <div className="header-content">
          <div className="logo">
            <div className="logo-img">L</div>
            <h1>Limonian AI</h1>
          </div>
          
          <div className="user-profile">
            <div className="user-info">
              <div className="user-name">{username}</div>
              <div className="user-dept">{department} Department</div>
            </div>
            <div className="avatar">{getUserInitial(username)}</div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;