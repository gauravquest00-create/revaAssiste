import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import "./Drawer.css";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "580px"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="reva-drawer-backdrop" onClick={onClose}>
      <div
        className="reva-drawer-panel"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="reva-drawer-header">
          <div className="drawer-header-meta">
            <h2 className="drawer-title">{title}</h2>
            {subtitle && <span className="drawer-subtitle">{subtitle}</span>}
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">
            <MdClose size={22} />
          </button>
        </div>
        <div className="reva-drawer-content">{children}</div>
      </div>
    </div>
  );
};
