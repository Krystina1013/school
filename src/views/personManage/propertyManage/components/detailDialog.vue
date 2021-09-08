<template>
  <div>
    <el-dialog class="newDialog" title="职工人员详情" :visible.sync="selfVisible" width="700px" top="10vh" :before-close="closeDialog" :close-on-click-modal="false">
      <div class="pd-20">
        <el-row class="flex propertyInfo">
          <el-col :span="8">
            <div class="commonRow" style="border:1px solid #D8D8D8;width:180px;height:180px;">
              <div class="value" style="width:100%;height:100%;">
                <img style="width:100%;height:100%;object-fit: contain;" v-if="detailForm.face" :src="detailForm.face" class="avatar avatar-single" />
                <img style="width:100%;height:100%;object-fit: contain;" v-else src="../../../../assets/capture.png" class="avatar avatar-single" />
              </div>
            </div>
          </el-col>
          <el-col :span="16" style="margin-left:24px;">
            <div class="commonRow propertyCom">
              <div class="label">姓&emsp;名：</div>
              <div class="value" :title="detailForm.name">
                {{ detailForm.name }}
              </div>
            </div>
            <div class="commonRow propertyCom">
              <div class="label">联系电话：</div>
              <div class="value" :title="detailForm.phone">
                {{ detailForm.phone }}
              </div>
            </div>
            <div class="commonRow propertyCom">
              <div class="label">所属部门：</div>
              <div class="value" :title="detailForm.workerGroupName">
                {{ detailForm.workerGroupName }}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" class="employ">
          <el-col :span="24" class="flex align-items-center justify-content-between">
            <div class="commonRow ml-20">
              <div class="label">是否使用小程序：</div>
              <div class="value" :title="detailForm.useMiniApp" :class="[detailForm.useMiniApp=='1'?'isTrue':'isFalse']">
                {{ detailForm.useMiniApp === "1" ? "是" : "否" }}
              </div>
            </div>
            <div class="commonRow ml-20" v-if="detailForm.useMiniApp === '1'">
              <div class="label">是否查看抓拍记录：</div>
              <div class="value" :title="detailForm.useSnapRecords" :class="[detailForm.useSnapRecords=='1'?'isTrue':'isFalse']">
                {{ detailForm.useSnapRecords === "1" ? "是" : "否" }}
              </div>
            </div>
            <div class="commonRow ml-20" v-if="detailForm.useMiniApp === '1'">
              <div class="label">是否查看考勤：</div>
              <div class="value" :title="detailForm.isCheckAttendance" :class="[detailForm.isCheckAttendance=='1'?'isTrue':'isFalse']">
                {{ detailForm.isCheckAttendance === "1" ? "是" : "否" }}
              </div>
            </div>
            <div class="commonRow ml-20">
              <div class="label">是否关注公众号：</div>
              <div class="value" :title="detailForm.followWechat" :class="[detailForm.followWechat=='1'?'isTrue':'isFalse']">
                {{ detailForm.followWechat === "1" ? "是" : "否" }}
              </div>
            </div>
            <div class="commonRow ml-20" v-if="detailForm.useMiniApp === '1'">
              <div class="label">是否查看实时监控：</div>
              <div class="value" :title="detailForm.isRealVideo" :class="[detailForm.isRealVideo=='1'?'isTrue':'isFalse']">
                {{ detailForm.isRealVideo === "1" ? "是" : "否" }}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24" v-if="detailForm.useMiniApp === '1'&& detailForm.warnType">
            <div class="commonRow">
              <div class="label1">微信接受预警：</div>
              <div class="value_warn">
                <span v-show="
                  detailForm.warnType &&
                  detailForm.warnType.indexOf('CARE_MAN') != -1
                ">关注人员预警</span>
                <span v-show="
                  detailForm.warnType &&
                  detailForm.warnType.indexOf('STRANGER') != -1
                ">陌生人预警</span>
                <span v-show="
                  detailForm.warnType &&
                  detailForm.warnType.indexOf('AREA') != -1
                ">区域预警</span>
                <span v-show="
                  detailForm.warnType &&
                  detailForm.warnType.indexOf('DEVICE_DOWN') != -1
                ">设备离线预警</span>
                <span v-show="
                  detailForm.warnType &&
                  detailForm.warnType.indexOf('MOUSE') != -1
                ">厨房老鼠预警</span>
                <span v-show="
                  detailForm.warnType &&
                  detailForm.warnType.indexOf('CHEF_HAT') != -1
                ">厨师帽预警</span>
                <span v-show="
                  detailForm.warnType &&
                  detailForm.warnType.indexOf('VOICE_ALERT') != -1
                ">声音预警</span>
              </div>
            </div>
          </el-col>
          <el-col :span="24" style="margin-top:10px;" v-if="detailForm.useMiniApp === '1' && detailForm.smsWarnType">
            <div class="commonRow">
              <div class="label1">短信接受预警：</div>
              <div class="value_warn">
                <span v-show="
                  detailForm.smsWarnType &&
                  detailForm.smsWarnType.indexOf('CARE_MAN') != -1
                ">关注人员预警</span>
                <span v-show="
                  detailForm.smsWarnType &&
                  detailForm.smsWarnType.indexOf('AREA') != -1
                ">区域预警</span>
              </div>
            </div>
          </el-col>
          <el-col :span="24" style="margin-top: 15px">
            <div class="commonRow propertyCom" style="height:auto">
              <div class="label">备注：</div>
              <div class="value note-value" :title="detailForm.note">{{ detailForm.note}}</div>
            </div>
          </el-col>
          <el-col :span="24" style="margin-top: 15px">
            <div class="commonRow" style="text-align:center">
              <el-button size="small" @click="openUpdate()" type="primary">编辑</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
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
        createTime: "",
        face: "",
        followWechat: "0",
        groupIdList: [],
        id: "",
        isRealVideo: "0",
        name: "",
        note: "",
        noteStatus: false,
        phone: "",
        scenceId: "",
        scenceUserId: "",
        showMenu: false,
        smsWarnType: "",
        status: "USED",
        useMiniApp: "0",
        useSnapRecords: "0",
        warnType: "",
        workerGroupId: "",
        workerGroupName: "",
      }
    }
  },

  methods: {
    closeDialog() {
      this.detailForm = {
        createTime: "",
        face: "",
        followWechat: "0",
        groupIdList: [],
        id: "",
        isRealVideo: "0",
        name: "",
        note: "",
        noteStatus: false,
        phone: "",
        scenceId: "",
        scenceUserId: "",
        showMenu: false,
        smsWarnType: "",
        status: "USED",
        useMiniApp: "0",
        useSnapRecords: "0",
        warnType: "",
        workerGroupId: "",
        workerGroupName: "",
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
.pd-20 {
  padding-left: 20px;
  padding-right: 20px;
}
.commonRow {
  overflow: hidden;
  .label {
    float: left;
  }
  .value {
    float: left;
  }
  .note-value {
    width: 84%;
  }
  .value_warn {
    width: 100%;
    span {
      background: #e1efff;
      border: 1px solid rgba(64, 158, 255, 0.52);
      color: #409eff;
      padding: 0 20px;
      height: 34px;
      line-height: 32px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 14px;
      margin-right: 14px;
    }
  }
}
.avatar {
  width: 150px;
  height: auto;
  display: block;
}
.avatar-single {
  width: 150px;
}
.employ {
  border-bottom: 1px solid #e4e7ed;
  border-top: 1px solid #e4e7ed;
  padding: 12px 0;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-right: 8px;
}
.propertyCom {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: #f8f8f8;
  color: #606266;
  margin-bottom: 10px;
  padding: 0 10px;
}
.propertyInfo {
  align-items: center;
}
.isTrue {
  color: #409eff;
}
.isFalse {
  color: #f56c6c;
}
</style>