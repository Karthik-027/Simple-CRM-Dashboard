import React, { useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SALES_REP",
  });
  const { login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api("/auth/register", "POST", null, formData);
      login({ token: res.token, name: res.name, role: res.role });
      setSuccess(true);

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
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register to get started with CRM</p>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              type="text"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              type="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
              type="password"
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="SALES_REP">Sales Representative</option>
              <option value="ANALYST">Analyst</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          {err && <div className="error-message">⚠️ {err}</div>}
          {success && (
            <div className="success-message">
              ✅ Registration successful! Redirecting...
            </div>
          )}

          <button type="submit" className="auth-button primary">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="link-button">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
