import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdPhone,
  MdPsychology,
  MdCheckCircle,
  MdEditNote,
  MdApartment,
  MdEdit,
  MdAdd,
  MdDeleteOutline,
  MdOpenInNew,
  MdAutoAwesome,
  MdCheck,
  MdClose
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Lead, Task, Project } from "../../types/index.js";
import { Badge } from "../../components/common/Badge.js";
import { Modal } from "../../components/common/Modal.js";
import { Skeleton } from "../../components/common/Skeleton.js";
import "./LeadProfile.css";

export const LeadProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Field notes & AI conversation analysis state
  const [callNotes, setCallNotes] = useState("");
  const [analyzingNotes, setAnalyzingNotes] = useState(false);
  const [detectedChanges, setDetectedChanges] = useState<any>(null);

  // Success Notification
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Edit Lead Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  // Add Interested / Alternative Project Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedProjectToAdd, setSelectedProjectToAdd] = useState("");
  const [projectNote, setProjectNote] = useState("");

  const [showAddAltModal, setShowAddAltModal] = useState(false);
  const [altProjectName, setAltProjectName] = useState("");
  const [altReason, setAltReason] = useState("");

  const fetchLeadData = async () => {
    try {
      const [leadRes, projsRes] = await Promise.all([
        api.get<{
          success: boolean;
          lead: Lead;
          conversations: any[];
          tasks: Task[];
        }>(`/leads/${id}`),
        api.get<{ success: boolean; projects: Project[] }>("/projects")
      ]);

      if (leadRes.success) {
        setLead(leadRes.lead);
        setConversations(leadRes.conversations);
        setTasks(leadRes.tasks);
      }
      if (projsRes.success) {
        setAllProjects(projsRes.projects);
        if (projsRes.projects.length > 0) {
          setSelectedProjectToAdd(projsRes.projects[0].name);
          setAltProjectName(projsRes.projects[0].name);
        }
      }
    } catch (err) {
      console.error("Lead profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const showNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    if (!lead) return;
    const cr = lead.clientRequirement || {} as any;
    setEditFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      budgetMin: lead.budget.min,
      budgetMax: lead.budget.max,
      purpose: lead.purpose,
      timeline: lead.timeline,
      bhk: lead.bhk?.join(", ") || "3 BHK",
      temperature: lead.temperature,
      stage: lead.stage,
      activityState: lead.activityState,
      outcome: lead.outcome,
      notes: lead.notes || "",
      // Full Client Requirement
      facing: cr.facing || lead.preferences?.facing || "Park Facing / North-East",
      floorPreference: cr.floorPreference || lead.preferences?.preferredFloor || "Middle Floor",
      furnishing: cr.furnishing || "Semi-Furnished",
      lifestyle: cr.lifestyle || "Premium Gated Community",
      preferredCorridor: cr.preferredCorridor || lead.corridor || "Dwarka Expressway",
      preferredLocation: cr.preferredLocation || "Sector 102 - 113",
      preferredSectors: cr.preferredSectors?.join(", ") || "Sector 113, Sector 104",
      possessionPreference: cr.possessionPreference || "Ready to Move",
      investmentPriority: cr.investmentPriority || "Capital safety",
      rentalPriority: cr.rentalPriority || "Consistent 4%+ rental yield",
      familyRequirement: cr.familyRequirement || lead.familyStructure || "Couple with child",
      financing: cr.financing || lead.financing || "Pre-approved Loan",
      decisionMakers: cr.decisionMakers?.join(", ") || lead.decisionMakers?.join(", ") || "Self",
      specialRequirements: cr.specialRequirements || ""
    });
    setShowEditModal(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedBudget = `₹${(editFormData.budgetMin / 10000000).toFixed(2)} Cr – ₹${(editFormData.budgetMax / 10000000).toFixed(2)} Cr`;
      const bhkArr = editFormData.bhk.split(",").map((b: string) => b.trim());
      const sectorsArr = editFormData.preferredSectors.split(",").map((s: string) => s.trim());
      const dMakersArr = editFormData.decisionMakers.split(",").map((d: string) => d.trim());

      const res = await api.put<{ success: boolean; lead: Lead }>(`/leads/${id}`, {
        name: editFormData.name,
        phone: editFormData.phone,
        email: editFormData.email,
        budget: {
          min: Number(editFormData.budgetMin),
          max: Number(editFormData.budgetMax),
          formatted: formattedBudget
        },
        purpose: editFormData.purpose,
        timeline: editFormData.timeline,
        bhk: bhkArr,
        temperature: editFormData.temperature,
        stage: editFormData.stage,
        activityState: editFormData.activityState,
        outcome: editFormData.outcome,
        notes: editFormData.notes,
        clientRequirement: {
          budgetRange: formattedBudget,
          purpose: editFormData.purpose,
          timeline: editFormData.timeline,
          bhk: bhkArr,
          areaSqft: editFormData.areaSqft || "1550 - 1800 sqft",
          facing: editFormData.facing,
          floorPreference: editFormData.floorPreference,
          furnishing: editFormData.furnishing,
          lifestyle: editFormData.lifestyle,
          preferredCorridor: editFormData.preferredCorridor,
          preferredLocation: editFormData.preferredLocation,
          preferredSectors: sectorsArr,
          possessionPreference: editFormData.possessionPreference,
          investmentPriority: editFormData.investmentPriority,
          rentalPriority: editFormData.rentalPriority,
          familyRequirement: editFormData.familyRequirement,
          mustHave: editFormData.mustHave ? editFormData.mustHave.split(",") : ["Ready to Move", "Park Facing"],
          niceToHave: editFormData.niceToHave ? editFormData.niceToHave.split(",") : ["EV Charging"],
          financing: editFormData.financing,
          decisionMakers: dMakersArr,
          specialRequirements: editFormData.specialRequirements
        }
      });

      if (res.success) {
        setShowEditModal(false);
        setLead(res.lead);
        showNotification("Lead updated successfully");
        fetchLeadData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update lead");
    }
  };

  // Direct Status Update
  const handleDirectStatusChange = async (newStage: string) => {
    try {
      const res = await api.patch<{ success: boolean; lead: Lead }>(`/leads/${id}/status`, {
        stage: newStage
      });
      if (res.success) {
        setLead(res.lead);
        showNotification(`Stage changed to ${newStage}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  // Add Interested Project
  const handleAddInterestedProject = async () => {
    if (!selectedProjectToAdd) return;
    try {
      const proj = allProjects.find(p => p.name === selectedProjectToAdd);
      const res = await api.post<{ success: boolean; lead: Lead }>(`/leads/${id}/interested-projects`, {
        projectId: proj?._id,
        projectName: selectedProjectToAdd,
        notes: projectNote
      });
      if (res.success) {
        setLead(res.lead);
        setShowAddProjectModal(false);
        setProjectNote("");
        showNotification(`Added ${selectedProjectToAdd} to interested projects`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to add project");
    }
  };

  // Remove Interested Project
  const handleRemoveInterestedProject = async (projectName: string) => {
    try {
      const res = await api.delete<{ success: boolean; lead: Lead }>(`/leads/${id}/interested-projects`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName })
      } as any);
      if (res.success) {
        setLead(res.lead);
        showNotification(`Removed ${projectName}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove project");
    }
  };

  // Add Alternative Project
  const handleAddAlternativeProject = async () => {
    if (!altProjectName) return;
    try {
      const proj = allProjects.find(p => p.name === altProjectName);
      const res = await api.post<{ success: boolean; lead: Lead }>(`/leads/${id}/alternative-projects`, {
        projectId: proj?._id,
        projectName: altProjectName,
        reason: altReason || "Recommended as strong alternative",
        whatItDoesBetter: proj?.usp?.[0] || "Competitive price point",
        whatItDoesWorse: proj?.weaknesses?.[0] || "Alternative layout",
        matchScore: 88
      });
      if (res.success) {
        setLead(res.lead);
        setShowAddAltModal(false);
        setAltReason("");
        showNotification(`Added alternative: ${altProjectName}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to add alternative project");
    }
  };

  // Remove Alternative Project
  const handleRemoveAlternativeProject = async (projectName: string) => {
    try {
      const res = await api.delete<{ success: boolean; lead: Lead }>(`/leads/${id}/alternative-projects`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName })
      } as any);
      if (res.success) {
        setLead(res.lead);
        showNotification(`Removed alternative: ${projectName}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove alternative");
    }
  };

  // AI Auto-Suggest Alternatives
  const handleAiSuggestAlternatives = async () => {
    try {
      const res = await api.get<{ success: boolean; alternatives: any[] }>(`/leads/${id}/suggest-alternatives`);
      if (res.success && res.alternatives.length > 0) {
        for (const alt of res.alternatives) {
          await api.post(`/leads/${id}/alternative-projects`, alt);
        }
        fetchLeadData();
        showNotification("AI recommended 3 alternatives based on client requirements");
      }
    } catch (err: any) {
      alert(err.message || "Failed to auto-suggest alternatives");
    }
  };

  // Analyze Conversation (Preview with [Apply Changes])
  const handlePreviewConversation = async () => {
    if (!callNotes.trim()) return;
    setAnalyzingNotes(true);
    try {
      const res = await api.post<{ success: boolean; detectedChanges: any }>(
        `/leads/${id}/analyze-conversation-preview`,
        { rawNotes: callNotes }
      );
      if (res.success) {
        setDetectedChanges(res.detectedChanges);
      }
    } catch (err: any) {
      alert(err.message || "Failed to preview conversation analysis");
    } finally {
      setAnalyzingNotes(false);
    }
  };

  const handleApplyDetectedChanges = async () => {
    if (!detectedChanges) return;
    try {
      const res = await api.post<{ success: boolean; lead: Lead }>(`/leads/${id}/conversation`, {
        rawNotes: callNotes
      });
      if (res.success) {
        setLead(res.lead);
        setCallNotes("");
        setDetectedChanges(null);
        showNotification("Applied AI detected changes and updated lead state!");
        fetchLeadData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to apply changes");
    }
  };

  if (loading) {
    return (
      <div className="lead-profile-loading">
        <Skeleton height="40px" width="260px" />
        <Skeleton height="140px" />
        <Skeleton height="280px" />
      </div>
    );
  }

  if (!lead) {
    return <div className="not-found">Lead profile not found.</div>;
  }

  const req = lead.clientRequirement || {} as any;

  return (
    <div className="lead-profile-page">
      {/* Top Header & Back Button */}
      <div className="profile-top-bar">
        <button className="back-btn" onClick={() => navigate("/leads")}>
          <MdArrowBack /> Back to Leads
        </button>
        <button className="edit-lead-btn" onClick={handleOpenEdit}>
          <MdEdit size={16} /> Edit Lead
        </button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="success-banner">
          <MdCheckCircle size={18} />
          <span>{successBanner}</span>
          <button className="banner-close" onClick={() => setSuccessBanner(null)}>
            <MdClose size={16} />
          </button>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="lead-hero-card">
        <div className="hero-main">
          <div className="hero-name-row">
            <h1 className="client-name">{lead.name}</h1>
            <div className="status-selector-wrap">
              <label>Stage:</label>
              <select
                value={lead.stage}
                onChange={(e) => handleDirectStatusChange(e.target.value)}
                className="inline-stage-select"
              >
                {["New", "Contacted", "Interested", "Exploring", "Advising", "Pitched", "Visiting", "Closing", "Won", "Lost"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <Badge label={lead.temperature} variant={lead.temperature === "Hot" ? "danger" : "warning"} />
            <Badge label={lead.outcome} variant={lead.outcome === "Active" ? "success" : "neutral"} />
          </div>

          <span className="client-contact">
            <MdPhone /> {lead.phone} {lead.email && `• ${lead.email}`}
          </span>
          <p className="client-req">
            Budget: <strong>{lead.budget?.formatted}</strong> • Purpose: <strong>{lead.purpose}</strong> • Timeline: <strong>{lead.timeline}</strong>
          </p>
        </div>

        <div className="lead-score-box">
          <span className="score-val">{lead.aiPriority?.score || 92}</span>
          <span className="score-tag">AI CLOSING PROBABILITY</span>
          <p className="score-expl">{lead.aiPriority?.explanation}</p>
        </div>
      </div>

      {/* SECTION 1: COMPLETE DEDICATED CLIENT REQUIREMENT */}
      <section className="client-requirement-card">
        <div className="section-head">
          <div className="head-title-group">
            <span className="eyebrow-tag">Comprehensive Buyer Profile</span>
            <h2 className="section-heading">CLIENT REQUIREMENT</h2>
          </div>
          <button className="edit-section-btn" onClick={handleOpenEdit}>
            <MdEdit /> Edit Requirements
          </button>
        </div>

        <p className="requirement-summary-text">
          Detailed requirement specifications captured directly from client interactions to drive AI project matching and inventory allocation.
        </p>

        <div className="requirement-fields-grid">
          <div className="req-block">
            <span className="req-label">Budget Window</span>
            <span className="req-val highlight">{lead.budget?.formatted || req.budgetRange}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Purchase Purpose</span>
            <span className="req-val">{req.purpose || lead.purpose}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Buying Timeline</span>
            <span className="req-val">{req.timeline || lead.timeline}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Configurations (BHK)</span>
            <span className="req-val">{req.bhk?.join(", ") || lead.bhk?.join(", ") || "3 BHK"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Preferred Area (Sqft)</span>
            <span className="req-val">{req.areaSqft || "1550 – 1750 sqft"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Facing Orientation</span>
            <span className="req-val">{req.facing || "Park Facing / North-East"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Floor Preference</span>
            <span className="req-val">{req.floorPreference || "Middle Floor (7th to 14th)"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Furnishing</span>
            <span className="req-val">{req.furnishing || "Semi-Furnished"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Lifestyle Style</span>
            <span className="req-val">{req.lifestyle || "Premium Gated Community"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Preferred Corridor</span>
            <span className="req-val">{req.preferredCorridor || lead.corridor || "Dwarka Expressway"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Preferred Location</span>
            <span className="req-val">{req.preferredLocation || "Sector 102 - 113"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Preferred Sectors</span>
            <span className="req-val">{req.preferredSectors?.join(", ") || "Sector 113, Sector 104"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Possession Preference</span>
            <span className="req-val">{req.possessionPreference || "Ready to Move"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Investment Priority</span>
            <span className="req-val">{req.investmentPriority || "Capital safety & High resale liquidity"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Rental Priority</span>
            <span className="req-val">{req.rentalPriority || "Consistent 4%+ rental yield"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Family Requirement</span>
            <span className="req-val">{req.familyRequirement || lead.familyStructure || "Nuclear family"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Financing Mode</span>
            <span className="req-val">{req.financing || lead.financing || "Pre-approved Loan"}</span>
          </div>

          <div className="req-block">
            <span className="req-label">Key Decision Makers</span>
            <span className="req-val">{req.decisionMakers?.join(", ") || lead.decisionMakers?.join(", ") || "Self & Family"}</span>
          </div>
        </div>

        {/* Must-Have & Nice-To-Have Chips */}
        <div className="req-chips-strip">
          <div className="chips-group">
            <span className="group-title">Must-Have Criteria:</span>
            <div className="chips-list">
              {(req.mustHave && req.mustHave.length > 0 ? req.mustHave : ["Ready to Move", "Park Facing"]).map((mh: string, idx: number) => (
                <span key={idx} className="req-chip must">{mh}</span>
              ))}
            </div>
          </div>

          <div className="chips-group">
            <span className="group-title">Nice-To-Have Criteria:</span>
            <div className="chips-list">
              {(req.niceToHave && req.niceToHave.length > 0 ? req.niceToHave : ["EV Charging point", "Double parking"]).map((nh: string, idx: number) => (
                <span key={idx} className="req-chip nice">{nh}</span>
              ))}
            </div>
          </div>
        </div>

        {req.specialRequirements && (
          <div className="special-req-box">
            <strong>Special Requirements / Field Observations:</strong>
            <p>{req.specialRequirements}</p>
          </div>
        )}
      </section>

      {/* SECTION 2 & 3: INTERESTED PROJECTS & ALTERNATIVE PROJECTS */}
      <div className="projects-dual-grid">
        {/* Interested Projects */}
        <section className="profile-section-card">
          <div className="section-head">
            <div>
              <h3 className="section-title">Interested Projects</h3>
              <span className="section-sub">Projects client has expressed active interest in</span>
            </div>
            <button className="add-mini-btn" onClick={() => setShowAddProjectModal(true)}>
              <MdAdd /> Add Project
            </button>
          </div>

          <div className="linked-projects-list">
            {lead.interestedProjects && lead.interestedProjects.length > 0 ? (
              lead.interestedProjects.map((p, idx) => {
                const projDoc = allProjects.find(ap => ap.name === p.projectName);
                return (
                  <div key={idx} className="linked-project-row">
                    <div className="proj-main-info">
                      <MdApartment className="proj-row-icon" />
                      <div>
                        <strong className="p-title">{p.projectName}</strong>
                        {p.notes && <span className="p-note">"{p.notes}"</span>}
                      </div>
                    </div>
                    <div className="row-actions">
                      {projDoc && (
                        <button
                          className="view-link-btn"
                          onClick={() => navigate(`/projects/${projDoc._id}`)}
                          title="View Project Intelligence"
                        >
                          <MdOpenInNew /> View
                        </button>
                      )}
                      <button
                        className="delete-link-btn"
                        onClick={() => handleRemoveInterestedProject(p.projectName)}
                        title="Remove"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-text">No interested projects added yet. Click 'Add Project' above.</p>
            )}
          </div>
        </section>

        {/* Alternative Projects */}
        <section className="profile-section-card">
          <div className="section-head">
            <div>
              <h3 className="section-title">Alternative Projects</h3>
              <span className="section-sub">Suggested value alternatives matching budget & config</span>
            </div>
            <div className="alt-actions-group">
              <button className="ai-suggest-btn" onClick={handleAiSuggestAlternatives} title="Auto-Suggest Alternatives with AI">
                <MdAutoAwesome /> AI Suggest
              </button>
              <button className="add-mini-btn" onClick={() => setShowAddAltModal(true)}>
                <MdAdd /> Add
              </button>
            </div>
          </div>

          <div className="alternatives-projects-list">
            {lead.alternativeProjects && lead.alternativeProjects.length > 0 ? (
              lead.alternativeProjects.map((alt, idx) => {
                const projDoc = allProjects.find(ap => ap.name === alt.projectName);
                return (
                  <div key={idx} className="alt-project-card">
                    <div className="alt-card-head">
                      <div>
                        <strong className="alt-name">{alt.projectName}</strong>
                        <span className="alt-match">{alt.matchScore || 88}% Match</span>
                      </div>
                      <div className="row-actions">
                        {projDoc && (
                          <button
                            className="view-link-btn"
                            onClick={() => navigate(`/projects/${projDoc._id}`)}
                            title="View Project Intelligence"
                          >
                            <MdOpenInNew /> View
                          </button>
                        )}
                        <button
                          className="delete-link-btn"
                          onClick={() => handleRemoveAlternativeProject(alt.projectName)}
                          title="Remove"
                        >
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </div>
                    <p className="alt-reason-text">{alt.reason}</p>
                    {alt.whatItDoesBetter && (
                      <span className="better-tag"><strong>Advantage:</strong> {alt.whatItDoesBetter}</span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="empty-text">No alternative projects logged. Click 'AI Suggest' to generate.</p>
            )}
          </div>
        </section>
      </div>

      {/* SECTION 4: WHAT TO DO NEXT & CONVERSATION FIELD NOTES */}
      <div className="profile-dual-grid">
        {/* Left Column: AI Advisor Next Action & Pitch */}
        <div className="left-strategy-column">
          <section className="profile-section-card next-action-card">
            <div className="section-head">
              <MdPsychology className="section-icon" />
              <div>
                <h3 className="section-title">What should Gaurav do next?</h3>
                <span className="section-sub">Immediate closing action plan based on buyer context</span>
              </div>
            </div>

            <div className="action-highlight-box">
              <span className="action-title-text">{lead.nextAction?.action}</span>
              <p className="action-why"><strong>Why:</strong> {lead.nextAction?.why}</p>
            </div>

            <div className="talking-points-grid">
              <div className="point-box">
                <span className="point-tag">What to Say</span>
                <p>{lead.nextAction?.whatToSay}</p>
              </div>
              <div className="point-box">
                <span className="point-tag">Diagnostic Question</span>
                <p>{lead.nextAction?.whatToAsk}</p>
              </div>
            </div>
          </section>

          {/* Conversation Notes Analyzer with [Apply Changes] */}
          <section className="profile-section-card call-notes-card">
            <div className="section-head">
              <MdEditNote className="section-icon" />
              <div>
                <h3 className="section-title">Record Call / Visit Field Notes</h3>
                <span className="section-sub">Type natural language notes. AI will extract signals for user confirmation.</span>
              </div>
            </div>

            <textarea
              rows={4}
              className="notes-textarea"
              placeholder="e.g. Sir ko project pasand aya but wife ko road ka concern tha. Budget 2.3 Cr fix hai, next Sunday free hain visit ke liye..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
            />

            <div className="notes-action-row">
              <button
                className="analyze-notes-btn"
                onClick={handlePreviewConversation}
                disabled={analyzingNotes || !callNotes.trim()}
              >
                <MdPsychology size={18} />
                <span>{analyzingNotes ? "AI Analyzing Conversation..." : "Analyze Conversation with AI"}</span>
              </button>
            </div>

            {/* AI DETECTED CHANGES PREVIEW WITH [Apply Changes] */}
            {detectedChanges && (
              <div className="detected-changes-box">
                <div className="detected-head">
                  <MdAutoAwesome />
                  <span>AI Detected Signals from Conversation</span>
                </div>
                <div className="detected-grid">
                  <div><strong>Budget:</strong> {detectedChanges.extractedData?.budget}</div>
                  <div><strong>Purpose:</strong> {detectedChanges.extractedData?.purpose}</div>
                  <div><strong>Interest:</strong> {detectedChanges.extractedData?.projectInterest}</div>
                  <div><strong>Objection:</strong> {detectedChanges.extractedData?.objection}</div>
                  <div><strong>Decision Maker:</strong> {detectedChanges.extractedData?.decisionMaker}</div>
                  <div><strong>Timeline / Visit:</strong> {detectedChanges.extractedData?.visitDate}</div>
                  <div><strong>Temperature:</strong> {detectedChanges.extractedData?.temperature}</div>
                </div>
                <div className="detected-recommended">
                  <strong>Recommended Next Action:</strong>
                  <p>{detectedChanges.recommendedNextAction}</p>
                </div>
                <div className="detected-actions">
                  <button className="apply-changes-btn" onClick={handleApplyDetectedChanges}>
                    <MdCheck size={16} /> Apply Changes to Lead
                  </button>
                  <button className="discard-btn" onClick={() => setDetectedChanges(null)}>
                    Discard
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Conversation History */}
          <section className="profile-section-card">
            <h3 className="section-title">Recorded Conversation Insights</h3>
            <div className="conversations-timeline">
              {conversations.length > 0 ? (
                conversations.map((conv, idx) => (
                  <div key={idx} className="conv-item">
                    <span className="conv-time">{new Date(conv.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <div className="conv-bubble">
                      <p className="conv-raw">"{conv.rawInput}"</p>
                      <div className="conv-extracted-strip">
                        <span>Interest: <strong>{conv.extractedData?.projectInterest}</strong></span>
                        <span>Objection: <strong>{conv.extractedData?.objection}</strong></span>
                        <span>Decision Maker: <strong>{conv.extractedData?.decisionMaker}</strong></span>
                      </div>
                      <div className="conv-next">
                        <strong>Recommended:</strong> {conv.recommendedNextAction}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-conv">No previous conversation notes logged yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Objections & Tasks */}
        <div className="right-context-column">
          <section className="profile-section-card">
            <h3 className="section-title">Current Known Objections</h3>
            <div className="objections-list">
              {lead.objections?.length > 0 ? (
                lead.objections.map((obj, idx) => (
                  <div key={idx} className="objection-pill">
                    • {obj}
                  </div>
                ))
              ) : (
                <p className="no-obj">No active blockers identified.</p>
              )}
            </div>
          </section>

          <section className="profile-section-card">
            <h3 className="section-title">Sales Tasks ({tasks.length})</h3>
            <div className="lead-tasks-list">
              {tasks.map((t) => (
                <div key={t._id} className="lead-task-item">
                  <span className="task-name">{t.title}</span>
                  <Badge label={t.status} variant={t.status === "Completed" ? "success" : "warning"} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* MODAL 1: FULL EDIT LEAD */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Lead Profile: ${lead.name}`}
          maxWidth="680px"
        >
          <form onSubmit={handleSaveEdit} className="edit-lead-modal-form">
            <div className="form-section-title">Contact & Basic Information</div>
            <div className="form-row">
              <div className="field-group">
                <label>Client Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  required
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-section-title">Budget & Timeline Requirements</div>
            <div className="form-row">
              <div className="field-group">
                <label>Min Budget (INR)</label>
                <input
                  type="number"
                  value={editFormData.budgetMin}
                  onChange={(e) => setEditFormData({ ...editFormData, budgetMin: Number(e.target.value) })}
                />
              </div>
              <div className="field-group">
                <label>Max Budget (INR)</label>
                <input
                  type="number"
                  value={editFormData.budgetMax}
                  onChange={(e) => setEditFormData({ ...editFormData, budgetMax: Number(e.target.value) })}
                />
              </div>
              <div className="field-group">
                <label>Purchase Purpose</label>
                <select
                  value={editFormData.purpose}
                  onChange={(e) => setEditFormData({ ...editFormData, purpose: e.target.value })}
                >
                  <option value="End Use">End Use</option>
                  <option value="Investment">Investment</option>
                  <option value="Rental Income">Rental Income</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Configurations (comma separated)</label>
                <input
                  type="text"
                  value={editFormData.bhk}
                  onChange={(e) => setEditFormData({ ...editFormData, bhk: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Buying Timeline</label>
                <select
                  value={editFormData.timeline}
                  onChange={(e) => setEditFormData({ ...editFormData, timeline: e.target.value })}
                >
                  <option value="< 15 Days">&lt; 15 Days</option>
                  <option value="< 30 Days">&lt; 30 Days</option>
                  <option value="1 - 3 Months">1 - 3 Months</option>
                  <option value="3 - 6 Months">3 - 6 Months</option>
                  <option value="Exploring">Exploring</option>
                </select>
              </div>
              <div className="field-group">
                <label>Possession Preference</label>
                <input
                  type="text"
                  value={editFormData.possessionPreference}
                  onChange={(e) => setEditFormData({ ...editFormData, possessionPreference: e.target.value })}
                />
              </div>
            </div>

            <div className="form-section-title">Physical Preferences & Ecosystem</div>
            <div className="form-row">
              <div className="field-group">
                <label>Facing Orientation</label>
                <input
                  type="text"
                  value={editFormData.facing}
                  onChange={(e) => setEditFormData({ ...editFormData, facing: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Floor Preference</label>
                <input
                  type="text"
                  value={editFormData.floorPreference}
                  onChange={(e) => setEditFormData({ ...editFormData, floorPreference: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Furnishing</label>
                <input
                  type="text"
                  value={editFormData.furnishing}
                  onChange={(e) => setEditFormData({ ...editFormData, furnishing: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Lifestyle Vibe</label>
                <input
                  type="text"
                  value={editFormData.lifestyle}
                  onChange={(e) => setEditFormData({ ...editFormData, lifestyle: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Financing Structure</label>
                <input
                  type="text"
                  value={editFormData.financing}
                  onChange={(e) => setEditFormData({ ...editFormData, financing: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Key Decision Makers</label>
                <input
                  type="text"
                  value={editFormData.decisionMakers}
                  onChange={(e) => setEditFormData({ ...editFormData, decisionMakers: e.target.value })}
                />
              </div>
            </div>

            <div className="form-section-title">Pipeline Stage & Priority</div>
            <div className="form-row">
              <div className="field-group">
                <label>Lifecycle Stage</label>
                <select
                  value={editFormData.stage}
                  onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value })}
                >
                  {["New", "Contacted", "Interested", "Exploring", "Advising", "Pitched", "Visiting", "Closing", "Won", "Lost"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label>Temperature</label>
                <select
                  value={editFormData.temperature}
                  onChange={(e) => setEditFormData({ ...editFormData, temperature: e.target.value })}
                >
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
              <div className="field-group">
                <label>Outcome</label>
                <select
                  value={editFormData.outcome}
                  onChange={(e) => setEditFormData({ ...editFormData, outcome: e.target.value })}
                >
                  {["Active", "Hold", "Not Interested", "Lost", "Won"].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-group">
              <label>Special Requirements & Notes</label>
              <textarea
                rows={3}
                value={editFormData.specialRequirements}
                onChange={(e) => setEditFormData({ ...editFormData, specialRequirements: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="discard-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="save-submit-btn">Save Changes to MongoDB</button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: ADD INTERESTED PROJECT */}
      {showAddProjectModal && (
        <Modal
          isOpen={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          title="Add Interested Project"
          maxWidth="460px"
        >
          <div className="quick-modal-box">
            <div className="field-group">
              <label>Select Verified Project</label>
              <select
                value={selectedProjectToAdd}
                onChange={(e) => setSelectedProjectToAdd(e.target.value)}
              >
                {allProjects.map(p => (
                  <option key={p._id} value={p.name}>{p.name} ({p.sector})</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Client Interest Notes</label>
              <input
                type="text"
                placeholder="e.g. Liked 3 BHK layout in Tower 2"
                value={projectNote}
                onChange={(e) => setProjectNote(e.target.value)}
              />
            </div>
            <button className="save-submit-btn" onClick={handleAddInterestedProject}>
              Save Interested Project
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL 3: ADD ALTERNATIVE PROJECT */}
      {showAddAltModal && (
        <Modal
          isOpen={showAddAltModal}
          onClose={() => setShowAddAltModal(false)}
          title="Add Alternative Project"
          maxWidth="480px"
        >
          <div className="quick-modal-box">
            <div className="field-group">
              <label>Select Alternative Project</label>
              <select
                value={altProjectName}
                onChange={(e) => setAltProjectName(e.target.value)}
              >
                {allProjects.map(p => (
                  <option key={p._id} value={p.name}>{p.name} ({p.sector})</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Reason as Alternative</label>
              <textarea
                rows={3}
                placeholder="Why is this recommended as an alternative?"
                value={altReason}
                onChange={(e) => setAltReason(e.target.value)}
              />
            </div>
            <button className="save-submit-btn" onClick={handleAddAlternativeProject}>
              Save Alternative Project
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
