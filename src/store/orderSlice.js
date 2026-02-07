// store/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ahbqwdvotjqyjjicsvdf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYnF3ZHZvdGpxeWpqaWNzdmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTAzMzUsImV4cCI6MjA4MDkyNjMzNX0.mgZsIi-9IWymRDN6i65F7Przbt4wxIWPatXYz6tjk0I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialState = {
  currentOrder: null, // last placed order
  preparingOrders: [], // optional: list of orders with status 'preparing'
  ordersHistory: [], // optional: list of past orders
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    placeOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    placeOrderSuccess(state, action) {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    placeOrderFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    setPreparingOrders(state, action) {
      state.preparingOrders = action.payload || [];
    },
    setOrdersHistory(state, action) {
      state.ordersHistory = action.payload || [];
    },
  },
});

export const {
  placeOrderStart,
  placeOrderSuccess,
  placeOrderFailure,
  setPreparingOrders,
  setOrdersHistory,
} = orderSlice.actions;

/**
 * Place order into Supabase "order_details" table.
 * This is your old fetchOrderDetails thunk, moved here.
 */
export function fetchOrderDetails(orders, customerName) {
  if (!orders || orders.length === 0) return () => {};

  return async (dispatch, getState) => {
    try {
      dispatch(placeOrderStart());

      const { editingOrderId } = getState().product;

      const orderItems = orders.map((item) => ({
        product_id: item.menuItemId,
        product_name: item.itemName,
        quantity: item.quantity,
        price: item.price,
      }));

      let total_price = 0;
      let total_quantity = 0;

      orders.forEach((el) => {
        total_price += Number(el.price) * Number(el.quantity || 0);
        total_quantity += Number(el.quantity || 0);
      });
      const finalCustomerName =
        customerName && customerName.trim()
          ? customerName.trim()
          : "Cafe Crème";

      // 👉 UPDATE EXISTING ORDER
      if (editingOrderId) {
        const { data, error } = await supabase
          .from("order_details")
          .update({
            order_items: orderItems,
            total_price,
            quantity: total_quantity,
            user_id: finalCustomerName,
          })
          .eq("order_id", editingOrderId)
          .select()
          .single();

        if (error) {
          console.error("Error updating order:", error);
          toast.error("Error updating order. Please try again.");
          dispatch(placeOrderFailure(error.message));
          return;
        }

        dispatch(placeOrderSuccess(data));
        toast.success("Order updated successfully!");
        console.log("Order updated in Supabase:", data);

        // reset edit mode + cart
        dispatch({ type: "product/stopEditingOrder" });
        dispatch({ type: "product/clearCart" });

        return;
      }

      // 👉 CREATE NEW ORDER
      const payload = {
        user_id: finalCustomerName,
        order_items: orderItems,
        total_price,
        quantity: total_quantity,
        order_status: "preparing",
      };

      const { data, error } = await supabase
        .from("order_details")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Error inserting order:", error);
        toast.error("Error placing order. Please try again.");
        dispatch(placeOrderFailure(error.message));
        return;
      }

      dispatch(placeOrderSuccess(data));
      toast.success("Order placed successfully!");
      console.log("Order stored in Supabase:", data);
    } catch (err) {
      console.error("Unexpected error placing/updating order:", err);
      toast.error("Error placing/updating order. Please try again.");
      dispatch(placeOrderFailure(err.message));
    }
  };
}

/**
 * Optional: load all orders with status 'preparing' into Redux.
 * Use this in OrdersPreparing page if you want to go via Redux.
 */
export function fetchPreparingOrders() {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from("order_details")
        .select("*")
        .eq("order_status", "preparing")
        .order("order_id", { ascending: false });

      if (error) {
        console.error("Error loading preparing orders:", error);
        dispatch(setPreparingOrders([]));
        return;
      }

      dispatch(setPreparingOrders(data || []));
    } catch (err) {
      console.error("Unexpected error loading preparing orders:", err);
      dispatch(setPreparingOrders([]));
    }
  };
}
export function fetchOrdersHistory() {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from("order_details")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders history:", error);
        dispatch(setOrdersHistory([]));
        return;
      }

      dispatch(setOrdersHistory(data || []));
    } catch (err) {
      console.error("Unexpected error fetching orders history:", err);
      dispatch(setOrdersHistory([]));
    }
  };
}

export default orderSlice.reducer;
