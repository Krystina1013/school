<template>
  <div class="commonDialogContainer">
    <el-dialog
      append-to-body
      :class="className"
      :width="width"
      :title="title"
      :visible.sync="visible"
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
    >
      <!-- :before-close="handleDialogClose" -->
      <slot name="dialogContent"></slot>
      <div v-if="!hiddenFooter" slot="footer" class="dialog-footer">
        <template v-if="showPersonDetail">
          <!-- <button
            class="submit-btn"
            @click="$emit('facialFeature')"
            style="margin-left: 20px;"
          >
            <slot name="button">人脸特征信息</slot>
          </button> -->
         <!--  <el-dropdown @command="handleAddToPortraitLibrary" v-if="!hiddenAddToPortraitLibrary &&!hiddenHandleBtn">
            <button
              class="submit-btn"
              style="margin-left: 20px;"
            >
              <slot name="button">加入人像库<i class="el-icon-arrow-down el-icon--right"></i></slot>
            </button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">关注人员</el-dropdown-item>
              <el-dropdown-item :command="2">身份库</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          
          <button
          v-if="!hiddenAddToArrangeControl&&!hiddenHandleBtn"
            class="submit-btn"
            @click="$emit('addToArrangeControl')"
            style="margin-left: 20px;"
          >
            <slot name="button">布控</slot>
          </button>
          <button class="submit-btn" @click="$emit('trackSearch')" style="margin-left: 20px;" v-if='!hiddenHandleBtn'>
            <slot name="button">轨迹搜索</slot>
          </button>
          <button
            v-if="!hiddenHistoryAlarm"
            class="submit-btn"
            @click="$emit('historyAlarm')"
            style="margin-left: 20px;"
          >
            <slot name="button">历史告警</slot>
          </button> -->
          <button
            class="submit-btn"
            @click="$emit('humanCharacteristics')"
            style="margin-left: 20px;"
          >
            <slot name="button">人体特征</slot>
          </button>
          <button
            class="submit-btn"
            @click="$emit('viewVideo')"
            style="margin-left: 20px;"
            v-show="!showVideo"
          >
            <slot name="button">查看视频</slot>
          </button>
          <!-- <button
            class="submit-btn"
            @click="$emit('viewImg')"
            style="margin-left: 20px;"
            v-show="showVideo"
          >
            <slot name="button">查看全景图</slot>
          </button> -->
        </template>
        <button v-if="showPrevious" class="submit-btn" @click="handlePrevious">
          <slot name="button">上一步</slot>
        </button>
        <button
          v-if="showNext"
          class="submit-btn"
          @click="handleNext"
          style="vertical-align: 2px;margin-left: 20px"
        >
          <slot name="button">下一步</slot>
        </button>
        <button
          v-if="showSubmit"
          class="submit-btn"
          @click="handleSubmit"
          style="margin-left: 20px;"
        >
          <slot name="button">保存</slot>
        </button>
        <!-- <el-button
          type="primary"
          ref="saveBtn"
          v-if="showSubmit"
          @click="handleSubmit"
          :loading="saveBtnLoading"
        >{{saveBtnText}}</el-button>-->
        <button
          v-if="showConfirm"
          class="submit-btn"
          @click="handleConfirm"
          style="margin-left: 20px;"
        >
          <slot name="button">确定</slot>
        </button>
        <button
          v-if="showCancel"
          class="cancel"
          @click="handleDialogClose"
          style="margin-left: 20px;"
        >
          <slot name="button">取消</slot>
        </button>
        <button
          style="margin-left: 20px;"
          v-if="showClose"
          class="close-btn"
          @click="handleDialogClose"
        >
          <slot name="button">关闭</slot>
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CommonDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showVideo: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: ""
    },
    showPrevious: {
      default: false
    },
    showNext: {
      default: false
    },
    showSubmit: {
      default: false
    },
    showCancel: {
      default: false
    },
    showClose: {
      default: false
    },
    showConfirm: {
      default: false
    },
    showPersonDetail: {
      default: false
    },
    hiddenHistoryAlarm: {
      default: false
    },
    hiddenHandleBtn: {
      default: false
    },
    hiddenAddToPortraitLibrary: {
      default: false
    },
    hiddenAddToArrangeControl: {
      default: false
    },
    hiddenFooter: {
      default: false
    }
  },
  data() {
    return {
      // saveBtnText: "保存",
      // saveBtnLoading: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        // this.saveBtnText = "保存";
        // this.saveBtnLoading = false;
      }
    }
  },
  methods: {
    handleAddToPortraitLibrary(isAttention){
      this.$emit("addToPortraitLibrary",isAttention)
    },
    handlePrevious() {
      this.$emit("previous");
    },
    handleNext() {
      this.$emit("next");
    },
    handleSubmit(obj, e) {
      // this.saveBtnText="加载中";
      // this.saveBtnLoading=true;
      this.$emit("submit");
    },
    handleDialogClose() {
      this.$emit("close");
    },
    handleConfirm() {
      this.$emit("confirm");
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog {
  background:#ffffff;
  color:#333;
  .el-textarea {
    width: calc(100%);
  }
  .el-input {
    width: calc(100%);
  }
  .el-select {
    width: calc(100%);
    .el-input {
      width: 100%;
    }
  }
  .submit-btn,
  .close-btn {
    background: #3c72c9;
  }
  .cancel {
    background: #34486a;
  }
// .el-tabs {
//   height: 100%;
// }
.el-dialog__body {
  color: #333;
  background: #fff;
  border-radius: 5px !important;
  padding: 20px;
}
.btnContent {
  width: 100%;
  height: 35px;
  position: absolute;
  left: 0;
  bottom: 6px;
  box-sizing: border-box;
  text-align: center;
}
.el-button {
  font-size: 13px;
}
.el-dialog__body .el-button--primary {
  border: none;
  padding: 7px 22px;
}
// .el-tabs--left, .el-tabs--right {
//   overflow: hidden;
//   margin-top: -79px;
//   margin-left: -60px;
//   border-radius: 5px;
// }
// .el-tabs__content {
//   overflow: hidden;
//   position: absolute;
//   top: 50px;
//   left: 0;
//   height: 90%;
//   width: 100%;
// }
// .el-tabs__item {
//   background: #28497c;
//   margin-bottom: 3px;
//   color: #fff !important;
//   -webkit-writing-mode: vertical-rl;
//   -ms-writing-mode: tb-rl;
//   writing-mode: vertical-rl;
//   width: 20px;
//   padding: 20px 20px;
//   height: auto;
//   border-bottom-left-radius: 7px;
//   border-top-left-radius: 7px;
//   line-height: 0;
// }
// .el-tabs__item.is-active {
//   color: #fff !important;
//   background: #5f8dcb;
// }
// .el-tabs__item:hover {
//   color: #d78c16 !important;
//   cursor: pointer;
// }
// .el-tabs__nav-wrap::after {
//    background: none;
// }
// .el-dialog__header span {
//   display: block;
//   margin: 0 auto;
//   letter-spacing: 4px;
// }
// .el-tabs__active-bar {
//   background-color: transparent;
// }
.el-dialog__header {
  background: #fff;
  color:#333;
  border-bottom: 1px solid #efefef;
  padding: 10px 20px 10px !important;
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #333;
}
.el-dialog__headerbtn {
  position: absolute;
  top: 9px;
  right: 7px;
  font-size: 20px;
  .el-dialog__close {
    color: #333;
  }
}
.save-button {
  background: #3c72c9;
}
.cancel-button {
  background: #34486a;
}
// .el-dialog__header {
//   padding: 9.2px 20px;
//   background: #efeff3;
//   .el-dialog__title {
//     color: #333333;
//     font-size: 14px;
//     font-weight: 600;
//     line-height: 20px;
//   }
//   .el-dialog__headerbtn {
//     top: 6px;
//     right: 16px;
//     font-size: 18px;
//     border-radius: 50%;
//     padding: 4px 5px 3px;
//     display: inline-block;
//     .el-dialog__close {
//       color: #666;
//     }
//   }
//   .el-dialog__headerbtn:hover {
//     background: #fff;
//   }
// }
// .el-dialog__body {
//   padding: 30px 20px;
// }
.el-dialog__footer {
  // height: 50px;
  // line-height: 50px;
  padding: 0px 20px 20px 20px;
  text-align: center;
  // background: #f8f8fa;
}
}
</style>

<style scoped lang="scss">
::v-deep {
  .el-button--primary {
    padding: 7px 18px;
    line-height: inherit;
    border: none;
    background-color: #3c72c9;
  }
}
</style>
