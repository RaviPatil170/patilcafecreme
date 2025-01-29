import { autoBatchEnhancer, createSlice } from '@reduxjs/toolkit'
import  axios  from 'axios';
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
    responseForAddedProduct:null
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
            state.ordersData=[...action.payload];
            //state.ordersData=[...state.ordersData,...action.payload];
        },
        updateQuantity:(state,action)=>{
            const {pid,quantity}=action.payload;
            const d=state.productData.map((el)=>{
                if(el.product_id==pid){
                    el.quantity=quantity;
                }
                return el;
            })
            state.productData=[...d];
        }
    }
})



export const {addNewOrder,updateQuantity}=productSlice.actions;
export function fetchOrderDetails(orders){
    if(orders.length==0)return;
     /*
       total_price
quantity
order_items
user_id

       */
    //const orders=action.payload;
    const order_items=orders.filter((el)=>{
        return {product_id:el.product_id,product_name:el.product_name,price:el.price,quantity:el.quantity}
    })
    let total_price=0;
    orders.map((el)=>{
        debugger;
        total_price+=((+el.price)*(parseInt(el.quantity)));
    });

    let quantity=0;
    orders.map((el)=>{
        quantity+=(+el.quantity);
    });
    const postBody={
        total_price,
        quantity:quantity,
        order_items,
        user_id:"Ravi"

    }
    return async function(dispatch,getState) {
      
        try {
            const response = await axios.post(
              `${supabaseUrl}/rest/v1/order_details`, // Replace with your Supabase URL and table name
              postBody, 
              {
                headers: {
                  'apikey': supabaseAnonKey, // Replace with your Supabase API Key
                  'Content-Type': 'application/json',
                },
              }
            );
        }catch(e){
            console.log(e,"error while sendind data");
        }
        dispatch({type:'product/fetchOrderDetails',payload:[]})
    }
}
export function fetchProductData(state,action){
    console.log(state,action);
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
export function addNewProduct(formData){
    return async function (dispatch,getState) {
        try {
            const response = await axios.post(
              `${supabaseUrl}/rest/v1/product_info`, // Replace with your Supabase URL and table name
              formData, 
              {
                headers: {
                  'apikey': supabaseAnonKey, // Replace with your Supabase API Key
                  'Content-Type': 'application/json',
                },
              }
            );
            console.log(response,"-----");
            dispatch({type: 'product/addNewProduct', payload: response.data});
            toast.success("new food item has been saved successfully");
            dispatch(fetchProductData());
        }catch(e){
            console.log(e,"error while sendind data");
            toast.error("there is some error while saving the data");
            dispatch({type: 'product/addNewProduct', payload: response.error});
        }
        
    }
}


export default productSlice.reducer;