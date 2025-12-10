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
//import "./Cartbasket.css";
export default function Cartbasket({ orders, closeModal }) {
  const dispatch = useDispatch();
  function placeOrder() {
    if (orders.length == 0) return;
    localStorage.setItem("ordersInCart", []);
    dispatch(fetchOrderDetails(orders));
    closeModal();
  }
  function cancelOrder() {
    dispatch(addNewOrder(""));
    localStorage.setItem("ordersInCart", []);
    closeModal();
  }
  const handleQuantityChange = (menuItemId, newQuantity) => {
    if (newQuantity == 0) {
      dispatch(removeItemFromCartOnZero({ menuItemId: menuItemId }));
      return;
    }

    dispatch(
      updateQuantity({
        menuItemId: menuItemId,
        quantity: parseInt(newQuantity),
      })
    );
  };

  const handleRemoveItem = (menuItemId) => {
    dispatch(removeItemFromCart(menuItemId));
  };

  const calculateSubtotal = () => {
    return orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  if (orders.length == 0) {
    return (
      <div className="empty-cart">
        <h2>Cart Empty</h2>
        <p>
          Good food is always cooking! Go ahead, order some yummy items from the
          menu.
        </p>
      </div>
    );
  }

  return (
    <div className="cart-popup">
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-items">
        {orders.map((item, index) => (
          <div className="cart-item" key={index}>
            <div className="item-info">
              <h3>{item.itemName}</h3>
            </div>
            <div className="item-controls">
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                min="0"
                onChange={(e) =>
                  handleQuantityChange(item.menuItemId, e.target.value)
                }
              />
              <span className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                className="remove-btn"
                onClick={() => handleRemoveItem(item.menuItemId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="white"
                >
                  <path
                    d="M3 6h18M9 6V4h6v2m-9 0h12v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6h3zm3 4v6m4-6v6"
                    stroke="black"
                    strokeWidth="2"
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
          Subtotal: ₹{calculateSubtotal().toFixed(2)}
        </div>
        <div className="cart-actions right-align">
          <button className="place-order-btn" onClick={placeOrder}>
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
