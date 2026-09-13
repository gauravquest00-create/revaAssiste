import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdApartment,
  MdPsychology,
  MdMenu,
  MdExplore,
  MdHouse,
  MdPlace,
  MdPhoneInTalk,
  MdAnalytics,
  MdSettings,
  MdClose
} from "react-icons/md";
import "./MobileBottomNav.css";

export const MobileBottomNav: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const primaryTabs = [
    { label: "Dashboard", path: "/", icon: MdDashboard },
    { label: "Leads", path: "/leads", icon: MdPeople },
    { label: "Projects", path: "/projects", icon: MdApartment },
    { label: "AI Advisor", path: "/ai-advisor", icon: MdPsychology }
  ];

  const moreItems = [
    { label: "Corridors", path: "/corridors", icon: MdExplore },
    { label: "Properties", path: "/properties", icon: MdHouse },
    { label: "Visits", path: "/visits", icon: MdPlace },
    { label: "Follow-ups", path: "/followups", icon: MdPhoneInTalk },
    { label: "Analytics", path: "/analytics", icon: MdAnalytics },
    { label: "Settings", path: "/settings", icon: MdSettings }
  ];

  return (
    <>
      <nav className="mobile-bottom-nav">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => `bottom-tab ${isActive ? "active" : ""}`}
            >
              <Icon className="tab-icon" />
              <span className="tab-label">{tab.label}</span>
            </NavLink>
          );
        })}

        <button
          className={`bottom-tab ${drawerOpen ? "active" : ""}`}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <MdMenu className="tab-icon" />
          <span className="tab-label">More</span>
        </button>
      </nav>

      {/* More Drawer Sheet */}
      {drawerOpen && (
        <div className="mobile-more-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-more-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <span className="sheet-title">More Modules</span>
              <button className="sheet-close-btn" onClick={() => setDrawerOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="sheet-grid">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="sheet-grid-item"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <div className="sheet-icon-wrapper">
                      <Icon size={22} />
                    </div>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
