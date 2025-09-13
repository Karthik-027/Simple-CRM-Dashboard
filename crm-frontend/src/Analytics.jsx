import React, { useState, useEffect } from "react";
import { api } from "./api";
import { useAuth } from "./AuthContext";

export default function Analytics() {
  const { token } = useAuth();
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    fetchKpis();
  }, []);

  async function fetchKpis() {
    try {
      const data = await api("/analytics/kpis", "GET", token);
      setKpis(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!kpis) return <div>Loading KPIs...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Analytics</h2>
      <div style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}>
        <p><b>Total Customers:</b> {kpis.total_customers}</p>
        <p><b>New in last 30 days:</b> {kpis[`new_last_30_days`]}</p>
      </div>
    </div>
  );
}
