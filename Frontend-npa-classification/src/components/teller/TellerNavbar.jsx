import {
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import "./TellerNavbar.css";

function TellerNavbar() {
  return (
    <header className="teller-navbar">

      <div className="teller-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search customer or transaction..."
        />

      </div>

      <div className="teller-navbar-right">

        <FaBell className="teller-nav-icon" />

        <div className="teller-profile">

          <FaUserCircle />

          <span>Teller</span>

        </div>

      </div>

    </header>
  );
}

export default TellerNavbar;