import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Registration from "./Registration";
import CustomerList from "./CustomerList";
import CustomerDetail from "./CustomerDetail";
import Interactions from "./CustomerInteractions";
import Analytics from "./Analytics";
import "./App.css";

// Navigation Header Component
function NavigationHeader() {
  const { user, logout } = useAuth();
  
  return (
    <header style={{
      padding: '10px 20px',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h2 style={{ margin: 0 }}>CRM System</h2>
        {user && <span style={{ fontSize: '14px', color: '#666' }}>
          Welcome, {user.name} ({user.role})
        </span>}
      </div>
      
      <nav>
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button 
              onClick={() => window.location.href = '/customers'}
              style={{
                padding: '8px 15px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Customers
            </button>
            <button 
              onClick={() => window.location.href = '/analytics'}
              style={{
                padding: '8px 15px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Analytics
            </button>
            <button 
              onClick={() => window.location.href = '/admin-dashboard'}
              style={{
                padding: '8px 15px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Admin
            </button>
            <button 
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              style={{
                padding: '8px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '8px 15px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => window.location.href = '/register'}
              style={{
                padding: '8px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

// Enhanced Protected Route component with role-based access
function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, hasAnyRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

// Component to redirect users based on their role after login
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
      <NavigationHeader />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <RoleBasedRedirect />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Registration /> : <RoleBasedRedirect />} 
        />
        
        {/* Protected Routes with Role-Based Access */}
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
              <div className="dashboard-container" style={{ padding: '20px' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the administrator panel. This section is under development.</p>
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                  <h3>Quick Actions:</h3>
                  <ul style={{ textAlign: 'left' }}>
                    <li>User Management</li>
                    <li>System Configuration</li>
                    <li>Access Logs</li>
                    <li>Performance Reports</li>
                  </ul>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirects */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <RoleBasedRedirect /> : <Navigate to="/login" replace />} 
        />
        
        {/* Error routes */}
        <Route 
          path="/unauthorized" 
          element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
              <button 
                onClick={() => window.history.back()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Go Back
              </button>
            </div>
          } 
        />
        
        {/* Fallback for unknown routes */}
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