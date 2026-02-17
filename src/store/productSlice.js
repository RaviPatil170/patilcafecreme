// store/productSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import { act } from "react";

const loadOrdersFromStorage = () => {
  try {
    const raw = window.localStorage.getItem("ordersInCart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState = {
  // flat array of products from Supabase
  productData: [],
  // cart
  ordersData: loadOrdersFromStorage(),
  loading: false,
  error: null,
  responseForAddedProduct: null,
  topPicks: [],
  topPickError: "",
  editingOrderId: null,
  topPicksLoading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // fill productData with Supabase products
    fetchProductData(state, action) {
      state.productData = action.payload || [];
      state.loading = false;
      state.error = null;
    },

    addNewProduct(state, action) {
      state.responseForAddedProduct = action.payload;
      if (action.payload) {
        state.productData = [...state.productData, action.payload];
      }
    },

    addNewOrder(state, action) {
      const item = action.payload;
      if (!item) {
        state.ordersData = [];
        window.localStorage.setItem("ordersInCart", JSON.stringify([]));
        return;
      }

      const recordIndex = state.ordersData.findIndex(
        (el) => el.menuItemId === item.menuItemId
      );

      if (recordIndex === -1) {
        state.ordersData = [...state.ordersData, item];
      } else {
        const existing = state.ordersData[recordIndex];
        existing.quantity = (existing.quantity || 0) + (item.quantity || 1);
      }

      window.localStorage.setItem(
        "ordersInCart",
        JSON.stringify(state.ordersData)
      );
    },

    removeItemFromCartOnZero(state, action) {
      const { menuItemId } = action.payload;
      state.ordersData = state.ordersData.filter(
        (item) => item.menuItemId !== menuItemId
      );
      window.localStorage.setItem(
        "ordersInCart",
        JSON.stringify(state.ordersData)
      );
    },

    updateQuantity(state, action) {
      const { menuItemId, quantity } = action.payload;

      // update in topPicks if present
      state.topPicks = state.topPicks.map((el) =>
        el.menuItemId === menuItemId ? { ...el, quantity } : el
      );

      // update in ordersData and drop if quantity <= 0
      state.ordersData = state.ordersData
        .map((el) => (el.menuItemId === menuItemId ? { ...el, quantity } : el))
        .filter((el) => el.quantity > 0);

      window.localStorage.setItem(
        "ordersInCart",
        JSON.stringify(state.ordersData)
      );
    },

    removeItemFromCart(state, action) {
      const id = action.payload;
      state.ordersData = state.ordersData.filter(
        (item) => item.menuItemId !== id
      );
      window.localStorage.setItem(
        "ordersInCart",
        JSON.stringify(state.ordersData)
      );
    },

    setOrdersFromLocalStorage(state, action) {
      state.ordersData = action.payload || [];
    },

    setTopPicks(state, action) {
      state.topPicks = action.payload;
    },

    setTopPicksEroor(state, action) {
      state.topPickError = action.payload;
    },
    preloadCartFromOrder(state, action) {
      const orderItems = action.payload || [];
      state.ordersData = orderItems.map((item) => ({
        menuItemId: item.product_id,
        itemName: item.product_name,
        price: item.price,
        quantity: item.quantity,
      }));
      window.localStorage.setItem(
        "ordersInCart",
        JSON.stringify(state.ordersData)
      );
    },
    clearCart(state) {
      state.ordersData = [];
    },
    startEditingOrder(state, action) {
      state.editingOrderId = action.payload;
    },
    stopEditingOrder(state) {
      state.editingOrderId = null;
      state.ordersData = [];
      window.localStorage.setItem("ordersInCart", JSON.stringify([]));
    },
    setTopPicksLoading(state, action) {
      state.topPicksLoading = action.payload;
    },
  },
});

export const {
  addNewOrder,
  updateQuantity,
  removeItemFromCart,
  setOrdersFromLocalStorage,
  removeItemFromCartOnZero,
  preloadCartFromOrder,
  clearCart,
  startEditingOrder,
  stopEditingOrder,
  setTopPicksLoading,
} = productSlice.actions;

// --------------- Thunks (Supabase only) ---------------

// 1) Fetch products from Supabase: table "product_info"
export function fetchProductDataThunk() {
  return async function (dispatch) {
    try {
      const { data, error: supabaseError } = await supabase
        .from("product_info")
        .select("*");

      if (supabaseError) {
        console.error("Error fetching products:", supabaseError);
        dispatch({ type: "product/fetchProductData", payload: [] });
        toast.error("Error loading products");
      } else {
        console.log("Fetched products:", data);
        dispatch({ type: "product/fetchProductData", payload: data });
        return data;
      }
    } catch (err) {
      console.error("Unexpected error fetching products:", err);
      dispatch({ type: "product/fetchProductData", payload: [] });
      toast.error("Unexpected error loading products");
    }
  };
}

// 2) Compute top picks from productData (no network)
export function fetchTopPicks() {
  return async function (dispatch, getState) {
    return async function (dispatch) {
      try {
        dispatch({ type: "product/setTopPicksLoading", payload: true });
        const { data, error: supabaseError } = await supabase
          .from("product_info")
          .select("*");

        if (supabaseError) {
          console.error("Error fetching products:", supabaseError);
        } else {
          console.log("top pickssss", data);
          dispatch({ type: "product/setTopPicks", payload: data.slice(0, 7) });
          return data.slice(0, 7);
        }
      } catch (err) {
        console.error("Unexpected error fetching products:", err);
      }
    };
  };
}

// 3) Add new product directly into Supabase: table "product_info"
export function addNewProduct(formData) {
  return async function (dispatch) {
    const row = {
      product_name: formData.product_name,
      product_description: formData.product_description,
      price: formData.price,
      product_category: formData.product_category,
      image_url: formData.image_url,
      ingredients: formData.ingredients || null,
    };

    try {
      const { data, error } = await supabase
        .from("product_info")
        .insert([row])
        .select()
        .single();

      if (error) {
        console.error("Error adding new product:", error);
        toast.error("Error adding product");
        return;
      }

      console.log("New product inserted into Supabase:", data);
      dispatch({ type: "product/addNewProduct", payload: data });
      toast.success("Product added successfully!");
    } catch (err) {
      console.error("Unexpected error adding product:", err);
      toast.error("Unexpected error adding product");
    }
  };
}
// store/productThunks.js (or inside productSlice file)

export function fetchTopPicksBySales() {
  return async function (dispatch, getState) {
    try {
      const state = getState();
      const { productData } = state.product;
      const { ordersHistory } = state.order;

      if (!productData?.length || !ordersHistory?.length) return;

      const salesMap = {};

      ordersHistory.forEach((order) => {
        let items = order.order_items;

        // ✅ Normalize order_items into array
        if (typeof items === "string") {
          try {
            items = JSON.parse(items);
          } catch {
            items = [];
          }
        }

        if (!Array.isArray(items)) {
          items = [];
        }

        items.forEach((item) => {
          const id = item.product_id;
          if (!id) return;

          salesMap[id] = (salesMap[id] || 0) + Number(item.quantity || 0);
        });
      });

      const topPicks = productData
        .map((product) => ({
          ...product,
          totalSold: salesMap[product.product_id] || 0,
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 7)
        .map((item) => ({
          menuItemId: item.product_id,
          itemName: item.product_name,
          description: item.product_description,
          price: item.price,
          image_url: item.image_url,
          product_category: item.product_category,
          quantity: 0,
          totalSold: item.totalSold,
        }));
      console.log("Computed top picks by sales:", topPicks);
      dispatch({ type: "product/setTopPicks", payload: topPicks });
    } catch (e) {
      console.error("fetchTopPicksBySales failed:", e);
      dispatch({
        type: "product/setTopPicksError",
        payload: e.message,
      });
    }
  };
}

export default productSlice.reducer;
