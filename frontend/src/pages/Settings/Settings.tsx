import React from "react";
import { MdDownload, MdShield, MdPerson } from "react-icons/md";
import { useAuth } from "../../context/AuthContext.js";
import { usePWA } from "../../hooks/usePWA.js";
import "./Settings.css";

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { isInstallable, installPwa } = usePWA();

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">System & Account Settings</h1>
        <p className="settings-sub">Operational preferences, AI model parameters, and PWA setup</p>
      </div>

      <div className="settings-grid">
        {/* User Card */}
        <div className="settings-card">
          <div className="card-head">
            <MdPerson className="head-icon" />
            <h3 className="card-title">Consultant Profile</h3>
          </div>
          <div className="profile-details">
            <div><strong>Name:</strong> {user?.name || "Gaurav Verma"}</div>
            <div><strong>Email:</strong> {user?.email || "gauravquest00@gmail.com"}</div>
            <div><strong>Organization:</strong> {user?.organization || "LuxuryNest Real Estate"}</div>
            <div><strong>Role:</strong> {user?.role || "Administrator"}</div>
          </div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>

        {/* AI Model Config */}
        <div className="settings-card">
          <div className="card-head">
            <MdShield className="head-icon" />
            <h3 className="card-title">Gemini AI Configuration</h3>
          </div>
          <p className="card-desc">
            Configured strictly backend-side. The Gemini API key is never exposed to the frontend client.
          </p>
          <div className="config-item">
            <span>Model Engine:</span>
            <strong>gemini-3.6-flash</strong>
          </div>
          <div className="config-item">
            <span>Exponential Backoff:</span>
            <strong>3-Tier Retry (429 & Transient errors)</strong>
          </div>
          <div className="config-item">
            <span>Verification Policy:</span>
            <strong>Zero Fabricated Data Guarantee</strong>
          </div>
        </div>

        {/* PWA Settings */}
        <div className="settings-card">
          <div className="card-head">
            <MdDownload className="head-icon" />
            <h3 className="card-title">Progressive Web App (PWA)</h3>
          </div>
          <p className="card-desc">
            Install REVA ASSISTE directly onto your mobile device home screen or desktop application dock for rapid field sales access.
          </p>
          {isInstallable ? (
            <button className="install-app-btn" onClick={installPwa}>
              <MdDownload /> Install Reva Assiste App
            </button>
          ) : (
            <div className="pwa-status-badge">
              PWA Service Worker Active • Standalone Mode Supported
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
