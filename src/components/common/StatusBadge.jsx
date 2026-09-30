import React from 'react';

export const StatusBadge = ({ status, className = '', size = 'md' }) => {
  const normalized = (status || '').toUpperCase();

  let badgeType = 'badge-neutral';

  if (['VERIFIED', 'SUCCESS', 'COMPLETED', 'ACTIVE', 'STANDARD', 'DELIVERED', 'PAID'].includes(normalized)) {
    badgeType = 'badge-success';
  } else if (['UNDER_REVIEW', 'PROCESSING', 'SMA', 'SMA-0', 'SMA-1', 'SMA-2', 'PARTIALLY_PAID', 'DUE', 'SENT'].includes(normalized)) {
    badgeType = 'badge-warning';
  } else if (['REJECTED', 'FAILED', 'NPA', 'OVERDUE', 'DEFAULTED', 'FROZEN', 'SUSPENDED', 'INACTIVE'].includes(normalized)) {
    badgeType = 'badge-danger';
  } else if (['COMPENSATED', 'REVERSED', 'COMPENSATING'].includes(normalized)) {
    badgeType = 'badge-info';
  } else if (['PENDING', 'UPCOMING', 'INITIATED', 'APPLIED', 'LOW'].includes(normalized)) {
    badgeType = 'badge-info';
  } else if (['HIGH', 'CRITICAL'].includes(normalized)) {
    badgeType = 'badge-danger';
  } else if (['MEDIUM'].includes(normalized)) {
    badgeType = 'badge-warning';
  }

  const paddingStyle = size === 'sm' ? { padding: '0.15rem 0.5rem', fontSize: '0.6875rem' } : {};

  return (
    <span
      className={`badge ${badgeType} ${className}`}
      style={paddingStyle}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }} />
      {normalized.replace(/_/g, ' ')}
    </span>
  );
};
