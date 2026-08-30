import {
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

import TellerSidebar from "../../components/teller/TellerSidebar";
import TellerNavbar from "../../components/teller/TellerNavbar";
import TellerStatCard from "../../components/teller/TellerStatCard";
import CashSummary from "../../components/teller/CashSummary";
import RecentTransactions from "../../components/teller/RecentTransactions";

import "./TellerDashboard.css";

function TellerDashboard() {
  return (
    <div className="teller-dashboard">

      {/* Sidebar */}
      <TellerSidebar />

      {/* Main Content */}
      <div className="teller-main">

        {/* Navbar */}
        <TellerNavbar />

        {/* Dashboard */}
        <main className="teller-content">

          {/* Heading */}
          <div className="teller-heading">

            <h1>
              Welcome Back, Teller 👋
            </h1>

            <p>
              Manage daily cash operations and customer transactions.
            </p>

          </div>

          {/* Statistics */}
          <div className="teller-stats">

            <TellerStatCard
              icon={<FaMoneyBillWave />}
              title="Today's Deposits"
              value="₹12.5 L"
              type="green"
            />

            <TellerStatCard
              icon={<FaMoneyCheckAlt />}
              title="Today's Withdrawals"
              value="₹8.2 L"
              type="orange"
            />

            <TellerStatCard
              icon={<FaUsers />}
              title="Customers Served"
              value="86"
              type="blue"
            />

            <TellerStatCard
              icon={<FaWallet />}
              title="Cash Available"
              value="₹24.8 L"
              type="purple"
            />

          </div>

          {/* Bottom Sections */}
          <div className="teller-dashboard-grid">

            <div className="teller-section">
              <RecentTransactions />
            </div>

            <div className="teller-section">
              <CashSummary />
            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default TellerDashboard;