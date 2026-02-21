import React, { useState } from "react";
import "./ProgressiveImage.css";

export default function ProgressiveImage({
  src,
  placeholder,
  alt = "",
  className = "",
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`pi-wrapper ${className}`}>
      {/* Low quality / blurred placeholder */}
      <img
        src={placeholder}
        alt={alt}
        className={`pi-img pi-placeholder ${loaded ? "hidden" : ""}`}
      />

      {/* Full quality image */}
      <img
        src={src}
        alt={alt}
        decoding="async"
        className={`pi-img pi-full ${loaded ? "visible" : ""}`}
        onLoad={() => setLoaded(true)}
        fetchpriority="high"
      />
    </div>
  );
}
