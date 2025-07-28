import React, { useState } from "react";
import api from "../js/api";
import Footer from "./Footer";
import "./css/Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    user_pw: "",
    confirm_pw: "",
    user_phone: "",
    user_name: "",
    user_email: "",
    account_type: "home",
    cert_code: "",
  });

  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [cert, setCert] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_id.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    if (!formData.user_pw.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (!formData.confirm_pw.trim()) {
      alert("비밀번호 확인을 입력해주세요.");
      return;
    }
    if (formData.user_pw !== formData.confirm_pw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.user_phone.trim()) {
      alert("휴대전화를 입력해주세요.");
      return;
    }
    if (!formData.user_name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!formData.user_email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!cert) {
      alert("이메일인증을 입력해주세요.");
      return;
    }

    try {
      const res = await api.post("/user/userAdd", {
        user_id: formData.user_id,
        user_pw: formData.user_pw,
        user_phone: formData.user_phone,
        user_name: formData.user_name,
        user_email: formData.user_email,
        account_type: formData.account_type,
      });

      if (res.data.isSuccess) {
        setMessage(res.data.msg);
        alert(res.data.msg);
        navigate("/login");
      } else {
        setMessage(res.data.msg);
      }
    } catch (error) {
      console.error(error);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  const emailCert = async () => {
    try {
      const res = await api.post("/user/emailCert", {
        user_email: formData.user_email,
      });

      if (res.data.isSuccess) {
        alert(res.data.msg);
        setCode(res.data.code);
      } else {
        alert("이메일 인증 실패: " + res.data.msg);
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const emailCertConfirm = () => {
    if (code == formData.cert_code) {
      alert("이메일 인증이 완료되었습니다.");
      setCert(true);
    } else {
      alert("이메일 인증코드가 틀렸습니다.");
    }
  };

  return (
    <>
      <div className="register-container">
        <h1>GOOD-PING 회원가입</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="account_type"
            value={formData.account_type}
          />
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
          <input
            type="password"
            name="confirm_pw"
            placeholder="비밀번호 확인"
            value={formData.confirm_pw}
            onChange={handleChange}
          />
          <input
            type="text"
            name="user_phone"
            placeholder="휴대전화"
            value={formData.user_phone}
            onChange={(e) => {
              const onlyNums = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 11);
              setFormData({
                ...formData,
                user_phone: onlyNums,
              });
            }}
          />
          <input
            type="text"
            name="user_name"
            placeholder="이름"
            value={formData.user_name}
            onChange={handleChange}
          />
          <div className="email-form-wrap">
            <input
              type="email"
              name="user_email"
              placeholder="이메일"
              value={formData.user_email}
              onChange={handleChange}
            />
            {code ? (
              <button type="button" onClick={emailCertConfirm}>
                인증번호확인
              </button>
            ) : (
              <button type="button" onClick={emailCert}>
                이메일인증
              </button>
            )}
          </div>
          {code && (
            <input
              type="text"
              name="cert_code"
              placeholder="인증번호 입력"
              value={formData.cert_code}
              onChange={handleChange}
            />
          )}
          <button type="submit" id="submitBtn">
            회원가입 완료
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <Footer />
    </>
  );
};

export default Register;
