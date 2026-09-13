import React from "react";
import "./Badge.css";

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral" | "info";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = "neutral", size = "sm" }) => {
  return <span className={`reva-badge badge-${variant} badge-${size}`}>{label}</span>;
};
