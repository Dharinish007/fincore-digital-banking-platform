import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const transactions = [
  { id: "DS-2026-00124", customer: "Raj Kumar", amount: "₹2,50,000", status: "Processing", date: "16 Aug 2026, 10:32 AM" },
  { id: "DS-2026-00123", customer: "Ajit Sharma", amount: "₹1,75,000", status: "Completed", date: "16 Aug 2026, 09:15 AM" },
  { id: "DS-2026-00122", customer: "Amit Verma", amount: "₹3,00,000", status: "Pending", date: "16 Aug 2026, 08:40 AM" },
  { id: "DS-2026-00121", customer: "Deepak Joshi", amount: "₹2,20,000", status: "Failed", date: "15 Aug 2026, 04:22 PM" },
  { id: "DS-2026-00120", customer: "Arun Prakash", amount: "₹1,50,000", status: "Completed", date: "15 Aug 2026, 02:10 PM" }
];

function App() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("fincore-auth") === "true"
  );
  const [user, setUser] = useState(
    sessionStorage.getItem("fincore-user") || "Teller User"
  );

  const login = (name) => {
    sessionStorage.setItem("fincore-auth", "true");
    sessionStorage.setItem("fincore-user", name);
    setUser(name);
    setAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem("fincore-auth");
    sessionStorage.removeItem("fincore-user");
    setAuthenticated(false);
  };

  return authenticated
    ? <BankingShell user={user} onLogout={logout} />
    : <Login onLogin={login} />;
}

function Login({ onLogin }) {
  const [step, setStep] = useState("credentials");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const submitCredentials = (e) => {
    e.preventDefault();
    setError("");
    if (!employeeId.trim() || !password.trim()) {
      setError("Enter your employee ID and password.");
      return;
    }
    setStep("otp");
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp !== "123456") {
      setError("Invalid OTP. For this frontend demo, use 123456.");
      return;
    }
    onLogin(employeeId.trim() || "Teller User");
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <div className="login-brand">
        <div className="brand-mark">F</div>
        <div>
          <strong>FinCore Nexus</strong>
          <span>Digital Banking Management Platform</span>
        </div>
      </div>

      <div className="login-card">
        <div className="secure-pill"><span className="lock">⌁</span> Secure Banking Access</div>
        {step === "credentials" ? (
          <>
            <div className="login-heading">
              <h1>Welcome back</h1>
              <p>Sign in to access the FinCore banking operations console.</p>
            </div>

            <form onSubmit={submitCredentials}>
              <label>Employee ID</label>
              <div className="input-wrap">
                <span>◉</span>
                <input value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="Enter employee ID" autoComplete="username" />
              </div>

              <label>Password</label>
              <div className="input-wrap">
                <span>●</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button type="button" className="input-action" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="login-options">
                <label className="check-label">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <span>Remember this device</span>
                </label>
                <button type="button" className="link-btn">Forgot password?</button>
              </div>

              {error && <div className="form-error">{error}</div>}
              <button className="primary-btn login-btn" type="submit">Continue securely <span>→</span></button>
            </form>
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => { setStep("credentials"); setError(""); }}>← Back</button>
            <div className="login-heading">
              <h1>Verify your identity</h1>
              <p>Enter the six-digit verification code sent to your registered device.</p>
            </div>

            <form onSubmit={verifyOtp}>
              <label>One-Time Password</label>
              <input
                className="otp-input"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="• • • • • •"
                inputMode="numeric"
                maxLength={6}
                autoFocus
              />
              <div className="demo-note">Demo OTP: <strong>123456</strong></div>
              {error && <div className="form-error">{error}</div>}
              <button className="primary-btn login-btn" type="submit">Verify & Sign In <span>→</span></button>
            </form>
          </>
        )}

        <div className="login-footer">
          <span>🔒 256-bit encrypted session</span>
          <span>•</span>
          <span>Authorized personnel only</span>
        </div>
      </div>

      <div className="login-bottom">© 2026 FinCore Nexus · Internal Banking Operations</div>
    </div>
  );
}

function BankingShell({ user, onLogout }) {
  const [active, setActive] = useState("Disbursement Saga");
  const [selected, setSelected] = useState(transactions[0]);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__fincoreToast);
    window.__fincoreToast = window.setTimeout(() => setToast(""), 2600);
  };

  const menu = [
    ["Dashboard", "⌂"],
    ["KYC Verification", "▦"],
    ["Disbursement Saga", "▣"],
    ["Repayment Tracking", "↻"],
    ["NPA Classification", "△"],
    ["Audit Trail", "▤"],
    ["Settings", "⚙"]
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="top-brand">
          <div className="brand-mark small">F</div>
          <div>
            <strong>FinCore Nexus</strong>
            <span>Digital Banking Management Platform</span>
          </div>
        </div>
        <div className="top-user">
          <div className="system-status"><i /> Core Banking Online</div>
          <div className="divider" />
          <span className="role">Bank Teller</span>
          <span className="divider">|</span>
          <button className="logout-btn" onClick={onLogout}>Logout ↪</button>
        </div>
      </header>

      <aside className="sidebar">
        <div className="sidebar-context">
          <span className="context-dot" />
          <div><b>Operations Console</b><small>Production Environment</small></div>
        </div>
        <nav>
          {menu.map(([label, icon]) => (
            <button
              key={label}
              className={active === label ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActive(label);
                if (label !== "Disbursement Saga") notify(`${label} module selected`);
              }}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
              {label === "Disbursement Saga" && <em>24</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-avatar">{(user[0] || "T").toUpperCase()}</div>
          <div>
            <strong>{user}</strong>
            <span>Bank Teller · Branch 014</span>
          </div>
          <button className="mini-settings" onClick={() => notify("Profile settings opened")}>⚙</button>
        </div>
      </aside>

      <main className="main-content">
        {active === "Disbursement Saga" ? (
          <DisbursementDashboard
            selected={selected}
            setSelected={setSelected}
            onNew={() => setShowNew(true)}
            notify={notify}
          />
        ) : (
          <Placeholder title={active} onBack={() => setActive("Disbursement Saga")} />
        )}
      </main>

      {showNew && <NewDisbursement onClose={() => setShowNew(false)} notify={notify} />}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function DisbursementDashboard({ selected, setSelected, onNew, notify }) {
  const stats = [
    ["Total Requests", "24", "All disbursement requests", "blue", "▤"],
    ["Pending", "6", "Awaiting processing", "amber", "◷"],
    ["Processing", "5", "Currently in progress", "purple", "◌"],
    ["Completed", "10", "Successfully completed", "green", "✓"],
    ["Failed", "3", "Failed transactions", "red", "×"]
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="breadcrumb">Operations / Loan Services / Disbursement</div>
          <h1>Disbursement Saga Dashboard</h1>
          <p>Monitor, initiate and manage end-to-end loan disbursement transactions.</p>
        </div>
        <div className="header-actions">
          <span className="last-sync">● Live · Last sync 10:32:08 AM</span>
          <button className="outline-btn" onClick={onNew}>＋ New Disbursement</button>
        </div>
      </div>

      <section className="stats-grid">
        {stats.map(([title, value, desc, color, icon]) => (
          <div className={`stat-card ${color}`} key={title}>
            <div className="stat-icon">{icon}</div>
            <div>
              <span>{title}</span>
              <strong>{value}</strong>
              <small>{desc}</small>
            </div>
          </div>
        ))}
      </section>

      <div className="content-grid">
        <section className="panel saga-panel">
          <div className="panel-heading">
            <div>
              <h2>Disbursement Saga Flow</h2>
              <p>Current transaction orchestration status</p>
            </div>
            <span className="live-badge">LIVE</span>
          </div>

          <div className="vertical-flow">
            {[
              ["Loan Approval", "Loan application approved", "done"],
              ["Disbursement Initiation", "Disbursement process initiated", "done"],
              ["Account Validation", "Customer account validated", "done"],
              ["Fund Transfer", "Funds are being transferred", "current"],
              ["Transaction Recording", "Transaction details recording pending", "pending"],
              ["Disbursement Completion", "Disbursement completion pending", "pending"]
            ].map(([title, desc, state], i) => (
              <div className={`flow-step ${state}`} key={title}>
                <div className="flow-marker">{state === "done" ? "✓" : state === "current" ? "•" : i + 1}</div>
                <div className="flow-copy">
                  <strong>{i + 1}. {title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel table-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Disbursement Transactions</h2>
              <p>Latest saga executions across branches</p>
            </div>
            <button className="text-btn" onClick={() => notify("Transaction list refreshed")}>↻ Refresh</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Disbursement ID</th>
                  <th>Customer</th>
                  <th>Loan Amount</th>
                  <th>Status</th>
                  <th>Initiated On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className={selected.id === t.id ? "selected-row" : ""}>
                    <td><b>{t.id}</b></td>
                    <td>{t.customer}</td>
                    <td>{t.amount}</td>
                    <td><span className={`status ${t.status.toLowerCase()}`}>{t.status}</span></td>
                    <td>{t.date}</td>
                    <td><button className="view-btn" onClick={() => setSelected(t)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="execution-panel">
        <div className="transaction-summary">
          <button className="back-link" onClick={() => notify("Returned to transaction list")}>← Back to Transactions</button>
          <div className="summary-id">
            <span>Disbursement ID</span>
            <b>{selected.id}</b>
            <span className={`status ${selected.status.toLowerCase()}`}>{selected.status}</span>
          </div>
          <div className="summary-grid">
            <Info label="Customer Name" value={selected.customer} />
            <Info label="Loan ID" value="LN-2026-00452" />
            <Info label="Loan Amount" value={selected.amount} />
            <Info label="Account No." value="XXXX-XXXX-4582" />
            <Info label="Initiated On" value={selected.date} />
            <Info label="Current Status" value="Fund Transfer in Progress" />
          </div>
        </div>

        <div className="execution-detail">
          <div className="panel-heading compact">
            <div>
              <h2>Saga Execution Steps</h2>
              <p>Distributed transaction orchestration</p>
            </div>
            <span className="execution-id">Saga ID: SAG-88291</span>
          </div>

          <div className="horizontal-flow">
            {[
              ["1", "Loan Approval", "Completed"],
              ["2", "Disbursement Initiation", "Completed"],
              ["3", "Account Validation", "Completed"],
              ["4", "Fund Transfer", "In Progress"],
              ["5", "Transaction Recording", "Pending"],
              ["6", "Disbursement Completion", "Pending"]
            ].map(([n, title, state], i) => (
              <React.Fragment key={n}>
                <div className={`h-step ${i < 3 ? "done" : i === 3 ? "current" : "pending"}`}>
                  <div className="h-marker">{n}</div>
                  <strong>{title}</strong>
                  <span>{state}</span>
                  <small>{i < 3 ? `10:32:0${i + 1} AM` : i === 3 ? "10:32:08 AM" : "--:--:--"}</small>
                </div>
                {i < 5 && <div className={`h-line ${i < 3 ? "done" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="current-details">
            <div className="detail-title">Current Step Details</div>
            <p>Fund transfer is being processed to the beneficiary account. Please wait while we complete the transaction.</p>
            <div className="detail-meta">
              <span>Reference ID: REF-FT-88921</span>
              <span>Gateway: Core Bank API</span>
              <span>Estimated Time: 30 seconds</span>
            </div>
          </div>

          <div className="bottom-actions">
            <button className="outline-btn" onClick={() => notify("Saga details opened")}>▧ View Saga Details</button>
            <button className="secondary-btn" onClick={() => notify("Status refreshed successfully")}>↻ Refresh Status</button>
          </div>
        </div>
      </section>
    </>
  );
}

function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value}</strong></div>;
}

function NewDisbursement({ onClose, notify }) {
  const [amount, setAmount] = useState("");
  const [customer, setCustomer] = useState("");
  const [loanId, setLoanId] = useState("");
  const [account, setAccount] = useState("");

  const submit = (e) => {
    e.preventDefault();
    notify("Disbursement request created and queued for approval");
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head">
          <div><span className="modal-kicker">LOAN OPERATIONS</span><h2>New Disbursement</h2><p>Initiate a controlled disbursement saga.</p></div>
          <button onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit} className="modal-form">
          <label>Customer Name<input required value={customer} onChange={e => setCustomer(e.target.value)} placeholder="e.g. Raj Kumar" /></label>
          <label>Loan ID<input required value={loanId} onChange={e => setLoanId(e.target.value)} placeholder="LN-2026-00452" /></label>
          <label>Beneficiary Account<input required value={account} onChange={e => setAccount(e.target.value)} placeholder="XXXX-XXXX-4582" /></label>
          <label>Loan Amount<input required value={amount} onChange={e => setAmount(e.target.value)} placeholder="₹ 0.00" /></label>
          <div className="approval-note">ⓘ Request will enter <b>Loan Approval → Account Validation → Fund Transfer</b> workflow.</div>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" type="submit">Create Disbursement</button></div>
        </form>
      </div>
    </div>
  );
}

function Placeholder({ title, onBack }) {
  return (
    <div className="placeholder">
      <div className="placeholder-icon">▣</div>
      <div className="breadcrumb">Operations / {title}</div>
      <h1>{title}</h1>
      <p>This module is available in the FinCore navigation. The Disbursement Saga module is the active milestone implementation.</p>
      <button className="outline-btn" onClick={onBack}>Open Disbursement Saga</button>
    </div>
  );
}

export default App;