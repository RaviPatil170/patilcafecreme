import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewOrder,
  removeItemFromCartOnZero,
  updateQuantity,
} from "../store/productSlice";
import { toast } from "react-toastify";
import ProgressiveImage from "../components/ProgressiveImage";
import "./TopPicksItem.css";

export default function TopPicksItem({ item }) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.product.ordersData);

  const cartItem = orders.find((el) => el.menuItemId === item.menuItemId);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    dispatch(addNewOrder(item));
    dispatch(updateQuantity({ menuItemId: item.menuItemId, quantity: 1 }));

    toast.success("Item added to cart", {
      position: "top-center",
      autoClose: 1500,
      className: "toast-add-item",
    });
  };

  const handleIncrement = () => {
    dispatch(
      updateQuantity({
        menuItemId: item.menuItemId,
        quantity: quantity + 1,
      })
    );
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      dispatch(updateQuantity({ menuItemId: item.menuItemId, quantity: 0 }));
      dispatch(removeItemFromCartOnZero({ menuItemId: item.menuItemId }));
    } else {
      dispatch(
        updateQuantity({
          menuItemId: item.menuItemId,
          quantity: quantity - 1,
        })
      );
    }
  };

  return (
    <div className="item-container">
      {/* Image */}
      <div className="toppick-image-container">
        <ProgressiveImage
          src={item.image_url}
          placeholder="/placeholders/food-blur.jpg"
          alt={item.itemName}
          className="toppick-img"
        />
      </div>

      {/* Name */}
      <span className="top-pick-name">{item.itemName}</span>

      {/* Price + CTA */}
      <div className="price-add-button">
        <span className="top-pick-price">₹{item.price}</span>

        {quantity === 0 ? (
          <button className="top-pick-button" onClick={handleAdd}>
            ADD
          </button>
        ) : (
          <div className="quantity-controls">
            <button onClick={handleDecrement} className="prev-btn">
              –
            </button>
            <span>{quantity}</span>
            <button onClick={handleIncrement} className="next-btn">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
