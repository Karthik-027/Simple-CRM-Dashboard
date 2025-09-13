import React, { useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const { login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api("/auth/login", "POST", null, { email, password });
      login({ token: res.token, name: res.name, role: res.role });
      navigate("/customers"); // redirect after login
    } catch (ex) {
      setErr(ex.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>
      {err && <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>{err}</div>}
    </div>
  );
}
