import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../js/api";
import Footer from "./Footer";
import "./css/Mypage.css";

const Mypage = () => {
  const { logName, logId, logPhone, logEmail, isAuthLoading, logType } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [reservData, setReservData] = useState(null);
  const [formData, setFormData] = useState({
    id: logId,
    name: logName,
    user_phone: logPhone,
    user_email: logEmail,
    user_pw: "",
    password_at: "",
    user_type: logType,
  });

  useEffect(() => {
    // 아직 로그인 확인 중이면 아무것도 하지 않음
    if (isAuthLoading) return;

    if (!logId) {
      alert("잘못된 접근입니다.");
      navigate("/");
    }

    user_info();
    reserv_info();
  }, [logId, isAuthLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.user_type == "home") {
      if (!formData.user_pw.trim()) {
        alert("비밀번호를 입력해주세요.");
        return;
      }
      if (!formData.password_at.trim()) {
        alert("비밀번호 확인을 입력해주세요.");
        return;
      }
      if (formData.user_pw !== formData.password_at) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    try {
      if (confirm("저장하시겠습니까?")) {
        const res = await api.post("/user/mypageInfoUpdate", {
          user_id: formData.id,
          user_pw: formData.user_pw,
          user_phone: formData.user_phone,
          user_email: formData.user_email,
        });

        if (res.data.isSuccess) {
          alert(res.data.msg);
        } else {
          alert(res.data.msg);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const user_info = async () => {
    try {
      const res = await api.get("/user/mypageInfo", {});
      const userData = res.data.info[0];

      // 한 번에 상태 업데이트
      setFormData((prev) => ({
        ...prev,
        ...userData,
      }));
    } catch (err) {
      console.error("인기 상품 가져오기 실패:", err);
    }
  };

  const reserv_info = async () => {
    try {
      const res = await api.get("/reserv/mypageInfo", {});
      const userData = res.data.info;

      setReservData(Array.isArray(userData) ? userData : [userData]);
    } catch (err) {
      console.error("인기 상품 가져오기 실패:", err);
    }
  };

  return (
    <>
      <div className="mypage-container">
        <form className="mypage-form" onSubmit={handleSubmit}>
          <div className="mypage-btnDiv">
            <h1>정보 수정</h1>
            <button className="saveBtn">저장</button>
          </div>

          <input type="text" name="name" value={logName} disabled />
          <input
            type="text"
            name="user_phone"
            value={formData.user_phone}
            onChange={handleChange}
            placeholder="전화번호"
          />
          <input
            type="text"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            placeholder="이메일"
          />
          {logType && logType === "home" && (
            <>
              <input
                type="password"
                name="user_pw"
                placeholder="비밀번호"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password_at"
                placeholder="비밀번호 확인"
                onChange={handleChange}
              />
            </>
          )}
        </form>

        <h1 className="buyTable">구매목록</h1>
        <div className="mypage-table-wrapper">
          <table className="mypage-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>결제일</th>
              </tr>
            </thead>
            <tbody>
              {reservData && reservData.length > 0 ? (
                reservData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{Number(item.price).toLocaleString()}원</td>
                    <td>{new Date(item.create_date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">구매내역이 존재하지 않습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Mypage;
