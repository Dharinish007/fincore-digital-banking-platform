import { useState } from "react";

import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

import NpaForm from "../../components/npa/NpaForm";
import NpaResult from "../../components/npa/NpaResult";
import NpaStatCard from "../../components/npa/NpaStatCard";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import { classifyNpa } from "../../services/npaService";

import "./NpaClassification.css";

function NpaClassification() {

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClassification = async (loanData) => {

    try {

      setLoading(true);

      const classificationResult =
        await classifyNpa(loanData);

      setResult(classificationResult);

    } catch (error) {

      console.error(
        "NPA classification failed:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="npa-layout">

      {/* ==========================================
          Admin Sidebar
      ========================================== */}

      <AdminSidebar />


      {/* ==========================================
          Main Content
      ========================================== */}

      <main className="npa-main">

        {/* Navbar */}

        <AdminNavbar />


        {/* NPA Page Content */}

        <div className="npa-page">

          {/* ==========================================
              Page Header
          ========================================== */}

          <div className="npa-page-header">

            <div>

              <span className="npa-page-label">
                CREDIT & RISK MANAGEMENT
              </span>

              <h1>
                NPA Classification
              </h1>

              <p>
                Evaluate loan accounts and classify their
                non-performing asset status.
              </p>

            </div>

          </div>


          {/* ==========================================
              Statistics
          ========================================== */}

          <div className="npa-stats-grid">

            <NpaStatCard
              icon={<FaUsers />}
              title="Total Loan Accounts"
              value="1,250"
              description="Active accounts"
              variant="blue"
            />

            <NpaStatCard
              icon={<FaExclamationTriangle />}
              title="NPA Accounts"
              value="86"
              description="Accounts requiring attention"
              variant="orange"
            />

            <NpaStatCard
              icon={<FaCheckCircle />}
              title="Standard Accounts"
              value="1,164"
              description="Performing normally"
              variant="green"
            />

            <NpaStatCard
              icon={<FaChartLine />}
              title="NPA Ratio"
              value="6.88%"
              description="Current portfolio ratio"
              variant="purple"
            />

          </div>


          {/* ==========================================
              Main NPA Section
          ========================================== */}

          <div className="npa-main-grid">

            {/* Form */}

            <div className="npa-form-section">

              <NpaForm
                onClassify={handleClassification}
                loading={loading}
              />

            </div>


            {/* Result */}

            <div className="npa-result-section">

              <NpaResult
                result={result}
              />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default NpaClassification;