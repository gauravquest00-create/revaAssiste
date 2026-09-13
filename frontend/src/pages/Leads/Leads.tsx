import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdSearch,
  MdPhone,
  MdCheckCircle,
  MdEdit,
  MdPhoneInTalk,
  MdPlace,
  MdEditNote,
  MdChangeCircle,
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Lead, Project } from "../../types/index.js";
import { Badge } from "../../components/common/Badge.js";
import { Modal } from "../../components/common/Modal.js";
import { Skeleton } from "../../components/common/Skeleton.js";
import "./Leads.css";

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState("All");
  const [tempFilter, setTempFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [quickActionLead, setQuickActionLead] = useState<Lead | null>(null);
  const [quickActionType, setQuickActionType] = useState<"status" | "followup" | "visit" | "note" | "edit" | null>(null);

  // Quick Action Form States
  const [statusForm, setStatusForm] = useState({ stage: "", temperature: "", activityState: "", outcome: "" });
  const [followUpForm, setFollowUpForm] = useState({ date: new Date().toISOString().split("T")[0], time: "11:00 AM", channel: "Call", reason: "" });
  const [visitForm, setVisitForm] = useState({ date: new Date().toISOString().split("T")[0], time: "11:30 AM", projectName: "Tata La Vida", location: "Dwarka Expressway", attendees: "" });
  const [noteForm, setNoteForm] = useState("");
  const [editForm, setEditForm] = useState<any>({});

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    budgetMin: 20000000,
    budgetMax: 25000000,
    purpose: "End Use",
    preferredProjects: "Tata La Vida, Hero Homes",
    bhk: "3 BHK",
    timeline: "< 30 Days",
    temperature: "Hot",
    notes: ""
  });

  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const [leadsRes, projsRes] = await Promise.all([
        api.get<{ success: boolean; leads: Lead[] }>("/leads"),
        api.get<{ success: boolean; projects: Project[] }>("/projects")
      ]);
      if (leadsRes.success) setLeads(leadsRes.leads);
      if (projsRes.success) setProjects(projsRes.projects);
    } catch (err) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedBudget = `₹${(newLead.budgetMin / 10000000).toFixed(2)} Cr – ₹${(newLead.budgetMax / 10000000).toFixed(2)} Cr`;
      const prefProjects = newLead.preferredProjects.split(",").map(p => p.trim());

      const res = await api.post<{ success: boolean; lead: Lead }>("/leads", {
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email,
        budget: {
          min: Number(newLead.budgetMin),
          max: Number(newLead.budgetMax),
          formatted: formattedBudget
        },
        purpose: newLead.purpose,
        preferredProjects: prefProjects,
        bhk: [newLead.bhk],
        timeline: newLead.timeline,
        temperature: newLead.temperature,
        notes: newLead.notes
      });

      if (res.success) {
        setShowAddModal(false);
        fetchLeads();
      }
    } catch (err: any) {
      alert(err.message || "Failed to create lead");
    }
  };

  // Open quick action modal
  const openQuickAction = (e: React.MouseEvent, lead: Lead, type: "status" | "followup" | "visit" | "note" | "edit") => {
    e.stopPropagation();
    setQuickActionLead(lead);
    setQuickActionType(type);

    if (type === "status") {
      setStatusForm({
        stage: lead.stage,
        temperature: lead.temperature,
        activityState: lead.activityState,
        outcome: lead.outcome
      });
    } else if (type === "followup") {
      setFollowUpForm({
        date: new Date().toISOString().split("T")[0],
        time: "11:00 AM",
        channel: "Call",
        reason: `Follow up with ${lead.name} regarding property inventory`
      });
    } else if (type === "visit") {
      setVisitForm({
        date: new Date().toISOString().split("T")[0],
        time: "11:30 AM",
        projectName: lead.preferredProjects?.[0] || "Tata La Vida",
        location: `${lead.preferredProjects?.[0] || "Tata La Vida"}, Sector 113, Dwarka Expressway`,
        attendees: `${lead.name}, Gaurav Verma`
      });
    } else if (type === "note") {
      setNoteForm("");
    } else if (type === "edit") {
      setEditForm({
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
        notes: lead.notes || ""
      });
    }
  };

  // Submit quick actions
  const handleQuickStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActionLead) return;
    try {
      const res = await api.patch<{ success: boolean }>(`/leads/${quickActionLead._id}/status`, statusForm);
      if (res.success) {
        setQuickActionType(null);
        fetchLeads();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleQuickFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActionLead) return;
    try {
      const res = await api.post<{ success: boolean }>("/followups", {
        lead: quickActionLead._id,
        leadName: quickActionLead.name,
        date: new Date(followUpForm.date),
        time: followUpForm.time,
        channel: followUpForm.channel,
        reason: followUpForm.reason,
        status: "Scheduled"
      });
      if (res.success) {
        alert("Follow-up added successfully!");
        setQuickActionType(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to add follow-up");
    }
  };

  const handleQuickVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActionLead) return;
    try {
      const res = await api.post<{ success: boolean }>("/visits", {
        lead: quickActionLead._id,
        leadName: quickActionLead.name,
        projectName: visitForm.projectName,
        date: new Date(visitForm.date),
        time: visitForm.time,
        location: visitForm.location,
        attendees: visitForm.attendees.split(",").map(a => a.trim()),
        status: "Scheduled"
      });
      if (res.success) {
        alert("Site Visit scheduled successfully!");
        setQuickActionType(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to schedule visit");
    }
  };

  const handleQuickNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActionLead || !noteForm.trim()) return;
    try {
      const res = await api.post<{ success: boolean }>(`/leads/${quickActionLead._id}/conversation`, {
        rawNotes: noteForm
      });
      if (res.success) {
        alert("Note recorded & AI analyzed successfully!");
        setQuickActionType(null);
        fetchLeads();
      }
    } catch (err: any) {
      alert(err.message || "Failed to save note");
    }
  };

  const handleQuickEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActionLead) return;
    try {
      const formattedBudget = `₹${(editForm.budgetMin / 10000000).toFixed(2)} Cr – ₹${(editForm.budgetMax / 10000000).toFixed(2)} Cr`;
      const res = await api.put<{ success: boolean }>(`/leads/${quickActionLead._id}`, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        budget: {
          min: Number(editForm.budgetMin),
          max: Number(editForm.budgetMax),
          formatted: formattedBudget
        },
        purpose: editForm.purpose,
        timeline: editForm.timeline,
        bhk: editForm.bhk.split(",").map((b: string) => b.trim()),
        temperature: editForm.temperature,
        stage: editForm.stage,
        activityState: editForm.activityState,
        outcome: editForm.outcome,
        notes: editForm.notes
      });
      if (res.success) {
        alert("Lead updated successfully");
        setQuickActionType(null);
        fetchLeads();
      }
    } catch (err: any) {
      alert(err.message || "Failed to edit lead");
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (stageFilter !== "All" && l.stage !== stageFilter) return false;
    if (tempFilter !== "All" && l.temperature !== tempFilter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search)) return false;
    return true;
  });

  return (
    <div className="leads-page">
      <div className="leads-header-row">
        <div>
          <h1 className="leads-title">Client Leads & Sales Pipeline</h1>
          <p className="leads-sub">
            AI-Prioritized buyers • One-click quick actions • Instant follow-ups & visits
          </p>
        </div>
        <button className="add-lead-btn" onClick={() => setShowAddModal(true)}>
          <MdAdd size={18} /> New Lead
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="leads-filter-tabs">
        <div className="filter-group">
          <span className="filter-title">Lifecycle:</span>
          {["All", "Exploring", "Advising", "Visiting", "Closing", "Won", "Lost"].map((st) => (
            <button
              key={st}
              className={`pill-tab ${stageFilter === st ? "active" : ""}`}
              onClick={() => setStageFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-title">Temperature:</span>
          {["All", "Hot", "Warm", "Cold"].map((temp) => (
            <button
              key={temp}
              className={`pill-tab ${tempFilter === temp ? "active" : ""}`}
              onClick={() => setTempFilter(temp)}
            >
              {temp}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="leads-search-box">
        <MdSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by client name or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Leads List Cards with QUICK ACTIONS */}
      <div className="leads-grid">
        {loading ? (
          <>
            <Skeleton height="180px" />
            <Skeleton height="180px" />
            <Skeleton height="180px" />
          </>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="lead-card"
              onClick={() => navigate(`/leads/${lead._id}`)}
            >
              <div className="lead-card-header">
                <div>
                  <h3 className="lead-client-name">{lead.name}</h3>
                  <span className="lead-phone-line">
                    <MdPhone size={13} /> {lead.phone}
                  </span>
                </div>
                <div className="lead-score-badge">
                  <span className="score-num">{lead.aiPriority?.score || 85}</span>
                  <span className="score-text">AI SCORE</span>
                </div>
              </div>

              <div className="lead-meta-strip">
                <span className="budget-tag">{lead.budget?.formatted}</span>
                <span className="purpose-tag">{lead.purpose}</span>
                <Badge
                  label={lead.temperature}
                  variant={lead.temperature === "Hot" ? "danger" : lead.temperature === "Warm" ? "warning" : "neutral"}
                />
                <Badge label={lead.stage} variant="primary" />
              </div>

              <div className="lead-projects-pref">
                <strong>Interested:</strong> {lead.preferredProjects?.join(", ") || "Dwarka Expressway"}
              </div>

              <div className="lead-ai-next-step">
                <MdCheckCircle className="step-icon" />
                <div className="step-content">
                  <span className="step-label">Next Action:</span>
                  <span className="step-text">{lead.nextAction?.action}</span>
                </div>
              </div>

              {/* QUICK ACTIONS ROW */}
              <div className="lead-quick-actions-row" onClick={(e) => e.stopPropagation()}>
                <button
                  className="quick-act-btn status"
                  title="Change Status"
                  onClick={(e) => openQuickAction(e, lead, "status")}
                >
                  <MdChangeCircle size={15} /> Status
                </button>
                <button
                  className="quick-act-btn followup"
                  title="Add Follow-up"
                  onClick={(e) => openQuickAction(e, lead, "followup")}
                >
                  <MdPhoneInTalk size={15} /> Follow-up
                </button>
                <button
                  className="quick-act-btn visit"
                  title="Schedule Visit"
                  onClick={(e) => openQuickAction(e, lead, "visit")}
                >
                  <MdPlace size={15} /> Visit
                </button>
                <button
                  className="quick-act-btn note"
                  title="Add Field Note"
                  onClick={(e) => openQuickAction(e, lead, "note")}
                >
                  <MdEditNote size={15} /> Note
                </button>
                <button
                  className="quick-act-btn edit"
                  title="Edit Lead"
                  onClick={(e) => openQuickAction(e, lead, "edit")}
                >
                  <MdEdit size={15} /> Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QUICK ACTION MODALS */}
      {/* 1. Status Modal */}
      {quickActionType === "status" && quickActionLead && (
        <Modal
          isOpen={Boolean(quickActionType === "status")}
          onClose={() => setQuickActionType(null)}
          title={`Update Status: ${quickActionLead.name}`}
          maxWidth="460px"
        >
          <form onSubmit={handleQuickStatusSubmit} className="quick-action-form">
            <div className="field-group">
              <label>Lifecycle Stage</label>
              <select
                value={statusForm.stage}
                onChange={(e) => setStatusForm({ ...statusForm, stage: e.target.value })}
              >
                {["New", "Contacted", "Interested", "Exploring", "Advising", "Pitched", "Visiting", "Closing", "Won", "Lost"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Temperature</label>
              <select
                value={statusForm.temperature}
                onChange={(e) => setStatusForm({ ...statusForm, temperature: e.target.value })}
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
            <div className="field-group">
              <label>Activity State</label>
              <select
                value={statusForm.activityState}
                onChange={(e) => setStatusForm({ ...statusForm, activityState: e.target.value })}
              >
                {["Follow-up", "Scheduled", "Visit", "Awaiting Response", "Negotiation"].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Outcome</label>
              <select
                value={statusForm.outcome}
                onChange={(e) => setStatusForm({ ...statusForm, outcome: e.target.value })}
              >
                {["Active", "Hold", "Not Interested", "Lost", "Won"].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="action-submit-btn">Update Status</button>
          </form>
        </Modal>
      )}

      {/* 2. Quick Follow-Up Modal */}
      {quickActionType === "followup" && quickActionLead && (
        <Modal
          isOpen={Boolean(quickActionType === "followup")}
          onClose={() => setQuickActionType(null)}
          title={`Add Follow-up: ${quickActionLead.name}`}
          maxWidth="460px"
        >
          <form onSubmit={handleQuickFollowUpSubmit} className="quick-action-form">
            <div className="field-group">
              <label>Date</label>
              <input
                type="date"
                required
                value={followUpForm.date}
                onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label>Time</label>
              <input
                type="text"
                required
                value={followUpForm.time}
                onChange={(e) => setFollowUpForm({ ...followUpForm, time: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label>Channel</label>
              <select
                value={followUpForm.channel}
                onChange={(e) => setFollowUpForm({ ...followUpForm, channel: e.target.value })}
              >
                <option value="Call">Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="Visit">Visit</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
            <div className="field-group">
              <label>Reason / Discussion Objective</label>
              <textarea
                rows={3}
                required
                value={followUpForm.reason}
                onChange={(e) => setFollowUpForm({ ...followUpForm, reason: e.target.value })}
              />
            </div>
            <button type="submit" className="action-submit-btn">Schedule Follow-up</button>
          </form>
        </Modal>
      )}

      {/* 3. Quick Visit Modal */}
      {quickActionType === "visit" && quickActionLead && (
        <Modal
          isOpen={Boolean(quickActionType === "visit")}
          onClose={() => setQuickActionType(null)}
          title={`Schedule Site Visit: ${quickActionLead.name}`}
          maxWidth="480px"
        >
          <form onSubmit={handleQuickVisitSubmit} className="quick-action-form">
            <div className="field-group">
              <label>Target Project</label>
              <select
                value={visitForm.projectName}
                onChange={(e) => setVisitForm({ ...visitForm, projectName: e.target.value })}
              >
                {projects.map(p => (
                  <option key={p._id} value={p.name}>{p.name} ({p.sector})</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="field-group">
                <label>Date</label>
                <input
                  type="date"
                  required
                  value={visitForm.date}
                  onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Time</label>
                <input
                  type="text"
                  required
                  value={visitForm.time}
                  onChange={(e) => setVisitForm({ ...visitForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="field-group">
              <label>Meeting Location</label>
              <input
                type="text"
                required
                value={visitForm.location}
                onChange={(e) => setVisitForm({ ...visitForm, location: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label>Attendees (comma separated)</label>
              <input
                type="text"
                value={visitForm.attendees}
                onChange={(e) => setVisitForm({ ...visitForm, attendees: e.target.value })}
              />
            </div>
            <button type="submit" className="action-submit-btn">Confirm Site Visit</button>
          </form>
        </Modal>
      )}

      {/* 4. Quick Field Note Modal */}
      {quickActionType === "note" && quickActionLead && (
        <Modal
          isOpen={Boolean(quickActionType === "note")}
          onClose={() => setQuickActionType(null)}
          title={`Add Note for ${quickActionLead.name}`}
          maxWidth="500px"
        >
          <form onSubmit={handleQuickNoteSubmit} className="quick-action-form">
            <p className="note-hint">Enter field notes. AI will extract signals, update objections and refresh next actions.</p>
            <textarea
              rows={4}
              required
              placeholder="e.g. Spoke to Rahul. Budget is 2.3 Cr max, wife likes green views. Wants to visit this Saturday morning."
              value={noteForm}
              onChange={(e) => setNoteForm(e.target.value)}
            />
            <button type="submit" className="action-submit-btn">Analyze & Save Note</button>
          </form>
        </Modal>
      )}

      {/* 5. Quick Edit Lead Modal */}
      {quickActionType === "edit" && quickActionLead && (
        <Modal
          isOpen={Boolean(quickActionType === "edit")}
          onClose={() => setQuickActionType(null)}
          title={`Edit Lead: ${quickActionLead.name}`}
          maxWidth="580px"
        >
          <form onSubmit={handleQuickEditSubmit} className="quick-action-form">
            <div className="form-row">
              <div className="field-group">
                <label>Client Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Phone</label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Min Budget (INR)</label>
                <input
                  type="number"
                  value={editForm.budgetMin}
                  onChange={(e) => setEditForm({ ...editForm, budgetMin: Number(e.target.value) })}
                />
              </div>
              <div className="field-group">
                <label>Max Budget (INR)</label>
                <input
                  type="number"
                  value={editForm.budgetMax}
                  onChange={(e) => setEditForm({ ...editForm, budgetMax: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Purpose</label>
                <select
                  value={editForm.purpose}
                  onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                >
                  <option value="End Use">End Use</option>
                  <option value="Investment">Investment</option>
                  <option value="Rental Income">Rental Income</option>
                </select>
              </div>
              <div className="field-group">
                <label>Timeline</label>
                <select
                  value={editForm.timeline}
                  onChange={(e) => setEditForm({ ...editForm, timeline: e.target.value })}
                >
                  <option value="< 15 Days">&lt; 15 Days</option>
                  <option value="< 30 Days">&lt; 30 Days</option>
                  <option value="1 - 3 Months">1 - 3 Months</option>
                  <option value="3 - 6 Months">3 - 6 Months</option>
                  <option value="Exploring">Exploring</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Stage</label>
                <select
                  value={editForm.stage}
                  onChange={(e) => setEditForm({ ...editForm, stage: e.target.value })}
                >
                  {["New", "Contacted", "Interested", "Exploring", "Advising", "Pitched", "Visiting", "Closing", "Won", "Lost"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label>Temperature</label>
                <select
                  value={editForm.temperature}
                  onChange={(e) => setEditForm({ ...editForm, temperature: e.target.value })}
                >
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label>Notes</label>
              <textarea
                rows={3}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="action-submit-btn">Save Changes to MongoDB</button>
          </form>
        </Modal>
      )}

      {/* Add Lead Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Capture New Client Requirement"
        maxWidth="580px"
      >
        <form onSubmit={handleCreateLead} className="add-lead-form">
          <div className="form-row">
            <div className="field-group">
              <label>Client Name</label>
              <input
                type="text"
                required
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div className="field-group">
              <label>Phone Number</label>
              <input
                type="text"
                required
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="+91 98102 34567"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field-group">
              <label>Min Budget (INR)</label>
              <input
                type="number"
                value={newLead.budgetMin}
                onChange={(e) => setNewLead({ ...newLead, budgetMin: Number(e.target.value) })}
                required
              />
            </div>
            <div className="field-group">
              <label>Max Budget (INR)</label>
              <input
                type="number"
                value={newLead.budgetMax}
                onChange={(e) => setNewLead({ ...newLead, budgetMax: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field-group">
              <label>Purpose</label>
              <select
                value={newLead.purpose}
                onChange={(e) => setNewLead({ ...newLead, purpose: e.target.value })}
              >
                <option value="End Use">End Use</option>
                <option value="Investment">Investment</option>
                <option value="Rental Income">Rental Income</option>
              </select>
            </div>
            <div className="field-group">
              <label>Configuration</label>
              <select
                value={newLead.bhk}
                onChange={(e) => setNewLead({ ...newLead, bhk: e.target.value })}
              >
                <option value="2 BHK">2 BHK</option>
                <option value="2.5 BHK">2.5 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="3.5 BHK">3.5 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label>Preferred Projects (comma separated)</label>
            <input
              type="text"
              value={newLead.preferredProjects}
              onChange={(e) => setNewLead({ ...newLead, preferredProjects: e.target.value })}
              placeholder="Tata La Vida, Hero Homes"
            />
          </div>

          <div className="field-group">
            <label>Notes / Call Summary</label>
            <textarea
              rows={3}
              value={newLead.notes}
              onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
              placeholder="Client visited Tata La Vida; wife prefers park-facing unit..."
            />
          </div>

          <button type="submit" className="submit-lead-btn">Save Lead & Run AI Diagnostic</button>
        </form>
      </Modal>
    </div>
  );
};
