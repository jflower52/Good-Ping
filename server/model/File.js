// File.js (model)
const supabase = require("../config/supabaseClient");
const db = require("../config/db");

const USE_SUPABASE = true; // 👉 설정만 바꾸면 Supabase로 전환 가능

exports.insertFile = async (user) => {
  if (USE_SUPABASE) {
    const {
      file_idx,
      file_sub_idx,
      file_name,
      file_uniq_name,
      file_path,
      mimetype,
      size,
      create_ip,
    } = user;

    const { data, error } = await supabase.from("file").insert([
      {
        file_idx,
        file_sub_idx,
        file_name,
        file_uniq_name,
        file_path,
        mimetype,
        file_size: size,
        create_ip,
        create_date: new Date(),
      },
    ]);

    if (error) {
      console.error("Supabase 파일 삽입 오류:", error);
      throw error;
    }

    return data;
  } else {
    const {
      file_idx,
      file_sub_idx,
      file_name,
      file_uniq_name,
      file_path,
      mimetype,
      size,
      create_ip,
    } = user;

    const [result] = await db.query(
      "INSERT INTO file (file_idx, file_sub_idx, file_name, file_uniq_name, file_path, mimetype, file_size, create_date, create_ip) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
      [
        file_idx,
        file_sub_idx,
        file_name,
        file_uniq_name,
        file_path,
        mimetype,
        size,
        create_ip,
      ]
    );
    return result;
  }
};
