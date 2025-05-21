import request from "@/utils/request";

//查詢全部部門資料
export const queryPageApi = (name, gender, begin, end, page, pageSize) =>
  request.get(
    `/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`
  );

//新增
export const addApi = (emp) => request.post("/emps", emp);

//根據ID查詢
export const queryInfoApi = (id) => request.get(`/emps/${id}`);
//修改
export const updateApi = (emp) => request.put("/emps", emp);
//刪除
export const deleteApi = (ids) => request.delete(`/emps?ids=${ids}`);
//查询所有員工
export const queryAllApi = () => request.get(`/emps/list`);
