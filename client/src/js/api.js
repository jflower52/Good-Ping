import axios from "axios";

const api = axios.create({
  //로컬
  // baseURL: "http://localhost:8080",
  //운영
  baseURL: "https://project-0ehn.onrender.com",
  withCredentials: true,
});

export default api;
