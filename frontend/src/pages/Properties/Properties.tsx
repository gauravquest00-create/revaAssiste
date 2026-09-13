import React, { useState, useEffect } from "react";
import {
  MdAdd,
  MdFileUpload,
  MdContentCopy,
  MdEdit,
  MdArchive,
  MdDeleteOutline,
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Property, Project } from "../../types/index.js";
import { Badge } from "../../components/common/Badge.js";
import { Modal } from "../../components/common/Modal.js";
import { Drawer } from "../../components/common/Drawer.js";
import { formatCurrency } from "../../utils/formatters.js";
import "./Properties.css";

export const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [, setLoading] = useState(true);
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);

  // Filter State
  const [bhkFilter, setBhkFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importPreview, setImportPreview] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  // Add/Edit Property Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [newProp, setNewProp] = useState({
    propertyId: `PROP-${Date.now().toString().slice(-4)}`,
    projectName: "Tata La Vida",
    tower: "Tower 2",
    floor: 10,
    unit: "1004",
    bhk: "3 BHK",
    area: 1579,
    askingPrice: 22500000,
    expectedPrice: 22000000,
    lowestExpectedPrice: 21500000,
    facing: "North-East",
    sellerName: "Verified Individual",
    sellerUrgency: "Moderate"
  });

  const fetchData = async () => {
    try {
      const [propsRes, projsRes] = await Promise.all([
        api.get<{ success: boolean; properties: Property[] }>("/properties"),
        api.get<{ success: boolean; projects: Project[] }>("/projects")
      ]);
      if (propsRes.success) setProperties(propsRes.properties);
      if (projsRes.success) setProjects(projsRes.projects);
    } catch (err) {
      console.error("Fetch properties error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleOpenEditProperty = (e: React.MouseEvent, p: Property) => {
    e.stopPropagation();
    setEditingProp(p);
    setNewProp({
      propertyId: p.propertyId,
      projectName: p.projectName,
      tower: p.tower,
      floor: p.floor,
      unit: p.unit,
      bhk: p.bhk,
      area: p.area,
      askingPrice: p.askingPrice,
      expectedPrice: p.expectedPrice,
      lowestExpectedPrice: p.lowestExpectedPrice,
      facing: p.facing,
      sellerName: p.seller?.name || "Direct Owner",
      sellerUrgency: p.seller?.urgency || "Moderate"
    });
    setShowAddModal(true);
  };

  const handleArchiveProperty = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.patch(`/properties/${id}/archive`, {});
      fetchData();
    } catch (err) {
      alert("Failed to archive property");
    }
  };

  const handleDeleteProperty = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this property unit?")) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  const handleDuplicate = async (propId: string) => {
    try {
      const res = await api.post<{ success: boolean }>(`/properties/${propId}/duplicate`, {});
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      alert("Failed to duplicate property");
    }
  };

  const handleImportPreview = async () => {
    setImporting(true);
    try {
      const lines = importText.split("\n").filter(l => l.trim().length > 0);
      const rows = lines.map((line, idx) => {
        const parts = line.split(",").map(p => p.trim());
        return {
          propertyId: parts[0] || `IMP-${idx + 1}`,
          projectName: parts[1] || "Tata La Vida",
          tower: parts[2] || "Tower 1",
          floor: parts[3] || "8",
          unit: parts[4] || "802",
          bhk: parts[5] || "3 BHK",
          area: parts[6] || "1580",
          askingPrice: parts[7] || "22000000",
          sellerName: parts[8] || "Direct Owner"
        };
      });

      const res = await api.post<{ success: boolean; summary: any; validRows: any[]; invalidRows: any[]; duplicates: any[] }>(
        "/properties/import",
        { rows, confirm: false }
      );
      if (res.success) {
        setImportPreview(res);
      }
    } catch (err: any) {
      alert(err.message || "Import preview failed");
    } finally {
      setImporting(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview?.validRows) return;
    setImporting(true);
    try {
      const res = await api.post<{ success: boolean; message: string }>("/properties/import", {
        rows: importPreview.validRows,
        confirm: true
      });
      if (res.success) {
        alert(res.message);
        setShowImportModal(false);
        setImportPreview(null);
        setImportText("");
        fetchData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to commit import");
    } finally {
      setImporting(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matchedProj = projects.find(p => p.name === newProp.projectName) || projects[0];
      const pPerSqft = Math.round(newProp.askingPrice / newProp.area);

      const propPayload = {
        ...newProp,
        project: matchedProj._id,
        corridor: matchedProj.corridorName,
        corridorName: matchedProj.corridorName,
        pricePerSqft: pPerSqft,
        seller: {
          name: newProp.sellerName,
          urgency: newProp.sellerUrgency,
          contact: "Not verified",
          brokeragePercentage: 1.0
        },
        status: "Available"
      };

      let res: any;
      if (editingProp) {
        res = await api.put(`/properties/${editingProp._id}`, propPayload);
      } else {
        res = await api.post("/properties", propPayload);
      }

      if (res && res.success) {
        setShowAddModal(false);
        fetchData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to create property");
    }
  };

  const filtered = properties.filter((p) => {
    if (bhkFilter && p.bhk !== bhkFilter) return false;
    if (projectFilter && p.projectName !== projectFilter) return false;
    return true;
  });

  return (
    <div className="properties-page">
      <div className="properties-header">
        <div>
          <h1 className="properties-title">Inventory & Properties</h1>
          <p className="properties-sub">
            Verified property units across 15 Dwarka Expressway projects • Pricing & Seller intelligence
          </p>
        </div>
        <div className="properties-header-actions">
          <button className="import-btn" onClick={() => setShowImportModal(true)}>
            <MdFileUpload size={18} /> Smart Import (CSV/Text)
          </button>
          <button className="add-prop-btn" onClick={() => setShowAddModal(true)}>
            <MdAdd size={18} /> Add Property
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="properties-filter-bar">
        <div className="filter-item">
          <label className="filter-label">Filter by Project:</label>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Configuration:</label>
          <select
            value={bhkFilter}
            onChange={(e) => setBhkFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Configurations</option>
            <option value="2 BHK">2 BHK</option>
            <option value="2.5 BHK">2.5 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="3.5 BHK">3.5 BHK</option>
            <option value="4 BHK">4 BHK</option>
          </select>
        </div>
      </div>

      {/* Properties Table & Cards */}
      <div className="properties-container">
        {/* Desktop Table */}
        <table className="desktop-properties-table">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Project & Sector</th>
              <th>Tower / Floor / Unit</th>
              <th>BHK & Area</th>
              <th>Asking Price</th>
              <th>Expected / Bottom</th>
              <th>Seller Urgency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} onClick={() => setSelectedProp(p)}>
                <td className="bold-cell">{p.propertyId}</td>
                <td>
                  <div className="proj-cell">
                    <strong>{p.projectName}</strong>
                    <span className="corridor-text">{p.corridorName}</span>
                  </div>
                </td>
                <td>{p.tower} • Floor {p.floor} • #{p.unit}</td>
                <td>{p.bhk} • {p.area} sqft</td>
                <td className="price-cell">{formatCurrency(p.askingPrice)}</td>
                <td className="expected-cell">{formatCurrency(p.expectedPrice)}</td>
                <td>
                  <Badge
                    label={p.seller?.urgency}
                    variant={p.seller?.urgency === "High" || p.seller?.urgency === "Immediate Distress" ? "danger" : "warning"}
                  />
                </td>
                <td>
                  <Badge label={p.status} variant={p.status === "Available" ? "success" : "neutral"} />
                </td>
                <td onClick={(e) => e.stopPropagation()} className="actions-cell">
                  <div className="table-actions-group">
                    <button className="icon-table-btn" title="Edit Unit" onClick={(e) => handleOpenEditProperty(e, p)}>
                      <MdEdit />
                    </button>
                    <button className="icon-table-btn" title="Duplicate Unit" onClick={() => handleDuplicate(p._id)}>
                      <MdContentCopy />
                    </button>
                    <button className="icon-table-btn" title="Archive / Restore" onClick={(e) => handleArchiveProperty(e, p._id)}>
                      <MdArchive />
                    </button>
                    <button className="icon-table-btn delete" title="Delete Unit" onClick={(e) => handleDeleteProperty(e, p._id)}>
                      <MdDeleteOutline />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View: Cards */}
        <div className="mobile-properties-cards">
          {filtered.map((p) => (
            <div key={p._id} className="mobile-prop-card" onClick={() => setSelectedProp(p)}>
              <div className="card-top">
                <div>
                  <span className="prop-id-tag">{p.propertyId}</span>
                  <h4 className="prop-proj-name">{p.projectName}</h4>
                </div>
                <div className="prop-price-box">
                  <span className="asking-val">{formatCurrency(p.askingPrice)}</span>
                  <span className="sqft-val">₹{p.pricePerSqft}/sqft</span>
                </div>
              </div>
              <div className="card-mid">
                <span>{p.bhk} • {p.area} sqft</span>
                <span>{p.tower} • Floor {p.floor}</span>
                <span>{p.facing}</span>
              </div>
              <div className="card-bottom">
                <span>Urgency: <strong>{p.seller?.urgency}</strong></span>
                <Badge label={p.status} variant="success" />
              </div>
              <div className="card-mobile-actions" onClick={(e) => e.stopPropagation()}>
                <button className="mobile-action-pill" onClick={(e) => handleOpenEditProperty(e, p)}><MdEdit /> Edit</button>
                <button className="mobile-action-pill" onClick={() => handleDuplicate(p._id)}><MdContentCopy /> Duplicate</button>
                <button className="mobile-action-pill" onClick={(e) => handleArchiveProperty(e, p._id)}><MdArchive /> Archive</button>
                <button className="mobile-action-pill delete" onClick={(e) => handleDeleteProperty(e, p._id)}><MdDeleteOutline /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property Intelligence Drawer */}
      {selectedProp && (
        <Drawer
          isOpen={Boolean(selectedProp)}
          onClose={() => setSelectedProp(null)}
          title={`Unit Intelligence: ${selectedProp.unit} (${selectedProp.tower})`}
          subtitle={`${selectedProp.projectName} • ${selectedProp.propertyId}`}
          width="580px"
        >
          <div className="prop-drawer-body">
            <div className="prop-valuation-card">
              <span className="card-eyebrow">Advisor Price Intelligence</span>
              <div className="valuation-prices">
                <div className="price-item">
                  <span className="label">Asking Price</span>
                  <span className="val">{formatCurrency(selectedProp.askingPrice)}</span>
                </div>
                <div className="price-item">
                  <span className="label">Expected Settlement</span>
                  <span className="val highlight">{formatCurrency(selectedProp.expectedPrice)}</span>
                </div>
                <div className="price-item">
                  <span className="label">Lowest Walk-away</span>
                  <span className="val">{formatCurrency(selectedProp.lowestExpectedPrice)}</span>
                </div>
              </div>
            </div>

            <div className="prop-detail-section">
              <h4 className="section-title">Unit Specifications</h4>
              <div className="spec-grid">
                <div><strong>Area:</strong> {selectedProp.area} sqft</div>
                <div><strong>Floor:</strong> {selectedProp.floor}</div>
                <div><strong>Orientation:</strong> {selectedProp.facing}</div>
                <div><strong>View:</strong> {selectedProp.view}</div>
                <div><strong>Furnishing:</strong> {selectedProp.furnishing}</div>
                <div><strong>Parking:</strong> {selectedProp.parking}</div>
              </div>
            </div>

            <div className="prop-detail-section">
              <h4 className="section-title">Seller & Brokerage Intelligence</h4>
              <div className="spec-grid">
                <div><strong>Seller:</strong> {selectedProp.seller?.name}</div>
                <div><strong>Urgency:</strong> {selectedProp.seller?.urgency}</div>
                <div><strong>Contact:</strong> {selectedProp.seller?.contact}</div>
                <div><strong>Brokerage:</strong> {selectedProp.seller?.brokeragePercentage}%</div>
              </div>
              {selectedProp.notes && (
                <div className="advisor-note">
                  <strong>Sales Note:</strong> {selectedProp.notes}
                </div>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* Smart Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Smart Inventory Import System"
        maxWidth="640px"
      >
        <div className="import-modal-content">
          <p className="modal-desc">
            Paste structured CSV rows or raw text lines. Format:<br />
            <code>PropertyId, ProjectName, Tower, Floor, Unit, BHK, AreaSqft, AskingPrice, SellerName</code>
          </p>

          <textarea
            rows={5}
            className="import-textarea"
            placeholder="TLV-T1-802, Tata La Vida, Tower 1, 8, 802, 3 BHK, 1579, 22200000, Ramesh Narang"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />

          {!importPreview ? (
            <button
              className="preview-import-btn"
              onClick={handleImportPreview}
              disabled={importing || !importText.trim()}
            >
              {importing ? "AI Detecting Columns & Validating..." : "Analyze & Validate Rows"}
            </button>
          ) : (
            <div className="import-preview-results">
              <div className="preview-summary-strip">
                <span className="summary-chip valid">Valid: {importPreview.summary?.valid}</span>
                <span className="summary-chip invalid">Invalid: {importPreview.summary?.invalid}</span>
                <span className="summary-chip duplicate">Duplicates: {importPreview.summary?.duplicates}</span>
              </div>

              <div className="preview-action-row">
                <button className="cancel-btn" onClick={() => setImportPreview(null)}>
                  Reset
                </button>
                <button
                  className="confirm-import-btn"
                  onClick={handleConfirmImport}
                  disabled={importing || importPreview.summary?.valid === 0}
                >
                  {importing ? "Importing..." : `Confirm Import of ${importPreview.summary?.valid} Valid Rows`}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Property Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingProp ? `Edit Property: ${editingProp.propertyId}` : "Register Verified Property Unit"}
        maxWidth="540px"
      >
        <form onSubmit={handleCreateProperty} className="add-prop-form">
          <div className="form-row">
            <div className="field-group">
              <label>Project</label>
              <select
                value={newProp.projectName}
                onChange={(e) => setNewProp({ ...newProp, projectName: e.target.value })}
              >
                {projects.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Configuration</label>
              <select
                value={newProp.bhk}
                onChange={(e) => setNewProp({ ...newProp, bhk: e.target.value })}
              >
                <option value="2 BHK">2 BHK</option>
                <option value="2.5 BHK">2.5 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="3.5 BHK">3.5 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="field-group">
              <label>Tower</label>
              <input
                type="text"
                value={newProp.tower}
                onChange={(e) => setNewProp({ ...newProp, tower: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label>Floor</label>
              <input
                type="number"
                value={newProp.floor}
                onChange={(e) => setNewProp({ ...newProp, floor: Number(e.target.value) })}
                required
              />
            </div>
            <div className="field-group">
              <label>Unit #</label>
              <input
                type="text"
                value={newProp.unit}
                onChange={(e) => setNewProp({ ...newProp, unit: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field-group">
              <label>Super Area (sqft)</label>
              <input
                type="number"
                value={newProp.area}
                onChange={(e) => setNewProp({ ...newProp, area: Number(e.target.value) })}
                required
              />
            </div>
            <div className="field-group">
              <label>Asking Price (INR)</label>
              <input
                type="number"
                value={newProp.askingPrice}
                onChange={(e) => setNewProp({ ...newProp, askingPrice: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field-group">
              <label>Expected Price (INR)</label>
              <input
                type="number"
                value={newProp.expectedPrice}
                onChange={(e) => setNewProp({ ...newProp, expectedPrice: Number(e.target.value) })}
                required
              />
            </div>
            <div className="field-group">
              <label>Seller Urgency</label>
              <select
                value={newProp.sellerUrgency}
                onChange={(e) => setNewProp({ ...newProp, sellerUrgency: e.target.value })}
              >
                <option value="Immediate Distress">Immediate Distress</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-prop-btn">{editingProp ? "Update Property Unit" : "Register Verified Inventory"}</button>
        </form>
      </Modal>
    </div>
  );
};
