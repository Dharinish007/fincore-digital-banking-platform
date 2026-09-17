import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import {
  UserCheck,
  History,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  FileText,
  AlertCircle,
  Users,
  Building,
  CheckCircle2,
  Plus,
  ArrowRightLeft,
  DollarSign,
  Wallet,
  Send,
  Download,
  Upload,
  KeyRound,
  Lock,
  Copy
} from 'lucide-react';

export default function AccountsKycPage() {
  const { user, isAdmin, isSupervisor, isTeller, isAuditor, isCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' | 'customers' | 'transactions' | 'audit' | 'rbac'
  const [kycRecords, setKycRecords] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [txnTypeFilter, setTxnTypeFilter] = useState('ALL');
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKycSubmitModal, setShowKycSubmitModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [createdCredentialsModal, setCreatedCredentialsModal] = useState(null);

  // Create Customer Form State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAccountType, setCustAccountType] = useState('Premium Savings');
  const [custInitialDeposit, setCustInitialDeposit] = useState('2500');
  const [custDocType, setCustDocType] = useState('Passport');
  const [custDocNumber, setCustDocNumber] = useState('');
  const [custPep, setCustPep] = useState(false);

  // Submit KYC Form State
  const [kycCustomerId, setKycCustomerId] = useState('');
  const [kycDocType, setKycDocType] = useState('Passport');
  const [kycDocNumber, setKycDocNumber] = useState('');
  const [kycAuthority, setKycAuthority] = useState('Department of Foreign Affairs');

  // Money Transfer Form State
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('500');
  const [transferChannel, setTransferChannel] = useState('INTERNAL_TRANSFER');
  const [transferDesc, setTransferDesc] = useState('Account balance transfer');

  // Cash Operation Form State
  const [cashAccount, setCashAccount] = useState('');
  const [cashType, setCashType] = useState('DEPOSIT');
  const [cashAmount, setCashAmount] = useState('1000');
  const [cashDesc, setCashDesc] = useState('Over-the-counter branch cash transaction');

  const canReviewKyc = isAdmin || isSupervisor;
  const canRegisterCustomer = isAdmin || isSupervisor || isTeller;
  const canPerformCashOp = isAdmin || isSupervisor || isTeller;

  const loadData = async () => {
    setLoading(true);
    try {
      const [kycRes, custRes, auditRes, txnRes] = await Promise.all([
        apiClient.getKycRecords(),
        apiClient.getCustomers(),
        apiClient.getAuditLogs(),
        apiClient.getTransactions(),
      ]);
      setKycRecords(kycRes.data || []);
      setCustomers(custRes.data || []);
      setAuditLogs(auditRes.data || []);
      setTransactions(txnRes.data || []);

      // Default selection for transfers
      if (custRes.data && custRes.data.length > 0) {
        if (!transferFrom) setTransferFrom(custRes.data[0].accountNumber);
        if (!transferTo && custRes.data.length > 1) setTransferTo(custRes.data[1].accountNumber);
        if (!cashAccount) setCashAccount(custRes.data[0].accountNumber);
        if (!kycCustomerId) setKycCustomerId(custRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load KYC and Accounts data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setErrorMsg('');
    setTimeout(() => setNotificationMsg(''), 6000);
  };

  const showError = (err) => {
    setErrorMsg(err);
    setTimeout(() => setErrorMsg(''), 6000);
  };

  // 1. Verify / Reject KYC
  const handleVerifyKyc = async (status) => {
    if (!selectedKyc) return;
    try {
      await apiClient.verifyKyc(selectedKyc.id, status, reviewNotes, user?.name);
      showNotification(`KYC record ${selectedKyc.id} for ${selectedKyc.customerName} marked as ${status}. Customer status updated in database.`);
      setSelectedKyc(null);
      setReviewNotes('');
      await loadData();
    } catch (err) {
      showError('Error updating KYC: ' + (err.response?.data?.error || err.message));
    }
  };

  // 2. Create Customer
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!custName || !custEmail) {
      showError('Please enter customer name and email.');
      return;
    }
    try {
      const res = await apiClient.createCustomer({
        name: custName,
        email: custEmail,
        phone: custPhone,
        accountType: custAccountType,
        initialDeposit: custInitialDeposit,
        documentType: custDocType,
        documentNumber: custDocNumber,
        pepStatus: custPep ? 'YES' : 'NO',
        createdBy: user?.name
      });
      const created = res.data.customer;
      const creds = res.data.credentials || {
        userId: created.id,
        username: created.id.toLowerCase(),
        email: created.email,
        accountNumber: created.accountNumber,
        defaultPassword: 'Cust@123',
        role: 'CUSTOMER'
      };

      setCreatedCredentialsModal({
        customer: created,
        credentials: creds
      });

      showNotification(`Customer created! ID: ${created.id} | Account: ${created.accountNumber} | Portal Access: Enabled with password Cust@123`);
      setShowCreateModal(false);
      setCustName('');
      setCustEmail('');
      setCustPhone('');
      setCustDocNumber('');
      setCustInitialDeposit('2500');
      await loadData();
    } catch (err) {
      showError('Failed to create customer: ' + (err.response?.data?.error || err.message));
    }
  };

  // 3. Submit KYC Document
  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    if (!kycCustomerId || !kycDocNumber) {
      showError('Please select a customer and enter document number.');
      return;
    }
    try {
      await apiClient.submitKyc({
        customerId: kycCustomerId,
        documentType: kycDocType,
        documentNumber: kycDocNumber,
        issuingAuthority: kycAuthority,
        submittedBy: user?.name
      });
      showNotification(`KYC document (${kycDocType}: ${kycDocNumber}) successfully submitted and queued for verification.`);
      setShowKycSubmitModal(false);
      setKycDocNumber('');
      await loadData();
    } catch (err) {
      showError('Failed to submit KYC: ' + (err.response?.data?.error || err.message));
    }
  };

  // 4. Money Transfer
  const handleTransferMoney = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);
    if (!amountNum || amountNum <= 0) {
      showError('Please specify a valid transfer amount.');
      return;
    }
    if (transferFrom === transferTo) {
      showError('Source and destination accounts must be different.');
      return;
    }
    try {
      const res = await apiClient.transferMoney({
        fromAccountNumber: transferFrom,
        toAccountNumber: transferTo,
        amount: amountNum,
        channel: transferChannel,
        description: transferDesc,
        executedBy: user?.name
      });
      const txn = res.data.transaction;
      showNotification(`Transfer of $${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })} completed! Txn Ref: ${txn.id}. Sender new balance: $${res.data.senderBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`);
      setShowTransferModal(false);
      setTransferDesc('Account balance transfer');
      await loadData();
    } catch (err) {
      showError('Transfer failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // 5. Cash Deposit / Withdrawal
  const handleCashOperation = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(cashAmount);
    if (!amountNum || amountNum <= 0) {
      showError('Please enter a valid amount.');
      return;
    }
    try {
      if (cashType === 'DEPOSIT') {
        const res = await apiClient.depositMoney({
          accountNumber: cashAccount,
          amount: amountNum,
          depositedBy: user?.name,
          description: cashDesc
        });
        showNotification(`Cash deposit of $${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })} successful! New balance: $${res.data.customer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`);
      } else {
        const res = await apiClient.withdrawMoney({
          accountNumber: cashAccount,
          amount: amountNum,
          withdrawnBy: user?.name,
          description: cashDesc
        });
        showNotification(`Cash withdrawal of $${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })} successful! Remaining balance: $${res.data.customer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`);
      }
      setShowCashModal(false);
      await loadData();
    } catch (err) {
      showError('Operation failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // Filtered KYC
  const filteredKyc = kycRecords.filter((k) => {
    const matchesSearch =
      (k.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.documentNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.customerId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || k.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    return (
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.accountNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      (t.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.fromCustomer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.toCustomer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.fromAccount || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.toAccount || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = txnTypeFilter === 'ALL' || t.type === txnTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered Audit Trail
  const filteredAudit = auditLogs.filter((a) => {
    return (
      (a.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.details || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-box">
          <h1>Customer Accounts, Identity Verification &amp; Money Transactions</h1>
          <p>End-to-End Account Onboarding, Regulatory KYC Processing, Fund Transfers, and Immutable Audit Trail</p>
        </div>

        <div className="page-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {canRegisterCustomer && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={15} />
              <span>Register New Customer</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowKycSubmitModal(true)}
          >
            <Upload size={15} />
            <span>Submit KYC Document</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ background: '#2563eb' }}
            onClick={() => setShowTransferModal(true)}
          >
            <ArrowRightLeft size={15} />
            <span>Transfer Funds</span>
          </button>

          {canPerformCashOp && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowCashModal(true)}
            >
              <DollarSign size={15} />
              <span>Counter Deposit / Withdraw</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notificationMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: 20 }}>
          <CheckCircle size={18} color="#10b981" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.9rem', marginBottom: 20 }}>
          <AlertCircle size={18} color="#ef4444" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'kyc' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('kyc')}
        >
          <UserCheck size={16} />
          <span>KYC Verification ({kycRecords.length})</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('customers')}
        >
          <Users size={16} />
          <span>Customer Directory ({customers.length})</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('transactions')}
        >
          <ArrowRightLeft size={16} />
          <span>Ledger Transactions ({transactions.length})</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('audit')}
        >
          <History size={16} />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'rbac' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rbac')}
        >
          <Shield size={16} />
          <span>Access Control Matrix (RBAC)</span>
        </button>
      </div>

      {/* TAB 1: KYC VERIFICATION */}
      {activeTab === 'kyc' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Regulatory Identity &amp; KYC Verification Queue</h2>
              <div className="card-subtitle">
                Official identity verification workflows with biometric, passport, and National ID processing
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search customer, document..."
                  className="form-control"
                  style={{ width: 220, paddingLeft: 32, fontSize: '0.82rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: 140, fontSize: '0.82rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>KYC Reference</th>
                  <th>Customer Name &amp; ID</th>
                  <th>Document Type</th>
                  <th>Document Number</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Assigned Reviewer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKyc.map((rec) => (
                  <tr key={rec.id}>
                    <td className="cell-mono" style={{ color: '#60a5fa' }}>
                      {rec.id}
                    </td>
                    <td className="cell-primary">
                      {rec.customerName}
                      <span className="cell-sub">{rec.customerId}</span>
                    </td>
                    <td>
                      <span className="badge badge-purple">{rec.documentType}</span>
                    </td>
                    <td className="cell-mono">{rec.documentNumber}</td>
                    <td className="cell-sub">{rec.submittedAt || rec.submissionDate || '2026-09-05'}</td>
                    <td>
                      {rec.status === 'VERIFIED' && (
                        <span className="badge badge-success">VERIFIED</span>
                      )}
                      {rec.status === 'PENDING' && (
                        <span className="badge badge-warning">PENDING</span>
                      )}
                      {rec.status === 'REJECTED' && (
                        <span className="badge badge-danger">REJECTED</span>
                      )}
                    </td>
                    <td className="cell-sub">{rec.reviewedBy || 'Unassigned'}</td>
                    <td>
                      {canReviewKyc ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedKyc(rec);
                            setReviewNotes(rec.notes || '');
                          }}
                        >
                          Review &amp; Verify
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedKyc(rec);
                            setReviewNotes(rec.notes || '');
                          }}
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredKyc.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No KYC verification records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Institutional Customer Directory &amp; Accounts</h2>
              <div className="card-subtitle">
                Core banking accounts, risk scores, live balances, and compliance standings
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search name, account, email..."
                  className="form-control"
                  style={{ width: 240, paddingLeft: 32, fontSize: '0.82rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {canRegisterCustomer && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={14} />
                  <span>New Customer</span>
                </button>
              )}
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Full Name</th>
                  <th>Account Number</th>
                  <th>Account Type</th>
                  <th>Email Address</th>
                  <th>KYC Status</th>
                  <th>Total Balance</th>
                  <th>Risk Tier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td className="cell-mono" style={{ color: '#60a5fa' }}>{cust.id}</td>
                    <td className="cell-primary">
                      {cust.name}
                      <span className="cell-sub">{cust.phone}</span>
                    </td>
                    <td className="cell-mono">{cust.accountNumber}</td>
                    <td className="cell-sub">{cust.accountType}</td>
                    <td className="cell-sub">{cust.email}</td>
                    <td>
                      {cust.kycStatus === 'VERIFIED' ? (
                        <span className="badge badge-success">VERIFIED</span>
                      ) : cust.kycStatus === 'REJECTED' ? (
                        <span className="badge badge-danger">REJECTED</span>
                      ) : (
                        <span className="badge badge-warning">PENDING</span>
                      )}
                    </td>
                    <td className="cell-primary" style={{ color: '#10b981', fontWeight: 600 }}>
                      ${(cust.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge ${cust.riskLevel === 'HIGH' ? 'badge-danger' : cust.riskLevel === 'MEDIUM' ? 'badge-warning' : 'badge-success'}`}>
                        {cust.riskLevel || 'LOW'} ({cust.riskScore || 25})
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                          onClick={() => {
                            setTransferFrom(cust.accountNumber);
                            setShowTransferModal(true);
                          }}
                        >
                          Transfer
                        </button>
                        {cust.kycStatus !== 'VERIFIED' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                            onClick={() => {
                              setKycCustomerId(cust.id);
                              setShowKycSubmitModal(true);
                            }}
                          >
                            Submit KYC
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LEDGER TRANSACTIONS & TRANSFERS */}
      {activeTab === 'transactions' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Core Banking Transaction Ledger</h2>
              <div className="card-subtitle">
                Complete financial movement journal including transfers, counter deposits, repayments, and settlements
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Filter by ref, customer, account..."
                  className="form-control"
                  style={{ width: 220, paddingLeft: 32, fontSize: '0.82rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: 150, fontSize: '0.82rem' }}
                value={txnTypeFilter}
                onChange={(e) => setTxnTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="TRANSFER">Transfers</option>
                <option value="DEPOSIT">Deposits</option>
                <option value="WITHDRAWAL">Withdrawals</option>
                <option value="LOAN_EMI">Loan EMIs</option>
                <option value="SETTLEMENT">Settlements</option>
              </select>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowTransferModal(true)}
              >
                <ArrowRightLeft size={14} />
                <span>New Transfer</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Txn Reference</th>
                  <th>Type</th>
                  <th>Source / Sender</th>
                  <th>Destination / Recipient</th>
                  <th>Amount</th>
                  <th>Channel</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => {
                  const isCredit = txn.type === 'DEPOSIT' || txn.type === 'SETTLEMENT';
                  const isDebit = txn.type === 'WITHDRAWAL' || txn.type === 'LOAN_EMI';
                  return (
                    <tr key={txn.id}>
                      <td className="cell-mono cell-primary">{txn.id}</td>
                      <td>
                        <span className={`badge ${
                          txn.type === 'TRANSFER'
                            ? 'badge-purple'
                            : txn.type === 'DEPOSIT'
                            ? 'badge-success'
                            : txn.type === 'WITHDRAWAL'
                            ? 'badge-danger'
                            : txn.type === 'LOAN_EMI'
                            ? 'badge-blue'
                            : 'badge-warning'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td>
                        <div className="cell-primary">{txn.fromCustomer || 'System Account'}</div>
                        <div className="cell-mono cell-sub">{txn.fromAccount}</div>
                      </td>
                      <td>
                        <div className="cell-primary">{txn.toCustomer || 'Beneficiary'}</div>
                        <div className="cell-mono cell-sub">{txn.toAccount}</div>
                      </td>
                      <td style={{
                        fontWeight: 600,
                        color: isCredit ? '#10b981' : isDebit ? '#ef4444' : '#60a5fa'
                      }}>
                        {isCredit ? '+' : isDebit ? '-' : ''}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                          {txn.channel}
                        </span>
                      </td>
                      <td className="cell-sub" style={{ fontSize: '0.78rem' }}>
                        {txn.timestamp}
                      </td>
                      <td>
                        <span className="badge badge-success">COMPLETED</span>
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No financial transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Immutable User Operation Audit Trail</h2>
              <div className="card-subtitle">
                Comprehensive cryptographic activity trail tracking all system operations with SHA-256 hash chaining
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Filter audit actions, users..."
                className="form-control"
                style={{ width: 240, paddingLeft: 32, fontSize: '0.82rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Block #</th>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action Type</th>
                  <th>Operation Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudit.map((log) => (
                  <tr key={log.index || log.id}>
                    <td className="cell-mono" style={{ color: '#60a5fa' }}>#{log.index}</td>
                    <td className="cell-sub" style={{ fontSize: '0.78rem' }}>
                      {log.timestamp}
                    </td>
                    <td className="cell-primary">{log.user}</td>
                    <td>
                      <span className="badge badge-blue">{log.role}</span>
                    </td>
                    <td className="cell-mono" style={{ color: '#a78bfa', fontWeight: 600 }}>
                      {log.action}
                    </td>
                    <td style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{log.details}</td>
                    <td>
                      <span className="badge badge-success">COMMITTED</span>
                    </td>
                  </tr>
                ))}
                {filteredAudit.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No audit log entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Role-Based Access Control (RBAC) Matrix</h2>
              <div className="card-subtitle">
                Segregation of duties across executive, supervisory, teller, auditor, and customer domains
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Functional Operation</th>
                  <th>ADMIN</th>
                  <th>SUPERVISOR</th>
                  <th>TELLER</th>
                  <th>AUDITOR</th>
                  <th>CUSTOMER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cell-primary">Customer Account Onboarding</td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-warning">Read Only</span></td>
                  <td><span className="badge badge-danger">Restricted</span></td>
                </tr>
                <tr>
                  <td className="cell-primary">KYC Document Approval / Rejection</td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-blue">Intake Only</span></td>
                  <td><span className="badge badge-warning">Read Only</span></td>
                  <td><span className="badge badge-blue">Submit Own</span></td>
                </tr>
                <tr>
                  <td className="cell-primary">Fund Transfers &amp; Account Movements</td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-warning">Audit Only</span></td>
                  <td><span className="badge badge-success">Authorized (Self)</span></td>
                </tr>
                <tr>
                  <td className="cell-primary">Cash Counter Deposits / Withdrawals</td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Full Service</span></td>
                  <td><span className="badge badge-warning">Audit Only</span></td>
                  <td><span className="badge badge-danger">Restricted</span></td>
                </tr>
                <tr>
                  <td className="cell-primary">Loan Repayment Collection &amp; Servicing</td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-warning">Read Only</span></td>
                  <td><span className="badge badge-success">Pay Own EMI</span></td>
                </tr>
                <tr>
                  <td className="cell-primary">AML / PEP Regulatory Signoff</td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-blue">Submit Only</span></td>
                  <td><span className="badge badge-warning">Read Only</span></td>
                  <td><span className="badge badge-danger">Restricted</span></td>
                </tr>
                <tr>
                  <td className="cell-primary">SHA-256 Ledger Integrity Verification</td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-success">Authorized</span></td>
                  <td><span className="badge badge-danger">Restricted</span></td>
                  <td><span className="badge badge-success">Full Audit</span></td>
                  <td><span className="badge badge-danger">Restricted</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: REGISTER NEW CUSTOMER */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3>Register New Customer &amp; Open Account</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Maya Lin"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="e.g. maya.lin@example.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+1 (555) 234-5678"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <select
                    className="form-control"
                    value={custAccountType}
                    onChange={(e) => setCustAccountType(e.target.value)}
                  >
                    <option value="Premium Savings">Premium Savings</option>
                    <option value="Corporate Checking">Corporate Checking</option>
                    <option value="Commercial Trade Account">Commercial Trade Account</option>
                    <option value="Wealth Management Trust">Wealth Management Trust</option>
                    <option value="Standard Business">Standard Business</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Opening Deposit ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={custInitialDeposit}
                    onChange={(e) => setCustInitialDeposit(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Identity Document Type</label>
                  <select
                    className="form-control"
                    value={custDocType}
                    onChange={(e) => setCustDocType(e.target.value)}
                  >
                    <option value="Passport">Passport</option>
                    <option value="National ID Card">National ID Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Consular Identity">Consular Identity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Document Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. USA-9912048"
                    value={custDocNumber}
                    onChange={(e) => setCustDocNumber(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={custPep}
                      onChange={(e) => setCustPep(e.target.checked)}
                    />
                    <span>Flag as Politically Exposed Person (PEP) / Higher Risk Profile</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  <span>Create Customer &amp; Generate Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1.5: NEW CUSTOMER LOGIN CREDENTIALS PRESENTATION */}
      {createdCredentialsModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 500, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: 8, borderRadius: 8, color: '#10b981' }}>
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#10b981' }}>Customer Account &amp; Login Ready</h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Client portal credentials successfully provisioned</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCreatedCredentialsModal(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '8px 0' }}>
              <div style={{ background: '#0b162f', border: '1px solid #1e293b', borderRadius: 8, padding: '14px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Customer Legal Name</span>
                  <span style={{ fontSize: '0.86rem', color: '#f8fafc', fontWeight: 600 }}>{createdCredentialsModal.customer.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Account Number</span>
                  <code style={{ fontSize: '0.84rem', color: '#60a5fa' }}>{createdCredentialsModal.customer.accountNumber}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Customer ID / Login ID</span>
                  <code style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 700 }}>{createdCredentialsModal.credentials.userId}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Registered Email</span>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{createdCredentialsModal.credentials.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Initial Temporary Password</span>
                  <code style={{ fontSize: '0.88rem', color: '#4ade80', fontWeight: 700, background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: 4 }}>
                    {createdCredentialsModal.credentials.defaultPassword}
                  </code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Authorized Role</span>
                  <span className="badge badge-blue">CUSTOMER (Client Portal)</span>
                </div>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#bfdbfe', marginBottom: 16 }}>
                💡 <strong>Customer Login Instructions:</strong> The customer can navigate to <code>/login</code> and authenticate using either their <strong>Customer ID ({createdCredentialsModal.credentials.userId})</strong> or <strong>Email ({createdCredentialsModal.credentials.email})</strong> with password <strong>Cust@123</strong>.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setCreatedCredentialsModal(null)}
                >
                  <CheckCircle size={16} />
                  <span>Acknowledge &amp; Complete Onboarding</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT KYC DOCUMENT */}
      {showKycSubmitModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Submit Identity Verification Document</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowKycSubmitModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitKyc}>
              <div className="form-group">
                <label className="form-label">Target Customer</label>
                <select
                  className="form-control"
                  value={kycCustomerId}
                  onChange={(e) => setKycCustomerId(e.target.value)}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) - KYC: {c.kycStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Document Type</label>
                <select
                  className="form-control"
                  value={kycDocType}
                  onChange={(e) => setKycDocType(e.target.value)}
                >
                  <option value="Passport">International Passport</option>
                  <option value="National ID Card">National ID Card</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Proof of Address">Proof of Address / Utility</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Document / Serial Number *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. DOC-77881923"
                  value={kycDocNumber}
                  onChange={(e) => setKycDocNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issuing Authority</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Department of State"
                  value={kycAuthority}
                  onChange={(e) => setKycAuthority(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowKycSubmitModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Upload size={16} />
                  <span>Submit for Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MONEY TRANSFER */}
      {showTransferModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>Transfer Money / Funds Movement</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowTransferModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferMoney}>
              <div className="form-group">
                <label className="form-label">Source Account (Debit)</label>
                <select
                  className="form-control"
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.accountNumber}>
                      {c.name} · {c.accountNumber} (Available: ${(c.balance || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Destination Account (Credit)</label>
                <select
                  className="form-control"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.accountNumber}>
                      {c.name} · {c.accountNumber} ({c.accountType})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Transfer Amount ($) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    className="form-control"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Transfer Channel</label>
                  <select
                    className="form-control"
                    value={transferChannel}
                    onChange={(e) => setTransferChannel(e.target.value)}
                  >
                    <option value="INTERNAL_TRANSFER">Internal Core Banking</option>
                    <option value="RTGS">RTGS Real-Time Settlement</option>
                    <option value="NEFT">NEFT Interbank Transfer</option>
                    <option value="WIRE">FedWire Commercial</option>
                    <option value="SWIFT">SWIFT International</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Memo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Consulting payment, invoice clearance"
                  value={transferDesc}
                  onChange={(e) => setTransferDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTransferModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb' }}>
                  <Send size={16} />
                  <span>Execute Money Transfer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CASH DEPOSIT / WITHDRAWAL */}
      {showCashModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Over-the-Counter Branch Cash Service</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCashModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCashOperation}>
              <div className="form-group">
                <label className="form-label">Operation Type</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className={`btn ${cashType === 'DEPOSIT' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setCashType('DEPOSIT')}
                  >
                    <Download size={15} /> Cash Deposit
                  </button>
                  <button
                    type="button"
                    className={`btn ${cashType === 'WITHDRAWAL' ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setCashType('WITHDRAWAL')}
                  >
                    <Upload size={15} /> Cash Withdrawal
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Customer Account</label>
                <select
                  className="form-control"
                  value={cashAccount}
                  onChange={(e) => setCashAccount(e.target.value)}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.accountNumber}>
                      {c.name} · {c.accountNumber} (Balance: ${(c.balance || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount ($) *</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  className="form-control"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teller Note / Reference</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. In-person branch counter transaction"
                  value={cashDesc}
                  onChange={(e) => setCashDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCashModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={`btn ${cashType === 'DEPOSIT' ? 'btn-primary' : 'btn-danger'}`}>
                  <CheckCircle size={16} />
                  <span>Confirm {cashType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC REVIEW MODAL */}
      {selectedKyc && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>KYC Identity Review: {selectedKyc.customerName}</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedKyc(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <div className="stat-title">Customer ID</div>
                <div className="cell-mono">{selectedKyc.customerId}</div>
              </div>
              <div>
                <div className="stat-title">Current Status</div>
                <div>
                  <span className={`badge ${selectedKyc.status === 'VERIFIED' ? 'badge-success' : selectedKyc.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>
                    {selectedKyc.status}
                  </span>
                </div>
              </div>
              <div>
                <div className="stat-title">Document Type</div>
                <div className="cell-primary">{selectedKyc.documentType}</div>
              </div>
              <div>
                <div className="stat-title">Document Number</div>
                <div className="cell-mono">{selectedKyc.documentNumber}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reviewer Notes &amp; Observations</label>
              <textarea
                className="form-control"
                rows="3"
                value={reviewNotes}
                disabled={!canReviewKyc}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter regulatory verification notes, matching against identity databases..."
              />
            </div>

            {canReviewKyc ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleVerifyKyc('REJECTED')}
                >
                  <XCircle size={16} />
                  <span>Reject KYC Document</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleVerifyKyc('VERIFIED')}
                >
                  <CheckCircle size={16} />
                  <span>Approve &amp; Verify Document</span>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'right', marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedKyc(null)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
