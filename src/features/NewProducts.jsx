import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuCategory from "./Menu/MenuCategory";
import "./NewProducts.css";

export default function NewProducts() {
  const products = useSelector((state) => state.product.productData);
  console.log("New Products:", products);
  return (
    <div className="menu-container-for-middle">
      <MenuCategory products={products}></MenuCategory>
    </div>
  );
}
