import React, { useState } from "react";
import "./css/FAQ.css";

const FAQ_DATA = [
   {
      question: "배송은 얼마나 걸리나요?",
      answer: "평균 2-3일 이내 도착합니다.",
   },
   {
      question: "교환/환불 정책은?",
      answer: "상품 수령 후 7일 이내 교환/환불 가능.",
   },
   {
      question: "개인정보 보호 및 이용",
      answer:
         "수집된 개인정보는 주문·배송·고객 관리 용도로만 사용하며, 관련 법령에 따라 안전하게 보관·파기합니다.",
   },
];

const FAQ = () => {
   const [openIndex, setOpenIndex] = useState(null);

   const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
   };

   return (
      <section id="faq" className="faq-section">
         <h2 className="faq-title">자주 묻는 질문</h2>
         <div className="faq-list">
            {FAQ_DATA.map(({ question, answer }, idx) => (
               <div
                  key={idx}
                  className={`faq-item ${openIndex === idx ? "open" : ""}`}
               >
                  <div className="faq-question" onClick={() => toggleFAQ(idx)}>
                     {question}
                     <span className="arrow">
                        {openIndex === idx ? "▲" : "▼"}
                     </span>
                  </div>
                  <div className="faq-answer-wrapper">
                     <p className="faq-answer">{answer}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
};

export default FAQ;
