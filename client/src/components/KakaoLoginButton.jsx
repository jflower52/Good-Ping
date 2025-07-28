import React from "react";
import kakaoBtn from "../assets/kakao_login.png";

const KakaoLoginButton = () => {
  const client_id = "10afc90eb5407b9214efa7383c88c687";
  //로컬
  // const redirect_uri = "http://localhost:8080/user/kakaoLogin"; // 이 경로 중요
  //운영
  const redirect_uri = "https://project-0ehn.onrender.com/user/kakaoLogin"; // 이 경로 중요

  const kakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}`;
    window.location.href = kakaoAuthUrl;
    // window.open(kakaoAuthUrl, "_blank", "width=500,height=600");
  };

  return (
    <img
      src={kakaoBtn}
      alt="카카오 로그인"
      onClick={kakaoLogin}
      id="kakaoLogin"
    />
  );
};

export default KakaoLoginButton;
