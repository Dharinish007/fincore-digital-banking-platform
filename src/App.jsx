import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountsKycPage from './pages/AccountsKycPage';
import LendingPage from './pages/LendingPage';
import SettlementsPage from './pages/SettlementsPage';
import GovernanceRiskPage from './pages/GovernanceRiskPage';
import OperationsPipelinePage from './pages/OperationsPipelinePage';

// Protected App Layout Shell
function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070d1e', color: '#94a3b8' }}>
        Loading FinCore Nexus security context...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <TopNav />
      <div className="app-body">
        <Sidebar />
        <main className="main-viewport">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Banking Portal */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Core Authenticated Banking Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <DashboardPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/accounts-kyc"
            element={
              <ProtectedLayout>
                <AccountsKycPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/lending"
            element={
              <ProtectedLayout>
                <LendingPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/settlements"
            element={
              <ProtectedLayout>
                <SettlementsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/governance-risk"
            element={
              <ProtectedLayout>
                <GovernanceRiskPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/operations-pipeline"
            element={
              <ProtectedLayout>
                <OperationsPipelinePage />
              </ProtectedLayout>
            }
          />

          {/* Catch-all redirect to public portal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
