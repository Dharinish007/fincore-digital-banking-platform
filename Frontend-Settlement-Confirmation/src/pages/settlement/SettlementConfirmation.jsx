import { useMemo, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaTimes,
  FaMoneyBillWave,
  FaExchangeAlt,
} from "react-icons/fa";

import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ManagerNavbar from "../../components/manager/ManagerNavbar";

import "./SettlementConfirmation.css";

/* =========================================================
   Temporary Mock Settlement Data
   Replace with API data during backend integration
========================================================= */

const settlementData = [
  {
    id: "SET-2026-001",
    transactionRef: "TXN-874521",
    customerName: "Rahul Sharma",
    accountNumber: "XXXX XXXX 4521",
    amount: "₹1,25,000",
    settlementDate: "19 Aug 2026",
    transactionCount: 12,
    status: "Pending",
  },
  {
    id: "SET-2026-002",
    transactionRef: "TXN-874522",
    customerName: "Priya Patil",
    accountNumber: "XXXX XXXX 7832",
    amount: "₹85,500",
    settlementDate: "19 Aug 2026",
    transactionCount: 8,
    status: "Pending",
  },
  {
    id: "SET-2026-003",
    transactionRef: "TXN-874523",
    customerName: "Amit Joshi",
    accountNumber: "XXXX XXXX 1298",
    amount: "₹2,10,000",
    settlementDate: "18 Aug 2026",
    transactionCount: 21,
    status: "Confirmed",
  },
  {
    id: "SET-2026-004",
    transactionRef: "TXN-874524",
    customerName: "Sneha Kulkarni",
    accountNumber: "XXXX XXXX 5634",
    amount: "₹64,750",
    settlementDate: "18 Aug 2026",
    transactionCount: 6,
    status: "Pending",
  },
];

/* =========================================================
   Component
========================================================= */

function SettlementConfirmation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedSettlement, setSelectedSettlement] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* =======================================================
     Filter Settlements
  ======================================================= */

  const filteredSettlements = useMemo(() => {
    return settlementData.filter((settlement) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        settlement.id.toLowerCase().includes(search) ||
        settlement.transactionRef.toLowerCase().includes(search) ||
        settlement.customerName.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        settlement.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  /* =======================================================
     Summary Statistics
  ======================================================= */

  const pendingCount = settlementData.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmedCount = settlementData.filter(
    (item) => item.status === "Confirmed"
  ).length;

  /* =======================================================
     Handlers
  ======================================================= */

  const handleViewSettlement = (settlement) => {
    setSelectedSettlement(settlement);
  };

  const handleCloseDetails = () => {
    setSelectedSettlement(null);
  };

  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmSettlement = () => {
    /*
      Backend API integration will be added here.

      Example later:

      await confirmSettlement(selectedSettlement.id);
    */

    console.log(
      "Settlement confirmed:",
      selectedSettlement?.id
    );

    setShowConfirmModal(false);
    setSelectedSettlement(null);

    alert(
      `Settlement ${selectedSettlement?.id} confirmed successfully.`
    );
  };

  /* =======================================================
     Render
  ======================================================= */

  return (
    <div className="manager-dashboard">

      {/* ===================================================
          Sidebar
      =================================================== */}

      <ManagerSidebar />

      {/* ===================================================
          Main Area
      =================================================== */}

      <div className="manager-main">

        {/* Navbar */}

        <ManagerNavbar />

        {/* =================================================
            Settlement Content
        ================================================= */}

        <main className="settlement-content">

          {/* Page Heading */}

          <div className="settlement-heading">

            <div>
              <h1>Settlement Confirmation</h1>

              <p>
                Review and confirm pending settlement
                transactions.
              </p>
            </div>

          </div>

          {/* =================================================
              Summary Cards
          ================================================= */}

          <div className="settlement-stats">

            {/* Pending */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon pending-icon">
                <FaClock />
              </div>

              <div className="settlement-stat-info">

                <span>Pending Settlements</span>

                <strong>{pendingCount}</strong>

              </div>

            </div>

            {/* Confirmed */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon confirmed-icon">
                <FaCheckCircle />
              </div>

              <div className="settlement-stat-info">

                <span>Confirmed Settlements</span>

                <strong>{confirmedCount}</strong>

              </div>

            </div>

            {/* Total Value */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon amount-icon">
                <FaMoneyBillWave />
              </div>

              <div className="settlement-stat-info">

                <span>Total Settlement Value</span>

                <strong>₹4.85 L</strong>

              </div>

            </div>

            {/* Transactions */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon transaction-icon">
                <FaExchangeAlt />
              </div>

              <div className="settlement-stat-info">

                <span>Total Transactions</span>

                <strong>47</strong>

              </div>

            </div>

          </div>

          {/* =================================================
              Toolbar
          ================================================= */}

          <div className="settlement-toolbar">

            {/* Search */}

            <div className="settlement-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search settlement ID, transaction or customer..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>

            {/* Filter */}

            <div className="settlement-filter">

              <FaFilter />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              Settlement Table
          ================================================= */}

          <section className="settlement-table-card">

            {/* Table Header */}

            <div className="settlement-table-header">

              <div>

                <h2>Settlement Records</h2>

                <p>
                  {filteredSettlements.length} settlement(s)
                  found
                </p>

              </div>

            </div>

            {/* Table */}

            <div className="settlement-table-wrapper">

              <table className="settlement-table">

                <thead>

                  <tr>

                    <th>Settlement ID</th>

                    <th>Customer</th>

                    <th>Transaction Ref.</th>

                    <th>Amount</th>

                    <th>Date</th>

                    <th>Status</th>

                    <th>Action</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSettlements.length > 0 ? (

                    filteredSettlements.map(
                      (settlement) => (

                        <tr key={settlement.id}>

                          {/* Settlement ID */}

                          <td>

                            <span className="settlement-id">
                              {settlement.id}
                            </span>

                          </td>

                          {/* Customer */}

                          <td>

                            <div className="settlement-customer">

                              <strong>
                                {settlement.customerName}
                              </strong>

                              <span>
                                {settlement.accountNumber}
                              </span>

                            </div>

                          </td>

                          {/* Transaction */}

                          <td>
                            <span className="transaction-reference">
                              {settlement.transactionRef}
                            </span>
                          </td>

                          {/* Amount */}

                          <td>

                            <strong className="settlement-amount">
                              {settlement.amount}
                            </strong>

                          </td>

                          {/* Date */}

                          <td>
                            {settlement.settlementDate}
                          </td>

                          {/* Status */}

                          <td>

                            <span
                              className={`settlement-status ${
                                settlement.status.toLowerCase()
                              }`}
                            >

                              {settlement.status ===
                              "Confirmed" ? (
                                <FaCheckCircle />
                              ) : (
                                <FaClock />
                              )}

                              {settlement.status}

                            </span>

                          </td>

                          {/* Action */}

                          <td>

                            <button
                              className="settlement-view-btn"
                              onClick={() =>
                                handleViewSettlement(
                                  settlement
                                )
                              }
                            >

                              <FaEye />

                              View

                            </button>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="settlement-empty"
                      >

                        No settlement records found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </main>

      </div>

      {/* =====================================================
          Settlement Details Modal
      ===================================================== */}

      {selectedSettlement && (

        <div className="settlement-overlay">

          <div className="settlement-details-modal">

            {/* Modal Header */}

            <div className="settlement-modal-header">

              <div>

                <h2>
                  Settlement Details
                </h2>

                <p>
                  {selectedSettlement.id}
                </p>

              </div>

              <button
                className="settlement-close-btn"
                onClick={handleCloseDetails}
              >

                <FaTimes />

              </button>

            </div>

            {/* Details */}

            <div className="settlement-details-grid">

              <div className="settlement-detail">

                <span>Customer Name</span>

                <strong>
                  {selectedSettlement.customerName}
                </strong>

              </div>

              <div className="settlement-detail">

                <span>Account Number</span>

                <strong>
                  {selectedSettlement.accountNumber}
                </strong>

              </div>

              <div className="settlement-detail">

                <span>Transaction Reference</span>

                <strong>
                  {selectedSettlement.transactionRef}
                </strong>

              </div>

              <div className="settlement-detail">

                <span>Transaction Count</span>

                <strong>
                  {selectedSettlement.transactionCount}
                </strong>

              </div>

              <div className="settlement-detail">

                <span>Settlement Date</span>

                <strong>
                  {selectedSettlement.settlementDate}
                </strong>

              </div>

              <div className="settlement-detail">

                <span>Settlement Amount</span>

                <strong className="detail-amount">
                  {selectedSettlement.amount}
                </strong>

              </div>

              <div className="settlement-detail">

                <span>Status</span>

                <span
                  className={`settlement-status ${
                    selectedSettlement.status.toLowerCase()
                  }`}
                >

                  {selectedSettlement.status ===
                  "Confirmed" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaClock />
                  )}

                  {selectedSettlement.status}

                </span>

              </div>

            </div>

            {/* Modal Actions */}

            {selectedSettlement.status ===
              "Pending" && (

              <div className="settlement-modal-actions">

                <button
                  className="settlement-cancel-btn"
                  onClick={handleCloseDetails}
                >
                  Cancel
                </button>

                <button
                  className="settlement-confirm-btn"
                  onClick={handleOpenConfirmModal}
                >

                  <FaCheckCircle />

                  Confirm Settlement

                </button>

              </div>

            )}

          </div>

        </div>

      )}

      {/* =====================================================
          Confirmation Modal
      ===================================================== */}

      {showConfirmModal && selectedSettlement && (

        <div className="settlement-overlay">

          <div className="settlement-confirm-modal">

            <div className="confirm-icon-wrapper">

              <FaCheckCircle />

            </div>

            <h2>
              Confirm Settlement?
            </h2>

            <p>

              Are you sure you want to confirm settlement{" "}

              <strong>
                {selectedSettlement.id}
              </strong>

              ?

              <br />

              This action may not be reversible.

            </p>

            <div className="settlement-confirm-actions">

              <button
                className="settlement-cancel-btn"
                onClick={handleCloseConfirmModal}
              >
                Cancel
              </button>

              <button
                className="settlement-confirm-btn"
                onClick={handleConfirmSettlement}
              >

                <FaCheckCircle />

                Yes, Confirm

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default SettlementConfirmation;