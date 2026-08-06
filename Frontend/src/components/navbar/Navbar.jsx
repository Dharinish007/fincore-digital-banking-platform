import { Link, NavLink } from "react-router-dom";
import {
  FaUniversity,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">

      <div className="container navbar-container">

        {/* Logo */}

        <Link to="/" className="logo">

          <FaUniversity className="logo-icon" />

          <span>FinCore</span>

        </Link>

        {/* Navigation */}

        <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>

          <NavLink to="/">Home</NavLink>

          <a href="#features">Features</a>

          <a href="#about">About</a>

          <a href="#contact">Contact</a>

        </nav>

        {/* Buttons */}

        <div className="nav-buttons">

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Open Account
          </Link>

        </div>

        {/* Mobile Menu */}

        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

      </div>

    </header>
  );
};

export default Navbar;