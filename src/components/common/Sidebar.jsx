import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Banknote,
  ArrowLeftRight,
  ShieldCheck,
  UserCog,
  FileText,
  CalendarCheck,
  GitMerge,
  AlertTriangle,
  Zap,
  Building2,
  BellRing,
  TerminalSquare,
  Settings,
  LogOut,
  Landmark,
  Send,
  QrCode,
  Wallet
} from 'lucide-react';

export const Sidebar = ({ currentView, onSelectView }) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'ADMIN';

  const getNavSections = () => {
    if (role === 'CUSTOMER') {
      return [
        {
          title: 'MY BANKING SERVICES',
          items: [
            { id: 'customer-accounts', label: 'My Accounts & Balances', icon: Wallet },
            { id: 'customer-send', label: 'Send Money (Transfer)', icon: Send },
            { id: 'customer-receive', label: 'Receive Money / QR', icon: QrCode },
            { id: 'customer-transactions', label: 'Passbook & Statement', icon: ArrowLeftRight },
            { id: 'customer-loans', label: 'My Loans & Pay EMI', icon: Banknote },
            { id: 'customer-kyc', label: 'KYC Verification', icon: ShieldCheck },
          ],
        },
        {
          title: 'PREFERENCES',
          items: [
            { id: 'm3-notifications', label: 'Notifications', icon: BellRing },
            { id: 'settings', label: 'Profile & Security', icon: Settings },
          ],
        },
      ];
    }

    if (role === 'TELLER') {
      return [
        {
          title: 'TELLER COUNTER DESK',
          items: [
            { id: 'teller-desk', label: 'Cashier Desk & Counter', icon: LayoutDashboard },
            { id: 'customers', label: 'Customer Directory', icon: Users },
            { id: 'accounts', label: 'Accounts & Deposits', icon: CreditCard },
            { id: 'm1-kyc', label: 'KYC Document Intake', icon: ShieldCheck },
          ],
        },
        {
          title: 'JOURNAL & PREFERENCES',
          items: [
            { id: 'transactions', label: 'Counter Transactions', icon: ArrowLeftRight },
            { id: 'm3-notifications', label: 'Notification Center', icon: BellRing },
            { id: 'settings', label: 'Settings & Security', icon: Settings },
          ],
        },
      ];
    }

    if (role === 'SUPERVISOR') {
      return [
        {
          title: 'SUPERVISOR OVERSIGHT',
          items: [
            { id: 'supervisor-dashboard', label: 'Approvals & Governance', icon: LayoutDashboard },
            { id: 'accounts', label: 'Accounts & Freeze Control', icon: CreditCard },
            { id: 'm1-kyc', label: 'KYC Four-Eyes Adjudication', icon: ShieldCheck },
            { id: 'loans', label: 'Loan Sanctioning & Credit', icon: Banknote },
          ],
        },
        {
          title: 'RISK & SETTLEMENTS',
          items: [
            { id: 'm2-disbursement', label: 'Loan Disbursement Saga', icon: GitMerge },
            { id: 'm2-npa', label: 'NPA & Risk Engine', icon: AlertTriangle },
            { id: 'm3-settlements', label: 'Clearing & Settlements', icon: Building2 },
            { id: 'm1-audit', label: 'Audit Trail & Compliance', icon: FileText },
            { id: 'transactions', label: 'All Bank Transactions', icon: ArrowLeftRight },
            { id: 'm3-notifications', label: 'Notification Center', icon: BellRing },
            { id: 'settings', label: 'Settings & Security', icon: Settings },
          ],
        },
      ];
    }

    if (role === 'AUDITOR') {
      return [
        {
          title: 'REGULATORY AUDIT & SURVEILLANCE',
          items: [
            { id: 'auditor-dashboard', label: 'Compliance Overview', icon: LayoutDashboard },
            { id: 'm1-audit', label: 'Immutable Audit Trail', icon: FileText },
            { id: 'transactions', label: 'AML & Txn Surveillance', icon: ArrowLeftRight },
            { id: 'm1-kyc', label: 'KYC Four-Eyes Audit', icon: ShieldCheck },
          ],
        },
        {
          title: 'RISK & SETTLEMENT INSPECTION',
          items: [
            { id: 'm2-npa', label: 'NPA & Capital Compliance', icon: AlertTriangle },
            { id: 'm3-settlements', label: 'Interbank Settlements', icon: Building2 },
            { id: 'm3-saga', label: 'Saga Compensations', icon: Zap },
            { id: 'settings', label: 'Security & Preferences', icon: Settings },
          ],
        },
      ];
    }

    // Default: ADMIN (ALL Options Available)
    return [
      {
        title: 'CORE BANKING',
        items: [
          { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'customers', label: 'Customer Directory', icon: Users },
          { id: 'accounts', label: 'Accounts & Deposits', icon: CreditCard },
          { id: 'transactions', label: 'Recent Transactions', icon: ArrowLeftRight },
          { id: 'loans', label: 'Credit & Loans', icon: Banknote },
        ],
      },
      {
        title: 'IDENTITY & COMPLIANCE',
        items: [
          { id: 'm1-kyc', label: 'KYC Verification', icon: ShieldCheck },
          { id: 'm1-users', label: 'Staff & Role Management', icon: UserCog },
          { id: 'm1-audit', label: 'Audit Trail & Compliance', icon: FileText },
        ],
      },
      {
        title: 'LENDING & SAGA OPERATIONS',
        items: [
          { id: 'm2-repayments', label: 'Loan Repayments', icon: CalendarCheck },
          { id: 'm2-disbursement', label: 'Loan Disbursement Saga', icon: GitMerge },
          { id: 'm2-npa', label: 'NPA & Risk Analysis', icon: AlertTriangle },
          { id: 'm3-saga', label: 'Distributed Sagas', icon: Zap },
          { id: 'm3-settlements', label: 'Clearing & Settlements', icon: Building2 },
          { id: 'm3-notifications', label: 'Notification Center', icon: BellRing },
        ],
      },
      {
        title: 'ADMINISTRATION',
        items: [
          { id: 'operations-console', label: 'Operations Console', icon: TerminalSquare },
          { id: 'settings', label: 'Settings & Security', icon: Settings },
        ],
      },
    ];
  };

  const navSections = getNavSections();

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Landmark size={20} />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>FinCore</span>
            <span className="badge badge-info" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem' }}>Bank</span>
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            {role === 'CUSTOMER' ? 'Retail NetBanking' : role === 'AUDITOR' ? 'Regulatory Audit' : role === 'TELLER' ? 'Branch Cashier' : role === 'SUPERVISOR' ? 'Branch Oversight' : 'Enterprise Core'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.title} style={{ marginBottom: '1.25rem' }}>
            <p className="nav-section-title">
              {section.title}
            </p>
            <div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentView === item.id ||
                  (role === 'CUSTOMER' && currentView === 'dashboard' && item.id === 'customer-accounts') ||
                  (role === 'TELLER' && currentView === 'dashboard' && item.id === 'teller-desk') ||
                  (role === 'SUPERVISOR' && currentView === 'dashboard' && item.id === 'supervisor-dashboard') ||
                  (role === 'AUDITOR' && currentView === 'dashboard' && item.id === 'auditor-dashboard');

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={`nav-item w-full ${isActive ? 'active' : ''}`}
                    style={{ border: 'none', width: '100%', cursor: 'pointer' }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Info & Sign Out */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-2" style={{ overflow: 'hidden' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.8125rem'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col" style={{ overflow: 'hidden' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Bank User'}
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {role}
            </span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          title="Sign Out"
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--danger)', padding: '0.375rem' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
