<template>
  <div>
    <el-dialog class="newDialog" title="学生人员详情" :visible.sync="selfVisible" width="900px" top="10vh" :before-close="closeDialog" :close-on-click-modal="false">
      <el-row :gutter="0" class="studentBack flex align-items-center">
        <el-col :span="6">
          <div class="commonRow" style="border: 1px solid #a7d2ff;display: flex;justify-content: center;background-color:#fff">
            <div class="value">
              <img v-if="detailForm.face" :src="detailForm.face" class="avatar" /><img v-else src="../../../../assets/capture.png" class="avatar" />
            </div>
          </div>
        </el-col>
        <el-col :span="18" style="margin-left:18px;">
          <div class="commonRow studentCom">
            <div class="label">班&emsp;&emsp;级：</div>
            <div class="value" :title="detailForm.className">
              {{ detailForm.className }}
            </div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">学&emsp;&emsp;号：</div>
            <div class="value" :title="detailForm.studentNo">
              {{ detailForm.studentNo }}
            </div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">姓&emsp;&emsp;名：</div>
            <div class="value" :title="detailForm.name">
              {{ detailForm.name }}
            </div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">学生类型：</div>
            <div class="value" :title="detailForm.studentType">
              {{ detailForm.studentType }}
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="commonRow">
        <el-col :span="24" style="margin: 15px 0">
          <h3>家长信息</h3>
        </el-col>
        <el-col :span="12">
          <div class="commonRow patriarchCom patriarchImg">
            <div class="label">人&emsp;&emsp;脸：</div>
            <div class="value valueImg">
              <img v-if="detailForm.relativeFace1" :src="detailForm.relativeFace1" class="avatar avatar-single" />
            </div>
          </div>
          <div class="commonRow patriarchCom">
            <div class="label">姓&emsp;&emsp;名：</div>
            <div class="value" :title="detailForm.relativeName1">
              {{ detailForm.relativeName1 || "--" }}
            </div>
          </div>
          <div class="commonRow patriarchCom">
            <div class="label">关&emsp;&emsp;系：</div>
            <div class="value" :title="detailForm.relativeType1">
              {{ detailForm.relativeType1 || "--" }}
            </div>
          </div>
          <div class="commonRow patriarchCom">
            <div class="label">联系电话：</div>
            <div class="value" :title="detailForm.relativePhone1">
              {{ detailForm.relativePhone1 || "--" }}
            </div>
          </div>

        </el-col>
        <el-col :span="12">
          <div class="commonRow patriarchCom patriarchImg">
            <div class="label">人&emsp;&emsp;脸：</div>
            <div class="value valueImg">
              <img v-if="detailForm.relativeFace2" :src="detailForm.relativeFace2" class="avatar avatar-single" />
            </div>
          </div>
          <div class="commonRow patriarchCom">
            <div class="label">姓&emsp;&emsp;名：</div>
            <div class="value" :title="detailForm.relativeName2">
              {{ detailForm.relativeName2 || "--" }}
            </div>
          </div>
          <div class="commonRow patriarchCom">
            <div class="label">关&emsp;&emsp;系：</div>
            <div class="value" :title="detailForm.relativeType2">
              {{ detailForm.relativeType2 || "--" }}
            </div>
          </div>
          <div class="commonRow patriarchCom">
            <div class="label">联系电话：</div>
            <div class="value" :title="detailForm.relativePhone2">
              {{ detailForm.relativePhone2 || "--" }}
            </div>
          </div>
        </el-col>
        <el-col :span="24" v-if="detailForm.hasRelative">
          <p>暂无家长信息</p>
        </el-col>
        <el-col :span="24">
          <div class="commonRow patriarchCom noteCom">
            <div class="label">备&emsp;&emsp;注：</div>
            <div class="value note-value" :title="detailForm.note">
              {{ detailForm.note }}
            </div>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top: 15px" v-if="edit">
          <div class="commonRow" style="text-align:center">
            <el-button size="small" @click="openUpdate()" type="primary">编辑</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {},
    edit: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    visible(val) {
      this.selfVisible = val
      if (this.visible) {
        this.detailForm = this.form
      }
    },
  },

  data() {
    return {
      selfVisible: this.visible, // 避免vue双向绑定警告
      detailForm: {
        className: "",
        face: "",
        hasRelative: false,
        name: "",
        note: "",
        relativeFace1: "",
        relativeFace2: "",
        relativeName1: "",
        relativeName2: "",
        relativePhone1: "",
        relativePhone2: "",
        relativeType1: "",
        relativeType2: "",
        studentNo: "",
        studentType: "",
      }
    }
  },

  methods: {
    closeDialog() {
      this.detailForm = {
        className: "",
        face: "",
        hasRelative: false,
        name: "",
        note: "",
        relativeFace1: "",
        relativeFace2: "",
        relativeName1: "",
        relativeName2: "",
        relativePhone1: "",
        relativePhone2: "",
        relativeType1: "",
        relativeType2: "",
        studentNo: "",
        studentType: "",
      }
      this.selfVisible = false
      this.$emit('close')
    },
    openUpdate() {
      this.$emit('edit', this.detailForm)
      this.selfVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
// 详情弹框
.studentBack {
  background: rgba(124, 189, 255, 0.3);
  padding: 14px 16px;
}
.studentCom {
  background: #a7d2ff;
  color: #ffffff;
}
.studentCom:last-child {
  margin-bottom: 0;
}
.commonRow {
  overflow: hidden;
  .label {
    float: left;
  }
  .value {
    float: left;
    img {
      height: 200px;
    }
  }
  .note-value {
    width: 84%;
  }
}
.avatar {
  width: 150px;
  height: auto;
  display: block;
}
.avatar-single {
  height: 44px !important;
  width: auto !important;
}
.patriarchCom {
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  background: #f5f9ff;
  margin-bottom: 10px;
  padding: 8px 10px;
}
.patriarchImg {
  height: 60px;
}
.valueImg img {
  width: 44px;
  height: 44px;
}
.noteCom {
  min-height: 38px;
  height: auto;
  align-items: inherit;
}
</style>