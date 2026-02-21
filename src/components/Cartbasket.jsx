import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewOrder,
  removeItemFromCart,
  removeItemFromCartOnZero,
  updateQuantity,
  clearCart,
  stopEditingOrder,
} from "../store/productSlice";
import { fetchOrderDetails } from "../store/orderSlice";
import "./Cart.css";

export default function Cartbasket({ orders, closeModal }) {
  const dispatch = useDispatch();
  const editingOrderId = useSelector((state) => state.product.editingOrderId);
  const isPlacingOrder = useSelector((state) => state.order.isOrderPlacing);
  const [customerName, setCustomerName] = useState("");
  function clearCartEverywhere() {
    dispatch(clearCart());
    window.localStorage.setItem("ordersInCart", JSON.stringify([]));
  }

  async function placeOrder() {
    if (!orders || orders.length === 0) return;

    const finalName =
      customerName.trim() !== "" ? customerName.trim() : "Cafe Crème";

    const success = dispatch(fetchOrderDetails([...orders], finalName));

    if (success) {
      dispatch(clearCart());
      dispatch(stopEditingOrder());
      window.localStorage.removeItem("ordersInCart");

      setCustomerName("");
      closeModal();
    }
  }

  function cancelOrder() {
    dispatch(clearCart());
    dispatch(stopEditingOrder());
    window.localStorage.removeItem("ordersInCart");
    closeModal();
  }

  const handleQuantityChange = (menuItemId, newQuantity) => {
    const q = Math.max(0, parseInt(newQuantity || 0, 10));

    if (q === 0) {
      dispatch(removeItemFromCartOnZero({ menuItemId }));
      return;
    }

    dispatch(updateQuantity({ menuItemId, quantity: q }));
  };

  const handleRemoveItem = (menuItemId) => {
    dispatch(removeItemFromCart(menuItemId));
  };

  const calculateSubtotal = () => {
    return orders.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="cart-popup cart-empty">
        <h2 className="cart-title">Cart Empty</h2>
        <p className="cart-empty-text">
          Good food is always cooking! Go ahead, add some yummy items from the
          menu.
        </p>
      </div>
    );
  }

  return (
    <div className="cart-popup">
      <h2 className="cart-title">
        {editingOrderId ? `Editing Order #${editingOrderId}` : "Your Cart"}
      </h2>
      <div className="customer-input">
        <label>Customer Name</label>
        <input
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <div className="cart-items">
        {orders.map((item) => (
          <div className="cart-item" key={item.menuItemId}>
            <div className="item-info">
              <h3 className="item-name">{item.itemName}</h3>
            </div>

            <div className="item-controls">
              <div className="qty-wrapper">
                <button
                  className="qty-btn"
                  onClick={() =>
                    handleQuantityChange(
                      item.menuItemId,
                      (item.quantity || 0) - 1
                    )
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={item.quantity}
                  min="0"
                  onChange={(e) =>
                    handleQuantityChange(item.menuItemId, e.target.value)
                  }
                />
                <button
                  className="qty-btn"
                  onClick={() =>
                    handleQuantityChange(
                      item.menuItemId,
                      (item.quantity || 0) + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              <span className="item-total">
                ₹
                {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(
                  2
                )}
              </span>

              <button
                className="remove-btn"
                onClick={() => handleRemoveItem(item.menuItemId)}
                aria-label="Remove item"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="subtotal">
          <span>Subtotal</span>
          <span className="subtotal-amount">
            ₹{calculateSubtotal().toFixed(2)}
          </span>
        </div>

        <div className="cart-actions">
          <button
            className="place-order-btn"
            onClick={placeOrder}
            disabled={orders.length === 0 || isPlacingOrder}
          >
            {editingOrderId ? "Update Order" : "Place Order"}
          </button>

          <button className="cancel-order-btn" onClick={cancelOrder}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
