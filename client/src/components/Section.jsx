import React, { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import CustomSwiper from "./CustomSwiper";
import ProductCard from "./ProductCard";
import api from "../js/api";
import "./css/Section.css";

function Section({ title, showRank = false, sectionId, openProductModal }) {
   const [itemsPerSlide, setItemsPerSlide] = useState(2);
   const [sortedItems, setSortedItems] = useState([]);

   useEffect(() => {
      const updateItemsPerSlide = () => {
         if (window.innerWidth >= 1024) {
            setItemsPerSlide(4);
         } else if (window.innerWidth >= 768) {
            setItemsPerSlide(3);
         } else {
            setItemsPerSlide(2);
         }
      };
      updateItemsPerSlide();
      window.addEventListener("resize", updateItemsPerSlide);
      return () => window.removeEventListener("resize", updateItemsPerSlide);
   }, []);

   useEffect(() => {
      const processItems = async () => {
         try {
            const res = await api.get("/reserv/reservList", {
               params: { sectionId: sectionId },
            });
            let filtered = [...res.data.map];

            if (sectionId === "readBook") {
               filtered = filtered.filter((item) => item.category === "book");
            } else if (sectionId === "popular") {
               filtered.sort((a, b) => b.sales - a.sales);
            } else if (sectionId === "new") {
               filtered.sort(
                  (a, b) => new Date(b.create_date) - new Date(a.create_date)
               );
            }

            setSortedItems(filtered);
         } catch (err) {
            console.error("인기 상품 가져오기 실패:", err);
         }
      };

      processItems();
   }, [sectionId]);

   const limitedItems = sortedItems.slice(0, 8);

   const groupedItems = [];
   for (let i = 0; i < limitedItems.length; i += itemsPerSlide) {
      groupedItems.push(limitedItems.slice(i, i + itemsPerSlide));
   }

   return (
      <section className="slider-wrapper" id={sectionId}>
         <div className="slider-section">
            <h2 className="section-title">{title}</h2>
            <CustomSwiper className="section-swiper">
               {groupedItems.map((group, idx) => (
                  <SwiperSlide key={idx}>
                     <div className="slide-row">
                        {group.map((item, i) => {
                           const index = idx * itemsPerSlide + i;
                           return (
                              <ProductCard
                                 key={item.id}
                                 item={item}
                                 index={index}
                                 showRank={showRank}
                                 onClick={() => openProductModal(item)}
                              />
                           );
                        })}
                        {group.length < itemsPerSlide &&
                           Array.from({
                              length: itemsPerSlide - group.length,
                           }).map((_, i) => (
                              <div
                                 key={`empty-${i}`}
                                 className="product-card empty-card"
                              />
                           ))}
                     </div>
                  </SwiperSlide>
               ))}
            </CustomSwiper>
         </div>
      </section>
   );
}

export default Section;
