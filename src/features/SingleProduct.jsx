import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import "./SingleProduct.css"
import { updateQuantity,addNewOrder } from '../store/productSlice';
import { toast } from 'react-toastify';

export default function SingleProduct({product}) {
    const orders = useSelector((state) => state.product.ordersData);
    const dispatch =useDispatch();
   
    function addToOrders(e,product){
        console.log(product);
        const {product_id,quantity,product_name,price}=product;
        if(orders!==null && orders.find((el)=>el.product_id==product_id)){
            dispatch(addNewOrder([...orders.filter((el)=>el.product_id!==product_id),{product_id,quantity:1,product_name,price}]))
        }else{
            dispatch(addNewOrder([...orders,{product_id,quantity:1,product_name,price}]));
            
        }
        dispatch(updateQuantity({pid:product_id,quantity:1}));
        window.localStorage.setItem("ordersInCart",JSON.stringify([...orders,{product_id,quantity:1,product_name,price}]));
       
        toast.success("Item has been added to cart",{
          position: "top-center", // Example: Set all toasts to top center
          autoClose: 2000, // Example: Set all toasts to 3 seconds
          draggable: true, // Example: Disable dragging for all toasts
          // ... other global options
          className:"toast-add-item"
        });
    }
    return (
      <div>
        <div key={product.product_id} className="product-item">
          <div class="image-container">
            <img src={product.image_url} alt={product.product_name} />
          </div>
          <div className="product-info">
            <div className="product-name">
              <span className="name">{product.product_name}</span>
              <span className="price"><span className='ruppe-symbol'>₹</span>{product.price}</span>
            </div>
            <div className='product-description'>
              {product.product_description.split(" ").slice(0,10).join(" ")}
              ...<button className='show-more'>more</button>
            </div>
            <div className="add-item">
              <span value={product.quantity}name="quantity-input"
                id="quantity-input"></span>
              {/* <input
                type="number"
                name="quantity-input"
                id="quantity-input"
                className="quantity-input"
                value={product.quantity}
                onChange={(e) => handleQchange(e, product.product_id)}
              ></input> */}
              <button
                className="btn "
                onClick={(e) => {
                  addToOrders(e, product);
                }}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
