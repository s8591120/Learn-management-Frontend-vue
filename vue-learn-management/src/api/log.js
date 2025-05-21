import request from "@/utils/request";

//分頁查詢
export const queryPageApi = (page, pageSize) =>
  request.get(`/log/page?page=${page}&pageSize=${pageSize}`);
