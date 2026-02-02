import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersHistory } from "../../store/orderSlice";
import "./OrdersHistoryView.css";

const FILTER_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 3 Months", value: "3months" },
];

export default function OrdersHistoryView() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.ordersHistory || []);

  const [activeFilter, setActiveFilter] = useState("today");
  const [selectedOrder, setSelectedOrder] = useState(null); // modal

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  // 🔹 Filter logic
  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const diffDays =
        (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

      if (activeFilter === "today") return diffDays < 1;
      if (activeFilter === "7days") return diffDays <= 7;
      if (activeFilter === "30days") return diffDays <= 30;
      if (activeFilter === "3months") return diffDays <= 90;

      return true;
    });
  }, [orders, activeFilter]);

  // 🔹 Sales total
  const totalSales = useMemo(() => {
    return filteredOrders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0
    );
  }, [filteredOrders]);

  return (
    <div className="orders-history-container">
      <div className="orders-header">
        <h2>Orders History</h2>

        {/* Combo Filter */}
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="orders-summary">
        <span>
          Total Orders: <b>{filteredOrders.length}</b>
        </span>
        <span>
          Total Sales: <b>₹{totalSales}</b>
        </span>
      </div>

      {/* Table */}
      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 && (
          <div className="no-data">No orders found</div>
        )}

        {filteredOrders.map((order) => (
          <div key={order.order_id} className="order-card">
            <div className="order-top">
              <span className="order-id">Order #{order.order_id}</span>
              <span className={`status-pill ${order.order_status}`}>
                {order.order_status}
              </span>
            </div>

            <div className="order-date">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div className="order-meta">
              <span>
                Qty: <b>{order.quantity}</b>
              </span>
              <span>
                Total: <b>₹{order.total_price}</b>
              </span>
            </div>

            <button
              className="view-items-link"
              onClick={() => setSelectedOrder(order)}
            >
              View items →
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="sheet-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Drag Handle */}
            <div className="sheet-handle" />

            {/* Header */}
            <div className="sheet-actions">
              <button className="action-btn" onClick={() => window.print()}>
                <span className="icon">🖨️</span>
                Print
              </button>

              <button
                className="action-btn secondary"
                onClick={() => setSelectedOrder(null)}
              >
                <span className="icon">✕</span>
                Close
              </button>
            </div>

            <div className="sheet-header">
              <h3>Order #{selectedOrder.order_id}</h3>
              <span className="sheet-date">
                {new Date(selectedOrder.created_at).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </div>

            {/* Items */}
            <div className="receipt">
              {/* Header */}
              <div className="receipt-header">
                <h3>Café Crème</h3>
                <p className="receipt-sub">Order #{selectedOrder.order_id}</p>
                <p className="receipt-sub">
                  {new Date(selectedOrder.created_at).toLocaleString("en-IN", {
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
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="receipt-row">
                    <div className="receipt-item-name">
                      {item.product_name}
                      <span className="receipt-qty">×{item.quantity}</span>
                    </div>
                    <div className="receipt-price">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="receipt-divider" />

              {/* Totals */}
              <div className="receipt-summary">
                <div className="receipt-row">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.total_price}</span>
                </div>

                {/* Optional tax */}
                {/* <div className="receipt-row">
    <span>GST (5%)</span>
    <span>₹{Math.round(selectedOrder.total_price * 0.05)}</span>
  </div> */}

                <div className="receipt-row receipt-total">
                  <span>Total</span>
                  <span>₹{selectedOrder.total_price}</span>
                </div>
              </div>

              <div className="receipt-divider" />

              <p className="receipt-footer">
                Thank you for visiting Café Crème ☕<br />
                Please come again!
              </p>
            </div>

            {/* Footer */}
            <div className="sheet-footer">
              <div className="sheet-total">
                Total: ₹{selectedOrder.total_price}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
