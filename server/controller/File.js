const fileModel = require("../model/File");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const supabase = require("../config/supabaseAdmin");
const dotenv = require("dotenv");
dotenv.config();

//파일 생성 로컬
// exports.postFileAdd = async (req, res, formattedDate) => {
//   const create_ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   try {
//     const fileNames = [];

//     for (let i = 0; req.files.length > i; i++) {
//       const file = req.files[i];
//       // 폴더명 생성 (formattedDate 앞 8자리 → YYYYMMDD)
//       const folderName = formattedDate.substring(0, 8);

//       //로컬
//       // const reactProjectPath = path.join(
//       //   __dirname,
//       //   "../../client/public/files",
//       //   folderName
//       // );
//       //운영
//       const reactProjectPath = path.join("/tmp", folderName);

//       // 폴더 없으면 생성
//       if (!fs.existsSync(reactProjectPath)) {
//         fs.mkdirSync(reactProjectPath, { recursive: true });
//       }

//       // 유니크한 파일명 생성
//       const ext = path.extname(file.originalname);
//       const randomSuffix = crypto.randomBytes(4).toString("hex");
//       const fileName = `${formattedDate}_${randomSuffix}${ext}`;

//       //파일생성
//       const filePath = path.join(reactProjectPath, fileName);

//       fs.writeFileSync(filePath, file.buffer);

//       //존재여부확인
//       const filePath1 = path.join(
//         "/tmp",
//         "20250624",
//         "20250624083951041_4235a8b4.jfif"
//       );
//       console.log("파일 존재 여부:", fs.existsSync(filePath1));

//       await fileModel.insertFile({
//         file_idx: formattedDate,
//         file_sub_idx: i,
//         file_name: file.originalname,
//         file_uniq_name: fileName,
//         // file_path: `files/${folderName}/${fileName}`,
//         file_path: `tmp/${folderName}/${fileName}`,
//         mimetype: file.mimetype,
//         size: file.size,
//         create_ip: create_ip,
//       });

//       console.log("파일 생성 성공:", filePath);
//       fileNames.push(fileName);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ isSuccess: false, msg: "파일 생성 실패" });
//   }
// };

//운영
exports.postFileAdd = async (req, res, formattedDate) => {
  const create_ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const ext = path.extname(file.originalname);
      const randomSuffix = crypto.randomBytes(4).toString("hex");
      const fileName = `${formattedDate}_${randomSuffix}${ext}`;
      const folderName = formattedDate.substring(0, 8);
      const fullPath = `${folderName}/${fileName}`;

      const { error } = await supabase.storage
        .from("supa-files")
        .upload(fullPath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const publicUrl = `${process.env.DB_URL}/storage/v1/object/public/supa-files/${fullPath}`;

      await fileModel.insertFile({
        file_idx: formattedDate,
        file_sub_idx: i,
        file_name: file.originalname,
        file_uniq_name: fileName,
        file_path: publicUrl,
        mimetype: file.mimetype,
        size: file.size,
        create_ip,
      });

      console.log("✅ 업로드 성공:", publicUrl);
    }

    res.send({ isSuccess: true });
  } catch (error) {
    console.error("❌ 업로드 실패:", error);
    res.status(500).send({ isSuccess: false, msg: "파일 업로드 실패" });
  }
};
