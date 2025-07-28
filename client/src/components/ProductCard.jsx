import React from "react";
import "./css/ProductCard.css"; // 필요하면 별도 스타일 분리 가능

function ProductCard({ item, index, showRank = false, onClick }) {
  //이미지 가공
  const getImageSrc = (path) => {
    if (!path) return ""; // 예외 처리

    if (path.startsWith("files/")) {
      return path;
    } else if (path.startsWith("temp/")) {
      return `temp-files/${path.slice(5)}`;
    } else {
      return path; // 기본 fallback
    }
  };

  return (
    <div
      className="product-card"
      onClick={() => onClick(item)}
      style={{ cursor: "pointer" }}
    >
      <div className="image-wrapper">
        <img src={getImageSrc(item.file_paths[0])} />
        {showRank && index < 3 && (
          <div className={`rank-badge rank-${index + 1}`}>{index + 1}위</div>
        )}
      </div>

      <div className="info">
        <p className="name">{item.title}</p>
        <p className="price">￦{Number(item.price).toLocaleString()}원</p>
      </div>
    </div>
  );
}

export default ProductCard;
