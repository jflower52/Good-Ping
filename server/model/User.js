const db = require("../config/db");
const supabase = require("../config/supabaseClient");

const USE_SUPABASE = true;

// ✅ 아이디 중복 확인
exports.findById = async (userid) => {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .select("user_id")
      .eq("user_id", userid)
      .maybeSingle();
    if (error) throw error;
    return data;
  } else {
    const [rows] = await db.query(
      "SELECT user_id FROM user_info WHERE user_id = ?",
      [userid]
    );
    return rows[0];
  }
};

// ✅ 일반 회원가입
exports.insertUser = async (user) => {
  const { id, pw, name, phone, email, type, ip } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase.from("user_info").insert([
      {
        user_id: id,
        user_pw: pw,
        user_name: name,
        user_phone: phone,
        user_email: email,
        account_type: type,
        create_ip: ip,
        create_date: new Date(),
      },
    ]);
    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "INSERT INTO user_info (user_id, user_pw, user_name, user_phone, user_email, account_type, create_date, create_ip) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)",
      [id, pw, name, phone, email, type, ip]
    );
    return result;
  }
};

// ✅ 일반 로그인 시도 (카운트 확인)
exports.selectUserLogin = async (user) => {
  const { id, pw } = user;

  if (USE_SUPABASE) {
    const { count, error } = await supabase
      .from("user_info")
      .select("*", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("user_pw", pw)
      .eq("account_type", "home");

    if (error) throw error;
    return [{ "COUNT(*)": count }];
  } else {
    const [result] = await db.query(
      "SELECT COUNT(*) FROM user_info WHERE user_id = ? AND user_pw = ? AND account_type = 'home'",
      [id, pw]
    );
    return result;
  }
};

// ✅ 로그인 시 이름 및 계정타입 조회
exports.selectUserName = async (user) => {
  const { id, pw } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .select("user_name, account_type, user_phone, user_email")
      .eq("user_id", id)
      .eq("user_pw", pw)
      .maybeSingle();

    if (error) throw error;
    return [data];
  } else {
    const [result] = await db.query(
      "SELECT user_name,account_type,user_phone,user_email FROM user_info WHERE user_id = ? AND user_pw = ?",
      [id, pw]
    );
    return result;
  }
};

// ✅ 카카오 로그인 ID 중복 확인
exports.kakaoId = async (kakao_id) => {
  if (USE_SUPABASE) {
    const { count, error } = await supabase
      .from("user_info")
      .select("*", { count: "exact", head: true })
      .eq("user_id", kakao_id)
      .eq("account_type", "kakao");

    if (error) throw error;
    return [{ "COUNT(*)": count }];
  } else {
    const [result] = await db.query(
      "SELECT COUNT(*) FROM user_info WHERE user_id = ? AND account_type = 'kakao'",
      [kakao_id]
    );
    return result;
  }
};

// ✅ 카카오 계정 생성
exports.kakaoCreate = async (user) => {
  const { kakao_id, nickname, email, type, create_ip } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase.from("user_info").insert([
      {
        user_id: kakao_id,
        user_pw: kakao_id,
        user_name: nickname,
        user_email: email,
        account_type: type,
        create_date: new Date(),
        create_ip,
      },
    ]);
    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "INSERT INTO user_info (user_id, user_pw, user_name, user_email, account_type, create_date, create_ip) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
      [kakao_id, kakao_id, nickname, email, type, create_ip]
    );
    return result;
  }
};

// ✅ 구독 여부 카운트
exports.UserSubscribeCnt = async (userid) => {
  if (USE_SUPABASE) {
    const { count, error } = await supabase
      .from("user_info")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userid)
      .eq("subscribe_yn", "Y");

    if (error) throw error;
    return count;
  } else {
    const [rows] = await db.query(
      "SELECT COUNT(*) FROM user_info WHERE user_id = ? AND subscribe_yn = 'Y'",
      [userid]
    );
    return rows[0]["COUNT(*)"];
  }
};

// ✅ 유저 구독 여부 조회
exports.findUserSubscribe = async (userid) => {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .select("subscribe_yn")
      .eq("user_id", userid)
      .maybeSingle();
    if (error) throw error;
    return data?.subscribe_yn;
  } else {
    const [rows] = await db.query(
      "SELECT subscribe_yn FROM user_info WHERE user_id = ?",
      [userid]
    );
    return rows[0]["subscribe_yn"];
  }
};

// ✅ 구독 여부 업데이트
exports.updateAlarmCancel = async (user) => {
  const { user_id, user_yn } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .update({ subscribe_yn: user_yn })
      .eq("user_id", user_id);

    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "UPDATE user_info SET subscribe_yn = ? WHERE user_id = ?",
      [user_yn, user_id]
    );
    return result;
  }
};

exports.updateAlarmSuccess = async (user) => {
  const { user_id, user_phone, user_yn, account_type } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .update({ subscribe_yn: user_yn, user_phone: user_phone })
      .eq("user_id", user_id)
      .eq("account_type", account_type);

    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "UPDATE user_info SET subscribe_yn = ?, user_phone = ? WHERE user_id = ? AND account_type = ? ",
      [user_yn, user_phone, user_id, account_type]
    );
    return result;
  }
};

exports.updateAlarm = async (user) => {
  const { user_id, user_yn, account_type } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .update({ subscribe_yn: user_yn })
      .eq("user_id", user_id)
      .eq("account_type", account_type);

    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "UPDATE user_info SET subscribe_yn = ? WHERE user_id = ? AND account_type = ? ",
      [user_yn, user_id, account_type]
    );
    return result;
  }
};

exports.userPhoneCheck = async (user) => {
  const { user_id, user_phone, account_type } = user;

  if (USE_SUPABASE) {
    const { count, error } = await supabase
      .from("user_info")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id)
      .eq("user_phone", user_phone)
      .eq("account_type", account_type);

    if (error) throw error;
    return count;
  } else {
    const [result] = await db.query(
      "SELECT COUNT(*) FROM user_info WHERE user_id = ? AND user_phone = ? AND account_type = ? ",
      [user_id, user_phone, account_type]
    );
    return result[0]["COUNT(*)"];
  }
};

// ✅ 전체 유저 정보 조회
exports.getUserInfo = async (userid) => {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .select("*")
      .eq("user_id", userid)
      .eq("account_type", "home");

    if (error) throw error;
    return data;
  } else {
    const [rows] = await db.query(
      "SELECT * FROM user_info WHERE user_id = ? AND account_type = 'home'",
      [userid]
    );
    return rows;
  }
};

// ✅ MYPAGE 정보 업데이트
exports.postMypageInfoUpdate = async (
  user_email,
  user_phone,
  user_pw,
  user_id,
  account_type
) => {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .update({
        user_email,
        user_phone,
        user_pw,
      })
      .eq("user_id", user_id)
      .eq("account_type", account_type);

    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "UPDATE user_info SET user_pw = ?, user_phone = ?,user_email = ?  WHERE user_id = ? AND account_type = ?",
      [user_pw, user_phone, user_email, user_id, account_type]
    );
    return result;
  }
};

exports.postMypageInfoUpdate2 = async (
  user_email,
  user_phone,
  user_id,
  account_type
) => {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("user_info")
      .update({
        user_email,
        user_phone,
      })
      .eq("user_id", user_id)
      .eq("account_type", account_type);

    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "UPDATE user_info SET user_phone = ?,user_email = ?  WHERE user_id = ? AND account_type = ?",
      [user_phone, user_email, user_id, account_type]
    );
    return result;
  }
};

// ✅ 토큰저장
exports.saveFcmToken = async (user) => {
  const { user_id, token, create_ip, account_type } = user;
  if (USE_SUPABASE) {
    const { data, error } = await supabase.from("fcm_tokens").insert([
      {
        user_id,
        token,
        create_date: new Date(),
        create_ip,
        account_type,
      },
    ]);
    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "INSERT INTO fcm_tokens (user_id, token, create_date, create_ip, account_type) VALUES (?, ?, NOW(), ?, ?)",
      [user_id, token, create_ip, account_type]
    );
    return result;
  }
};

exports.updateFcmToken = async (user) => {
  const { user_id, token, create_ip, account_type } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from("fcm_tokens")
      .update({
        token,
        create_ip,
        create_date,
      })
      .eq("user_id", user_id)
      .eq("account_type", account_type);

    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "UPDATE fcm_tokens SET token = ?, create_date = NOW() ,create_ip = ?  WHERE user_id = ? AND account_type = ? ",
      [token, create_ip, user_id, account_type]
    );
    return result;
  }
};

exports.selectFcmToken = async (user) => {
  const { user_id, account_type } = user;
  if (USE_SUPABASE) {
    const { count, error } = await supabase
      .from("fcm_tokens")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id)
      .eq("account_type", account_type);

    if (error) throw error;
    return count;
  } else {
    const [result] = await db.query(
      "SELECT COUNT(*) FROM fcm_tokens WHERE user_id = ? AND account_type = ? ",
      [user_id, account_type]
    );
    return result[0]["COUNT(*)"];
  }
};

exports.subscribeCheck = async (user) => {
  const { user_id, account_type } = user;
  if (USE_SUPABASE) {
    const { count, error } = await supabase
      .from("user_info")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id)
      .eq("account_type", account_type)
      .eq("subscribe_yn", "Y");

    if (error) throw error;
    return count;
  } else {
    const [result] = await db.query(
      "SELECT COUNT(*) FROM user_info WHERE user_id = ? AND account_type = ? AND subscribe_yn = 'Y' ",
      [user_id, account_type]
    );
    return result[0]["COUNT(*)"];
  }
};
