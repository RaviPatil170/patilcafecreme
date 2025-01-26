import { applyMiddleware, combineReducers, configureStore, createStore } from '@reduxjs/toolkit'
import  { counterSlice } from './counterSlice'
import counterReducer from './counterSlice';
import productReducer from "./productSlice"
import {thunk} from 'redux-thunk';
 const rootReducer =combineReducers({
  counter: counterReducer,
  product:productReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;