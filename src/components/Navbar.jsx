import React,{useEffect, useState}from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"
import Modal from './Modal';
import "./Modal.css"
import { useDispatch, useSelector } from 'react-redux';
import { addNewOrder,fetchOrderDetails, setOrdersFromLocalStorage } from '../store/productSlice';
import Cartbasket from './Cartbasket';
const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);
const dispatch =useDispatch();
   const orders = useSelector((state) => state.product.ordersData);
  
   useEffect(()=>{
  
    if(window.localStorage.getItem("ordersInCart")){
      const savedCart =JSON.parse(window.localStorage.getItem("ordersInCart"));
      dispatch(setOrdersFromLocalStorage(savedCart));
    }
   },[])
 function handleCart() {
   console.log("opennn");
   setIsOpen(() => !isOpen);
 }
 function closeModal() {
   setIsOpen(() => false);
 }
   return (
    <>
    <nav className="navbar">
      <ul className='nav-items'>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Order Food</Link>
        </li>
        <li>
          <Link to="/addnewproducts">Add new Item</Link>
        </li>
        <li>
          <Link to="/contactus">Contact</Link>
        </li>
        <li onClick={handleCart} className='cart-icon'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg> 
                {orders?.length>0 && <span class="cart-count">{orders?.length}</span> }
                          
        </li>
      </ul>
      
    </nav>
    <Modal open={isOpen} closeModal={closeModal} modalHeader="Order Details">
      <Cartbasket orders={orders} closeModal={closeModal}></Cartbasket>
    </Modal>
    </>
  );
};


export default Navbar;