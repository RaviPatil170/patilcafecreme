import React from 'react'
import "./SingleMenuItem.css"
export default function SingleMenuItem({item}) {
  return (
    <div className="menu-item">
      <div className="item-description">
        <div className="name-price">
          <span className="item-name">{item.product_name}</span>
          <span className="item-price">
            <span className="ruppe-symbol">₹</span>
            {item.price}
          </span>
        </div>
        <span className="item-rating">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
          4.5
        </span>
        <span className="item-summary">{item.product_description}</span>
      </div>
      <div className="item-right-section">
        <img src={item.image_url} alt={item.product_name}></img>
        <button className="button-add">ADD</button>
      </div>
    </div>
  );
}
