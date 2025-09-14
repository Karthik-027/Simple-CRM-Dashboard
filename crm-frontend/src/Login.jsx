import React, { useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    // Validate inputs
    if (!email.trim()) {
      setErr("Email is required.");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setErr("Password is required.");
      setLoading(false);
      return;
    }

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
      // Set user-friendly error messages
      if (ex.message.includes("401") || ex.message.includes("Unauthorized")) {
        setErr("Incorrect email or password. Please try again.");
      } else if (ex.message.includes("email")) {
        setErr("Invalid email address.");
      } else if (ex.message.includes("password")) {
        setErr("Incorrect password.");
      } else if (ex.message.includes("400")) {
        setErr("Invalid input. Please check your credentials.");
      } else {
        setErr(ex.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your CRM account</p>
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              required
              disabled={loading}
            />
          </div>
          {err && <div className="error-message">⚠️ {err}</div>}
          <button type="submit" disabled={loading} className="auth-button primary">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")} className="link-button">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
