import React from "react";
import NewProducts from "../features/NewProducts";
import "./NewProductsPage.css";
import TopPicks from "../features/TopPicks";

export default function NewProductsPage() {
  //const products = useSelector((state) => state.product.productData);
  return (
    <div className="new-menu-container">
      <TopPicks></TopPicks>
      <NewProducts></NewProducts>
    </div>
  );
}
