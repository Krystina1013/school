<template>
  <div>
    <el-dialog class="newDialog" title="其他人员详情" :visible.sync="selfVisible" width="700px" top="10vh" :before-close="closeDialog" :close-on-click-modal="false">
      <el-row :gutter="0" class="flex studentBack">
        <el-col :span="8">
          <div class="commonRow detail-con-img">
            <img v-if="detailForm.face" :src="detailForm.face" class="avatar avatar-single" /><img v-else src="../../../../assets/capture.png" />
          </div>
        </el-col>
        <el-col :span="16" style="margin-left:16px; margin-top:12px;">
          <div class="commonRow studentCom">
            <div class="label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</div>
            <div class="value" :title="detailForm.name">{{ detailForm.name }}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">联系电话：</div>
            <div class="value" :title="detailForm.phone">{{ detailForm.phone}}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">身份证号：</div>
            <div class="value" :title="detailForm.idCard">{{ detailForm.idCard}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24" style="margin-top:15px;">
          <div class="commonRow studentCom">
            <div class="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</div>
            <div class="value note-value" :title="detailForm.note">{{ detailForm.note}}</div>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top:15px;" v-if="edit">
          <div style="text-align:center">
            <el-button size="small" @click="openUpdate(detailForm)" type="primary">编辑</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { tr } from 'date-fns/locale'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {},
    edit:  {
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
        createTime: "",
        face: "",
        id: "",
        idCard: "",
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
        createTime: "",
        face: "",
        id: "",
        idCard: "",
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
.commonRow {
  height: auto;
  display: flex;
  .label {
    width: 80px;
    flex: 0 0 80px;
  }
  .note-value {
    padding: 12px 0;
    line-height: 24px;
    height: auto;
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
.studentBack {
  padding: 14px 16px;
}
.detail-con-img {
  width: 180px;
  height: 180px;
  border: 1px solid #d8d8d8;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>