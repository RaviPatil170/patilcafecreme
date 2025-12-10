import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";
import { Counter } from "./components/Counter";
import AddNewProducts from "./features/AddNewProducts";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Product from "./pages/Product";
import ContactUs from "./pages/ContactUs";
import PageNotFound from "./features/PageNotFound";
import Cart from "./pages/Cart";

import { useDispatch } from "react-redux";

import NewProductsPage from "./pages/NewProductsPage";
import { fetchProductDataThunk } from "./store/productSlice";
import Orders from "./pages/Orders";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductDataThunk());
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>}></Route>
          <Route
            path="/addnewproducts"
            element={<AddNewProducts></AddNewProducts>}
          ></Route>
          <Route path="/ordercart" element={<Cart></Cart>}></Route>
          <Route path="/orderpreparing" element={<Orders></Orders>}></Route>

          <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

/*

*/
