import React, { useState, useEffect } from "react";
import {
  MdPlace,
  MdAdd,
  MdAccessTime,
  MdPsychology,
  MdCalendarMonth,
  MdEdit,
  MdDeleteOutline,
  MdApartment,
  MdHouse,
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Visit, Lead, Project, Property } from "../../types/index.js";
import { Modal } from "../../components/common/Modal.js";
import { formatDate } from "../../utils/formatters.js";
import "./Visits.css";

export const Visits: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [reschedulingVisit, setReschedulingVisit] = useState<Visit | null>(null);
  const [selectedVisitForAnalysis, setSelectedVisitForAnalysis] = useState<Visit | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    lead: "",
    project: "",
    property: "",
    date: new Date().toISOString().split("T")[0],
    time: "11:00 AM",
    location: "Tata La Vida, Sector 113, Dwarka Expressway",
    attendees: "",
    notes: "",
    status: "Scheduled" as any
  });

  const [rescheduleData, setRescheduleData] = useState({
    date: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split("T")[0],
    time: "11:30 AM",
    reason: "Client family requested weekend morning slot"
  });

  const fetchData = async () => {
    try {
      const [vRes, lRes, pRes, prRes] = await Promise.all([
        api.get<{ success: boolean; visits: Visit[] }>("/visits"),
        api.get<{ success: boolean; leads: Lead[] }>("/leads"),
        api.get<{ success: boolean; projects: Project[] }>("/projects"),
        api.get<{ success: boolean; properties: Property[] }>("/properties")
      ]);
      if (vRes.success) setVisits(vRes.visits);
      if (lRes.success) setLeads(lRes.leads);
      if (pRes.success) setProjects(pRes.projects);
      if (prRes.success) setProperties(prRes.properties);
    } catch (err) {
      console.error("Fetch visits error:", err);
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
      project: projects[0]?._id || "",
      property: "",
      date: new Date().toISOString().split("T")[0],
      time: "11:00 AM",
      location: projects[0] ? `${projects[0].name}, ${projects[0].sector}, Dwarka Expressway` : "Dwarka Expressway Corridor",
      attendees: "Client, Gaurav Verma",
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
        leadName: matchedLead ? matchedLead.name : "None / General Visit",
        project: formData.project || undefined,
        projectName: matchedProj ? matchedProj.name : "Dwarka Expressway Corridor",
        property: formData.property || undefined,
        propertyUnit: matchedProp ? matchedProp.unit : undefined,
        attendees: formData.attendees.split(",").map(a => a.trim()),
        date: new Date(formData.date)
      };

      if (editingVisit) {
        await api.put(`/visits/${editingVisit._id}`, payload);
      } else {
        await api.post("/visits", payload);
      }

      setShowAddModal(false);
      setEditingVisit(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save visit");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/visits/${id}/status`, { status });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to update visit status");
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingVisit) return;
    try {
      await api.patch(`/visits/${reschedulingVisit._id}/reschedule`, rescheduleData);
      setReschedulingVisit(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to reschedule visit");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and delete this visit?")) return;
    try {
      await api.delete(`/visits/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete visit");
    }
  };

  const handleAnalyzeVisit = async () => {
    if (!selectedVisitForAnalysis) return;
    setAnalyzing(true);
    try {
      const res = await api.post<{ success: boolean; visit: Visit }>(
        `/visits/${selectedVisitForAnalysis._id}/analyze`,
        { feedback: feedbackNotes, outcome: "Client highly satisfied with layout and orientation" }
      );
      if (res.success) {
        setSelectedVisitForAnalysis(null);
        setFeedbackNotes("");
        fetchData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to analyze visit");
    } finally {
      setAnalyzing(false);
    }
  };

  const filtered = visits.filter((v) => {
    if (statusFilter !== "All" && v.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="visits-page">
      <div className="visits-header-row">
        <div>
          <h1 className="visits-title">Site Visits Management</h1>
          <p className="visits-sub">
            Schedule project tours, record feedback, and run post-visit AI analysis • Flexible relationships
          </p>
        </div>
        <button className="add-visit-btn" onClick={handleOpenAdd}>
          <MdAdd size={18} /> Schedule Visit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="visits-filter-tabs">
        <span className="filter-label">Filter by Status:</span>
        {["All", "Scheduled", "Confirmed", "Completed", "Rescheduled", "Cancelled", "No Show"].map((st) => (
          <button
            key={st}
            className={`status-pill ${statusFilter === st ? "active" : ""}`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="visits-list-container">
        {filtered.length > 0 ? (
          filtered.map((v) => (
            <div key={v._id} className="visit-card">
              <div className="visit-card-head">
                <div className="visit-main-meta">
                  <h3 className="visit-lead-name">{v.leadName}</h3>
                  <div className="visit-entity-tags">
                    {v.projectName && (
                      <span className="entity-badge proj"><MdApartment /> {v.projectName}</span>
                    )}
                    {v.propertyUnit && (
                      <span className="entity-badge prop"><MdHouse /> Unit {v.propertyUnit}</span>
                    )}
                  </div>
                </div>

                <div className="visit-status-dropdown-wrap">
                  <select
                    value={v.status}
                    onChange={(e) => handleStatusChange(v._id, e.target.value)}
                    className={`visit-status-select status-${v.status.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {["Scheduled", "Confirmed", "Completed", "Rescheduled", "Cancelled", "No Show"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="visit-time-location">
                <span><MdAccessTime /> {formatDate(v.date)} at {v.time}</span>
                <span><MdPlace /> {v.location}</span>
              </div>

              <div className="visit-attendees">
                <strong>Attendees:</strong> {v.attendees?.join(", ") || "Client & Advisor"}
              </div>

              {v.notes && (
                <div className="visit-notes">
                  <strong>Notes:</strong> {v.notes}
                </div>
              )}

              {v.aiAnalysis ? (
                <div className="visit-ai-outcome">
                  <div className="outcome-head">
                    <MdPsychology /> Post-Visit Intelligence
                  </div>
                  <p><strong>Reaction:</strong> {v.aiAnalysis.decisionMakerReaction}</p>
                  <p><strong>Next Closing Action:</strong> {v.aiAnalysis.recommendedNextStep}</p>
                  <span className="prob-pill">{v.aiAnalysis.probabilityChange}</span>
                </div>
              ) : (
                <div className="visit-action-row">
                  <button
                    className="analyze-visit-btn"
                    onClick={() => {
                      setSelectedVisitForAnalysis(v);
                      setFeedbackNotes(v.clientFeedback || "");
                    }}
                  >
                    <MdPsychology /> Record Feedback & Analyze Visit
                  </button>
                  <button
                    className="action-btn reschedule"
                    onClick={() => setReschedulingVisit(v)}
                  >
                    <MdCalendarMonth /> Reschedule
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => {
                      setEditingVisit(v);
                      setFormData({
                        lead: (v.lead as any) || "",
                        project: (v.project as any) || "",
                        property: (v.property as any) || "",
                        date: new Date(v.date).toISOString().split("T")[0],
                        time: v.time,
                        location: v.location,
                        attendees: v.attendees?.join(", ") || "",
                        notes: v.notes || "",
                        status: v.status
                      });
                      setShowAddModal(true);
                    }}
                  >
                    <MdEdit /> Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(v._id)}
                  >
                    <MdDeleteOutline /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="empty-visits">No visits found matching this filter.</p>
        )}
      </div>

      {/* CREATE / EDIT VISIT MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); setEditingVisit(null); }}
          title={editingVisit ? "Edit Site Visit" : "Schedule Project Tour / Visit"}
          maxWidth="540px"
        >
          <form onSubmit={handleCreateOrUpdate} className="visit-form">
            <p className="helper-note">
              Note: A visit can be attached to a Lead, Project, Property unit, or created as a general corridor tour.
            </p>

            <div className="field-group">
              <label>Select Lead (Optional)</label>
              <select
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
              >
                <option value="">None (Property Inspection / General)</option>
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
                  onChange={(e) => {
                    const projId = e.target.value;
                    const p = projects.find(pr => pr._id === projId);
                    setFormData({
                      ...formData,
                      project: projId,
                      location: p ? `${p.name}, ${p.sector}, Dwarka Expressway` : formData.location
                    });
                  }}
                >
                  <option value="">None</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.sector})</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Specific Property Unit (Optional)</label>
                <select
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                >
                  <option value="">None (General Project / Sample Flat)</option>
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
            </div>

            <div className="field-group">
              <label>Meeting Location / Site Gate</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Attendees (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma, Pooja Sharma, Gaurav Verma"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Notes / Unit Checklist</label>
              <textarea
                rows={2}
                placeholder="Unit keys, golf cart assistance, gate pass code..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn">
              {editingVisit ? "Update Visit" : "Confirm Site Visit"}
            </button>
          </form>
        </Modal>
      )}

      {/* RESCHEDULE VISIT MODAL */}
      {reschedulingVisit && (
        <Modal
          isOpen={Boolean(reschedulingVisit)}
          onClose={() => setReschedulingVisit(null)}
          title={`Reschedule Visit: ${reschedulingVisit.projectName}`}
          maxWidth="460px"
        >
          <form onSubmit={handleRescheduleSubmit} className="visit-form">
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

      {/* Post-Visit Analysis Modal */}
      {selectedVisitForAnalysis && (
        <Modal
          isOpen={Boolean(selectedVisitForAnalysis)}
          onClose={() => setSelectedVisitForAnalysis(null)}
          title={`Analyze Visit: ${selectedVisitForAnalysis.leadName}`}
          maxWidth="560px"
        >
          <div className="visit-modal-content">
            <p className="modal-sub">
              Project: <strong>{selectedVisitForAnalysis.projectName}</strong> ({selectedVisitForAnalysis.propertyUnit || "Sample Flat"})
            </p>
            <label className="input-label">What did the client and family say during the visit?</label>
            <textarea
              rows={4}
              className="feedback-textarea"
              placeholder="e.g. Wife loved the large living room balcony and park view, but father asked about lift capacity during peak hours..."
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
            />
            <button
              className="confirm-analyze-btn"
              onClick={handleAnalyzeVisit}
              disabled={analyzing || !feedbackNotes.trim()}
            >
              {analyzing ? "AI Extracting Signals..." : "Extract Post-Visit Closing Strategy"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
