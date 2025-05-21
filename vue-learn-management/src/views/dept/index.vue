<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  queryALLApi,
  addApi,
  queryByIdApi,
  updateApi,
  deleteByApi,
} from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";

//鉤子函數
onMounted(() => {
  search();
});

const deptList = ref([]);

//查詢
const search = async () => {
  const result = await queryALLApi();
  if (result.code) {
    deptList.value = result.data;
  }
};

//Dialog對話框
const dialogFormVisible = ref(false);
const formTitle = ref("");
const dept = ref({ name: "" });

//新增部門
const addDept = () => {
  dialogFormVisible.value = true;
  formTitle.value = "新增部門";
  dept.value = { name: "" };
};

//保存部門
const save = async () => {
  await deptFormRef.value.validate(async (valid) => {
    if (!valid) return;

    let result;
    if (dept.value.id) {
      //修改
      result = await updateApi(dept.value);
    } else {
      //新增
      result = await addApi(dept.value);
    }
    if (result.code) {
      //成功
      //提示訊息
      ElMessage.success("新增成功");
      //關閉對話框
      dialogFormVisible.value = false;
      //重置表單
      resetForm();
      //重新查詢
      search();
    } else {
      //失敗
      ElMessage.error(result.msg);
    }
  });
};

//表單校驗
const rules = ref({
  name: [
    { required: true, message: "部門名稱是必填", trigger: "blur" },
    { min: 2, max: 10, message: "部門名稱長度須為2-10字", trigger: "blur" },
  ],
});

const deptFormRef = ref();
const resetForm = () => {
  deptFormRef.value.resetFields();
};

//編輯
const edit = async (row) => {
  console.log(`Edit item with ID ${row.id}`);
  formTitle.value = "修改部門";
  dialogFormVisible.value = true;
  dept.value = { name: "" };

  const result = await queryByIdApi(row.id);
  if (result.code) {
    dept.value = result.data;
  }
};

//刪除
const delById = async (row) => {
  ElMessageBox.confirm("確認刪除該部門嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //確認
      const result = await deleteByApi(row.id);
      if (result.code) {
        ElMessage.success("刪除成功");
        search();
      } else {
        ElMessage.error(result.msg);
      }
    })
    .catch(() => {
      //取消
      ElMessage.info("已取消刪除");
    });
};
</script>

<template>
  <h1>部門管理</h1>
  <div class="container">
    <el-button type="primary" @click="addDept"> + 新增部門</el-button>
  </div>
  <!--表格-->
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序號" width="100" align="center" />
      <el-table-column
        prop="name"
        label="部門名稱"
        width="260"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最後操作時間"
        width="300"
        align="center"
      />
      <el-table-column label="操作" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="edit(row)"
            ><el-icon><EditPen /></el-icon>編輯</el-button
          >
          <el-button type="danger" size="small" @click="delById(row)"
            ><el-icon><Delete /></el-icon>刪除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!--Dialog對話框-->

  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部門名稱" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 確認 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0px;
}
</style>
