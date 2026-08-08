import { Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";


const TellerDashboard = () => (
  <div
    style={{
      textAlign: "center",
      marginTop: "100px",
      fontSize: "32px",
      fontWeight: "bold",
    }}
  >
    Teller Dashboard (Coming Soon)
  </div>
);

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

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/teller/dashboard" element={<TellerDashboard />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      {/* Redirect */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;