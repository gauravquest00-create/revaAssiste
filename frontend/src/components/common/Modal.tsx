import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "560px" }) => {
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
    <div className="reva-modal-backdrop" onClick={onClose}>
      <div className="reva-modal-dialog" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <div className="reva-modal-header">
          <h3 className="reva-modal-title">{title}</h3>
          <button className="reva-modal-close" onClick={onClose} aria-label="Close modal">
            <MdClose size={20} />
          </button>
        </div>
        <div className="reva-modal-body">{children}</div>
      </div>
    </div>
  );
};
