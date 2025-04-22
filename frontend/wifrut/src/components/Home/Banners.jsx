import React, { useState, useEffect } from "react";
import style from "../../styles/Banner.module.css";
import { useSwipeable } from "react-swipeable";

const Banners = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    '/publicidad1.jpg',
    '/publicidad2.jpg',
    '/publicidad3.jpg',
  ];

  const handleSwipeLeft = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handleSwipeRight = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div {...handlers} className={style.banner}>
      {/* Flechas */}
      <button className={style.arrowLeft} onClick={handleSwipeRight}>
        &#10094;
      </button>
      <button className={style.arrowRight} onClick={handleSwipeLeft}>
        &#10095;
      </button>

      {/* Imágenes */}
      <div
        className={style.slider}
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Banner ${index + 1}`} />
        ))}
      </div>

      {/* Dots */}
      <div className={style.dots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${style.dot} ${currentImage === index ? style.active : ""}`}
            onClick={() => setCurrentImage(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Banners;
