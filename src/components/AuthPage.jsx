import React, { useState } from "react";
import { User } from "lucide-react";

export default function AuthPage({ onLogin, apiUrl }) {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === "login" ? "/auth/login" : "/auth/signup";

    if (authMode === "signup" && !authForm.username) {
      alert("Username is required");
      return;
    }
    if (!authForm.email || !authForm.password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (authMode === "signup") {
          alert("Account created successfully! Please login to continue.");
          setAuthMode("login");
          setAuthForm({ email: "", password: "", username: "" });
        } else {
          onLogin(data.user);
          setAuthForm({ email: "", password: "", username: "" });
        }
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">
          <User size={48} color="#1877f2" />
        </div>
        <h1 className="auth-title">Postify</h1>
        <p className="auth-subtitle">Connect with your community</p>

        <div className="auth-tabs">
          <button
            onClick={() => setAuthMode("login")}
            className={authMode === "login" ? "auth-tab active" : "auth-tab"}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode("signup")}
            className={authMode === "signup" ? "auth-tab active" : "auth-tab"}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-form">
          {authMode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={authForm.username}
              onChange={(e) =>
                setAuthForm({ ...authForm, username: e.target.value })
              }
              className="input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            className="input"
          />
          <button
            disabled={loading}
            onClick={handleAuth}
            className={loading ? "btn-primary disabled" : "btn-primary"}
          >
            {loading
              ? "Loading..."
              : authMode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}