const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

router.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_info")
      .select("*")
      .limit(1);

    if (error) throw error;

    res.send({ success: true, data });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

module.exports = router;
