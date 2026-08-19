import {
  FaWallet,
  FaUniversity,
  FaExchangeAlt,
  FaGift,
} from "react-icons/fa";

import "./CustomerDashboard.css";

import CustomerSidebar from "../../components/customer/CustomerSidebar";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerStatCard from "../../components/customer/CustomerStatCard";
import QuickActions from "../../components/customer/QuickActions";
import RecentTransactions from "../../components/customer/RecentTransactions";

function CustomerDashboard() {
  return (
    <div className="customer-dashboard">

      {/* =========================
          Fixed Sidebar
      ========================= */}

      <CustomerSidebar />

      {/* =========================
          Main Area
      ========================= */}

      <div className="customer-main">

        {/* Navbar */}

        <CustomerNavbar />

        {/* Dashboard Content */}

        <main className="dashboard-content">

          {/* Heading */}

          <div className="dashboard-heading">

            <h1>
              Welcome Back, Vaishnavi 👋
            </h1>

            <p>
              Here's an overview of your banking activities and account
              summary.
            </p>

          </div>

          {/* =========================
              Statistics
          ========================= */}

          <div className="stats-grid">

            <CustomerStatCard
              icon={<FaWallet />}
              title="Total Balance"
              value="₹1,25,430"
              color="#2563eb"
            />

            <CustomerStatCard
              icon={<FaUniversity />}
              title="Bank Accounts"
              value="02"
              color="#059669"
            />

            <CustomerStatCard
              icon={<FaExchangeAlt />}
              title="Transactions"
              value="245"
              color="#ea580c"
            />

            <CustomerStatCard
              icon={<FaGift />}
              title="Reward Points"
              value="1,250"
              color="#9333ea"
            />

          </div>

          {/* =========================
              Bottom Section
          ========================= */}

          <div className="dashboard-bottom">

            {/* Recent Transactions */}

            <div className="transactions-section">
              <RecentTransactions />
            </div>

            {/* Quick Actions */}

            <div className="actions-section">
              <QuickActions />
            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default CustomerDashboard;