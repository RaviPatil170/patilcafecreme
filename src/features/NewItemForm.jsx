import React, { useState } from 'react';
import "./NewItemForm.css";
import { useDispatch,useSelector } from 'react-redux';
import { addNewProduct } from '../store/productSlice';
import { toast } from 'react-toastify';
const NewItemForm = () => {
    const dispatch=useDispatch();
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    ingredients: '',
    product_description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission, 
    // such as sending the data to a server or updating state.
    
  
        //console.log('Item added successfully:', formData);
        // Clear form after successful submission
      dispatch(addNewProduct(formData));
    toast.success("new food item has been saved successfully");
  
    console.log('Form submitted:', formData); 
    // Reset form after submission
    setFormData({
      product_name: '',
      price: '',
      ingredients: '',
      product_description: '',
      image_url:''
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
      <button type="submit">Add Item</button>
    </form>
  );
};

export default NewItemForm;