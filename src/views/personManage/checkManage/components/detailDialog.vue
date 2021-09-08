<template>
  <div>
    <el-dialog class="newDialog" title="教师人员详情" :visible.sync="selfVisible" width="700px" top="10vh" :before-close="closeDialog" :close-on-click-modal="false">
      <el-row :gutter="0" class="checkBack flex">
        <el-col :span="8">
          <div class="commonRow" style="border: 1px solid rgb(216, 216, 216); display: flex;justify-content:center;">
            <div class="value detail-person-img">
              <img v-if="detailForm.face" :src="detailForm.face" class="avatar avatar-single" /><img v-else src="../../../../assets/capture.png" class="avatar avatar-single" />
            </div>
          </div>
        </el-col>
        <el-col :span="16" style="margin-left:16px;">
          <div class="commonRow studentCom" style="margin:10px 0;">
            <div class="label">姓名：</div>
            <div class="value" :title="detailForm.name">
              {{ detailForm.name }}
            </div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">联系电话：</div>
            <div class="value" :title="detailForm.phone">
              {{ detailForm.phone }}
            </div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">任课：</div>
            <div class="value" :title="detailForm.groupName">
              {{ detailForm.groupName }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0" class="employ">
        <el-col :span="24" class="flex align-items-center justify-content-between">
          <div class="commonRow ml-20">
            <div class="label">电话是否对家长开放：</div>
            <div class="value" :title="detailForm.isPhoneOpen" :class="[detailForm.isPhoneOpen=='1'?'isTrue':'isFalse']">
              {{ detailForm.isPhoneOpen === "1" ? "是" : "否" }}
            </div>
          </div>
          <div class="commonRow ml-20">
              <div class="label">是否关注公众号：</div>
              <div class="value" :title="detailForm.followWechat" :class="[detailForm.followWechat=='1'?'isTrue':'isFalse']">
                {{ detailForm.followWechat === "1" ? "是" : "否" }}
              </div>
            </div>
        </el-col>
      </el-row>
      <el-row :gutter="0" class="checkBack" style="padding-bottom:0">
        <el-col :span="24">
          <div class="commonRow flex column" style="height:auto;margin-bottom:20px">
            <div class="label">关联班级：</div>
            <div class="value note-value">
              <span class="grade-tag" v-for="(item, i) in detailForm.classes" :key="i">
                <span v-if="item.type">{{item.className+' - '}}{{item.type==0?'任课老师':'班主任'}}</span>
                <span v-else>{{item.className}}</span>
              </span>
            </div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">状态：</div>
            <div class="value" :title="detailForm.status">
              {{ detailForm.status === "USED" ? "正常" : "禁用" }}
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="commonRow studentCom noteCom">
            <div class="label">备注：</div>
            <div class="value note-value" style="margin:0;" :title="detailForm.note">{{ detailForm.note}}</div>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top: 15px" v-if="edit">
          <div style="text-align:center">
            <el-button size="small" @click="openUpdate(detailForm)" type="primary">编辑</el-button>
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
        classes: [],
        createTime: "",
        face: "",
        followWechat: "0",
        groupId: "",
        groupName: "",
        id: "",
        name: "",
        note: "",
        noteStatus: false,
        phone: "",
        scenceId: "",
        scenceUserId: "",
        showMenu: false,
        status: "USED",
      }
    }
  },

  methods: {
    closeDialog() {
      this.detailForm = {
        classes: [],
        createTime: "",
        face: "",
        followWechat: "0",
        groupId: "",
        groupName: "",
        id: "",
        name: "",
        note: "",
        noteStatus: false,
        phone: "",
        scenceId: "",
        scenceUserId: "",
        showMenu: false,
        status: "USED",
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
.checkBack {
  padding: 14px 16px;
}
.studentCom {
  display: flex;
  align-items: center;
}
.noteCom {
  height: auto;
  align-items: inherit;
  min-height: 46px;
}
.grade-tag {
  display: inline-block;
  background: #e1efff;
  border: 1px solid rgba(64, 158, 255, 0.52);
  color: #409eff;
  padding: 0 20px;
  height: 34px;
  line-height: 32px;
  border-radius: 4px;
  display: inline-block;
  margin-right: 14px;
  margin-bottom: 10px;
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
    margin-top: 14px;
    width: 90%;
    padding: 10px 0;
    line-height: 24px;
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
.noteCom {
  min-height: 38px;
  height: auto;
  align-items: inherit;
}

.employ {
  border-bottom: 1px solid #e4e7ed;
  border-top: 1px solid #e4e7ed;
  padding: 12px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-right: 8px;
}
.isTrue {
  color: #409eff;
}
.isFalse {
  color: #f56c6c;
}
</style>