import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./OrdersPreparing.css";

export default function OrdersPreparing() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadPreparingOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("order_details")
      .select("*")
      .eq("order_status", "preparing")
      .order("order_id", { ascending: false });

    if (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPreparingOrders();
  }, []);

  async function handleMarkCompleted(orderId) {
    try {
      setUpdatingId(orderId);

      const { error } = await supabase
        .from("order_details")
        .update({ order_status: "completed" })
        .eq("order_id", orderId);

      if (error) {
        console.error("Error marking order completed:", error);
        return;
      }

      // Remove it from the "preparing" list locally
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } finally {
      setUpdatingId(null);
    }
  }

  const getCurrentStep = (status) => {
    switch (status) {
      case "completed":
        return 3;
      case "preparing":
        return 2;
      default:
        return 1; // placed / other
    }
  };

  const steps = ["Placed", "Preparing", "Completed"];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Orders Being Prepared</h2>
        <button onClick={loadPreparingOrders} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <p>No orders are currently being prepared.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const currentStep = getCurrentStep(order.order_status);

          return (
            <div className="order-card" key={order.order_id}>
              <div className="order-top">
                <div>
                  <strong>Order #{order.order_id}</strong>
                  <div className="order-meta">
                    <span>User: {order.user_id}</span>
                    <span>Total Qty: {order.quantity}</span>
                  </div>
                </div>
                <div className="order-actions">
                  <span className="status preparing-status">
                    {order.order_status}
                  </span>
                  <button
                    className="complete-btn"
                    onClick={() => handleMarkCompleted(order.order_id)}
                    disabled={updatingId === order.order_id}
                  >
                    {updatingId === order.order_id
                      ? "Updating..."
                      : "Mark Completed"}
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="order-timeline">
                {steps.map((label, index) => {
                  const stepNumber = index + 1;
                  const isDone = stepNumber <= currentStep;
                  return (
                    <div className="timeline-step-wrapper" key={label}>
                      <div
                        className={
                          "timeline-step-dot " +
                          (isDone ? "timeline-step-dot-done" : "")
                        }
                      >
                        {stepNumber}
                      </div>
                      <div className="timeline-step-label">{label}</div>
                      {index < steps.length - 1 && (
                        <div
                          className={
                            "timeline-step-line " +
                            (stepNumber < currentStep
                              ? "timeline-step-line-done"
                              : "")
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Items list */}
              <div className="order-items">
                {Array.isArray(order.order_items) &&
                  order.order_items.map((item, index) => (
                    <div className="order-row" key={index}>
                      <span>{item.product_name}</span>
                      <span>x{item.quantity}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
