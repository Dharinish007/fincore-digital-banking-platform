import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  CreditCard,
  GitMerge,
  ShieldCheck,
  Network,
  Activity,
  BellRing,
  Building2,
  FileCheck2,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const { user, isCustomer } = useAuth();
  const role = user?.role || 'GUEST';

  const canSee = (allowedRoles) => {
    return allowedRoles.includes(role);
  };

  return (
    <aside className="sidebar">
      {/* Primary Section */}
      <div className="sidebar-section-title">Navigation</div>
      <ul className="sidebar-nav-list">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span className="nav-label">Dashboard</span>
          </NavLink>
        </li>

        {!isCustomer && (
          <li>
            <NavLink
              to="/operations-pipeline"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Activity size={18} />
              <span className="nav-label">Operations Pipeline</span>
            </NavLink>
          </li>
        )}
      </ul>

      {/* Banking Operations */}
      <div className="sidebar-section-title">Core Banking Services</div>
      <ul className="sidebar-nav-list">
        {/* Customer Accounts & KYC */}
        {canSee(['ADMIN', 'SUPERVISOR', 'TELLER', 'AUDITOR']) && (
          <li>
            <NavLink
              to="/accounts-kyc"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <UserCheck size={18} />
              <span className="nav-label">Accounts &amp; KYC</span>
            </NavLink>
          </li>
        )}

        {/* Credit & Lending Management */}
        {canSee(['ADMIN', 'SUPERVISOR', 'TELLER', 'AUDITOR', 'CUSTOMER']) && (
          <li>
            <NavLink
              to="/lending"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <CreditCard size={18} />
              <span className="nav-label">
                {isCustomer ? 'My Loans &amp; EMI' : 'Credit &amp; Lending'}
              </span>
            </NavLink>
          </li>
        )}

        {/* Treasury & Settlements */}
        {canSee(['ADMIN', 'SUPERVISOR', 'AUDITOR', 'CUSTOMER']) && (
          <li>
            <NavLink
              to="/settlements"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <GitMerge size={18} />
              <span className="nav-label">
                {isCustomer ? 'Alerts &amp; Notices' : 'Treasury &amp; Settlements'}
              </span>
            </NavLink>
          </li>
        )}

        {/* Governance, Risk & Audit */}
        {canSee(['ADMIN', 'SUPERVISOR', 'TELLER', 'AUDITOR']) && (
          <li>
            <NavLink
              to="/governance-risk"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <ShieldCheck size={18} />
              <span className="nav-label">Risk &amp; Audit Integrity</span>
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
}
