import axios from "axios";

const api = axios.create({
  baseURL: "https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const url = config.url ?? "";

  // Khong gan token cho cac API auth
  const isAuthApi =
    url.includes("/auth/signin") ||
    url.includes("/auth/signup") ||
    url.includes("/auth/refresh");

  if (token && !isAuthApi) {
    // config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
