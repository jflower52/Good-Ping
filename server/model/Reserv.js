const db = require("../config/db");
const supabase = require("../config/supabaseClient");

const USE_SUPABASE = true;

// ✅ 예약 상품 등록
exports.insertReserv = async (user) => {
  const { file_idx, title, price, category, create_ip } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase.from("reservation").insert([
      {
        file_idx,
        title,
        price,
        category,
        create_ip,
        create_date: new Date(),
      },
    ]);
    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "INSERT INTO reservation (file_idx, title, price, category, create_date, create_ip) VALUES (?, ?, ?, ?, NOW(), ?)",
      [file_idx, title, price, category, create_ip]
    );
    return result;
  }
};

// ✅ 예약 리스트 조회 (섹션/검색 포함)
exports.selectReservList = async (text) => {
  const { sectionId, searchValue } = text;

  if (USE_SUPABASE) {
    let query = supabase.from("reservation").select("*", { count: "exact" });

    if (searchValue) {
      query = query.ilike("title", `%${searchValue}%`);
    }

    const { data: reservationData, error: reservationError } = await query;

    if (reservationError) throw reservationError;

    const fileIdxList = reservationData
      .map((item) => item.file_idx)
      .filter(Boolean);
    const idxList = reservationData.map((item) => item.idx);

    // 2. 관련된 file 테이블 수동 조회
    const { data: fileData, error: fileError } = await supabase
      .from("file")
      .select("file_idx, file_path, file_sub_idx")
      .in("file_idx", fileIdxList);

    if (fileError) throw fileError;

    // 3. 관련된 reservation_info 테이블 수동 조회 (판매 수 계산용)
    const { data: infoData, error: infoError } = await supabase
      .from("reservation_info")
      .select("idx")
      .in("idx", idxList);

    if (infoError) throw infoError;

    // 4. JS로 수동 매핑
    const grouped = reservationData.map((item) => {
      const relatedFiles = fileData.filter((f) => f.file_idx === item.file_idx);
      const file_paths = relatedFiles.map((f) => f.file_path).join(",");
      const sales = infoData.filter((info) => info.idx === item.idx).length;

      return {
        ...item,
        file_paths,
        sales,
      };
    });

    // 5. 인기순 정렬 처리
    if (sectionId === "popular") {
      return grouped
        .sort((a, b) => b.sales - a.sales || b.idx - a.idx)
        .slice(0, 8);
    }

    return grouped.sort((a, b) => b.idx - a.idx);
  } else {
    let query = `
      SELECT 
        a.idx,
        a.file_idx,
        a.title,
        a.price,
        a.category,
        a.inventory,
        a.create_date,
        GROUP_CONCAT(b.file_path ORDER BY b.file_sub_idx ASC) AS file_paths `;

    if (sectionId === "popular") {
      query += `,(SELECT COUNT(*) 
                    FROM reservation_info ri 
                    WHERE ri.rev_idx = a.idx
                  ) AS sales `;
    }

    query += `FROM reservation a 
              LEFT JOIN file b ON a.file_idx = b.file_idx `;

    if (searchValue && searchValue.trim() !== "") {
      query += `WHERE a.title LIKE '%${searchValue}%' `;
    }

    query += `GROUP BY a.idx, a.title `;

    if (sectionId === "popular") {
      query += `ORDER BY sales DESC, a.idx DESC LIMIT 8`;
    } else {
      query += `ORDER BY a.idx DESC`;
    }

    const [result] = await db.query(query);
    return result;
  }
};

// ✅ 구매 정보 등록
exports.insertReservPurchase = async (user) => {
  const {
    rev_idx,
    user_id,
    user_name,
    zip_code,
    address,
    address_at,
    phone,
    create_ip,
    formattedDate,
  } = user;

  if (USE_SUPABASE) {
    const { data, error } = await supabase.from("reservation_info").insert([
      {
        rev_idx,
        order_number: formattedDate,
        user_id,
        user_name,
        zip_code,
        address,
        address_at,
        user_phone: phone,
        create_ip,
        create_date: new Date(),
      },
    ]);
    if (error) throw error;
    return data;
  } else {
    const [result] = await db.query(
      "INSERT INTO reservation_info (rev_idx, order_number, user_id, user_name, zip_code, address, address_at, user_phone, create_date, create_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
      [
        rev_idx,
        formattedDate,
        user_id,
        user_name,
        zip_code,
        address,
        address_at,
        phone,
        create_ip,
      ]
    );
    return result;
  }
};

// ✅ 마이페이지 정보
exports.selectMypageInfo = async (userid) => {
  if (USE_SUPABASE) {
    // 1. reservation_info 테이블에서 user_id 기준으로 조회
    const { data: infoData, error: infoError } = await supabase
      .from("reservation_info")
      .select("*")
      .eq("user_id", userid);

    if (infoError) throw infoError;

    if (infoData.length === 0) return [];

    // 2. 관련된 reservation 데이터 조회 (rev_idx 기준)
    const revIdxList = infoData.map((item) => item.rev_idx).filter(Boolean);

    const { data: reservationData, error: reservationError } = await supabase
      .from("reservation")
      .select("idx, title, price, category")
      .in("idx", revIdxList);

    if (reservationError) throw reservationError;

    const result = infoData.map((info) => {
      const matchedReservation = reservationData.find(
        (r) => String(r.idx) === String(info.rev_idx)
      );

      return {
        title: matchedReservation?.title || "-",
        price: matchedReservation?.price || 0,
        create_date: info.create_date || new Date().toISOString(),
      };
    });

    return result;
  } else {
    const [rows] = await db.query(
      "SELECT * FROM reservation_info a LEFT JOIN reservation b ON a.rev_idx = b.idx WHERE user_id = ?",
      [userid]
    );
    return rows;
  }
};

exports.findTokens = async () => {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.from("fcm_tokens").select("token");
    if (error) throw error;
    return data;
  } else {
    const [rows] = await db.query("SELECT token FROM fcm_tokens");
    return rows;
  }
};
