import React, { useState } from 'react'
import "./MenuCategory.css"
import { all } from 'axios';
import SingleMenuItem from './SingleMenuItem';
const menuArray=["Fries","Maggie","Momo's","Kuka"];
export default function MenuCategory({products}) {
  const[]=  useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const allCategory={}
  console.log(products,"=======")
  function toggleMenu(){
    setIsMenuOpen(()=>!isMenuOpen);
  }
  products.map((el)=>{
    if(!allCategory[el.product_category]){
        allCategory[el.product_category]=[el];
    }else{
        allCategory[el.product_category].push(el);
    }
  })
  const {fries,maggie}=allCategory
  console.log(allCategory,"===");
  return (
     (
        <div className="menu-container">
          <Section title="Indian" count={81}> {/* Example with nested sections */}
            <Section title="Fries section" count={fries?.length || 0}>
              {/* Add your Veg Main Course items here */}
              {fries?.length>0 && fries.map((item)=>{
                return <SingleMenuItem item={item}></SingleMenuItem>
              })}
              
              
              {/* ... more items */}
            </Section>
            {/* ... other Indian categories */}
            <Section title="Maggie" count={maggie?.length}>
                {maggie?.map((item)=>{
                    return <SingleMenuItem item={item}></SingleMenuItem>
                })}
            </Section>
          </Section>
          <Section title="Breads" count={20}>
            {/* Add your Breads items here */}
          </Section>
          {/* ... other main sections */}

          {isMenuOpen && ( // Conditionally render the menu overlay
        <div className="menu-overlay">
          <div className="black-menu-container">
            {menuArray.map((el)=>{
              return <div className="menu-single-item">
                <span className='heading-singleline'>{el}</span>
                <span className='count-singleline'>{fries?.length||0}</span>
              </div>;
            })}
          </div>
        </div>
      )}

          <button className="menu-button-bottom" onClick={toggleMenu}>
        MENU
      </button>
        </div>
      
  ))
}

const Section = ({ title, count, children }) => {
    const [isOpen, setIsOpen] = useState(false); // State for section open/close
  
    return (
      <div className="section">
        <div className="section-header" onClick={() => setIsOpen(!isOpen)}>
          <div className="section-header-left">
            <span className="section-title">{title}</span>
            <span className="section-count">({count})</span>
          </div>
          <span className={`section-arrow ${isOpen ? "open" : ""}`}>
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 down-arrow"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 up-arrow"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            )}
          </span>{" "}
        </div>
        {isOpen && ( // Conditionally render the content
          <div className="section-content">{children}</div>
        )}
      </div>
    );
  };