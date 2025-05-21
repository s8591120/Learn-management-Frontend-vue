<script setup>
import { queryPageApi } from "@/api/log";
import { ref, onMounted } from "vue";

//列表展示
let logData = ref([]);
//鉤子函數
onMounted(() => {
  queryPage();
});

//分頁
const pagination = ref({ currentPage: 1, pageSize: 15, total: 0 });
//每頁展示記錄數
const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize;
  queryPage();
};
//頁碼發生變化時觸發
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page;
  queryPage();
};
//分頁條件查詢
const queryPage = async () => {
  const result = await queryPageApi(
    pagination.value.currentPage,
    pagination.value.pageSize
  );
  if (result.code) {
    logData.value = result.data.list;
    pagination.value.total = result.data.total;
  }
};
</script>

<template>
  <div id="title">
    日誌管理
    <br />
  </div>

  <!--列表展示-->
  <el-table :data="logData" border style="width: 100%" fit size="small">
    <el-table-column
      prop="operateEmpName"
      label="操作人"
      width="80px"
      align="center"
    />
    <el-table-column
      prop="operateTime"
      label="操作時間"
      width="150px"
      align="center"
    />
    <el-table-column
      prop="className"
      label="類名"
      width="300px"
      align="center"
    />
    <el-table-column
      prop="methodName"
      label="方法名"
      width="100px"
      align="center"
    />
    <el-table-column
      prop="costTime"
      label="操作耗時(ms)"
      width="100px"
      align="center"
    />
    <el-table-column
      prop="methodParams"
      label="請求參數"
      width="280px"
      align="center"
    >
      <template #default="scope">
        <el-popover
          effect="light"
          trigger="hover"
          placement="top"
          width="auto"
          popper-style="font-size:12px"
        >
          <template #default>
            <div>參數:{{ scope.row.methodParams }}</div>
          </template>
          <template #reference>
            <el-tag v-if="scope.row.methodParams.length <= 30">{{
              scope.row.methodParams
            }}</el-tag>
            <el-tag v-else>{{
              scope.row.methodParams.substring(0, 30) + "..."
            }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="returnValue"
      label="返回值"
      align="center"
    ></el-table-column>
  </el-table>
  <br />
  <!--分頁條---->
  <el-pagination
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagination.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}
</style>
