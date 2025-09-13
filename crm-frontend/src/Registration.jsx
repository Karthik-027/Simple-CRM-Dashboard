import React, { useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SALES_REP"
  });
  const { login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api("/auth/register", "POST", null, formData);
      login({ token: res.token, name: res.name, role: res.role });
      setSuccess(true);
      
      // Redirect based on role after a brief delay
      setTimeout(() => {
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
      }, 1500);
    } catch (ex) {
      setErr(ex.message || "Registration failed");
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
      <h2 style={{ textAlign: "center" }}>Create Account</h2>
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          type="text"
          required
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        >
          <option value="SALES_REP">Sales Representative</option>
          <option value="ANALYST">Analyst</option>
          <option value="ADMIN">Administrator</option>
        </select>
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
          Create Account
        </button>
      </form>
      
      {err && (
        <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>
          {err}
        </div>
      )}
      
      {success && (
        <div style={{ color: "green", marginTop: 10, textAlign: "center" }}>
          Registration successful! Redirecting...
        </div>
      )}
      
      <p style={{ textAlign: "center", marginTop: 20 }}>
        Already have an account?{" "}
        <button 
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
}