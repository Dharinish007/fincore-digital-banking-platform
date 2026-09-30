import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { HomeView } from './views/HomeView';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { CustomerPortalView } from './views/Customer/CustomerPortalView';
import { TellerDeskView } from './views/Teller/TellerDeskView';
import { SupervisorDashboardView } from './views/Supervisor/SupervisorDashboardView';
import { AuditorDashboardView } from './views/Auditor/AuditorDashboardView';
import { CustomersView } from './views/CustomersView';
import { AccountsView } from './views/AccountsView';
import { LoansView } from './views/LoansView';
import { TransactionsView } from './views/TransactionsView';
import { SettingsView } from './views/SettingsView';
import { KycView } from './views/Milestone1/KycView';
import { UserManagementView } from './views/Milestone1/UserManagementView';
import { AuditLogsView } from './views/Milestone1/AuditLogsView';
import { RepaymentView } from './views/Milestone2/RepaymentView';
import { DisbursementSagaView } from './views/Milestone2/DisbursementSagaView';
import { NpaClassificationView } from './views/Milestone2/NpaClassificationView';
import { SagaExecutionView } from './views/Milestone3/SagaExecutionView';
import { SettlementView } from './views/Milestone3/SettlementView';
import { NotificationCenterView } from './views/Milestone3/NotificationCenterView';
import { OperationsConsoleView } from './views/OperationsConsoleView';
import { ArchitectureDocsView } from './views/ArchitectureDocsView';

const MainLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role || 'ADMIN';
  const [activeView, setActiveView] = useState('dashboard');
  const [publicView, setPublicView] = useState('home'); // default to 'home' banking website

  // When role changes, set appropriate default view
  useEffect(() => {
    if (role === 'CUSTOMER') {
      setActiveView('customer-accounts');
    } else if (role === 'TELLER') {
      setActiveView('teller-desk');
    } else if (role === 'SUPERVISOR') {
      setActiveView('supervisor-dashboard');
    } else if (role === 'AUDITOR') {
      setActiveView('auditor-dashboard');
    } else {
      setActiveView('dashboard');
    }
  }, [role]);

  // If user is not authenticated: show either Home or Login view
  if (!isAuthenticated) {
    if (publicView === 'home') {
      return <HomeView onGoToLogin={() => setPublicView('login')} />;
    }
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', zIndex: 50 }}>
          <button
            onClick={() => setPublicView('home')}
            className="btn btn-secondary btn-sm"
          >
            <span>FinCore Bank Home</span>
          </button>
        </div>
        <LoginView />
      </div>
    );
  }

  const renderView = () => {
    // 1. CUSTOMER SPECIFIC VIEWS
    if (role === 'CUSTOMER') {
      switch (activeView) {
        case 'customer-accounts':
        case 'dashboard':
        case 'accounts':
          return <CustomerPortalView initialTab="accounts" />;
        case 'customer-send':
          return <CustomerPortalView initialTab="send" />;
        case 'customer-receive':
          return <CustomerPortalView initialTab="receive" />;
        case 'customer-transactions':
        case 'transactions':
          return <CustomerPortalView initialTab="transactions" />;
        case 'customer-loans':
        case 'loans':
          return <CustomerPortalView initialTab="loans" />;
        case 'customer-kyc':
        case 'm1-kyc':
          return <CustomerPortalView initialTab="kyc" />;
        case 'm3-notifications':
          return <NotificationCenterView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <CustomerPortalView initialTab="accounts" />;
      }
    }

    // 2. TELLER SPECIFIC VIEWS
    if (role === 'TELLER') {
      switch (activeView) {
        case 'teller-desk':
        case 'dashboard':
          return <TellerDeskView />;
        case 'customers':
          return <CustomersView />;
        case 'accounts':
          return <AccountsView />;
        case 'm1-kyc':
          return <KycView />;
        case 'transactions':
          return <TransactionsView />;
        case 'm3-notifications':
          return <NotificationCenterView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <TellerDeskView />;
      }
    }

    // 3. SUPERVISOR SPECIFIC VIEWS
    if (role === 'SUPERVISOR') {
      switch (activeView) {
        case 'supervisor-dashboard':
        case 'dashboard':
          return <SupervisorDashboardView onSelectView={(v) => setActiveView(v)} />;
        case 'accounts':
          return <AccountsView />;
        case 'm1-kyc':
          return <KycView />;
        case 'loans':
          return <LoansView onSelectView={(v) => setActiveView(v)} />;
        case 'm2-disbursement':
          return <DisbursementSagaView />;
        case 'm2-npa':
          return <NpaClassificationView />;
        case 'm3-saga':
          return <SagaExecutionView />;
        case 'm3-settlements':
          return <SettlementView />;
        case 'm1-audit':
          return <AuditLogsView />;
        case 'transactions':
          return <TransactionsView />;
        case 'm3-notifications':
          return <NotificationCenterView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <SupervisorDashboardView onSelectView={(v) => setActiveView(v)} />;
      }
    }

    // 4. AUDITOR SPECIFIC VIEWS
    if (role === 'AUDITOR') {
      switch (activeView) {
        case 'auditor-dashboard':
        case 'dashboard':
          return <AuditorDashboardView onSelectView={(v) => setActiveView(v)} />;
        case 'm1-audit':
          return <AuditLogsView />;
        case 'transactions':
          return <TransactionsView />;
        case 'm1-kyc':
          return <KycView />;
        case 'm2-npa':
          return <NpaClassificationView />;
        case 'm3-settlements':
          return <SettlementView />;
        case 'm3-saga':
          return <SagaExecutionView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <AuditorDashboardView onSelectView={(v) => setActiveView(v)} />;
      }
    }

    // 5. ADMIN SPECIFIC VIEWS
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onSelectView={(v) => setActiveView(v)} />;
      case 'customers':
        return <CustomersView />;
      case 'accounts':
        return <AccountsView />;
      case 'loans':
        return <LoansView onSelectView={(v) => setActiveView(v)} />;
      case 'transactions':
        return <TransactionsView />;
      case 'settings':
        return <SettingsView />;
      case 'm1-kyc':
        return <KycView />;
      case 'm1-users':
        return <UserManagementView />;
      case 'm1-audit':
        return <AuditLogsView />;
      case 'm2-repayments':
        return <RepaymentView />;
      case 'm2-disbursement':
        return <DisbursementSagaView />;
      case 'm2-npa':
        return <NpaClassificationView />;
      case 'm3-saga':
        return <SagaExecutionView />;
      case 'm3-settlements':
        return <SettlementView />;
      case 'm3-notifications':
        return <NotificationCenterView />;
      case 'operations-console':
        return <OperationsConsoleView />;
      case 'architecture-docs':
        return <ArchitectureDocsView />;
      default:
        return <DashboardView onSelectView={(v) => setActiveView(v)} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={activeView}
        onSelectView={(v) => setActiveView(v)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <Header
          activeView={activeView}
          onSelectView={(v) => setActiveView(v)}
        />

        {/* Scrollable Page Content */}
        <main className="page-container">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
