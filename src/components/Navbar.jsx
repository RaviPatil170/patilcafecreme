import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import Modal from "./Modal";
import "./Modal.css";
import { useDispatch, useSelector } from "react-redux";
import { setOrdersFromLocalStorage } from "../store/productSlice";
import Cartbasket from "./Cartbasket";
import { fetchOrderDetails } from "../store/orderSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const dispatch = useDispatch();
  const orders = useSelector((state) => state.product.ordersData);
  const toggleButtonRef = useRef(null);
  const location = useLocation();

  const handleNavbarToggle = () => {
    setIsNavbarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (window.localStorage.getItem("ordersInCart")) {
      const savedCart = JSON.parse(window.localStorage.getItem("ordersInCart"));
      dispatch(setOrdersFromLocalStorage(savedCart));
    }
  }, [dispatch]);

  function handleCart() {
    setIsOpen((prev) => !prev);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleClick() {
    setIsNavbarOpen(false);
  }

  const totalItemsInCart =
    orders?.reduce((acc, cur) => acc + (cur.quantity || 0), 0) || 0;

  return (
    <>
      {/* TOP NAVBAR – visible on desktop / tablet */}
      <nav className="navbar">
        <button
          className="navbar-toggle desktop-only"
          onClick={handleNavbarToggle}
          ref={toggleButtonRef}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <ul className={`nav-items desktop-only ${isNavbarOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={handleClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/addnewproducts" onClick={handleClick}>
              Add new Item
            </Link>
            <Link to="/orders-history" onClick={handleClick}>
              Orders History
            </Link>
          </li>
          <li>
            <Link to="/orderpreparing" onClick={handleClick}>
              Orders Details
            </Link>
          </li>
          <li onClick={handleCart} className="cart-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 main-cart-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItemsInCart > 0 && (
              <span className="cart-count">{totalItemsInCart}</span>
            )}
          </li>
        </ul>
      </nav>

      {/* BOTTOM NAVBAR – visible on mobile only */}
      {/* BOTTOM NAVBAR – Swiggy style, visible on mobile only */}
      <div className="bottom-nav mobile-only">
        {/* LEFT TABS */}
        <Link
          to="/"
          className={`bottom-nav-item ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          {/* Home Icon (filled) */}
          <svg className="bottom-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l9 8h-3v9H6v-9H3z" />
          </svg>
          <span>Home</span>
        </Link>

        <Link
          to="/orders-history"
          className={`bottom-nav-item ${
            location.pathname === "/orders-history" ? "active" : ""
          }`}
        >
          <svg
            className="order-history-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" d="M4 4h12a2 2 0 0 1 2 2v12" />
            <path strokeLinecap="round" d="M4 8h10M4 12h10M4 16h6" />
            <circle cx="18" cy="18" r="3" />
            <path strokeLinecap="round" d="M18 16v2l1.5 1" />
          </svg>
          {/* Add Icon */}
          {/* <svg
            className="bottom-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg> */}
          <span>History</span>
        </Link>

        {/* CENTER FLOATING CART BUTTON */}
        <button type="button" className="cart-fab" onClick={handleCart}>
          <div className="cart-fab-inner">
            <svg
              className="bottom-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 4h14l-1.5 9H8.5L7 4zM6 20a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            {totalItemsInCart > 0 && (
              <span className="cart-count-floating">{totalItemsInCart}</span>
            )}
          </div>
          <span className="cart-fab-label">Cart</span>
        </button>

        {/* RIGHT TAB */}
        <Link
          to="/orderpreparing"
          className={`bottom-nav-item ${
            location.pathname === "/orderpreparing" ? "active" : ""
          }`}
        >
          {/* Orders Icon (clock) */}
          <svg
            className="bottom-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <circle cx="12" cy="12" r="9"></circle>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7v5l3 3"
            />
          </svg>
          <span>Orders</span>
        </Link>
      </div>

      {/* Cart modal */}
      <Modal open={isOpen} closeModal={closeModal} modalHeader="Order Details">
        <Cartbasket orders={orders} closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default Navbar;
