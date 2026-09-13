import React from "react";
import { useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import "./StatCard.css";

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: IconType;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  routeTo?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  color = "primary",
  routeTo
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (routeTo) {
      navigate(routeTo);
    }
  };

  return (
    <div
      className={`reva-stat-card color-${color} ${routeTo ? "clickable" : ""}`}
      onClick={handleClick}
      role={routeTo ? "button" : undefined}
    >
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
      <div className="stat-icon-wrapper">
        <Icon size={24} />
      </div>
    </div>
  );
};
