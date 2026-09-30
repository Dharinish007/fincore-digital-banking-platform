import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { safeFetchJson } from '../../utils/api';
import {
  Banknote,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  UserPlus,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Wallet,
  Receipt,
  Printer,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { CreateCustomerModal } from '../../components/modals/CreateCustomerModal';
import { OpenAccountModal } from '../../components/modals/OpenAccountModal';
import { SubmitKycModal } from '../../components/modals/SubmitKycModal';

export const TellerDeskView = () => {
  const { user } = useAuth();

  // Search & Selected Account State
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Counter Operation Type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'
  const [operationType, setOperationType] = useState('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [destAccount, setDestAccount] = useState('');
  const [opLoading, setOpLoading] = useState(false);
  const [opSuccess, setOpSuccess] = useState(null);
  const [opError, setOpError] = useState('');

  // Daily Counter Journal
  const [recentTxns, setRecentTxns] = useState([]);

  // Modals
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  const fetchTellerData = async () => {
    try {
      const [accRes, custRes, txnRes] = await Promise.all([
        safeFetchJson('/api/core/accounts'),
        safeFetchJson('/api/core/customers'),
        safeFetchJson('/api/transactions?limit=10'),
      ]);

      const accData = accRes.data || {};
      const custData = custRes.data || {};
      const txnData = txnRes.data || {};

      if (accData.success) {
        setAccounts(accData.accounts || []);
        if (!selectedAccount && accData.accounts.length > 0) {
          setSelectedAccount(accData.accounts[0]);
        } else if (selectedAccount) {
          const updated = accData.accounts.find((a) => a.id === selectedAccount.id);
          if (updated) setSelectedAccount(updated);
        }
      }
      if (custData.success) setCustomers(custData.customers || []);
      if (txnData.success) setRecentTxns(txnData.transactions || []);
    } catch {
      // Handled gracefully with fallback data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTellerData();
  }, []);

  const filteredAccounts = accounts.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.accountNumber || '').toLowerCase().includes(q) ||
      (a.customerName || '').toLowerCase().includes(q) ||
      (a.customerId || '').toLowerCase().includes(q)
    );
  });

  const handleExecuteOperation = async (e) => {
    e.preventDefault();
    setOpError('');
    setOpSuccess(null);

    if (!selectedAccount) {
      setOpError('Please select a customer account first.');
      return;
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setOpError('Please specify a positive monetary sum.');
      return;
    }

    if (operationType === 'WITHDRAW' && selectedAccount.balance < val) {
      setOpError(`Insufficient funds. Maximum available: ₹${Number(selectedAccount.balance).toLocaleString('en-IN')}`);
      return;
    }

    if (operationType === 'TRANSFER' && !destAccount.trim()) {
      setOpError('Please specify destination beneficiary account number.');
      return;
    }

    setOpLoading(true);
    try {
      let endpoint = '/api/core/deposits';
      let payload = {
        accountNumber: selectedAccount.accountNumber,
        amount: val,
        description: notes || `Counter Cash ${operationType} by Teller ${user?.name || user?.username}`,
        performedBy: user?.username || 'teller',
      };

      if (operationType === 'WITHDRAW') {
        endpoint = '/api/core/withdrawals';
      } else if (operationType === 'TRANSFER') {
        endpoint = '/api/core/transfers';
        payload = {
          sourceAccountNumber: selectedAccount.accountNumber,
          destinationAccountNumber: destAccount.trim(),
          amount: val,
          description: notes || `Counter Transfer by Teller ${user?.name || user?.username}`,
          performedBy: user?.username || 'teller',
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setOpSuccess({
          type: operationType,
          amount: val,
          accountNumber: selectedAccount.accountNumber,
          txId: data.transaction?.id || `TX-${Math.floor(Math.random() * 900000 + 100000)}`,
          newBalance: data.account?.balance || (operationType === 'DEPOSIT' ? selectedAccount.balance + val : selectedAccount.balance - val),
          time: new Date().toLocaleTimeString('en-IN'),
        });
        setAmount('');
        setNotes('');
        setDestAccount('');
        fetchTellerData();
      } else {
        setOpError(data.message || 'Counter operation declined by banking engine.');
      }
    } catch (err) {
      setOpError(err.message || 'Network exception communicating with core service.');
    } finally {
      setOpLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(16, 22, 34, 0.95))',
        borderColor: 'var(--border-light)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
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
                <Banknote size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Teller Counter & Cashier Desk
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Cash deposits, cash withdrawals, customer lookup, and instant account servicing
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowCreateCustomerModal(true)} className="btn btn-secondary btn-sm">
              <UserPlus size={14} />
              <span>New Customer</span>
            </button>
            <button onClick={() => setShowOpenAccountModal(true)} className="btn btn-secondary btn-sm">
              <CreditCard size={14} />
              <span>Open Account</span>
            </button>
            <button onClick={() => setShowKycModal(true)} className="btn btn-primary btn-sm">
              <ShieldCheck size={14} />
              <span>Submit KYC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Counter Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Account Search & Customer Directory */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Find Customer Account</h3>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search account #, customer name, ID..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            {filteredAccounts.map((a) => {
              const isSelected = selectedAccount?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAccount(a)}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.customerName}</div>
                    <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>{a.accountType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{a.accountNumber}</span>
                    <strong style={{ color: 'var(--success)' }}>₹{Number(a.balance).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Counter Execution Panel */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cash & Counter Servicing</h2>
              {selectedAccount ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Selected: <strong style={{ color: 'var(--text-primary)' }}>{selectedAccount.customerName}</strong> ({selectedAccount.accountNumber})
                </p>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Select an account from the left list to proceed</p>
              )}
            </div>

            {selectedAccount && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Balance</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
                  ₹{Number(selectedAccount.balance).toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>

          {/* Operation Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setOperationType('DEPOSIT')}
              className={`btn ${operationType === 'DEPOSIT' ? 'btn-success' : 'btn-secondary'} btn-sm`}
            >
              <ArrowDownLeft size={14} />
              <span>Cash Deposit</span>
            </button>
            <button
              type="button"
              onClick={() => setOperationType('WITHDRAW')}
              className={`btn ${operationType === 'WITHDRAW' ? 'btn-danger' : 'btn-secondary'} btn-sm`}
            >
              <ArrowUpRight size={14} />
              <span>Cash Withdrawal</span>
            </button>
            <button
              type="button"
              onClick={() => setOperationType('TRANSFER')}
              className={`btn ${operationType === 'TRANSFER' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              <Send size={14} />
              <span>Inter-Account Transfer</span>
            </button>
          </div>

          {opSuccess && (
            <div className="badge badge-success" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <CheckCircle2 size={16} />
                <span>Operation Executed Successfully</span>
              </div>
              <div style={{ fontSize: '0.8125rem' }}>
                ₹{opSuccess.amount.toLocaleString('en-IN')} {opSuccess.type} &bull; New Balance: ₹{Number(opSuccess.newBalance).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Txn Ref: {opSuccess.txId}</div>
            </div>
          )}

          {opError && (
            <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{opError}</span>
            </div>
          )}

          <form onSubmit={handleExecuteOperation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {operationType === 'TRANSFER' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Beneficiary Destination Account #</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ACC-49201938"
                  value={destAccount}
                  onChange={(e) => setDestAccount(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Transaction Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="any"
                className="form-control"
                placeholder="e.g. 10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Teller Remarks / Voucher Note</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Cash Counter Deposit, Cheque #092144"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={opLoading || !selectedAccount}
              className={`btn ${operationType === 'DEPOSIT' ? 'btn-success' : operationType === 'WITHDRAW' ? 'btn-danger' : 'btn-primary'} btn-lg`}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {opLoading ? 'Executing Transaction...' : `Confirm ${operationType}`}
            </button>
          </form>
        </div>
      </div>

      {/* Modals */}
      <CreateCustomerModal
        isOpen={showCreateCustomerModal}
        onClose={() => setShowCreateCustomerModal(false)}
        onCreated={fetchTellerData}
      />

      <OpenAccountModal
        isOpen={showOpenAccountModal}
        onClose={() => setShowOpenAccountModal(false)}
        customers={customers}
        onCreated={fetchTellerData}
      />

      <SubmitKycModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        customers={customers}
        onSuccess={fetchTellerData}
      />
    </div>
  );
};
