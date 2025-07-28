import React, { useEffect, useRef, useState } from "react";
import api from "../js/api";
import "./css/CreateModal.css";

const CreateModal = ({ onClose }) => {
  const modalRef = useRef(null);
  const [images, setImages] = useState([]);
  const [productType, setProductType] = useState("normal"); // 추가: 상품 유형 상태
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    price: 0,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("이미지는 최대 10장까지 업로드할 수 있습니다.");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 생성
    const formDataToSend = new FormData();
    formDataToSend.append("category", formData.category);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("price", formData.price);

    // 이미지 여러 개 추가
    images.forEach((imgObj) => {
      formDataToSend.append("files", imgObj.file);
    });

    try {
      const res = await api.post("/reserv/reservAdd", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.isSuccess) {
        alert("상품이 등록되었습니다!");
        onClose(); // 모달 닫기
      } else {
        alert("등록 실패: " + res.data.msg);
      }
    } catch (err) {
      console.error("업로드 중 오류 발생:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="create-modal-overlay">
      <div className="create-modal" ref={modalRef}>
        {/* 닫기 버튼 추가 */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <h2>상품 추가</h2>
        <form onSubmit={handleSubmit}>
          {/* 상품 유형 선택 추가 */}
          <div className="product-type">
            <label>
              <input
                type="radio"
                name="category"
                value="normal"
                checked={productType === "normal"}
                onChange={(e) => {
                  setProductType("normal");
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
              일반
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="book"
                checked={productType === "book"}
                onChange={(e) => {
                  setProductType("book");
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
              단행본
            </label>
          </div>
          <input
            type="text"
            name="title"
            placeholder="상품 이름"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="상품 가격"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            name="files"
            multiple
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {images.map((img, index) => (
              <div key={index} className="image-thumb">
                <img src={img.url} alt={`preview-${index}`} />
                <button type="button" onClick={() => removeImage(index)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="submit" className="submit-btn">
            등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
