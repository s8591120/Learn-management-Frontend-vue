import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";

//建立axios對象
const request = axios.create({
  baseURL: "https://lms-backend-4q3j.onrender.com",
  timeout: 600000,
});
//axios的請求request攔截器--獲取localStorage的token
request.interceptors.request.use(
  (config) => {
    //成功回調
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    if (loginUser && loginUser.token) {
      config.headers.token = loginUser.token;
    }
    return config;
  },
  (error) => {
    //失敗回調
    return Promise.reject(error);
  }
);
//axios的響應respones攔截器
request.interceptors.response.use(
  (response) => {
    //成功
    return response.data;
  },
  (error) => {
    //失敗
    if (error.response) {
      if (error.response.status === 401) {
        ElMessage.error("登錄超時，請重新登錄");
        router.push("/login");
      } else {
        ElMessage.error("接口訪問異常");
      }
    } else if (error.request) {
      ElMessage.error("無法連接到服務器，請稍後重試");
    } else {
      ElMessage.error("請求錯誤：" + error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
