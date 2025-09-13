import React, { useContext, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setCustomer(await api(`/customers/${id}`, "GET", token));
        setInteractions(await api(`/customers/${id}/interactions`, "GET", token));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id, token]);

  async function save() {
    try {
      const res = await api(`/customers/${id}/interactions`, "POST", token, {
        type: "CALL",
        notes: note,
      });
      setInteractions((prev) => [res, ...prev]);
      setNote("");
    } catch (e) {
      console.error(e);
    }
  }

  if (!customer) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/customers")}
        style={{
          marginBottom: "20px",
          padding: "6px 12px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2>{customer.name}</h2>
      <p>
        <strong>Email:</strong> {customer.email} <br />
        <strong>Phone:</strong> {customer.phone} <br />
        <strong>Company:</strong> {customer.company}
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Log Interaction</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter interaction notes..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={save}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Interactions</h3>
        {interactions.length === 0 ? (
          <p style={{ color: "#777" }}>No interactions yet.</p>
        ) : (
          <ul style={{ paddingLeft: "20px" }}>
            {interactions.map((i) => (
              <li key={i.id} style={{ marginBottom: "8px" }}>
                <strong>{i.type}</strong> — {i.notes}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
