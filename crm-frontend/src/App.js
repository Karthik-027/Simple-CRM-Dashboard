import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import CustomerList from "./CustomerList";
import CustomerDetail from "./CustomerDetail";
import Interactions from "./CustomerInteractions";
import Analytics from "./Analytics";

// Wrapper for protected routes
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomerList />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <PrivateRoute>
                <CustomerDetail />
              </PrivateRoute>
            }
          />

          {/* New Routes */}
          <Route
            path="/customers/:id/interactions"
            element={
              <PrivateRoute>
                <Interactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
