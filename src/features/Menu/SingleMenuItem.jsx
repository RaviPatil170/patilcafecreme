import React from 'react'
import "./SingleMenuItem.css"
import { useDispatch, useSelector } from 'react-redux';
import { addNewOrder, updateQuantity } from '../../store/productSlice';
import { toast } from 'react-toastify';
export default function SingleMenuItem({item}) {
    const orders = useSelector((state) => state.product.ordersData);
   const  quantityForButton =orders.find((el)=>el.menuItemId==item.menuItemId) ;
   console.log(quantityForButton,"quantityForButton")
    const dispatch =useDispatch();
    function handleProductAdd(item) {
      console.log(item);
      dispatch(addNewOrder(item));
      dispatch(
        updateQuantity({ menuItemId: item.menuItemId, quantity: 1 })
      );
      window.localStorage.setItem("ordersInCart",JSON.stringify([...orders]));

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
          updateQuantity({menuItemId: item.menuItemId,quantity: item.quantity + 1,})
        );
      };

      const handleDecrement = () => {
        if (item?.quantity >= 0) {
          dispatch(
            updateQuantity({menuItemId: item.menuItemId,quantity: item.quantity - 1,
            })
          );
        }
      };
  return (
    <div className="menu-item">
      <div className="item-description">
        <div className="name-price">
          <span className="item-name">{item.itemName}</span>
          <span className="item-price">
            <span className="ruppe-symbol">₹</span>
            {item.price}
          </span>
        </div>
        <span className="item-rating">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
          4.5
        </span>
        <span className="item-summary">{item.description}</span>
      </div>
      <div className="item-right-section">
        <img src={item.image_url} alt={item.itemName} loading='lazy'></img>
        {  quantityForButton?.quantity == 0 || quantityForButton==undefined? (
           <button className="button-add" onClick={(e)=>{handleProductAdd(item)}}>ADD</button>
        ) : (
          <div className="quantity-controls-single-menu-item">
            <button onClick={handleDecrement} className="prev-btn">-</button>
            <span>{quantityForButton?.quantity}</span>
            <button onClick={handleIncrement} className="next-btn">+</button>
          </div>
        )}
      </div>
    </div>
  );
}
