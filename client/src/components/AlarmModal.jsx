import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./css/AlarmModal.css";

const AlarmModal = ({ onClose, onSave }) => {
   const { logId, logName, logPhone } = useContext(AuthContext);

   const [form, setForm] = useState({
      user_id: logId,
      user_name: logName,
      user_phone: logPhone,
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
   };

   const handleSave = () => {
      onSave(form, "저장"); // 부모 컴포넌트에 저장 요청
      onClose(); // 모달 닫기
   };

   return (
      <div className="alarm-modal-overlay">
         <div className="alarm-modal">
            <h2>알림 설정 입력</h2>
            <input
               type="text"
               name="user_name"
               placeholder="성함을 입력해주세요."
               value={form.user_name}
               onChange={handleChange}
               readOnly
            />
            <input
               type="text"
               name="user_phone"
               placeholder="전화번호를 입력해주세요"
               value={form.user_phone ?? ""}
               onChange={handleChange}
            />
            <div>
               <button className="save-btn" onClick={handleSave}>
                  저장
               </button>
               <button className="close-btn" onClick={onClose}>
                  닫기
               </button>
            </div>
         </div>
      </div>
   );
};

export default AlarmModal;
