import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder, fetchTopPicks, removeItemFromCartOnZero, updateQuantity } from "../store/productSlice";
import "./TopPicks.css";
import MyComponent from "../components/MyComponent";
import { toast } from "react-toastify";
export default function TopPicks() {
  
  const dispatch = useDispatch();
  const topPicks = useSelector((state) => state.product.topPicks);
  const containerRef = useRef(null);
  const orders = useSelector((state) => state.product.ordersData);
  const [atStart, setAtStart] = React.useState(false);
  const [atEnd, setAtEnd] = React.useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollAmount = 300; // Adjust scroll amount as needed
  useEffect(()=>{
    dispatch(fetchTopPicks());
  },[])
 
  useEffect(() => {
    if (containerRef.current && topPicks?.length > 0) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      //setAtStart(scrollLeft === 0);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  }, []);

  const handleNext = () => {
    if (containerRef.current) {
      const maxScrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const newScrollLeft = Math.min(maxScrollLeft, containerRef.current.scrollLeft + scrollAmount);
      containerRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      const newScrollLeft = Math.max(0, containerRef.current.scrollLeft - scrollAmount);
      containerRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };
  return (
    <div className="toppicks-outer-container">
      <div className="toppicks-header-section">
        <h3>Top picks</h3>
        <div className="toppick-nav-buttons">
          <button onClick={handlePrev} disabled={atStart}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 toppick-prev-button"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <button onClick={handleNext} disabled={atEnd}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 toppick-next-button"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="toppicks-container" ref={containerRef}>
        {topPicks?.map((item) => {
          return <TopPicksItem item={item}   key={item.menuItemId}></TopPicksItem>;
        })}
      </div>
    </div>
  );
}

export function TopPicksItem({ item}) {
  const orders = useSelector((state) => state.product.ordersData);
  const  quantityForButton =orders.find((el)=>el.menuItemId==item.menuItemId) ;
  const dispatch = useDispatch();
  //const item =orders.find((el)=>el.product_id==item.product_id);
  function handleProductAdd(product) {
    
    dispatch(addNewOrder(product));
    dispatch(updateQuantity({menuItemId:product.menuItemId,quantity:1}))

   

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
    dispatch(updateQuantity({menuItemId:item.menuItemId,quantity:item.quantity+1}))
  };

  const handleDecrement = () => {
    if (item.quantity==1) {
      dispatch(updateQuantity({menuItemId:item.menuItemId,quantity:item.quantity-1}));
      dispatch(removeItemFromCartOnZero({menuItemId:item.menuItemId}))
      
    }else if(item.quantity > 0 ){
      dispatch(updateQuantity({menuItemId:item.menuItemId,quantity:item.quantity-1}));
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
        {quantityForButton?.quantity == 0 || quantityForButton==undefined? (
          <button
            className="top-pick-button"
            onClick={() => handleProductAdd(item)}
          >
            ADD
          </button>
        ) : (
          <div className="quantity-controls">
            <button onClick={handleDecrement} className="prev-btn">-</button>
            <span>{quantityForButton?.quantity}</span>
            <button onClick={handleIncrement} className="next-btn">+</button>
          </div>
        )}
      </div>
    </div>
  );
}
