const express = require("express");
const router = express.Router();
const controller = require("../controller/User");

//회원가입
router.post("/userAdd", controller.postUserAdd);

//로그인
router.post("/userLogin", controller.postUserLogin);
router.post("/userLogout", controller.postUserLogout);

//카카오 로그인
router.get("/kakaoLogin", controller.postKakaoLogin);

//로그인세션
router.get("/checkSession", controller.checkSession);

//알람
router.post("/alarmCancel", controller.alarmCancel);
router.post("/alarmSuccess", controller.alarmSuccess);
router.get("/alarmStatus", controller.getCheckAlarm);

//마이페이지 유저정보
router.get("/mypageInfo", controller.getMypageInfo);

//마이페이지 유저정보변경
router.post("/mypageInfoUpdate", controller.postMypageInfoUpdate);

//email 인증
router.post("/emailCert", controller.postEmailCert);

//fireBase 인증
router.post("/saveFcmToken", controller.saveFcmToken);

router.post("/subscribe", controller.subscribe);

module.exports = router;
