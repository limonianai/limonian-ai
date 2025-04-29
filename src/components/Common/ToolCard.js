import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/scss/custom/limonian-theme.scss';

const ToolCard = ({ icon, title, description, link }) => {
  return (
    <Link to={link || "#"} className="tool-card">
      <div className="tool-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default ToolCard;