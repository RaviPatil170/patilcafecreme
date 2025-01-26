import React, { Children } from 'react'
import ReactDom from "react-dom";
//import "./Modal.css"
export default function Modal({open,closeModal,children,modalHeader}) {
  if(!open) return null;
    return ReactDom.createPortal(
    <>
    
       <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{modalHeader}</h2>
            {children}
            
          </div>
        </div>
      
    </>,
    document.getElementById('portal')
  )
}
