import React from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Activity,
  CreditCard,
  ShieldAlert,
  GitMerge,
  Scale,
  Building2,
  FileCheck,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Institutional Top Navigation */}
      <header className="home-nav">
        <div className="brand-badge">
          <div className="brand-icon-box">
            <Landmark size={22} color="#ffffff" />
          </div>
          <span>FinCore Nexus</span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#services" style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>
            Banking Services
          </a>
          <a href="#roles" style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>
            Operational Roles
          </a>
          <a href="#security" style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>
            Security &amp; Compliance
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ padding: '9px 22px', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Lock size={15} />
            <span>Login Securely</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main>
        <section className="home-hero">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.35)',
              color: '#60a5fa',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: 22
            }}
          >
            <ShieldCheck size={16} />
            <span>Enterprise Core Banking Operating System</span>
          </div>

          <h1>
            Next-Generation Digital Banking &amp; <br />
            <span className="home-hero-gradient">Real-Time Transaction Management</span>
          </h1>

          <p>
            FinCore Nexus delivers an institutional banking infrastructure uniting customer identity verification, automated loan amortization, multi-step disbursement sagas, interbank settlements, and cryptographic SHA-256 audit integrity into a single unified platform.
          </p>

          <div className="hero-cta-group">
            <Link
              to="/login"
              className="btn btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1.02rem',
                borderRadius: '10px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)'
              }}
            >
              <Lock size={18} />
              <span>Login Securely</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#services"
              className="btn btn-secondary"
              style={{
                padding: '14px 28px',
                fontSize: '1.02rem',
                borderRadius: '10px',
                fontWeight: 600
              }}
            >
              <span>Explore Banking Services</span>
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              maxWidth: 960,
              margin: '50px auto 0',
              padding: '20px 24px',
              background: 'rgba(17, 30, 59, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 14,
              backdropFilter: 'blur(8px)'
            }}
          >
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>$1.4B+</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>Daily Clearing Capacity</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>99.999%</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>Platform Availability</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>Real-Time</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>DPD NPA Classification</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>SHA-256</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>Cryptographic Audit Chain</div>
            </div>
          </div>
        </section>

        {/* Four Core Functional Pillars */}
        <section id="services" style={{ maxWidth: 1200, margin: '0 auto 70px', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: '1.9rem', color: '#ffffff', fontWeight: 700 }}>
              Integrated Core Banking Solutions
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: 8, maxWidth: 680, margin: '8px auto 0' }}>
              Four mission-critical banking disciplines operate seamlessly on one synchronized database with real-time state integrity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {/* Pillar 1: Identity & KYC */}
            <div className="banking-card" style={{ padding: 24, borderRadius: 14, background: '#111e3b', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: 10, background: 'rgba(37,99,235,0.15)', color: '#60a5fa', marginBottom: 16 }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginBottom: 8 }}>
                Identity &amp; Access Governance
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                Automated customer onboarding, multi-document regulatory KYC verification, role-based operation permissions, and continuous chronological activity logging.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Multi-Document KYC Verification
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Strict Role-Based Access Control (RBAC)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Regulatory Review &amp; Approval Queues
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Complete Action Audit Logging
                </li>
              </ul>
            </div>

            {/* Pillar 2: Lending & NPA */}
            <div className="banking-card" style={{ padding: 24, borderRadius: 14, background: '#111e3b', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#10b981', marginBottom: 16 }}>
                <CreditCard size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginBottom: 8 }}>
                Lending &amp; Asset Classification
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                Full loan lifecycle management with dynamic amortization schedules, multi-phase disbursement sagas, and statutory Days Past Due (DPD) non-performing asset classification.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Automated EMI Amortization Tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Multi-Phase Disbursement Sagas
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Real-time NPA Classification (SMA 0/1/2)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Statutory Capital Reserve Calculation
                </li>
              </ul>
            </div>

            {/* Pillar 3: Settlements & Dispatch */}
            <div className="banking-card" style={{ padding: 24, borderRadius: 14, background: '#111e3b', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: 10, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', marginBottom: 16 }}>
                <GitMerge size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginBottom: 8 }}>
                Treasury &amp; Settlements
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                Distributed saga transaction coordination with automated compensation semantics, multi-channel interbank clearing batches, and real-time customer event dispatch.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Distributed Transaction Sagas
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> RTGS, NEFT, SWIFT &amp; ACH Clearing
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Automated Compensation Handling
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Multi-Channel Alerts (SMS, Email, Push)
                </li>
              </ul>
            </div>

            {/* Pillar 4: Risk & Audit Integrity */}
            <div className="banking-card" style={{ padding: 24, borderRadius: 14, background: '#111e3b', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: 10, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', marginBottom: 16 }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginBottom: 8 }}>
                Risk &amp; Forensic Integrity
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                Algorithmic multi-factor credit risk scoring, anti-money laundering (AML) &amp; PEP compliance registers, and cryptographic SHA-256 hash chains for tamper detection.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Multi-Factor Credit Risk Scoring (0-100)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> AML, PEP &amp; Sanctions Screening
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Cryptographic SHA-256 Block Ledger
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={15} color="#10b981" /> Continuous Tamper Surveillance &amp; Alerts
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Operational Roles Section */}
        <section id="roles" style={{ background: '#0d1833', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '60px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 700 }}>
                Role-Based Banking Operations
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: 8 }}>
                Five specialized access profiles with segregated operational capabilities and strict permission boundaries.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {/* ADMIN */}
              <div style={{ background: '#111e3b', padding: 22, borderRadius: 12, border: '1px solid rgba(139,92,246,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#a78bfa', fontWeight: 700 }}>
                  <Users size={20} />
                  <span>ADMINISTRATOR</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  Executive platform oversight, user role administration, enterprise loan portfolio analytics, system configurations, and master audit oversight.
                </p>
              </div>

              {/* SUPERVISOR */}
              <div style={{ background: '#111e3b', padding: 22, borderRadius: 12, border: '1px solid rgba(37,99,235,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#60a5fa', fontWeight: 700 }}>
                  <Activity size={20} />
                  <span>SUPERVISOR</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  KYC approval signoffs, high-value loan disbursement authorization, AML compliance adjudication, and credit risk score reassessments.
                </p>
              </div>

              {/* TELLER */}
              <div style={{ background: '#111e3b', padding: 22, borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#34d399', fontWeight: 700 }}>
                  <CreditCard size={20} />
                  <span>TELLER</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  Front-line counter operations, customer identification intake, EMI installment collection with balance recalculation, and compliance screening submission.
                </p>
              </div>

              {/* AUDITOR */}
              <div style={{ background: '#111e3b', padding: 22, borderRadius: 12, border: '1px solid rgba(245,158,11,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#fbbf24', fontWeight: 700 }}>
                  <ShieldAlert size={20} />
                  <span>AUDITOR</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  Independent regulatory inspection, cryptographic SHA-256 hash ledger verification, automated tamper detection surveillance, and incident resolution.
                </p>
              </div>

              {/* CUSTOMER */}
              <div style={{ background: '#111e3b', padding: 22, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#f87171', fontWeight: 700 }}>
                  <Lock size={20} />
                  <span>CUSTOMER</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  Client portal with personal savings overview, active loan balances, upcoming EMI schedules, one-click online payments, and notification inbox.
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '0.95rem', borderRadius: 8 }}>
                <Lock size={16} />
                <span>Access Operational Workspace</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Security & Regulatory Standards */}
        <section id="security" style={{ maxWidth: 1100, margin: '60px auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.7rem', color: '#ffffff', fontWeight: 700 }}>
              Institutional Security &amp; Compliance
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: 6 }}>
              Engineered to meet the stringent standards of modern central banking authorities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ background: '#111e3b', padding: 20, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} />
                <span>Cryptographic SHA-256 Chain</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                Every financial transaction, loan approval, and KYC modification generates an immutable cryptographic block linking back to the genesis ledger.
              </p>
            </div>

            <div style={{ background: '#111e3b', padding: 20, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale size={18} />
                <span>Basel III &amp; DPD NPA Compliance</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                Automated statutory classifications across Standard, SMA-0, SMA-1, SMA-2, and NPA with prescribed statutory capital reserves.
              </p>
            </div>

            <div style={{ background: '#111e3b', padding: 20, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={18} />
                <span>Clearinghouse Integration</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                Real-time settlement pipelines supporting RTGS, NEFT, SWIFT, and ACH clearing batches with two-phase commit sagas.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="home-footer">
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Landmark size={20} color="#2563eb" />
            <span style={{ color: '#ffffff', fontWeight: 700 }}>FinCore Nexus Institutional Banking</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Integrated Core Banking Platform · Enterprise Digital Financial Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
