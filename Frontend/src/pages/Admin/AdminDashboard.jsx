import {
  FaUsers,
  FaUserTie,
  FaMoneyCheckAlt,
  FaWallet,
  FaBell,
  FaSearch,
  FaHome,
  FaUserCog,
  FaUserFriends,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="dashboard-container">

      {/* Sidebar */}

      <aside className="sidebar">

  <div className="sidebar-header">

    <div className="logo-circle">
      🏦
    </div>

    <div>
      <h2>FinCore</h2>
      <span>Digital Banking</span>
    </div>

  </div>

  <ul className="menu">

    <li className="active">
      <FaHome />
      Dashboard
    </li>

    <li>
      <FaUserCog />
      Employee Management
    </li>

    <li>
      <FaUserFriends />
      User Management
    </li>

    <li>
      <FaUserShield />
      Role Management
    </li>

    <li>
      <FaClipboardList />
      Audit Logs
    </li>

    <li>
      <FaChartBar />
      Reports
    </li>

    <li>
      <FaCog />
      Settings
    </li>

    <li>
      <FaUserCircle />
      Profile
    </li>

  </ul>

  <div className="logout">

    <FaSignOutAlt />

    Logout

  </div>

</aside>

      {/* Main */}

      <main className="main-content">

        {/* Navbar */}

        <div className="topbar">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search..."
            />

          </div>

          <div className="top-right">

            <FaBell className="bell" />

            <div className="profile">
              Admin
            </div>

          </div>

        </div>

        {/* Welcome */}

        <div className="welcome">

          <h1>
            Welcome Back, Admin 👋
          </h1>
          <p>
            Here's an overview of your digital banking platform.
          </p>

        </div>

        {/* Cards */}

        <div className="cards">

  <div className="card">
    <div className="card-icon blue">
      <FaUsers />
    </div>

    <h2>1,250</h2>

    <p>Total Customers</p>
  </div>

  <div className="card">
    <div className="card-icon green">
      <FaUserTie />
    </div>

    <h2>42</h2>

    <p>Employees</p>
  </div>

  <div className="card">
    <div className="card-icon orange">
      <FaMoneyCheckAlt />
    </div>

    <h2>₹2.8 Cr</h2>

    <p>Total Transactions</p>
  </div>

  <div className="card">
    <div className="card-icon purple">
      <FaWallet />
    </div>

    <h2>₹15 Cr</h2>

    <p>Total Deposits</p>
  </div>

</div>


        {/* Table */}

        <div className="table-card">

          <h2>Recent Transactions</h2>

          <table>

            <thead>

              <tr>

                <th>Customer</th>

                <th>Account</th>

                <th>Amount</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td>Rahul Sharma</td>

                <td>Saving</td>

                <td>₹50,000</td>

                <td className="success">Success</td>

              </tr>

              <tr>

                <td>Priya Patil</td>

                <td>Current</td>

                <td>₹12,000</td>

                <td className="success">Success</td>

              </tr>

              <tr>

                <td>Amit Kumar</td>

                <td>Saving</td>

                <td>₹8,500</td>

                <td className="pending">Pending</td>

              </tr>

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;