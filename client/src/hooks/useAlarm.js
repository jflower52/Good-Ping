import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { messaging, getToken, onMessage } from "../js/firebase-config";
import api from "../js/api";

export const useAlarm = () => {
  const {
    isLoggedIn,
    logId,
    logPhone,
    logType,
    currentAlarm,
    setAlarm,
    setShowModal,
    setLogPhone,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const toggleAlarm = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (currentAlarm) {
      if (window.confirm("구독 취소하시겠습니까?")) {
        try {
          const res = await api.post("/user/alarmCancel");
          if (res.data.isSuccess) {
            setAlarm(false);
            alert("구독이 취소되었습니다.");
          } else {
            alert("알림 설정 실패: " + res.data.msg);
          }
        } catch (err) {
          console.error(err);
          alert("알림 설정 변경에 실패했습니다.");
        }
      }
    } else {
      if (!logPhone) {
        setShowModal(true);
      } else {
        const form = [{ user_id: logId, user_phone: logPhone }];
        await saveAlarmInfo(form, "구독");
      }
    }
  };

  const saveAlarmInfo = async (formData, text) => {
    if (window.confirm(`${text}하시겠습니까?`)) {
      try {
        const res = await api.post("/user/alarmSuccess", formData);
        if (res.data.isSuccess) {
          setAlarm(true);
          setLogPhone(formData.user_phone);
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker
              .register("/firebase-messaging-sw.js")
              .then((registration) => {
                console.log("✅ 서비스워커 등록됨:", registration);

                // 🔔 알림 권한 요청
                if ("Notification" in window) {
                  Notification.requestPermission().then(async (permission) => {
                    if (permission === "granted") {
                      const token = await getToken(messaging, {
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration,
                      });
                      const account_type = logType;
                      console.log(account_type);
                      console.log("🔥 FCM 토큰:", token);
                      await api.post("/user/saveFcmToken", {
                        token,
                        account_type,
                      });

                      const res = await api.post("/user/subscribe", { token });
                      if (res.data.isSuccess) {
                        console.log("토픽 구독 성공!");
                      } else {
                        console.log("구독 실패: " + res.data.msg);
                      }
                    }
                  });

                  // 🔔 포어그라운드 수신 알림
                  onMessage(messaging, (payload) => {
                    console.log("🔔 포어그라운드 메시지:", payload);

                    const { title, body } = payload.notification;

                    // ✅ 브라우저 기본 알림으로 띄우기
                    if (Notification.permission === "granted") {
                      new Notification(title, {
                        body: body,
                        icon: "/assets/logo2-DjOMUWLD.png", // 원하는 아이콘 경로
                      });
                    }
                  });
                }
              })
              .catch((err) => {
                console.error("❌ 서비스워커 등록 실패:", err);
              });
          }
          alert("알림 설정이 완료되었습니다.");
          setShowModal(false);
        } else {
          alert("알림 설정 실패: " + res.data.msg);
        }
      } catch (err) {
        console.error(err);
        alert("알림 설정에 실패했습니다.");
      }
    }
  };

  return {
    currentAlarm,
    toggleAlarm,
    saveAlarmInfo,
  };
};
