import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const initialSagas = [
  {
    id: "SAG-2026-00481",
    type: "Fund Transfer",
    customer: "CUS-842190",
    amount: "₹48,500",
    from: "•••• 2841",
    to: "•••• 7192",
    status: "COMPLETED",
    started: "18:24:08",
    duration: "2.84s",
    steps: [
      ["Validate Account", "COMPLETED", "124 ms"],
      ["Reserve Funds", "COMPLETED", "218 ms"],
      ["Debit Source", "COMPLETED", "407 ms"],
      ["Credit Beneficiary", "COMPLETED", "631 ms"],
      ["Publish Event", "COMPLETED", "108 ms"]
    ]
  },
  {
    id: "SAG-2026-00480",
    type: "Bill Payment",
    customer: "CUS-518220",
    amount: "₹7,250",
    from: "•••• 9022",
    to: "BESCOM",
    status: "RUNNING",
    started: "18:23:41",
    duration: "1.91s",
    steps: [
      ["Validate Account", "COMPLETED", "116 ms"],
      ["Reserve Funds", "COMPLETED", "190 ms"],
      ["Debit Source", "COMPLETED", "382 ms"],
      ["Process Biller", "RUNNING", "—"],
      ["Publish Event", "PENDING", "—"]
    ]
  },
  {
    id: "SAG-2026-00479",
    type: "Fund Transfer",
    customer: "CUS-771042",
    amount: "₹1,25,000",
    from: "•••• 4410",
    to: "•••• 3389",
    status: "FAILED",
    started: "18:21:16",
    duration: "4.22s",
    steps: [
      ["Validate Account", "COMPLETED", "122 ms"],
      ["Reserve Funds", "COMPLETED", "201 ms"],
      ["Debit Source", "COMPLETED", "412 ms"],
      ["Credit Beneficiary", "FAILED", "3.2 s"],
      ["Compensate Debit", "COMPLETED", "279 ms"]
    ]
  },
  {
    id: "SAG-2026-00478",
    type: "Account Opening",
    customer: "CUS-902117",
    amount: "—",
    from: "—",
    to: "Savings",
    status: "COMPLETED",
    started: "18:19:54",
    duration: "3.16s",
    steps: [
      ["KYC Verification", "COMPLETED", "840 ms"],
      ["Create Customer", "COMPLETED", "511 ms"],
      ["Create Account", "COMPLETED", "732 ms"],
      ["Issue Welcome Event", "COMPLETED", "186 ms"]
    ]
  },
  {
    id: "SAG-2026-00477",
    type: "Fund Transfer",
    customer: "CUS-331822",
    amount: "₹22,000",
    from: "•••• 1048",
    to: "•••• 8821",
    status: "COMPENSATING",
    started: "18:17:03",
    duration: "5.08s",
    steps: [
      ["Validate Account", "COMPLETED", "118 ms"],
      ["Reserve Funds", "COMPLETED", "203 ms"],
      ["Debit Source", "COMPLETED", "401 ms"],
      ["Credit Beneficiary", "FAILED", "2.7 s"],
      ["Compensate Debit", "RUNNING", "—"]
    ]
  }
];

const navItems = [
  ["overview", "Dashboard", "⌂"],
  ["kyc", "KYC Verification", "▦"],
  ["sagas", "Saga Execution", "□"],
  ["settlement", "Settlement Confirmation", "↻"],
  ["notification", "Notification Delivery", "△"],
  ["audit", "Audit Trail", "▤"],
  ["settings", "Settings", "⚙"]
];

function StatusBadge({ status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
}

function Metric({ label, value, detail, tone }) {
  return (
    <div className="metric">
      <div className={`metric-icon ${tone}`}>{tone === "blue" ? "↗" : tone === "green" ? "✓" : tone === "amber" ? "◷" : "!"}</div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-detail">{detail}</div>
      </div>
    </div>
  );
}

function SagaDetails({ saga, onClose, onRetry }) {
  if (!saga) return null;
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">SAGA EXECUTION</div>
            <h2>{saga.id}</h2>
            <p>{saga.type} · {saga.customer}</p>
          </div>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>

        <div className="detail-grid">
          <div><span>Amount</span><strong>{saga.amount}</strong></div>
          <div><span>Status</span><StatusBadge status={saga.status} /></div>
          <div><span>Started</span><strong>{saga.started}</strong></div>
          <div><span>Duration</span><strong>{saga.duration}</strong></div>
        </div>

        <h3>Orchestration timeline</h3>
        <div className="timeline">
          {saga.steps.map((step, i) => (
            <div className="timeline-row" key={step[0]}>
              <div className={`timeline-dot ${step[1].toLowerCase()}`}>{step[1] === "COMPLETED" ? "✓" : step[1] === "FAILED" ? "!" : i + 1}</div>
              <div className="timeline-content">
                <div className="timeline-title"><strong>{step[0]}</strong><StatusBadge status={step[1]} /></div>
                <span>Service execution time: {step[2]}</span>
                {step[1] === "FAILED" && <div className="error-note">Credit service returned a downstream timeout. Compensation policy initiated.</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="drawer-actions">
          {saga.status === "FAILED" && <button className="primary" onClick={onRetry}>↻ Retry Saga</button>}
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
      </aside>
    </div>
  );
}

function App() {
  const [active, setActive] = useState("sagas");
  const [sagas, setSagas] = useState(initialSagas);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => sagas.filter(s => {
    const text = `${s.id} ${s.type} ${s.customer}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === "ALL" || s.status === status);
  }), [sagas, query, status]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const retrySaga = () => {
    setSagas(prev => prev.map(s => s.id === selected.id ? {...s, status: "RUNNING", steps: s.steps.map((x, i) => i >= 3 ? [x[0], i === 3 ? "RUNNING" : "PENDING", "—"] : x)} : s));
    setSelected(prev => ({...prev, status: "RUNNING"}));
    notify(`Retry initiated for ${selected.id}`);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">i</div>
          <div><strong>FinCore Nexus</strong><span>Digital Banking Management Platform</span></div>
        </div>
        <div className="top-actions">
          <div className="environment"><span className="pulse"></span> Core Banking Online</div>
          <button className="icon-btn">⌕</button>
          <button className="icon-btn">◔</button>
          <div className="avatar">AR</div>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar">
          <div className="side-title">OPERATIONS</div>
          {navItems.map(([id, label, icon]) => (
            <button className={`nav-item ${active === id ? "active" : ""}`} key={id} onClick={() => setActive(id)}>
              <span>{icon}</span>{label}
            </button>
          ))}
          <div className="side-bottom">
            <div className="system-card">
              <div className="system-head"><span className="pulse"></span> Platform health</div>
              <strong>99.98%</strong>
              <span>All critical services operational</span>
            </div>
            <div className="user-row"><div className="avatar small">AR</div><div><strong>Admin User</strong><span>Operations</span></div><span>⋮</span></div>
          </div>
        </nav>

        <main className="main">
          <div className="page-head">
            <div>
              <div className="breadcrumb">OPERATIONS / SAGA ORCHESTRATOR</div>
              <h1>{active === "sagas" ? "Saga Execution Monitor" : navItems.find(x => x[0] === active)?.[1]}</h1>
              <p>Monitor distributed transaction workflows, state transitions and compensation activity.</p>
            </div>
            <div className="head-actions">
              <button className="secondary" onClick={() => notify("Dashboard data refreshed")}>↻ Refresh</button>
              <button className="primary" onClick={() => notify("New saga execution flow opened")}>＋ New Saga Execution</button>
            </div>
          </div>

          <section className="metrics">
            <Metric label="TOTAL EXECUTIONS" value="12,846" detail="All saga workflows · Last 24h" tone="blue" />
            <Metric label="PENDING" value="26" detail="Awaiting next step" tone="amber" />
            <Metric label="PROCESSING" value="18" detail="Currently in progress" tone="blue" />
            <Metric label="COMPLETED" value="12,646" detail="98.4% success rate" tone="green" />
            <Metric label="FAILED" value="14" detail="5 awaiting retry" tone="red" />
          </section>

          <section className="main-panels">
          <div className="flow-card-m3">
            <div className="card-head"><div><h2>Current Saga Flow</h2><span>Transaction orchestration lifecycle</span></div><div className="live"><span className="pulse"></span> LIVE</div></div>
            <div className="m3-flow">
              {[
                ["Transaction Received","Request accepted by Saga Orchestrator","done"],
                ["Customer Validation","Customer and account validation","done"],
                ["Debit Account","Funds reserved and debit executed","done"],
                ["Settlement Confirmation","Settlement service response","active"],
                ["Notification Delivery","Publish success / failure event","pending"],
                ["Saga Completed","Final transaction state","pending"]
              ].map((x,i)=><div className="m3-step" key={x[0]}>
                <div className={`m3-dot ${x[2]}`}>{x[2]==="done" ? "✓" : x[2]==="active" ? "•" : i+1}</div>
                <div><b>{i+1}. {x[0]}</b><span>{x[1]}</span></div>
              </div>)}
            </div>
          </div>
          <div className="content-card">
            <div className="card-head">
              <div>
                <h2>Recent Saga Executions</h2>
                <span>Live orchestration events · Last updated just now</span>
              </div>
              <div className="live"><span className="pulse"></span> LIVE</div>
            </div>

            <div className="filters">
              <div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search saga ID, customer or type..." /></div>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="ALL">All statuses</option>
                <option>COMPLETED</option><option>RUNNING</option><option>FAILED</option><option>COMPENSATING</option>
              </select>
              <button className="filter-btn">☷ Filters</button>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>SAGA ID</th><th>TRANSACTION</th><th>CUSTOMER</th><th>AMOUNT</th><th>STATUS</th><th>STARTED</th><th>DURATION</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(saga => (
                    <tr key={saga.id} onClick={() => setSelected(saga)}>
                      <td><strong className="mono">{saga.id}</strong><small>{saga.from} → {saga.to}</small></td>
                      <td>{saga.type}</td>
                      <td className="mono">{saga.customer}</td>
                      <td><strong>{saga.amount}</strong></td>
                      <td><StatusBadge status={saga.status} /></td>
                      <td className="mono">{saga.started}</td>
                      <td className="mono">{saga.duration}</td>
                      <td><button className="row-more" onClick={e => {e.stopPropagation(); setSelected(saga)}}>•••</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length && <div className="empty">No saga executions match your filters.</div>}
            </div>
            <div className="pagination"><span>Showing 1–{filtered.length} of 12,846 executions</span><div><button disabled>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>1285</button><button>›</button></div></div>
          </div>
          </section>

          <section className="bottom-grid">
            <div className="mini-card">
              <div className="mini-head"><div><h3>Execution Throughput</h3><span>Last 60 minutes</span></div><strong>214/min</strong></div>
              <div className="bars">{[42,56,48,70,63,81,67,91,73,84,77,96,82,89,100,92,86,98,90,94].map((h,i)=><i style={{height:`${h}%`}} key={i}></i>)}</div>
            </div>
            <div className="mini-card">
              <div className="mini-head"><div><h3>Compensation Queue</h3><span>Actions requiring attention</span></div><button className="link-btn">View all →</button></div>
              <div className="queue">
                <div><span className="queue-dot danger"></span><div><strong>SAG-2026-00479</strong><small>Debit compensation completed</small></div><StatusBadge status="COMPLETED"/></div>
                <div><span className="queue-dot amber"></span><div><strong>SAG-2026-00477</strong><small>Waiting for compensation service</small></div><StatusBadge status="RUNNING"/></div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {selected && <SagaDetails saga={selected} onClose={() => setSelected(null)} onRetry={retrySaga} />}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
