import React, { createContext, useState, useEffect } from "react";
import api from "../js/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logName, setLogName] = useState("");
  const [logId, setLogId] = useState("");
  const [logType, setLogType] = useState("");
  const [logPhone, setLogPhone] = useState("");
  const [logEmail, setLogEmail] = useState("");
  const [currentAlarm, setAlarm] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const checkLogin = async () => {
    try {
      const res = await api.get("/user/checkSession");
      if (res.data.isLoggedIn) {
        setIsLoggedIn(true);
        setLogName(res.data.user_name);
        setLogId(res.data.user_id);
        setLogType(res.data.account_type);
        setLogPhone(res.data.user_phone);
      } else {
        setIsLoggedIn(false);
        setLogName("");
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
      setLogName("");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const fetchAlarmStatus = async () => {
    try {
      const res = await api.get("/user/alarmStatus");
      setAlarm(res.data.isSuccess);
    } catch (err) {
      console.error("알림 상태 로드 실패:", err);
    }
  };

  useEffect(() => {
    checkLogin();
    fetchAlarmStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        logName,
        setLogName,
        logId,
        setLogId,
        checkLogin,
        currentAlarm,
        setAlarm,
        fetchAlarmStatus,
        isAuthLoading,
        logType,
        setLogType,
        logPhone,
        setLogPhone,
        showModal,
        setShowModal,
        logEmail,
        setLogEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
