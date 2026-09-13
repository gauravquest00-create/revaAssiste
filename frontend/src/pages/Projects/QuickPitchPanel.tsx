import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdPsychology,
  MdExpandMore,
  MdExpandLess,
  MdPhoneInTalk,
  MdMessage,
  MdQuestionAnswer,
  MdInventory2,
  MdCompareArrows,
  MdContentCopy,
  MdCheck
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Skeleton } from "../../components/common/Skeleton.js";
import { formatCurrency } from "../../utils/formatters.js";
import "./QuickPitchPanel.css";

interface QuickPitchPanelProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickPitchPanel: React.FC<QuickPitchPanelProps> = ({ projectId, isOpen, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pitch" | "qa" | "inventory" | "alternatives">("pitch");
  const [pitchType, setPitchType] = useState<"End-use" | "Investment" | "Phone" | "WhatsApp">("End-use");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !projectId) return;
    const fetchPitch = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ success: boolean; quickPitch: any }>(`/projects/${projectId}/quick-pitch`);
        if (res.success) {
          setData(res.quickPitch);
        }
      } catch (err) {
        console.error("Quick pitch fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPitch();
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const handleCopyWhatsApp = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="quick-pitch-backdrop" onClick={onClose}>
      <div className="quick-pitch-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pitch-sheet-header">
          <div className="header-meta">
            <span className="pitch-tag">Project Intelligence & Pitch Engine</span>
            <h2 className="project-title">{data?.project || "Quick Pitch"}</h2>
            <span className="project-sub">
              {data?.builder} • {data?.sector} • {data?.corridor}
            </span>
          </div>
          <button className="close-panel-btn" onClick={onClose} aria-label="Close panel">
            <MdClose size={22} />
          </button>
        </div>

        {loading ? (
          <div className="pitch-loading-state">
            <Skeleton height="32px" width="50%" />
            <Skeleton height="90px" />
            <Skeleton height="240px" />
          </div>
        ) : (
          <div className="pitch-sheet-body">
            {/* AI Match & Selling Hook */}
            <div className="pitch-selling-hook">
              <div className="hook-badge">
                <MdPsychology size={16} />
                <span>Recommended Selling Hook</span>
              </div>
              <p className="hook-text">{data?.recommendedSellingAngle}</p>
              <div className="hook-stats">
                <span className="stat-pill">Price: <strong>{data?.priceRange}</strong></span>
                <span className="stat-pill">Yield: <strong>{data?.rentalYield}</strong></span>
                <span className="stat-pill">Appreciation: <strong>{data?.marketTrend}</strong></span>
                <span className="stat-pill status">Status: <strong>{data?.projectStatus}</strong></span>
              </div>
            </div>

            {/* Responsive Tab Bar */}
            <div className="pitch-tabs-container">
              <div className="pitch-tabs-row">
                <button
                  className={`pitch-tab ${activeTab === "pitch" ? "active" : ""}`}
                  onClick={() => setActiveTab("pitch")}
                >
                  <MdPhoneInTalk size={16} />
                  <span>Sales Pitches</span>
                </button>
                <button
                  className={`pitch-tab ${activeTab === "qa" ? "active" : ""}`}
                  onClick={() => setActiveTab("qa")}
                >
                  <MdQuestionAnswer size={16} />
                  <span>Client FAQ ({data?.clientQuestions?.length || 0})</span>
                </button>
                <button
                  className={`pitch-tab ${activeTab === "inventory" ? "active" : ""}`}
                  onClick={() => setActiveTab("inventory")}
                >
                  <MdInventory2 size={16} />
                  <span>Inventory ({data?.linkedProperties?.length || 0})</span>
                </button>
                <button
                  className={`pitch-tab ${activeTab === "alternatives" ? "active" : ""}`}
                  onClick={() => setActiveTab("alternatives")}
                >
                  <MdCompareArrows size={16} />
                  <span>Alternatives</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Sales Pitches */}
            {activeTab === "pitch" && (
              <div className="tab-pane pitch-tab-pane">
                <div className="pitch-types-selector">
                  {(["End-use", "Investment", "Phone", "WhatsApp"] as const).map((t) => (
                    <button
                      key={t}
                      className={`type-chip ${pitchType === t ? "active" : ""}`}
                      onClick={() => setPitchType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="pitch-script-box">
                  {pitchType === "WhatsApp" ? (
                    <div className="whatsapp-box">
                      <div className="whatsapp-header">
                        <div className="wa-title">
                          <MdMessage className="wa-icon" />
                          <span>WhatsApp Direct Script (No Emoji)</span>
                        </div>
                        <button
                          className="copy-btn"
                          onClick={() => handleCopyWhatsApp(data?.salesPitch?.whatsAppPitch)}
                        >
                          {copied ? (
                            <>
                              <MdCheck size={14} /> Copied!
                            </>
                          ) : (
                            <>
                              <MdContentCopy size={14} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="script-content-wrapper">
                        <pre className="script-text pre-wrap">{data?.salesPitch?.whatsAppPitch}</pre>
                      </div>
                    </div>
                  ) : pitchType === "Phone" ? (
                    <div className="phone-box">
                      <div className="box-tag">
                        <MdPhoneInTalk /> 30-Second Phone Hook
                      </div>
                      <p className="script-text">{data?.salesPitch?.shortPhonePitch}</p>
                      <div className="closing-question-box">
                        <strong>Trial Closing Question:</strong>
                        <p>{data?.salesPitch?.siteVisitClosingQuestion}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="standard-pitch-box">
                      <div className="pitch-section">
                        <span className="box-tag">Verbal Conversation Hook</span>
                        <p className="script-text">{data?.salesPitch?.verbalOpening}</p>
                      </div>
                      <div className="pitch-section">
                        <span className="box-tag">Core Value Logic</span>
                        <p className="script-text">{data?.salesPitch?.coreValueProposition}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Client Questions Accordion */}
            {activeTab === "qa" && (
              <div className="tab-pane qa-tab-pane">
                <p className="qa-intro">
                  Anticipated client objections and questions for {data?.project}. Tap each question to view the project-specific response.
                </p>
                <div className="faq-accordions">
                  {data?.clientQuestions?.map((item: any, idx: number) => {
                    const isExpanded = expandedFaq === idx;
                    return (
                      <div key={idx} className={`faq-accordion-item ${isExpanded ? "expanded" : ""}`}>
                        <button
                          className="faq-question-btn"
                          onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                        >
                          <span className="q-text">{item.question}</span>
                          <span className="q-icon">
                            {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                          </span>
                        </button>
                        {isExpanded && (
                          <div className="faq-answer-panel">
                            <p>{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Available Inventory */}
            {activeTab === "inventory" && (
              <div className="tab-pane inventory-tab-pane">
                {data?.linkedProperties?.length > 0 ? (
                  <div className="inventory-cards-list">
                    {data.linkedProperties.map((p: any) => (
                      <div key={p._id} className="quick-inventory-card">
                        <div className="inv-top">
                          <span className="unit-id">{p.unit} ({p.tower})</span>
                          <span className="unit-price">{formatCurrency(p.askingPrice)}</span>
                        </div>
                        <div className="inv-specs">
                          <span className="spec-badge">{p.bhk}</span>
                          <span className="spec-badge">{p.area} sqft</span>
                          <span className="spec-badge">{p.facing}</span>
                          <span className="spec-badge">Floor {p.floor}</span>
                        </div>
                        <div className="inv-notes">
                          <span>Urgency: <strong>{p.seller?.urgency || "Moderate"}</strong></span>
                          <span>Expected: <strong>{formatCurrency(p.expectedPrice)}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-panel-state">
                    <p>No verified inventory units currently listed for this project.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Alternative Projects */}
            {activeTab === "alternatives" && (
              <div className="tab-pane alternatives-tab-pane">
                <div className="alternatives-list">
                  {data?.alternativeProjects?.map((alt: any, idx: number) => (
                    <div key={idx} className="alternative-card">
                      <div className="alt-head">
                        <h4 className="alt-title">{alt.projectName}</h4>
                        <span className="alt-badge">Alternative Project</span>
                      </div>
                      <p className="alt-reason">{alt.reason}</p>
                      <div className="alt-comparison-grid">
                        <div className="alt-comp-item better">
                          <strong>What it does better:</strong>
                          <p>{alt.whatItDoesBetter || "Competitive entry price."}</p>
                        </div>
                        <div className="alt-comp-item worse">
                          <strong>What it does worse:</strong>
                          <p>{alt.whatItDoesWorse || "Different micro-market density."}</p>
                        </div>
                      </div>
                      <div className="alt-ideal">
                        <strong>Ideal For:</strong> {alt.idealFor || "Value-conscious luxury buyers."}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
