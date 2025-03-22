import React, { useState, useEffect } from "react";
import style from "../../styles/Banner.module.css";

const Banners = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
  
 '../../../publicidad1.png',
 '../../../publicidad1.png',
 '../../../publicidad3.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={style.banner}>
      <div
        className={style.slider}
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Banner ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Banners;
