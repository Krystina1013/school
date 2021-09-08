<template>
  <div>
    <el-dialog class="newDialog" title="访客人员详情" :visible.sync="selfVisible" width="600px" top="10vh" :before-close="closeDialog" :close-on-click-modal="false">
      <el-row :gutter="0" class="flex">
        <el-col :span="8">
          <div class="commonRow">
            <div class="value detail-con-img"> <img v-if="detailForm.faceImg" :src="detailForm.faceImg" class="avatar avatar-single" />
              <img v-else src="../../../../assets/capture.png" class="avatar avatar-single" />
            </div>
          </div>
        </el-col>
        <el-col :span="16" style="margin-left:16px;margin-bottom:15px">
          <div class="commonRow studentCom" style="margin-top:10px">
            <div class="label">访客姓名：</div>
            <div class="value" :title="detailForm.name">{{ detailForm.name }}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">&nbsp;手&nbsp;机&nbsp;号：</div>
            <div class="value" :title="detailForm.phone">{{ detailForm.phone}}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">身份证号：</div>
            <div class="value" :title="detailForm.idNo">{{ detailForm.idNo }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="commonRow studentCom">
            <div class="label">&nbsp;被&nbsp;访&nbsp;人：</div>
            <div class="value" :title="detailForm.interviewee">{{ detailForm.interviewee }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow studentCom">
            <div class="label">登记时间：</div>
            <div class="value" :title="detailForm.createTime">{{ detailForm.createTime }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <div class="commonRow studentCom">
            <div class="label">来访目的：</div>
            <div class="value" :title="detailForm.visitreason">{{ detailForm.visitreason }}</div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="commonRow studentCom" style="height: auto;">
            <div class="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</div>
            <div class="value note-value" :title="detailForm.remarks">{{ detailForm.remarks }}</div>
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
        address: "",
        birthDate: "",
        createTime: "",
        faceImg: "",
        firstPassTime: null,
        id: "",
        idNo: "",
        idPhoto: "",
        interviewee: "",
        issuanceAuthority: "",
        lastInOut: null,
        lastPassTime: null,
        name: "",
        nation: "",
        passcount: 0,
        phone: "",
        remarks: "",
        scenceId: "",
        sex: "",
        showMenu: true,
        type: "DEVICE_VISITOR",
        visitreason: "",
      }
    }
  },

  methods: {
    closeDialog() {
      this.detailForm = {
        address: "",
        birthDate: "",
        createTime: "",
        faceImg: "",
        firstPassTime: null,
        id: "",
        idNo: "",
        idPhoto: "",
        interviewee: "",
        issuanceAuthority: "",
        lastInOut: null,
        lastPassTime: null,
        name: "",
        nation: "",
        passcount: 0,
        phone: "",
        remarks: "",
        scenceId: "",
        sex: "",
        showMenu: true,
        type: "DEVICE_VISITOR",
        visitreason: "",
      }
      this.selfVisible = false
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss" scoped>
// 详情弹框
.commonRow {
  overflow: hidden;
  display: flex;
  .label {
    width: 80px;
    text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
  }
  .note-value {
    padding: 12px 0;
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