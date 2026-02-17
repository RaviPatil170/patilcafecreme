import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder, fetchTopPicksBySales } from "../store/productSlice";
import "./TopPicks.css";
import { fetchOrdersHistory } from "../store/orderSlice";

import TopPicksItem from "./TopPicksItem.jsx";
export default function TopPicks({ products }) {
  const dispatch = useDispatch();
  const { topPicks, topPicksLoading, productData } = useSelector(
    (state) => state.product
  );
  const ordersHistory = useSelector((state) => state.order.ordersHistory);

  const containerRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollAmount = 300;

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // Fast initial Top Picks (no orders dependency)
    //dispatch(fetchTopPicks());

    // Background fetch for enhancement
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  useEffect(() => {
    if (ordersHistory?.length) {
      dispatch(fetchTopPicksBySales());
    }
  }, [dispatch, ordersHistory?.length, productData?.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;

      setAtStart(scrollLeft <= 5);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    };

    onScroll(); // initial check
    el.addEventListener("scroll", onScroll);

    return () => el.removeEventListener("scroll", onScroll);
  }, [topPicks.length]);

  const handleNext = () => {
    const el = containerRef.current;
    if (!el || atEnd) return;

    el.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handlePrev = () => {
    const el = containerRef.current;
    if (!el || atStart) return;

    el.scrollBy({ left: -300, behavior: "smooth" });
  };

  return (
    <div className="toppicks-outer-container">
      <div className="toppicks-header-section">
        <h3>Top Picks</h3>
        <div className="toppick-nav-buttons">
          <button onClick={handlePrev} disabled={atStart}>
            ‹
          </button>
          <button onClick={handleNext} disabled={atEnd}>
            ›
          </button>
        </div>
      </div>

      <div className="toppicks-container" ref={containerRef}>
        {topPicksLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="toppick-skeleton" />
            ))
          : topPicks.map((item) => (
              <TopPicksItem key={item.menuItemId} item={item} />
            ))}
      </div>
    </div>
  );
}
