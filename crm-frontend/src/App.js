import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Registration from "./Registration";
import CustomerList from "./CustomerList";
import CustomerDetail from "./CustomerDetail";
import Interactions from "./CustomerInteractions";
import Analytics from "./Analytics";
import AdminDashboard from "./AdminDashboard";
import NavigationHeader from "./NavigationHeader";
import "./App.css";

// 🔒 Protected Route with role-based access
function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.includes(user.role);
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// 🎯 Redirect users based on their role after login
function RoleBasedRedirect() {
  const { user } = useAuth();

  switch (user?.role) {
    case "ADMIN":
      return <Navigate to="/admin-dashboard" replace />;
    case "SALES_REP":
      return <Navigate to="/customers" replace />;
    case "ANALYST":
      return <Navigate to="/analytics" replace />;
    default:
      return <Navigate to="/customers" replace />;
  }
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated && <NavigationHeader />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <RoleBasedRedirect />} />
        <Route path="/register" element={!isAuthenticated ? <Registration /> : <RoleBasedRedirect />} />

        {/* Protected Routes */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute requiredRoles={["ADMIN", "SALES_REP"]}>
              <CustomerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute requiredRoles={["ADMIN", "SALES_REP"]}>
              <CustomerDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id/interactions"
          element={
            <ProtectedRoute requiredRoles={["ADMIN", "SALES_REP"]}>
              <Interactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRoles={["ADMIN", "ANALYST"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <RoleBasedRedirect /> : <Navigate to="/login" replace />} />

        {/* Unauthorized Page */}
        <Route
          path="/unauthorized"
          element={
            <div className="unauthorized">
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
              <button onClick={() => window.history.back()} className="nav-btn">
                Go Back
              </button>
            </div>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
