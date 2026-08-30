import { useEffect, useState } from "react";

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

import { toast } from "react-toastify";

import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ManagerNavbar from "../../components/manager/ManagerNavbar";

import {
  getAllSettlements,
  getSettlementById,
  confirmSettlement,
  getSettlementStatistics,
  searchSettlements,
  getSettlementsByStatus,
} from "../../services/settlementService";

import "./SettlementConfirmation.css";


function SettlementConfirmation() {

  // =========================================================
  // Settlement Data
  // =========================================================

  const [settlements, setSettlements] = useState([]);


  // =========================================================
  // Statistics
  // =========================================================

  const [statistics, setStatistics] = useState({
    pendingSettlements: 0,
    confirmedSettlements: 0,
    totalSettlementValue: 0,
    totalTransactions: 0,
  });


  // =========================================================
  // Search & Filter
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");


  // =========================================================
  // Selected Settlement
  // =========================================================

  const [selectedSettlement, setSelectedSettlement] =
    useState(null);


  // =========================================================
  // Modal States
  // =========================================================

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);

  const [showConfirmModal, setShowConfirmModal] =
    useState(false);


  // =========================================================
  // Loading States
  // =========================================================

  const [loading, setLoading] = useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [confirming, setConfirming] =
    useState(false);

  // =========================================================
  // INITIAL DATA LOAD
  //
  // IMPORTANT:
  // We do NOT call loadSettlements() or loadStatistics()
  // directly inside this useEffect.
  //
  // This avoids:
  // "Cannot access variable before it is declared"
  // and:
  // "Calling setState synchronously within an effect"
  // =========================================================

  useEffect(() => {

    const loadInitialData = async () => {

      try {

        const [
          settlementsData,
          statisticsData
        ] = await Promise.all([
          getAllSettlements(),
          getSettlementStatistics()
        ]);


        // -----------------------------------------------------
        // Set settlements
        // -----------------------------------------------------

        setSettlements(
          Array.isArray(settlementsData)
            ? settlementsData
            : []
        );


        // -----------------------------------------------------
        // Set statistics
        // -----------------------------------------------------

        setStatistics({

          pendingSettlements:
            statisticsData?.pendingSettlements ?? 0,

          confirmedSettlements:
            statisticsData?.confirmedSettlements ?? 0,

          totalSettlementValue:
            statisticsData?.totalSettlementValue ?? 0,

          totalTransactions:
            statisticsData?.totalTransactions ?? 0,

        });

      } catch (error) {

        console.error(
          "Failed to load initial settlement data:",
          error
        );

        toast.error(
          "Failed to load settlement data."
        );

      } finally {

        setLoading(false);

      }

    };


    loadInitialData();

  }, []);


  // =========================================================
  // GET ALL SETTLEMENTS
  // Used after confirmation and when search is cleared
  // =========================================================

  const loadSettlements = async () => {

    try {

      setLoading(true);

      const data =
        await getAllSettlements();


      setSettlements(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load settlements:",
        error
      );

      toast.error(
        "Failed to load settlement records."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // GET STATISTICS
  // =========================================================

  const loadStatistics = async () => {

    try {

      const data =
        await getSettlementStatistics();


      setStatistics({

        pendingSettlements:
          data?.pendingSettlements ?? 0,

        confirmedSettlements:
          data?.confirmedSettlements ?? 0,

        totalSettlementValue:
          data?.totalSettlementValue ?? 0,

        totalTransactions:
          data?.totalTransactions ?? 0,

      });

    } catch (error) {

      console.error(
        "Failed to load settlement statistics:",
        error
      );

      toast.error(
        "Failed to load settlement statistics."
      );

    }

  };


  // =========================================================
  // SEARCH SETTLEMENTS
  // =========================================================

  const handleSearch = async (value) => {

    setSearchTerm(value);


    // -------------------------------------------------------
    // If search is empty, load all records
    // -------------------------------------------------------

    if (!value.trim()) {

      await loadSettlements();

      return;

    }


    try {

      setLoading(true);


      const data =
        await searchSettlements(value);


      setSettlements(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Settlement search failed:",
        error
      );

      toast.error(
        "Failed to search settlements."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // STATUS FILTER
  // =========================================================

  const handleStatusFilter = async (status) => {

    setStatusFilter(status);


    try {

      setLoading(true);

      let data;


      // -----------------------------------------------------
      // All Status
      // -----------------------------------------------------

      if (status === "All") {

        data =
          await getAllSettlements();

      }

      // -----------------------------------------------------
      // Specific Status
      // -----------------------------------------------------

      else {

        data =
          await getSettlementsByStatus(
            status.toUpperCase()
          );

      }


      setSettlements(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Settlement status filtering failed:",
        error
      );

      toast.error(
        "Failed to filter settlements."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // VIEW SETTLEMENT DETAILS
  // =========================================================

  const handleViewSettlement = async (
    settlement
  ) => {

    try {

      setDetailsLoading(true);


      /*
       * Backend endpoint:
       *
       * GET /api/v1/settlements/{id}
       *
       * Your controller currently accepts String settlementId.
       *
       * Therefore we pass:
       *
       * settlement.settlementId
       *
       * Example:
       * SET-2026-001
       */

      const data =
        await getSettlementById(
          settlement.settlementId
        );


      setSelectedSettlement(data);

      setShowDetailsModal(true);

    } catch (error) {

      console.error(
        "Failed to load settlement details:",
        error
      );


      /*
       * If details API fails,
       * show the data already available
       * in the table.
       */

      setSelectedSettlement(settlement);

      setShowDetailsModal(true);


      toast.error(
        "Unable to load latest settlement details."
      );

    } finally {

      setDetailsLoading(false);

    }

  };


  // =========================================================
  // CLOSE DETAILS MODAL
  // =========================================================

  const handleCloseDetails = () => {

    if (confirming) {

      return;

    }


    setShowDetailsModal(false);

    setSelectedSettlement(null);

  };


  // =========================================================
  // OPEN CONFIRMATION MODAL
  // =========================================================

  const handleOpenConfirmModal = () => {

    if (!selectedSettlement) {

      return;

    }


    setShowConfirmModal(true);

  };


  // =========================================================
  // CLOSE CONFIRMATION MODAL
  // =========================================================

  const handleCloseConfirmModal = () => {

    if (confirming) {

      return;

    }


    setShowConfirmModal(false);

  };


  // =========================================================
  // GET MANAGER ID
  // =========================================================

  const getManagerId = () => {

    /*
     * First try:
     *
     * localStorage.managerId
     */

    const directManagerId =
      localStorage.getItem("managerId");


    if (directManagerId) {

      return directManagerId;

    }


    /*
     * Otherwise try user object.
     */

    const userData =
      localStorage.getItem("user");


    if (userData) {

      try {

        const user =
          JSON.parse(userData);


        return (
          user?.managerId ||
          user?.userId ||
          user?.id ||
          null
        );

      } catch (error) {

        console.error(
          "Unable to parse stored user:",
          error
        );

      }

    }


    return null;

  };


  // =========================================================
  // CONFIRM SETTLEMENT
  // =========================================================

  const handleConfirmSettlement =
    async () => {

      if (!selectedSettlement) {

        return;

      }


      // -----------------------------------------------------
      // Check status
      // -----------------------------------------------------

      const currentStatus =
        String(
          selectedSettlement.status || ""
        ).toUpperCase();


      if (currentStatus !== "PENDING") {

        toast.error(
          "Only pending settlements can be confirmed."
        );

        return;

      }


      // -----------------------------------------------------
      // Get Manager ID
      // -----------------------------------------------------

      const managerId =
        getManagerId();


      if (!managerId) {

        toast.error(
          "Manager ID not found. Please login again."
        );

        return;

      }


      try {

        setConfirming(true);


        /*
         * Backend:
         *
         * PUT
         * /api/v1/settlements/{settlementId}/confirm
         *
         * ?managerId={managerId}
         *
         * Example:
         *
         * PUT
         * /api/v1/settlements/SET-2026-001/confirm?managerId=MGR001
         */

        const response =
          await confirmSettlement(
            selectedSettlement.settlementId,
            managerId
          );


        // ---------------------------------------------------
        // Success message
        // ---------------------------------------------------

        toast.success(
          response?.message ||
          "Settlement confirmed successfully."
        );


        // ---------------------------------------------------
        // Close modals
        // ---------------------------------------------------

        setShowConfirmModal(false);

        setShowDetailsModal(false);

        setSelectedSettlement(null);


        // ---------------------------------------------------
        // Refresh settlement table
        // ---------------------------------------------------

        await loadSettlements();


        // ---------------------------------------------------
        // Refresh statistics
        // ---------------------------------------------------

        await loadStatistics();


      } catch (error) {

        console.error(
          "Settlement confirmation failed:",
          error
        );


        const backendMessage =
          error?.response?.data?.message;


        toast.error(
          backendMessage ||
          "Failed to confirm settlement."
        );

      } finally {

        setConfirming(false);

      }

    };


  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (amount) => {

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
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }


    /*
     * Backend LocalDate:
     *
     * 2026-08-19
     */

    const parsedDate =
      new Date(
        `${date}T00:00:00`
      );


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
  // NORMALIZE STATUS
  // =========================================================

  const getStatusLabel = (status) => {

    if (!status) {

      return "Unknown";

    }


    const normalized =
      String(status).toUpperCase();


    if (normalized === "PENDING") {

      return "Pending";

    }


    if (normalized === "CONFIRMED") {

      return "Confirmed";

    }


    if (normalized === "REJECTED") {

      return "Rejected";

    }


    return status;

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

        <main className="settlement-content">


          {/* =================================================
              PAGE HEADING
          ================================================= */}

          <div className="settlement-heading">

            <div>

              <h1>
                Settlement Confirmation
              </h1>

              <p>
                Review and confirm pending
                settlement transactions.
              </p>

            </div>

          </div>


          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="settlement-stats">


            {/* Pending */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon pending-icon">

                <FaClock />

              </div>


              <div className="settlement-stat-info">

                <span>
                  Pending Settlements
                </span>

                <strong>
                  {statistics.pendingSettlements}
                </strong>

              </div>

            </div>


            {/* Confirmed */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon confirmed-icon">

                <FaCheckCircle />

              </div>


              <div className="settlement-stat-info">

                <span>
                  Confirmed Settlements
                </span>

                <strong>
                  {statistics.confirmedSettlements}
                </strong>

              </div>

            </div>


            {/* Total Value */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon amount-icon">

                <FaMoneyBillWave />

              </div>


              <div className="settlement-stat-info">

                <span>
                  Total Settlement Value
                </span>

                <strong>
                  {formatCurrency(
                    statistics.totalSettlementValue
                  )}
                </strong>

              </div>

            </div>


            {/* Transactions */}

            <div className="settlement-stat-card">

              <div className="settlement-stat-icon transaction-icon">

                <FaExchangeAlt />

              </div>


              <div className="settlement-stat-info">

                <span>
                  Total Transactions
                </span>

                <strong>
                  {statistics.totalTransactions}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              TOOLBAR
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
                  handleSearch(
                    event.target.value
                  )
                }
              />

            </div>


            {/* Filter */}

            <div className="settlement-filter">

              <FaFilter />

              <select
                value={statusFilter}
                onChange={(event) =>
                  handleStatusFilter(
                    event.target.value
                  )
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
              LOADING
          ================================================= */}

          {loading && (

            <div className="settlement-loading">

              Loading settlement records...

            </div>

          )}


          {/* =================================================
              SETTLEMENT TABLE
          ================================================= */}

          <section className="settlement-table-card">


            {/* Table Header */}

            <div className="settlement-table-header">

              <div>

                <h2>
                  Settlement Records
                </h2>

                <p>
                  {settlements.length} settlement(s)
                  found
                </p>

              </div>

            </div>


            {/* Table */}

            <div className="settlement-table-wrapper">

              <table className="settlement-table">


                <thead>

                  <tr>

                    <th>
                      Settlement ID
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Transaction Ref.
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {!loading &&
                  settlements.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="settlement-empty"
                      >

                        No settlement records found.

                      </td>

                    </tr>

                  ) : (

                    settlements.map(
                      (settlement) => {

                        const status =
                          getStatusLabel(
                            settlement.status
                          );


                        return (

                          <tr
                            key={
                              settlement.settlementId
                            }
                          >


                            {/* Settlement ID */}

                            <td>

                              <span className="settlement-id">

                                {
                                  settlement.settlementId
                                }

                              </span>

                            </td>


                            {/* Customer */}

                            <td>

                              <div className="settlement-customer">

                                <strong>

                                  {
                                    settlement.customerName
                                  }

                                </strong>

                                <span>

                                  {
                                    settlement.accountNumber
                                  }

                                </span>

                              </div>

                            </td>


                            {/* Transaction */}

                            <td>

                              <span className="transaction-reference">

                                {
                                  settlement.transactionReference
                                }

                              </span>

                            </td>


                            {/* Amount */}

                            <td>

                              <strong className="settlement-amount">

                                {formatCurrency(
                                  settlement.settlementAmount
                                )}

                              </strong>

                            </td>


                            {/* Date */}

                            <td>

                              {formatDate(
                                settlement.settlementDate
                              )}

                            </td>


                            {/* Status */}

                            <td>

                              <span
                                className={`settlement-status ${
                                  String(
                                    status
                                  ).toLowerCase()
                                }`}
                              >

                                {String(
                                  status
                                ).toUpperCase() ===
                                "CONFIRMED" ? (

                                  <FaCheckCircle />

                                ) : (

                                  <FaClock />

                                )}

                                {status}

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
          SETTLEMENT DETAILS MODAL
      ===================================================== */}

      {showDetailsModal &&
        selectedSettlement && (

          <div className="settlement-overlay">

            <div className="settlement-details-modal">


              {/* Modal Header */}

              <div className="settlement-modal-header">

                <div>

                  <h2>
                    Settlement Details
                  </h2>

                  <p>
                    {
                      selectedSettlement.settlementId
                    }
                  </p>

                </div>


                <button
                  className="settlement-close-btn"
                  onClick={
                    handleCloseDetails
                  }
                  disabled={
                    detailsLoading ||
                    confirming
                  }
                >

                  <FaTimes />

                </button>

              </div>


              {/* Details */}

              {detailsLoading ? (

                <div className="settlement-loading">

                  Loading settlement details...

                </div>

              ) : (

                <>


                  <div className="settlement-details-grid">


                    {/* Customer */}

                    <div className="settlement-detail">

                      <span>
                        Customer Name
                      </span>

                      <strong>
                        {
                          selectedSettlement.customerName
                        }
                      </strong>

                    </div>


                    {/* Account */}

                    <div className="settlement-detail">

                      <span>
                        Account Number
                      </span>

                      <strong>
                        {
                          selectedSettlement.accountNumber
                        }
                      </strong>

                    </div>


                    {/* Transaction Reference */}

                    <div className="settlement-detail">

                      <span>
                        Transaction Reference
                      </span>

                      <strong>
                        {
                          selectedSettlement.transactionReference
                        }
                      </strong>

                    </div>


                    {/* Transaction Count */}

                    <div className="settlement-detail">

                      <span>
                        Transaction Count
                      </span>

                      <strong>
                        {
                          selectedSettlement.transactionCount
                        }
                      </strong>

                    </div>


                    {/* Settlement Date */}

                    <div className="settlement-detail">

                      <span>
                        Settlement Date
                      </span>

                      <strong>
                        {formatDate(
                          selectedSettlement.settlementDate
                        )}
                      </strong>

                    </div>


                    {/* Settlement Amount */}

                    <div className="settlement-detail">

                      <span>
                        Settlement Amount
                      </span>

                      <strong className="detail-amount">

                        {formatCurrency(
                          selectedSettlement.settlementAmount
                        )}

                      </strong>

                    </div>


                    {/* Status */}

                    <div className="settlement-detail">

                      <span>
                        Status
                      </span>

                      <span
                        className={`settlement-status ${
                          String(
                            getStatusLabel(
                              selectedSettlement.status
                            )
                          ).toLowerCase()
                        }`}
                      >

                        {String(
                          selectedSettlement.status
                        ).toUpperCase() ===
                        "CONFIRMED" ? (

                          <FaCheckCircle />

                        ) : (

                          <FaClock />

                        )}

                        {
                          getStatusLabel(
                            selectedSettlement.status
                          )
                        }

                      </span>

                    </div>


                    {/* Manager */}

                    {selectedSettlement.managerId && (

                      <div className="settlement-detail">

                        <span>
                          Confirmed By
                        </span>

                        <strong>
                          {
                            selectedSettlement.managerId
                          }
                        </strong>

                      </div>

                    )}


                    {/* Confirmation Time */}

                    {selectedSettlement.confirmedAt && (

                      <div className="settlement-detail">

                        <span>
                          Confirmed At
                        </span>

                        <strong>

                          {
                            new Date(
                              selectedSettlement.confirmedAt
                            ).toLocaleString(
                              "en-IN"
                            )
                          }

                        </strong>

                      </div>

                    )}

                  </div>


                  {/* Modal Actions */}

                  {String(
                    selectedSettlement.status
                  ).toUpperCase() ===
                    "PENDING" && (

                    <div className="settlement-modal-actions">


                      <button
                        className="settlement-cancel-btn"
                        onClick={
                          handleCloseDetails
                        }
                        disabled={
                          confirming
                        }
                      >

                        Cancel

                      </button>


                      <button
                        className="settlement-confirm-btn"
                        onClick={
                          handleOpenConfirmModal
                        }
                        disabled={
                          confirming
                        }
                      >

                        <FaCheckCircle />

                        Confirm Settlement

                      </button>

                    </div>

                  )}

                </>

              )}

            </div>

          </div>

        )}


      {/* =====================================================
          CONFIRMATION MODAL
      ===================================================== */}

      {showConfirmModal &&
        selectedSettlement && (

          <div className="settlement-overlay">

            <div className="settlement-confirm-modal">


              <div className="confirm-icon-wrapper">

                <FaCheckCircle />

              </div>


              <h2>
                Confirm Settlement?
              </h2>


              <p>

                Are you sure you want to confirm
                settlement{" "}

                <strong>
                  {
                    selectedSettlement.settlementId
                  }
                </strong>

                ?

                <br />

                This action may not be reversible.

              </p>


              <div className="settlement-confirm-actions">


                <button
                  className="settlement-cancel-btn"
                  onClick={
                    handleCloseConfirmModal
                  }
                  disabled={
                    confirming
                  }
                >

                  Cancel

                </button>


                <button
                  className="settlement-confirm-btn"
                  onClick={
                    handleConfirmSettlement
                  }
                  disabled={
                    confirming
                  }
                >

                  <FaCheckCircle />

                  {confirming
                    ? "Confirming..."
                    : "Yes, Confirm"}

                </button>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}


export default SettlementConfirmation;