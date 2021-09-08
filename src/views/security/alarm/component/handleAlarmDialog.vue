<template>
  <div>
    <el-dialog class="newDialog" title="处理预警" :append-to-body='true' :visible.sync="selfVisible" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialog">
      <el-form label-position='top' ref="detailForm" label-width="100px" class="handle-ruleForm">
        <el-form-item label="反馈信息：">
          <el-input type="textarea" :rows="5" maxlength="200" placeholder="请输入内容" v-model="detailForm.handleContent"></el-input>
        </el-form-item>
        <el-form-item label="相关图片（最多上传6张）">
          <div class="uplolad-img">
            <span class="shade-position" v-for="(item,index) in picList" :key="index">
              <img class="show-img" :src="item.url" alt />
              <p class="show-img shade" @click="changeImg(item,index)">
                <i class="el-icon-delete"></i>
              </p>
            </span>
            <el-upload class="avatar-uploader" name='file' :multiple='false' :action="upPathPerson"  ref="uploadForm" :auto-upload="false" :list-type="picList.length < 6 ? 'picture-card' : ''" :on-change="handlePreview" accept=".jpg, .jpeg, .png, .JPG, .JPEG" :headers="myHeaders" :show-file-list="false" :on-success="succUpdatePerson" :on-error="errorUpdatePerson">
              <i v-if="picList.length < 6" class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="暂停告警时长" v-if="detailForm.warnSignId">
          <el-radio-group v-model="detailForm.alarmTime">
            <el-radio-button :label="30">30分钟</el-radio-button>
            <el-radio-button :label='120'>2小时</el-radio-button>
            <el-radio-button :label='480'>8小时</el-radio-button>
            <el-radio-button :label='1440'>24小时</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog()">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" :disabled='handleLoading' @click="confirmHandled()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/api/config";
import { getToken } from "@/utils/auth";
import { addMinutes, format } from "date-fns";
import { handleWarn, stopAlarm } from "@/api/dev";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: Object,
  },
  watch: {
    visible(val) {
      this.selfVisible = val
      this.detailForm = this.form
    },
    form: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
      }
    }
  },

  data() {
    return {
      selfVisible: this.visible, // 避免vue双向绑定警告
      isClick: false,
      config: config,
      myHeaders: {
        token: getToken()
      },
      detailForm: {
        id: "",
        handleContent: "",
        picList: [],
        warnSignId: "",
        alarmTime: "",
      },
      picList: [],
      upPathPerson: `${config.v3}/admin/feed_back/upFile`,
      handleLoading: false
    }
  },

  methods: {
    // 保存预警处理
    confirmHandled() {
      this.isClick = true;
      this.handleLoading = true;
      this.detailForm.picList = []
      this.$refs.uploadForm.submit();
      // return
      setTimeout(() => {
        this.handledFun();
        if (this.detailForm.alarmTime) {
          this.stopAlarm();
        }
      }, 300);
    },
    // 预警处理
    handledFun() {
      let data = {
        id: this.detailForm.id,
        images: this.detailForm.picList,
        remark: this.detailForm.handleContent,
      };

      handleWarn(data).then((res) => {
        this.handleLoading = false;
        if (res && res.data.code == "200") {
          this.$message.success("处理成功！");
          this.clearForm()
          this.$emit('update')
        } else {
          this.$message.error("处理失败");
        }
      }).catch(error=>{
        this.handleLoading = false;
      });
    },

    // 暂停告警
    stopAlarm() {
      let stopStillTime = format(
        addMinutes(new Date(), parseInt(this.detailForm.alarmTime)),
        "yyyy-MM-dd HH:mm:ss"
      );
      stopAlarm({
        warnSignId: this.detailForm.warnSignId,
        stopStillTime: stopStillTime,
      });
    },

    handlePreview(file, fileList) {
      let types = ['image/jpeg', 'image/jpg', 'image/png'];
      const isImage = types.includes(file.raw.type);
      if (!isImage && file.status === "ready") {
        this.$message.error('只能上传图片!');
        file = null
        return
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M && file.status === "ready") {
        this.$message.error("上传图片大小不能超过 2MB!");
        return;
      }
      if (file.status === "ready" && this.picList.length < 6) {
        this.picList.push(file);
      }
    },

    succUpdatePerson(res, file, fileList) {
      console.log('resres---', res)
      if (res.code == 200) {
        this.detailForm.picList.push(res.data);
      }
    },

    changeImg(v, i) {
      this.picList.splice(i, 1);
    },
    errorUpdatePerson() { },

    clearForm() {
      this.detailForm = {
        handleContent: "",
        picList: [],
        warnSignId: "",
        alarmTime: "",
        id: "",
      };
      this.picList = [];
    },
    closeDialog() {
      this.clearForm()
      this.selfVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.handle-ruleForm {
  padding: 0 30px;
}
.uplolad-img {
  display: flex;
  position: relative;
  height: 100px !important;
}
.shade-position {
  position: relative;
}
.shade-position:hover .shade {
  display: block;
}
.show-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  margin-right: 5px;
  object-fit: contain;
  border: 1px solid #d8d8d8;
}
.shade {
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0px;
  text-align: center;
}
</style>