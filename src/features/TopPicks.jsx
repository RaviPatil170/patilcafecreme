import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewOrder, fetchTopPicks } from '../store/productSlice';
import "./TopPicks.css"
export default function TopPicks() {
  const dispatch =useDispatch();
    const topPicks =useSelector((state)=>state.product.topPicks);
    const containerRef = useRef(null);
    const orders = useSelector((state) => state.product.ordersData);
      
       
    
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollAmount = 300; // Adjust scroll amount as needed
    useEffect(()=>{
      dispatch(fetchTopPicks());
    },[]);
   

    function handlePrev(){
      const newScrollLeft = Math.max(0, scrollLeft - scrollAmount);
      setScrollLeft(newScrollLeft);
      containerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
    const handleNext = () => {
      console.log(containerRef.current.scrollWidth,"scrollwidth");
      console.log(containerRef.current.clientWidth,"clientwidth");
      const maxScrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const newScrollLeft = Math.min(maxScrollLeft, scrollLeft + scrollAmount);
      setScrollLeft(newScrollLeft);
      containerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    };
  return (
    <div className="toppicks-outer-container">
      <div className="toppicks-header-section">
        <h3>Top picks</h3>
        <div className="toppick-nav-buttons">
          <span onClick={handlePrev}>
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
          </span>
          <span onClick={handleNext}>
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
          </span>
        </div>
      </div>
      <div className="toppicks-container" ref={containerRef}>
        {topPicks?.map((item) => {
          return <TopPicksItem item={item}></TopPicksItem>;
        })}
      </div>
    </div>
  );
}


export function TopPicksItem({ item }) {
  const orders = useSelector((state) => state.product.ordersData);
  const dispatch =useDispatch();
  function handleProductAdd(product) {
    console.log(product);
    const { product_id, quantity, product_name, price } = product;
    if (orders !== null && orders.find((el) => el.product_id == product_id)) {
      dispatch(
        addNewOrder([
          ...orders.filter((el) => el.product_id !== product_id),
          { product_id, quantity: 1, product_name, price },
        ])
      );
    } else {
      dispatch(
        addNewOrder([
          ...orders,
          { product_id, quantity: 1, product_name, price },
        ])
      );
    }
    dispatch(updateQuantity({ pid: product_id, quantity: 1 }));
    window.localStorage.setItem(
      "ordersInCart",
      JSON.stringify([
        ...orders,
        { product_id, quantity: 1, product_name, price },
      ])
    );

    toast.success("Item has been added to cart", {
      position: "top-center", // Example: Set all toasts to top center
      autoClose: 2000, // Example: Set all toasts to 3 seconds
      draggable: true, // Example: Disable dragging for all toasts
      // ... other global options
      className: "toast-add-item",
    });
  }
  return (
    <div
      className="item-container"
      style={{ "--bg-image": `url(${item.image_url})` }}
    >
      <div className="toppick-image-container">
        {/* <img src={item.image_url} alt={item.product_name}></img> */}
      </div>
      <span className="top-pick-name">{item.product_name}</span>
      <div className="price-add-button">
        <span className="top-pick-price">{item.price}</span>
        <button
          className="top-pick-button"
          onClick={() => handleProductAdd(item)}
        >
          ADD
        </button>
      </div>
    </div>
  );
}