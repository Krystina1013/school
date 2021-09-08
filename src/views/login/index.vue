<template>
  <div class="login-container">
     
    <div class="login-content">
      <div class="login-title"><img class="logo-img" src="../../assets/logo.png"/><span class="text">智安学校管理系统</span></div>
      <div class="login-form-bg">
        <el-form
          auto-complete="on"
          :model="loginForm"
          ref="loginForm"
          :rules="loginRules"
          label-position="left"
          label-width="0px"
          class="card-box login-form"
        >
          <el-form-item prop="scenceName">
            <div class="list">
            <span class="svg-container svg-container_login">
              <i class="iconfont icon-zhuzhai"></i>
            </span>
            <el-input
              name="scenceName"
              type="text"
              v-model.trim="loginForm.scenceName"
              auto-complete="on"
               class="ipt"
              placeholder="学校名称"
              @keyup.enter.native="handleLogin"
            />
            </div>
          </el-form-item>
          <el-form-item prop="account">
            <div class="list">
              <span class="svg-container svg-container_login">
                <i class="iconfont icon-yonghu"></i>
              </span>
              <el-input
                name="account"
                type="text"
                class="ipt"
                maxlength="11"
                v-model="loginForm.account"
                auto-complete="on"
                placeholder="请输入登录账号"
                @keyup.enter.native="handleLogin"
              />
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="list">
              <span class="svg-container">
                <i class="iconfont icon-mima"></i>
              </span>
              <el-input
                name="password"
                type="password"
                class="ipt"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.password"
                auto-complete="on"
                placeholder="请输入登录密码"
              ></el-input>
            </div>
          </el-form-item>

          <div class="auth-code">
            <el-form-item prop="authCode" class="el-form-item-rewrite">
              <div class="password-class list">
                <span class="svg-container">
                  <i class="iconfont icon-yanzhengma"></i>
                </span>
                <el-input
                  style="width:100%;"
                  name="authCode"
                  type="text"
                   class="ipt authCode"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.authCode"
                  auto-complete="off"
                  placeholder="请输入验证码"
                ></el-input>
              </div>
              <div class="remember-psw">
                <el-checkbox v-model="rememberPSW" style="color:#5f6368" @change="rememberPassword">
                  <span style="color: #5f6368">记住密码</span>
                </el-checkbox>
              </div>
              <!-- <div class="find-psw">
                <el-button class="find-btn" @click="openPassWordDialog()">
                  <span style="color: #66bfa6">找回密码</span>
                </el-button>
              </div> -->
            </el-form-item>
            <div @click="fetchAuthCode">
              <img class="auth-img" :src="authURL" alt />
            </div>
          </div>

          <el-form-item>
            <el-button
              class="login-btn"
              style="width:100%;"
              :loading="loading"
              @click.native.prevent="handleLogin"
              @keyup.enter.native="handleLogin"
              >登录</el-button
            >
          </el-form-item>
          <div class="login-info">{{ loginInfo }}</div>
        </el-form>
      </div>
      
    </div>
    <!-- <div class="logo">
        <img src="../../assets/nfy_weblogo.png" alt="">
      </div> -->
    <eidit-password  :dialogObj='dialogObj'/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Provide } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "../../config/minxins";
import { login, getAuthCode } from "../../api/user";
import { getName, setCode, getCode, getPassword } from "@/utils/auth";
import { removeCookie } from "@/utils/cookie.js";
import  config  from "../../api/config";
import eiditPassword from './components/edit-password.vue';
@Component({
  mixins: [mixin],
  components: {
    eiditPassword
  }
})
export default class Login extends Vue {
  filterForm: object = {
    tag: "no"
  }; //根据关键字查询
  initForm: object = {
    url: "/open/login/",
    method: "post"
  };

  @Getter("name") name: any;
  @Action("SET_NAME") set_name: any;
  @Action("SET_TOKEN") set_token: any;
  @Action("SET_SCENCEID") set_scenceId: any;
  @Action("SET_PASSWORD") set_password: any;

  private codeName: String = "";
  private rememberPSW: Boolean = false;
  private authCode: Object = {
    width: 150,
    height: 52
  };
  private authURL: String = "";
  private loginForm: Object = {
    account: "",
    password: "",
    scenceName: "",
    authCode: "",
    authKey: ""
  };
  private dialogObj: any = {
    dialogState: false,
    isUpdate: false
  };
  private loginRules: Object = {
    password: [{ required: true, trigger: "blur", message: "密码不能小于6位" }],
    authCode: [{ required: true, trigger: "blur", message: "验证码不能为空" }]
    // authCode: [{ required: true, trigger: "blur", validator: "请输入验证码" }]
  };

  private loginInfo: String = "";
  private loading: Boolean = false;

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数

    if (getName()) {
      this.loginForm["account"] = getName();
    }
    if (getPassword()) {
      this.loginForm["password"] = getPassword();
      this.rememberPSW = true;
    }
    if (getCode()) {
      this.loginForm["scenceName"] = getCode();
    }

    this.fetchAuthCode();
  }

  mounted() {
    this.checkUserInfo();
  }
 /**打开密码弹窗 */
  openPassWordDialog() {
    this.dialogObj.dialogState = true;
  }
  // 检查是否已登录, 错误不做处理
  checkUserInfo() {
    // this.$store.dispatch('GetInfo').then(() => {
    // this.$router.push({ path: '/' })
    // }).catch(() => {})
  }

  rememberPassword() {
    /**@description 记住密码 */
    console.log(this.rememberPSW);
  }

  fetchAuthCode() {
    var chars = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ];
    
    for (var i = 0; i < 32; i++) {
      var id = Math.floor(Math.random() * 61);
      this.loginForm["authKey"] += chars[id];
    }
    this.authURL = `${config.v1}/open?authKey=${this.loginForm["authKey"]}&&width=${this.authCode["width"]}&&height=${this.authCode["height"]}`;
  }

  async codeFocus(val) {
    await getAuthCode({ code: val }).then(res => {
      if (res.data.code === 200) {
        this.codeName = res.data.data;
        if (this.codeName != "1") {
          this["message"]("error", "没有找到场景类型");
          return;
        }
      }
    });
  }

  async handleLogin() {
    // if(this.codeName === "" || this.codeName === undefined || this.codeName === null){
    //   await this.codeFocus(this.loginForm["scenceName"])
    // }
    // if (this.codeName != "1") {
    //   this["message"]("error", "没有找到场景类型");
    //   return;
    // }
    this.$refs.loginForm["validate"](valid => {
      if (valid) {
        this.loading = true;
        login(this.loginForm)
          .then(response => {
            this.loading = false;
            setCode(this.loginForm["scenceName"]);
            this.set_name(response.data.data.name);
            this.set_scenceId(response.data.data.scenceId)
            this.set_token(response.data.data.token);
            if (this.rememberPSW) {
              this.set_password(this.loginForm["password"]);
            } else {
              removeCookie("password");
            }
            this.$router.push({ path: "/page" });
          })
          .catch(err => {
            if (!err){
              this.$message.error('网络错误！');
              return;
            }
            // console.log('111',err)
            this.fetchAuthCode();
            this.loading = false;
            this.loginInfo = err.response.data.message;
          });
      } else {
        console.log("验证错误！");
        return false;
      }
    });
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  // /deep/.el-input {
  //   input {
  //     color: #fff;
  //   }
  //   input::first-line {
  //     color: #c0c4cc;
  //   }
  // }
.login-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: url("../../assets/login-background.png") no-repeat center;
  background-size: cover;
}
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$FFDeg: -45deg;
$transFF: $FFDeg, rgba(0, 160, 140, 0.85), rgba(30, 40, 129, 0.85);
$transSS: $FFDeg, rgba(0, 160, 140, 0.75), rgba(30, 40, 129, 0.75);
$primary_btn: #5f6368;

// .login-container {
//   position: fixed;
//   height: 100%;
//   width: 100%;
//   background: -webkit-linear-gradient($transSS); /* Safari 5.1 - 6.0 */
//   background: -o-linear-gradient($transSS); /* Opera 11.1 - 12.0 */
//   background: -moz-linear-gradient($transSS); /* Firefox 3.6 - 15 */
//   background: linear-gradient($transSS); /* 标准的语法（必须放在最后） */
//   input:-webkit-autofill {
//     -webkit-text-fill-color: #fff !important;
//     transition: background-color 5000s ease-in-out 0s;
//   }
//   .title {
//     color: #fff;
//     margin: 0 auto 30px;
//     font-size: 36px;
//     font-style: italic;
//     font-weight: bold;
//     text-align: center;
//     .logo {
//       color: yellow;
//       font-size: 30px;
//     }
//     .slogan {
//       color: #fff;
//       font-size: 30px;
//       text-align: center;
//     }
//   }
 
.login-content {
  .login-title{
    margin-bottom:20px;
    padding-top:1px;
    text-align: center;
    color: #fff;
    .logo-img{
      width: 168px;
      height: 46px;
      margin-right: 20px;
      vertical-align: bottom;
    }
    .text{
      font-size: 34px;
      margin-top:10px;
      display: inline-block;
      padding-left: 20px;
      line-height: 46px;
      font-weight: bold;
      position: relative;
      top: -3px;
    }
    .text::before{
      content:'';
      display: inline-block;
      width: 1px;
      background: #fff;
      height: 25px;
      position: absolute;
      left:1px;
      top: 12px;
    }
  }
  position: absolute;
  top:50%;
  left: 50%;
  margin-left:-300px;
  margin-top:-250px;
  
 
  .login-form-bg {
    border: 10px solid rgba(121,180,255,0.50);
    width: 600px;
    height: 430px;
    // width: 100%;
    // height: 100%;
    background: #fff;
    padding-top: 5vh;
    .list {
      position: relative;
      .svg-container {
        color: #5f6368;
        position: absolute;
        left: 22px;
        top: 2px;
      }
    }
    .ipt {
      width: 400px;
      height: 42px;
      border-radius: 4px;
      font-size: 18px;
      border: 1px solid #e4e7ed;
    }
    .authCode{
      /deep/.el-input__inner{
        width:180px;
      }
    }
    .ipt-code {
      width: 290px;
    }
    .code-btn {
      width: 82px;
      height: 42px;
      background: #409eff;
      border-radius: 4px;
      font-size: 18px;
      border: 0;
      margin-left: 14px;
    }
  }
  .login {
    width: 386px;
    height: 42px;
    background: #409eff;
    border-radius: 4px;
    font-size: 18px;
    border: 0;
  }
}
  // input {
  //   background: transparent;
  //   border: 0px;
  //   -webkit-appearance: none;
  //   border-radius: 0px;
  //   padding: 12px 5px 12px 15px;
  //   color: $light_gray;
  //   height: 47px;
  // }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .login-info {
    font-size: 14px;
    text-align: center;
    color: #ff4949;
    margin-bottom: 10px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  // .svg-container {
  //   padding: 6px 5px 6px 15px;
  //   color: $dark_gray;
  //   vertical-align: middle;
  //   width: 30px;
  //   display: inline-block;
  //   &_login {
  //     font-size: 20px;
  //   }
  // }
  .login-form {
    // position: absolute;
    width: 386px;
    margin: 0 auto;
    // top: 50%;
    // left: 50%;
    // margin-left: -240px;
    // margin-top: -246px;
    // padding: 35px 60px 15px 60px;
    // box-sizing: border-box;
    // border-radius: 5px;
    // background: -webkit-linear-gradient($transFF); /* Safari 5.1 - 6.0 */
    // background: -o-linear-gradient($transFF); /* Opera 11.1 - 12.0 */
    // background: -moz-linear-gradient($transFF); /* Firefox 3.6 - 15 */
    // background: linear-gradient($transFF); /* 标准的语法（必须放在最后） */
  }

  .auth-code {
    display: flex;
    // align-items: center;
    margin-bottom: 30px;
  }
  // .el-form-item {
  //   border: 1px solid rgba(255, 255, 255, 0.1);
  //   background: rgba(0, 0, 0, 0.1);
  //   border-radius: 5px;
  //   color: #454545;
  // }
  .el-form-item-rewrite {
    width: 250px;
    margin-right: 10px;
    margin-bottom: 30px;
    margin-top:5px;
  }
  .login-btn {
    background: #409eff;
    border: 0;
    border-radius:4px;
    height: 40px;
    font-size: 18px;
    margin-top:5px;
    color: #fff;
  }

.auth-img {
  width: 150px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.password-class {
  position: relative;
  flex-wrap: nowrap;
  align-items: center;
}

.remember-psw {
  position: absolute;
  left: 0px;
  bottom: -36px;
  top: 70px;
}
.find-psw {
   position: absolute;
  right: -180px;
  bottom: -36px;
  background: transparent;
 
  top: 70px;
  /deep/.el-button{
    color:#fff;
    background: transparent;
    border:none;
  }
}
.iconfont{
  font-size: 18px;
}
.logo{
  width: 195px;
  margin: 35px auto;
  img{
    width:auto;
    height: auto;
  }
}
/deep/.el-input__inner {
    background-color: transparent !important;
    border: 0 !important;
    margin-left: 66px;
    width: 316px;
    color: #5f6368;
  }
.el-form{
    width: 386px;
    margin: 0 auto;
}
/deep/.el-input__inner::-webkit-input-placeholder, /deep/.el-input__inner::-moz-placeholder,/deep/.el-input__inner:-ms-input-placeholder{ /* WebKit browsers */
  color: #5f6368;
}

</style>
