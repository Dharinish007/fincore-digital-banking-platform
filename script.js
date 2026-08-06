/* ==========================================================================
   FinCore Nexus — Application Logic
   ========================================================================== */
 
const state = {
  section: 'dashboard',
  sidebarCollapsed: false,
  notifications: [],
  audit: {
    logs: [],
    filtered: [],
    search: '',
    statusFilter: 'all',
    sortKey: 'timestamp',
    sortDir: 'desc',
    view: 'table',
    liveTimer: null,
    idCounter: 0,
  },
};
 
/* ---------------------------------------------------------------------- */
/* Utility helpers                                                        */
/* ---------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
 
function fmtTime(d) {
  return d.toLocaleTimeString('en-US', { hour12: false });
}
function fmtDateTime(d) {
  return d.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
function timeAgo(d) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}
function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function fmtMoney(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
 
/* ---------------------------------------------------------------------- */
/* Toasts                                                                  */
/* ---------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const stack = $('#toastStack');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = {
    success: '<path d="M20 6 9 17l-5-5"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
    warn: '<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.2h17.8a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  };
  el.innerHTML = `<svg viewBox="0 0 24 24">${icons[type] || icons.info}</svg><span>${escapeHtml(message)}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 200);
  }, 3600);
}
 
/* ---------------------------------------------------------------------- */
/* Modal                                                                   */
/* ---------------------------------------------------------------------- */
function openModal(html) {
  $('#modalRoot').innerHTML = html;
  $('#modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  $('#modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
$('#modalOverlay').addEventListener('click', (e) => {
  if (e.target === $('#modalOverlay')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
 
function confirmDialog({ title, message, confirmLabel = 'Confirm', danger = true, onConfirm }) {
  openModal(`
    <div class="modal-head"><h3>${escapeHtml(title)}</h3>
      <button class="modal-close" data-close><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="confirm-icon"><svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.2h17.8a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z"/></svg></div>
      <p style="margin:0; color:var(--text-primary); font-size:13.5px; line-height:1.5;">${message}</p>
    </div>
    <div class="modal-foot">
      <button class="btn" data-close>Cancel</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="confirmActionBtn">${escapeHtml(confirmLabel)}</button>
    </div>
  `);
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  $('#confirmActionBtn').addEventListener('click', () => {
    closeModal();
    onConfirm && onConfirm();
  });
}
 
/* ---------------------------------------------------------------------- */
/* Top bar: dropdowns                                                      */
/* ---------------------------------------------------------------------- */
function seedNotifications() {
  state.notifications = [
    { type: 'danger', text: 'Suspicious login attempt detected for user jsmith02 from unrecognized device.', time: new Date(Date.now() - 4 * 60000) },
    { type: 'warn', text: 'Large transaction of $18,400 flagged for manual review on Account 4471-2290.', time: new Date(Date.now() - 22 * 60000) },
    { type: 'info', text: 'Nightly batch reconciliation completed successfully.', time: new Date(Date.now() - 96 * 60000) },
  ];
}
function renderNotifications() {
  const list = $('#notifList');
  $('#notifCount').textContent = state.notifications.length;
  $('#notifCount').style.display = state.notifications.length ? 'flex' : 'none';
  if (!state.notifications.length) {
    list.innerHTML = `<div class="notif-empty">You're all caught up.</div>`;
    return;
  }
  const icons = {
    danger: '<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.2h17.8a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z"/>',
    warn: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  };
  list.innerHTML = state.notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon ${n.type}"><svg viewBox="0 0 24 24">${icons[n.type]}</svg></div>
      <div>
        <div class="notif-text">${escapeHtml(n.text)}</div>
        <div class="notif-time">${timeAgo(n.time)}</div>
      </div>
    </div>
  `).join('');
}
 
function toggleDropdown(menuEl, btnEl) {
  const isOpen = menuEl.classList.contains('open');
  $$('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  if (!isOpen) menuEl.classList.add('open');
}
 
$('#notifBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  renderNotifications();
  toggleDropdown($('#notifMenu'), $('#notifBtn'));
});
$('#userBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  toggleDropdown($('#userMenu'), $('#userBtn'));
});
document.addEventListener('click', () => $$('.dropdown-menu.open').forEach(m => m.classList.remove('open')));
$('#clearNotifs').addEventListener('click', (e) => {
  e.stopPropagation();
  state.notifications = [];
  renderNotifications();
  showToast('Notifications cleared', 'success');
});
$('#logoutBtn').addEventListener('click', () => {
  confirmDialog({
    title: 'Log out of FinCore Nexus?',
    message: 'You will need to re-authenticate with your teller credentials to access the console again.',
    confirmLabel: 'Log out',
    onConfirm: () => showToast('You have been logged out.', 'success'),
  });
});
$$('.dropdown-item[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
    showToast(btn.dataset.action === 'profile' ? 'Opening teller profile…' : 'Opening preferences…', 'info');
  });
});
 
/* Sidebar collapse toggle */
$('#sidebarToggle').addEventListener('click', () => {
  const sb = $('#sidebar');
  if (window.innerWidth <= 900) {
    sb.classList.toggle('mobile-open');
  } else {
    sb.classList.toggle('collapsed');
  }
});
 
/* Global search (top bar) */
$('#globalSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim();
  if (state.section === 'audit') {
    $('#auditSearchInput') && ($('#auditSearchInput').value = q);
    state.audit.search = q.toLowerCase();
    applyAuditFilters();
  }
});
$('#globalSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    if (state.section !== 'audit') {
      navigateTo('audit');
      setTimeout(() => {
        $('#auditSearchInput').value = e.target.value;
        state.audit.search = e.target.value.toLowerCase();
        applyAuditFilters();
      }, 50);
    }
  }
});
 
/* ---------------------------------------------------------------------- */
/* Navigation                                                              */
/* ---------------------------------------------------------------------- */
function navigateTo(section) {
  state.section = section;
  $$('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.section === section));
  stopLiveAudit();
  const renderers = {
    dashboard: renderDashboard,
    accounts: renderAccounts,
    loans: renderLoans,
    payments: renderPayments,
    kyc: renderKyc,
    audit: renderAudit,
    settings: renderSettings,
  };
  (renderers[section] || renderDashboard)();
  $('#mainContent').scrollTop = 0;
  if (window.innerWidth <= 900) $('#sidebar').classList.remove('mobile-open');
}
$$('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.section));
});
 
/* ---------------------------------------------------------------------- */
/* Dashboard (matches reference design)                                    */
/* ---------------------------------------------------------------------- */
function renderDashboard() {
  $('#mainContent').innerHTML = `
    <div class="section-fade">
      <h1 class="page-title">Core Banking Operations</h1>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Active Accounts</div>
          <div class="stat-value" id="statAccounts">2.4M</div>
          <div class="stat-sub">Savings + Current</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Transactions/Day</div>
          <div class="stat-value" id="statTxns">12.4M</div>
          <div class="stat-sub">Real-time</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Uptime</div>
          <div class="stat-value" id="statUptime">99.99%</div>
          <div class="stat-sub">SLA</div>
        </div>
      </div>
 
      <div class="panel">
        <div class="panel-title">Account Service - Core Banking</div>
        <div class="kv-line"><b>Account:</b> 1234-5678-9012 <span class="kv-sep">|</span> <b>Type:</b> Savings <span class="kv-sep">|</span> <b>Balance:</b> $12,847.50</div>
        <div class="kv-line"><b>Customer:</b> John Smith <span class="kv-sep">|</span> <b>KYC:</b> <span class="badge badge-green">Verified</span> <span class="kv-sep">|</span> <b>Risk:</b> <span class="badge badge-green">Low</span></div>
        <div class="kv-line"><b>Transaction:</b> Deposit $2,400 <span class="kv-sep">|</span> Kafka Event Published</div>
        <div class="kv-line"><b>PostgreSQL:</b> ACID commit <span class="kv-sep">|</span> <b>Redis:</b> Balance cached</div>
        <div class="kv-line"><b>Microservice:</b> Account Service <span class="kv-sep">|</span> <b>Latency:</b> 47ms</div>
        <div class="kv-line"><b>Audit:</b> Logged to Audit DB <span class="kv-sep">|</span> Immutable</div>
        <div class="action-row">
          <button class="btn" id="btnViewStatement">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/></svg>
            View Statement
          </button>
          <button class="btn btn-primary" id="btnTransfer">
            <svg viewBox="0 0 24 24"><path d="M17 3 21 7l-4 4"/><path d="M21 7H9a5 5 0 0 0-5 5"/><path d="M7 21 3 17l4-4"/><path d="M3 17h12a5 5 0 0 0 5-5"/></svg>
            Transfer
          </button>
          <button class="btn btn-danger" id="btnFreeze">
            <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            Freeze Account
          </button>
        </div>
      </div>
    </div>
  `;
 
  // Live-updating stat counters
  animateCounter('statTxns', 12.4, 'M');
  $('#btnViewStatement').addEventListener('click', () => openStatementModal());
  $('#btnTransfer').addEventListener('click', () => openTransferModal());
  $('#btnFreeze').addEventListener('click', () => {
    confirmDialog({
      title: 'Freeze this account?',
      message: 'Account <b>1234-5678-9012</b> (John Smith) will be immediately restricted from all withdrawals and transfers. This action is logged to the immutable audit trail.',
      confirmLabel: 'Freeze Account',
      onConfirm: () => {
        showToast('Account 1234-5678-9012 has been frozen.', 'success');
        pushLiveNotification('danger', 'Account 1234-5678-9012 frozen by Bank Teller (Priya Raman).');
        addManualAuditEntry({ user: 'p.raman', action: 'Freeze Account', status: 'suspicious' });
      },
    });
  });
}
 
function animateCounter(id, base) {
  const el = document.getElementById(id);
  if (!el) return;
  let n = base;
  const timer = setInterval(() => {
    if (!document.getElementById(id)) { clearInterval(timer); return; }
    n += (Math.random() - 0.4) * 0.01;
    el.textContent = n.toFixed(1) + 'M';
  }, 2500);
}
 
function openStatementModal() {
  openModal(`
    <div class="modal-head"><h3>Account Statement — 1234-5678-9012</h3>
      <button class="modal-close" data-close><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="detail-grid">
        <div class="detail-item"><div class="lbl">Customer</div><div class="val">John Smith</div></div>
        <div class="detail-item"><div class="lbl">Account Type</div><div class="val">Savings</div></div>
        <div class="detail-item"><div class="lbl">Current Balance</div><div class="val">$12,847.50</div></div>
        <div class="detail-item"><div class="lbl">Status</div><div class="val"><span class="badge badge-green">Active</span></div></div>
      </div>
      <div class="modal-subhead">Recent Transactions</div>
      <table class="mini-table">
        <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Balance</th></tr></thead>
        <tbody>
          <tr><td>Aug 03</td><td>Deposit</td><td style="color:#4ade80">+$2,400.00</td><td>$12,847.50</td></tr>
          <tr><td>Aug 01</td><td>ATM Withdrawal</td><td style="color:#f87171">-$300.00</td><td>$10,447.50</td></tr>
          <tr><td>Jul 29</td><td>Payroll Credit</td><td style="color:#4ade80">+$4,120.00</td><td>$10,747.50</td></tr>
          <tr><td>Jul 24</td><td>Electricity Bill</td><td style="color:#f87171">-$142.30</td><td>$6,627.50</td></tr>
        </tbody>
      </table>
    </div>
    <div class="modal-foot">
      <button class="btn" data-close>Close</button>
      <button class="btn btn-primary" id="downloadStmt">Download PDF</button>
    </div>
  `);
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  $('#downloadStmt').addEventListener('click', () => {
    showToast('Statement PDF generated.', 'success');
    closeModal();
  });
}
 
function openTransferModal() {
  openModal(`
    <div class="modal-head"><h3>Transfer Funds</h3>
      <button class="modal-close" data-close><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div class="modal-body">
      <p style="font-size:13px;color:var(--text-secondary);margin-top:0;">From Account <b style="color:var(--text-primary)">1234-5678-9012</b> · Available: $12,847.50</p>
      <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px;">Recipient account number</label>
      <input id="tfDest" type="text" placeholder="e.g. 9981-2200-4471" style="width:100%;padding:9px 12px;margin-bottom:14px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:#fff;font-size:13px;">
      <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px;">Amount (USD)</label>
      <input id="tfAmount" type="number" placeholder="0.00" style="width:100%;padding:9px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:#fff;font-size:13px;">
    </div>
    <div class="modal-foot">
      <button class="btn" data-close>Cancel</button>
      <button class="btn btn-primary" id="submitTransfer">Confirm Transfer</button>
    </div>
  `);
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  $('#submitTransfer').addEventListener('click', () => {
    const dest = $('#tfDest').value.trim();
    const amt = parseFloat($('#tfAmount').value);
    if (!dest || !amt || amt <= 0) { showToast('Enter a valid recipient and amount.', 'error'); return; }
    closeModal();
    showToast(`Transfer of ${fmtMoney(amt)} to ${dest} submitted.`, 'success');
    if (amt >= 10000) {
      pushLiveNotification('warn', `Large transfer of ${fmtMoney(amt)} flagged for review.`);
      addManualAuditEntry({ user: 'p.raman', action: `Transfer ${fmtMoney(amt)}`, status: 'suspicious' });
    } else {
      addManualAuditEntry({ user: 'p.raman', action: `Transfer ${fmtMoney(amt)}`, status: 'success' });
    }
  });
}
 
/* ---------------------------------------------------------------------- */
/* Generic interactive placeholder sections                                */
/* ---------------------------------------------------------------------- */
function renderPlaceholderSection({ title, subtitle, rows, statCards }) {
  $('#mainContent').innerHTML = `
    <div class="section-fade">
      <h1 class="page-title">${title}</h1>
      ${statCards ? `<div class="stat-grid">${statCards.map(c => `
        <div class="stat-card">
          <div class="stat-label">${c.label}</div>
          <div class="stat-value">${c.value}</div>
          <div class="stat-sub ${c.cls || ''}">${c.sub}</div>
        </div>`).join('')}</div>` : ''}
      <div class="panel">
        <div class="panel-title">${subtitle}</div>
        <div class="placeholder-list" id="phList">
          ${rows.map((r, idx) => `
            <div class="ph-row" data-idx="${idx}">
              <div class="ph-main">
                <div class="ph-title">${escapeHtml(r.title)}</div>
                <div class="ph-sub">${escapeHtml(r.sub)}</div>
              </div>
              <span class="badge badge-${r.badgeColor}">${escapeHtml(r.badge)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;
  $$('#phList .ph-row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = row.dataset.idx;
      const r = rows[idx];
      openModal(`
        <div class="modal-head"><h3>${escapeHtml(r.title)}</h3>
          <button class="modal-close" data-close><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div class="modal-body">
          <p style="font-size:13.5px;color:var(--text-secondary);line-height:1.6;">${escapeHtml(r.detail || r.sub)}</p>
          <div class="skeleton" style="width:100%;margin-top:10px;"></div>
          <div class="skeleton" style="width:80%;margin-top:8px;"></div>
          <div class="skeleton" style="width:60%;margin-top:8px;"></div>
        </div>
        <div class="modal-foot"><button class="btn btn-primary" data-close>Close</button></div>
      `);
      $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
    });
  });
}
 
function renderAccounts() {
  renderPlaceholderSection({
    title: 'Accounts',
    subtitle: 'Customer Accounts',
    statCards: [
      { label: 'Total Accounts', value: '2.4M', sub: '+1,204 today', cls: 'green' },
      { label: 'Savings', value: '1.6M', sub: '66.7% of total' },
      { label: 'Current', value: '812K', sub: '33.3% of total' },
      { label: 'Dormant', value: '48K', sub: 'Needs review', cls: 'yellow' },
    ],
    rows: [
      { title: '1234-5678-9012 · John Smith', sub: 'Savings · Balance $12,847.50', badge: 'Active', badgeColor: 'green', detail: 'Full account profile, KYC status, and transaction history for John Smith.' },
      { title: '4471-2290-8834 · Maria Chen', sub: 'Current · Balance $58,220.10', badge: 'Active', badgeColor: 'green', detail: 'Full account profile, KYC status, and transaction history for Maria Chen.' },
      { title: '9981-1120-7743 · Robert Diaz', sub: 'Savings · Balance $402.11', badge: 'Dormant', badgeColor: 'yellow', detail: 'No activity for 182 days. Flagged for dormancy review.' },
      { title: '2201-9987-1156 · Aisha Khan', sub: 'Current · Balance -$120.00', badge: 'Overdrawn', badgeColor: 'red', detail: 'Account is overdrawn. Overdraft protection has been applied.' },
    ],
  });
}
function renderLoans() {
  renderPlaceholderSection({
    title: 'Loans',
    subtitle: 'Loan Portfolio',
    statCards: [
      { label: 'Active Loans', value: '184K', sub: 'Across all products' },
      { label: 'Disbursed (MTD)', value: '$42.1M', sub: '+6.2% MoM', cls: 'green' },
      { label: 'Delinquency Rate', value: '2.3%', sub: 'Within target', cls: 'green' },
      { label: 'Pending Approval', value: '312', sub: 'Awaiting review', cls: 'yellow' },
    ],
    rows: [
      { title: 'Home Loan · LN-88213', sub: 'Applicant: Neha Verma · $210,000 requested', badge: 'Pending', badgeColor: 'yellow', detail: 'Home loan application under underwriting review.' },
      { title: 'Auto Loan · LN-77120', sub: 'Applicant: Sam Okafor · $28,500 approved', badge: 'Approved', badgeColor: 'green', detail: 'Auto loan approved, disbursal scheduled.' },
      { title: 'Personal Loan · LN-90044', sub: 'Applicant: Wei Zhang · Missed payment', badge: 'Delinquent', badgeColor: 'red', detail: 'Payment 14 days overdue. Collections notified.' },
    ],
  });
}
function renderPayments() {
  renderPlaceholderSection({
    title: 'Payments',
    subtitle: 'Payment Rails',
    statCards: [
      { label: 'Processed Today', value: '3.1M', sub: 'Real-time' },
      { label: 'Failed Payments', value: '412', sub: '0.013% failure rate', cls: 'red' },
      { label: 'Avg Settlement', value: '1.8s', sub: 'p99: 4.2s' },
      { label: 'Chargebacks', value: '38', sub: 'Under review', cls: 'yellow' },
    ],
    rows: [
      { title: 'ACH Batch #88213', sub: '14,220 payments · $8.2M total', badge: 'Settled', badgeColor: 'green' },
      { title: 'Wire Transfer #WT-4471', sub: '$220,000 · Beneficiary bank pending', badge: 'Pending', badgeColor: 'yellow' },
      { title: 'Card Payment #CP-90211', sub: 'Declined — insufficient funds', badge: 'Failed', badgeColor: 'red' },
    ],
  });
}
function renderKyc() {
  renderPlaceholderSection({
    title: 'KYC',
    subtitle: 'Know Your Customer Queue',
    statCards: [
      { label: 'Verified', value: '2.1M', sub: '87.5% of base', cls: 'green' },
      { label: 'Pending Review', value: '4,802', sub: 'Avg 1.2 days', cls: 'yellow' },
      { label: 'High Risk Flags', value: '96', sub: 'Escalated', cls: 'red' },
      { label: 'Rejected (30d)', value: '211', sub: 'Documentation issues' },
    ],
    rows: [
      { title: 'John Smith · CUST-10021', sub: 'Documents verified · Risk: Low', badge: 'Verified', badgeColor: 'green' },
      { title: 'Elena Popescu · CUST-33921', sub: 'ID mismatch detected', badge: 'Rejected', badgeColor: 'red' },
      { title: 'Tariq Hassan · CUST-58210', sub: 'Awaiting proof of address', badge: 'Pending', badgeColor: 'yellow' },
    ],
  });
}
function renderSettings() {
  $('#mainContent').innerHTML = `
    <div class="section-fade">
      <h1 class="page-title">Settings</h1>
      <div class="panel">
        <div class="panel-title">Console Preferences</div>
        <div class="placeholder-list">
          <div class="ph-row" id="setTheme"><div class="ph-main"><div class="ph-title">Theme</div><div class="ph-sub">Dark (system default for teller console)</div></div><span class="badge badge-green">Enabled</span></div>
          <div class="ph-row" id="setAlerts"><div class="ph-main"><div class="ph-title">Suspicious activity alerts</div><div class="ph-sub">Push a notification when high-risk actions are detected</div></div><span class="badge badge-green" id="alertBadge">On</span></div>
          <div class="ph-row" id="set2fa"><div class="ph-main"><div class="ph-title">Two-factor authentication</div><div class="ph-sub">Required for freeze / block actions</div></div><span class="badge badge-green">Enforced</span></div>
          <div class="ph-row" id="setSession"><div class="ph-main"><div class="ph-title">Session timeout</div><div class="ph-sub">Auto-logout after inactivity</div></div><span class="badge badge-yellow">15 min</span></div>
        </div>
      </div>
    </div>
  `;
  $('#setAlerts').addEventListener('click', () => {
    const badge = $('#alertBadge');
    const on = badge.textContent === 'On';
    badge.textContent = on ? 'Off' : 'On';
    badge.className = 'badge ' + (on ? 'badge-red' : 'badge-green');
    showToast(`Suspicious activity alerts turned ${on ? 'off' : 'on'}.`, 'success');
  });
  $('#setTheme').addEventListener('click', () => showToast('Light theme is not available for the teller console.', 'warn'));
  $('#set2fa').addEventListener('click', () => showToast('Two-factor authentication is enforced by branch policy.', 'info'));
  $('#setSession').addEventListener('click', () => showToast('Contact your branch admin to change session policy.', 'info'));
}
 
/* ---------------------------------------------------------------------- */
/* AUDIT TRAIL — full system                                               */
/* ---------------------------------------------------------------------- */
const AUDIT_USERS = [
  { user: 'j.smith', name: 'John Smith', account: '1234-5678-9012', balance: 12847.50, kyc: 'Verified', risk: 'Low' },
  { user: 'm.chen', name: 'Maria Chen', account: '4471-2290-8834', balance: 58220.10, kyc: 'Verified', risk: 'Low' },
  { user: 'r.diaz', name: 'Robert Diaz', account: '9981-1120-7743', balance: 402.11, kyc: 'Pending', risk: 'Medium' },
  { user: 'a.khan', name: 'Aisha Khan', account: '2201-9987-1156', balance: -120.00, kyc: 'Verified', risk: 'Medium' },
  { user: 'w.zhang', name: 'Wei Zhang', account: '3390-4471-2201', balance: 9820.44, kyc: 'Verified', risk: 'Low' },
  { user: 't.hassan', name: 'Tariq Hassan', account: '5521-9012-6634', balance: 220.00, kyc: 'Pending', risk: 'High' },
  { user: 'e.popescu', name: 'Elena Popescu', account: '7712-3341-9820', balance: 1500.00, kyc: 'Rejected', risk: 'High' },
  { user: 'p.raman', name: 'Priya Raman', account: 'STAFF-0417', balance: 0, kyc: 'Verified', risk: 'Low' },
];
const AUDIT_ACTIONS = [
  { action: 'Login Success', status: 'success' },
  { action: 'Login Failed', status: 'suspicious' },
  { action: 'View Account', status: 'success' },
  { action: 'Update Profile', status: 'success' },
  { action: 'Deposit $250.00', status: 'success' },
  { action: 'Withdraw $18,400.00', status: 'suspicious' },
  { action: 'Transfer $12,000.00', status: 'suspicious' },
  { action: 'Transfer $80.00', status: 'success' },
  { action: 'Password Reset', status: 'pending' },
  { action: 'KYC Document Upload', status: 'pending' },
  { action: 'Freeze Account', status: 'suspicious' },
  { action: 'Card Blocked', status: 'success' },
  { action: 'Multiple Failed Logins', status: 'suspicious' },
];
const DEVICES = ['Chrome / Windows 11', 'Safari / iOS 18', 'Edge / Windows 10', 'Firefox / macOS', 'Teller Terminal T-04', 'Mobile App Android'];
const LOCATIONS = ['Chennai, IN', 'Mumbai, IN', 'Bengaluru, IN', 'Delhi, IN', 'Singapore, SG', 'Unknown / VPN'];
 
function randomIp() { return `${randInt(10, 223)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`; }
 
function generateLog(forceSuspicious) {
  const u = randChoice(AUDIT_USERS);
  let a = randChoice(AUDIT_ACTIONS);
  if (forceSuspicious) {
    a = randChoice(AUDIT_ACTIONS.filter(x => x.status === 'suspicious'));
  }
  const loc = randChoice(LOCATIONS);
  state.audit.idCounter += 1;
  return {
    id: state.audit.idCounter,
    timestamp: new Date(),
    user: u.user,
    userInfo: u,
    action: a.action,
    status: a.status,
    ip: randomIp(),
    device: randChoice(DEVICES),
    location: loc,
    isNew: true,
  };
}
 
function seedAuditLogs() {
  const now = Date.now();
  state.audit.idCounter = 0;
  state.audit.logs = Array.from({ length: 28 }, (_, i) => {
    const log = generateLog(Math.random() < 0.22);
    log.timestamp = new Date(now - i * randInt(30000, 240000));
    log.isNew = false;
    return log;
  }).sort((a, b) => b.timestamp - a.timestamp);
}
 
function statusBadge(status) {
  const map = {
    success: '<span class="badge badge-green"><span class="badge-dot-sm"></span>Success</span>',
    pending: '<span class="badge badge-yellow"><span class="badge-dot-sm"></span>Pending</span>',
    suspicious: '<span class="badge badge-red"><span class="badge-dot-sm"></span>Suspicious</span>',
  };
  return map[status] || map.success;
}
 
function renderAudit() {
  $('#mainContent').innerHTML = `
    <div class="section-fade">
      <div class="timeline-toggle-row">
        <h1 class="page-title" style="margin:0;">Audit Trail</h1>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="live-tag"><span class="pulse-dot"></span>Live</span>
          <div class="view-switch">
            <button data-view="table" class="active">Table</button>
            <button data-view="timeline">Timeline</button>
          </div>
        </div>
      </div>
 
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-label">Total Logs</div><div class="stat-value" id="auStatTotal">0</div><div class="stat-sub">Last 24 hours</div></div>
        <div class="stat-card"><div class="stat-label">Suspicious Activity</div><div class="stat-value" id="auStatSuspicious">0</div><div class="stat-sub red">Needs attention</div></div>
        <div class="stat-card"><div class="stat-label">Active Users</div><div class="stat-value" id="auStatUsers">0</div><div class="stat-sub green">Currently sessioned</div></div>
        <div class="stat-card"><div class="stat-label">Failed Logins</div><div class="stat-value" id="auStatFailed">0</div><div class="stat-sub yellow">Monitor closely</div></div>
      </div>
 
      <div class="audit-toolbar">
        <div class="audit-search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="auditSearchInput" placeholder="Filter logs by user, action, IP, location…" />
        </div>
        <select class="chip-select" id="statusFilterSelect">
          <option value="all">All statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="suspicious">Suspicious</option>
        </select>
        <select class="chip-select" id="userFilterSelect">
          <option value="all">All users</option>
          ${AUDIT_USERS.map(u => `<option value="${u.user}">${u.name}</option>`).join('')}
        </select>
        <button class="btn btn-sm" id="btnSortDate">
          <svg viewBox="0 0 24 24"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
          Sort by Date
        </button>
        <button class="btn btn-sm" id="btnExportCsv">
          <svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>
          Export CSV
        </button>
        <button class="btn btn-sm" id="btnExportPdf">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          Export PDF
        </button>
      </div>
 
      <div id="auditViewContainer"></div>
    </div>
  `;
 
  seedAuditLogs();
  applyAuditFilters();
  startLiveAudit();
 
  $$('.view-switch button').forEach(b => b.addEventListener('click', () => {
    $$('.view-switch button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    state.audit.view = b.dataset.view;
    renderAuditView();
  }));
 
  $('#auditSearchInput').addEventListener('input', (e) => {
    state.audit.search = e.target.value.toLowerCase();
    applyAuditFilters();
  });
  $('#statusFilterSelect').addEventListener('change', (e) => {
    state.audit.statusFilter = e.target.value;
    applyAuditFilters();
  });
  $('#userFilterSelect').addEventListener('change', (e) => {
    state.audit.userFilter = e.target.value;
    applyAuditFilters();
  });
  $('#btnSortDate').addEventListener('click', () => {
    state.audit.sortDir = state.audit.sortDir === 'desc' ? 'asc' : 'desc';
    applyAuditFilters();
    showToast(`Sorted by date (${state.audit.sortDir === 'desc' ? 'newest first' : 'oldest first'})`, 'info');
  });
  $('#btnExportCsv').addEventListener('click', exportAuditCsv);
  $('#btnExportPdf').addEventListener('click', exportAuditPdf);
}
 
function applyAuditFilters() {
  let logs = [...state.audit.logs];
  const { search, statusFilter, userFilter, sortDir } = state.audit;
 
  if (search) {
    logs = logs.filter(l =>
      l.user.toLowerCase().includes(search) ||
      l.userInfo.name.toLowerCase().includes(search) ||
      l.action.toLowerCase().includes(search) ||
      l.ip.includes(search) ||
      l.location.toLowerCase().includes(search) ||
      l.device.toLowerCase().includes(search)
    );
  }
  if (statusFilter && statusFilter !== 'all') logs = logs.filter(l => l.status === statusFilter);
  if (userFilter && userFilter !== 'all') logs = logs.filter(l => l.user === userFilter);
 
  logs.sort((a, b) => sortDir === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
 
  state.audit.filtered = logs;
  renderAuditView();
  updateAuditStats();
}
 
function updateAuditStats() {
  const logs = state.audit.logs;
  const totalEl = $('#auStatTotal');
  if (!totalEl) return;
  totalEl.textContent = logs.length;
  $('#auStatSuspicious').textContent = logs.filter(l => l.status === 'suspicious').length;
  $('#auStatUsers').textContent = new Set(logs.map(l => l.user)).size;
  $('#auStatFailed').textContent = logs.filter(l => l.action === 'Login Failed' || l.action === 'Multiple Failed Logins').length;
}
 
function renderAuditView() {
  const container = $('#auditViewContainer');
  if (!container) return;
  if (state.audit.view === 'table') {
    renderAuditTable(container);
  } else {
    renderAuditTimeline(container);
  }
}
 
function renderAuditTable(container) {
  const logs = state.audit.filtered;
  container.innerHTML = `
    <div class="audit-table-wrap">
      <table class="audit-table">
        <thead>
          <tr>
            <th data-key="timestamp">Timestamp</th>
            <th data-key="user">User</th>
            <th data-key="action">Action</th>
            <th data-key="status">Status</th>
            <th>IP Address</th>
            <th>Device</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody id="auditTbody">
          ${logs.length ? logs.map(l => `
            <tr class="${l.status === 'suspicious' ? 'row-suspicious' : ''} ${l.isNew ? 'row-new' : ''}" data-id="${l.id}">
              <td class="mono">${fmtDateTime(l.timestamp)}</td>
              <td><div class="user-cell"><span class="avatar">${l.userInfo.name.split(' ').map(x => x[0]).join('')}</span>${l.userInfo.name}</div></td>
              <td>${escapeHtml(l.action)}</td>
              <td>${statusBadge(l.status)}</td>
              <td class="mono">${l.ip}</td>
              <td>${escapeHtml(l.device)}</td>
              <td>${escapeHtml(l.location)}</td>
            </tr>
          `).join('') : `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted);">No logs match your filters.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  $$('#auditTbody tr[data-id]').forEach(row => {
    row.addEventListener('click', () => {
      const log = state.audit.logs.find(l => l.id == row.dataset.id);
      if (log) openAuditDetailModal(log);
    });
  });
  $$('.audit-table thead th[data-key]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      state.audit.sortKey = key;
      state.audit.filtered.sort((a, b) => {
        if (key === 'timestamp') return state.audit.sortDir === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
        return state.audit.sortDir === 'desc' ? (b[key] > a[key] ? 1 : -1) : (a[key] > b[key] ? 1 : -1);
      });
      renderAuditView();
    });
  });
  setTimeout(() => $$('#auditTbody tr.row-new').forEach(r => r.classList.remove('row-new')), 900);
}
 
function renderAuditTimeline(container) {
  const logs = state.audit.filtered.slice(0, 40);
  const dotColor = { success: 'green', pending: 'yellow', suspicious: 'red' };
  container.innerHTML = `
    <div class="panel">
      <div class="timeline">
        ${logs.map(l => `
          <div class="timeline-item">
            <div class="timeline-dot ${dotColor[l.status]}"></div>
            <div class="timeline-time">${fmtDateTime(l.timestamp)}</div>
            <div class="timeline-text"><b>${escapeHtml(l.userInfo.name)}</b> — ${escapeHtml(l.action)} ${statusBadge(l.status)}</div>
          </div>
        `).join('') || '<p style="color:var(--text-muted)">No activity to show.</p>'}
      </div>
    </div>
  `;
}
 
function openAuditDetailModal(log) {
  const u = log.userInfo;
  const recentTxns = [
    { d: 'Aug 03', desc: 'Deposit', amt: '+$2,400.00' },
    { d: 'Aug 01', desc: 'ATM Withdrawal', amt: '-$300.00' },
    { d: 'Jul 29', desc: 'Payroll Credit', amt: '+$4,120.00' },
  ];
  const logins = [
    { t: fmtDateTime(log.timestamp), ip: log.ip, dev: log.device, loc: log.location, st: log.status },
    { t: fmtDateTime(new Date(log.timestamp - 86400000)), ip: randomIp(), dev: randChoice(DEVICES), loc: randChoice(LOCATIONS), st: 'success' },
  ];
  openModal(`
    <div class="modal-head">
      <h3>${escapeHtml(u.name)} ${log.status === 'suspicious' ? '<span class="badge badge-red" style="margin-left:8px;">Flagged</span>' : ''}</h3>
      <button class="modal-close" data-close><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="detail-grid">
        <div class="detail-item"><div class="lbl">Account Number</div><div class="val">${u.account}</div></div>
        <div class="detail-item"><div class="lbl">Balance</div><div class="val">${fmtMoney(u.balance)}</div></div>
        <div class="detail-item"><div class="lbl">KYC Status</div><div class="val"><span class="badge badge-${u.kyc === 'Verified' ? 'green' : u.kyc === 'Pending' ? 'yellow' : 'red'}">${u.kyc}</span></div></div>
        <div class="detail-item"><div class="lbl">Risk Level</div><div class="val"><span class="badge badge-${u.risk === 'Low' ? 'green' : u.risk === 'Medium' ? 'yellow' : 'red'}">${u.risk}</span></div></div>
        <div class="detail-item"><div class="lbl">Last Action</div><div class="val">${escapeHtml(log.action)}</div></div>
        <div class="detail-item"><div class="lbl">Status</div><div class="val">${statusBadge(log.status)}</div></div>
      </div>
 
      <div class="modal-subhead">Recent Transactions</div>
      <table class="mini-table">
        <thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
        <tbody>${recentTxns.map(t => `<tr><td>${t.d}</td><td>${t.desc}</td><td style="color:${t.amt[0] === '+' ? '#4ade80' : '#f87171'}">${t.amt}</td></tr>`).join('')}</tbody>
      </table>
 
      <div class="modal-subhead">Login History</div>
      <table class="mini-table">
        <thead><tr><th>Time</th><th>IP</th><th>Device</th><th>Location</th></tr></thead>
        <tbody>${logins.map(l => `<tr><td class="mono">${l.t}</td><td class="mono">${l.ip}</td><td>${l.dev}</td><td>${l.loc}</td></tr>`).join('')}</tbody>
      </table>
    </div>
    <div class="modal-foot">
      <button class="btn btn-danger" id="modalBlockBtn">Block User</button>
      <button class="btn btn-danger" id="modalFreezeBtn">Freeze Account</button>
      <button class="btn btn-primary" data-close>Close</button>
    </div>
  `);
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  $('#modalFreezeBtn').addEventListener('click', () => {
    confirmDialog({
      title: `Freeze account ${u.account}?`,
      message: `This will immediately block all transactions for <b>${escapeHtml(u.name)}</b>. This action is recorded in the audit trail.`,
      confirmLabel: 'Freeze Account',
      onConfirm: () => {
        showToast(`Account ${u.account} frozen.`, 'success');
        addManualAuditEntry({ user: u.user, action: 'Freeze Account', status: 'suspicious', userInfo: u });
      },
    });
  });
  $('#modalBlockBtn').addEventListener('click', () => {
    confirmDialog({
      title: `Block user ${u.name}?`,
      message: `<b>${escapeHtml(u.name)}</b> will be immediately signed out and prevented from logging in until an administrator restores access.`,
      confirmLabel: 'Block User',
      onConfirm: () => {
        showToast(`User ${u.name} has been blocked.`, 'success');
        addManualAuditEntry({ user: u.user, action: 'User Blocked', status: 'suspicious', userInfo: u });
      },
    });
  });
}
 
function addManualAuditEntry({ user, action, status, userInfo }) {
  state.audit.idCounter += 1;
  const info = userInfo || AUDIT_USERS.find(u => u.user === user) || AUDIT_USERS[0];
  const entry = {
    id: state.audit.idCounter,
    timestamp: new Date(),
    user,
    userInfo: info,
    action,
    status,
    ip: randomIp(),
    device: 'Teller Terminal T-04',
    location: 'Chennai, IN',
    isNew: true,
  };
  state.audit.logs.unshift(entry);
  if (status === 'suspicious') pushLiveNotification('danger', `${info.name}: ${action}`);
  if (state.section === 'audit') applyAuditFilters();
}
 
function startLiveAudit() {
  stopLiveAudit();
  state.audit.liveTimer = setInterval(() => {
    const forceSuspicious = Math.random() < 0.18;
    const log = generateLog(forceSuspicious);
    state.audit.logs.unshift(log);
    if (state.audit.logs.length > 250) state.audit.logs.pop();
    if (log.status === 'suspicious') {
      pushLiveNotification('danger', `${log.userInfo.name}: ${log.action} detected from ${log.location}.`);
    }
    applyAuditFilters();
  }, 6000);
}
function stopLiveAudit() {
  if (state.audit.liveTimer) { clearInterval(state.audit.liveTimer); state.audit.liveTimer = null; }
}
 
function pushLiveNotification(type, text) {
  state.notifications.unshift({ type, text, time: new Date() });
  state.notifications = state.notifications.slice(0, 12);
  if ($('#notifMenu').classList.contains('open')) renderNotifications();
  $('#notifCount').textContent = state.notifications.length;
}
 
function exportAuditCsv() {
  const logs = state.audit.filtered;
  const header = ['Timestamp', 'User', 'Action', 'Status', 'IP Address', 'Device', 'Location'];
  const rows = logs.map(l => [fmtDateTime(l.timestamp), l.userInfo.name, l.action, l.status, l.ip, l.device, l.location]);
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadFile(csv, 'audit-trail.csv', 'text/csv');
  showToast('Audit log exported as CSV.', 'success');
}
function exportAuditPdf() {
  // Lightweight "PDF-like" text export (no external libs available offline)
  const logs = state.audit.filtered;
  const lines = ['FinCore Nexus — Audit Trail Export', new Date().toString(), '', ...logs.map(l =>
    `${fmtDateTime(l.timestamp)} | ${l.userInfo.name} | ${l.action} | ${l.status.toUpperCase()} | ${l.ip} | ${l.device} | ${l.location}`
  )];
  downloadFile(lines.join('\n'), 'audit-trail.pdf', 'application/pdf');
  showToast('Audit log exported as PDF.', 'success');
}
function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
 
/* ---------------------------------------------------------------------- */
/* Init                                                                     */
/* ---------------------------------------------------------------------- */
seedNotifications();
renderNotifications();
navigateTo('dashboard');