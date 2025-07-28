// src/components/Header.jsx
import "./css/Header.css";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.png";
import bg3 from "../assets/bg3.jpg";
import bg4 from "../assets/bg4.jpg";
import bg5 from "../assets/bg5.jpg";
import bg6 from "../assets/bg6.jpg";
import bg7 from "../assets/bg7.jpg";
import useNavFooterHeight from "../hooks/useNavFooterHeight";
import { useEffect, useState } from "react";

const sliderImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7];

function Header() {
   useNavFooterHeight();
   const [currentIndex, setCurrentIndex] = useState(0);
   const [startX, setStartX] = useState(null);

   const handleMouseDown = (e) => setStartX(e.clientX);
   const handleMouseUp = (e) => {
      if (startX === null) return;
      const delta = e.clientX - startX;
      if (delta > 50)
         setCurrentIndex(
            (i) => (i - 1 + sliderImages.length) % sliderImages.length
         );
      else if (delta < -50)
         setCurrentIndex((i) => (i + 1) % sliderImages.length);
      setStartX(null);
   };

   const handleTouchStart = (e) => setStartX(e.touches[0].clientX);
   const handleTouchEnd = (e) => {
      if (startX === null) return;
      const delta = e.changedTouches[0].clientX - startX;
      if (delta > 50)
         setCurrentIndex(
            (i) => (i - 1 + sliderImages.length) % sliderImages.length
         );
      else if (delta < -50)
         setCurrentIndex((i) => (i + 1) % sliderImages.length);
      setStartX(null);
   };

   // 자동 슬라이드
   useEffect(() => {
      const iv = setInterval(() => {
         setCurrentIndex((i) => (i + 1) % sliderImages.length);
      }, 3000);
      return () => clearInterval(iv);
   }, []);

   return (
      <div className="slider">
         <div
            className="slides"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
         >
            {sliderImages.map((img, i) => (
               <div
                  key={i}
                  className="slide"
                  style={{ backgroundImage: `url(${img})` }}
               />
            ))}
         </div>

         <div className="pagination">
            {sliderImages.map((_, i) => (
               <button
                  key={i}
                  className={`dot ${currentIndex === i ? "active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
               />
            ))}
         </div>

         <div className="overlay">
            <div className="center-text">
               <h1>웹툰 굿즈들을 이곳에서!</h1>
               <p>우리 함께 덕질해요</p>
            </div>
         </div>
      </div>
   );
}

export default Header;
