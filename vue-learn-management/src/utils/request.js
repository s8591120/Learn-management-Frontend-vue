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
    if (error.response.status == 401) {
      //提示訊息
      ElMessage.error("登錄超時，請重新登錄");
      //跳轉到登錄頁面
      router.push("/login");
    } else {
      ElMessage.error("接口訪問異常");
    }
    return Promise.reject(error);
  }
);

export default request;
