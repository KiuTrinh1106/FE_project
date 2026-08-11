import axios from 'axios';

// cấu hình axios dùng chung
const api = axios.create({
  baseURL: "http://localhost:8888",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
