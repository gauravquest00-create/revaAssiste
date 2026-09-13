import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar.js";
import { MobileHeader } from "../components/layout/MobileHeader.js";
import { MobileBottomNav } from "../components/layout/MobileBottomNav.js";
import "./AppLayout.css";

export const AppLayout: React.FC = () => {
  return (
    <div className="reva-app-container">
      <Sidebar />
      <div className="reva-main-viewport">
        <MobileHeader />
        <main className="reva-content-wrapper">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};
