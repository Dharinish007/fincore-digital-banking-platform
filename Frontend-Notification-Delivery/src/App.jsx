import React, { useState, useMemo } from "react";
import "./App.css";

const INITIAL_NOTIFICATIONS = [
  {
    notification_id: "N001",
    settlement_id: "SETTLE_101",
    customer_id: "CUST001",
    customer: "Arun Kumar",
    loanTxnId: "LN001 / TXN101",
    notification_type: "Payment Success",
    title: "Payment Received",
    message: "Your EMI payment of ₹2,307.25 has been received successfully.",
    channel: "In-App",
    status: "DELIVERED",
    created_at: "19 Feb 2026, 10:25 AM",
    scheduled_at: "19 Feb 2026, 10:30 AM",
    sent_at: "19 Feb 2026, 10:30 AM",
    error_message: "-",
    logs: [
      {
        log_id: "LOG_801",
        notification_id: "N001",
        channel: "In-App",
        status: "DELIVERED",
        response: "200 OK - Notification delivered successfully",
        attempt_count: 1,
        last_attempt_at: "19 Feb 2026, 10:30 AM"
      }
    ]
  },
  {
    notification_id: "N002",
    settlement_id: "SETTLE_102",
    customer_id: "CUST002",
    customer: "Ravi Kumar",
    loanTxnId: "LN002 / TXN102",
    notification_type: "EMI Reminder",
    title: "EMI Due Reminder",
    message: "Your EMI payment of ₹3,150.00 is due on 20-02-2026.",
    channel: "SMS",
    status: "PENDING",
    created_at: "19 Feb 2026, 09:00 AM",
    scheduled_at: "19 Feb 2026, 09:15 AM",
    sent_at: "-",
    error_message: "-",
    logs: [
      {
        log_id: "LOG_802",
        notification_id: "N002",
        channel: "SMS",
        status: "PENDING",
        response: "102 Processing - Queued in SMS Gateway",
        attempt_count: 1,
        last_attempt_at: "19 Feb 2026, 09:15 AM"
      }
    ]
  },
  {
    notification_id: "N003",
    settlement_id: "SETTLE_103",
    customer_id: "CUST003",
    customer: "Priya Sharma",
    loanTxnId: "LN003 / TXN103",
    notification_type: "Payment Failed",
    title: "Payment Failed",
    message: "Payment transaction failed due to insufficient funds.",
    channel: "Email",
    status: "FAILED",
    created_at: "18 Feb 2026, 06:40 PM",
    scheduled_at: "18 Feb 2026, 06:45 PM",
    sent_at: "-",
    error_message: "502 Gateway Error: SMTP Server Timeout",
    logs: [
      {
        log_id: "LOG_803",
        notification_id: "N003",
        channel: "Email",
        status: "FAILED",
        response: "502 Gateway Timeout - SMTP Server unreachable",
        attempt_count: 3,
        last_attempt_at: "18 Feb 2026, 06:45 PM"
      }
    ]
  },
  {
    notification_id: "N004",
    settlement_id: "SETTLE_104",
    customer_id: "CUST004",
    customer: "Karthik R",
    loanTxnId: "LN004 / TXN104",
    notification_type: "Loan Approved",
    title: "Loan Approved",
    message: "Your loan application LN004 has been sanctioned.",
    channel: "In-App",
    status: "DELIVERED",
    created_at: "18 Feb 2026, 04:15 PM",
    scheduled_at: "18 Feb 2026, 04:20 PM",
    sent_at: "18 Feb 2026, 04:20 PM",
    error_message: "-",
    logs: [
      {
        log_id: "LOG_804",
        notification_id: "N004",
        channel: "In-App",
        status: "DELIVERED",
        response: "200 OK - Pushed to client socket",
        attempt_count: 1,
        last_attempt_at: "18 Feb 2026, 04:20 PM"
      }
    ]
  },
  {
    notification_id: "N005",
    settlement_id: "SETTLE_105",
    customer_id: "CUST005",
    customer: "Sneha Reddy",
    loanTxnId: "LN005 / TXN105",
    notification_type: "Disbursement",
    title: "Funds Disbursed",
    message: "Amount ₹50,000 has been credited to your bank account.",
    channel: "SMS",
    status: "DELIVERED",
    created_at: "17 Feb 2026, 11:10 AM",
    scheduled_at: "17 Feb 2026, 11:15 AM",
    sent_at: "17 Feb 2026, 11:15 AM",
    error_message: "-",
    logs: [
      {
        log_id: "LOG_805",
        notification_id: "N005",
        channel: "SMS",
        status: "DELIVERED",
        response: "200 OK - Delivered via Telco",
        attempt_count: 1,
        last_attempt_at: "17 Feb 2026, 11:15 AM"
      }
    ]
  }
];

export default function App() {
  const [notifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.settlement_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notification_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus.toUpperCase();

      const matchesChannel =
        selectedChannel === "All Channels" || item.channel === selectedChannel;

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [notifications, searchTerm, selectedStatus, selectedChannel]);

  const totalCount = notifications.length;
  const deliveredCount = notifications.filter((n) => n.status === "DELIVERED").length;
  const pendingCount = notifications.filter((n) => n.status === "PENDING").length;
  const failedCount = notifications.filter((n) => n.status === "FAILED").length;

  return (
    <div className="layout-container">
      {/* Top Navbar Header */}
      <header className="top-header">
        <div className="top-header-left">
          <span className="menu-icon">☰</span>
          <span className="brand-title">FinCore Nexus</span>
        </div>
        <div className="top-header-center">
          Secure Digital Banking Platform with Transaction Management System
        </div>
        <div className="top-header-right">
          <span className="bell-icon">🔔<span className="badge-count">5</span></span>
          <div className="user-profile">
            <span className="avatar">BT</span>
            <div className="user-info">
              <span className="user-role">Bank Teller</span>
              <span className="user-sub">Bank Teller</span>
            </div>
          </div>
        </div>
      </header>

      <div className="body-layout">
        {/* Left Navigation Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="logo-box">FC</div>
            <div>
              <div className="sidebar-title">FinCore</div>
              <div className="sidebar-subtitle">Digital Banking</div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-tag">TELLER</div>
            <div className="section-subtag">Branch Operations</div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-item active">
              <span className="nav-icon">🔔</span>
              <span>Notification Delivery</span>
            </div>
          </nav>
        </aside>

        {/* Dashboard Main View */}
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">Notification Delivery</h1>
              <p className="page-subtitle">
                Track and manage notification delivery status for customers and internal users.
              </p>
            </div>
            <button className="btn-refresh" onClick={() => window.location.reload()}>
              🔄 Refresh
            </button>
          </div>

          {/* Stats Bar */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">🔔</div>
              <div>
                <div className="stat-label">TOTAL NOTIFICATIONS</div>
                <div className="stat-value">{totalCount}</div>
                <div className="stat-sub">All time</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">↗</div>
              <div>
                <div className="stat-label">DELIVERED</div>
                <div className="stat-value">{deliveredCount}</div>
                <div className="stat-sub">
                  {Math.round((deliveredCount / totalCount) * 100)}% of total
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow">🕒</div>
              <div>
                <div className="stat-label">PENDING</div>
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-sub">
                  {Math.round((pendingCount / totalCount) * 100)}% of total
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">ⓧ</div>
              <div>
                <div className="stat-label">FAILED</div>
                <div className="stat-value">{failedCount}</div>
                <div className="stat-sub">
                  {Math.round((failedCount / totalCount) * 100)}% of total
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="filters-row">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by Customer,Settlement and notification ID's"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option>All Status</option>
              <option>Delivered</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>

            <select value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)}>
              <option>All Channels</option>
              <option>In-App</option>
              <option>SMS</option>
              <option>Email</option>
            </select>
          </div>

          {/* Primary Table - notification */}
          <div className="table-wrapper">
            <table className="main-table">
              <thead>
                <tr>
                  <th>notification_id</th>
                  <th>settlement_id</th>
                  <th>customer_id</th>
                  <th>notification_type</th>
                  <th>channel</th>
                  <th>status</th>
                  <th>message</th>
                  <th>created_at</th>
                  <th>scheduled_at</th>
                  <th>sent_at</th>
                  <th>error_message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((item) => (
                  <tr key={item.notification_id}>
                    <td>{item.notification_id}</td>
                    <td>{item.settlement_id}</td>
                    <td>{item.customer_id}</td>
                    <td>{item.notification_type}</td>
                    <td>{item.channel}</td>
                    <td>
                      <span className={`badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="truncate-cell">{item.message}</td>
                    <td>{item.created_at}</td>
                    <td>{item.scheduled_at}</td>
                    <td>{item.sent_at}</td>
                    <td>{item.error_message}</td>
                    <td>
                      <button
                        className="btn-details"
                        onClick={() => setSelectedItem(item)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail View Container (Visible ONLY on clicking View Details) */}
          {selectedItem && (
            <div className="details-section">
              <div className="details-header-row">
                <div className="details-title">
                  NOTIFICATION & LOG DETAILS (`notification_log`) - {selectedItem.notification_id}
                </div>
                <button className="btn-close-details" onClick={() => setSelectedItem(null)}>
                  ✕ Close Details
                </button>
              </div>

              {/* Log Table - notification_log */}
              <div className="table-wrapper">
                <table className="log-table">
                  <thead>
                    <tr>
                      <th>log_id</th>
                      <th>notification_id</th>
                      <th>channel</th>
                      <th>status</th>
                      <th>response</th>
                      <th>attempt_count</th>
                      <th>last_attempt_at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.logs.map((log) => (
                      <tr key={log.log_id}>
                        <td>{log.log_id}</td>
                        <td>{log.notification_id}</td>
                        <td>{log.channel}</td>
                        <td>
                          <span className={`badge ${log.status.toLowerCase()}`}>
                            {log.status}
                          </span>
                        </td>
                        <td>{log.response}</td>
                        <td>{log.attempt_count}</td>
                        <td>{log.last_attempt_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}