<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
  queryPageApi,
  addApi,
  queryInfoApi,
  updateApi,
  deleteApi,
} from "@/api/emp";
import { queryALLApi as queryAllDeptApi } from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";

//token
const token = ref("");
//新增/修改-職位數據
const jobs = ref([
  { name: "班導師", value: 1 },
  { name: "講師", value: 2 },
  { name: "學務主任", value: 3 },
  { name: "教務主任", value: 4 },
  { name: "諮詢師", value: 5 },
  { name: "其他", value: 6 },
]);
//新增/修改-性別數據
const gender = ref([
  { name: "男", value: 1 },
  { name: "女", value: 2 },
]);

//部門列表數據
const depts = ref([]);
//搜尋表單對象
const searchEmp = ref({
  name: "",
  gender: "",
  date: [],
  begin: "",
  end: "",
});

//searchEmp的date屬性
watch(
  () => searchEmp.value.date,
  (newval, oldval) => {
    if (newval.length == 2) {
      searchEmp.value.begin = newval[0];
      searchEmp.value.end = newval[1];
    } else {
      searchEmp.value.begin = "";
      searchEmp.value.end = "";
    }
  }
);

//鉤子函數
onMounted(async () => {
  search();
  const result = await queryAllDeptApi();
  if (result.code) {
    depts.value = result.data;
  }

  const loginUser = localStorage.getItem("loginUser");
  if (loginUser) {
    token.value = JSON.parse(loginUser).token;
  }
});

//查詢員工列表
const search = async () => {
  const result = await queryPageApi(
    searchEmp.value.name,
    searchEmp.value.gender,
    searchEmp.value.begin,
    searchEmp.value.end,
    currentPage.value,
    pageSize.value
  );
  if (result.code) {
    empList.value = result.data.list;
    total.value = result.data.total;
  }
};
//清空
const clear = () => {
  searchEmp.value = { name: "", gender: "", date: [], begin: "", end: "" };
  search();
};

//員工列表資料
const empList = ref([]);

//分頁操作
const currentPage = ref(1); //頁碼
const pageSize = ref(10); //每頁展示記錄數
const total = ref(0);

//職位轉換函數
const getJobTitle = (job) => {
  switch (job) {
    case 1:
      return "班導師";
    case 2:
      return "講師";
    case 3:
      return "學務主任";
    case 4:
      return "教務主任";
    case 5:
      return "諮詢師";
    default:
      return "其他";
  }
};

//每頁展示記錄數變化
const handleSizeChange = (val) => {
  search();
};
//頁碼變化時觸發
const handleCurrentChange = (val) => {
  search();
};

//新增員工
const addEmp = () => {
  dialogVisible.value = true;
  dialogTitle.value = "新增員工";
  //刷新欄位
  employee.value = {
    username: "",
    name: "",
    gender: "",
    phone: "",
    job: "",
    salary: "",
    deptId: "",
    entryDate: "",
    image: "",
    exprList: [],
  };
  empFormRef.value.resetFields();
};

//新增/修該表單
//const empFormRef = ref(null);
const employee = ref({
  username: "",
  name: "",
  gender: "",
  phone: "",
  job: "",
  salary: "",
  deptId: "",
  entryDate: "",
  image: "",
  exprList: [],
});

//控制彈窗
const dialogVisible = ref(false);
const dialogTitle = ref("新增員工");

//文件上傳
//圖片上傳成功後觸發
const handleAvatarSuccess = (response) => {
  employee.value.image = response.data;
};
//文件上傳之前觸發
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("只支持上傳圖片");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error("只能上傳10M以內的圖片");
    return false;
  }
  return true;
};

//添加工作經歷
const addExprItem = () => {
  employee.value.exprList.push({
    company: "",
    job: "",
    begin: "",
    end: "",
    exprDate: [],
  });
};
//刪除工作經歷
const delExprItem = (index) => {
  employee.value.exprList.splice(index, 1);
};
//監聽---employee員工對象中的工作經歷訊息
watch(
  () => employee.value.exprList,
  (newVal, oldVal) => {
    if (employee.value.exprList && employee.value.exprList.length > 0) {
      employee.value.exprList.forEach((expr) => {
        expr.begin = expr.exprDate[0];
        expr.end = expr.exprDate[1];
      });
    }
  },
  { deep: true } //深度監聽
);

//保存員工
const save = async () => {
  //表單校驗
  empFormRef.value.validate(async (valid) => {
    if (valid) {
      //通過
      let result;
      if (employee.value.id) {
        //修改
        result = await updateApi(employee.value);
      } else {
        //新增
        result = await addApi(employee.value);
      }
      if (result.code) {
        //成功
        ElMessage.success("保存成功");
        dialogVisible.value = false;
        search();
      } else {
        //失敗
        ElMessage.error(result.msg);
      }
    }
  });
};

//表格引用
const empFormRef = ref();

//表格校驗規則
const rules = ref({
  username: [
    { required: true, message: "請輸入用戶名", trigger: "blur" },
    { min: 8, max: 20, message: "用戶名長度應在8到20之間", trigger: "blur" },
  ],
  name: [
    { required: true, message: "請輸入姓名", trigger: "blur" },
    { min: 2, max: 10, message: "姓名長度在2到10之間", trigger: "blur" },
  ],
  gender: [{ required: true, message: "請輸入性別", trigger: "change" }],
  phone: [
    { required: true, message: "請輸入手機號碼", trigger: "blur" },
    { pattern: /^09\d{8}$/, message: "請輸入有效手機號碼", trigger: "blur" },
  ],
});

//編輯功能
const edit = async (id) => {
  console.log("Edit:", id);

  const result = await queryInfoApi(id);
  if (result.code) {
    dialogVisible.value = true;
    dialogTitle.value = "修改員工";
    employee.value = result.data;

    //對工作經歷進行處理
    let exprList = employee.value.exprList;
    if (exprList && exprList.length > 0) {
      exprList.forEach((expr) => {
        expr.exprDate = [expr.begin, expr.end];
      });
    }
  }
};

//刪除單個員工
const deleteById = async (id) => {
  ElMessageBox.confirm("確認刪除該員工嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //確認
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
      ElMessage.info("已取消刪除");
    });
};

//批量刪除---記錄勾選員工的ID
const selectedIds = ref([]);
//複選框發生變化時觸發 ----selection:當前選中的記錄
const handleSelectionChange = (selection) => {
  const ids = selection.map((item) => item.id);
  selectedIds.value = ids;
};
//批量刪除
const deleteByIds = () => {
  ElMessageBox.confirm("確認刪除該員工嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //確認
      if (selectedIds.value && selectedIds.value.length > 0) {
        const result = await deleteApi(selectedIds.value);
        if (result.code) {
          ElMessage.success("刪除成功");
          search();
        } else {
          ElMessage.error(result.msg);
        }
      } else {
        ElMessage.info("沒有選擇任何要刪除的資料");
      }
    })
    .catch(() => {
      //取消
      ElMessage.info("已取消刪除");
    });
};
</script>

<template>
  <h1>員工管理</h1>
  <!--搜尋欄-->
  <div class="container">
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="請輸入員工姓名" />
      </el-form-item>
      <el-form-item label="性別">
        <el-select v-model="searchEmp.gender" placeholder="請選擇">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入職時間">
        <el-date-picker
          v-model="searchEmp.date"
          type="daterange"
          range-separator="到"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查詢</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--功能按鈕-->>
  <div class="container">
    <el-button type="primary" @click="addEmp">+ 新增員工</el-button>
    <el-button type="success" @click="deleteByIds">- 批量刪除</el-button>
  </div>

  <!--資料展示表格---->
  <div class="container">
    <el-table
      :data="empList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column label="性別" width="120" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column label="頭像" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="40px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="部門"
        width="120"
        align="center"
      />
      <el-table-column prop="job" label="職位" width="120" align="center">
        <template #default="scope">
          {{ getJobTitle(scope.row.job) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="entryDate"
        label="入職日期"
        width="180"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最後操作時間"
        width="200"
        align="center"
      />
      <el-table-column label="操作" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"
            >編輯</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="deleteById(scope.row.id)"
            >刪除</el-button
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!--新增/修改員工對話框-->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      :model="employee"
      :rules="rules"
      ref="empFormRef"
      label-width="80px"
    >
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用戶名" prop="username">
            <el-input
              v-model="employee.username"
              placeholder="請輸入員工姓名"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="employee.name"
              placeholder="請輸入員工姓名"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性別" prop="gender">
            <el-select
              v-model="employee.gender"
              placeholder="請選擇性別"
              style="width: 100%"
            >
              <el-option
                v-for="g in gender"
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
              v-model="employee.phone"
              placeholder="請輸入員工手機號碼"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="職位">
            <el-select
              v-model="employee.job"
              placeholder="請選擇職位"
              style="width: 100%"
            >
              <el-option
                v-for="j in jobs"
                :key="j.value"
                :label="j.name"
                :value="j.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪資">
            <el-input
              v-model="employee.salary"
              placeholder="請輸入員工薪資"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所屬部門">
            <el-select
              v-model="employee.deptId"
              placeholder="請選擇部門"
              style="width: 100%"
            >
              <el-option
                v-for="d in depts"
                :key="d.id"
                :label="d.name"
                :value="d.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入職日期">
            <el-date-picker
              v-model="employee.entryDate"
              type="date"
              style="width: 100%"
              placeholder="選擇日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="頭像">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :headers="{ token: token }"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 工作經歷 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作經歷">
            <el-button type="success" size="small" @click="addExprItem"
              >+ 添加工作經歷</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行 ...  工作經歷 -->
      <el-row :gutter="3" v-for="(expr, index) in employee.exprList">
        <el-col :span="10">
          <el-form-item size="small" label="時間" label-width="80px">
            <el-date-picker
              type="daterange"
              v-model="expr.exprDate"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input
              placeholder="請輸入公司名稱"
              v-model="expr.company"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="職位" label-width="60px">
            <el-input placeholder="請輸入職位" v-model="expr.job"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click="delExprItem(index)"
              >- 刪除</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 10px;
}
.avatar {
  height: 40px;
}
.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  /* 灰色虛擬邊框 */
  border: 1px dashed var(--el-border-color);
}
</style>
