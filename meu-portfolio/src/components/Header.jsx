import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header>
      <h1>Mário Laux Neto</h1>
      <p>Desenvolvedor</p>
      
      <nav className="navbar">
        <ul className="navbar-list">
          <li><Link to="/" className="navbar-item">Home</Link></li>
          <li><Link to="/projects" className="navbar-item">Projetos</Link></li>
          <li><Link to="/about" className="navbar-item">Sobre</Link></li>
          <li><Link to="/contact" className="navbar-item">Contato</Link></li>
          
        </ul>
      </nav>
    </header>
  );
};

export default Header;