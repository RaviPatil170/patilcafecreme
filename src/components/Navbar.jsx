import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Modal from "./Modal";
import "./Modal.css";
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder, setOrdersFromLocalStorage } from "../store/productSlice";
import Cartbasket from "./Cartbasket";
import { fetchOrderDetails } from "../store/orderSlice";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const orders = useSelector((state) => state.product.ordersData);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State for navbar toggle
  const toggleButtonRef = useRef(null);

  const handleNavbarToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  useEffect(() => {
    if (window.localStorage.getItem("ordersInCart")) {
      const savedCart = JSON.parse(window.localStorage.getItem("ordersInCart"));
      console.log(savedCart, "saved carts");
      dispatch(setOrdersFromLocalStorage(savedCart));
    }
  }, []);
  function handleCart() {
    setIsOpen(() => !isOpen);
  }
  function closeModal() {
    setIsOpen(() => false);
  }
  function handleClick() {
    setIsNavbarOpen(() => false);
  }
  console.log(orders, "from  navbar page");
  return (
    <>
      <nav className="navbar">
        <button
          className="navbar-toggle"
          onClick={handleNavbarToggle}
          ref={toggleButtonRef}
        >
          {/* You can use an SVG icon for the toggle button */}
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
        <ul className={`nav-items ${isNavbarOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={handleClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/addnewproducts" onClick={handleClick}>
              Add new Item
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
            {orders?.length > 0 && (
              <span class="cart-count">
                {orders?.reduce((acc, cur) => {
                  return acc + cur.quantity;
                }, 0)}
              </span>
            )}
          </li>
        </ul>
        <div onClick={handleCart} className="cart-icon mobile-only">
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
          {orders?.length > 0 && (
            <span class="cart-count">
              {orders?.reduce((acc, cur) => {
                return acc + cur.quantity;
              }, 0)}
            </span>
          )}
        </div>
      </nav>
      <Modal open={isOpen} closeModal={closeModal} modalHeader="Order Details">
        <Cartbasket orders={orders} closeModal={closeModal}></Cartbasket>
      </Modal>
    </>
  );
};

export default Navbar;
