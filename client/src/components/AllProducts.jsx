// src/components/AllProductsSection.js
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import api from "../js/api";
import "./css/AllProducts.css";

function AllProductsSection({ openProductModal }) {
   // ─── 상태 선언 ─────────────────────────────
   const [items, setItems] = useState([]);
   const [inputValue, setInputValue] = useState("");
   const [isDesktop, setIsDesktop] = useState(
      typeof window !== "undefined" ? window.innerWidth >= 1024 : false
   );
   const isComposing = useRef(false);

   // ─── 1) 초기 데이터 로드 ─────────────────────
   useEffect(() => {
      const fetchAll = async () => {
         try {
            const res = await api.get("/reserv/reservList", {
               params: { sectionId: "board" },
            });
            if (res.data.isSuccess) {
               setItems(res.data.map);
            } else {
               alert(res.data.msg);
            }
         } catch (err) {
            console.error(err);
            alert("서버 오류가 발생했습니다.");
         }
      };
      fetchAll();
   }, []);

   // ─── 2) 리사이즈에 따라 Desktop 여부 업데이트 ───
   useEffect(() => {
      const updateLayout = () => {
         setIsDesktop(window.innerWidth >= 1024);
      };
      updateLayout();
      window.addEventListener("resize", updateLayout);
      return () => window.removeEventListener("resize", updateLayout);
   }, []);

   // ─── 3) 검색 핸들러 ──────────────────────────
   const searchChange = async (value) => {
      try {
         const res = await api.get("/reserv/reservList", {
            params: { searchValue: value },
         });
         setItems(res.data.map);
         setCurrentPage(1);
      } catch (err) {
         console.error(err);
         alert("서버 오류가 발생했습니다.");
      }
   };

   // ─── 4) 페이징 로직 ─────────────────────────
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;
   const pageCount = Math.ceil(items.length / itemsPerPage);

   // 표시할 페이지 그룹(최대 5개)
   const pagesToShow = 5;
   const half = Math.floor(pagesToShow / 2);
   let startPage = currentPage - half;
   let endPage = currentPage + half;
   if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(pagesToShow, pageCount);
   }
   if (endPage > pageCount) {
      endPage = pageCount;
      startPage = Math.max(1, pageCount - pagesToShow + 1);
   }
   const visiblePages = [];
   for (let p = startPage; p <= endPage; p++) visiblePages.push(p);

   const startIndex = (currentPage - 1) * itemsPerPage;
   const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

   return (
      <section className="all-products-section" id="allProducts">
         <h2 className="all-products-title">상품 전체보기</h2>

         {/* 검색창 */}
         <div className="all-products-search">
            <input
               type="text"
               placeholder="상품명으로 검색"
               value={inputValue}
               onChange={(e) => {
                  setInputValue(e.target.value);
                  if (!isComposing.current) searchChange(e.target.value);
               }}
               onCompositionStart={() => (isComposing.current = true)}
               onCompositionEnd={(e) => {
                  isComposing.current = false;
                  searchChange(e.target.value);
               }}
            />
         </div>

         {isDesktop ? (
            /* ─────────── 데스크탑: 그리드 ─────────── */
            <div className="all-products-grid">
               {currentItems.map((item, idx) => (
                  <div
                     key={item.id || idx}
                     className="all-products-item"
                     onClick={() => openProductModal(item, true)}
                  >
                     <ProductCard item={item} index={startIndex + idx} />
                  </div>
               ))}
            </div>
         ) : (
            /* ─────────── 모바일/태블릿: Swiper 슬라이드 ─────────── */
            <Swiper
               className="all-products-swiper"
               modules={[Pagination]}
               spaceBetween={20}
               pagination={{ clickable: true }}
               slidesPerView={2} // 모바일 기본: 2개
               slidesPerGroup={2} // 모바일 한 번에 2개씩 넘어감
               breakpoints={{
                  0: {
                     slidesPerView: 2,
                     slidesPerGroup: 2,
                     spaceBetween: 20,
                  },
                  768: {
                     slidesPerView: 3, // 태블릿: 화면에 3개 보임
                     slidesPerGroup: 3, // 태블릿: 한 번에 3개씩 넘어감
                     spaceBetween: 20,
                  },
               }}
               loop={false}
               loopFillGroupWithBlank={false}
            >
               {currentItems.map((item, idx) => (
                  <SwiperSlide key={item.id || idx}>
                     <ProductCard
                        item={item}
                        index={startIndex + idx}
                        onClick={() => openProductModal(item, true)}
                     />
                  </SwiperSlide>
               ))}
            </Swiper>
         )}

         {/* 페이지네이션 (양쪽 모드 공통) */}
         {pageCount > 1 && (
            <div className="all-products-pagination">
               <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
               >
                  &lt;&lt;
               </button>
               <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
               >
                  &lt;
               </button>
               {visiblePages.map((p) => (
                  <button
                     key={p}
                     className={p === currentPage ? "active" : ""}
                     onClick={() => setCurrentPage(p)}
                  >
                     {p}
                  </button>
               ))}
               <button
                  onClick={() =>
                     setCurrentPage((p) => Math.min(pageCount, p + 1))
                  }
                  disabled={currentPage === pageCount}
               >
                  &gt;
               </button>
               <button
                  onClick={() => setCurrentPage(pageCount)}
                  disabled={currentPage === pageCount}
               >
                  &gt;&gt;
               </button>
            </div>
         )}
      </section>
   );
}

export default AllProductsSection;
