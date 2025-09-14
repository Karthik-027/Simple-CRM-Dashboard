import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  // Logs state
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState(null);

  // Fetch logs with pagination
  const fetchLogs = async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/logs", {
        params: {
          page: page,
          size: 5,
          sort: "timestamp,desc",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLogs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch logs. Please try again.");
      console.error("Error fetching logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setUsersError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    }
  };

  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}/role`,
        role,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(users.map((user) => (user.id === userId ? response.data : user)));
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLogs(currentPage);
    fetchUsers();
  }, [currentPage]);

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">
        Welcome to the administrator panel. Manage users, view logs, and configure the system.
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

      {/* User Management Section */}
      <div className="admin-card">
        <h3 className="admin-card-title">User Management:</h3>
        {usersError ? (
          <p className="error-message">{usersError}</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Logs Section */}
      <div className="admin-card logs-section">
        <h3 className="admin-card-title">Activity Logs:</h3>
        {isLoading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.action}</td>
                    <td>{log.entityType}</td>
                    <td>{log.details}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
