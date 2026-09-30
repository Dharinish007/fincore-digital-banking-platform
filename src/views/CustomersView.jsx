import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { CreateCustomerModal } from '../components/modals/CreateCustomerModal';
import { SubmitKycModal } from '../components/modals/SubmitKycModal';
import { Users, Plus, Search, ShieldCheck, RefreshCw } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

export const CustomersView = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await safeFetchJson('/api/customers');
      if (res.data?.success) {
        setCustomers(res.data.customers || []);
      }
    } catch {
      // Handled gracefully with fallback data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (c.fullName || '').toLowerCase().includes(s) ||
      (c.customerCode || '').toLowerCase().includes(s) ||
      (c.email || '').toLowerCase().includes(s) ||
      (c.phone || '').includes(search);
    const matchesKyc = kycFilter === 'ALL' || c.kycStatus === kycFilter;
    return matchesSearch && matchesKyc;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="card-title flex items-center gap-2" style={{ fontSize: '1.25rem' }}>
            <Users size={20} style={{ color: 'var(--accent-primary)' }} />
            Customer Directory & Profiles
          </h2>
          <p className="card-subtitle">
            Master customer records, identity verification status, and risk classification (Spring Boot & MySQL).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCustomers}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowKycModal(true)}
            className="btn btn-secondary btn-sm"
          >
            <ShieldCheck size={14} />
            <span>Submit KYC</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>New Customer</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, code, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted" style={{ fontSize: '0.8125rem' }}>KYC Status:</span>
            <select
              className="form-control"
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All KYC Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending Review</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Code</th>
                <th>Full Name</th>
                <th>Contact Details</th>
                <th>KYC Compliance</th>
                <th>Risk Rating</th>
                <th>Accounts</th>
                <th>Onboarded</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    Loading customer directory from MySQL...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No customers found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {c.customerCode || c.id}
                    </td>
                    <td>
                      <p className="font-semibold">{c.fullName}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>{c.address}</p>
                    </td>
                    <td>
                      <p>{c.email}</p>
                      <p className="text-muted font-mono" style={{ fontSize: '0.75rem' }}>{c.phone}</p>
                    </td>
                    <td>
                      <StatusBadge status={c.kycStatus || 'PENDING'} size="sm" />
                    </td>
                    <td>
                      <StatusBadge status={c.riskLevel || 'LOW'} size="sm" />
                    </td>
                    <td>
                      <span className="badge badge-info">{c.totalAccounts || 1} Accounts</span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateCustomerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchCustomers}
      />

      <SubmitKycModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        customers={customers}
        onSuccess={fetchCustomers}
      />
    </div>
  );
};
