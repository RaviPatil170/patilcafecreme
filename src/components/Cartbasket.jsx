import React from "react";
import { useDispatch } from "react-redux";
import {
  addNewOrder,
  removeItemFromCart,
  removeItemFromCartOnZero,
  updateQuantity,
} from "../store/productSlice";
import { fetchOrderDetails } from "../store/orderSlice";
import "./Cart.css";

export default function Cartbasket({ orders, closeModal }) {
  const dispatch = useDispatch();

  function clearCartEverywhere() {
    // clear redux cart (addNewOrder with falsy payload clears in your slice)
    dispatch(addNewOrder(null));
    // clear localStorage correctly
    window.localStorage.setItem("ordersInCart", JSON.stringify([]));
  }

  async function placeOrder() {
    if (!orders || orders.length === 0) return;

    // send to Supabase (orderSlice thunk)
    dispatch(fetchOrderDetails(orders));
    // immediately clear cart in UI
    clearCartEverywhere();
    closeModal();
  }

  function cancelOrder() {
    clearCartEverywhere();
    closeModal();
  }

  const handleQuantityChange = (menuItemId, newQuantity) => {
    const q = Math.max(0, parseInt(newQuantity || 0, 10));

    if (q === 0) {
      dispatch(removeItemFromCartOnZero({ menuItemId }));
      return;
    }

    dispatch(
      updateQuantity({
        menuItemId,
        quantity: q,
      })
    );
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
      <h2 className="cart-title">Your Cart</h2>

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
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 6h18M9 6V4h6v2m-9 0h12v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6h3zm3 4v6m4-6v6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
            disabled={orders.length === 0}
          >
            Place Order
          </button>
          <button className="cancel-order-btn" onClick={cancelOrder}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
