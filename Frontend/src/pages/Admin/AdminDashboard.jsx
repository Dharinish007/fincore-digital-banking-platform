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
  FaUniversity,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="dashboard-container">

      {/* =========================
          Sidebar
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-header">

          <div className="logo-circle">
            <FaUniversity />
          </div>

          <div>
            <h2>FinCore</h2>
            <span>Digital Banking</span>
          </div>

        </div>

        <ul className="menu">

          <li className="active">
            <FaHome />
            <span>Dashboard</span>
          </li>

          <li>
            <FaUserCog />
            <span>Employee Management</span>
          </li>

          <li>
            <FaUserFriends />
            <span>User Management</span>
          </li>

          <li>
            <FaUserShield />
            <span>Role Management</span>
          </li>

          <li>
            <FaClipboardList />
            <span>Audit Logs</span>
          </li>

          <li>
            <FaChartBar />
            <span>Reports</span>
          </li>

          <li>
            <FaCog />
            <span>Settings</span>
          </li>

          <li>
            <FaUserCircle />
            <span>Profile</span>
          </li>

        </ul>

        <div className="logout">
          <FaSignOutAlt />
          <span>Logout</span>
        </div>

      </aside>


      {/* =========================
          Main Content
      ========================= */}

      <main className="main-content">

        {/* Topbar */}

        <div className="topbar">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search customers, employees..."
            />

          </div>

          <div className="top-right">

            <div className="notification">
              <FaBell className="bell" />
              <span className="notification-dot"></span>
            </div>

            <div className="profile">
              A
            </div>

            <div className="admin-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

          </div>

        </div>


        {/* =========================
            Welcome Section
        ========================= */}

        <div className="welcome">

          <div>
            <h1>Welcome Back, Admin 👋</h1>

            <p>
              Monitor and manage your digital banking platform from here.
            </p>
          </div>

          <div className="dashboard-date">
            <span>System Status</span>
            <strong>
              <span className="status-dot"></span>
              All Systems Operational
            </strong>
          </div>

        </div>


        {/* =========================
            Statistics Cards
        ========================= */}

        <div className="cards">

          {/* Customers */}

          <div className="card">

            <div className="card-top">
              <div className="card-icon blue">
                <FaUsers />
              </div>

              <span className="growth positive">
                <FaArrowUp /> 12.5%
              </span>
            </div>

            <div className="card-content">
              <p>Total Customers</p>
              <h2>1,250</h2>
              <span>Compared to last month</span>
            </div>

          </div>


          {/* Employees */}

          <div className="card">

            <div className="card-top">
              <div className="card-icon green">
                <FaUserTie />
              </div>

              <span className="growth positive">
                <FaArrowUp /> 4.2%
              </span>
            </div>

            <div className="card-content">
              <p>Total Employees</p>
              <h2>42</h2>
              <span>Active bank employees</span>
            </div>

          </div>


          {/* Transactions */}

          <div className="card">

            <div className="card-top">
              <div className="card-icon orange">
                <FaMoneyCheckAlt />
              </div>

              <span className="growth positive">
                <FaArrowUp /> 8.7%
              </span>
            </div>

            <div className="card-content">
              <p>Total Transactions</p>
              <h2>₹2.8 Cr</h2>
              <span>Processed this month</span>
            </div>

          </div>


          {/* Deposits */}

          <div className="card">

            <div className="card-top">
              <div className="card-icon purple">
                <FaWallet />
              </div>

              <span className="growth negative">
                <FaArrowDown /> 2.1%
              </span>
            </div>

            <div className="card-content">
              <p>Total Deposits</p>
              <h2>₹15 Cr</h2>
              <span>Across all accounts</span>
            </div>

          </div>

        </div>


        {/* =========================
            Management Overview
        ========================= */}

        <div className="section-header">

          <div>
            <h2>Management Overview</h2>
            <p>Quick overview of your banking operations.</p>
          </div>

        </div>


        <div className="overview-grid">

          {/* Employee Management */}

          <div className="overview-card">

            <div className="overview-icon blue">
              <FaUserCog />
            </div>

            <div className="overview-content">

              <h3>Employee Management</h3>

              <p>
                Manage bank employees and assign their access roles.
              </p>

              <div className="overview-stats">
                <span>
                  <strong>42</strong> Employees
                </span>

                <span>
                  <strong>4</strong> Roles
                </span>
              </div>

            </div>

          </div>


          {/* Role Management */}

          <div className="overview-card">

            <div className="overview-icon purple">
              <FaUserShield />
            </div>

            <div className="overview-content">

              <h3>Role Management</h3>

              <p>
                Control permissions and role-based access for employees.
              </p>

              <div className="overview-stats">
                <span>
                  <strong>4</strong> Roles
                </span>

                <span>
                  <strong>12</strong> Permissions
                </span>
              </div>

            </div>

          </div>


          {/* User Management */}

          <div className="overview-card">

            <div className="overview-icon green">
              <FaUserFriends />
            </div>

            <div className="overview-content">

              <h3>User Management</h3>

              <p>
                Monitor and manage registered customer accounts.
              </p>

              <div className="overview-stats">
                <span>
                  <strong>1,250</strong> Customers
                </span>

                <span>
                  <strong>1,198</strong> Active
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* =========================
            Recent Transactions
        ========================= */}

        <div className="table-card">

          <div className="table-header">

            <div>
              <h2>Recent Transactions</h2>
              <p>Latest transactions across the banking platform.</p>
            </div>

            <button className="view-all-btn">
              View All
            </button>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Customer</th>
                  <th>Account Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">RS</div>

                      <div>
                        <strong>Rahul Sharma</strong>
                        <span>rahul@example.com</span>
                      </div>
                    </div>
                  </td>

                  <td>Saving Account</td>

                  <td className="amount">
                    ₹50,000
                  </td>

                  <td>08 Aug 2026</td>

                  <td>
                    <span className="status success">
                      Success
                    </span>
                  </td>

                </tr>


                <tr>

                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">PP</div>

                      <div>
                        <strong>Priya Patil</strong>
                        <span>priya@example.com</span>
                      </div>
                    </div>
                  </td>

                  <td>Current Account</td>

                  <td className="amount">
                    ₹12,000
                  </td>

                  <td>08 Aug 2026</td>

                  <td>
                    <span className="status success">
                      Success
                    </span>
                  </td>

                </tr>


                <tr>

                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">AK</div>

                      <div>
                        <strong>Amit Kumar</strong>
                        <span>amit@example.com</span>
                      </div>
                    </div>
                  </td>

                  <td>Saving Account</td>

                  <td className="amount">
                    ₹8,500
                  </td>

                  <td>07 Aug 2026</td>

                  <td>
                    <span className="status pending">
                      Pending
                    </span>
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;