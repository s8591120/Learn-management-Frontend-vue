<script setup>
import { queryEmpJobDataApi, queryEmpGenderDataApi } from "@/api/report";
import * as echarts from "echarts";
import { onMounted } from "vue";

//鉤子函數
onMounted(() => {
  loadJobChart();
  loadGenderChart();
});
//職位統計報表
const loadJobChart = async () => {
  let result = await queryEmpJobDataApi();
  let jobList = result.data.jobList;
  let dataList = result.data.dataList;

  initJobChart(jobList, dataList);
};

//性別統計報表
const loadGenderChart = async () => {
  let result = await queryEmpGenderDataApi();
  console.log("性別資料:", result.data);
  const formattedData = result.data.map((item) => {
    return {
      name: item.gender,
      value: item.value,
    };
  });
  console.log("格式化後的資料:", formattedData);
  initGenderChart(formattedData);
};

function initJobChart(jobList, dataList) {
  var myChart = echarts.init(document.getElementById("container1"));
  myChart.setOption({
    title: {
      text: "員工職位統計",
      subText: "",
      textStyle: {
        fontSize: 20,
      },
      left: "center",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {},
    xAxis: {
      data: jobList,
    },
    yAxis: {},
    series: [
      {
        name: "人数",
        type: "bar",
        data: dataList,
        itemStyle: {
          // 設置柱狀漸變色
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 0,
              color: "#ffbf61",
            },
            {
              offset: 1,
              color: "#dd5f85",
            },
          ]),
        },
      },
    ],
  });
}

function initGenderChart(genderDataList) {
  var myChart = echarts.init(document.getElementById("container2"));
  let option = {
    title: {
      text: "員工性別統計",
      subText: "",
      textStyle: {
        fontSize: 20,
      },
      left: "center",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "10%",
      left: "center",
    },
    series: [
      {
        name: "性別",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        top: "5%",
        itemStyle: {
          borderRadius: 5,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        data: genderDataList,
      },
    ],
  };
  // 繪製圖表
  myChart.setOption(option);
}
</script>

<template>
  <div class="report_container" id="container1"></div>
  <div class="report_container" id="container2"></div>
</template>

<style scoped>
.report_container {
  width: 49%;
  height: 90%;
  float: left;
  margin-left: 5px;
}

#container1 {
  border-right: 1px dashed #ccc;
}
</style>
