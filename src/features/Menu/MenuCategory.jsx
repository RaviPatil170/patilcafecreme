import React, { useRef, useState } from "react";
import "./MenuCategory.css";
import SingleMenuItem from "./SingleMenuItem";
import { useLocation } from "react-router-dom";
import { Link } from "react-scroll";

export default function MenuCategory({ products }) {
  const location = useLocation();
  const sectionRefs = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuClickedExpand, setMenuClickedExpand] = useState(false);

  // 1) Group flat array by product_category
  const groupedProducts = products.reduce((acc, item) => {
    const category = item.product_category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push({
      ...item,
      quantity: item.quantity ?? 0, // ensure quantity exists
    });
    return acc;
  }, {});

  const handleLinkClick = (category) => {
    setIsMenuOpen(false);
    setMenuClickedExpand(true);
  };

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <div className="menu-container">
      {/* Main sections */}
      {Object.keys(groupedProducts).map((category) => (
        <Section
          key={category}
          id={category}
          menuClickedExpand={menuClickedExpand}
          title={category}
          count={groupedProducts[category]?.length || 0}
        >
          {groupedProducts[category]?.map((item, index) => (
            <SingleMenuItem key={item.product_id || index} item={item} />
          ))}
        </Section>
      ))}

      {/* Bottom sheet menu overlay */}
      {isMenuOpen && (
        <div className="menu-overlay">
          <div className="black-menu-container">
            {Object.keys(groupedProducts).map((key) => (
              <Link
                key={key}
                to={key}
                spy={true}
                smooth={true}
                duration={500}
                onClick={() => handleLinkClick(key)}
              >
                <div className="menu-single-item">
                  <span className="heading-singleline">{key}</span>
                  <span className="count-singleline">
                    {groupedProducts[key]?.length || 0}
                  </span>
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

const Section = ({
  title,
  count,
  children,
  defalutOpen,
  id,
  menuClickedExpand,
}) => {
  const [isOpen, setIsOpen] = useState(menuClickedExpand); // State for section open/close

  return (
    <div className="section" id={id}>
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
        </span>
      </div>
      {defalutOpen || isOpen ? (
        <div className="section-content">{children}</div>
      ) : null}
    </div>
  );
};
