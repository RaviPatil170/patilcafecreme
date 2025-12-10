import React from "react";
import ReactDom from "react-dom";
import "./Modal.css"; // UNCOMMENT THIS and keep CSS in Modal.css

export default function Modal({ open, closeModal, children }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("portal")
  );
}
