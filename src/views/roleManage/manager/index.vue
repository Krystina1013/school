<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <ActionHeader :initFormHeader="initForm" @fetchData="fetchData" ref="actionHeader" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false" :filterStatus="false">
              </ActionHeader>
            </el-col>
          </el-row>
          <el-table :data="list_data" stripe border highlight-current-row v-loading="showLoading" @selection-change="handleSelectionChange" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange" @sort-change="sortChange">

            <el-table-column type="index" width="60" align="center" class="indexNum" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="account" align="center" label="账号">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="createTime" align="center" label="创建时间">
            </el-table-column>
            <el-table-column prop="status" width="120" align="center" label="状态">
              <template slot-scope="{ row }">
                <el-dropdown @command="changeStatus" trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag size="small" :type="row.status === 'USED' ? 'primary' : 'danger'" style="
                        border-radius: 50px;
                        padding: 0 10px;
                        cursor: pointer;
                      "><i class="el-icon-edit-outline" v-if="row.id==rowId && showProperty == 'status'"></i>{{ row.status === "USED" ? "正常" : "禁用" }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="ComponentCommand('USED', row.id)">正常</el-dropdown-item>
                    <el-dropdown-item :command="ComponentCommand('DISABLE', row.id)">禁用</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="note" align="center" label="备注"></el-table-column>
            <el-table-column label="操作" width="150" align="center" v-if="globalUpdateStatus">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="openReset(scope.row)">重置密码</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" :current-page="page.page" :page-size="page.limit" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-dialog class="newDialog" :close-on-click-modal="false" title="添加账号" :visible.sync="dialogCreate" width="580px" :before-close="handleClose">
      <el-form :model="Form" :rules="FormRules" ref="Forms" label-width="85px">
        <el-form-item label="账号:" prop="account">
          <el-input clearable :maxlength="11" type="text" v-model="Form.account" placeholder="输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input clearable type="text" v-model="Form.password" class="pswd" :maxlength="16" :minlength="8" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="备注:" prop="note">
          <el-input clearable type="textarea" :maxlength="200" v-model.trim="Form.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="confirmAddPropert" :loading="confirmLoading">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 上传人脸 -->

    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" title="重置密码" :visible.sync="updatePsdVisible">
      <el-form :model="psdForm" :rules="psdFormRules" ref="psdForm" label-width="120px">
        <el-form-item label="账号:" prop="account">
          <span>{{ psdForm.account }}</span>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input clearable class="pswd" maxlength="16" minlength="8" v-model="psdForm.newPassword" type="password" placeholder="输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="surePassWord">
          <el-input clearable maxlength="16" minlength="8" class="pswd" v-model="psdForm.surePassWord" type="password" placeholder="输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="psdClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" :loading="psdLoading" @click="confirmPsd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
const BigImg = () => import("@/components/BigImg/index.vue");
import { addAccount, updateAccount } from "@/api/peopleApi";
import { getWorkGroup } from "@/api/houseApi";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
import splitPane from "vue-splitpane";
import { getBase64 } from "@/utils/index.js";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    splitPane,
    BigImg,
    TwoImg,
  },
})
export default class accountManage extends Vue {
  config: any = config;
  isUpdate: boolean = false;
  uploadFaceVisible: boolean = false;
  updatePsdVisible: boolean = false;
  psdoading: boolean = false;
  uploadImageUrl: string = ""; //单独上传人脸
  propertyData: Array<object> = []; //物业权限列表-设备
  rowline: object = {}; //每行数据
  imageUrl: string = "";
  private confirmLoading: boolean = false;
  private rowSpan: number = 15;
  env: string = process.env.NODE_ENV;

  noteString: string = ""; // 备注信息
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  rowId: string = "";
  showProperty: string = "";
  Form: object = {
    account: "",
    note: "",
    password: "",
  };
  psdForm: object = {
    account: "",
    newPassword: "",
    surePassWord: "",
    id: "",
  };
  psdLoading: boolean = false;
  editId: String = "";
  initForm: object = {
    url: config.v1 + "/admin/sys-user",
    method: "get",
  };
  filterForm: object = {
    name: "",
    groupId: "",
  };
  deleteForm: object = {
    url: config.v1 + "/admin/sys-user",
    method: "delete",
    data: [],
    message: "确认删除该账号吗？删除后将无法恢复！",
  };
  passList: object = {
    scenceUserId: "",
    page: 1,
    limit: 10,
    total: 1,
  };
  TreeDataCans: Array<object> = []; //工作组
  visible: boolean = false; // 导入框状态
  phoneString: string = ""; // 手机号
  updateArray: Array<string> = ["noteStatus", "phoneStatus"]; //需要行内修改的
  TreeData: Array<object> = []; // 工作组
  FormRules: object = {
    account: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^[0-9a-zA-Z]{1,11}$/.test(value)) {
            callback(new Error("填写正确的账号，字母或数字不超过11位"));
          } else {
            callback();
          }
        },
      },
    ],
    // sex: [
    //   { required: true, message: '请选择性别', trigger: 'change' }
    // ],newPassword
    password: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/(?!.*\s)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/.test(value)) {
            callback(
              new Error("长度为8-16个字符,必须含数字和字母2种组合,不能含有空格!")
            );
          } else {
            callback();
          }
        },
      },
    ],
  };
  psdFormRules: object = {
    newPassword: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/(?!.*\s)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/.test(value)) {
            callback(
              new Error("长度为8-16个字符,必须含数字和字母2种组合,不能含有空格!")
            );
          } else {
            callback();
          }
        },
      },
    ],
    surePassWord: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error("重复新密码"));
          } else {
            if (value !== this.psdForm["newPassword"]) {
              callback(new Error("重复新密码不一致"));
            } else {
              callback();
            }
          }
        },
        trigger: "blur",
      },
    ],
  };
  selectVal: Array<object> = []; //选中的表格数据
  Dialog: object = {
    name: "", // 物业人员详细记录
  };
  groupIdArr: Array<string> = [];
  isValite: boolean = false; //是否验证
  uploadFaceTitle: string = "上传人脸";
  replayUpfaceLoading: boolean = false; //重新上传
  uploadFaceReplayVisible: boolean = false; //重新上传dialog
  uploadFaceReplaymessage: string = ""; //重新上传dialog 的title
  @Watch("imageUrl")
  getImageUrl() {
    if (!this.isValite) {
      return;
    }
    this.$refs["Forms"]["validateField"]("face", (valid) => {});
    // if (this.dialog.visible) {
    // this.gotoTheFirstPage();
    // this.getOfficeBuilding();
    // }
  }
  /**
   * 重置密码**/
  openReset(row) {
    this.psdForm["account"] = row.account;
    this.psdForm["id"] = row.id;
    this.psdForm["newPassword"] = "";
    this.psdForm["surePassWord"] = "";
    this.updatePsdVisible = true;
  }
  psdClose() {
    this.psdForm["account"] = "";
    this.psdForm["id"] = "";
    this.psdForm["newPassword"] = "";
    this.psdForm["surePassWord"] = "";
    this.updatePsdVisible = false;
  }
  confirmPsd() {
    //重置密码
    this.$refs["psdForm"]["validate"]((valid) => {
      if (valid) {
        let params = {
          account: this.psdForm["account"],
          newPassword: this.psdForm["newPassword"],
          id: this.psdForm["id"],
        };
        this.psdLoading = true;
        updateAccount(params).then((res) => {
          this.updatePsdVisible = false;
          this.psdLoading = false;
          if (res.data.code === 200) {
            this["message"]("success", "修改成功");
            this["fetchData"](this.initForm);
          }
        });
      }
    });
  }
  handleGroupId(data) {
    /**@description 物业权限id */
    if (!data.id) {
      // this.propertyData = [];
      return;
    }
    this.filterForm["groupId"] = data.id;
    // getGroupInfoById(data.id).then((res) => {
    //   if (res.data.code === 200) {
    //     this["list_data"] = res.data.data;
    //     // this.propertyData = res.data.data.devices;
    //   } else {
    //     this.$message("获取权限组信息失败");
    //   }
    // });
  }
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 15;
    } else {
      this.rowSpan = 0;
    }
  }
  // showImg(scope) {
  //   this.twoImg.visible = true;
  //   this.twoImg.leftImg = scope.row.photos;
  //   this.twoImg.leftTitle = "抓拍人脸";
  //   this.twoImg.rightImg = scope.row.facePhone;
  //   this.twoImg.rightTitle = "注册人脸";
  // }
  // resize() {}
  beforeAvatarUpload(file) {
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error("上传人脸图片大小不能超过 2MB!");
    //   return;
    // }
    getBase64(file.raw).then((res) => {
      this.imageUrl = res;
      this.Form["face"] = res;
    });
  }

  initTreeData(data) {
    if (data.length > 0) {
      data.forEach((item) => {
        if (item.subWorkerGroups && item.subWorkerGroups.length === 0) {
          delete item.subWorkerGroups;
        }
        if (item.subWorkerGroups && item.subWorkerGroups.length > 0) {
          this.initTreeData(item.subWorkerGroups);
        }
      });
    }
  }
  enterCellChange(row, column, cell, event) {
    this.showProperty = column.property;
    this.rowId = row.id;
  }
  leaveCellChange(row, column) {
    this.showProperty = "";
    this.rowId = "";
  }
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }
  created() {
    // this.fetchWorkGroup();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  beforeFaceUpload(file) {
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('上传人脸图片大小不能超过 2MB!');
    //   return;
    // }
    getBase64(file.raw).then((res) => {
      this.uploadImageUrl = res;
      this.Form["face"] = res;
    });
  }
  openUpload(row, type) {
    this.rowline = row;
    this.uploadFaceTitle = type == "update" ? "修改人脸" : "上传人脸";
    this.uploadImageUrl = type == "update" ? row.face : "";
    this.uploadFaceVisible = true;
  }
  confirmUploadFace() {
    if (this.uploadImageUrl == "") {
      this.$message.error("请先添加人脸");
      return;
    }
    // this.upfaceLoading = true;
    let param = {
      face: this.uploadImageUrl,
      id: this.rowline["id"],
    };
    this.uploadFace(param);
  }
  uploadFace(data) {
    if (data.face.indexOf("http") != -1) {
      // this.upfaceLoading = false;
      this.uploadFaceVisible = false;
      this.replayUpfaceLoading = false;
      this.uploadFaceReplayVisible = false;
      this.uploadImageUrl = "";
      return;
    }
    updateAccount(data)
      .then((res) => {
        // this.upfaceLoading = false;
        this.$message.success("添加成功！");
        this.uploadFaceVisible = false;
        this.uploadImageUrl = "";
        this.fetchData(this.initForm);
        this.replayUpfaceLoading = false;
        this.uploadFaceReplayVisible = false;
      })
      .catch((err) => {
        // this.upfaceLoading = false;
        if (err.message.indexOf("相似") != -1) {
          this.uploadFaceReplayVisible = true;
          this.uploadFaceReplaymessage = err.message;
        }
      });
  }
  replayConfirmUploadFace() {
    this.replayUpfaceLoading = true;
    if (this["dialogCreate"]) {
      this.confirmAddPropert("force");
      return;
    }
    let param = {
      face: this.uploadImageUrl,
      id: this.rowline["id"],
      isForce: true,
    };
    this.uploadFace(param);
  }
  // 修改账户
  changeStatus(Obj: object) {
    const form = { status: Obj["Status"], id: Obj["id"] };
    updateAccount(form).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        this["fetchData"](this.initForm);
      }
    });
  }
  ComponentCommand(Status: string, id: string) {
    return {
      id,
      Status,
    };
  }
  // 确定添加工作人员
  confirmAddPropert(type: string) {
    // this.Form["face"] = this.imageUrl;
    let param = { ...this.Form };
    if (type == "force") {
      param["isForce"] = true;
    }
    this.$refs["Forms"]["validate"]((valid) => {
      this.isValite = true;
      if (valid) {
        this.isValite = false;
        this.confirmLoading = true;
        if (this.isUpdate) {
          // if (param['face'].indexOf('http://') > -1) {
          //   param['face'] = null;
          // }
          updateAccount(param)
            .then((res) => {
              if (res.data && res.data.code === 200) {
                this.confirmLoading = false;
                this["message"]("success", "修改成功");
                this["dialogCreate"] = false;
                this["fetchData"](this.initForm);
                this["handleClose"]();
                this.replayUpfaceLoading = false;
                // this.uploadFaceReplayVisible = false;
              }
            })
            .catch((err) => {
              this.confirmLoading = false;
              if (err.message.indexOf("相似") != -1) {
                this.uploadFaceReplayVisible = true;
                this.uploadFaceReplaymessage = err.message;
              }
            });
        } else {
          addAccount(param)
            .then((res) => {
              if (res.data && res.data.code === 200) {
                this.confirmLoading = false;
                this["message"]("success", "添加成功");
                this["dialogCreate"] = false;
                this["fetchData"](this.initForm);
                this["handleClose"]();
                this.replayUpfaceLoading = false;
                this.uploadFaceReplayVisible = false;
              }
            })
            .catch((err) => {
              this.confirmLoading = false;
              if (err.message.indexOf("相似") != -1) {
                this.uploadFaceReplayVisible = true;
                this.uploadFaceReplaymessage = err.message;
              }
            });
        }
      }
    });
  }
  handleClose() {
    this.imageUrl = "";
    this["dialogCreate"] = false;
    this.isValite = false;
    this.$refs["Forms"]["resetFields"]();
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    this.isUpdate = false;
  }
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order == "descending";
    this["fetchData"](this.initForm);
  }
  openDialogUpdate(row) {
    this.editId = row.id;
    this.isUpdate = true;
    for (let key in this.Form) {
      this.Form[key] = row[key];
      if (key === "groupId") {
        this.Form[key] = row["workerGroupId"];
      }
    }
    this.imageUrl = row.face;
    this.groupIdArr = [row["workerGroupId"]];
    this["dialogCreate"] = true;
  }
  // 获取房屋结构
  getWorkTreeData() {
    getWorkGroup().then((res: Object) => {
      // this.TreeData = res["data"]["data"];
      this.TreeDataCans = res["data"]["data"];
      // this.rules["buildingId"].push({
      //   required: true,
      //   trigger: "change",
      //   validator: (rule, value, callback) => {
      //     if (!this.Form["buildingIdArr"].length) {
      //       callback(new Error("请先创建分组和单元楼"));
      //     } else {
      //       callback();
      //     }
      //   }
      // });
    });
    // getWorkTreeData() {
  }
  // 表头添加小图标的render 事件
  renderHeader(h, { column }) {
    // h即为cerateElement的简写，具体可看vue官方文档
    return h("div", [
      h("span", column.label),
      h("i", {
        class: "el-icon-edit",
        style: "color:#409eff;margin-left:5px;",
      }),
    ]);
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table td {
    padding: 12px 0px !important;
  }
}
.property-left {
  .content {
    height: 400px;
  }
  .property-device {
    width: 100%;
    height: 70vh;
    text-align: left;
    background: #fff;
    border: 1px solid #ebeef5;
    overflow-y: auto;
    overflow-x: auto;
    box-shadow: 0px 0px 8px 0px lightgrey;
    padding-bottom: 10px;
  }
}
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
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
}
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
// .rightContent {
//   flex: 1;
//   box-shadow: 0px 6px 5px 0px lightgray;
//   position: relative;
// }
.float {
  width: 250px;
  float: left;
  position: relative;
  z-index: 99;
}
.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
}
.singleInfo {
  width: 40%;
  height: 40px;
  padding: 0px 10px;
  text-align: left;
  line-height: 40px;
  float: left;
  &:nth-child(2),
  &:nth-child(3),
  &:nth-child(5),
  &:nth-child(8),
  &:nth-child(9),
  &:nth-child(6) {
    width: 30%;
  }
}
.reg-face {
  padding: 0 10px;
}
.reg-face img {
  width: 100px;
  height: 100px;
}
.cursor {
  cursor: pointer;
}
.texthidden {
  display: inline-block;
  width: 89px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 30px;
}
.flex {
  display: flex;
  align-items: center;
  align-items: baseline;
}
.top-info {
  align-items: baseline;
}
.pswd {
  /deep/ .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
.el-form-item{
  margin-bottom: 34px;
}
</style>
