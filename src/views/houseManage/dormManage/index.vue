<template>
  <div class="app-container">
    <div class="tabs-group">
      <el-radio-group v-model="activeName" @change="changeRadio" size="small">
        <el-radio-button size="mini" label="1">宿舍楼栋</el-radio-button>
        <el-radio-button size="mini" label="2">入住学生</el-radio-button>
        <el-radio-button size="mini" label="3">楼栋管理员</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <keep-alive > -->
      <component :is="currentTabComponent"></component>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import dormList from "./components/dormList";
import dormManageList from "./components/dormManageList";
import studentList from "./components/studentList";
export default {
  name: "dormManage",
  // mixins: [dormList,dormManageList,studentList],
  data() {
    return {
      activeName: "1",
      currentTabComponent: "dormList",
    };
  },
  components: {
    dormList,
    dormManageList,
    studentList,
  },
  methods: {
    /// 切换导航
    changeRadio(val) {
      if (val === "1") {
        this.currentTabComponent = "dormList";
      } else if (val === "2") {
        this.currentTabComponent = "studentList";
      } else if (val === "3") {
        this.currentTabComponent = "dormManageList";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sub-nav {
  /deep/.el-tabs__nav .is-top {
    background-color: transparent;
  }
  /deep/.el-tabs__active-bar {
    background-color: #409eff !important;
  }
}
/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  box-shadow: -1px 0 0 0 #b3d8ff;
}
/deep/ .el-radio-button__inner {
  font-size: 14px;
}
.tabs-group {
  padding: 5px 16px;
  border-bottom: 1px solid #e4e7ed;
}
.app-container1 {
  height: calc(100% - 43px);
}
</style>
