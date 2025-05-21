import request from "@/utils/request";

//查詢班級資料
export const queryPageApi = (name, begin, end, page, pageSize) =>
  request.get(
    `/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`
  );

//新增
export const addApi = (clazz) => request.post("/clazzs", clazz);
//根據ID查詢
export const queryInfoApi = (id) => request.get(`/clazzs/${id}`);
//修改
export const updateApi = (clazz) => request.put("/clazzs", clazz);
//刪除
export const deleteApi = (id) => request.delete(`/clazzs/${id}`);
//查询全部班級
export const queryAllApi = () => request.get("/clazzs/list");
