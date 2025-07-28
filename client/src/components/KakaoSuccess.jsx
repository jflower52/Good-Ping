import React, { useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const KakaoSuccess = () => {
  const { checkLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const doLoginCheck = async () => {
      await checkLogin();
      navigate("/");
    };
    doLoginCheck();
  }, []);

  return <div>카카오 로그인 처리중...</div>;
};

export default KakaoSuccess;
