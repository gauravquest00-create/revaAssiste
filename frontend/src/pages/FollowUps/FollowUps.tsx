import React, { useState, useEffect } from "react";
import {
  MdPhoneInTalk,
  MdMessage,
  MdEmail,
  MdPlace,
  MdAccessTime,
  MdAdd,
  MdEdit,
  MdCalendarMonth,
  MdDeleteOutline,
  MdApartment,
  MdHouse,
} from "react-icons/md";
import { api } from "../../services/api.js";
import { FollowUp, Lead, Project, Property } from "../../types/index.js";
import { Modal } from "../../components/common/Modal.js";
import { formatDate } from "../../utils/formatters.js";
import "./FollowUps.css";

export const FollowUps: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [reschedulingFollowUp, setReschedulingFollowUp] = useState<FollowUp | null>(null);
  const [, setViewingFollowUp] = useState<FollowUp | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    lead: "",
    project: "",
    property: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:30 AM",
    channel: "Call" as any,
    type: "Follow-up",
    reason: "",
    notes: "",
    status: "Scheduled" as any
  });

  const [rescheduleData, setRescheduleData] = useState({
    date: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0],
    time: "11:00 AM",
    reason: "Client requested later time slot"
  });

  const fetchData = async () => {
    try {
      const [fuRes, lRes, pRes, prRes] = await Promise.all([
        api.get<{ success: boolean; followUps: FollowUp[] }>("/followups"),
        api.get<{ success: boolean; leads: Lead[] }>("/leads"),
        api.get<{ success: boolean; projects: Project[] }>("/projects"),
        api.get<{ success: boolean; properties: Property[] }>("/properties")
      ]);
      if (fuRes.success) setFollowUps(fuRes.followUps);
      if (lRes.success) setLeads(lRes.leads);
      if (pRes.success) setProjects(pRes.projects);
      if (prRes.success) setProperties(prRes.properties);
    } catch (err) {
      console.error("Fetch followups error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      lead: "",
      project: "",
      property: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:30 AM",
      channel: "Call",
      type: "Follow-up",
      reason: "",
      notes: "",
      status: "Scheduled"
    });
    setShowAddModal(true);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matchedLead = leads.find(l => l._id === formData.lead);
      const matchedProj = projects.find(p => p._id === formData.project);
      const matchedProp = properties.find(pr => pr._id === formData.property);

      const payload = {
        ...formData,
        lead: formData.lead || undefined,
        leadName: matchedLead ? matchedLead.name : "None / Standalone",
        project: formData.project || undefined,
        projectName: matchedProj ? matchedProj.name : "None",
        property: formData.property || undefined,
        propertyUnit: matchedProp ? matchedProp.unit : "None",
        date: new Date(formData.date)
      };

      if (editingFollowUp) {
        await api.put(`/followups/${editingFollowUp._id}`, payload);
      } else {
        await api.post("/followups", payload);
      }

      setShowAddModal(false);
      setEditingFollowUp(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save follow-up");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/followups/${id}/status`, { status });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingFollowUp) return;
    try {
      await api.patch(`/followups/${reschedulingFollowUp._id}/reschedule`, rescheduleData);
      setReschedulingFollowUp(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to reschedule follow-up");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and remove this follow-up?")) return;
    try {
      await api.delete(`/followups/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete follow-up");
    }
  };

  const filtered = followUps.filter((f) => {
    if (statusFilter !== "All" && f.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="followups-page">
      <div className="followups-header-row">
        <div>
          <h1 className="followups-title">Follow-up Management</h1>
          <p className="followups-sub">
            Track client calls, inventory checks, and price negotiations • Standalone & Linked
          </p>
        </div>
        <button className="add-followup-btn" onClick={handleOpenAdd}>
          <MdAdd size={18} /> New Follow-up
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="followups-filter-tabs">
        <span className="filter-label">Filter by Status:</span>
        {["All", "Scheduled", "Completed", "Pending", "Rescheduled", "Cancelled", "Missed"].map((st) => (
          <button
            key={st}
            className={`status-pill ${statusFilter === st ? "active" : ""}`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Follow-up Cards List */}
      <div className="followups-list">
        {filtered.map((fu) => (
          <div key={fu._id} className="followup-card" onClick={() => setViewingFollowUp(fu)}>
            <div className="followup-top">
              <div className="client-entity-meta">
                <h3 className="client-title">{fu.leadName}</h3>
                <div className="entity-tags-row">
                  <span className="channel-pill">
                    {fu.channel === "Call" && <MdPhoneInTalk />}
                    {fu.channel === "WhatsApp" && <MdMessage />}
                    {fu.channel === "Email" && <MdEmail />}
                    {fu.channel === "Visit" && <MdPlace />}
                    {fu.channel}
                  </span>
                  {fu.projectName && fu.projectName !== "None" && (
                    <span className="entity-badge proj"><MdApartment /> {fu.projectName}</span>
                  )}
                  {fu.propertyUnit && fu.propertyUnit !== "None" && (
                    <span className="entity-badge prop"><MdHouse /> Unit {fu.propertyUnit}</span>
                  )}
                </div>
              </div>

              <div className="status-badge-wrap" onClick={(e) => e.stopPropagation()}>
                <select
                  value={fu.status}
                  onChange={(e) => handleStatusChange(fu._id, e.target.value)}
                  className={`status-dropdown-select status-${fu.status.toLowerCase()}`}
                >
                  {["Scheduled", "Completed", "Pending", "Rescheduled", "Cancelled", "Missed"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="followup-reason">
              <strong>Objective:</strong> {fu.reason}
            </div>

            <div className="followup-schedule-time">
              <span><MdAccessTime /> {formatDate(fu.date)} at {fu.time}</span>
              {fu.notes && <span className="notes-preview">Notes: {fu.notes}</span>}
            </div>

            <div className="followup-actions-row" onClick={(e) => e.stopPropagation()}>
              <button
                className="action-link-btn reschedule"
                onClick={() => setReschedulingFollowUp(fu)}
              >
                <MdCalendarMonth /> Reschedule
              </button>
              <button
                className="action-link-btn edit"
                onClick={() => {
                  setEditingFollowUp(fu);
                  setFormData({
                    lead: (fu.lead as any) || "",
                    project: (fu.project as any) || "",
                    property: (fu.property as any) || "",
                    date: new Date(fu.date).toISOString().split("T")[0],
                    time: fu.time,
                    channel: fu.channel,
                    type: fu.type || "Follow-up",
                    reason: fu.reason,
                    notes: fu.notes || "",
                    status: fu.status
                  });
                  setShowAddModal(true);
                }}
              >
                <MdEdit /> Edit
              </button>
              <button
                className="action-link-btn delete"
                onClick={() => handleDelete(fu._id)}
              >
                <MdDeleteOutline /> Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); setEditingFollowUp(null); }}
          title={editingFollowUp ? "Edit Follow-up" : "Schedule New Follow-up"}
          maxWidth="520px"
        >
          <form onSubmit={handleCreateOrUpdate} className="followup-form">
            <p className="helper-note">
              Note: A follow-up can be attached to a Lead, Property, Project, or created as a standalone action.
            </p>

            <div className="field-group">
              <label>Select Lead (Optional)</label>
              <select
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
              >
                <option value="">None (Standalone / Seller / Team)</option>
                {leads.map(l => (
                  <option key={l._id} value={l._id}>{l.name} ({l.phone})</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Target Project (Optional)</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  <option value="">None</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.sector})</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Target Property Unit (Optional)</label>
                <select
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                >
                  <option value="">None</option>
                  {properties.map(pr => (
                    <option key={pr._id} value={pr._id}>{pr.unit} ({pr.projectName})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Time</label>
                <input
                  type="text"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Visit">Visit</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label>Reason / Objective</label>
              <input
                type="text"
                required
                placeholder="e.g. Call seller regarding price negotiation or Follow-up with client on site visit"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Notes / Preparation Checklist</label>
              <textarea
                rows={3}
                placeholder="Key talking points or expected counter-offers..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn">
              {editingFollowUp ? "Update Follow-up" : "Save Follow-up"}
            </button>
          </form>
        </Modal>
      )}

      {/* RESCHEDULE MODAL */}
      {reschedulingFollowUp && (
        <Modal
          isOpen={Boolean(reschedulingFollowUp)}
          onClose={() => setReschedulingFollowUp(null)}
          title={`Reschedule Follow-up: ${reschedulingFollowUp.reason}`}
          maxWidth="460px"
        >
          <form onSubmit={handleRescheduleSubmit} className="followup-form">
            <div className="form-row">
              <div className="field-group">
                <label>New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>New Time</label>
                <input
                  type="text"
                  required
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Reason for Rescheduling</label>
              <textarea
                rows={2}
                value={rescheduleData.reason}
                onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn">Confirm Reschedule</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
