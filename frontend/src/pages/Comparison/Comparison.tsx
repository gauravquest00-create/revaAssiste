import React, { useState, useEffect } from "react";
import { api } from "../../services/api.js";
import { Project } from "../../types/index.js";
import "./Comparison.css";

export const Comparison: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projA, setProjA] = useState<string>("");
  const [projB, setProjB] = useState<string>("");
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get<{ success: boolean; projects: Project[] }>("/projects");
        if (res.success && res.projects.length >= 2) {
          setProjects(res.projects);
          setProjA(res.projects[1]?._id); // Tata La Vida
          setProjB(res.projects[0]?._id); // M3M Capital
        }
      } catch (err) {
        console.error("Comparison load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const p1 = projects.find(p => p._id === projA);
  const p2 = projects.find(p => p._id === projB);

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <h1 className="comparison-title">Multi-Project Comparison Tool</h1>
        <p className="comparison-sub">Side-by-side metric comparison to advise undecided clients</p>
      </div>

      {/* Selector Row */}
      <div className="selectors-row">
        <div className="select-box">
          <label>Primary Project (Option 1)</label>
          <select value={projA} onChange={(e) => setProjA(e.target.value)}>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div className="select-box">
          <label>Comparison Project (Option 2)</label>
          <select value={projB} onChange={(e) => setProjB(e.target.value)}>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {p1 && p2 && (
        <div className="comparison-matrix-card">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature / Parameter</th>
                <th>{p1.name} ({p1.sector})</th>
                <th>{p2.name} ({p2.sector})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Builder</strong></td>
                <td>{p1.builder}</td>
                <td>{p2.builder}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td>{p1.status}</td>
                <td>{p2.status}</td>
              </tr>
              <tr>
                <td><strong>Price Range</strong></td>
                <td className="highlight-cell">{p1.priceRange.formatted}</td>
                <td className="highlight-cell">{p2.priceRange.formatted}</td>
              </tr>
              <tr>
                <td><strong>Rate / sqft</strong></td>
                <td>₹{p1.priceRange.pricePerSqftAvg}</td>
                <td>₹{p2.priceRange.pricePerSqftAvg}</td>
              </tr>
              <tr>
                <td><strong>Livability Score</strong></td>
                <td>{p1.endUseIntelligence?.livabilityScore}/100</td>
                <td>{p2.endUseIntelligence?.livabilityScore}/100</td>
              </tr>
              <tr>
                <td><strong>Rental Yield</strong></td>
                <td>{p1.rentalIntelligence?.expectedYield}</td>
                <td>{p2.rentalIntelligence?.expectedYield}</td>
              </tr>
              <tr>
                <td><strong>Key Advantage</strong></td>
                <td>{p1.usp?.[0]}</td>
                <td>{p2.usp?.[0]}</td>
              </tr>
              <tr>
                <td><strong>Main Trade-off</strong></td>
                <td>{p1.weaknesses?.[0]}</td>
                <td>{p2.weaknesses?.[0]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
