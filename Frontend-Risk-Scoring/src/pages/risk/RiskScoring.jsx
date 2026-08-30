import { useEffect, useState } from "react";

import {
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
  FaSyncAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import { toast } from "react-toastify";

import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ManagerNavbar from "../../components/manager/ManagerNavbar";

import {
  getAllRiskRecords,
  getRiskById,
  searchRiskRecords,
  getRiskRecordsByLevel,
  getRiskRecordsByStatus,
  getRiskStatistics,
  reassessRisk,
} from "../../services/riskScoringService";

import "./RiskScoring.css";


function RiskScoring() {

  // =========================================================
  // Risk Records
  // =========================================================

  const [riskRecords, setRiskRecords] = useState([]);


  // =========================================================
  // Statistics
  // =========================================================

  const [statistics, setStatistics] = useState({
    totalRiskAssessments: 0,
    lowRiskCount: 0,
    mediumRiskCount: 0,
    highRiskCount: 0,
    safeCount: 0,
    reviewCount: 0,
    flaggedCount: 0,
    averageRiskScore: 0,
  });


  // =========================================================
  // Search & Filters
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [riskLevelFilter, setRiskLevelFilter] =
    useState("All");

  const [riskStatusFilter, setRiskStatusFilter] =
    useState("All");


  // =========================================================
  // Selected Risk Record
  // =========================================================

  const [selectedRisk, setSelectedRisk] =
    useState(null);


  // =========================================================
  // Modal States
  // =========================================================

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);


  // =========================================================
  // Loading States
  // =========================================================

  const [loading, setLoading] =
    useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [reassessing, setReassessing] =
    useState(false);


  // =========================================================
  // INITIAL DATA LOAD
  // =========================================================

  useEffect(() => {

    const loadInitialData = async () => {

      try {

        const [
          recordsData,
          statisticsData
        ] = await Promise.all([

          getAllRiskRecords(),

          getRiskStatistics(),

        ]);


        // -----------------------------------------------------
        // Risk Records
        // -----------------------------------------------------

        setRiskRecords(
          Array.isArray(recordsData)
            ? recordsData
            : []
        );


        // -----------------------------------------------------
        // Statistics
        // -----------------------------------------------------

        setStatistics({

          totalRiskAssessments:
            statisticsData?.totalRiskAssessments ??
            0,

          lowRiskCount:
            statisticsData?.lowRiskCount ??
            0,

          mediumRiskCount:
            statisticsData?.mediumRiskCount ??
            0,

          highRiskCount:
            statisticsData?.highRiskCount ??
            0,

          safeCount:
            statisticsData?.safeCount ??
            0,

          reviewCount:
            statisticsData?.reviewCount ??
            0,

          flaggedCount:
            statisticsData?.flaggedCount ??
            0,

          averageRiskScore:
            statisticsData?.averageRiskScore ??
            0,

        });

      } catch (error) {

        console.error(
          "Failed to load risk scoring data:",
          error
        );

        toast.error(
          "Failed to load risk scoring data."
        );

      } finally {

        setLoading(false);

      }

    };


    loadInitialData();

  }, []);


  // =========================================================
  // LOAD ALL RISK RECORDS
  // =========================================================

  const loadRiskRecords = async () => {

    try {

      setLoading(true);


      const data =
        await getAllRiskRecords();


      setRiskRecords(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load risk records:",
        error
      );

      toast.error(
        "Failed to load risk records."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOAD RISK STATISTICS
  // =========================================================

  const loadRiskStatistics = async () => {

    try {

      const data =
        await getRiskStatistics();


      setStatistics({

        totalRiskAssessments:
          data?.totalRiskAssessments ??
          0,

        lowRiskCount:
          data?.lowRiskCount ??
          0,

        mediumRiskCount:
          data?.mediumRiskCount ??
          0,

        highRiskCount:
          data?.highRiskCount ??
          0,

        safeCount:
          data?.safeCount ??
          0,

        reviewCount:
          data?.reviewCount ??
          0,

        flaggedCount:
          data?.flaggedCount ??
          0,

        averageRiskScore:
          data?.averageRiskScore ??
          0,

      });

    } catch (error) {

      console.error(
        "Failed to load risk statistics:",
        error
      );

      toast.error(
        "Failed to load risk statistics."
      );

    }

  };


  // =========================================================
  // SEARCH RISK RECORDS
  // =========================================================

  const handleSearch = async (value) => {

    setSearchTerm(value);


    // -------------------------------------------------------
    // Empty Search
    // -------------------------------------------------------

    if (!value.trim()) {

      await loadRiskRecords();

      return;

    }


    try {

      setLoading(true);


      const data =
        await searchRiskRecords(value);


      setRiskRecords(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Risk search failed:",
        error
      );

      toast.error(
        "Failed to search risk records."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // RISK LEVEL FILTER
  // =========================================================

  const handleRiskLevelFilter = async (
    level
  ) => {

    setRiskLevelFilter(level);


    try {

      setLoading(true);


      let data;


      // -----------------------------------------------------
      // All Risk Levels
      // -----------------------------------------------------

      if (level === "All") {

        data =
          await getAllRiskRecords();

      }

      // -----------------------------------------------------
      // Specific Risk Level
      // -----------------------------------------------------

      else {

        data =
          await getRiskRecordsByLevel(
            level.toUpperCase()
          );

      }


      setRiskRecords(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Risk level filtering failed:",
        error
      );

      toast.error(
        "Failed to filter risk records."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // RISK STATUS FILTER
  // =========================================================

  const handleRiskStatusFilter = async (
    status
  ) => {

    setRiskStatusFilter(status);


    try {

      setLoading(true);


      let data;


      // -----------------------------------------------------
      // All Status
      // -----------------------------------------------------

      if (status === "All") {

        data =
          await getAllRiskRecords();

      }

      // -----------------------------------------------------
      // Specific Status
      // -----------------------------------------------------

      else {

        data =
          await getRiskRecordsByStatus(
            status.toUpperCase()
          );

      }


      setRiskRecords(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Risk status filtering failed:",
        error
      );

      toast.error(
        "Failed to filter risk records."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // VIEW RISK DETAILS
  // =========================================================

  const handleViewRisk = async (
    risk
  ) => {

    try {

      setDetailsLoading(true);


      const data =
        await getRiskById(
          risk.riskId
        );


      setSelectedRisk(data);

      setShowDetailsModal(true);

    } catch (error) {

      console.error(
        "Failed to load risk details:",
        error
      );


      /*
       * If details API fails,
       * display the table data instead.
       */

      setSelectedRisk(risk);

      setShowDetailsModal(true);


      toast.error(
        "Unable to load latest risk details."
      );

    } finally {

      setDetailsLoading(false);

    }

  };


  // =========================================================
  // CLOSE DETAILS MODAL
  // =========================================================

  const handleCloseDetails = () => {

    if (reassessing) {

      return;

    }


    setShowDetailsModal(false);

    setSelectedRisk(null);

  };


  // =========================================================
  // REASSESS RISK
  // =========================================================

  const handleReassessRisk = async () => {

    if (!selectedRisk) {

      return;

    }


    if (reassessing) {

      return;

    }


    try {

      setReassessing(true);


      const response =
        await reassessRisk(
          selectedRisk.riskId
        );


      toast.success(
        response?.message ||
        "Risk reassessed successfully."
      );


      // -----------------------------------------------------
      // Get latest details
      // -----------------------------------------------------

      try {

        const updatedRisk =
          await getRiskById(
            selectedRisk.riskId
          );


        setSelectedRisk(
          updatedRisk
        );

      } catch (error) {

        console.error(
          "Failed to reload updated risk:",
          error
        );

      }


      // -----------------------------------------------------
      // Refresh table
      // -----------------------------------------------------

      await loadRiskRecords();


      // -----------------------------------------------------
      // Refresh statistics
      // -----------------------------------------------------

      await loadRiskStatistics();

    } catch (error) {

      console.error(
        "Risk reassessment failed:",
        error
      );


      const backendMessage =
        error?.response?.data?.message;


      toast.error(
        backendMessage ||
        "Failed to reassess risk."
      );

    } finally {

      setReassessing(false);

    }

  };


  // =========================================================
  // RISK LEVEL LABEL
  // =========================================================

  const getRiskLevelLabel = (
    level
  ) => {

    if (!level) {

      return "Unknown";

    }


    const normalized =
      String(level).toUpperCase();


    if (normalized === "LOW") {

      return "Low";

    }


    if (normalized === "MEDIUM") {

      return "Medium";

    }


    if (normalized === "HIGH") {

      return "High";

    }


    return level;

  };


  // =========================================================
  // RISK STATUS LABEL
  // =========================================================

  const getRiskStatusLabel = (
    status
  ) => {

    if (!status) {

      return "Unknown";

    }


    const normalized =
      String(status).toUpperCase();


    if (normalized === "SAFE") {

      return "Safe";

    }


    if (normalized === "REVIEW") {

      return "Review";

    }


    if (normalized === "FLAGGED") {

      return "Flagged";

    }


    return status;

  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    date
  ) => {

    if (!date) {

      return "-";

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }


    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =========================================================
  // FORMAT DATE & TIME
  // =========================================================

  const formatDateTime = (
    date
  ) => {

    if (!date) {

      return "-";

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }


    return parsedDate.toLocaleString(
      "en-IN"
    );

  };


  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (
    amount
  ) => {

    const numericAmount =
      Number(amount || 0);


    return numericAmount.toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    );

  };


  // =========================================================
  // RISK SCORE CLASS
  // =========================================================

  const getRiskScoreClass = (
    score
  ) => {

    const numericScore =
      Number(score || 0);


    if (numericScore <= 30) {

      return "low-score";

    }


    if (numericScore <= 70) {

      return "medium-score";

    }


    return "high-score";

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="manager-dashboard">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <ManagerSidebar />


      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <div className="manager-main">


        {/* =================================================
            NAVBAR
        ================================================= */}

        <ManagerNavbar />


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="risk-content">


          {/* =================================================
              PAGE HEADING
          ================================================= */}

          <div className="risk-heading">

            <div>

              <h1>
                Risk Scoring
              </h1>

              <p>
                Monitor customer and transaction
                risk assessments.
              </p>

            </div>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="risk-stats">


            {/* Total Assessments */}

            <div className="risk-stat-card">

              <div className="risk-stat-icon assessment-icon">

                <FaChartLine />

              </div>


              <div className="risk-stat-info">

                <span>
                  Total Assessments
                </span>

                <strong>
                  {
                    statistics.totalRiskAssessments
                  }
                </strong>

              </div>

            </div>


            {/* Low Risk */}

            <div className="risk-stat-card">

              <div className="risk-stat-icon low-risk-icon">

                <FaShieldAlt />

              </div>


              <div className="risk-stat-info">

                <span>
                  Low Risk
                </span>

                <strong>
                  {
                    statistics.lowRiskCount
                  }
                </strong>

              </div>

            </div>


            {/* Medium Risk */}

            <div className="risk-stat-card">

              <div className="risk-stat-icon medium-risk-icon">

                <FaClock />

              </div>


              <div className="risk-stat-info">

                <span>
                  Medium Risk
                </span>

                <strong>
                  {
                    statistics.mediumRiskCount
                  }
                </strong>

              </div>

            </div>


            {/* High Risk */}

            <div className="risk-stat-card">

              <div className="risk-stat-icon high-risk-icon">

                <FaExclamationTriangle />

              </div>


              <div className="risk-stat-info">

                <span>
                  High Risk
                </span>

                <strong>
                  {
                    statistics.highRiskCount
                  }
                </strong>

              </div>

            </div>


          </div>


          {/* =================================================
              SECONDARY STATISTICS
          ================================================= */}

          <div className="risk-secondary-stats">


            <div className="risk-mini-stat">

              <span>
                Safe
              </span>

              <strong>
                {
                  statistics.safeCount
                }
              </strong>

            </div>


            <div className="risk-mini-stat">

              <span>
                Review
              </span>

              <strong>
                {
                  statistics.reviewCount
                }
              </strong>

            </div>


            <div className="risk-mini-stat">

              <span>
                Flagged
              </span>

              <strong>
                {
                  statistics.flaggedCount
                }
              </strong>

            </div>


            <div className="risk-mini-stat">

              <span>
                Average Risk Score
              </span>

              <strong>
                {
                  Number(
                    statistics.averageRiskScore || 0
                  ).toFixed(1)
                }
              </strong>

            </div>


          </div>


          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="risk-toolbar">


            {/* Search */}

            <div className="risk-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search Risk ID, Customer, Account or Transaction..."
                value={searchTerm}
                onChange={(event) =>
                  handleSearch(
                    event.target.value
                  )
                }
              />

            </div>


            {/* Risk Level Filter */}

            <div className="risk-filter">

              <FaFilter />

              <select
                value={riskLevelFilter}
                onChange={(event) =>
                  handleRiskLevelFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Risk Levels
                </option>

                <option value="Low">
                  Low Risk
                </option>

                <option value="Medium">
                  Medium Risk
                </option>

                <option value="High">
                  High Risk
                </option>

              </select>

            </div>


            {/* Risk Status Filter */}

            <div className="risk-filter">

              <FaFilter />

              <select
                value={riskStatusFilter}
                onChange={(event) =>
                  handleRiskStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Safe">
                  Safe
                </option>

                <option value="Review">
                  Review
                </option>

                <option value="Flagged">
                  Flagged
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="risk-loading">

              Loading risk records...

            </div>

          )}


          {/* =================================================
              RISK TABLE
          ================================================= */}

          <section className="risk-table-card">


            {/* Table Header */}

            <div className="risk-table-header">

              <div>

                <h2>
                  Risk Assessment Records
                </h2>

                <p>
                  {
                    riskRecords.length
                  } risk assessment(s) found
                </p>

              </div>

            </div>


            {/* Table */}

            <div className="risk-table-wrapper">

              <table className="risk-table">


                <thead>

                  <tr>

                    <th>
                      Risk ID
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Transaction
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Risk Score
                    </th>

                    <th>
                      Risk Level
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Assessed
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {!loading &&
                  riskRecords.length === 0 ? (

                    <tr>

                      <td
                        colSpan="9"
                        className="risk-empty"
                      >

                        No risk assessment
                        records found.

                      </td>

                    </tr>

                  ) : (

                    riskRecords.map(
                      (risk) => {

                        const level =
                          getRiskLevelLabel(
                            risk.riskLevel
                          );


                        const status =
                          getRiskStatusLabel(
                            risk.riskStatus
                          );


                        return (

                          <tr
                            key={
                              risk.riskId
                            }
                          >


                            {/* Risk ID */}

                            <td>

                              <span className="risk-id">

                                {
                                  risk.riskId
                                }

                              </span>

                            </td>


                            {/* Customer */}

                            <td>

                              <div className="risk-customer">

                                <strong>

                                  {
                                    risk.customerName ||
                                    "-"
                                  }

                                </strong>

                                <span>

                                  {
                                    risk.accountNumber ||
                                    risk.customerId ||
                                    "-"
                                  }

                                </span>

                              </div>

                            </td>


                            {/* Transaction */}

                            <td>

                              <span className="risk-transaction">

                                {
                                  risk.transactionReference ||
                                  risk.transactionId ||
                                  "-"
                                }

                              </span>

                            </td>


                            {/* Amount */}

                            <td>

                              <strong className="risk-amount">

                                {formatCurrency(
                                  risk.transactionAmount
                                )}

                              </strong>

                            </td>


                            {/* Risk Score */}

                            <td>

                              <div
                                className={`risk-score ${getRiskScoreClass(
                                  risk.riskScore
                                )}`}
                              >

                                <strong>
                                  {
                                    risk.riskScore ??
                                    0
                                  }
                                </strong>

                                <span>
                                  / 100
                                </span>

                              </div>

                            </td>


                            {/* Risk Level */}

                            <td>

                              <span
                                className={`risk-level ${String(
                                  level
                                ).toLowerCase()}`}
                              >

                                {
                                  level
                                }

                              </span>

                            </td>


                            {/* Risk Status */}

                            <td>

                              <span
                                className={`risk-status ${String(
                                  status
                                ).toLowerCase()}`}
                              >

                                {String(
                                  status
                                ).toUpperCase() ===
                                "SAFE" ? (

                                  <FaCheckCircle />

                                ) : String(
                                  status
                                ).toUpperCase() ===
                                "FLAGGED" ? (

                                  <FaExclamationTriangle />

                                ) : (

                                  <FaClock />

                                )}

                                {
                                  status
                                }

                              </span>

                            </td>


                            {/* Assessment Date */}

                            <td>

                              {
                                formatDate(
                                  risk.assessedAt ||
                                  risk.assessmentDate
                                )
                              }

                            </td>


                            {/* Action */}

                            <td>

                              <button
                                className="risk-view-btn"
                                onClick={() =>
                                  handleViewRisk(
                                    risk
                                  )
                                }
                              >

                                <FaEye />

                                View

                              </button>

                            </td>

                          </tr>

                        );

                      }
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </main>

      </div>


      {/* =====================================================
          RISK DETAILS MODAL
      ===================================================== */}

      {showDetailsModal &&
        selectedRisk && (

          <div className="risk-overlay">

            <div className="risk-details-modal">


              {/* Modal Header */}

              <div className="risk-modal-header">

                <div>

                  <h2>
                    Risk Assessment Details
                  </h2>

                  <p>
                    {
                      selectedRisk.riskId
                    }
                  </p>

                </div>


                <button
                  className="risk-close-btn"
                  onClick={
                    handleCloseDetails
                  }
                  disabled={
                    detailsLoading ||
                    reassessing
                  }
                >

                  <FaTimes />

                </button>

              </div>


              {/* Details */}

              {detailsLoading ? (

                <div className="risk-loading">

                  Loading risk details...

                </div>

              ) : (

                <>


                  <div className="risk-details-grid">


                    {/* Customer ID */}

                    <div className="risk-detail">

                      <span>
                        Customer ID
                      </span>

                      <strong>
                        {
                          selectedRisk.customerId ||
                          "-"
                        }
                      </strong>

                    </div>


                    {/* Customer Name */}

                    <div className="risk-detail">

                      <span>
                        Customer Name
                      </span>

                      <strong>
                        {
                          selectedRisk.customerName ||
                          "-"
                        }
                      </strong>

                    </div>


                    {/* Account Number */}

                    <div className="risk-detail">

                      <span>
                        Account Number
                      </span>

                      <strong>
                        {
                          selectedRisk.accountNumber ||
                          "-"
                        }
                      </strong>

                    </div>


                    {/* Transaction ID */}

                    <div className="risk-detail">

                      <span>
                        Transaction ID
                      </span>

                      <strong>
                        {
                          selectedRisk.transactionId ||
                          selectedRisk.transactionReference ||
                          "-"
                        }
                      </strong>

                    </div>


                    {/* Transaction Amount */}

                    <div className="risk-detail">

                      <span>
                        Transaction Amount
                      </span>

                      <strong className="detail-amount">

                        {formatCurrency(
                          selectedRisk.transactionAmount
                        )}

                      </strong>

                    </div>


                    {/* Risk Score */}

                    <div className="risk-detail">

                      <span>
                        Risk Score
                      </span>

                      <strong
                        className={`detail-risk-score ${getRiskScoreClass(
                          selectedRisk.riskScore
                        )}`}
                      >

                        {
                          selectedRisk.riskScore ??
                          0
                        }

                        <small>
                          / 100
                        </small>

                      </strong>

                    </div>


                    {/* Risk Level */}

                    <div className="risk-detail">

                      <span>
                        Risk Level
                      </span>

                      <span
                        className={`risk-level ${String(
                          getRiskLevelLabel(
                            selectedRisk.riskLevel
                          )
                        ).toLowerCase()}`}
                      >

                        {
                          getRiskLevelLabel(
                            selectedRisk.riskLevel
                          )
                        }

                      </span>

                    </div>


                    {/* Risk Status */}

                    <div className="risk-detail">

                      <span>
                        Risk Status
                      </span>

                      <span
                        className={`risk-status ${String(
                          getRiskStatusLabel(
                            selectedRisk.riskStatus
                          )
                        ).toLowerCase()}`}
                      >

                        {
                          getRiskStatusLabel(
                            selectedRisk.riskStatus
                          )
                        }

                      </span>

                    </div>


                    {/* Assessment Date */}

                    <div className="risk-detail">

                      <span>
                        Assessment Date
                      </span>

                      <strong>

                        {
                          formatDateTime(
                            selectedRisk.assessedAt ||
                            selectedRisk.assessmentDate
                          )
                        }

                      </strong>

                    </div>


                    {/* Updated Date */}

                    <div className="risk-detail">

                      <span>
                        Updated Date
                      </span>

                      <strong>

                        {
                          formatDateTime(
                            selectedRisk.updatedAt
                          )
                        }

                      </strong>

                    </div>


                  </div>


                  {/* =================================================
                      RISK FACTORS
                  ================================================= */}

                  <div className="risk-factors-section">

                    <h3>
                      Risk Factors
                    </h3>


                    {Array.isArray(
                      selectedRisk.riskFactors
                    ) &&
                    selectedRisk.riskFactors.length >
                      0 ? (

                      <ul className="risk-factors-list">

                        {
                          selectedRisk.riskFactors.map(
                            (
                              factor,
                              index
                            ) => (

                              <li
                                key={index}
                              >

                                <FaExclamationTriangle />

                                {
                                  typeof factor ===
                                  "string"
                                    ? factor
                                    : factor?.description ||
                                      factor?.factor ||
                                      "-"
                                }

                              </li>

                            )
                          )
                        }

                      </ul>

                    ) : (

                      <p className="no-risk-factors">

                        No risk factors available.

                      </p>

                    )}

                  </div>


                  {/* =================================================
                      MODAL ACTIONS
                  ================================================= */}

                  <div className="risk-modal-actions">


                    <button
                      className="risk-cancel-btn"
                      onClick={
                        handleCloseDetails
                      }
                      disabled={
                        reassessing
                      }
                    >

                      Close

                    </button>


                    <button
                      className="risk-reassess-btn"
                      onClick={
                        handleReassessRisk
                      }
                      disabled={
                        reassessing
                      }
                    >

                      <FaSyncAlt />

                      {reassessing
                        ? "Reassessing..."
                        : "Reassess Risk"}

                    </button>

                  </div>

                </>

              )}

            </div>

          </div>

        )}

    </div>

  );

}


export default RiskScoring;