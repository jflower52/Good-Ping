import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useAlarm } from "../hooks/useAlarm";
import AlarmModal from "./AlarmModal";
import "./css/AlarmPromo.css";

const AlarmPromo = () => {
   const { showModal, setShowModal } = useContext(AuthContext);
   const { currentAlarm, toggleAlarm, saveAlarmInfo } = useAlarm();

   return (
      <div className="alarm-promo">
         <div className="alarm-promo-overlay">
            <h1>Good-Ping</h1>
            <p className="promo-text">
               새로운 굿즈 출시 알림을 웹 푸시로 받아보세요!
            </p>
            <button className="promo-btn" onClick={toggleAlarm}>
               {currentAlarm ? "알림 끄기" : "알림받기"}
            </button>

            {showModal && (
               <AlarmModal
                  onClose={() => setShowModal(false)}
                  onSave={saveAlarmInfo}
               />
            )}
         </div>
      </div>
   );
};

export default AlarmPromo;
