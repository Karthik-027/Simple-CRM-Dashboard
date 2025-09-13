import React, { useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api("/auth/login", "POST", null, { email, password });
      login({ token: res.token, name: res.name, role: res.role });

      // Redirect based on role
      switch (res.role) {
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "SALES_REP":
          navigate("/customers");
          break;
        case "ANALYST":
          navigate("/analytics");
          break;
        default:
          navigate("/");
      }
    } catch (ex) {
      setErr(ex.message || "Login failed");
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
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
      
      {err && (
        <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>
          {err}
        </div>
      )}
      
      <p style={{ textAlign: "center", marginTop: 20 }}>
        Don't have an account?{" "}
        <button 
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </p>
    </div>
  );
}