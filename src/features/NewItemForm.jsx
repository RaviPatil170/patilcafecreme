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
    try {
      for (let index = 0; index < data.length; index++) {
        const product = data[index];

        // 1️⃣ public image path
        const publicImagePath = `/product_images/fries/${index}.png`
          ? `/product_images/fries/${index}.png`
          : `/product_images/fries/${index}.jpeg`;

        // 2️⃣ convert public image → File
        const imageFile = await getFileFromPublicImage(
          publicImagePath,
          `${product.product_name}.png`
            ? `${product.product_name}.png`
            : `${product.product_name}.jpeg`
        );

        // 3️⃣ upload using EXISTING logic
        const image_url = await uploadProductImage(imageFile);

        // 4️⃣ save product
        dispatch(
          addNewProduct({
            product_name: product.product_name,
            price: product.price,
            ingredients: product.ingredients,
            product_description: product.product_description,
            product_category: product.product_category,
            image_url,
          })
        );
      }
    } catch (error) {
      console.error("Error adding products:", error);
      toast.error("Error adding products. Check console for details.");
    }

    // e.preventDefault();
    // let image_url = "";
    // if (formData.image_file) {
    //   image_url = await uploadProductImage(formData.image_file);
    // }
    // dispatch(
    //   addNewProduct({
    //     product_name: formData.product_name,
    //     price: formData.price,
    //     ingredients: formData.ingredients,
    //     product_description: formData.product_description,
    //     product_category: formData.product_category,
    //     image_url: image_url, // ✅ only URL goes to Redux
    //   })
    // );

    // setFormData({
    //   product_name: "",
    //   price: "",
    //   ingredients: "",
    //   product_description: "",
    //   image_file: null,
    //   product_category: "",
    // });
  };

  return (
    <>
      <form onSubmit={() => {}} className="new-item-form">
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
      </form>
      <button type="submit" onClick={handleSubmit}>
        Add Item
      </button>
    </>
  );
};

export default NewItemForm;

const getFileFromPublicImage = async (imagePath, fileName) => {
  const response = await fetch(imagePath);
  const blob = await response.blob();

  return new File([blob], fileName, { type: blob.type });
};

const data = [
  {
    product_name: "Regular Fries",
    price: 75,
    image_url:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    ingredients: "Potato, Salt, Oil",
    product_description: "Classic crispy regular fries.",
    product_category: "Fries",
  },
  {
    product_name: "Peri Peri Fries",
    price: 90,
    image_url:
      "https://images.unsplash.com/photo-1625944525533-473f1a3f88b4?auto=format&fit=crop&w=800&q=80",
    ingredients: "Potato, Peri peri seasoning, Salt, Oil",
    product_description: "Spicy peri peri flavored fries.",
    product_category: "Fries",
  },
];
