import React from "react";
import "./orderReceiptSheet.css";
export default function OrderReceiptSheet({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="order-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Action Bar */}
        <div className="sheet-actions">
          <button className="action-btn" onClick={() => window.print()}>
            🖨️ Print
          </button>
          <button className="action-btn secondary" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        {/* Receipt */}
        <div className="sheet-content">
          <div className="receipt">
            <div className="receipt-header">
              <h3>Café Crème</h3>
              <p className="receipt-sub">Order #{order.order_id}</p>
              <p className="receipt-sub">
                {new Date(order.created_at).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="receipt-divider" />

            {/* Items */}
            <div className="receipt-items">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="receipt-row">
                  <span>
                    {item.product_name} ×{item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider" />

            {/* Total */}
            <div className="receipt-row receipt-total">
              <span>Total</span>
              <span>₹{order.total_price}</span>
            </div>

            <div className="receipt-divider" />

            <p className="receipt-footer">
              Thank you for visiting Café Crème ☕<br />
              Please come again!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
