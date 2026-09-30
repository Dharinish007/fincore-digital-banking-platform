import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateUserModal } from '../../components/modals/CreateUserModal';
import {
  UserCog,
  Plus,
  Search,
  Shield,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Mail,
  ShieldAlert,
} from 'lucide-react';

export const UserManagementView = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/milestone1/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/milestone1/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, performedBy: currentUser?.username || 'admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: 'success', text: `Role updated to ${newRole} for user.` });
        setTimeout(() => setActionMessage(null), 4000);
        fetchUsers();
      } else {
        setActionMessage({ type: 'danger', text: data.message || 'Failed to update user role' });
        setTimeout(() => setActionMessage(null), 5000);
      }
    } catch (e) {
      setActionMessage({ type: 'danger', text: e.message || 'Network error' });
      setTimeout(() => setActionMessage(null), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBlockUser = async (user) => {
    const isCurrentlyBlocked = user.status === 'BLOCKED' || user.status === 'SUSPENDED';
    const targetStatus = isCurrentlyBlocked ? 'ACTIVE' : 'BLOCKED';

    setUpdatingId(user.id);
    try {
      const res = await fetch(`/api/milestone1/users/${user.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          performedBy: currentUser?.username || 'admin',
          reason: targetStatus === 'BLOCKED' ? 'Blocked by Bank Administrator' : 'Reactivated by Bank Administrator',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({
          type: targetStatus === 'BLOCKED' ? 'warning' : 'success',
          text: `User ${user.username} has been ${targetStatus === 'BLOCKED' ? 'BLOCKED' : 'UNBLOCKED & ACTIVATED'} successfully.`,
        });
        setTimeout(() => setActionMessage(null), 5000);
        fetchUsers();
      } else {
        setActionMessage({ type: 'danger', text: data.message || 'Failed to update user status' });
        setTimeout(() => setActionMessage(null), 5000);
      }
    } catch (e) {
      setActionMessage({ type: 'danger', text: e.message || 'Network error' });
      setTimeout(() => setActionMessage(null), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (u.name || '').toLowerCase().includes(s) ||
      (u.username || '').toLowerCase().includes(s) ||
      (u.email || '').toLowerCase().includes(s);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'BLOCKED' && (u.status === 'BLOCKED' || u.status === 'SUSPENDED')) ||
      u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Executive Security Header */}
      <div className="card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 22, 34, 0.95))',
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
                <UserCog size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  User Security & Access Control
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Manage bank personnel, role authorizations, and enforce immediate account blocking
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={fetchUsers}
              className="btn btn-secondary btn-sm"
              title="Refresh User List"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} />
              <span>Provision User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`badge ${actionMessage.type === 'success' ? 'badge-success' : 'badge-warning'}`}
          style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {actionMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Bank Admin</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="TELLER">Cashier / Teller</option>
              <option value="AUDITOR">Auditor / Compliance</option>
              <option value="CUSTOMER">Retail Customer</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Users</option>
              <option value="BLOCKED">Blocked / Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role & Authorization</th>
                <th>Account Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Security Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isBlocked = u.status === 'BLOCKED' || u.status === 'SUSPENDED';
                  const isCurrent = currentUser?.id === u.id || currentUser?.username === u.username;

                  return (
                    <tr key={u.id} style={{ backgroundColor: isBlocked ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isBlocked ? 'var(--danger-bg)' : 'var(--bg-secondary)',
                            color: isBlocked ? 'var(--danger)' : 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            border: `1px solid ${isBlocked ? 'var(--danger-border)' : 'var(--border-color)'}`
                          }}>
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {u.name} {isCurrent && <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>You</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              @{u.username} &bull; {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <select
                          value={u.role}
                          disabled={updatingId === u.id || isCurrent}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="form-control"
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            width: '130px',
                            backgroundColor: 'var(--bg-card)'
                          }}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPERVISOR">SUPERVISOR</option>
                          <option value="TELLER">TELLER</option>
                          <option value="AUDITOR">AUDITOR</option>
                          <option value="CUSTOMER">CUSTOMER</option>
                        </select>
                      </td>

                      <td>
                        {isBlocked ? (
                          <span className="badge badge-danger">
                            <Lock size={12} />
                            <span>BLOCKED</span>
                          </span>
                        ) : (
                          <span className="badge badge-success">
                            <CheckCircle2 size={12} />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </td>

                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Never'}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {isBlocked ? (
                            <button
                              onClick={() => handleBlockUser(u)}
                              disabled={updatingId === u.id || isCurrent}
                              className="btn btn-success btn-sm"
                              title="Unblock User Access"
                            >
                              <Unlock size={14} />
                              <span>Unblock User</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlockUser(u)}
                              disabled={updatingId === u.id || isCurrent}
                              className="btn btn-danger btn-sm"
                              title="Block User from Banking System"
                            >
                              <Lock size={14} />
                              <span>Block User</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setShowCreateModal(false);
          fetchUsers();
          setActionMessage({ type: 'success', text: 'New user provisioned successfully.' });
          setTimeout(() => setActionMessage(null), 4000);
        }}
      />
    </div>
  );
};
