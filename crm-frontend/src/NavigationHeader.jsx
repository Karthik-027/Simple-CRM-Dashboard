import React from "react";
import { useAuth } from "./AuthContext";
import "./NavigationHeader.css";

export default function NavigationHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="nav-header">
      <div className="nav-left">
        <h2 className="nav-title">CRM System</h2>
        {user && (
          <span className="nav-welcome">
            Welcome, <strong>{user.name}</strong> ({user.role})
          </span>
        )}
      </div>

      <nav className="nav-right">
        {user ? (
          <>
            <button onClick={() => (window.location.href = "/customers")} className="nav-btn">
              Customers
            </button>
            <button onClick={() => (window.location.href = "/analytics")} className="nav-btn">
              Analytics
            </button>
            {user.role === "ADMIN" && (
              <button onClick={() => (window.location.href = "/admin-dashboard")} className="nav-btn">
                Admin
              </button>
            )}
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => (window.location.href = "/login")} className="nav-btn">
              Login
            </button>
            <button onClick={() => (window.location.href = "/register")} className="register-btn">
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
