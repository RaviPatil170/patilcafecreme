import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Products.css"
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder, fetchProductData } from "../store/productSlice";
import SingleProduct from "./SingleProduct";
const supabaseUrl = "https://crxvwnueirwsbrvmlwem.supabase.co"; // Corrected URL format
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeHZ3bnVlaXJ3c2Jydm1sd2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Mzc2MDcsImV4cCI6MjA1MjUxMzYwN30.QjseonqK545EcPWnPvL48r496V-5-ezs1ciPPSOkNlw"; // Removed duplicate https

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Products() {
  const dispatch =useDispatch();
  
    const products=useSelector((state)=>state.product.productData);
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    dispatch(fetchProductData())
  }, []);
  
  //console.log(orders,"------")
  return (
    <div>
      {isLoading ? (
        <p>Loading Products...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <h1>Food Products</h1>

          <div className="products">
            {products?.map((product) => (
             <SingleProduct key={product.product_id} product={product}></SingleProduct>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products