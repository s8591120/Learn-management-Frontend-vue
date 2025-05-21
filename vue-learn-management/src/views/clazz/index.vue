<script setup>
import { ref, watch, onMounted } from "vue";
import {
  queryPageApi,
  addApi,
  queryInfoApi,
  updateApi,
  deleteApi,
} from "@/api/clazz";
import { queryAllApi as querAllempapi } from "@/api/emp";
import { ElMessage, ElMessageBox } from "element-plus";

//數據
//學科列表數據
const subject = ref([
  { name: "Java", value: 1 },
  { name: "前端", value: 2 },
  { name: "大數據", value: 3 },
  { name: "Python", value: 4 },
  { name: "Go", value: 5 },
  { name: "嵌入式", value: 6 },
]);
//員工列表數據
const emps = ref([]);

//搜索表單對象
const searchclazz = ref({ name: "", date: [], begin: "", end: "" });

//偵聽
watch(
  () => searchclazz.value.date,
  (newVal, oldVal) => {
    if (newVal.length == 2) {
      searchclazz.value.begin = newVal[0];
      searchclazz.value.end = newVal[1];
    } else {
      searchclazz.value.begin = "";
      searchclazz.value.end = "";
    }
  }
);
//鉤子函數
onMounted(async () => {
  search(); //查詢班級數據
  //查詢員工數據
  const result = await querAllempapi();
  if (result.code) {
    emps.value = result.data;
  }
});

//查詢班級列表
const search = async () => {
  const result = await queryPageApi(
    searchclazz.value.name,
    searchclazz.value.begin,
    searchclazz.value.end,
    currentPage.value,
    pageSize.value
  );
  if (result.code) {
    clazzList.value = result.data.list;
    total.value = result.data.total;
  }
};
//清空
const clear = async () => {
  searchclazz.value = { name: "", date: [], begin: "", end: "" };
  search();
};
//班級列表資料
const clazzList = ref([]);

//分頁
const currentPage = ref(1); //頁碼
const pageSize = ref(10); //每頁記錄數
const background = ref(true); //背景色
const total = ref(0); //總紀錄數
const handleSizeChange = (val) => {
  search();
};
const handleCurrentChange = (val) => {
  search();
};

//新增班級
const addClazz = () => {
  dialogVisible.value = true;
  dialogTitle.value = "新增班級";
  clazz.value = {
    name: "",
    room: "",
    beginDate: "",
    endDate: "",
    masterId: "",
    subject: "",
  };
  //重製表單提示訊息
  if (clazzFormRef.value) {
    clazzFormRef.value.resetFields();
  }
};

//新增/修改表單
const clazz = ref({
  name: "",
  room: "",
  beginDate: "",
  endDate: "",
  masterId: "",
  subject: "",
});
//控制彈窗
const dialogVisible = ref(false);
const dialogTitle = ref("新增班級");

//保存班級
const save = async () => {
  //表單校驗
  if (!clazzFormRef.value) return;
  clazzFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (clazz.value.id) {
        //修改
        result = await updateApi(clazz.value);
      } else {
        //新增
        result = await addApi(clazz.value);
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
const clazzFormRef = ref();

//表單校驗
const rules = ref({
  name: [
    { required: true, message: "請輸入正確的班級名稱", trigger: "blur" },
    {
      min: 4,
      max: 30,
      message: "班級名稱長度在4到30個字之間",
      trigger: "blur",
    },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
      message: "班級名稱只能包含中文、英文或數字",
      trigger: "blur",
    },
  ],
  room: [
    {
      min: 1,
      max: 20,
      message: "教室長度在 1 到 20 個字之間",
      trigger: "blur",
    },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
      message: "教室名稱只能包含中文、英文或數字",
      trigger: "blur",
    },
  ],
  beginDate: [{ required: true, message: "請選擇開課日期", trigger: "change" }],
  endDate: [{ required: true, message: "請選擇結課日期", trigger: "change" }],
  subject: [{ required: true, message: "請選擇學科", trigger: "change" }],
});

//編輯
const edit = async (id) => {
  const result = await queryInfoApi(id);
  if (result.code) {
    dialogVisible.value = true;
    dialogTitle.value = "修改班級";
    clazz.value = result.data;
  }
};
//刪除
const deleteById = async (id) => {
  //確認框
  ElMessageBox.confirm("你確認要刪除該班級嗎?", "提示", {
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
      ElMessage.info("你已取消刪除");
    });
};
</script>

<template>
  <h1>班級管理</h1>
  <!--搜索欄-->
  <div class="container">
    <el-form :inline="true" :model="searchclazz" class="demo-form-inline">
      <el-form-item label="班級名稱">
        <el-input v-model="searchclazz.name" placeholder="請輸入班級名稱" />
      </el-form-item>

      <el-form-item label="結課時間">
        <el-date-picker
          v-model="searchclazz.date"
          type="daterange"
          range-separator="到"
          start-placeholder="開始時間"
          end-placeholder="結束時間"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查詢</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--功能按鈕-->
  <div class="container">
    <el-button type="primary" @click="addClazz">+ 新增班級</el-button>
  </div>
  <!--資料展示-->
  <div class="container">
    <el-table :data="clazzList" border style="width: 100%">
      <el-table-column type="index" label="序號" width="120" align="center" />
      <el-table-column
        prop="name"
        label="班級名稱"
        width="180"
        align="center"
      />
      <el-table-column
        prop="room"
        label="班級教室"
        width="120"
        align="center"
      />
      <el-table-column
        prop="masterName"
        label="班主任"
        width="120"
        align="center"
      />
      <el-table-column
        prop="beginDate"
        label="開課時間"
        width="120"
        align="center"
      />
      <el-table-column
        prop="endDate"
        label="結課時間"
        width="120"
        align="center"
      />
      <el-table-column prop="status" label="狀態" width="120" align="center" />
      <el-table-column
        prop="updateTime"
        label="最後操作時間"
        width="180"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"
            ><el-icon><EditPen /></el-icon>編輯</el-button
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
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 50, 75, 100]"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <!--新增/修改班級頁面-->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      :model="clazz"
      :rules="rules"
      ref="clazzFormRef"
      label-width="80px"
    >
      <!-- 基本信息 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="班級名稱" prop="name">
            <el-input
              v-model="clazz.name"
              placeholder="請輸入班級名稱"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="班級教室" prop="room">
            <el-input
              v-model="clazz.room"
              placeholder="請輸入班級教室"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="開課時間" prop="beginDate">
            <el-date-picker
              v-model="clazz.beginDate"
              type="date"
              placeholder="請選擇開課時間"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="結課時間" prop="endDate">
            <el-date-picker
              v-model="clazz.endDate"
              type="date"
              placeholder="請選擇結課時間"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="班主任">
            <el-select
              v-model="clazz.masterId"
              placeholder="請選擇班主任"
              style="width: 100%"
            >
              <el-option
                v-for="e in emps"
                :key="e.id"
                :label="e.name"
                :value="e.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="學科" prop="subject">
            <el-select
              v-model="clazz.subject"
              placeholder="請選擇"
              style="width: 100%"
            >
              <el-option
                v-for="s in subject"
                :key="s.value"
                :label="s.name"
                :value="s.value"
              ></el-option>
            </el-select>
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
  margin: 10px 0px;
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
