import React, { useContext, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function CustomersList() {
  const { token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, [token]);

  async function loadCustomers() {
    try {
      const res = await api("/customers", "GET", token);
      setCustomers(res || []);
    } catch (e) {
      setError("Failed to load customers. Please try again.");
      console.error(e);
    }
  }

  // Validate mobile number
  function validateMobileNumber(phone) {
    if (!phone) return true; // Optional field
    const mobileRegex = /^[0-9]{10,15}$/; // 10-15 digits
    return mobileRegex.test(phone);
  }

  async function saveCustomer(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form inputs
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.phone && !validateMobileNumber(form.phone)) {
      setError("Please enter a valid mobile number (10-15 digits).");
      return;
    }
    if (!form.company.trim()) {
      setError("Company name is required.");
      return;
    }

    try {
      if (editingId) {
        // Update existing customer
        const updated = await api(`/customers/${editingId}`, "PUT", token, form);
        setCustomers((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        setEditingId(null);
        setSuccess("Customer updated successfully!");
      } else {
        // Add new customer
        const created = await api("/customers", "POST", token, form);
        setCustomers((prev) => [...prev, created]);
        setSuccess("Customer added successfully!");
      }
      setForm({ name: "", email: "", phone: "", company: "" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      // Set user-friendly error messages
      if (err.message.includes("email")) {
        setError("Email is already in use or invalid.");
      } else if (err.message.includes("phone")) {
        setError("Invalid mobile number. Please enter 10-15 digits.");
      } else if (err.message.includes("400")) {
        setError("Invalid input. Please check your data.");
      } else {
        setError(err.message || "Failed to save customer. Please try again.");
      }
      console.error(err);
    }
  }

  async function deleteCustomer(id) {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    
    try {
      await api(`/customers/${id}`, "DELETE", token);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Customer deleted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to delete customer: ${err.message}`);
      console.error(err);
    }
  }

  function startEdit(customer) {
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
    });
    setEditingId(customer.id);
    setError(null);
    setSuccess(null);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: "600", color: "#555" }}>Customer Management</h2>

      {/* Success Message */}
      {success && (
        <div style={{
          color: "#2e7d32",
          backgroundColor: "#edf7ed",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "15px",
        }}>
          {success}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          color: "#d32f2f",
          backgroundColor: "#ffebee",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "15px",
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={saveCustomer} style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Phone (10-15 digits)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "8px 14px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          {editingId ? "Update Customer" : "Add Customer"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", email: "", phone: "", company: "" });
              setEditingId(null);
              setError(null);
            }}
            style={{
              background: "gray",
              color: "white",
              border: "none",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Phone</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Company</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>
                <Link to={`/customers/${c.id}`} style={{ color: "#1976d2", textDecoration: "none" }}>
                  {c.name}
                </Link>
              </td>
              <td style={{ padding: "10px" }}>{c.email}</td>
              <td style={{ padding: "10px" }}>{c.phone || "-"}</td>
              <td style={{ padding: "10px" }}>{c.company || "-"}</td>
              <td style={{ padding: "10px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => startEdit(c)}
                  style={{
                    background: "orange",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCustomer(c.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/customers/${c.id}/interactions`)}
                  style={{
                    background: "#6a1b9a",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View Interactions
                </button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#777" }}>
                No customers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}