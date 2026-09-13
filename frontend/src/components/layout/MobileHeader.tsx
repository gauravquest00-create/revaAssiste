import React from "react";
import { MdDownload, MdLogout } from "react-icons/md";
import { useAuth } from "../../context/AuthContext.js";
import { usePWA } from "../../hooks/usePWA.js";
import "./MobileHeader.css";

export const MobileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { isInstallable, installPwa } = usePWA();

  return (
    <header className="mobile-header">
      <div className="mobile-brand">
        <img src="/logo.png" alt="REVA ASSISTE" className="mobile-logo" />
        <div className="mobile-brand-meta">
          <span className="mobile-title">REVA ASSISTE</span>
          <span className="mobile-tag">Sales OS</span>
        </div>
      </div>

      <div className="mobile-actions">
        {isInstallable && (
          <button className="mobile-install-btn" onClick={installPwa} title="Install Reva Assiste App">
            <MdDownload className="install-icon" />
            <span>Install</span>
          </button>
        )}
        {user && (
          <button className="mobile-logout-btn" onClick={logout} title="Logout">
            <MdLogout />
          </button>
        )}
      </div>
    </header>
  );
};
