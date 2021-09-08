<template>
  <div>
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="title" :visible.sync="visible" width="700px" :before-close="handleClose" @open="opened">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="所属分组：" prop="alertTaskId">
          <el-select placeholder="选择所属分组" v-model="ruleForm.alertTaskId" maxlength="100">
            <el-option v-for="(dtem,d) in groupData" :label="dtem.name" :value="dtem.id" :key="d"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人像：" prop="faceUrl" style="margin-bottom: 7px;">
          <el-upload ref="upload" class="avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFaceUpload">
            <img v-if="ruleForm.faceUrl" :src="ruleForm.faceUrl" class="avatar avatar-single" />
            <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
          </el-upload>
        </el-form-item>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model.trim="ruleForm.name" maxlength="10" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国籍：" prop="country">
              <el-input v-model.trim="ruleForm.country" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model.number="ruleForm.phone" maxlength="11" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯：" prop="homeTown">
              <el-input v-model.trim="ruleForm.homeTown" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="证件类型：" prop="cardType">
              <el-select v-model="ruleForm.cardType" placeholder="请选择" style="width: 200px" @change="changeType">
                <el-option v-for="item in certificateTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!-- <div v-show="ruleForm.cardType == '其它'" style="margin-top: 10px">
                证件名称：
                <el-input v-model.trim="otherCardType" style="width: 200px" maxlength="32"></el-input>
              </div> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码：" prop="cardNo">
              <el-input v-model="ruleForm.cardNo" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="0" v-show="ruleForm.cardType == '其它'">
          <el-col :span="12">
            <el-form-item label="证件名称：" prop="birthday">
              <el-input v-model.trim="otherCardType" style="width: 200px" maxlength="32"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthday" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width: 200px"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位：" prop="jobAddress">
              <el-input v-model.trim="ruleForm.jobAddress" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="ruleForm.sex" placeholder="请选择" style="width: 200px">
                <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住址：" prop="address">
              <el-input v-model.trim="ruleForm.address" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model.trim="ruleForm.remark" type="textarea" :rows="2" :maxlength="200" style="width: 515px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" :loading="loading" @click="confirmSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import { getBase64 } from "@/utils/index.js";
import {
  faceUpdate,
  updateImportantPerson,
  addImportantPerson,
  faceDetect,
  faceUpload,
} from "@/api/police";
import { isNull, checkIdCardNo } from "@/utils/index";
@Component
export default class importantPerson extends Vue {
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: "" }) title: string;
  @Prop({ default: {} }) form: any;
  @Prop({ default: () => [] }) groupData: Array<object>;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  otherCardType: string = "";
  ruleForm: any = {
    faceUrl: "",
    id: "",
    alertTaskId: "",
    name: "",
    phone: "",
    cardType: "",
    cardNo: "",
    birthday: "",
    sex: 3,
    homeTown: "",
    jobAddress: "",
    address: "",
    country: "",
    remark: "",
  };
  currentId: string = "";
  cardType: string = "";
  loading: boolean = false;
  editUrl: boolean = false;
  pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };
  sexList: Array<object> = [
    { label: "请选择", value: 3 },
    { label: "男", value: 1 },
    { label: "女", value: 2 },
  ];
  certificateTypeList: Array<object> = [
    { label: "身份证", value: "身份证" },
    { label: "护照", value: "护照" },
    { label: "港澳居民来往内地通行证", value: "港澳居民来往内地通行证" },
    // { label: "其它", value: "其它" },
  ];
  rules: any = {
    alertTaskId: [
      {
        required: true,
        message: "请选择分组",
        trigger: "change",
      },
    ],
    faceUrl: [{ required: true, message: "请上传人像", trigger: "change" }],
    name: [
      { required: true, message: "请输入姓名", trigger: "blur" },
      {
        min: 1,
        max: 10,
        message: "姓名需要在1~10位",
        trigger: "blur",
      },
    ],
  };
  opened() {
    console.log(this.ruleForm);
    this.editUrl = false;
    if (!this.visible) return;
    if (this.title == "修改人像" || this.title == "编辑人像") {
      this.ruleForm = {
        alertTaskId: this["form"].alertTaskId,
        faceUrl: this["form"].faceUrl,
        phone: this["form"].phone,
        name: this["form"].name,
        cardType: this["form"].cardType,
        cardNo: this["form"].cardNo,
        birthday: this["form"].birthday,
        sex: this["form"].sex,
        homeTown: this["form"].homeTown,
        jobAddress: this["form"].jobAddress,
        address: this["form"].address,
        country: this["form"].country,
        remark: this["form"].remark,
      };
      this.currentId = this["form"].id;
    }
    // this["ruleForm"].faceUrl = this["form"].faceUrl;
    // this["ruleForm"].name = this["form"].name;
  }
  changeType(val) {
    // console.log(val)
    this.cardType = val;
  }
  beforeFaceUpload(file) {
    console.log(file);
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('上传人脸图片大小不能超过 2MB!');
    //   return;
    // }
    if (file.raw.type.indexOf("image/") === -1) {
      this.$message.error("图片格式错误，请上传人脸图片！");
      return;
    }
    getBase64(file.raw).then((res) => {
      this.editUrl = true;
      this.ruleForm["faceUrl"] = res;
    });
  }
  handleClose() {
    this.$refs["ruleForm"]["resetFields"]();
    this.ruleForm = {
      id: "",
      faceUrl: "",
      name: "",
      phone: "",
      cardType: "",
      cardNo: "",
      birthday: "",
      sex: 3,
      homeTown: "",
      jobAddress: "",
      address: "",
      country: "",
      remark: "",
    };
    this.$emit("close");
  }
  //添加人像
  confirmSubmit() {
    if (
      this.ruleForm.cardType === "身份证" &&
      !checkIdCardNo(this.ruleForm.cardNo)
    ) {
      this.$message.error("请输入正确的身份证号码！");
      return;
    }
    if (
      !isNull(this.ruleForm.phone) &&
      !/^1[3456789]\d{9}$/.test(this.ruleForm.phone)
    ) {
      this.$message.error("请输入正确的电话号码！");
      return;
    }
    this.$refs["ruleForm"]["validate"](async (valid) => {
      if (valid) {
        if (this.title == "修改人像") {
          this.loading = true;
          let param = {
            ...this.ruleForm,
            id: this.currentId,
          };
          if (param.faceUrl.indexOf("data:image") != -1) {
            let res: any = await faceDetect({
              base64: param.faceUrl,
            });
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              return;
            }
            faceUpload({ base64: param.faceUrl })
              .then((val) => {
                let data = { ...param };
                data.faceUrl = val.data.data;
                data.isChangeFace = true;
                updateImportantPerson(data)
                  .then((res) => {
                    this.$message.success("修改成功");
                    this.loading = false;
                    this.handleClose();
                    this.$emit("submit");
                  })
                  .catch((err) => {
                    this.loading = false;
                  });
              })
              .catch((err) => {
                this.loading = false;
              });
          } else {
            delete param.faceUrl;
            param.isChangeFace = false;
            updateImportantPerson(param)
              .then((res) => {
                this.$message.success("修改成功");
                this.handleClose();
                this.loading = false;
                this.$emit("submit");
              })
              .catch((err) => {
                this.loading = false;
              });
          }
        } else {
          // this.handleClose();
          let param = {
            ...this.ruleForm,
          };
          if (param.faceUrl.indexOf("data:image") != -1) {
            let res: any = await faceDetect({
              base64: param.faceUrl,
            });
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              return;
            }
            faceUpload({ base64: param.faceUrl })
              .then((val) => {
                let id = param.alertTaskId;
                param.faceUrl = val.data.data;
                param.isChangeFace = true;
                delete param.alertTaskId;
                let data = { alertFaceBodies: [param], id: id };
                addImportantPerson(data)
                  .then((res) => {
                    this.$message.success("添加成功");
                    this.loading = false;
                    this.handleClose();
                    this.$emit("submit");
                  })
                  .catch((err) => {
                    this.loading = false;
                  });
              })
              .catch((err) => {
                this.loading = false;
              });
          }
          //  addImportantPerson(param)
          //   .then((res) => {
          //     this.$message.success("添加成功");
          //     this.handleClose();
          //     this.loading = false;
          //     this.$emit("submit");
          //   })
          //   .catch((err) => {
          //     this.loading = false;
          //   });
        }
      }
    });
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
  }
}
</style>
