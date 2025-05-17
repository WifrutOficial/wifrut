import { useState, useEffect } from "react";
import style from "../../styles/Banner.module.css";
import { useSwipeable } from "react-swipeable";

const Banners = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 513);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const desktopImages = ["/banner5.jpg", "/bannerC2.jpeg"];
  const mobileImages = ["/Bannermovil.jpg", "/bannerM2.jpeg"];
  const images = isMobile ? mobileImages : desktopImages;

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
      <button className={style.arrowLeft} onClick={handleSwipeRight}>
        &#10094;
      </button>
      <button className={style.arrowRight} onClick={handleSwipeLeft}>
        &#10095;
      </button>

      <div
        className={style.slider}
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Banner ${index + 1}`} />
        ))}
      </div>

      <div className={style.dots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${style.dot} ${
              currentImage === index ? style.active : ""
            }`}
            onClick={() => setCurrentImage(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Banners;
