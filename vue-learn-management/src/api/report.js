import request from "@/utils/request";

//統計職位員工人數
export const queryEmpJobDataApi = () => request.get(`/report/empJobData`);
//統計員工性別
export const queryEmpGenderDataApi = () => request.get(`/report/empGenderData`);
//統計每個班級的人數
export const queryStudentCountDataApi = () =>
  request.get(`/report/studentCountData`);
//統計學生的學歷
export const queryStudentDegreeDataApi = () =>
  request.get(`/report/studentDegreeData`);
