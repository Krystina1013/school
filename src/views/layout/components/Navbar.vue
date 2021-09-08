<template>
  <div class="header">
    <div class="yishi-header">
      <div class="header-left">
        <!-- <img class="logo" src="../../../assets/logo.png" alt /> -->
        <div class="header-title-hint">
          <img class='school-log' src="../../../assets/school-log.png" alt />
          <p class="header-title">{{ buildName }}</p>
          <!-- <p class="header-hint">南风云智安管理系统</p> -->
        </div>
      </div>
      <div class="header-left header-right">
        <div class="menu-item" @click="alarmBtn">
          <el-badge :value="warningCount">
            <i class="iconfont icon-yujing"></i>
          </el-badge>
          未读预警
        </div>

        <div class="service">
          <!-- <el-popover placement="bottom" title="" width="110" trigger="click">
            <p><i class="el-icon-phone-outline" style="margin-right:10px"></i>1783897683</p>
            <el-button slot="reference" type="text">联系我们</el-button>
          </el-popover> -->
          <el-tooltip class="item" effect="dark" placement="bottom">
            <p slot="content"><i class="el-icon-phone-outline" style="margin-right:10px"></i>1783897683</p>
            <el-button type="text">联系我们</el-button>
          </el-tooltip>
        </div>

        <div class="icon-con">
          <i class="iconfont icon-yonghu"></i>
        </div>
        <p class="user-name">{{ name }}</p>

        <!-- <p class="feedback" @click="dialogObj.dialogState = true">
          <i class="iconfont icon-yijian"></i>修改密码
        </p> -->

        <p class="logout" @click="logout">
          <i class="iconfont icon-tuichu2"></i>退出登录
        </p>
      </div>
    </div>
    <!-- <p class="line"></p> -->
    <!-- <el-menu class="navbar" mode="horizontal" style="border:none;">
      <p class="style-line"></p>
      <p class="style-line style-lineA"></p>
      <p class="style-line style-lineB"></p>
      <p class="style-line style-lineC"></p>
      <breadcrumb></breadcrumb>
    </el-menu> -->
    <eidit-password :dialogObj="dialogObj" />
    <!-- 
    <el-dialog
      title="使用建议"
      :visible.sync="dialogVisible"
      width="402px"
      :before-close="handleClose"
    >
      <el-form
        ref="feedFrom"
        :model="feedbackFrom"
        label-width="82px"
        :rules="rules"
      >
        <el-form-item label="意见反馈: " prop="content">
          <el-input
            type="textarea"
            :rows="8"
            v-model="feedbackFrom.content"
          ></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitFeedback">提 交</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import { clearCookie } from "@/utils/cookie";
import { Getter } from "vuex-class";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import { getScene } from "@/api/screenApi.ts";
import { alertUnRead } from "@/api/alarmApi.ts"; //获取目标访客受访人信息
import { feedback } from "@/api/user.ts";
import store from "@/store";
import eiditPassword from "../../login/components/edit-password.vue";

@Component({
  components: {
    Breadcrumb,
    eiditPassword,
  },
  computed: {
    warningCount() {
      return store.getters.warningCount;
    },
  },
})
export default class Navbar extends Vue {
  @Getter("name") name: string;
  @Getter("buildName") buildName: string;
  @Getter("permissionList") permissionList: Array<string>;

  sceneForm: object = {
    pics: [1],
  };
  private dialogVisible: Boolean = false;
  private feedbackFrom: Object = { content: "" };
  private alarm: Boolean = false;
  timeOut: any = null;
  private rules: Object = {
    // 表单验证
    content: [{ required: true, message: "请输入反馈意见", trigger: "blur" }],
  };
  dialogObj: any = {
    dialogState: false,
    isUpdate: true,
  };
  routeChange() {
    const whiteList = ["moduleLook", "moduleUpdate"];
    for (const item of whiteList) {
      this.alarm = this.permissionList.includes(item);
      if (this.permissionList.includes(item)) {
        this.alarm = true;
        return;
      }
      this.alarm = false;
    }
  }

  alarmBtn() {
    if (this.$route.path === "/security/alarm") {
      return;
    }
    this.routeChange();
    if (this.alarm) {
      this.$router.push({ path: "/security/alarm" });
    } else {
      this.$message.error("您没有权限！");
    }
  }

  created() {
    this.routeChange();
    getScene().then((res) => {
      this.sceneForm = Object.assign({}, res.data.data);
      this.$store.commit("SET_BUILDNAME", res.data.data.name);
    });
  }

  logout() {
    this.$router.push({ path: "/login" });
    clearCookie();
    location.reload(); // 为了重新实例化vue-router对象 避免bug
  }

  async getUnchecedCount() {
    /** @description 未读警报信息 */
    this.$store.dispatch("GET_WARNING");
  }

  submitFeedback() {
    /**@description 提交反馈
     */
    this.$refs["feedFrom"]["validate"]((valid) => {
      if (valid) {
        feedback(this.feedbackFrom).then((res) => {
          this.$message({
            showClose: true,
            message: "反馈意见成功",
            type: "success",
          });
          this.handleClose();
        });
      }
    });
  }

  handleClose() {
    this.dialogVisible = false;
    this.feedbackFrom["content"] = "";
  }
}
</script>

<style lang="scss">
.service {
  .el-button--text {
    color: #fff !important;
    font-size: 15px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$FFDeg: -45deg;
$transSS: $FFDeg, rgba(0, 160, 140, 0.75), rgba(30, 40, 129, 0.75);
$colorFF: #fff;

p {
  margin: 0;
  padding: 0;
}
.header {
  background: #313640;
  color: #fff;
  border-bottom: 1px solid #3e434d;
}

.yishi-header {
  height: 50px;
  // padding: 6px 30px 0;\

  padding-left: 40px;
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
}
.header-left {
  display: flex;
  align-items: center;
  // border: 1px solid red;

  .header-title-hint {
    // width: 244px;
    height: 80px;
    position: relative;
    // border: solid 1px #e6e6e6;
    padding: 0px 30px;
    padding-left: 0;
  }
}
.logo {
  height: 50px;
}
.header-title {
  // font-size: 24px;
  font-size: 18px;
  font-weight: bold;
  // margin-top: 32px;
  margin-top: 28px;
  display: inline-block;
}

.header-hint {
  font-size: 16px;
  // position: absolute;
  // bottom: 3px;
  // right: -68px;
  white-space: nowrap;
}

.menu-item {
  cursor: pointer;
  margin-right: 60px;
  /deep/.el-badge {
    .el-badge__content.is-fixed {
      right: -67px;
    }
  }
}

.iconfont.icon-jingbao {
  font-size: 26px;
}

.iconfont.icon-icon-user {
  padding: 2px;
  font-size: 14px;
  // color: black;
  color: $colorFF;
  // background: rgb(235, 137, 27);
  border: 1px solid $colorFF;
  border-radius: 50%;
  margin-right: 5px;
  margin-left: 20px;
  font-weight: bold;
}

.user-name {
  font-size: 15px;
  color: $colorFF;
}

.iconfont.icon-tuichu2,
.icon-yijian {
  font-size: 18px;
  // color: black;
  color: $colorFF;

  font-weight: bold;
  margin: 4px;
}
.logout {
  margin-left: 20px;
  text-align: center;
  font-size: 15px;
  color: #606266;
  cursor: pointer;
}
// .logout:hover {
//   font-weight: bold;
//   color: rgb(235, 137, 27);
//   cursor: pointer;
// }

.feedback {
  margin-left: 20px;
  text-align: center;
  font-size: 15px;
  // text-decoration: underline;
  // color: #409eff;
  color: $colorFF;
  cursor: pointer;
}
.navbar {
  height: 40px;
  line-height: 30px;
  margin: 0 20px;
  border-radius: 0px !important;
  display: flex;
  align-items: flex-end;
  .style-line {
    height: 30px;
    width: 2px;
    margin-bottom: 8px;
    margin-right: 2px;
    background: RGB(86, 97, 161);
  }
  .style-lineA {
    height: 23px;
    background: RGB(78, 128, 164);
  }
  .style-lineB {
    height: 16px;
    background: RGB(71, 154, 166);
  }
  .style-lineC {
    height: 10px;
    background: RGB(64, 182, 168);
  }
}
.icon-yujing {
  margin-right: 3px;
  vertical-align: top;
}
.service {
  margin-right: 20px;
  vertical-align: top;
}
.icon-con {
  margin-right: 3px;
  vertical-align: top;
}
.school-log {
  width: 23px;
  height: 23px;
  vertical-align: bottom;
  margin-bottom: 3px;
  margin-right: 5px;
}
</style>
