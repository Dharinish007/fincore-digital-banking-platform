import { useState } from "react";

import {
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import AuditStatCard from "../../components/audit/AuditStatCard";
import AuditLogTable from "../../components/audit/AuditLogTable";

import "./AuditLogs.css";


function AuditLogs() {

  const [searchTerm, setSearchTerm] = useState("");

  const [actionFilter, setActionFilter] =
    useState("All");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedLog, setSelectedLog] =
    useState(null);


  /* ==========================================
     Audit Log Data
  ========================================== */

  const auditLogs = [
    {
      id: 1,
      date: "13 Aug 2026",
      time: "10:15 AM",
      user: "Admin",
      email: "admin@fincore.com",
      initials: "AD",
      role: "Administrator",
      action: "LOGIN",
      description: "Administrator logged into the system",
      ip: "192.168.1.10",
      status: "Success",
    },

    {
      id: 2,
      date: "13 Aug 2026",
      time: "09:52 AM",
      user: "Rahul Patil",
      email: "rahul@fincore.com",
      initials: "RP",
      role: "Manager",
      action: "CREATE",
      description: "Created a new customer account",
      ip: "192.168.1.21",
      status: "Success",
    },

    {
      id: 3,
      date: "13 Aug 2026",
      time: "09:38 AM",
      user: "Sneha Kulkarni",
      email: "sneha@fincore.com",
      initials: "SK",
      role: "Teller",
      action: "TRANSACTION",
      description: "Processed customer deposit of ₹25,000",
      ip: "192.168.1.35",
      status: "Success",
    },

    {
      id: 4,
      date: "13 Aug 2026",
      time: "09:20 AM",
      user: "Amit Sharma",
      email: "amit@example.com",
      initials: "AS",
      role: "Customer",
      action: "LOGIN",
      description: "Customer login attempt failed",
      ip: "192.168.1.44",
      status: "Failed",
    },

    {
      id: 5,
      date: "13 Aug 2026",
      time: "08:55 AM",
      user: "Admin",
      email: "admin@fincore.com",
      initials: "AD",
      role: "Administrator",
      action: "UPDATE",
      description: "Updated Manager role permissions",
      ip: "192.168.1.10",
      status: "Success",
    },

    {
      id: 6,
      date: "12 Aug 2026",
      time: "05:40 PM",
      user: "Rahul Patil",
      email: "rahul@fincore.com",
      initials: "RP",
      role: "Manager",
      action: "UPDATE",
      description: "Updated customer account information",
      ip: "192.168.1.21",
      status: "Success",
    },

    {
      id: 7,
      date: "12 Aug 2026",
      time: "04:15 PM",
      user: "Sneha Kulkarni",
      email: "sneha@fincore.com",
      initials: "SK",
      role: "Teller",
      action: "TRANSACTION",
      description: "Processed customer withdrawal of ₹10,000",
      ip: "192.168.1.35",
      status: "Success",
    },

    {
      id: 8,
      date: "12 Aug 2026",
      time: "03:25 PM",
      user: "Admin",
      email: "admin@fincore.com",
      initials: "AD",
      role: "Administrator",
      action: "DELETE",
      description: "Removed inactive employee account",
      ip: "192.168.1.10",
      status: "Success",
    },
  ];


  /* ==========================================
     Filtering
  ========================================== */

  const filteredLogs = auditLogs.filter((log) => {

    const searchMatch =
      log.user
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      log.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      log.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      log.ip
        .includes(searchTerm);


    const actionMatch =
      actionFilter === "All" ||
      log.action === actionFilter;


    const roleMatch =
      roleFilter === "All" ||
      log.role === roleFilter;


    const statusMatch =
      statusFilter === "All" ||
      log.status === statusFilter;


    return (
      searchMatch &&
      actionMatch &&
      roleMatch &&
      statusMatch
    );
  });


  /* ==========================================
     Clear Filters
  ========================================== */

  const clearFilters = () => {

    setSearchTerm("");

    setActionFilter("All");

    setRoleFilter("All");

    setStatusFilter("All");
  };


  /* ==========================================
     View Details
  ========================================== */

  const handleViewDetails = (log) => {

    setSelectedLog(log);
  };


  return (

    <div className="audit-page">

      <AdminSidebar />


      <div className="audit-main">

        <AdminNavbar />


        <main className="audit-content">


          {/* ==========================================
              Page Header
          ========================================== */}

          <div className="audit-page-header">

            <div>

              <span className="audit-page-label">
                SECURITY & MONITORING
              </span>

              <h1>
                Audit Logs
              </h1>

              <p>
                Monitor and track activities performed
                across the banking platform.
              </p>

            </div>

          </div>


          {/* ==========================================
              Statistics
          ========================================== */}

          <div className="audit-stats-grid">

            <AuditStatCard
              icon={<FaClipboardList />}
              title="Total Activities"
              value="2,846"
              description="Recorded activities"
              variant="blue"
            />

            <AuditStatCard
              icon={<FaCheckCircle />}
              title="Successful"
              value="2,791"
              description="Successful activities"
              variant="green"
            />

            <AuditStatCard
              icon={<FaTimesCircle />}
              title="Failed"
              value="55"
              description="Failed activities"
              variant="red"
            />

            <AuditStatCard
              icon={<FaClock />}
              title="Today's Activities"
              value="128"
              description="Activities today"
              variant="purple"
            />

          </div>


          {/* ==========================================
              Filters
          ========================================== */}

          <div className="audit-filter-card">

            <div className="audit-filter-header">

              <div>

                <h2>
                  Activity Logs
                </h2>

                <p>
                  Review system activities and user actions.
                </p>

              </div>

              <FaFilter />

            </div>


            <div className="audit-filters">


              {/* Search */}

              <div className="audit-search">

                <FaSearch />

                <input
                  type="text"
                  placeholder="Search user, email, IP..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>


              {/* Action */}

              <select
                value={actionFilter}
                onChange={(e) =>
                  setActionFilter(e.target.value)
                }
              >

                <option value="All">
                  All Actions
                </option>

                <option value="LOGIN">
                  Login
                </option>

                <option value="CREATE">
                  Create
                </option>

                <option value="UPDATE">
                  Update
                </option>

                <option value="DELETE">
                  Delete
                </option>

                <option value="TRANSACTION">
                  Transaction
                </option>

              </select>


              {/* Role */}

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >

                <option value="All">
                  All Roles
                </option>

                <option value="Administrator">
                  Administrator
                </option>

                <option value="Manager">
                  Manager
                </option>

                <option value="Teller">
                  Teller
                </option>

                <option value="Customer">
                  Customer
                </option>

              </select>


              {/* Status */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Success">
                  Success
                </option>

                <option value="Failed">
                  Failed
                </option>

              </select>


              {/* Clear */}

              <button
                className="clear-filter-btn"
                onClick={clearFilters}
              >

                <FaTimes />

                Clear

              </button>

            </div>

          </div>


          {/* ==========================================
              Results
          ========================================== */}

          <div className="audit-results-info">

            <span>
              Showing{" "}
              <strong>
                {filteredLogs.length}
              </strong>{" "}
              audit records
            </span>

          </div>


          {/* ==========================================
              Table
          ========================================== */}

          <AuditLogTable
            logs={filteredLogs}
            onViewDetails={handleViewDetails}
          />


        </main>

      </div>


      {/* ==========================================
          Details Modal
      ========================================== */}

      {selectedLog && (

        <div
          className="audit-modal-overlay"
          onClick={() =>
            setSelectedLog(null)
          }
        >

          <div
            className="audit-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="audit-modal-header">

              <div>

                <span>
                  AUDIT RECORD
                </span>

                <h2>
                  Activity Details
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedLog(null)
                }
              >
                <FaTimes />
              </button>

            </div>


            <div className="audit-detail-grid">

              <div>
                <span>User</span>
                <strong>
                  {selectedLog.user}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedLog.email}
                </strong>
              </div>

              <div>
                <span>Role</span>
                <strong>
                  {selectedLog.role}
                </strong>
              </div>

              <div>
                <span>Action</span>
                <strong>
                  {selectedLog.action}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {selectedLog.date}
                </strong>
              </div>

              <div>
                <span>Time</span>
                <strong>
                  {selectedLog.time}
                </strong>
              </div>

              <div>
                <span>IP Address</span>
                <strong>
                  {selectedLog.ip}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong
                  className={
                    selectedLog.status === "Success"
                      ? "modal-success"
                      : "modal-failed"
                  }
                >
                  {selectedLog.status}
                </strong>
              </div>

            </div>


            <div className="audit-detail-description">

              <span>
                Description
              </span>

              <p>
                {selectedLog.description}
              </p>

            </div>


            <button
              className="modal-close-btn"
              onClick={() =>
                setSelectedLog(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AuditLogs;