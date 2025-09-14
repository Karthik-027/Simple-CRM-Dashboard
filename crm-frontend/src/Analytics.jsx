import React, { useState, useEffect } from "react";
import { api } from "./api";
import { useAuth } from "./AuthContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "./Analytics.css";

export default function Analytics() {
  const { token } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    fetchKpis();
  }, []);

  async function fetchKpis() {
    try {
      const data = await api("/analytics/kpis", "GET", token);
      setKpis(data);

      // Fake trend data (replace with API trend if available)
      setTrend([
        { month: "Jan", customers: data.total_customers - 20 },
        { month: "Feb", customers: data.total_customers - 15 },
        { month: "Mar", customers: data.total_customers - 10 },
        { month: "Apr", customers: data.total_customers - 5 },
        { month: "Now", customers: data.total_customers },
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  if (!kpis) return <div className="loading">Loading KPIs...</div>;

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Analytics</h2>

      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="kpi-card customers">
          <h3>Total Customers</h3>
          <p>{kpis.total_customers}</p>
        </div>

        <div className="kpi-card new-customers">
          <h3>New (Last 30 days)</h3>
          <p>{kpis.new_last_30_days}</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="trend-card">
        <h3>Customer Growth Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#007bff"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
