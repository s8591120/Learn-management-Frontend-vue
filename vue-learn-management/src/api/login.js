import request from "@/utils/request";

//登錄
export const loginApi = (data) => request.post("/login", data);
