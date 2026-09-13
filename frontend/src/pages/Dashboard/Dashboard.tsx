import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPeople,
  MdWhatshot,
  MdHouse,
  MdPlace,
  MdPhoneInTalk,
  MdHandshake,
  MdPsychology,
  MdArrowForward,
  MdCheckCircle,
  MdWarning,
  MdAdd
} from "react-icons/md";
import { api } from "../../services/api.js";
import { StatCard } from "../../components/common/StatCard.js";
import { Badge } from "../../components/common/Badge.js";
import { Skeleton } from "../../components/common/Skeleton.js";
import { Lead, Task } from "../../types/index.js";
import "./Dashboard.css";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [commandCenter, setCommandCenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ccRes] = await Promise.all([
          api.get<{ success: boolean; stats: any }>("/dashboard/stats"),
          api.get<{ success: boolean; commandCenter: any }>("/dashboard/command-center")
        ]);
        if (statsRes.success) setStats(statsRes.stats);
        if (ccRes.success) setCommandCenter(ccRes.commandCenter);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      {/* Top Welcome & AI Command Center Banner */}
      <div className="dashboard-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <MdPsychology className="hero-badge-icon" />
            <span>AI Sales Command Center</span>
          </div>
          <h1 className="hero-title">Welcome back, Gaurav Verma</h1>
          <p className="hero-briefing">
            {commandCenter?.aiBriefing?.headline ||
              "Call Rahul Sharma first. Client has a ₹2.3Cr end-use requirement, visited Tata La Vida, and seller is flexible on unit 1204."}
          </p>
        </div>

        <div className="hero-quick-actions">
          <button className="hero-action-btn primary" onClick={() => navigate("/leads")}>
            <MdAdd /> Add Lead
          </button>
          <button className="hero-action-btn secondary" onClick={() => navigate("/projects")}>
            <MdPsychology /> Smart Project Filter
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="dashboard-stats-grid">
        {loading ? (
          <>
            <Skeleton height="90px" />
            <Skeleton height="90px" />
            <Skeleton height="90px" />
            <Skeleton height="90px" />
            <Skeleton height="90px" />
            <Skeleton height="90px" />
          </>
        ) : (
          <>
            <StatCard
              label="Total Active Leads"
              value={stats?.totalLeads || 0}
              subtext="Filtered closing pipeline"
              icon={MdPeople}
              color="primary"
              routeTo="/leads"
            />
            <StatCard
              label="Hot Priority Leads"
              value={stats?.hotLeads || 0}
              subtext="Buying timeline < 30 days"
              icon={MdWhatshot}
              color="danger"
              routeTo="/leads?temperature=Hot"
            />
            <StatCard
              label="Available Properties"
              value={stats?.availableProperties || 0}
              subtext="Verified Dwarka Exp. inventory"
              icon={MdHouse}
              color="success"
              routeTo="/properties"
            />
            <StatCard
              label="Today's Visits"
              value={stats?.todayVisits || 0}
              subtext="Scheduled client tours"
              icon={MdPlace}
              color="warning"
              routeTo="/visits"
            />
            <StatCard
              label="Today's Follow-ups"
              value={stats?.todayFollowUps || 0}
              subtext="Strategic advisor outreach"
              icon={MdPhoneInTalk}
              color="info"
              routeTo="/followups"
            />
            <StatCard
              label="Active Negotiations"
              value={stats?.activeDeals || 0}
              subtext="Token & offer stage"
              icon={MdHandshake}
              color="primary"
              routeTo="/leads?stage=Closing"
            />
          </>
        )}
      </div>

      {/* Main Dual Grid: Today's Priorities & High Priority Leads */}
      <div className="dashboard-dual-grid">
        {/* Left Column: AI-Generated Daily Sales Tasks */}
        <section className="dashboard-card tasks-section">
          <div className="card-header">
            <div className="header-title-group">
              <h2 className="card-title">Today's Sales Priority & Action Plan</h2>
              <span className="card-subtitle">AI-generated sequence to maximize closing velocity</span>
            </div>
            <button className="view-all-link" onClick={() => navigate("/ai-advisor")}>
              Ask AI <MdArrowForward />
            </button>
          </div>

          <div className="tasks-list">
            {loading ? (
              <Skeleton height="140px" />
            ) : commandCenter?.todayTasks?.length > 0 ? (
              commandCenter.todayTasks.map((t: Task, idx: number) => (
                <div key={t._id || idx} className="task-item-card">
                  <div className="task-top-row">
                    <span className="task-sequence-num">#{idx + 1}</span>
                    <span className="task-title-text">{t.title}</span>
                    <Badge
                      label={t.type}
                      variant={t.type === "Call" ? "danger" : t.type === "Pitch" ? "primary" : "warning"}
                    />
                  </div>
                  <div className="task-why-box">
                    <strong>Why:</strong> {t.why}
                  </div>
                  <div className="task-details-grid">
                    <div className="task-detail-block">
                      <span className="detail-tag">What To Say</span>
                      <p className="detail-text">{t.whatToSay}</p>
                    </div>
                    <div className="task-detail-block">
                      <span className="detail-tag">Diagnostic Question</span>
                      <p className="detail-text">{t.whatToAsk}</p>
                    </div>
                  </div>
                  <div className="task-footer">
                    <span className="task-expected-outcome">
                      <strong>Expected Outcome:</strong> {t.expectedOutcome}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-notice">All daily priorities completed for today.</p>
            )}
          </div>
        </section>

        {/* Right Column: High Priority Leads & Deals At Risk */}
        <div className="dashboard-side-column">
          {/* High Priority Leads */}
          <section className="dashboard-card leads-preview-section">
            <div className="card-header">
              <h2 className="card-title">High Priority Leads</h2>
              <button className="view-all-link" onClick={() => navigate("/leads")}>
                View All <MdArrowForward />
              </button>
            </div>

            <div className="high-leads-list">
              {loading ? (
                <Skeleton height="120px" />
              ) : commandCenter?.highPriorityLeads?.length > 0 ? (
                commandCenter.highPriorityLeads.map((lead: Lead) => (
                  <div
                    key={lead._id}
                    className="lead-preview-card"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                  >
                    <div className="lead-preview-top">
                      <div>
                        <h4 className="lead-name">{lead.name}</h4>
                        <span className="lead-budget">{lead.budget?.formatted} • {lead.purpose}</span>
                      </div>
                      <div className="lead-score-pill">
                        <span className="score-val">{lead.aiPriority?.score || 90}</span>
                        <span className="score-label">AI SCORE</span>
                      </div>
                    </div>
                    <p className="lead-ai-reason">{lead.aiPriority?.explanation}</p>
                    <div className="lead-next-action-row">
                      <MdCheckCircle className="action-icon" />
                      <span className="action-text">{lead.nextAction?.action}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-notice">No active hot leads registered.</p>
              )}
            </div>
          </section>

          {/* Deals At Risk / Critical Warnings */}
          <section className="dashboard-card deals-risk-section">
            <div className="card-header">
              <div className="header-title-group">
                <h3 className="card-title risk-title">
                  <MdWarning /> Deals Requiring Attention
                </h3>
              </div>
            </div>
            <div className="deals-risk-content">
              <div className="risk-item">
                <span className="risk-target">Rahul Sharma (Tata La Vida unit 1204)</span>
                <p className="risk-text">
                  Price blocker: Seller expecting ₹2.28 Cr, buyer anchored at ₹2.15 Cr.
                </p>
                <div className="risk-remedy">
                  <strong>AI Strategy:</strong> Bridge gap at ₹2.20 Cr target settlement with token ready this Saturday.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
