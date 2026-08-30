import { Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// Public Pages
// ==========================================

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// ==========================================
// Dashboard Pages
// ==========================================

import AdminDashboard from "../pages/Admin/AdminDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import TellerDashboard from "../pages/Teller/TellerDashboard";

// ==========================================
// Admin Management Pages
// ==========================================

import EmployeeManagement from "../pages/employee/EmployeeManagement";
import UserManagement from "../pages/user/UserManagement";
import RoleManagement from "../pages/role/RoleManagement";
import NpaClassification from "../pages/npa/NpaClassification";
import AuditLogs from "../pages/audit/AuditLogs";
import SettlementConfirmation from "../pages/settlement/SettlementConfirmation";
import RiskScoring from "../pages/risk/RiskScoring";

// ==========================================
// Admin Additional Pages
// ==========================================

import Reports from "../pages/admin/reports/Reports";
import AdminProfile from "../pages/admin/profile/AdminProfile";


// ==========================================
// 404 Page
// ==========================================

const NotFound = () => (
  <div
    style={{
      textAlign: "center",
      marginTop: "100px",
    }}
  >
    <h1>404</h1>
    <h2>Page Not Found</h2>
  </div>
);


// ==========================================
// Application Routes
// ==========================================

function AppRoutes() {
  return (
    <Routes>

      {/* ==========================================
          Public Routes
      ========================================== */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==========================================
          Admin Routes
      ========================================== */}

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/employees"
        element={<EmployeeManagement />}
      />

      <Route
        path="/admin/users"
        element={<UserManagement />}
      />

      <Route
        path="/admin/roles"
        element={<RoleManagement />}
      />

      <Route
        path="/admin/npa-classification"
        element={<NpaClassification />}
      />

      <Route
        path="/admin/audit-logs"
        element={<AuditLogs />}
      />

      <Route
        path="/admin/reports"
        element={<Reports />}
      />

      <Route
        path="/admin/profile"
        element={<AdminProfile />}
      />


      {/* ==========================================
          Employee Dashboard Routes
      ========================================== */}

      <Route
        path="/manager/dashboard"
        element={<ManagerDashboard />}
      />

      <Route
        path="/settlement-confirmation"
        element={<SettlementConfirmation />}
      />

      <Route
        path="/risk-scoring"
        element={<RiskScoring />}
      />

      <Route
        path="/teller/dashboard"
        element={<TellerDashboard />}
      />


      {/* ==========================================
          Customer Dashboard
      ========================================== */}

      <Route
        path="/customer/dashboard"
        element={<CustomerDashboard />}
      />


      {/* ==========================================
          Redirect
      ========================================== */}

      <Route
        path="/home"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />


      {/* ==========================================
          404
      ========================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;