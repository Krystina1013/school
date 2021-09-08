<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body='false'
      :title="dialogObj.isUpdate?'修改密码':'找回密码'"
      :visible.sync="dialogObj.dialogState"
      width="800px"
      :before-close="handleClose"
        >
        <el-steps :active="dialogActive"  finish-status="success" align-center>
          <el-step title="身份验证">
          </el-step>
          <el-step title="修改密码">
          </el-step>
          <el-step title="完成">
          </el-step>
        </el-steps>
        
        <div class="form-con">
          <el-form  auto-complete="on"
            :model="editForm1"
            ref="editForm1"
            :rules="rule1"
            label-position="right"
            label-width="120px"
            class="card-box edit-form">
            <el-form-item prop="phone" label="手机号："  v-if="dialogActive === 0">
              <el-input
                v-model="editForm1.phone"
                placeholder="请输入手机号码"
                maxlength="11"
                class="ipt"
                style="width: 280px"
              ></el-input>
            </el-form-item>
            <el-form-item
            label="验证码："
            prop="authCode"
             v-if="dialogActive === 0"
          >
            <el-input
              v-model="editForm1.authCode"
              placeholder="请输入验证码"
              maxlength="8"
              class="ipt"
              style="width: 200px; margin-right: 10px"
            ></el-input>
            <el-button type="primary" style="width:70px" :disabled="isDiabled" @click="getPhoneCode">{{
              btnMessage
            }}</el-button>
          </el-form-item>
        </el-form>
        <el-form auto-complete="on"
            :model="editForm2"
            ref="editForm2"
            :rules="rule2"
            label-position="right"
            label-width="120px" class="card-box edit-form">
          <el-form-item prop="newPassword"  label="新密码：" v-if="dialogActive === 1">
              <el-input
                v-model="editForm2.newPassword"
                type="password"
                placeholder="请输入新密码"
                maxlength="18"
                minlength="6"
                class="ipt"
                style="width: 280px"
              ></el-input> <span>长度6-18位，数字/字母至少包含1种，字母区分大小写</span>
            </el-form-item>
            <el-form-item prop="surePassWord" label="确认新密码：" v-if="dialogActive === 1">
              <el-input
                v-model="editForm2.surePassWord"
                placeholder="确认新密码"
                type="password"
                maxlength="18"
                minlength="6"
                class="ipt"
                style="width: 280px"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="success-con" v-if="dialogActive === 2">设置成功！</div>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nexHandle" v-if="dialogActive < 2" type="primary">下一步</el-button>
        <el-button v-if="dialogActive === 2" type="primary" @click="returnLogin"
          >返回登录页</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getValidateSms, updatePassword, sendAuthCode }from '@/api/user'
import { clearCookie } from "@/utils/cookie";
import { message } from "@/utils";
export default {
  name:'eiditPassword',
  props: {
    dialogObj: {
      isUpdate: false,
      dialogState: false 
    }
  },
  data() {
    return {
      editForm1: {
        phone: "",
        authCode: "",
      },
      editForm2: {
        surePassWord: "",
        newPassword: "",
      },
      dialogActive: 0,
      isDiabled: false,
      timer: null,
      btnMessage: "获取",
      isGetMsm: false,
      countDown: 60,
      rule1: {
        phone: [{ 
          required: true, 
          validator: (rule, value, callback) => {
            if (value.length !== 11 || !/^1[123456789]\d{9}$/.test(value)) {
              callback(new Error("填写正确的手机号"));
            } else {
              callback();
            }
          },
        trigger: "blur"}],
        authCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      rule2: {
        newPassword: [{ 
          required: true, 
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("输入新密码"));
            }else {
              if (!/^[0-9a-zA-Z]{6,18}$/.test(value)) {
                callback(new Error("长度6-18位，数字/字母至少包含1种，字母区分大小写"));
              } else {
                callback();
              }
            }
          },
          trigger: "blur" }],
        surePassWord: [{ 
          required: true, 
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("重复新密码"));
            }else {
              if (value !== this.editForm2.newPassword) {
                callback(new Error("重复新密码不一致"));
              } else {
                callback();
              }
            }
          }, trigger: "blur" }]
      }
    }
  },
methods: {
  // 修改密码 
  sureEditpsd() {
    const smsObj = {
      phone: this.editForm1.phone,
      authCode: this.editForm1.authCode,
      newPassword: this.editForm2.newPassword
    }
    updatePassword(smsObj).then(() => {
      message("success", "密码修改成功！");
      this.dialogActive++;
    })
  },
  validateSms(){ //验证短信码
    const smsObj = {
      phone: this.editForm1.phone,
      smsCode: this.editForm1.authCode
    }
    getValidateSms(smsObj).then((res) => {
      // this["message"]("success", "验证码发送成功");
      if (res) {
        this.dialogActive++;
      } else {
        message("success", "验证码不正确！");
      }
      
    })
  },
    nexHandle() {
      if (this.dialogActive === 0) {
        // if (this.isGetMsm === false) { //获取了验证码

        // }
        this.$refs['editForm1'].validate( (validate) => {
          if (validate) {
           this.validateSms()
          }
        })
      } else if (this.dialogActive === 1) {
        this.$refs['editForm2'].validate( (validate) => {
          if (validate) {
            this.sureEditpsd();
            // this.dialogActive++;
          }
        })
      }
      
    },
    returnLogin() {
      this.dialogObj.dialogState = false;
      this.dialogActive = 0;
      if (this.$route.name !== 'login') {
        this.$router.push({ path: "/login" });
        clearCookie();
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      }
      
    },
    handleClose() {
      this.editForm1.phone = '';
      this.editForm1.authCode = '';
      this.editForm2.newPassword = '';
      this.editForm2.surePassWord = '';
      this.$refs["editForm1"]["resetFields"]();
      this.$refs["editForm2"]["resetFields"]();
      this.dialogObj.dialogState = false;
      this.dialogActive = 0;
    },
    getPhoneCode() {
        if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(this.editForm1.phone)) {
        this.$message.error("请输入正确的手机号！");
        return;
        }
        this.isDiabled = true;
        this.isGetMsm = true;
        sendAuthCode({ phone: this.editForm1.phone }).then((res) => {
        if (this.isDiabled) {
            this.timer = setInterval(() => {
            if (this.countDown > 0) {
                this.btnMessage = this.countDown -= 1;
            } else {
                window.clearInterval(this.timer);
                this.countDown = 60;
                this.btnMessage = "获取";
                this.isDiabled = false;
            }
            }, 1000);
        }
        });
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  /deep/.el-input {
    input {
      color: #fff;
    }
    input::first-line {
      color: #bbb !important;
    }
  }
/deep/.el-dialog__footer {
    text-align: center;
}
.form-con{
  padding:20px 40px;
}
.edit-form{
  .el-form-item {
    border: 1px solid rgba(255,255,255, 0.1);
    border-radius: 5px;
    margin-bottom:30px;
    color: #454545;
    background: transparent;
    /deep/.el-input__inner {
      color: #666;
      border: 1px solid  rgba(0, 0, 0, 0.2) !important;
      border-radius: 5px;
      padding-left:10px;
    }
  }
}
</style>