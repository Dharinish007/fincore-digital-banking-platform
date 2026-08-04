import React, { useState } from "react";

const c = {
  bg: "#0B0E14",
  sidebar: "#090C11",
  header1: "#123FAE",
  header2: "#1E63E0",
  card: "#121722",
  border: "#212836",
  text: "#E8EBF0",
  muted: "#7C8797",
  blue: "#4C8DFF",
  green: "#22C55E",
  amber: "#F5A524",
  red: "#EF4444",
};

const roles = ["Bank Teller", "Supervisor", "Admin"];

const customers = [
  { id: "1234-5678-9012", name: "Tharun M", type: "Savings", balance: "12,847.50",
    kyc: "Verified", risk: "Low",
    docs: ["Aadhaar", "PAN card", "Address proof"] },
  { id: "2231-9087-4410", name: "Vaishnavi Warkar", type: "Current", balance: "4,210.00",
    kyc: "Pending", risk: "Medium",
    docs: ["Aadhaar", "PAN card"] },
  { id: "3390-1122-7784", name: "Thejashree", type: "Savings", balance: "980.25",
    kyc: "Flagged", risk: "High",
    docs: ["Aadhaar"] },
  { id: "4471-3302-1128", name: "Sharvari Shalgar", type: "Savings", balance: "22,004.10",
    kyc: "Pending", risk: "Low",
    docs: ["Aadhaar", "PAN card", "Address proof"] },
  { id: "5518-6674-4402", name: "Vaishnavi Mahadik", type: "Current", balance: "7,650.75",
    kyc: "Verified", risk: "Low",
    docs: ["Aadhaar", "PAN card", "Address proof"] },
];

const auditLog = [
  { ref: "a1f9c2", time: "18:42:03", actor: "S. R. Puthal (Bank Teller)", action: "Flagged KYC for supervisor review", target: "3390-1122-7784" },
  { ref: "b7e3d1", time: "18:39:51", actor: "S. R. Puthal (Bank Teller)", action: "Viewed KYC profile", target: "1234-5678-9012" },
  { ref: "c2a8f4", time: "18:31:17", actor: "S. R. Puthal (Bank Teller)", action: "Requested re-upload of address proof", target: "2231-9087-4410" },
  { ref: "d9b1e6", time: "18:22:40", actor: "S. R. Puthal (Admin)", action: "Updated Bank Teller role permissions", target: "ROLE-TELLER" },
  { ref: "e4c7a2", time: "18:15:08", actor: "S. R. Puthal (Bank Teller)", action: "Deposit transaction posted", target: "4471-3302-1128" },
];

function Header({ role, setRole }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between px-6"
      style={{ height: 64, background: `linear-gradient(90deg, ${c.header1}, ${c.header2})` }}>
      <span className="font-bold text-lg tracking-tight" style={{ color: "#fff" }}>FinCore Nexus</span>
      <span className="text-sm font-medium" style={{ color: "#fff" }}>
        Milestone 1: Account &amp; Customer Services
      </span>
      <div className="relative">
        <button onClick={() => setOpen(!open)}
          className="text-sm font-semibold"
          style={{ color: "#fff" }}>
          {role} | Logout
        </button>
        {open && (
          <div className="absolute right-0 mt-2 rounded shadow-lg overflow-hidden z-10"
            style={{ background: c.card, border: `1px solid ${c.border}`, minWidth: 150 }}>
            {roles.map((r) => (
              <button key={r} onClick={() => { setRole(r); setOpen(false); }}
                className="block w-full text-left text-sm px-3 py-2"
                style={{ color: r === role ? c.blue : c.text }}>
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ view, setView }) {
  const items = ["Dashboard", "Accounts", "Loans", "Payments", "KYC", "Audit", "Settings"];
  const active = ["Dashboard", "KYC", "Audit"];
  return (
    <div className="w-52 flex-shrink-0 py-4" style={{ background: "#000" }}>
      {items.map((item) => {
        const enabled = active.includes(item);
        const isActive = view === item;
        return (
          <button key={item}
            onClick={() => enabled && setView(item)}
            className="w-full text-left px-6 py-2.5 text-sm"
            style={{
              color: !enabled ? "#4A5568" : isActive ? c.blue : c.text,
              cursor: enabled ? "pointer" : "default",
            }}>
            {item}
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-lg px-5 py-4 flex-1" style={{ background: c.card, border: `1px solid ${c.border}` }}>
      <div className="text-xs" style={{ color: c.muted }}>{label}</div>
      <div className="text-2xl font-semibold mt-1" style={{ color: c.text }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: c.blue }}>{sub}</div>
    </div>
  );
}

function Line({ children }) {
  return <div className="font-mono text-sm py-1.5" style={{ color: c.text }}>{children}</div>;
}

function ActionButtons({ role }) {
  const canDecide = role !== "Bank Teller";
  return (
    <div className="font-mono text-sm mt-1 flex items-center gap-3 flex-wrap">
      <span style={{ color: c.text }}>Action:</span>
      <span style={{ color: c.blue, cursor: "pointer" }}>[Flag for Review]</span>
      <span style={{ color: canDecide ? c.blue : "#4A5568", cursor: canDecide ? "pointer" : "default" }}>
        [Approve]
      </span>
      <span style={{ color: canDecide ? c.blue : "#4A5568", cursor: canDecide ? "pointer" : "default" }}>
        [Reject]
      </span>
    </div>
  );
}

const demoSlides = [
  {
    account: "1234-5678-9012", type: "Savings", balance: "12,847.50",
    customer: "John Smith", kyc: "Verified", risk: "Low",
    txn: "Deposit $2,400", latency: "47ms",
    actions: ["View Statement", "Transfer", "Freeze Account"],
  },
  {
    account: "7788-2201-3345", type: "Current", balance: "980.25",
    customer: "Thejashree", kyc: "Flagged", risk: "High",
    txn: "Withdrawal $150", latency: "52ms",
    actions: ["View Statement", "Transfer", "Freeze Account"],
  },
  {
    account: "5518-6674-4402", type: "Current", balance: "7,650.75",
    customer: "Vaishnavi Mahadik", kyc: "Verified", risk: "Low",
    txn: "Deposit $600", latency: "41ms",
    actions: ["View Statement", "Transfer", "Freeze Account"],
  },
];

function Dashboard({ role }) {
  const [slide, setSlide] = useState(0);
  const d = demoSlides[slide];
  const canFreeze = role !== "Bank Teller";
  return (
    <div className="p-6 h-full flex flex-col">
      <div>
        <h1 className="text-xl font-semibold mb-4" style={{ color: c.text }}>Core Banking Operations</h1>
        <div className="flex gap-4 mb-6">
          <StatCard label="Active Accounts" value="2.4M" sub="Savings+Current" />
          <StatCard label="Transactions/Day" value="12.4M" sub="Real-time" />
          <StatCard label="Uptime" value="99.99%" sub="SLA" />
        </div>
        <div className="rounded-lg p-5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: c.text }}>
            Account Service - Core Banking
          </div>
          <Line>Account: {d.account} | Type: {d.type} | Balance: ${d.balance}</Line>
          <Line>Customer: {d.customer} | KYC: {d.kyc} | Risk: {d.risk}</Line>
          <Line>Transaction: {d.txn} | Kafka Event Published</Line>
          <Line>PostgreSQL: ACID commit | Redis: Balance cached</Line>
          <Line>Microservice: Account Service | Latency: {d.latency}</Line>
          <Line>Audit: Logged to Audit DB | Immutable</Line>
          <div className="font-mono text-sm mt-1 flex items-center gap-3 flex-wrap">
            <span style={{ color: c.text }}>Action:</span>
            {d.actions.map((a) => {
              const locked = a === "Freeze Account" && !canFreeze;
              return (
                <span key={a} style={{ color: locked ? "#4A5568" : c.text, cursor: locked ? "default" : "pointer" }}>
                  [{a}]
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 text-sm mt-auto pt-6" style={{ color: c.muted }}>
        <span>{slide + 1}/3</span>
        <button onClick={() => setSlide((slide + 1) % 3)} style={{ color: c.blue, fontSize: 16 }}>›</button>
      </div>
    </div>
  );
}

function KYC({ role }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1" style={{ color: c.text }}>KYC Verification</h1>
      <p className="text-sm mb-5" style={{ color: c.muted }}>
        Bank Tellers can flag a profile for review. Approval or rejection requires Supervisor or Admin.
      </p>
      {customers.map((cust) => (
        <div key={cust.id} className="rounded-lg p-5 mb-4"
          style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: c.text }}>{cust.name}</div>
          <Line>Account: {cust.id} | Type: {cust.type}</Line>
          <Line>KYC: {cust.kyc} | Risk: {cust.risk}</Line>
          <Line>
            Documents: {["Aadhaar", "PAN card", "Address proof"].map((d, i) => (
              <span key={d}>{cust.docs.includes(d) ? d : `${d} (missing)`}{i < 2 ? ", " : ""}</span>
            ))}
          </Line>
          <Line>Audit: Logged to Audit DB | Immutable</Line>
          <ActionButtons role={role} kyc={cust.kyc} />
        </div>
      ))}
    </div>
  );
}

function Audit({ role }) {
  const canExport = role !== "Bank Teller";
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold" style={{ color: c.text }}>Audit Trail</h1>
        <span className="font-mono text-sm"
          style={{ color: canExport ? c.blue : "#4A5568", cursor: canExport ? "pointer" : "default" }}>
          [Export]
        </span>
      </div>
      <p className="text-sm mb-5" style={{ color: c.muted }}>
        Every event is written once. No role can edit or delete an entry.
      </p>
      {auditLog.map((e) => (
        <div key={e.ref} className="rounded-lg p-5 mb-4"
          style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <Line>Event: {e.action} | ref#{e.ref}</Line>
          <Line>Actor: {e.actor} | Time: {e.time}</Line>
          <Line>Target: {e.target}</Line>
          <Line>Persistence: PostgreSQL ACID commit | Kafka event published</Line>
          <Line>Status: Immutable</Line>
        </div>
      ))}
    </div>
  );
}

export default function FinCoreApp() {
  const [view, setView] = useState("Dashboard");
  const [role, setRole] = useState("Bank Teller");

  let content;
  if (view === "KYC") content = <KYC role={role} />;
  else if (view === "Audit") content = <Audit role={role} />;
  else content = <Dashboard role={role} />;

  return (
    <div className="w-full flex flex-col" style={{ height: "100vh", background: c.bg, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Header role={role} setRole={setRole} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar view={view} setView={setView} />
        <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>{content}</div>
      </div>
    </div>
  );
}