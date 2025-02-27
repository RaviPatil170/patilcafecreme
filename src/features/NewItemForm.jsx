import React, { useState } from 'react';
import "./NewItemForm.css";
import { useDispatch,useSelector } from 'react-redux';
import { addNewProduct } from '../store/productSlice';
import { toast } from 'react-toastify';
import { CATEGORY } from '../../constants';
const NewItemForm = () => {
  const dispatch=useDispatch();

 
  const responseForAddedProduct=useSelector((state)=>state.product.responseForAddedProduct);
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    ingredients: '',
    product_description: '',
    product_category:''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
      dispatch(addNewProduct(formData));
      

      
      setFormData({
        product_name: "",
        price: "",
        ingredients: "",
        product_description: "",
        image_url: "",
        product_category:""
      });
  };

  return (
    <form onSubmit={handleSubmit} className='new-item-form'>
      <div>
        <label htmlFor="product_name">Name:</label>
        <input 
          type="text" 
          id="product_name" 
          name="product_name" 
          value={formData.product_name} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input 
          type="number" 
          id="price" 
          name="price" 
          value={formData.price} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="image_url">Image URL:</label>
        <textarea 
          id="image_url" 
          name="image_url" 
          value={formData.image_url} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="ingredients">Ingredients:</label>
        <textarea 
          id="ingredients" 
          name="ingredients" 
          value={formData.ingredients} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="product_description">Description:</label>
        <textarea 
          id="product_description" 
          name="product_description" 
          value={formData.product_description} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="product_category">Product Category:</label>
        <select 
          id="product_category" 
          name="product_category" 
          value={formData.product_category} 
          onChange={handleChange}
          className='category-input' 
        >
          {CATEGORY.map((el)=><option value={el} key={el}>{el}</option>)}
          </select>
      </div>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default NewItemForm;