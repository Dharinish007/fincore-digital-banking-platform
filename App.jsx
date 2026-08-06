import { useMemo, useState } from 'react';
import './App.css';

const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'balance', label: 'Balance Details' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'history', label: 'Balance History' },
  { key: 'accounts', label: 'Accounts' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
  { key: 'profile', label: 'Profile' },
  { key: 'support', label: 'Support' },
];

const stats = [
  { key: 'current', label: 'Current Balance', value: '₹1,25,000.00', detail: 'Total Balance' },
  { key: 'available', label: 'Available Balance', value: '₹1,12,450.00', detail: 'Available to use' },
  { key: 'credits', label: 'Total Credits', value: '₹2,85,400.00', detail: 'This Month' },
  { key: 'debits', label: 'Total Debits', value: '₹1,60,250.00', detail: 'This Month' },
];

const transactions = [
  { date: '12 May 2025', description: 'Salary Credit', type: 'Credit', amount: '+ ₹75,000.00', status: 'Completed', balance: '₹1,25,000.00' },
  { date: '11 May 2025', description: 'Amazon Purchase', type: 'Debit', amount: '- ₹2,450.00', status: 'Completed', balance: '₹50,000.00' },
  { date: '10 May 2025', description: 'Electricity Bill', type: 'Debit', amount: '- ₹1,250.00', status: 'Completed', balance: '₹52,450.00' },
  { date: '09 May 2025', description: 'UPI Payment', type: 'Debit', amount: '- ₹850.00', status: 'Pending', balance: '₹53,700.00' },
  { date: '08 May 2025', description: 'Interest Credit', type: 'Credit', amount: '+ ₹450.00', status: 'Completed', balance: '₹54,550.00' },
];

const quickActions = [
  { key: 'balance', icon: '🏦', title: 'View Balance Details', subtitle: 'Check detailed balance breakdown' },
  { key: 'transactions', icon: '🧾', title: 'View Transactions', subtitle: 'View all your transactions' },
  { key: 'history', icon: '📊', title: 'View Balance History', subtitle: 'Check historical balance data' },
  { key: 'statement', icon: '⬇️', title: 'Download Statement', subtitle: 'Download account statement' },
];

function App() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [activeStat, setActiveStat] = useState('current');
  const [selectedTransaction, setSelectedTransaction] = useState(transactions[0]);
  const [selectedAction, setSelectedAction] = useState('dashboard');
  const [searchText, setSearchText] = useState('');

  const panelTitle = useMemo(() => {
    if (selectedMenu === 'dashboard') return 'Dashboard Overview';
    if (selectedMenu === 'balance') return 'Balance Details';
    if (selectedMenu === 'transactions') return 'Transactions';
    if (selectedMenu === 'history') return 'Balance History';
    if (selectedMenu === 'accounts') return 'Accounts Overview';
    if (selectedMenu === 'reports') return 'Reports & Insights';
    if (selectedMenu === 'settings') return 'Settings';
    if (selectedMenu === 'profile') return 'Profile';
    if (selectedMenu === 'support') return 'Support Center';
    return 'Dashboard Overview';
  }, [selectedMenu]);

  const activeStats = useMemo(() => stats.find((item) => item.key === activeStat) ?? stats[0], [activeStat]);

  const filteredTransactions = useMemo(() => {
    if (!searchText.trim()) return transactions;
    return transactions.filter((txn) =>
      txn.description.toLowerCase().includes(searchText.toLowerCase()) ||
      txn.type.toLowerCase().includes(searchText.toLowerCase()) ||
      txn.date.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const renderContent = () => {
    if (selectedMenu === 'transactions') {
      return (
        <div className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Transactions</h2>
              <p className="section-label">Explore your latest transactions in detail</p>
            </div>
            <a className="view-all" href="#" onClick={(event) => event.preventDefault()}>
              Refresh
            </a>
          </div>
          <div className="transaction-panel">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr
                    key={txn.date + txn.description}
                    className={selectedTransaction.description === txn.description ? 'selected-row' : ''}
                    onClick={() => setSelectedTransaction(txn)}
                  >
                    <td>{txn.date}</td>
                    <td>{txn.description}</td>
                    <td>{txn.type}</td>
                    <td>{txn.amount}</td>
                    <td>
                      <span className={`status-pill ${txn.status === 'Completed' ? 'status-completed' : 'status-pending'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td>{txn.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="info-panel">
            <p className="section-label">Selected transaction</p>
            <h3>{selectedTransaction.description}</h3>
            <p>{selectedTransaction.date} • {selectedTransaction.type}</p>
            <p>{selectedTransaction.amount} • Balance {selectedTransaction.balance}</p>
          </div>
        </div>
      );
    }

    if (selectedMenu === 'balance' || selectedMenu === 'accounts') {
      return (
        <div className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">{panelTitle}</h2>
              <p className="section-label">Tap any stat card to explore more details</p>
            </div>
            <button className="topbar-button" onClick={() => setSelectedMenu('dashboard')}>
              Back to Dashboard
            </button>
          </div>
          <div className="account-summary">
            <div className="account-card clickable" onClick={() => setSelectedAction('balance')}>
              <div className="account-avatar">🏦</div>
              <div className="account-info">
                <p className="account-title">Savings Account</p>
                <p className="account-meta">IFSC Code FCRB0001234</p>
                <p className="account-meta">Account Holder Pavithra M</p>
              </div>
            </div>
            <div className="account-details">
              <div className="details-row"><span>Account Holder</span><span>Pavithra M</span></div>
              <div className="details-row"><span>IFSC Code</span><span>FCRB0001234</span></div>
              <div className="details-row"><span>Account Number</span><span>XXXX XXXX XXXX 1234</span></div>
            </div>
          </div>
          <div className="info-panel">
            <p className="section-label">Stat selected</p>
            <h3>{activeStats.label}</h3>
            <p>{activeStats.value}</p>
            <p>{activeStats.detail}</p>
          </div>
        </div>
      );
    }

    if (selectedMenu === 'history') {
      return (
        <div className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Balance History</h2>
              <p className="section-label">Review how your balance has changed over time</p>
            </div>
            <button className="topbar-button" onClick={() => setSelectedMenu('dashboard')}>
              Back to Dashboard
            </button>
          </div>
          <div className="balance-trend">
            <div className="trend-header">
              <div>
                <h3 className="trend-title">Trend Snapshot</h3>
                <p className="section-label">Click on a section to inspect the trend</p>
              </div>
            </div>
            <div className="chart-card clickable" onClick={() => setSelectedAction('history')}>
              <div className="chart-placeholder"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">{panelTitle}</h2>
            <p className="section-label">Click any navigation item for more details.</p>
          </div>
          <button className="topbar-button" onClick={() => setSelectedMenu('dashboard')}>
            Return Home
          </button>
        </div>
        <div className="info-panel">
          <p className="section-label">Page content is interactive.</p>
          <h3>{panelTitle}</h3>
          <p>Use the sidebar, quick actions, or cards to explore the dashboard.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-dot"></div>
          <div className="brand-title">FinCore Bank</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item ${selectedMenu === item.key ? 'active' : ''}`}
              onClick={() => setSelectedMenu(item.key)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="logout-btn" type="button" onClick={() => setSelectedMenu('support')}>
          Logout
        </button>
      </aside>

      <main className="main">
        <section className="topbar">
          <div className="topbar-left">
            <div className="search">
              <input
                type="text"
                placeholder="Search anything..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
          </div>

          <div className="topbar-right">
            <button className="topbar-button" type="button" onClick={() => setSelectedMenu('dashboard')}>
              Last Updated 12 May 2025, 07:29 AM
            </button>
            <button className="profile-badge" type="button" onClick={() => setSelectedMenu('profile')}>
              <span>PM</span>
              <span>Pavithra M</span>
            </button>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="hero-card clickable" onClick={() => setSelectedMenu('dashboard')}>
            <div className="hero-left">
              <h1 className="hero-title">Welcome Back, Pavithra 👋</h1>
              <p className="hero-subtitle">Here's an overview of your account</p>
              <div className="hero-cta">
                <button className="cta-button cta-primary" type="button" onClick={() => setSelectedMenu('accounts')}>
                  Account Summary
                </button>
                <button className="cta-button cta-secondary" type="button" onClick={() => setSelectedMenu('transactions')}>
                  View Transactions
                </button>
              </div>
            </div>
          </div>

          <div className="stats-row">
            {stats.map((stat) => (
              <button
                key={stat.key}
                type="button"
                className={`stat-card clickable ${activeStat === stat.key ? 'active-card' : ''}`}
                onClick={() => {
                  setActiveStat(stat.key);
                  setSelectedMenu('balance');
                }}
              >
                <div className="stat-label">{stat.label}</div>
                <p className="stat-value">{stat.value}</p>
                <div className="account-meta">{stat.detail}</div>
              </button>
            ))}
          </div>

          {selectedMenu === 'dashboard' && (
            <>
              <div className="section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Account Summary</h2>
                    <p className="section-label">Savings Account • XXXX XXXX XXXX 1234</p>
                  </div>
                  <button className="topbar-button" type="button">
                    Active
                  </button>
                </div>

                <div className="account-summary clickable" onClick={() => setSelectedMenu('accounts')}>
                  <div className="account-card">
                    <div className="account-avatar">🏦</div>
                    <div className="account-info">
                      <p className="account-title">Savings Account</p>
                      <p className="account-meta">IFSC Code FCRB0001234</p>
                      <p className="account-meta">Account Holder Pavithra M</p>
                    </div>
                  </div>

                  <div className="account-details">
                    <div className="details-row"><span>Account Holder</span><span>Pavithra M</span></div>
                    <div className="details-row"><span>IFSC Code</span><span>FCRB0001234</span></div>
                    <div className="details-row"><span>Account Number</span><span>XXXX XXXX XXXX 1234</span></div>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Recent Transactions</h2>
                    <p className="section-label">A quick view of your latest account activity</p>
                  </div>
                  <button className="view-all" type="button" onClick={() => setSelectedMenu('transactions')}>
                    View All
                  </button>
                </div>

                <div className="transaction-panel">
                  <table className="transaction-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Balance After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((txn) => (
                        <tr
                          key={txn.date + txn.description}
                          className={selectedTransaction.description === txn.description ? 'selected-row' : ''}
                          onClick={() => setSelectedTransaction(txn)}
                        >
                          <td>{txn.date}</td>
                          <td>{txn.description}</td>
                          <td>{txn.type}</td>
                          <td>{txn.amount}</td>
                          <td>
                            <span className={`status-pill ${txn.status === 'Completed' ? 'status-completed' : 'status-pending'}`}>
                              {txn.status}
                            </span>
                          </td>
                          <td>{txn.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <div className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Balance Overview</h2>
                <p className="section-label">This Month</p>
              </div>
              <select className="trend-select" value={selectedMenu} onChange={(e) => setSelectedMenu(e.target.value)}>
                <option value="dashboard">This Month</option>
                <option value="history">Last Month</option>
                <option value="accounts">Year</option>
              </select>
            </div>

            <div className="balance-trend clickable" onClick={() => setSelectedMenu('history')}>
              <div className="chart-card">
                <div className="chart-placeholder"></div>
              </div>
            </div>
          </div>

          <div className="section quick-actions">
            {quickActions.map((action) => (
              <button
                key={action.key}
                type="button"
                className="action-card clickable"
                onClick={() => setSelectedMenu(action.key === 'statement' ? 'reports' : action.key)}
              >
                <span>
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-text">
                    <p className="action-title">{action.title}</p>
                    <p className="action-subtitle">{action.subtitle}</p>
                  </div>
                </span>
              </button>
            ))}
          </div>
        </section>

        {selectedMenu !== 'dashboard' && renderContent()}
      </main>
    </div>
  );
}

export default App;
