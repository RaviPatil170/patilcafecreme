import React from "react";
import "./SingleMenuItem.css";
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder, updateQuantity } from "../../store/productSlice";
import { toast } from "react-toastify";

export default function SingleMenuItem({ item }) {
  const orders = useSelector((state) => state.product.ordersData);

  // match using product_id instead of menuItemId
  const quantityForButton = orders.find(
    (el) => el.menuItemId === item.product_id
  );

  const dispatch = useDispatch();

  function handleProductAdd(item) {
    const mapped = {
      menuItemId: item.product_id,
      itemName: item.product_name,
      description: item.product_description,
      price: item.price,
      image_url: item.image_url,
      quantity: 1,
    };

    dispatch(addNewOrder(mapped));
    dispatch(updateQuantity({ menuItemId: item.product_id, quantity: 1 }));

    toast.success("Item has been added to cart", {
      position: "top-center",
      autoClose: 2000,
      draggable: true,
      className: "toast-add-item",
    });
  }

  const handleIncrement = () => {
    dispatch(
      updateQuantity({
        menuItemId: item.product_id,
        quantity: quantityForButton?.quantity
          ? quantityForButton.quantity + 1
          : 1,
      })
    );
  };

  const handleDecrement = () => {
    if (quantityForButton?.quantity > 0) {
      dispatch(
        updateQuantity({
          menuItemId: item.product_id,
          quantity: quantityForButton.quantity - 1,
        })
      );
    }
  };

  return (
    <div className="menu-item">
      <div className="item-description">
        <div className="name-price">
          <span className="item-name">{item.product_name}</span>
          <span className="item-price">
            <span className="ruppe-symbol">₹</span>
            {item.price}
          </span>
        </div>

        <span className="item-rating">4.5</span>

        <span className="item-summary">
          {item.product_description.split(" ").slice(0, 20).join(" ")}
          ...<button className="show-more">more</button>
        </span>
      </div>

      <div className="item-right-section">
        <img
          src={item.image_url}
          alt={item.product_name}
          loading="lazy"
          width="160"
          height="120"
          onLoad={(e) => e.target.classList.add("loaded")}
          className="product-image skeleton "
        />

        {!quantityForButton?.quantity ? (
          <button className="button-add" onClick={() => handleProductAdd(item)}>
            ADD
          </button>
        ) : (
          <div className="quantity-controls-single-menu-item">
            <button onClick={handleDecrement} className="prev-btn">
              -
            </button>
            <span>{quantityForButton.quantity}</span>
            <button onClick={handleIncrement} className="next-btn">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
