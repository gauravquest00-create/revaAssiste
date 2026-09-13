import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdApartment,
  MdShield,
  MdTrendingUp,
  MdHouse,
  MdPsychology,
  MdFlashOn
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Project, Property } from "../../types/index.js";
import { Badge } from "../../components/common/Badge.js";
import { Skeleton } from "../../components/common/Skeleton.js";
import { formatCurrency } from "../../utils/formatters.js";
import { QuickPitchPanel } from "./QuickPitchPanel.js";
import "./ProjectIntelligence.css";

export const ProjectIntelligence: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPitchModal, setShowPitchModal] = useState(false);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await api.get<{
          success: boolean;
          project: Project;
          properties: Property[];
          intelligence: any;
        }>(`/projects/${id}/intelligence`);
        if (res.success) {
          setProject(res.project);
          setProperties(res.properties);
          setIntelligence(res.intelligence);
        }
      } catch (err) {
        console.error("Failed to fetch project intelligence:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntel();
  }, [id]);

  if (loading) {
    return (
      <div className="intel-loading">
        <Skeleton height="40px" width="300px" />
        <Skeleton height="160px" />
        <Skeleton height="300px" />
      </div>
    );
  }

  if (!project) {
    return <div className="not-found">Project not found or deleted.</div>;
  }

  return (
    <div className="project-intel-page">
      {/* Navigation & Header */}
      <div className="intel-top-bar">
        <button className="back-btn" onClick={() => navigate("/projects")}>
          <MdArrowBack /> Back to Projects
        </button>
        <button className="open-pitch-btn" onClick={() => setShowPitchModal(true)}>
          <MdFlashOn /> Quick Pitch Panel
        </button>
      </div>

      <div className="intel-hero-card">
        <div className="hero-main-info">
          <div className="hero-tags-row">
            <span className="builder-tag">{project.builder}</span>
            <span className="sector-tag">{project.sector}</span>
            <Badge label={project.verificationStatus} variant="success" />
            <Badge label={project.status} variant="primary" />
          </div>
          <h1 className="hero-title">{project.name}</h1>
          <p className="hero-address">{project.address}</p>
        </div>

        <div className="hero-pricing-box">
          <span className="pricing-title">Verified Price Range</span>
          <span className="pricing-value">{project.priceRange?.formatted}</span>
          <span className="pricing-rate">Avg ₹{project.priceRange?.pricePerSqftAvg} / sqft</span>
        </div>
      </div>

      {/* AI Sales Strategy Banner */}
      <div className="ai-sales-playbook-card">
        <div className="playbook-head">
          <MdPsychology size={22} className="playbook-icon" />
          <div>
            <h3 className="playbook-title">AI Sales Playbook & Positioning</h3>
            <span className="playbook-sub">How to sell {project.name} to luxury buyers</span>
          </div>
        </div>
        <p className="playbook-summary">{intelligence?.summary}</p>
        <div className="playbook-grid">
          <div className="playbook-item">
            <strong>Target Buyer Profile:</strong>
            <p>{intelligence?.targetBuyerProfile}</p>
          </div>
          <div className="playbook-item">
            <strong>Key Selling Angle:</strong>
            <p>{intelligence?.recommendedSellingAngle}</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Matrix: Builder, End-Use, Investment, Rental */}
      <div className="pillars-grid">
        {/* Pillar 1: Builder Intelligence */}
        <div className="pillar-card">
          <div className="pillar-header">
            <MdShield className="pillar-icon" />
            <h4>Builder Intelligence</h4>
          </div>
          <div className="pillar-content">
            <div className="pillar-row">
              <span className="row-label">Track Record:</span>
              <span className="row-val">{project.builderIntelligence?.deliveryTrackRecord}</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">Construction Quality:</span>
              <span className="row-val">{project.builderIntelligence?.constructionQuality}</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">Financial Health:</span>
              <span className="row-val">{project.builderIntelligence?.financialHealth}</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: End-Use Intelligence */}
        <div className="pillar-card">
          <div className="pillar-header">
            <MdApartment className="pillar-icon" />
            <h4>End-Use & Livability</h4>
          </div>
          <div className="pillar-content">
            <div className="pillar-row">
              <span className="row-label">Livability Score:</span>
              <span className="row-val highlight">{project.endUseIntelligence?.livabilityScore}/100</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">Family Score:</span>
              <span className="row-val">{project.endUseIntelligence?.familyFriendlyScore}/100</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">Acoustic Buffer:</span>
              <span className="row-val">{project.endUseIntelligence?.noiseAndPollutionRating}</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Investment Intelligence */}
        <div className="pillar-card">
          <div className="pillar-header">
            <MdTrendingUp className="pillar-icon" />
            <h4>Investment & Resale</h4>
          </div>
          <div className="pillar-content">
            <div className="pillar-row">
              <span className="row-label">3-Yr Appreciation:</span>
              <span className="row-val highlight">{project.investmentIntelligence?.threeYearAppreciation}</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">Exit Liquidity:</span>
              <span className="row-val">{project.investmentIntelligence?.exitLiquidity}</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">Resale Demand:</span>
              <span className="row-val">{project.resaleIntelligence?.demandGrade} Grade</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Rental Intelligence */}
        <div className="pillar-card">
          <div className="pillar-header">
            <MdHouse className="pillar-icon" />
            <h4>Rental Intelligence</h4>
          </div>
          <div className="pillar-content">
            <div className="pillar-row">
              <span className="row-label">Expected Yield:</span>
              <span className="row-val highlight">{project.rentalIntelligence?.expectedYield}</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">3 BHK Monthly Rent:</span>
              <span className="row-val">{project.rentalIntelligence?.monthlyRental3BHK || "Not verified"}</span>
            </div>
            <div className="pillar-row">
              <span className="row-label">Tenant Profile:</span>
              <span className="row-val">{project.rentalIntelligence?.tenantProfile}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Verified Properties in this project */}
      <div className="project-inventory-section">
        <h3 className="section-heading">Verified Available Units ({properties.length})</h3>
        {properties.length > 0 ? (
          <div className="inventory-grid">
            {properties.map((prop) => (
              <div key={prop._id} className="prop-unit-card">
                <div className="prop-unit-head">
                  <span className="unit-number">Unit {prop.unit} ({prop.tower})</span>
                  <span className="unit-price">{formatCurrency(prop.askingPrice)}</span>
                </div>
                <div className="prop-specs-row">
                  <span>{prop.bhk}</span>
                  <span>{prop.area} sqft</span>
                  <span>{prop.facing}</span>
                  <span>Floor {prop.floor}</span>
                </div>
                <div className="prop-seller-row">
                  <span>Urgency: <strong>{prop.seller?.urgency}</strong></span>
                  <span>Bottom: <strong>{formatCurrency(prop.lowestExpectedPrice)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-inventory">No active verified units currently listed for this project.</p>
        )}
      </div>

      {/* Quick Pitch Panel */}
      {showPitchModal && (
        <QuickPitchPanel
          projectId={project._id}
          isOpen={showPitchModal}
          onClose={() => setShowPitchModal(false)}
        />
      )}
    </div>
  );
};
