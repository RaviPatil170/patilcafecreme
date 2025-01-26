import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import "./SingleProduct.css"
import { updateQuantity,addNewOrder } from '../store/productSlice';

export default function SingleProduct({product}) {
    const orders = useSelector((state) => state.product.ordersData);
    const dispatch =useDispatch();
    function handleQchange(e, pid) {
        //console.log(e.target.value)
        dispatch(updateQuantity({pid:pid,quantity:e.target.value}))
      //console.log(item);
      
    }
    function addToOrders(e,product){
        console.log(product);
        const {product_id,quantity,product_name,price}=product;
        console.log(orders);
        if(orders.find((el)=>el.product_id==product_id)){
            dispatch(addNewOrder([...orders.filter((el)=>el.product_id!==product_id),{product_id,quantity,product_name,price}]))
        }else{
            dispatch(addNewOrder([...orders,{product_id,quantity,product_name,price}]));
            
        }
        console.log("order has been added");
    }
    //console.log(product)
    return (
      <div>
        <div key={product.product_id} className="product-item">
          <div class="image-container">
            <img src={product.image_url} alt={product.product_name} />
          </div>
          <div className="product-info">
            <span>{product.product_name}</span>
            <p>Ingredients: {product.ingredients}</p>
            <p>Price: {product.price}</p>
            <div className="add-item">
              <input
                type="number"
                name="quantity-input"
                id='quantity-input'
                className='quantity-input'
                value={product.quantity}
                onChange={(e) => handleQchange(e, product.product_id)}
              ></input>
              <button className="btn " onClick={(e)=>{addToOrders(e,product)}}>Add Item:</button>
            </div>
        
          </div>
        </div>
      </div>
    );
}
