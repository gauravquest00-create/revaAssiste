import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { AppLayout } from "./layouts/AppLayout.js";

// Pages
import { Login } from "./pages/Login/Login.js";
import { Dashboard } from "./pages/Dashboard/Dashboard.js";
import { Corridors } from "./pages/Corridors/Corridors.js";
import { Projects } from "./pages/Projects/Projects.js";
import { ProjectIntelligence } from "./pages/Projects/ProjectIntelligence.js";
import { Properties } from "./pages/Properties/Properties.js";
import { Leads } from "./pages/Leads/Leads.js";
import { LeadProfile } from "./pages/Leads/LeadProfile.js";
import { Visits } from "./pages/Visits/Visits.js";
import { FollowUps } from "./pages/FollowUps/FollowUps.js";
import { AiAdvisor } from "./pages/AiAdvisor/AiAdvisor.js";
import { Analytics } from "./pages/Analytics/Analytics.js";
import { Settings } from "./pages/Settings/Settings.js";
import { Comparison } from "./pages/Comparison/Comparison.js";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <img src="/logo.png" alt="Loading" style={{ width: "48px", height: "48px", marginBottom: "12px" }} />
          <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>Initializing REVA ASSISTE...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="corridors" element={<Corridors />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectIntelligence />} />
            <Route path="properties" element={<Properties />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/:id" element={<LeadProfile />} />
            <Route path="visits" element={<Visits />} />
            <Route path="followups" element={<FollowUps />} />
            <Route path="ai-advisor" element={<AiAdvisor />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="comparison" element={<Comparison />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;