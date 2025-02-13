import { autoBatchEnhancer, createSlice } from '@reduxjs/toolkit'
import  axios  from 'axios';
import { toast } from 'react-toastify'; 
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://crxvwnueirwsbrvmlwem.supabase.co"; // Corrected URL format
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeHZ3bnVlaXJ3c2Jydm1sd2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Mzc2MDcsImV4cCI6MjA1MjUxMzYwN30.QjseonqK545EcPWnPvL48r496V-5-ezs1ciPPSOkNlw"; // Removed duplicate https

const supabase = createClient(supabaseUrl, supabaseAnonKey);


const initialState={
    productData:[],
    ordersData:[],
    loading:false,
    error:null,
    ordersPlaced:[],
    orderError:[],
    responseForAddedProduct:null,
    topPicks:[],
    topPickError:""
}

const productSlice = createSlice({
    name:'product',
    initialState,
    reducers:{
        fetchOrderDetails:(state,action)=>{
            state.ordersPlaced=action.payload;
        },
        fetchProductData: (state, action) => {
            state.productData = action.payload;
        },
        addNewProduct:(state,action)=>{
            state.responseForAddedProduct=action.payload;
        },
        addNewOrder:(state,action)=>{
            debugger;
            state.ordersData=[...action.payload];
            //state.ordersData=[...state.ordersData,...action.payload];
        },
        updateQuantity:(state,action)=>{
            debugger;
            const {pid,quantity}=action.payload;
            const d=state.ordersData.map((el)=>{
                if(el.product_id==pid){
                    el.quantity=quantity;
                }
                return el;
            })
            state.ordersData=[...d];
        },
        removeItemFromCart:(state,action)=>{
            const id =action.payload;
            const newOrdersData=state.ordersData.filter((item)=>item.product_id!==id);
            state.ordersData=newOrdersData;
        },
        setOrdersFromLocalStorage:(state,action)=>{
            state.ordersData=action.payload;
        },
        orderError:(state,action)=>{
            state.orderError=action.payload;
        },
        setTopPicks:(state,action)=>{
          state.topPicks=action.payload;
        },
        setTopPicksEroor:(state,action)=>{
          state.topPickError=action.payload;
        }
    }
})



export const {addNewOrder,updateQuantity,removeItemFromCart,setOrdersFromLocalStorage}=productSlice.actions;
// export function fetchOrderDetails(orders){
//     if (orders.length == 0) return;
//     const order_items = orders.filter((el) => {
//       return {
//         product_id: el.product_id,
//         product_name: el.product_name,
//         price: el.price,
//         quantity: el.quantity,
//       };
//     });
//     let total_price = 0;
//     orders.map((el) => {
//       debugger;
//       total_price += +el.price * parseInt(el.quantity);
//     });

//     let quantity = 0;
//     orders.map((el) => {
//       quantity += +el.quantity;
//     });
//     const postBody = {
//       total_price,
//       quantity: quantity,
//       order_items,
//       user_id: "Ravi",
//     };
//     return async function(dispatch,getState) {
      
//         try {
//             const response = await axios.post(
//               `${supabaseUrl}/rest/v1/order_details`, // Replace with your Supabase URL and table name
//               postBody, 
//               {
//                 headers: {
//                   'apikey': supabaseAnonKey, // Replace with your Supabase API Key
//                   'Content-Type': 'application/json',
//                 },
//               }
//             );
//         }catch(e){
//             console.log(e,"error while sendind data");
//         }
//         dispatch({type:'product/fetchOrderDetails',payload:[]})
//     }
// }

export function fetchOrderDetails(orders) {
    if (orders.length === 0) return;
  
    const order_items = orders.map((el) => ({ // Use .map for transformation
      product_id: el.product_id,
      product_name: el.product_name,
      price: el.price,
      quantity: el.quantity,
    }));
  
    let total_price = 0;
    orders.forEach((el) => { // Use .forEach for side effects
      total_price += +el.price * parseInt(el.quantity, 10); // Always use parseInt with radix
    });
  
    let quantity = 0;
    orders.forEach((el) => { // Use .forEach
      quantity += +el.quantity;
    });
  
    const postBody = {
      total_price,
      quantity,
      order_items,
      user_id: "Ravi", // Consider making this dynamic
    };
  
    return async function (dispatch, getState) {
      try {
        const response = await axios.post(
          `${supabaseUrl}/rest/v1/order_details`,
          postBody,
          {
            headers: {
              'apikey': supabaseAnonKey,
              'Content-Type': 'application/json',
            },
          }
        );
  
        // Success!  Now you can use the response:
        console.log("Order saved successfully:", response.data);
  
        // Display a toast message (example using react-toastify):
         toast.success("Order placed successfully!"); // Or customize message
  
        // Or, if you're not using a toast library, use an alert:
        // alert("Order placed successfully!");
  
        // Dispatch an action (if needed):
        dispatch({ type: 'product/fetchOrderDetails', payload: [] }); // Or payload: response.data if you want to store it.
  
        return response.data; // Return the response data if needed
  
      } catch (error) {
        console.error("Error saving order:", error);
  
        // Display an error toast message:
        toast.error("Error placing order. Please try again."); // Customize message
  
        // Or an alert:
        // alert("Error placing order. Please try again.");
  
        // Dispatch an error action (if needed):
        dispatch({ type: 'product/orderError', payload: error.message }); // Example
  
        throw error; // Re-throw the error for handling up the chain if necessary
      }
    };
  }
export function fetchProductData(state,action){
    //console.log(state,action);
    return async function(dispatch,getState){
        const { data, error: supabaseError } = await supabase.from("product_info").select("*");
        if (supabaseError) {
          console.error("Error fetching countries:", supabaseError);
          dispatch({type: 'product/fetchProductData', payload: []});
        } else {
        const newData =data.map((el)=>{return {...el,quantity:""}})
          console.log("products fetched successfully:", data);
          dispatch({type: 'product/fetchProductData', payload: newData});
        }
    }
    //dispatch({type: 'product/fetchProductData', payload: []});
}

export function fetchTopPicks(state,action){
  return async function (dispatch,getState) {
    const { data, error: supabaseError } = await supabase.from("top_picks").select("*");
        if (supabaseError) {
          console.error("Error fetching top pciks:", supabaseError);
          dispatch({type: 'product/setTopPicksEroor', payload: []});
        } else {
        const newData =data.map((el)=>{return {...el,quantity:""}})
          console.log("top picks fetched successfully:", data);
          dispatch({type: 'product/setTopPicks', payload: newData});
        }
  }
}
// export function addNewProduct(formData){
//     return async function (dispatch,getState) {
//         try {
//             const response = await axios.post(
//               `${supabaseUrl}/rest/v1/product_info`, // Replace with your Supabase URL and table name
//               formData, 
//               {
//                 headers: {
//                   'apikey': supabaseAnonKey, // Replace with your Supabase API Key
//                   'Content-Type': 'application/json',
//                 },
//               }
//             );
//             console.log(response,"-----");
//             dispatch({type: 'product/addNewProduct', payload: response.data});
//             toast.success("new food item has been saved successfully");
//             dispatch(fetchProductData());
//         }catch(e){
//             console.log(e,"error while sendind data");
//             toast.error("there is some error while saving the data");
//             dispatch({type: 'product/addNewProduct', payload: response.error});
//         }
        
//     }
// }
export function addNewProduct(formData) {
    
    return async function (dispatch, getState) {
      try {
        const response = await axios.post(
          `${supabaseUrl}/rest/v1/product_info`,
          formData,
          {
            headers: {
              'apikey': supabaseAnonKey,
              'Content-Type': 'application/json',
            },
          }
        );
        debugger;
        console.log("Response from Supabase:", response.data); // Log the full response
  
        // Check for successful insertion (status code 201 is typical for POST)
        if (response.status === 201) {
          dispatch({ type: 'product/addNewProduct', payload: response.data }); // Dispatch the data
          toast.success("New food item has been saved successfully!");
          dispatch(fetchProductData()); // Refresh the product list
  
          return response.data; // Return the response data (important!)
  
        } else {
          // Handle unexpected status codes (e.g., errors from Supabase)
          const errorMessage = response.data?.message || "Error saving product."; // Get error message from response or default message.
          console.error("Supabase returned an error:", response.status, errorMessage);
          toast.error(errorMessage);
         // dispatch({ type: 'product/addNewProductError', payload: errorMessage }); // Dispatch the error message
          throw new Error(errorMessage); // Re-throw the error to be caught by the caller if needed
        }
  
  
      } catch (error) {
        console.error("Error sending data:", error);
  
        const errorMessage = error.response?.data?.message || error.message || "Error saving product."; // Improved error handling
        toast.error(errorMessage);
        //dispatch({ type: 'product/addNewProductError', payload: errorMessage }); // Dispatch the error message
        throw error; // Re-throw for caller handling
  
      }
    };
  }

export default productSlice.reducer;