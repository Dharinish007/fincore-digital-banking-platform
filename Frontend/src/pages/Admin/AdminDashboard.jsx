import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminStatCard from "../../components/admin/AdminStatCard";
import ManagementOverview from "../../components/admin/ManagementOverview";
import RecentTransactions from "../../components/admin/RecentTransactions";

import {
  FaUsers,
  FaUserTie,
  FaMoneyCheckAlt,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">

      {/* ==========================================
          Sidebar
      ========================================== */}

      <AdminSidebar />


      {/* ==========================================
          Main Content
      ========================================== */}

      <main className="admin-main">

        {/* Navbar */}

        <AdminNavbar />


        {/* Dashboard Content */}

        <div className="admin-content">

          {/* ==========================================
              Welcome Section
          ========================================== */}

          <section className="admin-welcome">

            <div className="welcome-text">

              <h1>
                Welcome Back, Admin 👋
              </h1>

              <p>
                Monitor and manage your digital banking
                platform from here.
              </p>

            </div>


            {/* System Status */}

            <div className="system-status">

              <span className="status-label">
                System Status
              </span>

              <strong>
                <span className="status-dot"></span>
                All Systems Operational
              </strong>

            </div>

          </section>


          {/* ==========================================
              Statistics
          ========================================== */}

          <section className="admin-stats">

            <AdminStatCard
              title="Total Customers"
              value="1,250"
              subtitle="Compared to last month"
              icon={<FaUsers />}
              iconClass="blue"
              growth="12.5%"
              growthIcon={<FaArrowUp />}
              growthType="positive"
            />


            <AdminStatCard
              title="Total Employees"
              value="42"
              subtitle="Active bank employees"
              icon={<FaUserTie />}
              iconClass="green"
              growth="4.2%"
              growthIcon={<FaArrowUp />}
              growthType="positive"
            />


            <AdminStatCard
              title="Total Transactions"
              value="₹2.8 Cr"
              subtitle="Processed this month"
              icon={<FaMoneyCheckAlt />}
              iconClass="orange"
              growth="8.7%"
              growthIcon={<FaArrowUp />}
              growthType="positive"
            />


            <AdminStatCard
              title="Total Deposits"
              value="₹15 Cr"
              subtitle="Across all accounts"
              icon={<FaWallet />}
              iconClass="purple"
              growth="2.1%"
              growthIcon={<FaArrowDown />}
              growthType="negative"
            />

          </section>


          {/* ==========================================
              Management Overview
          ========================================== */}

          <section className="management-section">

            <div className="section-heading">

              <h2>
                Management Overview
              </h2>

              <p>
                Quick overview of your banking operations.
              </p>

            </div>


            <ManagementOverview />

          </section>


          {/* ==========================================
              Recent Transactions
          ========================================== */}

          <section className="transactions-section">

            <RecentTransactions />

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;