import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewOrder,
  fetchTopPicks,
  fetchTopPicksBySales,
  removeItemFromCartOnZero,
  updateQuantity,
} from "../store/productSlice";
import "./TopPicks.css";
import { toast } from "react-toastify";
import { fetchOrdersHistory } from "../store/orderSlice";
export default function TopPicks() {
  const dispatch = useDispatch();
  const topPicks = useSelector((state) => state.product.topPicks);
  const ordersHistory = useSelector((state) => state.order.ordersHistory);
  const containerRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);
  const scrollAmount = 300;

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  useEffect(() => {
    if (ordersHistory.length > 0) {
      dispatch(fetchTopPicksBySales());
    }
  }, [dispatch, ordersHistory.length]);

  const handleNext = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollLeft + scrollAmount, behavior: "smooth" });
  };

  const handlePrev = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollLeft - scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="toppicks-outer-container">
      <div className="toppicks-header-section">
        <h3>Top Picks</h3>
        <div className="toppick-nav-buttons">
          <button onClick={handlePrev}>‹</button>
          <button onClick={handleNext}>›</button>
        </div>
      </div>

      <div className="toppicks-container" ref={containerRef}>
        {topPicks?.map((item) => (
          <TopPicksItem key={item.menuItemId} item={item} />
        ))}
      </div>
    </div>
  );
}

export function TopPicksItem({ item }) {
  const orders = useSelector((state) => state.product.ordersData);
  const quantityForButton = orders.find(
    (el) => el.menuItemId == item.menuItemId
  );
  const dispatch = useDispatch();
  //const item =orders.find((el)=>el.product_id==item.product_id);
  function handleProductAdd(product) {
    dispatch(addNewOrder(product));
    dispatch(updateQuantity({ menuItemId: product.menuItemId, quantity: 1 }));

    toast.success("Item has been added to cart", {
      position: "top-center", // Example: Set all toasts to top center
      autoClose: 2000, // Example: Set all toasts to 3 seconds
      draggable: true, // Example: Disable dragging for all toasts
      // ... other global options
      className: "toast-add-item",
    });
  }

  //let quantityTopPicks =orders.find((el)=>el.product_id==item.product_id);
  const handleIncrement = () => {
    dispatch(
      updateQuantity({
        menuItemId: item.menuItemId,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecrement = () => {
    if (item.quantity == 1) {
      dispatch(
        updateQuantity({
          menuItemId: item.menuItemId,
          quantity: item.quantity - 1,
        })
      );
      dispatch(removeItemFromCartOnZero({ menuItemId: item.menuItemId }));
    } else if (item.quantity > 0) {
      dispatch(
        updateQuantity({
          menuItemId: item.menuItemId,
          quantity: item.quantity - 1,
        })
      );
    }
  };
  return (
    <div
      className="item-container"
      style={{ "--bg-image": `url(${item?.image_url})` }}
    >
      <div className="toppick-image-container">
        {/* <img src={item.image_url} alt={item.product_name}></img> */}
      </div>
      <span className="top-pick-name">{item?.itemName}</span>
      <div className="price-add-button">
        <span className="top-pick-price">{item?.price}</span>
        {quantityForButton?.quantity == 0 || quantityForButton == undefined ? (
          <button
            className="top-pick-button"
            onClick={() => handleProductAdd(item)}
          >
            ADD
          </button>
        ) : (
          <div className="quantity-controls">
            <button onClick={handleDecrement} className="prev-btn">
              -
            </button>
            <span>{quantityForButton?.quantity}</span>
            <button onClick={handleIncrement} className="next-btn">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
