import React, { useRef, useState,useEffect } from 'react'
import "./MenuCategory.css"
import SingleMenuItem from './SingleMenuItem';
import { Link, useLocation } from 'react-router-dom';
const menuArray=["Fries","Maggie","Momo's","Kuka"];
export default function MenuCategory({products}) {
  const[]=  useState();

  const location = useLocation();
  const sectionRefs = useRef({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const scrollToSection = () => {
      const hash = location.hash;
      if (hash) {
        const sectionId = hash.substring(1);
        const section = sectionRefs.current[sectionId];
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    scrollToSection(); // Scroll on initial render (if there's a hash)

  }, [location]); // Run effect when location changes


  const handleLinkClick = (category) => {
    setIsMenuOpen(false); // Close the menu *before* scrolling
  };
  function toggleMenu(){
    setIsMenuOpen(()=>!isMenuOpen);
  }
  
  
  return (
    <div className="menu-container">
      {Object.keys(products).map((category) => (
        <Section
          key={category}
          id={category}
          ref={(el) => (sectionRefs.current[category] = el)}
          title={category}
          count={products[category]?.length || 0}
        >
          {products[category]?.map((item, index) => (
            <SingleMenuItem key={item.id || index} item={item} />
          ))}
        </Section>
      ))}
    
      

    {isMenuOpen && (
        <div className="menu-overlay">
          <div className="black-menu-container">
            {Object.keys(products).map((key) => (
              <Link
                key={key}
                to={`#${key}`}
                onClick={() => handleLinkClick(key)} // Call handleLinkClick
              >
                <div className="menu-single-item">
                  <span className="heading-singleline">{key}</span>
                  <span className="count-singleline">{products[key]?.length || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <button className="menu-button-bottom" onClick={toggleMenu}>
        MENU
      </button>
    </div>
  );
}

const Section = ({ title, count, children ,defalutOpen}) => {
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
        { defalutOpen|| isOpen ? ( // Conditionally render the content
          <div className="section-content">{children}</div>
        ):""}
      </div>
    );
  };


 

 