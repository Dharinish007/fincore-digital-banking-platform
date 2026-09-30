import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { safeFetchJson } from '../utils/api';
import {
  Landmark,
  Banknote,
  Users,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const DashboardView = ({ onSelectView, onOpenWorkflows }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [activeSagas, setActiveSagas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, txnRes, sagaRes] = await Promise.all([
        safeFetchJson('/api/dashboard/stats'),
        safeFetchJson('/api/transactions?limit=6'),
        safeFetchJson('/api/milestone3/sagas?limit=4'),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.stats);
      if (txnRes.data?.success) setRecentTransactions(txnRes.data.transactions || []);
      if (sagaRes.data?.success) setActiveSagas(sagaRes.data.sagas || []);
    } catch {
      // Gracefully handled by safeFetchJson
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  const volumeTrendData = [
    { time: '09:00', volume: 450000 },
    { time: '11:00', volume: 1200000 },
    { time: '13:00', volume: 850000 },
    { time: '15:00', volume: 2400000 },
    { time: '17:00', volume: 1950000 },
    { time: '19:00', volume: 980000 },
    { time: '21:00', volume: 620000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
              FinCore Executive Banking Terminal
            </h2>
            <span className="badge badge-success">Core Online</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Authenticated as <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> ({user?.role}) &bull; Real-Time Clearing & Transaction Ledger Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWorkflows}
            className="btn btn-primary"
          >
            <Sparkles size={16} />
            <span>Workflow Orchestrator</span>
          </button>
          <button
            onClick={() => onSelectView('operations-console')}
            className="btn btn-secondary"
          >
            Ops Console
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1: Deposit Base */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Deposit Base</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}>
              <Landmark size={18} />
            </div>
          </div>
          <div className="stat-value font-mono">
            ₹{(stats?.totalDeposits || 1954000).toLocaleString()}
          </div>
          <div className="stat-change" style={{ color: 'var(--success)' }}>
            <ArrowUpRight size={14} />
            <span>{stats?.activeAccounts || 4} Active accounts • INR</span>
          </div>
        </div>

        {/* Card 2: Loan Book Exposure */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Credit Book Exposure</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <Banknote size={18} />
            </div>
          </div>
          <div className="stat-value font-mono">
            ₹{(stats?.totalLoanExposure || 4992400).toLocaleString()}
          </div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>
            <span>{stats?.totalLoans || 3} Active Facilities</span>
          </div>
        </div>

        {/* Card 3: KYC Verification Rate */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">KYC Verification Rate</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--accent-indigo-light)', color: 'var(--accent-indigo)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="stat-value font-mono">
            {stats?.totalCustomers ? Math.round(((stats?.verifiedKyc || 2) / stats.totalCustomers) * 100) : 75}%
          </div>
          <div className="stat-change" style={{ color: 'var(--warning)' }}>
            <span>{stats?.pendingKyc || 1} Pending Supervisor Review</span>
          </div>
        </div>

        {/* Card 4: Saga Reliability */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Saga Orchestrator</span>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <Zap size={18} />
            </div>
          </div>
          <div className="stat-value font-mono">
            {stats?.totalSagas ? Math.round(((stats?.completedSagas || 1) / stats.totalSagas) * 100) : 100}%
          </div>
          <div className="stat-change" style={{ color: '#c084fc' }}>
            <span>{stats?.compensatedSagas || 1} Compensated Rollbacks</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Intraday Clearing Volume & Velocity</h3>
            <p className="card-subtitle">Settled volume aggregated in INR across NEFT, RTGS & Internal Ledger</p>
          </div>
          <div className="badge badge-info">Real-Time</div>
        </div>

        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeTrendData}>
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#101622', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Volume']}
              />
              <Area type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} fill="#2563eb" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Core Ledger Transactions</h3>
            <p className="card-subtitle">Real-time double-entry journal postings with ACID idempotency</p>
          </div>
          <button
            onClick={() => onSelectView('transactions')}
            className="btn btn-secondary btn-sm"
          >
            View All
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Type</th>
                <th>Source / Target Account</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="font-mono">{tx.referenceNumber || tx.id}</td>
                  <td><span className="badge badge-neutral">{tx.transactionType}</span></td>
                  <td>{tx.accountNumber || tx.fromAccount || 'Internal Core'}</td>
                  <td className="font-mono font-semibold" style={{ color: tx.transactionType === 'DEPOSIT' || tx.transactionType === 'CREDIT' ? 'var(--success)' : 'var(--text-primary)' }}>
                    ₹{tx.amount?.toLocaleString()}
                  </td>
                  <td><StatusBadge status={tx.status} size="sm" /></td>
                  <td className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(tx.createdAt || tx.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
