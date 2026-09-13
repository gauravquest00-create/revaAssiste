import React, { useState, useEffect } from "react";
import {
  MdExplore,
  MdTrendingUp,
  MdFlight,
  MdDirectionsTransit,
  MdSchool,
  MdLocalHospital,
  MdAdd,
  MdEdit,
  MdArchive,
  MdDeleteOutline
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Corridor } from "../../types/index.js";
import { Badge } from "../../components/common/Badge.js";
import { Drawer } from "../../components/common/Drawer.js";
import { Modal } from "../../components/common/Modal.js";
import "./Corridors.css";

export const Corridors: React.FC = () => {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | null>(null);
  const [, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCorridor, setEditingCorridor] = useState<Corridor | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    location: "Gurugram, Haryana",
    description: "",
    sectors: "Sector 102, Sector 103, Sector 104, Sector 106, Sector 108, Sector 111, Sector 113",
    avgPriceSqft: 14500,
    priceRange: "₹1.8 Cr – ₹6.5 Cr",
    rentalYield: "4.0% – 4.5%",
    annualAppreciation: "14% YoY",
    airportAccess: "Direct elevated expressway to IGI T3 in 18 mins",
    metro: "Proposed Gurugram Metro Extension",
    highways: "NH-48, CPR, UER-II",
    schools: "DPS Sector 102, GEMS International",
    hospitals: "Manipal Hospital, Park Hospital",
    marketRisks: "Internal sector road connections pending final GMDA blacktopping"
  });

  const fetchCorridors = async () => {
    try {
      const res = await api.get<{ success: boolean; corridors: Corridor[] }>("/corridors");
      if (res.success) {
        setCorridors(res.corridors);
        if (res.corridors.length > 0 && !selectedCorridor) {
          setSelectedCorridor(res.corridors[0]);
        }
      }
    } catch (err) {
      console.error("Corridor fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorridors();
  }, []);

  const handleOpenAdd = () => {
    setEditingCorridor(null);
    setFormData({
      name: "",
      location: "Gurugram, Haryana",
      description: "",
      sectors: "Sector 102, Sector 103, Sector 104, Sector 106, Sector 108, Sector 111, Sector 113",
      avgPriceSqft: 14500,
      priceRange: "₹1.8 Cr – ₹6.5 Cr",
      rentalYield: "4.0% – 4.5%",
      annualAppreciation: "14% YoY",
      airportAccess: "Direct elevated expressway to IGI T3 in 18 mins",
      metro: "Proposed Gurugram Metro Extension",
      highways: "NH-48, CPR, UER-II",
      schools: "DPS Sector 102, GEMS International",
      hospitals: "Manipal Hospital, Park Hospital",
      marketRisks: "Internal sector road connections pending final GMDA blacktopping"
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, c: Corridor) => {
    e.stopPropagation();
    setEditingCorridor(c);
    setFormData({
      name: c.name,
      location: c.location,
      description: c.description,
      sectors: c.sectors?.join(", ") || "",
      avgPriceSqft: c.marketIntelligence?.avgPriceSqft || 14500,
      priceRange: c.marketIntelligence?.priceRange || "₹1.8 Cr – ₹6.5 Cr",
      rentalYield: c.marketIntelligence?.rentalYield || "4.0%",
      annualAppreciation: c.marketIntelligence?.annualAppreciation || "14% YoY",
      airportAccess: c.connectivity?.airportAccess || "",
      metro: c.connectivity?.metro?.join(", ") || "",
      highways: c.connectivity?.highways?.join(", ") || "",
      schools: c.infrastructure?.schools?.join(", ") || "",
      hospitals: c.infrastructure?.hospitals?.join(", ") || "",
      marketRisks: c.marketIntelligence?.marketRisks?.join(", ") || ""
    });
    setShowAddModal(true);
  };

  const handleSaveCorridor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        location: formData.location,
        description: formData.description,
        sectors: formData.sectors.split(",").map(s => s.trim()),
        connectivity: {
          airportAccess: formData.airportAccess,
          metro: formData.metro.split(",").map(m => m.trim()),
          highways: formData.highways.split(",").map(h => h.trim())
        },
        infrastructure: {
          schools: formData.schools.split(",").map(s => s.trim()),
          hospitals: formData.hospitals.split(",").map(h => h.trim()),
          employmentHubs: ["Aerocity", "Cyber Hub", "Yashobhoomi"]
        },
        marketIntelligence: {
          avgPriceSqft: Number(formData.avgPriceSqft),
          priceRange: formData.priceRange,
          rentalYield: formData.rentalYield,
          annualAppreciation: formData.annualAppreciation,
          marketRisks: formData.marketRisks.split(",").map(r => r.trim())
        }
      };

      if (editingCorridor) {
        await api.put(`/corridors/${editingCorridor._id}`, payload);
      } else {
        await api.post("/corridors", payload);
      }

      setShowAddModal(false);
      fetchCorridors();
    } catch (err: any) {
      alert(err.message || "Failed to save corridor");
    }
  };

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.patch(`/corridors/${id}/archive`, {});
      fetchCorridors();
    } catch (err: any) {
      alert(err.message || "Failed to archive corridor");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this corridor?")) return;
    try {
      await api.delete(`/corridors/${id}`);
      fetchCorridors();
    } catch (err: any) {
      alert(err.message || "Failed to delete corridor");
    }
  };

  return (
    <div className="corridors-page">
      <div className="page-header">
        <div>
          <h1 className="page-heading">Corridor Intelligence</h1>
          <p className="page-subheading">
            Macro-market infrastructure, micro-market sectors, and capital appreciation drivers
          </p>
        </div>
        <button className="add-corridor-btn" onClick={handleOpenAdd}>
          <MdAdd size={18} /> Add Corridor
        </button>
      </div>

      <div className="corridors-grid">
        {corridors.map((c) => (
          <div
            key={c._id}
            className={`corridor-card ${selectedCorridor?._id === c._id ? "selected" : ""}`}
            onClick={() => setSelectedCorridor(c)}
          >
            <div className="corridor-card-header">
              <div className="corridor-title-group">
                <MdExplore className="corridor-icon" />
                <h3 className="corridor-name">{c.name}</h3>
              </div>
              <div className="header-badges">
                {c.isArchived && <Badge label="Archived" variant="neutral" />}
                <Badge label={c.verificationStatus} variant="success" />
              </div>
            </div>

            <p className="corridor-desc">{c.description}</p>

            <div className="corridor-metrics-strip">
              <div className="metric-box">
                <span className="metric-label">Avg Rate</span>
                <span className="metric-value">₹{c.marketIntelligence?.avgPriceSqft}/sqft</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Rental Yield</span>
                <span className="metric-value">{c.marketIntelligence?.rentalYield}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Appreciation</span>
                <span className="metric-value">{c.marketIntelligence?.annualAppreciation}</span>
              </div>
            </div>

            <div className="corridor-sectors-row">
              <span className="sectors-title">Key Sectors:</span>
              <div className="sectors-chips">
                {c.sectors?.map((s) => (
                  <span key={s} className="sector-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="corridor-card-actions">
              <button className="corridor-intel-btn">View Deep Market Intelligence</button>
              <div className="corridor-admin-btns" onClick={(e) => e.stopPropagation()}>
                <button className="icon-btn edit" onClick={(e) => handleOpenEdit(e, c)} title="Edit Corridor">
                  <MdEdit size={16} />
                </button>
                <button className="icon-btn archive" onClick={(e) => handleArchive(e, c._id)} title="Archive / Unarchive">
                  <MdArchive size={16} />
                </button>
                <button className="icon-btn delete" onClick={(e) => handleDelete(e, c._id)} title="Delete Corridor">
                  <MdDeleteOutline size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Intelligence Drawer for Selected Corridor */}
      {selectedCorridor && (
        <Drawer
          isOpen={Boolean(selectedCorridor)}
          onClose={() => setSelectedCorridor(null)}
          title={selectedCorridor.name}
          subtitle={`Macro Intelligence • ${selectedCorridor.location}`}
          width="680px"
        >
          <div className="corridor-drawer-body">
            <div className="ai-intel-banner">
              <span className="banner-tag">AI Corridor Thesis</span>
              <h4 className="banner-angle">{selectedCorridor.aiAnalysis?.topSellingAngle || "Prime NCR Infrastructure Growth Axis"}</h4>
              <p className="banner-overview">{selectedCorridor.aiAnalysis?.overview || selectedCorridor.description}</p>
            </div>

            <div className="intel-section">
              <h4 className="section-title">High-Velocity Connectivity</h4>
              <div className="intel-items-list">
                <div className="intel-item">
                  <MdFlight className="item-icon" />
                  <div>
                    <strong>Airport Linkage:</strong> {selectedCorridor.connectivity?.airportAccess}
                  </div>
                </div>
                <div className="intel-item">
                  <MdDirectionsTransit className="item-icon" />
                  <div>
                    <strong>Metro Connectivity:</strong> {selectedCorridor.connectivity?.metro?.join(" • ")}
                  </div>
                </div>
                <div className="intel-item">
                  <MdTrendingUp className="item-icon" />
                  <div>
                    <strong>Expressways & Highways:</strong> {selectedCorridor.connectivity?.highways?.join(" • ")}
                  </div>
                </div>
              </div>
            </div>

            <div className="intel-section">
              <h4 className="section-title">Civic Ecosystem & Employment</h4>
              <div className="amenities-dual-column">
                <div className="amenity-column">
                  <div className="column-head">
                    <MdSchool /> Top Schools
                  </div>
                  <ul>
                    {selectedCorridor.infrastructure?.schools?.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="amenity-column">
                  <div className="column-head">
                    <MdLocalHospital /> Hospitals & Retail
                  </div>
                  <ul>
                    {selectedCorridor.infrastructure?.hospitals?.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="intel-section">
              <h4 className="section-title">Verified Market Risks to Address</h4>
              <div className="risks-box">
                {selectedCorridor.marketIntelligence?.marketRisks?.map((r, idx) => (
                  <p key={idx} className="risk-paragraph">• {r}</p>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* CREATE / EDIT CORRIDOR MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingCorridor ? "Edit Corridor Intelligence" : "Add New Growth Corridor"}
          maxWidth="600px"
        >
          <form onSubmit={handleSaveCorridor} className="corridor-form">
            <div className="form-row">
              <div className="field-group">
                <label>Corridor Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Golf Course Extension Road"
                />
              </div>
              <div className="field-group">
                <label>Geographic Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Description & Macro Overview</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Sectors (comma separated)</label>
              <input
                type="text"
                value={formData.sectors}
                onChange={(e) => setFormData({ ...formData, sectors: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Avg Price / sqft (INR)</label>
                <input
                  type="number"
                  value={formData.avgPriceSqft}
                  onChange={(e) => setFormData({ ...formData, avgPriceSqft: Number(e.target.value) })}
                />
              </div>
              <div className="field-group">
                <label>Price Range</label>
                <input
                  type="text"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group">
                <label>Rental Yield</label>
                <input
                  type="text"
                  value={formData.rentalYield}
                  onChange={(e) => setFormData({ ...formData, rentalYield: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Appreciation Rate</label>
                <input
                  type="text"
                  value={formData.annualAppreciation}
                  onChange={(e) => setFormData({ ...formData, annualAppreciation: e.target.value })}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Airport & Arterial Access</label>
              <input
                type="text"
                value={formData.airportAccess}
                onChange={(e) => setFormData({ ...formData, airportAccess: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn">
              {editingCorridor ? "Update Corridor" : "Save Corridor"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
