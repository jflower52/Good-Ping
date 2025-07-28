const dotenv = require("dotenv");
dotenv.config();
const { createClient } = require("@supabase/supabase-js");

//운영
const supabaseUrl = process.env.DB_URL; // 본인의 프로젝트 URL
const supabaseKey = process.env.DB_KEY; // 본인의 anon key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
