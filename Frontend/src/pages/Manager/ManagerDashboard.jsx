import {
  FaUsers,
  FaIdCard,
  FaMoneyCheckAlt,
  FaChartLine,
} from "react-icons/fa";

import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ManagerNavbar from "../../components/manager/ManagerNavbar";
import ManagerStatCard from "../../components/manager/ManagerStatCard";
import PendingKYC from "../../components/manager/PendingKYC";
import LoanRequests from "../../components/manager/LoanRequests";

import "./ManagerDashboard.css";

function ManagerDashboard() {
  return (
    <div className="manager-dashboard">

      {/* Sidebar */}

      <ManagerSidebar />

      {/* Main */}

      <div className="manager-main">

        {/* Navbar */}

        <ManagerNavbar />

        {/* Dashboard Content */}

        <main className="manager-content">

          {/* Heading */}

          <div className="manager-heading">

            <h1>
              Welcome Back, Manager 👋
            </h1>

            <p>
              Monitor banking operations, customer activities and approvals.
            </p>

          </div>

          {/* Statistics */}

          <div className="manager-stats">

            <ManagerStatCard
              icon={<FaUsers />}
              title="Active Customers"
              value="1,253"
              type="blue"
            />

            <ManagerStatCard
              icon={<FaIdCard />}
              title="Pending KYC"
              value="128"
              type="orange"
            />

            <ManagerStatCard
              icon={<FaMoneyCheckAlt />}
              title="Loan Requests"
              value="34"
              type="purple"
            />

            <ManagerStatCard
              icon={<FaChartLine />}
              title="Today's Transactions"
              value="₹8.5 Cr"
              type="green"
            />

          </div>

          {/* Dashboard Sections */}

          <div className="manager-dashboard-grid">

            <div className="manager-section">

              <PendingKYC />

            </div>

            <div className="manager-section">

              <LoanRequests />

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default ManagerDashboard;