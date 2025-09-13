import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "./api";
import { AuthContext } from "./AuthContext";

export default function CustomerInteractions() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [form, setForm] = useState({ type: "", notes: "" });

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
      setForm({ type: "", notes: "" });
    } catch (e) {
      console.error("Error adding interaction", e);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#444" }}>
        Interactions for {customer ? customer.name : "Loading..."}
      </h2>

      {/* Form */}
      <form onSubmit={addInteraction} style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <input
          placeholder="Type (e.g., Call, Meeting)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
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

      {/* List */}
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
