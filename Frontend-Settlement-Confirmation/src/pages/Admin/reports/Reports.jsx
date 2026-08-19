import { useState } from "react";

import {
  FaChartBar,
  FaUsers,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import ReportStatCard from "../../../components/admin/reports/ReportStatCard";
import ReportFilters from "../../../components/admin/reports/ReportFilters";
import ReportSummary from "../../../components/admin/reports/ReportSummary";
import TransactionReport from "../../../components/admin/reports/TransactionReport";

import "./Reports.css";

function Reports() {

  const [reportType, setReportType] =
    useState("transactions");

  const [dateRange, setDateRange] =
    useState("month");

  const [status, setStatus] =
    useState("all");


  const handleGenerateReport = () => {

    console.log("Generating report:", {
      reportType,
      dateRange,
      status,
    });

    // Backend API integration will be added later.
  };


  return (
    <div className="reports-layout">

      <AdminSidebar />

      <div className="reports-main">

        <AdminNavbar />


        <main className="reports-content">

          {/* ==========================================
              Page Header
          ========================================== */}

          <div className="reports-page-header">

            <div>

              <span className="reports-page-label">
                ANALYTICS & REPORTING
              </span>

              <h1>
                Reports
              </h1>

              <p>
                Generate and analyze reports for your digital banking operations.
              </p>

            </div>

            <div className="reports-header-icon">
              <FaChartBar />
            </div>

          </div>


          {/* ==========================================
              Statistics
          ========================================== */}

          <div className="reports-stats-grid">

            <ReportStatCard
              icon={<FaUsers />}
              title="Total Customers"
              value="1,250"
              description="Registered customers"
              variant="blue"
            />

            <ReportStatCard
              icon={<FaExchangeAlt />}
              title="Transactions"
              value="8,542"
              description="This month"
              variant="green"
            />

            <ReportStatCard
              icon={<FaMoneyBillWave />}
              title="Transaction Volume"
              value="₹2.8 Cr"
              description="Processed this month"
              variant="orange"
            />

            <ReportStatCard
              icon={<FaExclamationTriangle />}
              title="NPA Accounts"
              value="86"
              description="Accounts requiring attention"
              variant="purple"
            />

          </div>


          {/* ==========================================
              Filters
          ========================================== */}

          <ReportFilters
            reportType={reportType}
            setReportType={setReportType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            status={status}
            setStatus={setStatus}
            onGenerate={handleGenerateReport}
          />


          {/* ==========================================
              Summary
          ========================================== */}

          <ReportSummary />


          {/* ==========================================
              Transaction Report
          ========================================== */}

          <TransactionReport />

        </main>

      </div>

    </div>
  );
}

export default Reports;