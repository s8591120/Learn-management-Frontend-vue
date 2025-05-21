<script setup>
import { ref, onMounted } from "vue";
import {
  queryPageApi,
  addApi,
  queryInfoApi,
  updateApi,
  deleteApi,
  violationApi,
} from "@/api/student";
import { queryAllApi as queryALLClazzApi } from "@/api/clazz";
import { ElMessage, ElMessageBox } from "element-plus";

//原數據
//班級列表
const clazz = ref([]);
//學歷列表
const degree = ref([
  { name: "國中", value: 1 },
  { name: "高中", value: 2 },
  { name: "專科", value: 3 },
  { name: "大學", value: 4 },
  { name: "碩士", value: 5 },
  { name: "博士", value: 6 },
]);
//是否來自大學列表
const isCollege = ref([
  { name: "是", value: 1 },
  { name: "否", value: 2 },
]);
//性別列表
const genders = ref([
  { name: "男", value: 1 },
  { name: "女", value: 2 },
]);

//對話框
const dialogVisible = ref(false);
const dialogTitle = ref("");

//搜索表單對象
const searchStudent = ref({ name: "", degree: "", clazzId: "" });
//鉤子函數
onMounted(() => {
  search(); //查詢學生
  queryALLClazz(); //查詢班級
});
//查詢班級
const queryALLClazz = async () => {
  const result = await queryALLClazzApi();
  if (result.code) {
    clazz.value = result.data;
  }
};
//查詢學生
const search = async () => {
  const result = await queryPageApi(
    searchStudent.value.name,
    searchStudent.value.degree,
    searchStudent.value.clazzId,
    currentPage.value,
    pageSize.value
  );
  if (result.code) {
    studentList.value = result.data.list;
    total.value = result.data.total;
  }
};
//清空
const clear = async () => {
  searchStudent.value = { name: "", degree: "", clazzId: "" };
  search();
};
//學生列表數據
const studentList = ref([]);
//分頁
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true);
const total = ref(0);
const handleSizeChange = (val) => {
  search();
};
const handleCurrentChange = (val) => {
  search();
};

//新增學生
const addStu = () => {
  dialogVisible.value = true;
  dialogTitle.value = "新增學生";
  student.value = {
    name: "",
    no: "",
    gender: "",
    phone: "",
    idCard: "",
    isCollege: "",
    address: "",
    degree: "",
    graduationDate: "",
    clazzId: "",
  };
  //重置表單校驗提示訊息
  if (stuFormRef.value) {
    stuFormRef.value.resetFields();
  }
};
//新增/修改表單
const student = ref({
  name: "",
  no: "",
  gender: "",
  phone: "",
  idCard: "",
  isCollege: "",
  address: "",
  degree: "",
  graduationDate: "",
  clazzId: "",
});
//保存員工
const save = async () => {
  //表單校驗
  stuFormRef.value.validate(async (valid) => {
    if (valid) {
      //通過
      let result;
      if (student.value.id) {
        //修改
        result = await updateApi(student.value);
      } else {
        //新增
        result = await addApi(student.value);
      }
      if (result.code) {
        ElMessage.success("保存成功");
        dialogVisible.value = false;
        search();
      } else {
        ElMessage.error(result.msg);
      }
    } else {
      ElMessage.error("表單校驗不通過");
    }
  });
};
//表單引用
const stuFormRef = ref();
//表單校驗
const rules = ref({
  name: [
    { required: true, message: "請輸入學員姓名", trigger: "blur" },
    {
      min: 2,
      max: 10,
      message: "學員姓名長度應在2到10個字之間",
      trigger: "blur",
    },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
      message: "學員姓名只能包含漢字或字母",
      trigger: "blur",
    },
  ],
  no: [
    { required: true, message: "請輸入學號", trigger: "blur" },
    { len: 10, message: "學號必須為10位", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]{10}$/,
      message: "學號只能包含數字或字母，且長度為10位",
      trigger: "blur",
    },
  ],
  gender: [{ required: true, message: "請選擇性別", trigger: "change" }],
  phone: [
    { required: true, message: "請輸入手機號碼", trigger: "blur" },
    {
      pattern: /^09\d{8}$/,
      message: "手機號碼格式不正確 (應為09開頭，共10位數字)",
      trigger: "blur",
    },
  ],
  idCard: [
    { required: true, message: "請輸入身份證號", trigger: "blur" },
    {
      pattern: /^[A-Z][12]\d{8}$/,
      message: "身份證號格式不正確 (應為1位大寫字母加9位數字，第二碼為1或2)",
      trigger: "blur",
    },
  ],
  isCollege: [
    { required: true, message: "請選擇是否為院校學員", trigger: "change" },
  ],
  address: [
    // 選填
    {
      min: 0,
      max: 100,
      message: "聯繫地址長度不能超過100個字",
      trigger: "blur",
    },
  ],
  graduationDate: [
    // 選填
    { type: "date", message: "請選擇正確的畢業日期", trigger: "change" },
  ],
});
//修改
const edit = async (id) => {
  const result = await queryInfoApi(id);
  if (result.code) {
    dialogVisible.value = true;
    dialogTitle.value = "修改學生";
    student.value = result.data;
  }
};
//刪除學生
const deleteById = async (id) => {
  ElMessageBox.confirm("你確認要刪除該學生嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await deleteApi(id);
      if (result.code) {
        ElMessage.success("刪除成功");
        search();
      } else {
        ElMessage.error(result.msg);
      }
    })
    .catch(() => {
      //取消
      ElMessage.info("你已取消刪除");
    });
};
//紀錄勾選的學生的ID
const selectedIds = ref([]);
//複選框發生變化時觸發
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id);
};
//批量刪除
const deleteByIds = () => {
  ElMessageBox.confirm("你確認要刪除該學生嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取笑",
    type: "warning",
  })
    .then(async () => {
      if (selectedIds.value && selectedIds.value.length > 0) {
        const result = await deleteApi(selectedIds.value);
        if (result.code) {
          ElMessage.success("刪除成功");
          search();
        } else {
          ElMessage.error(result.msg);
        }
      } else {
        ElMessage.info("請勾選要刪除的對象");
      }
    })
    .catch(() => {
      //取消
      ElMessage.info("你已取消刪除");
    });
};
//違規
const violation = (id) => {
  ElMessageBox.prompt("請輸入違規扣分", "提示", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    inputPattern: /^\d+$/,
    inputErrorMessage: "資料無效",
  }).then(async (val) => {
    let result = await violationApi(id, val.value);
    if (result.code) {
      ElMessage.success("處理成功");
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};
</script>

<template>
  <h1>學生管理</h1>
  <!--搜索欄-->
  <div class="container">
    <el-form :inline="true" :model="searchStudent" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchStudent.name" placeholder="請輸入姓名" />
      </el-form-item>
      <el-form-item label="最高學歷">
        <el-select v-model="searchStudent.degree" placeholder="請選擇">
          <el-option
            v-for="d in degree"
            :key="d.value"
            :label="d.name"
            :value="d.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所屬班級">
        <el-select v-model="searchStudent.clazzId" placeholder="請選擇">
          <el-option
            v-for="c in clazz"
            :key="c.id"
            :label="c.name"
            :value="c.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查詢</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--功能按鈕-->>
  <div class="container">
    <el-button type="primary" @click="addStu">+ 新增學生</el-button>
    <el-button type="success" @click="deleteByIds">- 批量刪除</el-button>
  </div>

  <!--資料展示表格---->
  <div class="container">
    <el-table
      :data="studentList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" width="120" align="center" />
      <el-table-column prop="no" label="學號" width="150" align="center" />
      <el-table-column
        prop="clazzName"
        label="班級"
        width="260"
        align="center"
      />
      <el-table-column label="性別" width="100" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手機號碼"
        width="120"
        align="center"
      />
      <el-table-column
        prop="degree"
        label="最高學歷"
        width="120"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.degree == 1">國中</span>
          <span v-else-if="scope.row.degree == 2">高中</span>
          <span v-else-if="scope.row.degree == 3">專科</span>
          <span v-else-if="scope.row.degree == 4">大學</span>
          <span v-else-if="scope.row.degree == 5">碩士</span>
          <span v-else>博士</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="violationCount"
        label="違規次數"
        width="130"
        align="center"
      />
      <el-table-column
        prop="violationScore"
        label="違規扣分"
        width="100"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最後操作時間"
        width="200"
        align="center"
      />
      <el-table-column label="操作" width="290" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"
            ><el-icon><EditPen /></el-icon>編輯</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="violation(scope.row.id)"
            ><el-icon><EditPen /></el-icon>違規</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="deleteById(scope.row.id)"
            ><el-icon><Delete /></el-icon>刪除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!--分頁條-->
  <div class="container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 50, 75, 100]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!--新增/修改員工對話框-->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="70%"
    :close-on-click-modal="false"
    class="student-dialog"
  >
    <el-form
      :model="student"
      :rules="rules"
      ref="stuFormRef"
      label-width="120px"
      :label-position="'right'"
      class="student-form"
    >
      <!-- 第一行：基本資訊 -->
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="student.name"
              placeholder="請輸入姓名"
              size="default"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="學號" prop="no">
            <el-input
              v-model="student.no"
              placeholder="請輸入學號"
              size="default"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：性別與聯絡方式 -->
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="性別" prop="gender">
            <el-select
              v-model="student.gender"
              placeholder="請選擇性別"
              style="width: 100%"
              size="default"
            >
              <el-option
                v-for="g in genders"
                :key="g.value"
                :label="g.name"
                :value="g.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手機號碼" prop="phone">
            <el-input
              v-model="student.phone"
              placeholder="請輸入手機號碼"
              size="default"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：身分證與來源 -->
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="身分證號碼" prop="idCard">
            <el-input
              v-model="student.idCard"
              placeholder="請輸入身分證號碼"
              size="default"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否來自大學" prop="isCollege">
            <el-select
              v-model="student.isCollege"
              placeholder="請選擇"
              style="width: 100%"
              size="default"
            >
              <el-option
                v-for="i in isCollege"
                :key="i.value"
                :label="i.name"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：地址 -->
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="聯絡地址" prop="address">
            <el-input
              v-model="student.address"
              placeholder="請輸入聯絡地址"
              size="default"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行：學歷與時間 -->
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="最高學歷" prop="degree">
            <el-select
              v-model="student.degree"
              style="width: 100%"
              placeholder="請選擇學歷"
              size="default"
            >
              <el-option
                v-for="d in degree"
                :key="d.value"
                :label="d.name"
                :value="d.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="畢業時間" prop="graduationDate">
            <el-date-picker
              v-model="student.graduationDate"
              type="date"
              style="width: 100%"
              placeholder="請選擇畢業時間"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size="default"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第六行：班級 -->
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="所屬班級" prop="clazzId">
            <el-select
              v-model="student.clazzId"
              placeholder="請選擇班級"
              style="width: 100%"
              size="default"
            >
              <el-option
                v-for="c in clazz"
                :key="c.id"
                :label="c.name"
                :value="c.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer" style="text-align: center; padding: 20px 0">
        <el-button @click="dialogVisible = false" size="default"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="save"
          size="default"
          style="margin-left: 20px"
        >
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0px;
}

.student-dialog {
  .el-dialog__body {
    padding: 30px 40px;
  }
}
.student-form {
  .el-form-item {
    margin-bottom: 25px;
  }

  .el-form-item__label {
    white-space: nowrap;
    font-weight: 500;
    color: #606266;
  }

  .el-input,
  .el-select {
    font-size: 14px;
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .student-dialog .el-dialog {
    width: 90% !important;
    margin: 5vh auto;
  }

  .student-form {
    label-width: 100px;
  }
}
</style>
