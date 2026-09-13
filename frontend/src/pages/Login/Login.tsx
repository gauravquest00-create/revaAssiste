import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLock, MdEmail, MdVisibility, MdVisibilityOff, MdArrowForward } from "react-icons/md";
import { useAuth } from "../../context/AuthContext.js";
import "./Login.css";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("gauravquest00@gmail.com");
  const [password, setPassword] = useState("Admin123@");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reva-login-viewport">
      <div className="reva-login-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <img src="/logo.png" alt="REVA ASSISTE" className="login-logo" />
          <h1 className="login-app-name">REVA ASSISTE</h1>
          <p className="login-app-desc">
            AI-Powered Real Estate Sales Intelligence & Brokerage Operating System
          </p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Advisor Email</label>
            <div className="input-box">
              <MdEmail className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advisor@luxurynest.in"
                className="text-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Password</label>
            <div className="input-box">
              <MdLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="text-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            <span>{loading ? "Authenticating Session..." : "Sign In to Sales System"}</span>
            <MdArrowForward size={18} />
          </button>
        </form>

    
      </div>
    </div>
  );
};
