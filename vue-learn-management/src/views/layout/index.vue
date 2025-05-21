<script setup>
import {
  Avatar,
  Document,
  HelpFilled,
  Histogram,
  HomeFilled,
  InfoFilled,
  Menu,
  Promotion,
  Share,
  Tools,
  UserFilled,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

//當前登錄的員工
const loginName = ref("");
let router = useRoute();
//鉤子函數
onMounted(() => {
  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  if (loginUser) {
    loginName.value = loginUser.name;
  }
});

//退出登錄
const logout = () => {
  ElMessageBox.confirm("確認退出登錄嗎?", "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //確認
      ElMessage.success("退出成功");
      localStorage.removeItem("loginUser");
      //跳轉頁面
      router.push("/login");
    })
    .catch(() => {
      //取消
      ElMessage.info("已取消退出");
    });
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 區域 -->
      <el-header class="header">
        <span class="title">數位學習後台系統</span>
        <span class="right_tool">
          <a href="">
            <el-icon><EditPen /></el-icon> 修改密碼 &nbsp;&nbsp;&nbsp; |
            &nbsp;&nbsp;&nbsp;
          </a>
          <a href="javascript:;" @click="logout">
            <el-icon><SwitchButton /></el-icon> 退出登錄【{{ loginName }}】
          </a>
        </span>
      </el-header>

      <el-container>
        <!-- 左菜单 -->
        <el-aside width="200px" class="aside">
          <el-menu router>
            <!--首頁-->
            <el-menu-item index="/index">
              <el-icon><Promotion /></el-icon> 首頁
            </el-menu-item>

            <!--班級管理菜單-->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon><Menu /></el-icon>班級學生管理
              </template>
              <el-menu-item index="/clazz">
                <el-icon><HomeFilled /></el-icon>班級管理
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon><UserFilled /></el-icon>學生管理
              </el-menu-item>
            </el-sub-menu>

            <!--系統信息管理-->
            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Tools /></el-icon>系統信息管理
              </template>
              <el-menu-item index="/dept">
                <el-icon><HelpFilled /></el-icon>部門管理
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon><Avatar /></el-icon>員工管理
              </el-menu-item>
            </el-sub-menu>

            <!--數據統計管理-->
            <el-sub-menu index="/report">
              <template #title>
                <el-icon><Histogram /></el-icon>數據統計管理
              </template>
              <el-menu-item index="/empReport">
                <el-icon><InfoFilled /></el-icon>員工信息管理
              </el-menu-item>
              <el-menu-item index="/stuReport">
                <el-icon><Share /></el-icon>學生信息管理
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon><Document /></el-icon>日誌信息管理
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(
    to right,
    #00547d,
    #007fa4,
    #00aaa0,
    #00d072,
    #a8eb12
  );
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 95vh; /* 讓高度填滿整個視窗 */
}

.main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
