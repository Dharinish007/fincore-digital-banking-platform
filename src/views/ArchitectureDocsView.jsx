import React, { useState } from 'react';
import { Shield, Zap, BookOpen, Layers, CheckCircle2, Copy, GitBranch, Table, Key, Link2, CreditCard } from 'lucide-react';

export const ArchitectureDocsView = () => {
  const [activeTab, setActiveTab] = useState('m1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(16, 22, 34, 0.95))',
        borderColor: 'var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Banking System Architecture & Integration Guide
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Core transaction specifications, relational entity schemas, and security standards
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { id: 'm1', label: 'Identity, RBAC & KYC' },
          { id: 'm2', label: 'Lending, EMI & NPA' },
          { id: 'm3', label: 'Transfers, Saga & Settlements' },
          { id: 'schema', label: 'Relational Database Schema' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card" style={{ padding: '1.75rem' }}>
        {activeTab === 'm1' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Module 1: Identity Verification, Role-Based Access Control & KYC
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              FinCore Bank provides multi-role separation across ADMIN, SUPERVISOR, TELLER, and CUSTOMER roles. All sensitive endpoints verify stateless JWT credentials and enforce Four-Eyes approval policies for customer verification and credit sanctioning.
            </p>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>Key API Endpoints:</div>
              <div>POST /api/auth/login &rarr; Authenticates user and generates Bearer JWT</div>
              <div>PUT /api/auth/users/:id/block &rarr; Admin immediate user block & lockout</div>
              <div>POST /api/milestone1/kyc &rarr; Document intake & OCR extraction</div>
              <div>PUT /api/milestone1/kyc/:id/review &rarr; Supervisor four-eyes adjudication</div>
            </div>
          </div>
        )}

        {activeTab === 'm2' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Module 2: Credit Origination, Amortization & NPA Risk Classification
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Automated reducing-balance EMI amortization calculation, 6-step atomic disbursement saga orchestration, and automated asset categorization into Standard, SMA-0, SMA-1, SMA-2, and Non-Performing Assets (&gt;90 Days Past Due).
            </p>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>Key API Endpoints:</div>
              <div>POST /api/loans/apply &rarr; Credit evaluation & loan application</div>
              <div>POST /api/loans/:id/approve &rarr; Supervisor credit sanctioning</div>
              <div>POST /api/milestone2/disbursements/execute &rarr; 6-stage automated capital release</div>
              <div>POST /api/milestone2/npa/classify &rarr; Automated portfolio DPD risk review</div>
            </div>
          </div>
        )}

        {activeTab === 'm3' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Module 3: Payment Rails, Distributed Saga & Interbank Settlement
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Guarantees transaction atomicity across IMPS (immediate 24x7), NEFT, and UPI payment rails with automated compensations and batch clearing cycle settlement.
            </p>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>Key API Endpoints:</div>
              <div>POST /api/core/transfers &rarr; Instant atomic funds transfer</div>
              <div>GET /api/milestone3/sagas &rarr; Distributed transaction states & retries</div>
              <div>POST /api/milestone3/settlements/:id/process &rarr; Multilateral netting & clearing</div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Relational Database Tables (MySQL 8.0 & Hibernate JPA)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <strong>users</strong>: id, username, password_hash, role, status (ACTIVE/BLOCKED)
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <strong>customers</strong>: id, customer_code, full_name, kyc_status, risk_level
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <strong>accounts</strong>: id, account_number, customer_id, balance, status
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <strong>transactions</strong>: id, source_account, destination_account, amount
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <strong>loans</strong>: id, customer_id, amount, term_months, status, npa_category
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <strong>audit_logs</strong>: id, performed_by, action, entity, hash_signature
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
