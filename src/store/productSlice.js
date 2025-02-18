import { autoBatchEnhancer, createSlice } from '@reduxjs/toolkit'
import  axios  from 'axios';
import { toast } from 'react-toastify'; 
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://crxvwnueirwsbrvmlwem.supabase.co"; // Corrected URL format
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeHZ3bnVlaXJ3c2Jydm1sd2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Mzc2MDcsImV4cCI6MjA1MjUxMzYwN30.QjseonqK545EcPWnPvL48r496V-5-ezs1ciPPSOkNlw"; // Removed duplicate https

const supabase = createClient(supabaseUrl, supabaseAnonKey);


const initialState={
    productData:{},
    ordersData:[],
    loading:false,
    error:null,
    ordersPlaced:[],
    orderError:[],
    responseForAddedProduct:null,
    topPicks:[],
    topPickError:"",

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
          
          const item =action.payload;
          if(!item){
            state.ordersData=[];
            return;
          }
          // if(item.topPicks){
          //   const record =state.topPicsData.findIndex((el)=>el.menuItemId==item.menuItemId);

          // }
          const record =state.ordersData.findIndex((el)=>el.menuItemId==item.menuItemId);
          if(record==-1){
            state.ordersData=[...state.ordersData,item];
          }
          
        },
        removeItemFromCartOnZero:(state,action)=>{
          const {menuItemId}=action.payload;
          state.ordersData=state.ordersData.filter((item)=>item.menuItemId!==menuItemId);
        },
        updateQuantity:(state,action)=>{
            const {menuItemId,quantity}=action.payload;

            const isRecordInTopPicks =state.topPicks.findIndex((el)=>el.menuItemId==menuItemId);
            if(isRecordInTopPicks!==-1){
              const d=state.topPicks.map((el)=>{
                if(el.menuItemId==menuItemId){
                    el.quantity=quantity;
                }
                return el;
            })           
            state.topPicks=[...d];
            }
            const d=state.ordersData.map((el)=>{
                if(el.menuItemId==menuItemId){
                    el.quantity=quantity;
                }
                return el;
            })           
            state.ordersData=[...d];
        },
        removeItemFromCart:(state,action)=>{
            const id =action.payload;
            const newOrdersData=state.ordersData.filter((item)=>item.menuItemId!==id);
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



export const {addNewOrder,updateQuantity,removeItemFromCart,setOrdersFromLocalStorage,removeItemFromCartOnZero}=productSlice.actions;
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
        try{
          const response =fetch(`http://13.233.79.75:8080/api/restaurants/1/menu/grouped`).then((res)=>{
            return res.json();
          }).then((data)=>{
            for(const item in data){
              data[item].map((el)=>{
                el.quantity=0;
              });
            }
            console.log(data,"after processing");
            //const newData =data.map((el)=>{return {...el,quantity:""}})
          console.log("products fetched successfully:", data);
          dispatch({type: 'product/fetchProductData', payload: data});
            console.log("vaibhav data",data);
            
          })
        }catch(e){
          console.log("error while fetching data",e);
        }
    }
}

export function fetchTopPicks(state,action){
  return async function (dispatch,getState) {
    try{
      const response =fetch(`http://13.233.79.75:8080/api/restaurants/1/menu/grouped`).then((res)=>{
        return res.json();
      }).then((data)=>{
        const topPicsData=[];
        for(const item in data){
          data[item].map((el,i)=>{
            el.quantity=0;
            if(i==0)topPicsData.push(el);
          });
        }
      console.log(data,"after processing top pics");
      console.log("top pics data", data);
      dispatch({type: 'product/setTopPicks', payload: topPicsData});
  
        
      })
    }catch(e){
      console.log("error while fetching data",e);
    }


    
  }
}

export function addNewProduct(formData) {
  return async function (dispatch, getState) {
    const raw = JSON.stringify({
      menuItemId: "",
      restaurantId: 1,
      itemName: formData.product_name,
      description: formData.product_description,
      price: formData.price,
      category: formData.product_category,
      image_url: formData.image_url,
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: false,
    });

    const requestOptions = {
      method: "POST", // Change to POST, PUT, DELETE, etc. as needed
      headers: {
        "Content-Type": "application/json", // Important for sending JSON data
        // ... any other headers
      },
      body: raw,
    };

    fetch("http://13.233.79.75:8080/api/restaurants/1/menu", requestOptions)
      .then((response) => {
        if (!response.ok) {
          // Check for HTTP errors (status not in the 200-299 range)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON response only if the request was successful
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };
}

export default productSlice.reducer;



