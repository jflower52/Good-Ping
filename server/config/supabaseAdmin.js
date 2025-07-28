const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.DB_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
