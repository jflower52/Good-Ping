const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const controller = require("../controller/Reserv");

//굿즈 목록생성
router.post("/reservAdd", upload.array("files", 10), controller.postReservAdd);

//굿즈 목록LIST
router.get("/reservList", controller.getReservList);

//구매하기
router.post("/reservPurchase", controller.postReservPurchase);

//마이페이지 정보
router.get("/mypageInfo", controller.getMypageInfo);

module.exports = router;
