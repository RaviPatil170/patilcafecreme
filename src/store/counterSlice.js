import { createSlice } from '@reduxjs/toolkit'

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://crxvwnueirwsbrvmlwem.supabase.co"; // Corrected URL format
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeHZ3bnVlaXJ3c2Jydm1sd2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Mzc2MDcsImV4cCI6MjA1MjUxMzYwN30.QjseonqK545EcPWnPvL48r496V-5-ezs1ciPPSOkNlw"; // Removed duplicate https

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialState = {
  value: 0,
  productData:[],

}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    fetchProductData: (state, action) => {
        state.productData = action.payload;
    },
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export  function fetchProductData(state,action){

    return async function(dispatch,getState){
        const { data, error: supabaseError } = await supabase.from("product_info").select("*");
        if (supabaseError) {
          console.error("Error fetching countries:", supabaseError);
          dispatch({type: 'counter/fetchProductData', payload: []});
        } else {
          console.log("Countries fetched successfully:", data);
          dispatch({type: 'counter/fetchProductData', payload: data});
        }
    }
}
export default counterSlice.reducer