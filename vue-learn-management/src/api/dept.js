import request from "@/utils/request";

//查詢全部部門資料
export const queryALLApi = () => request.get("/depts");

//新增
export const addApi = (dept) => request.post("/depts", dept);

//根據ID查詢
export const queryByIdApi = (id) => request.get(`/depts/${id}`);
//修改
export const updateApi = (dept) => request.put("/depts", dept);
//刪除
export const deleteByApi = (id) => request.delete(`/depts?id=${id}`);
