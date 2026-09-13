import React, { useState } from "react";
import { MdFilterList, MdPsychology, MdRefresh } from "react-icons/md";
import "./SmartFilter.css";

interface SmartFilterProps {
  onAnalyze: (filterCriteria: any) => void;
  loading?: boolean;
}

export const SmartFilter: React.FC<SmartFilterProps> = ({ onAnalyze, loading = false }) => {
  const [purpose, setPurpose] = useState<string>("End Use");
  const [budget, setBudget] = useState<string>("₹2.0 Cr – ₹2.5 Cr");
  const [bhk, setBhk] = useState<string>("3 BHK");
  const [possession, setPossession] = useState<string>("Ready to Move");
  const [lifestyle, setLifestyle] = useState<string>("Premium Green");

  const purposes = ["End Use", "Investment", "Rental"];
  const budgets = ["Under ₹1.8 Cr", "₹1.8 Cr – ₹2.2 Cr", "₹2.2 Cr – ₹2.8 Cr", "₹2.8 Cr – ₹3.5 Cr", "Above ₹3.5 Cr"];
  const bhks = ["2 BHK", "2.5 BHK", "3 BHK", "3.5 BHK", "4 BHK+"];
  const possessions = ["Ready to Move", "Near Possession", "Under Construction"];
  const lifestyles = ["Premium Green", "Delhi Border Proximity", "Resort Amenities", "Township Living"];

  const handleApply = () => {
    onAnalyze({
      purpose,
      budget,
      bhk,
      possession,
      lifestyle
    });
  };

  const handleReset = () => {
    setPurpose("End Use");
    setBudget("₹1.8 Cr – ₹2.2 Cr");
    setBhk("3 BHK");
    setPossession("Ready to Move");
    setLifestyle("Premium Green");
    onAnalyze({});
  };

  return (
    <div className="smart-filter-card">
      <div className="filter-header">
        <div className="filter-title-group">
          <MdFilterList className="filter-icon" />
          <div>
            <h3 className="filter-heading">Smart Buyer Requirement Filter</h3>
            <span className="filter-sub">Dwarka Expressway Multi-Variable Sales Filter</span>
          </div>
        </div>
        <button className="filter-reset-btn" onClick={handleReset} title="Reset filters">
          <MdRefresh /> Reset
        </button>
      </div>

      <div className="filter-groups-grid">
        {/* Purpose */}
        <div className="chip-section">
          <label className="chip-label">Purpose</label>
          <div className="chip-container">
            {purposes.map((p) => (
              <button
                key={p}
                className={`filter-chip ${purpose === p ? "selected" : ""}`}
                onClick={() => setPurpose(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="chip-section">
          <label className="chip-label">Budget Window</label>
          <div className="chip-container">
            {budgets.map((b) => (
              <button
                key={b}
                className={`filter-chip ${budget === b ? "selected" : ""}`}
                onClick={() => setBudget(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="chip-section">
          <label className="chip-label">Configuration</label>
          <div className="chip-container">
            {bhks.map((k) => (
              <button
                key={k}
                className={`filter-chip ${bhk === k ? "selected" : ""}`}
                onClick={() => setBhk(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Possession */}
        <div className="chip-section">
          <label className="chip-label">Possession Timeline</label>
          <div className="chip-container">
            {possessions.map((pos) => (
              <button
                key={pos}
                className={`filter-chip ${possession === pos ? "selected" : ""}`}
                onClick={() => setPossession(pos)}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="chip-section">
          <label className="chip-label">Lifestyle Preference</label>
          <div className="chip-container">
            {lifestyles.map((l) => (
              <button
                key={l}
                className={`filter-chip ${lifestyle === l ? "selected" : ""}`}
                onClick={() => setLifestyle(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-action-row">
        <button className="ai-analyze-btn" onClick={handleApply} disabled={loading}>
          <MdPsychology size={20} />
          <span>{loading ? "AI Analyzing Projects..." : "AI Analyze Matching Projects"}</span>
        </button>
      </div>
    </div>
  );
};
