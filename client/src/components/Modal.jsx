import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../js/api";
import "./css/Modal.css";

function Modal({ product, onClose }) {
  const [mainImage, setMainImage] = useState(product.file_paths[0]);
  const { logName, logId, isLoggedIn, logPhone, logType } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    idx: product.idx,
    id: logId,
    name: logName,
    zip_code: "",
    address: "",
    address_at: "",
    phone: logPhone,
    type: logType,
  });

  // ✅ 스크롤 막기 처리
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 스크롤 막기
    return () => {
      document.body.style.overflow = ""; // 복구
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.zip_code.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }
    if (!form.address.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }
    if (!form.phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (confirm("구매하시겠습니까?")) {
      const res = await api.post("/reserv/reservPurchase", {
        rev_idx: form.idx,
        user_id: form.id,
        user_name: form.name,
        zip_code: form.zip_code,
        address: form.address,
        address_at: form.address_at,
        phone: form.phone,
      });
      console.log("isSuccess", res.data.isSuccess);
      if (res.data.isSuccess) {
        const smsRes = await api.post("/sms/send-message", {
          name: logName,
          idx: `${res.data.order_number} ( ${product.title} )`,
          btn_url: "https://good-ping.onrender.com/",
          tel: form.phone,
          disableSms: true,
          user_id: form.id,
          account_type: form.type,
        });
        if (smsRes.data.success) {
          console.log("smsRes isSuccess", smsRes.data.isSuccess);
          alert(res.data.msg);
          onClose();
        } else {
          alert(smsRes.data.error);
        }
      } else {
        alert(res.data.msg);
      }
    }
  };

  function zipCode() {
    try {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const zipcode = data.zonecode;
          const addr = data.address;

          setForm((prev) => ({
            ...prev,
            zip_code: zipcode,
            address: addr,
          }));
        },
      }).open();
    } catch (e) {
      alert("주소검색 중 오류 발생");
      console.error(e);
    }
  }

  const handleLogin = () => navigate("/login");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 추가 */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* 왼쪽: 이미지 뷰 */}
        <div className="modal-left">
          <div className="main-image">
            <img src={mainImage} alt="선택 이미지" />
          </div>
          <div className="thumbnail-list">
            {product.file_paths.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`썸네일 ${idx}`}
                className={img === mainImage ? "active" : ""}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* 오른쪽: 상품 정보 및 입력 */}
        <div className="modal-right">
          <h2 className="detailName">{product.title}</h2>
          <p className="detailPrice">
            ￦{Number(product.price).toLocaleString()}원
          </p>

          <form className="order-form" onSubmit={handleSubmit}>
            {isLoggedIn ? (
              <>
                <input type="hidden" name="id" value={form.idx} />
                <input
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={logName}
                  readOnly
                />
                <div className="zip-wrap">
                  <input
                    type="text"
                    name="zip_code"
                    placeholder="우편번호"
                    value={form.zip_code}
                    onChange={handleChange}
                    readOnly
                  />
                  <button type="button" onClick={zipCode} className="zipButton">
                    주소검색
                  </button>
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="주소"
                  value={form.address}
                  onChange={handleChange}
                  readOnly
                />
                <input
                  type="text"
                  name="address_at"
                  placeholder="상세주소"
                  value={form.address_at}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="전화번호"
                  value={form.phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 11);
                    setForm({
                      ...form,
                      phone: onlyNums,
                    });
                  }}
                />
                <button type="submit" id="buyButton">
                  구매하기
                </button>
              </>
            ) : (
              <>
                <button type="button" id="buyButton" onClick={handleLogin}>
                  로그인
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
