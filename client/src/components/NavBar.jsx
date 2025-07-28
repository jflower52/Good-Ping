import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import AlarmModal from "./AlarmModal";
import alarmIcon from "../assets/alarmIcon.png";
import alarmPlusIcon from "../assets/alarmPlusIcon.png";
import userIcon from "../assets/userIcon.png";
import logoImg from "../assets/logo2.png";
import api from "../js/api";
import "./css/NavBar.css";
import { useAlarm } from "../hooks/useAlarm"; // 커스텀 훅 임포트

const NavBar = () => {
   const {
      isLoggedIn,
      logName,
      logId,
      setIsLoggedIn,
      setLogName,
      showModal,
      setShowModal,
   } = useContext(AuthContext);

   const [isScrolled, setIsScrolled] = useState(false);
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const navigate = useNavigate();

   // 커스텀 훅에서 알람 상태와 함수 가져오기
   const { currentAlarm, toggleAlarm, saveAlarmInfo } = useAlarm();

   // 스크롤 감지 및 body.nav-solid 토글
   useEffect(() => {
      const onScroll = () => {
         const sc = window.scrollY > 0;
         setIsScrolled(sc);
         document.body.classList.toggle("nav-solid", sc);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
   }, []);

   const handleLogin = () => navigate("/login");

   const handleLogout = async () => {
      if (confirm("로그아웃 하시겠습니까?")) {
         try {
            await api.post("/user/userLogout");
            setIsLoggedIn(false);
            setLogName("");
            navigate("/");
         } catch (err) {
            console.error("로그아웃 실패:", err);
            alert("로그아웃 중 오류가 발생했습니다.");
         }
      }
   };

   // 외부 클릭 시 드롭다운 닫기
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (!e.target.closest(".user-dropdown")) {
            setDropdownOpen(false);
         }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
   }, []);

   const locationMypage = () => {
      navigate("/mypage");
   };

   return (
      <nav className={`navbar ${isScrolled ? "solid" : ""}`}>
         <div className="navbar__logo">
            <a href="/">
               <img src={logoImg} alt="Logo" />
            </a>
         </div>
         <div className="navbar__actions">
            {isLoggedIn && logId !== "admin" && (
               <>
                  <button className="alarm-btn" onClick={toggleAlarm}>
                     <img
                        src={currentAlarm ? alarmIcon : alarmPlusIcon}
                        alt="alarm"
                        className="alarmIcon"
                     />
                     <p>{currentAlarm ? "알람받는중" : "알림받기"}</p>
                  </button>
                  {showModal && (
                     <AlarmModal
                        onClose={() => setShowModal(false)}
                        onSave={saveAlarmInfo}
                     />
                  )}
               </>
            )}
            {isLoggedIn ? (
               <div className="user-dropdown">
                  <button
                     className="user-dropdown-toggle"
                     onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                     <img src={userIcon} alt="user" className="loginIcon" />
                     <span>{logName}님</span>
                     <span className="dropdown-arrow">
                        {dropdownOpen ? "▲" : "▼"}
                     </span>
                  </button>
                  {dropdownOpen && (
                     <div className="user-dropdown-menu">
                        <div onClick={locationMypage}>마이페이지</div>
                        <div onClick={handleLogout}>로그아웃</div>
                     </div>
                  )}
               </div>
            ) : (
               <button className="login-btn" onClick={handleLogin}>
                  <img src={userIcon} alt="login" className="loginIcon" />
                  <p>로그인</p>
               </button>
            )}
         </div>
      </nav>
   );
};

export default NavBar;
