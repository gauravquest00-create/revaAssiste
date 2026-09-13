import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdExplore,
  MdApartment,
  MdHouse,
  MdPeople,
  MdPlace,
  MdPhoneInTalk,
  MdPsychology,
  MdAnalytics,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
  MdLogout
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext.js";
import "./Sidebar.css";

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("reva_sidebar_collapsed") === "true";
  });
  const { user, logout } = useAuth();

  useEffect(() => {
    localStorage.setItem("reva_sidebar_collapsed", collapsed.toString());
  }, [collapsed]);

  const navItems = [
    { label: "Dashboard", path: "/", icon: MdDashboard },
    { label: "Corridors", path: "/corridors", icon: MdExplore },
    { label: "Projects", path: "/projects", icon: MdApartment },
    { label: "Properties", path: "/properties", icon: MdHouse },
    { label: "Leads", path: "/leads", icon: MdPeople },
    { label: "Visits", path: "/visits", icon: MdPlace },
    { label: "Follow-ups", path: "/followups", icon: MdPhoneInTalk },
    { label: "AI Advisor", path: "/ai-advisor", icon: MdPsychology },
    { label: "Analytics", path: "/analytics", icon: MdAnalytics },
    { label: "Settings", path: "/settings", icon: MdSettings }
  ];

  return (
    <aside className={`reva-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand Header with Top Collapse / Expand Control */}
      <div className={`sidebar-brand ${collapsed ? "brand-collapsed" : ""}`}>
        {!collapsed ? (
          <>
            <div className="brand-logo-group">
              <img src="/logo.png" alt="REVA ASSISTE" className="sidebar-logo" />
              <div className="brand-text">
                <span className="brand-title">REVA ASSISTE</span>
                <span className="brand-subtitle">Sales Intelligence OS</span>
              </div>
            </div>
            <button
              className="sidebar-top-toggle-btn"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <MdChevronLeft size={20} />
            </button>
          </>
        ) : (
          <div className="collapsed-brand-row">
            <img src="/logo.png" alt="REVA ASSISTE" className="sidebar-logo-mini" />
            <button
              className="sidebar-top-toggle-btn expand-btn"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <MdChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="nav-icon" />
              {!collapsed && <span className="nav-text">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="user-profile-badge">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-meta">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button className="icon-action-btn" onClick={logout} title="Log Out">
              <MdLogout />
            </button>
          </div>
        )}
        {collapsed && (
          <div className="collapsed-footer-action">
            <button className="icon-action-btn" onClick={logout} title="Log Out">
              <MdLogout size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
