import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../js/api";
import { AuthContext } from "./AuthContext";
import KakaoLoginButton from "./KakaoLoginButton";
import Footer from "./Footer";
import useNavFooterHeight from "../hooks/useNavFooterHeight";
import "./css/Login.css";

const Login = () => {
  useNavFooterHeight();
  const navigate = useNavigate();
  const { checkLogin } = useContext(AuthContext);

  const goToRegister = () => {
    navigate("/register");
  };

  const [formData, setFormData] = useState({
    user_id: "",
    user_pw: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/userLogin", {
        user_id: formData.user_id,
        user_pw: formData.user_pw,
      });

      if (res.data.isSuccess) {
        alert(res.data.msg);
        await checkLogin();
        navigate("/");
      } else {
        alert(res.data.msg);
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div id="loginBox">
        <div className="login-container">
          <h1>GOOD-PING 로그인</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="user_id"
              placeholder="아이디"
              value={formData.user_id}
              onChange={handleChange}
            />
            <input
              type="password"
              name="user_pw"
              placeholder="비밀번호"
              value={formData.user_pw}
              onChange={handleChange}
            />
            <div className="loginButtons">
              <button type="submit">로그인</button>
              <button type="button" onClick={goToRegister}>
                회원가입
              </button>
            </div>
            <KakaoLoginButton />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
