import React, { useState, useRef, useEffect } from "react";
import "./App.css"; // Import the CSS for styling
import beforeImage from "./before.jpg"; // Import the first image
import afterImage from "./after.jpg";   // Import the second image

function App() {
  return (
    <div className="App">
      <h1>Here is the image slider!</h1>
      <ImageComparison
        image1={beforeImage}
        image2={afterImage}
        label1="Before"
        label2="After"
        initialPosition={50}
      />
    </div>
  );
}

// ImageComparison Component
const ImageComparison = ({ image1, image2, initialPosition = 50, label1, label2 }) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const containerRef = useRef(null); // Reference to the container div
  const isDragging = useRef(false);  // Track whether the slider is being dragged

  // Handles mouse movement while dragging
  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return; // Prevent errors if ref is null
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newSliderPosition = (offsetX / rect.width) * 100;

    if (newSliderPosition >= 0 && newSliderPosition <= 100) {
      setSliderPosition(newSliderPosition);
    }
  };

  // Handles touch movement while dragging
  const handleTouchMove = (e) => {
    if (!isDragging.current || !containerRef.current) return; // Prevent errors if ref is null
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const offsetX = touch.clientX - rect.left;
    const newSliderPosition = (offsetX / rect.width) * 100;

    if (newSliderPosition >= 0 && newSliderPosition <= 100) {
      setSliderPosition(newSliderPosition);
    }
  };

  useEffect(() => {
    // Stop dragging when the mouse or touch is released
    const stopDragging = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };

    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchend", stopDragging);

    return () => {
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchend", stopDragging);
    };
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
    if (containerRef.current) {
      document.addEventListener("mousemove", handleMouseMove);
    }
  };

  const handleTouchStart = () => {
    isDragging.current = true;
    if (containerRef.current) {
      document.addEventListener("touchmove", handleTouchMove);
    }
  };

  return (
    <div className="comparison-container" ref={containerRef}>
      <div className="image image1" style={{ backgroundImage: `url(${image1})` }}>
        {label1 && <div className="label label1">{label1}</div>}
      </div>
      <div
        className="image image2"
        style={{
          backgroundImage: `url(${image2})`,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        {label2 && <div className="label label2">{label2}</div>}
      </div>
      <div
        className="slider"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="slider-line"></div>
      </div>
    </div>
  );
};

export default App;
