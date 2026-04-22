import axios from "axios";

const API = axios.create({
  baseURL: `http://${window.location.hostname}:3000/api`,
});

// 🔥 token add
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;