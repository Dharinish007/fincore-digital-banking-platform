import React from "react";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import "./CustomerNavbar.css";

function CustomerNavbar() {
  return (
    <header className="customer-navbar">

      <div className="navbar-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
        />

      </div>

      <div className="navbar-right">

        <FaBell className="nav-icon" />

        <div className="profile">

          <FaUserCircle />

          <span>Vaishnavi</span>

        </div>

      </div>

    </header>
  );
}

export default CustomerNavbar;