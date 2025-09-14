import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api";
import { AuthContext } from "./AuthContext";

export default function CustomerInteractions() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [form, setForm] = useState({ type: "CALL", notes: "" }); // Default to "CALL"

  // Interaction types (matches backend enum)
  const interactionTypes = [
    { value: "CALL", label: "Call" },
    { value: "EMAIL", label: "Email" },
    { value: "MEETING", label: "Meeting" },
    { value: "TICKET", label: "Ticket" },
  ];

  useEffect(() => {
    loadCustomer();
    loadInteractions();
  }, [id, token]);

  async function loadCustomer() {
    try {
      const res = await api(`/customers/${id}`, "GET", token);
      setCustomer(res);
    } catch (e) {
      console.error("Error loading customer", e);
    }
  }

  async function loadInteractions() {
    try {
      const res = await api(`/customers/${id}/interactions`, "GET", token);
      setInteractions(res || []);
    } catch (e) {
      console.error("Error loading interactions", e);
    }
  }

  async function addInteraction(e) {
    e.preventDefault();
    try {
      const created = await api(`/customers/${id}/interactions`, "POST", token, form);
      setInteractions((prev) => [created, ...prev]); // new on top
      setForm({ type: "CALL", notes: "" }); // Reset form
    } catch (e) {
      console.error("Error adding interaction", e);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#444" }}>
        Interactions for {customer ? customer.name : "Loading..."}
      </h2>

      {/* Form with Dropdown */}
      <form onSubmit={addInteraction} style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          {interactionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>

      {/* List of Interactions */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {interactions.map((it) => (
          <li
            key={it.id}
            style={{
              background: "#f9f9f9",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          >
            <strong>{it.type}</strong> – {it.notes}
            <br />
            <small style={{ color: "#666" }}>
              {new Date(it.timestamp).toLocaleString()}
            </small>
          </li>
        ))}
        {interactions.length === 0 && (
          <p style={{ color: "#777" }}>No interactions yet.</p>
        )}
      </ul>
    </div>
  );
}
