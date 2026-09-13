import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdFlashOn,
  MdVisibility,
  MdCompareArrows,
  MdAdd,
  MdEdit,
  MdArchive,
  MdDeleteOutline
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Project } from "../../types/index.js";
import { SmartFilter } from "../../components/common/SmartFilter.js";
import { Badge } from "../../components/common/Badge.js";
import { Modal } from "../../components/common/Modal.js";
import { Skeleton } from "../../components/common/Skeleton.js";
import { QuickPitchPanel } from "./QuickPitchPanel.js";
import "./Projects.css";

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [rankedMatches, setRankedMatches] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedQuickPitchId, setSelectedQuickPitchId] = useState<string | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    builder: "",
    sector: "Sector 113",
    address: "Dwarka Expressway, Gurugram",
    projectArea: "15 Acres",
    towers: 8,
    floors: 26,
    units: 700,
    configurations: "2 BHK, 3 BHK, 4 BHK",
    possession: "Ready to Move",
    status: "Ready to Move" as any,
    minPrice: 18000000,
    maxPrice: 35000000,
    amenities: "Grand Clubhouse, Olympic Pool, Tennis Courts, 24x7 Security",
    connectivity: "15 mins to IGI Airport, 5 mins to Yashobhoomi",
    usp: "Unmatched arterial highway connectivity; High livability",
    weaknesses: "Approach road sector completion in progress",
    reraNumber: "Verified on HRERA portal"
  });

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await api.get<{ success: boolean; projects: Project[] }>("/projects");
      if (res.success) setProjects(res.projects);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSmartFilterAnalyze = async (filterCriteria: any) => {
    setFilterLoading(true);
    try {
      if (Object.keys(filterCriteria).length === 0) {
        setRankedMatches(null);
        return;
      }
      const res = await api.post<{ success: boolean; matches: any[] }>("/ai/match", {
        requirement: filterCriteria
      });
      if (res.success) {
        setRankedMatches(res.matches);
      }
    } catch (err) {
      console.error("AI Match error:", err);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      builder: "",
      sector: "Sector 113",
      address: "Dwarka Expressway, Gurugram",
      projectArea: "15 Acres",
      towers: 8,
      floors: 26,
      units: 700,
      configurations: "2 BHK, 3 BHK, 4 BHK",
      possession: "Ready to Move",
      status: "Ready to Move",
      minPrice: 18000000,
      maxPrice: 35000000,
      amenities: "Grand Clubhouse, Olympic Pool, Tennis Courts, 24x7 Security",
      connectivity: "15 mins to IGI Airport, 5 mins to Yashobhoomi",
      usp: "Unmatched arterial highway connectivity; High livability",
      weaknesses: "Approach road sector completion in progress",
      reraNumber: "Verified on HRERA portal"
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, p: Project) => {
    e.stopPropagation();
    setEditingProject(p);
    setFormData({
      name: p.name,
      builder: p.builder,
      sector: p.sector,
      address: p.address,
      projectArea: p.projectArea,
      towers: p.towers as any,
      floors: p.floors as any,
      units: p.units as any,
      configurations: p.configurations?.join(", ") || "3 BHK",
      possession: p.possession,
      status: p.status,
      minPrice: p.priceRange?.min || 18000000,
      maxPrice: p.priceRange?.max || 35000000,
      amenities: p.amenities?.join(", ") || "",
      connectivity: p.connectivity?.join(", ") || "",
      usp: p.usp?.join("; ") || "",
      weaknesses: p.weaknesses?.join("; ") || "",
      reraNumber: p.reraNumber
    });
    setShowAddModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedPrice = `₹${(formData.minPrice / 10000000).toFixed(2)} Cr – ₹${(formData.maxPrice / 10000000).toFixed(2)} Cr`;
      const avgPrice = Math.round((formData.minPrice + formData.maxPrice) / 2 / 1600);

      const payload = {
        name: formData.name,
        builder: formData.builder,
        sector: formData.sector,
        address: formData.address,
        projectArea: formData.projectArea,
        towers: formData.towers,
        floors: formData.floors,
        units: formData.units,
        configurations: formData.configurations.split(",").map(c => c.trim()),
        possession: formData.possession,
        status: formData.status,
        priceRange: {
          min: Number(formData.minPrice),
          max: Number(formData.maxPrice),
          formatted: formattedPrice,
          pricePerSqftAvg: avgPrice
        },
        amenities: formData.amenities.split(",").map(a => a.trim()),
        connectivity: formData.connectivity.split(",").map(c => c.trim()),
        usp: formData.usp.split(";").map(u => u.trim()),
        weaknesses: formData.weaknesses.split(";").map(w => w.trim()),
        reraNumber: formData.reraNumber
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      setShowAddModal(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to save project");
    }
  };

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.patch(`/projects/${id}/archive`, {});
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to archive project");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!search) return true;
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.builder.toLowerCase().includes(search.toLowerCase()) ||
      p.sector.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="projects-page">
      <div className="projects-header-row">
        <div>
          <h1 className="projects-title">Verified Projects</h1>
          <p className="projects-sub">
            Dwarka Expressway Shortlist • 15 Established Projects • Complete CRUD & AI Playbooks
          </p>
        </div>
        <div className="projects-actions">
          <button className="compare-btn" onClick={() => navigate("/comparison")}>
            <MdCompareArrows size={18} /> Compare Projects
          </button>
          <button className="add-project-btn" onClick={handleOpenAdd}>
            <MdAdd size={18} /> Add Project
          </button>
        </div>
      </div>

      {/* Smart Chip-Based Filter */}
      <SmartFilter onAnalyze={handleSmartFilterAnalyze} loading={filterLoading} />

      {/* Search Input Bar */}
      <div className="projects-search-bar">
        <MdSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search projects by name, builder (e.g. Tata, Godrej, Sobha), or sector..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* AI Matches Banner if Smart Filter applied */}
      {rankedMatches && (
        <div className="ai-ranking-notice">
          <span className="notice-bold">AI Recommendation Engine Active:</span> Projects ranked by
          suitability for current filter criteria.
        </div>
      )}

      {/* Projects Grid */}
      <div className="projects-grid">
        {loading ? (
          <>
            <Skeleton height="280px" />
            <Skeleton height="280px" />
            <Skeleton height="280px" />
          </>
        ) : (
          filteredProjects.map((p) => {
            const matchInfo = rankedMatches?.find((m) => m.projectName === p.name);
            return (
              <div key={p._id} className="project-card">
                <div className="project-card-image-wrap">
                  <img
                    src={p.photos?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"}
                    alt={p.name}
                    className="project-image"
                  />
                  <div className="project-status-badge">
                    <Badge
                      label={p.status}
                      variant={p.status === "Ready to Move" ? "success" : "primary"}
                    />
                    {p.isArchived && <Badge label="Archived" variant="neutral" />}
                  </div>
                  {matchInfo && (
                    <div className="ai-match-tag">
                      {matchInfo.matchScore}% AI MATCH
                    </div>
                  )}
                </div>

                <div className="project-card-content">
                  <div className="project-builder-meta">
                    <span className="builder-name">{p.builder}</span>
                    <span className="sector-pill">{p.sector}</span>
                  </div>

                  <h3 className="project-name">{p.name}</h3>

                  <div className="project-pricing-box">
                    <span className="price-tag">{p.priceRange?.formatted}</span>
                    <span className="rate-tag">Avg ₹{p.priceRange?.pricePerSqftAvg}/sqft</span>
                  </div>

                  <div className="project-configs-row">
                    {p.configurations?.map((cfg) => (
                      <span key={cfg} className="cfg-pill">
                        {cfg}
                      </span>
                    ))}
                  </div>

                  <p className="project-usp-snippet">
                    <strong>USP:</strong> {p.usp?.[0]}
                  </p>

                  {matchInfo && (
                    <div className="match-reason-box">
                      <strong>AI Verdict:</strong> {matchInfo.whyItFits}
                    </div>
                  )}

                  {/* Card Action Buttons */}
                  <div className="card-actions-row">
                    <button
                      className="details-btn"
                      onClick={() => navigate(`/projects/${p._id}`)}
                    >
                      <MdVisibility /> Details
                    </button>
                    <button
                      className="quick-pitch-btn"
                      onClick={() => setSelectedQuickPitchId(p._id)}
                    >
                      <MdFlashOn /> Quick Pitch
                    </button>
                  </div>

                  {/* Admin CRUD controls */}
                  <div className="project-card-admin-row" onClick={(e) => e.stopPropagation()}>
                    <button className="icon-btn edit" onClick={(e) => handleOpenEdit(e, p)} title="Edit Project">
                      <MdEdit size={15} /> Edit
                    </button>
                    <button className="icon-btn archive" onClick={(e) => handleArchive(e, p._id)} title="Archive">
                      <MdArchive size={15} /> {p.isArchived ? "Unarchive" : "Archive"}
                    </button>
                    <button className="icon-btn delete" onClick={(e) => handleDelete(e, p._id)} title="Delete Project">
                      <MdDeleteOutline size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Slide-Over Quick Pitch Panel */}
      {selectedQuickPitchId && (
        <QuickPitchPanel
          projectId={selectedQuickPitchId}
          isOpen={Boolean(selectedQuickPitchId)}
          onClose={() => setSelectedQuickPitchId(null)}
        />
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingProject ? `Edit Project: ${editingProject.name}` : "Create Project"}
          maxWidth="640px"
        >
          <form onSubmit={handleSaveProject} className="project-modal-form">
            <div className="form-row">
              <div className="field-group">
                <label>Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Builder</label>
                <input
                  type="text"
                  required
                  value={formData.builder}
                  onChange={(e) => setFormData({ ...formData, builder: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Sector</label>
                <input
                  type="text"
                  required
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Near Possession">Near Possession</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="New Launch">New Launch</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Min Price (INR)</label>
                <input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
                />
              </div>
              <div className="field-group">
                <label>Max Price (INR)</label>
                <input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Configurations (comma separated)</label>
              <input
                type="text"
                value={formData.configurations}
                onChange={(e) => setFormData({ ...formData, configurations: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Key USP (semicolon separated)</label>
              <input
                type="text"
                value={formData.usp}
                onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Weaknesses / Trade-offs (semicolon separated)</label>
              <input
                type="text"
                value={formData.weaknesses}
                onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>RERA Number</label>
              <input
                type="text"
                value={formData.reraNumber}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
              />
            </div>

            <button type="submit" className="save-project-submit-btn">
              {editingProject ? "Update Project" : "Create Project"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
