import React from "react";
import { Swiper } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules"; // Autoplay 추가
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // 필요하면 추가
import "./css/CustomSwiper.css";

const CustomSwiper = ({ children, className }) => {
   return (
      <Swiper
         className={className}
         modules={[Pagination]} // Autoplay 추가
         pagination={{ clickable: true }}
         autoplay={{ delay: 3000, disableOnInteraction: false }} // 자동재생 옵션
         loop={true} // 반복 재생 (선택사항)
      >
         {children}
      </Swiper>
   );
};

export default CustomSwiper;
