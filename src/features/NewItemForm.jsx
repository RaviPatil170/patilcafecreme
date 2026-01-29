import React, { useState } from "react";
import "./NewItemForm.css";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct } from "../store/productSlice";
import { toast } from "react-toastify";
import { CATEGORY } from "../../constants";
import { uploadProductImage } from "../services/imageUpload.service";
const NewItemForm = () => {
  const dispatch = useDispatch();

  // const responseForAddedProduct = useSelector(
  //   (state) => state.product.responseForAddedProduct
  // );
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    ingredients: "",
    product_description: "",
    product_category: "",
    image_file: null,
  });

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let image_url = "";
    if (formData.image_file) {
      image_url = await uploadProductImage(formData.image_file);
    }
    dispatch(
      addNewProduct({
        product_name: formData.product_name,
        price: formData.price,
        ingredients: formData.ingredients,
        product_description: formData.product_description,
        product_category: formData.product_category,
        image_url: image_url, // ✅ only URL goes to Redux
      })
    );

    setFormData({
      product_name: "",
      price: "",
      ingredients: "",
      product_description: "",
      image_file: null,
      product_category: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFormData({ ...formData, image_file: e.target.files[0] });
          }}
        />
        {/* <textarea
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
        /> */}
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
          className="category-input"
        >
          {CATEGORY.map((el) => (
            <option value={el} key={el}>
              {el}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default NewItemForm;
