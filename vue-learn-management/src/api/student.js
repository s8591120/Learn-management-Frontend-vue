import request from "@/utils/request";

//查詢學生資料
export const queryPageApi = (name, degree, clazzId, page, pageSize) =>
  request.get(
    `/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`
  );

//新增
export const addApi = (student) => request.post("/students", student);
//根據ID查詢
export const queryInfoApi = (id) => request.get(`/students/${id}`);
//修改
export const updateApi = (student) => request.put("/students", student);
//刪除
export const deleteApi = (ids) => request.delete(`/students/${ids}`);
//違規處理
export const violationApi = (id, score) =>
  request.put(`/students/violation/${id}/${score}`);
