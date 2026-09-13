import React from "react";
import "./Skeleton.css";

interface SkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = "20px",
  width = "100%",
  borderRadius = "var(--radius-sm)"
}) => {
  return <div className="reva-skeleton" style={{ height, width, borderRadius }} />;
};
