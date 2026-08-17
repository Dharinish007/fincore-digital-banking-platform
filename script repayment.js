/* =========================================================
   Secure Digital Banking — Repayment Tracking Module
   Sample data + dynamic logic
========================================================= */

/* ---------- Utilities ---------- */
const fmtCurrency = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

const fmtDate = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const daysBetween = (a, b) => Math.round((a - b) / (1000 * 60 * 60 * 24));

const genTxnId = () => {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const ts = Date.now().toString().slice(-5);
  return `TXN-${ts}${rand}`;
};

const todayRef = new Date(); // "current" date used to evaluate EMI status

/* ---------- Sample Loan Data ---------- */
const loan = {
  loanId: 'LN-2024-88231',
  principal: 600000,
  interestRate: 10.5,
  tenureMonths: 24,
  startDate: new Date(todayRef.getFullYear(), todayRef.getMonth() - 8, 5),
};

function calcEmiAmount(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}
loan.emiAmount = calcEmiAmount(loan.principal, loan.interestRate, loan.tenureMonths);

/* ---------- Generate EMI Schedule ---------- */
let emiSchedule = [];
(function buildSchedule() {
  for (let i = 1; i <= loan.tenureMonths; i++) {
    const dueDate = addMonths(loan.startDate, i);
    emiSchedule.push({
      emiNo: i,
      dueDate,
      amount: loan.emiAmount,
      paidAmount: 0,
      status: 'UPCOMING', // PAID | UPCOMING | OVERDUE | PARTIAL
    });
  }
  // Mark first 8 as paid (simulate history), leave rest dynamic
  emiSchedule.forEach((emi) => {
    if (emi.dueDate < todayRef) {
      emi.status = 'PAID';
      emi.paidAmount = emi.amount;
    }
  });
})();

/* ---------- Repayment History (built from paid EMIs) ---------- */
const methods = ['UPI', 'NET_BANKING', 'DEBIT_CARD', 'AUTO_DEBIT'];
let repaymentHistory = [];
(function buildHistory() {
  emiSchedule
    .filter((e) => e.status === 'PAID')
    .forEach((e, idx) => {
      repaymentHistory.push({
        txnId: genTxnId(),
        date: addMonths(e.dueDate, 0),
        amount: e.paidAmount,
        method: methods[idx % methods.length],
        status: 'SUCCESS',
        emiNo: e.emiNo,
      });
    });
})();

/* ---------- Recompute statuses dynamically ---------- */
function refreshEmiStatuses() {
  emiSchedule.forEach((emi) => {
    if (emi.status === 'PAID' || emi.status === 'PARTIAL_PAID') return;
    if (emi.dueDate < todayRef) {
      emi.status = 'OVERDUE';
    } else {
      emi.status = 'UPCOMING';
    }
  });
}
refreshEmiStatuses();

/* ---------- Derived metrics ---------- */
function getMetrics() {
  const totalLoan = loan.principal * (1 + loan.interestRate / 100 * (loan.tenureMonths / 12));
  const totalPayable = loan.emiAmount * loan.tenureMonths;
  const amountPaid = emiSchedule.reduce((sum, e) => sum + (e.paidAmount || 0), 0);
  const outstanding = Math.max(totalPayable - amountPaid, 0);
  const nextEmi = emiSchedule.find((e) => e.status === 'UPCOMING' || e.status === 'OVERDUE');
  const overdueCount = emiSchedule.filter((e) => e.status === 'OVERDUE').length;
  const paidCount = emiSchedule.filter((e) => e.status === 'PAID').length;
  const percent = Math.min(100, Math.round((amountPaid / totalPayable) * 100));
  return { totalPayable, amountPaid, outstanding, nextEmi, overdueCount, paidCount, percent };
}

function getRisk(metrics) {
  const { overdueCount } = metrics;
  if (overdueCount === 0) return { level: 'LOW', pct: 15, desc: 'All payments on time. Excellent repayment behavior.' };
  if (overdueCount <= 1) return { level: 'MEDIUM', pct: 52, desc: '1 overdue EMI detected. Clear dues to avoid penalty charges.' };
  return { level: 'HIGH', pct: 85, desc: `${overdueCount} overdue EMIs detected. Immediate repayment recommended.` };
}

/* =========================================================
   RENDERING
========================================================= */
function renderLoanDetails() {
  const grid = document.getElementById('loanDetailGrid');
  const items = [
    { label: 'Loan ID', value: loan.loanId },
    { label: 'Loan Amount', value: fmtCurrency(loan.principal) },
    { label: 'Interest Rate', value: `${loan.interestRate}% p.a.` },
    { label: 'EMI Amount', value: fmtCurrency(loan.emiAmount) },
    { label: 'Loan Tenure', value: `${loan.tenureMonths} Months` },
  ];
  grid.innerHTML = items
    .map(
      (it) => `
    <div class="loan-detail-item">
      <div class="ld-label">${it.label}</div>
      <div class="ld-value">${it.value}</div>
    </div>`
    )
    .join('');
}

function renderSummaryCards(metrics) {
  const grid = document.getElementById('summaryGrid');
  const cards = [
    {
      cls: 'sc-total',
      label: 'Total Loan Amount',
      value: fmtCurrency(metrics.totalPayable),
      foot: `Principal ${fmtCurrency(loan.principal)}`,
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 10h18M7 15h2m4 0h4M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      cls: 'sc-paid',
      label: 'Amount Paid',
      value: fmtCurrency(metrics.amountPaid),
      foot: `${metrics.paidCount} of ${loan.tenureMonths} EMIs cleared`,
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      cls: 'sc-outstanding',
      label: 'Outstanding Amount',
      value: fmtCurrency(metrics.outstanding),
      foot: `${loan.tenureMonths - metrics.paidCount} EMIs remaining`,
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      cls: 'sc-next',
      label: 'Next EMI Date',
      value: metrics.nextEmi ? fmtDate(metrics.nextEmi.dueDate) : '—',
      foot: metrics.nextEmi
        ? metrics.nextEmi.status === 'OVERDUE'
          ? 'Payment overdue'
          : `${fmtCurrency(metrics.nextEmi.amount)} due`
        : 'Loan fully repaid',
      icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    },
  ];
  grid.innerHTML = cards
    .map(
      (c) => `
    <div class="summary-card ${c.cls}">
      <div class="sc-top">
        <span class="sc-label">${c.label}</span>
        <span class="sc-icon">${c.icon}</span>
      </div>
      <div class="sc-value">${c.value}</div>
      <div class="sc-foot">${c.foot}</div>
    </div>`
    )
    .join('');
}

function renderProgress(metrics) {
  document.getElementById('progressFill').style.width = metrics.percent + '%';
  document.getElementById('progressPercentLabel').textContent = metrics.percent + '%';
}

function renderRisk(metrics) {
  const risk = getRisk(metrics);
  const badge = document.getElementById('riskLevelBadge');
  badge.textContent = risk.level;
  badge.style.background =
    risk.level === 'LOW' ? 'var(--success-soft)' : risk.level === 'MEDIUM' ? 'var(--warning-soft)' : 'var(--danger-soft)';
  badge.style.color =
    risk.level === 'LOW' ? 'var(--success)' : risk.level === 'MEDIUM' ? 'var(--warning)' : 'var(--danger)';
  document.getElementById('riskMarker').style.left = risk.pct + '%';
  document.getElementById('riskDesc').textContent = risk.desc;
}

function renderAnalytics(metrics) {
  // last 6 EMIs (by number) trend: paid = full bar, overdue = red bar, upcoming = faint bar
  const last6 = emiSchedule.slice(Math.max(0, emiSchedule.length - 10), emiSchedule.length);
  const wrap = document.getElementById('analyticsBars');
  const max = loan.emiAmount;
  wrap.innerHTML = last6
    .map((e) => {
      const heightPct = Math.max(14, Math.round(((e.paidAmount || e.amount * 0.35) / max) * 100));
      const cls = e.status === 'OVERDUE' ? 'analytics-bar overdue-bar' : 'analytics-bar';
      const opacity = e.status === 'UPCOMING' ? '0.35' : '1';
      return `<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%;">
        <div class="${cls}" style="height:${heightPct}%; opacity:${opacity};" title="EMI #${e.emiNo} — ${e.status}"></div>
      </div>`;
    })
    .join('');

  const stats = document.getElementById('analyticsStats');
  const onTimeRate = Math.round((metrics.paidCount / Math.max(1, metrics.paidCount + metrics.overdueCount)) * 100);
  stats.innerHTML = `
    <div class="astat"><div class="a-num">${metrics.paidCount}</div><div class="a-lbl">EMIs Paid</div></div>
    <div class="astat"><div class="a-num">${metrics.overdueCount}</div><div class="a-lbl">Overdue</div></div>
    <div class="astat"><div class="a-num">${onTimeRate}%</div><div class="a-lbl">On-Time Rate</div></div>
  `;
}

function statusBadgeHtml(status) {
  const map = {
    PAID: ['badge-paid', 'Paid'],
    UPCOMING: ['badge-upcoming', 'Upcoming'],
    OVERDUE: ['badge-overdue', 'Overdue'],
    PARTIAL_PAID: ['badge-neutral', 'Partial'],
    SUCCESS: ['badge-paid', 'Success'],
  };
  const [cls, label] = map[status] || ['badge-neutral', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function renderEmiTable() {
  const search = (document.getElementById('emiSearch').value || '').toLowerCase();
  const filter = document.getElementById('emiStatusFilter').value;
  const tbody = document.getElementById('emiTableBody');

  const rows = emiSchedule.filter((e) => {
    const matchesSearch =
      String(e.emiNo).includes(search) || fmtDate(e.dueDate).toLowerCase().includes(search);
    const matchesFilter = filter === 'ALL' || e.status === filter || (filter === 'PAID' && e.status === 'PARTIAL_PAID');
    return matchesSearch && matchesFilter;
  });

  if (!rows.length) {
    tbody.innerHTML = `<tr class="row-empty"><td colspan="5">No EMI records match your search.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (e) => `
    <tr>
      <td class="mono">#${String(e.emiNo).padStart(2, '0')}</td>
      <td>${fmtDate(e.dueDate)}</td>
      <td class="mono">${fmtCurrency(e.amount)}</td>
      <td>${statusBadgeHtml(e.status)}</td>
      <td>
        ${
          e.status === 'PAID'
            ? `<button class="table-btn" disabled>Settled</button>`
            : `<button class="table-btn" data-pay-emi="${e.emiNo}">Pay Now</button>`
        }
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-pay-emi]').forEach((btn) => {
    btn.addEventListener('click', () => openPayModal(Number(btn.dataset.payEmi)));
  });
}

function renderHistoryTable() {
  const search = (document.getElementById('historySearch').value || '').toLowerCase();
  const filter = document.getElementById('historyMethodFilter').value;
  const tbody = document.getElementById('historyTableBody');

  const rows = [...repaymentHistory]
    .sort((a, b) => b.date - a.date)
    .filter((r) => {
      const matchesSearch = r.txnId.toLowerCase().includes(search);
      const matchesFilter = filter === 'ALL' || r.method === filter;
      return matchesSearch && matchesFilter;
    });

  if (!rows.length) {
    tbody.innerHTML = `<tr class="row-empty"><td colspan="5">No transactions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (r) => `
    <tr>
      <td class="mono">${r.txnId}</td>
      <td>${fmtDate(r.date)}</td>
      <td class="mono">${fmtCurrency(r.amount)}</td>
      <td>${r.method.replace('_', ' ')}</td>
      <td>${statusBadgeHtml(r.status)}</td>
    </tr>`
    )
    .join('');
}

/* ---------- Notifications ---------- */
function buildNotifications(metrics) {
  const list = [];
  emiSchedule
    .filter((e) => e.status === 'OVERDUE')
    .forEach((e) => {
      const overdueDays = daysBetween(todayRef, e.dueDate);
      list.push({
        type: 'overdue',
        title: `EMI #${e.emiNo} is overdue`,
        sub: `${fmtCurrency(e.amount)} was due ${fmtDate(e.dueDate)} (${Math.abs(overdueDays)} days ago)`,
      });
    });
  const upcoming = emiSchedule.find((e) => e.status === 'UPCOMING');
  if (upcoming) {
    const daysLeft = daysBetween(upcoming.dueDate, todayRef) * -1;
    list.push({
      type: 'upcoming',
      title: `Upcoming EMI #${upcoming.emiNo} reminder`,
      sub: `${fmtCurrency(upcoming.amount)} due on ${fmtDate(upcoming.dueDate)} (in ${daysLeft} days)`,
    });
  }
  if (metrics.percent === 100) {
    list.push({ type: 'success', title: 'Loan fully repaid', sub: 'Congratulations — all EMIs are cleared.' });
  }
  return list;
}

function renderNotifications() {
  const metrics = getMetrics();
  const items = buildNotifications(metrics);
  const list = document.getElementById('notifList');
  const dot = document.getElementById('notifDot');

  dot.classList.toggle('show', items.some((i) => i.type === 'overdue'));

  if (!items.length) {
    list.innerHTML = `<div class="notif-empty">You're all caught up — no pending notifications.</div>`;
    return;
  }

  const icons = {
    overdue:
      '<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.3 2.25h17.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a1.5 1.5 0 0 0-2.6 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    upcoming:
      '<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>',
    success:
      '<svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  list.innerHTML = items
    .map(
      (i) => `
    <div class="notif-item ${i.type}">
      <div class="ni-icon">${icons[i.type]}</div>
      <div>
        <p class="ni-title">${i.title}</p>
        <p class="ni-sub">${i.sub}</p>
      </div>
    </div>`
    )
    .join('');
}

/* ---------- Master re-render ---------- */
function renderAll() {
  refreshEmiStatuses();
  const metrics = getMetrics();
  renderLoanDetails();
  renderSummaryCards(metrics);
  renderProgress(metrics);
  renderRisk(metrics);
  renderAnalytics(metrics);
  renderEmiTable();
  renderHistoryTable();
  renderNotifications();

  const loanBadge = document.getElementById('loanStatusBadge');
  if (metrics.percent === 100) {
    loanBadge.textContent = 'Loan Closed';
    loanBadge.className = 'badge badge-neutral';
  } else if (metrics.overdueCount > 0) {
    loanBadge.textContent = 'Payment Overdue';
    loanBadge.className = 'badge badge-overdue';
  } else {
    loanBadge.textContent = 'Active Loan';
    loanBadge.className = 'badge badge-active';
  }
}

/* =========================================================
   PAY EMI MODAL
========================================================= */
let currentPayType = 'FULL';

function openPayModal(preselectEmiNo) {
  const select = document.getElementById('payEmiSelect');
  const payable = emiSchedule.filter((e) => e.status !== 'PAID');
  if (!payable.length) {
    showToast('All EMIs are already paid. Nothing due.', 'success');
    return;
  }
  select.innerHTML = payable
    .map(
      (e) =>
        `<option value="${e.emiNo}">EMI #${e.emiNo} — ${fmtCurrency(e.amount)} — Due ${fmtDate(e.dueDate)}</option>`
    )
    .join('');
  if (preselectEmiNo) select.value = preselectEmiNo;

  currentPayType = 'FULL';
  document.querySelectorAll('.seg-btn').forEach((b) => b.classList.toggle('active', b.dataset.type === 'FULL'));
  document.getElementById('partialAmountRow').style.display = 'none';
  document.getElementById('partialAmountInput').value = '';

  updateModalSummary();
  document.getElementById('payModalOverlay').classList.add('open');
}

function closePayModal() {
  document.getElementById('payModalOverlay').classList.remove('open');
}

function updateModalSummary() {
  const emiNo = Number(document.getElementById('payEmiSelect').value);
  const emi = emiSchedule.find((e) => e.emiNo === emiNo);
  if (!emi) return;
  const metrics = getMetrics();
  const summary = document.getElementById('modalSummary');

  let payAmount = emi.amount;
  let note = 'Standard EMI installment';

  if (currentPayType === 'PARTIAL') {
    const entered = Number(document.getElementById('partialAmountInput').value) || 0;
    payAmount = entered;
    note = 'Partial payment toward this EMI';
  } else if (currentPayType === 'EARLY') {
    payAmount = metrics.outstanding;
    note = 'Full early payoff of remaining loan balance';
  }

  summary.innerHTML = `
    <div class="ms-row"><span>EMI Number</span><strong>#${emi.emiNo}</strong></div>
    <div class="ms-row"><span>Due Date</span><strong>${fmtDate(emi.dueDate)}</strong></div>
    <div class="ms-row"><span>Payment Note</span><strong>${note}</strong></div>
    <div class="ms-row"><span>Amount to Pay</span><strong>${fmtCurrency(payAmount || 0)}</strong></div>
  `;
}

function confirmPayment() {
  const emiNo = Number(document.getElementById('payEmiSelect').value);
  const emi = emiSchedule.find((e) => e.emiNo === emiNo);
  const method = document.getElementById('payMethodSelect').value;
  if (!emi) return;

  let payAmount = emi.amount;

  if (currentPayType === 'PARTIAL') {
    payAmount = Number(document.getElementById('partialAmountInput').value) || 0;
    if (payAmount <= 0) {
      showToast('Enter a valid partial amount to continue.', 'error');
      return;
    }
    if (payAmount >= emi.amount) {
      // Treat as full payment of this EMI
      emi.paidAmount = emi.amount;
      emi.status = 'PAID';
    } else {
      emi.paidAmount = (emi.paidAmount || 0) + payAmount;
      emi.status = 'PARTIAL_PAID';
    }
  } else if (currentPayType === 'EARLY') {
    const metrics = getMetrics();
    payAmount = metrics.outstanding;
    // Mark all remaining EMIs as paid (early payoff)
    emiSchedule.forEach((e) => {
      if (e.status !== 'PAID') {
        e.paidAmount = e.amount;
        e.status = 'PAID';
      }
    });
  } else {
    emi.paidAmount = emi.amount;
    emi.status = 'PAID';
  }

  const txn = {
    txnId: genTxnId(),
    date: new Date(),
    amount: payAmount,
    method,
    status: 'SUCCESS',
    emiNo: emi.emiNo,
  };
  repaymentHistory.push(txn);

  closePayModal();
  renderAll();
  showConfirmation(txn);
  showToast(`Payment of ${fmtCurrency(payAmount)} completed successfully.`, 'success');
}

/* ---------- Secure Confirmation Popup ---------- */
function showConfirmation(txn) {
  document.getElementById('confirmDetails').innerHTML = `
    <div class="cd-row"><span>Transaction ID</span><strong>${txn.txnId}</strong></div>
    <div class="cd-row"><span>Amount Paid</span><strong>${fmtCurrency(txn.amount)}</strong></div>
    <div class="cd-row"><span>Payment Method</span><strong>${txn.method.replace('_', ' ')}</strong></div>
    <div class="cd-row"><span>Date &amp; Time</span><strong>${txn.date.toLocaleString('en-IN')}</strong></div>
    <div class="cd-row"><span>Status</span><strong>Secured &amp; Verified</strong></div>
  `;
  document.getElementById('confirmModalOverlay').classList.add('open');
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
}

/* ---------- Downloadable Report ---------- */
function downloadReport() {
  const metrics = getMetrics();
  const lines = [];
  lines.push('SECURE DIGITAL BANKING - REPAYMENT REPORT');
  lines.push(`Generated: ${new Date().toLocaleString('en-IN')}`);
  lines.push('');
  lines.push(`Loan ID: ${loan.loanId}`);
  lines.push(`Loan Amount: ${fmtCurrency(loan.principal)}`);
  lines.push(`Interest Rate: ${loan.interestRate}%`);
  lines.push(`EMI Amount: ${fmtCurrency(loan.emiAmount)}`);
  lines.push(`Tenure: ${loan.tenureMonths} months`);
  lines.push('');
  lines.push(`Total Payable: ${fmtCurrency(metrics.totalPayable)}`);
  lines.push(`Amount Paid: ${fmtCurrency(metrics.amountPaid)}`);
  lines.push(`Outstanding: ${fmtCurrency(metrics.outstanding)}`);
  lines.push(`Repayment Progress: ${metrics.percent}%`);
  lines.push('');
  lines.push('EMI SCHEDULE');
  lines.push('EMI No,Due Date,Amount,Status');
  emiSchedule.forEach((e) => lines.push(`${e.emiNo},${fmtDate(e.dueDate)},${e.amount},${e.status}`));
  lines.push('');
  lines.push('REPAYMENT HISTORY');
  lines.push('Transaction ID,Payment Date,Amount,Method,Status');
  repaymentHistory
    .sort((a, b) => b.date - a.date)
    .forEach((r) => lines.push(`${r.txnId},${fmtDate(r.date)},${r.amount},${r.method},${r.status}`));

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Repayment_Report_${loan.loanId}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Repayment report downloaded successfully.', 'success');
}

/* =========================================================
   EVENT WIRING
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  // Search / filter
  document.getElementById('emiSearch').addEventListener('input', renderEmiTable);
  document.getElementById('emiStatusFilter').addEventListener('change', renderEmiTable);
  document.getElementById('historySearch').addEventListener('input', renderHistoryTable);
  document.getElementById('historyMethodFilter').addEventListener('change', renderHistoryTable);

  // Notifications dropdown
  document.getElementById('notifBell').addEventListener('click', () => {
    document.getElementById('notifPanel').classList.toggle('open');
  });
  document.getElementById('closeNotif').addEventListener('click', () => {
    document.getElementById('notifPanel').classList.remove('open');
  });
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notifPanel');
    const bell = document.getElementById('notifBell');
    if (panel.classList.contains('open') && !panel.contains(e.target) && !bell.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Pay EMI modal
  document.getElementById('payEmiBtn').addEventListener('click', () => openPayModal());
  document.getElementById('payModalClose').addEventListener('click', closePayModal);
  document.getElementById('payModalCancel').addEventListener('click', closePayModal);
  document.getElementById('payEmiSelect').addEventListener('change', updateModalSummary);
  document.getElementById('partialAmountInput').addEventListener('input', updateModalSummary);
  document.getElementById('payModalConfirm').addEventListener('click', confirmPayment);

  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentPayType = btn.dataset.type;
      document.getElementById('partialAmountRow').style.display = currentPayType === 'PARTIAL' ? 'block' : 'none';
      updateModalSummary();
    });
  });

  // Confirmation modal
  document.getElementById('confirmCloseBtn').addEventListener('click', () => {
    document.getElementById('confirmModalOverlay').classList.remove('open');
  });

  // Download report
  document.getElementById('downloadReportBtn').addEventListener('click', downloadReport);

  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    document.body.classList.toggle('light-mode', !e.target.checked);
  });

  // Sidebar single nav item (Repayment Tracking) — already active/default view
  document.querySelector('[data-nav="repayment"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.content-scroll').scrollIntoView({ behavior: 'smooth' });
  });
});