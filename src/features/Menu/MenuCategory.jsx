import React, { useEffect, useMemo, useState } from "react";
import "./MenuCategory.css";
import SingleMenuItem from "./SingleMenuItem";
import { Link } from "react-scroll";
import { categoryOrder } from "../../../constants";

export default function MenuCategory({ products = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const sortedGroupedArray = useMemo(() => {
    const grouped = products.reduce((acc, item) => {
      const category = item.product_category || "others";

      if (!acc[category]) acc[category] = [];

      acc[category].push({
        ...item,
        quantity: item.quantity ?? 0,
      });

      return acc;
    }, {});

    const arr = Object.entries(grouped).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.price - b.price),
    }));

    // custom category order
    arr.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.category);
      const indexB = categoryOrder.indexOf(b.category);

      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return arr;
  }, [products]);

  const handleLinkClick = (category) => {
    setIsMenuOpen(false);
    setActiveCategory(category); // expand only this category
  };

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <div className="menu-container">
      {/* Main sections */}
      {sortedGroupedArray.map(({ category, items }) => (
        <Section
          key={category}
          id={category}
          title={category}
          count={items.length}
          activeCategory={activeCategory}
        >
          {items.map((item, index) => (
            <SingleMenuItem key={item.product_id || index} item={item} />
          ))}
        </Section>
      ))}

      {/* Bottom sheet menu overlay */}
      {isMenuOpen && (
        <div className="menu-overlay">
          <div className="black-menu-container">
            {sortedGroupedArray.map(({ category, items }) => (
              <Link
                key={category}
                to={category}
                spy={true}
                smooth={true}
                duration={500}
                onClick={() => handleLinkClick(category)}
              >
                <div className="menu-single-item">
                  <span className="heading-singleline">{category}</span>
                  <span className="count-singleline">{items.length}</span>
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

function Section({ title, count, children, id, activeCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeCategory === title) {
      setIsOpen(true);
    }
  }, [activeCategory, title]);

  return (
    <div className="section" id={id}>
      <div className="section-header" onClick={() => setIsOpen((p) => !p)}>
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

      {isOpen && <div className="section-content">{children}</div>}
    </div>
  );
}
