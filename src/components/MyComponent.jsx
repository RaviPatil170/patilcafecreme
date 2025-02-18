import React, { useRef, useEffect } from 'react';
import './style.css';

const MyComponent = () => {
  const containerRef = useRef(null);
  const scrollAmount = 200; // Adjust scroll amount as needed

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= scrollAmount; // Subtract for left scroll
      // Or for smooth scrolling:
      // containerRef.current.scrollTo({
      //   left: containerRef.current.scrollLeft - scrollAmount,
      //   behavior: 'smooth',
      // });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollAmount; // Add for right scroll
      // Or for smooth scrolling:
      // containerRef.current.scrollTo({
      //   left: containerRef.current.scrollLeft + scrollAmount,
      //   behavior: 'smooth',
      // });
    }
  };


  // Optional: useEffect to check scroll position and disable buttons
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setAtStart(scrollLeft === 0);
        setAtEnd(scrollLeft + clientWidth === scrollWidth);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []); // Empty dependency array ensures this runs only once after the component mounts.


  return (
    <div>
      <button onClick={handleScrollLeft} disabled={atStart}>Scroll Left</button>
      <div
        ref={containerRef}
        style={{
          overflowX: 'auto',
          width: '500px', // Or whatever width you need
          whiteSpace: 'nowrap', // Prevent items from wrapping
          display: 'flex', // Enable horizontal scrolling
          scrollBehavior: 'smooth', // Optional for smooth scrolling
        }}
      >
        {/* Your content here */}
        <div style={{ width: '200px', height: '100px', backgroundColor: 'lightcoral', margin: '10px' }}>Item 1</div>
        <div style={{ width: '200px', height: '100px', backgroundColor: 'lightblue', margin: '10px' }}>Item 2</div>
        <div style={{ width: '200px', height: '100px', backgroundColor: 'lightgreen', margin: '10px' }}>Item 3</div>
        <div style={{ width: '200px', height: '100px', backgroundColor: 'lightyellow', margin: '10px' }}>Item 4</div>
        <div style={{ width: '200px', height: '100px', backgroundColor: 'lightpink', margin: '10px' }}>Item 5</div>
        <div style={{ width: '200px', height: '100px', backgroundColor: 'lightgray', margin: '10px' }}>Item 6</div>
        {/* ... more items */}
      </div>
      <button onClick={handleScrollRight} disabled={atEnd}>Scroll Right</button>
    </div>
  );
};

export default MyComponent;