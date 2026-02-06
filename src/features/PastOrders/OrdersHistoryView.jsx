import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersHistory } from "../../store/orderSlice";
import OrderReceiptSheet from "./OrderReceiptSheet";

import "./OrdersHistoryView.css";
import { SupabaseClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import {
  preloadCartFromOrder,
  startEditingOrder,
} from "../../store/productSlice";

/* ------------------ constants ------------------ */

const FILTER_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 3 Months", value: "3months" },
];

/* ------------------ helpers ------------------ */

const filterOrdersByDate = (orders, filter) => {
  const now = new Date();

  return orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const diffDays =
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

    switch (filter) {
      case "today":
        return diffDays < 1;
      case "7days":
        return diffDays <= 7;
      case "30days":
        return diffDays <= 30;
      case "3months":
        return diffDays <= 90;
      default:
        return true;
    }
  });
};

/* ------------------ component ------------------ */

export default function OrdersHistoryView() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.ordersHistory || []);

  const [activeFilter, setActiveFilter] = useState("today");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  const filteredOrders = useMemo(
    () => filterOrdersByDate(orders, activeFilter),
    [orders, activeFilter]
  );

  const totalSales = useMemo(
    () =>
      filteredOrders.reduce(
        (sum, order) => sum + Number(order.total_price || 0),
        0
      ),
    [filteredOrders]
  );

  /* ------------------ edit helpers ------------------ */

  const updateQty = (index, delta) => {
    setEditOrder((prev) => {
      if (!prev) return prev;

      const items = [...(prev.order_items || [])];
      items[index] = {
        ...items[index],
        quantity: Math.max(1, items[index].quantity + delta),
      };

      return { ...prev, order_items: items };
    });
  };
  //   const addItemToOrder = (product) => {
  //     setEditOrder((prev) => {
  //       const existing = prev.order_items.find(
  //         (i) => i.product_id === product.product_id
  //       );

  //       if (existing) {
  //         return {
  //           ...prev,
  //           order_items: prev.order_items.map((i) =>
  //             i.product_id === product.product_id
  //               ? { ...i, quantity: i.quantity + 1 }
  //               : i
  //           ),
  //         };
  //       }

  //       return {
  //         ...prev,
  //         order_items: [
  //           ...prev.order_items,
  //           {
  //             product_id: product.product_id,
  //             product_name: product.product_name,
  //             price: product.price,
  //             quantity: 1,
  //           },
  //         ],
  //       };
  //     });
  //   };
  const updateOrderClick = (order) => {
    dispatch(preloadCartFromOrder(order.order_items));
    dispatch(startEditingOrder(order.order_id));
    navigate("/");
  };

  const handleUpdateOrder = async () => {
    if (!editOrder) return;

    const total_price = editOrder.order_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const quantity = editOrder.order_items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    await SupabaseClient.from("order_details")
      .update({
        order_items: editOrder.order_items,
        total_price,
        quantity,
      })
      .eq("order_id", editOrder.order_id);

    setEditOrder(null);
    dispatch(fetchOrdersHistory());
  };

  /* ------------------ render ------------------ */

  return (
    <div className="orders-history-container">
      {/* Header */}
      <div className="orders-header">
        <h2>Orders History</h2>

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
              {new Date(order.created_at).toLocaleDateString("en-IN", {
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

            <div className="order-actions">
              <button
                className="link-btn"
                onClick={() => setSelectedOrder(order)}
              >
                View
              </button>

              {order.order_status === "preparing" && (
                <button
                  className="link-btn edit"
                  onClick={() => updateOrderClick(order)}
                >
                  Update
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sheets */}
      <OrderReceiptSheet
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* <OrderEditSheet
        order={editOrder}
        onClose={() => setEditOrder(null)}
        onUpdateQty={updateQty}
        onSave={handleUpdateOrder}
        onAddItem={addItemToOrder}
      /> */}
    </div>
  );
}
