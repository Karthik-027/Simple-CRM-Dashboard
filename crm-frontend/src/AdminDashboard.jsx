import React from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">
        Welcome to the administrator panel. This section is under development.
      </p>

      <div className="admin-card">
        <h3 className="admin-card-title">Quick Actions:</h3>
        <ul className="admin-actions">
          <li>User Management</li>
          <li>System Configuration</li>
          <li>Access Logs</li>
          <li>Performance Reports</li>
        </ul>
      </div>
    </div>
  );
}
