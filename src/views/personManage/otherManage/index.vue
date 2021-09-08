<template>
  <div class="app-container">
    <div class="components-container">
      <div class="rightContent">
        <el-row>
          <el-col :span="24">
            <ActionHeader :initFormHeader="initForm" ref="actionHeader" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false">
              批量删除
              <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                  批量删除
                </el-button>
              </div>
              <div slot="houseNum">
                <div class="word-filter">
                  <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                  <el-input clearable placeholder="请输入需要查找的姓名" @keyup.enter.native="emitFetchData" class="input-filter" maxlength="20" v-model.trim="filterForm.name" size="small"></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">联系电话:</span>
                  <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="11" placeholder="输入需要查找的电话号码" v-model.trim="filterForm.phone" size="small"></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">身份证号:</span>
                  <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="18" placeholder="输入需要查找的身份证号" v-model.trim="filterForm.idCard" size="small"></el-input>
                </div>
              </div>
            </ActionHeader>
          </el-col>
        </el-row>

        <el-table :data="list_data" border highlight-current-row v-loading="showLoading" :row-class-name="tabRowClassName" @selection-change="handleSelectionChange" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
          <el-table-column v-if="globalUpdateStatus" type="selection" align="center"></el-table-column>
          <el-table-column type="index" width="60" class="indexNum" align="center" label="序号">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="姓名">
            <template slot-scope="scope">
              <el-button @click="showOtherDetails(scope.row)" type="text">
                {{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="100" prop="phone" align="center" label="身份证号">
            <template slot-scope="scope">
              <span>{{ scope.row.idCard }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="联系电话">
            <template slot-scope="scope">
              <span v-if="scope.row.phone.length == 11">{{
                    scope.row.phone
                  }}</span>
              <span v-else>无电话</span>
            </template>
          </el-table-column>
          <el-table-column prop="img" align="center" label="人脸图像">
            <template slot-scope="scope">
              <span class="high_showIconBtn" v-if="scope.row.face">
                <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'img')?'':'transparent'}" @click="openUpload(scope.row, 'update')"></i>
                <img class="capture-img cur-img" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" :src="scope.row.face" alt />
              </span>
              <span v-else>
                <el-button size="mini" type="primary" @click="openUpload(scope.row)">上传人脸</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :show-overflow-tooltip="true" align="center" label="创建时间">
            <template slot-scope="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="note" align="center" label="备注">
            <template slot-scope="scope">
              <span class="showIconBtn" v-show="!scope.row.noteStatus">
                <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'note')?'':'transparent'}" @click="focusNoteInput(scope.row)"></i>
                {{ scope.row.note || "--" }}
              </span>
              <el-input :ref="scope.row.id" size="mini" @blur="confirmUpdateNote(scope.row)" v-model.trim="noteString" v-show="scope.row.noteStatus" :clearable="true" :maxlength="200" placeholder="输入备注"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" v-if="globalUpdateStatus">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="openUpdate(scope.row)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="pageChange" :page-size="page.limit" :current-page="page.page" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
      </div>
    </div>

    <el-dialog top="10vh" class="newDialog" :title="isUpdate?'修改':'添加'" width="700px" :close-on-click-modal="false" :visible.sync="dialogCreate" :before-close="handleClose">
      <el-form class="owner" :model="Form" :rules="rules" ref="Forms" label-width="100px" style="margin-right: 40px">
        <el-form-item style="margin-bottom: 16px" label="姓名:" prop="name">
          <el-input :disabled="nameDisabled" clearable maxlength="10" v-model.trim="Form.name" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idCard">
          <el-input clearable maxlength="18" v-model="Form.idCard" placeholder="输入身份证号"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="人脸图像:" prop="face">
          <el-upload ref="upload" class="alignLeft avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <el-input clearable maxlength="11" v-model="Form.phone" placeholder="输入联系电话"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="备注：" prop="note">
          <el-input type="textarea" v-model.trim="Form.note" :maxlength="200" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" :loading="btnLoading" @click="addUserConfirm">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 上传人脸 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="300px" :title="uploadFaceTitle" :visible.sync="uploadFaceVisible">
      <el-upload ref="upload" class="avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFaceUpload">
        <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar avatar-single" />
        <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="
            uploadFaceVisible = false;
            uploadImageUrl = '';
          ">取 消</el-button>
        <el-button size="small" type="primary" :loading="upfaceLoading" :disabled='faceDisabled' @click="confirmUploadFace">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 人脸相似重新上传 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" title="提示" :visible.sync="uploadFaceReplayVisible">
      <p>{{ uploadFaceReplaymessage }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFaceReplayVisible = false">取 消</el-button>
        <el-button type="primary" :loading="replayUpfaceLoading" @click="replayConfirmUploadFace">继续上传</el-button>
      </div>
    </el-dialog>

    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />

    <detailDialog :visible="otherDetailShow" :form="otherDetail" @edit="closeOtherDetails" @close="otherDetailShow = false"></detailDialog>
    <!-- <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="700px" title="其他人员详情" :visible.sync="otherDetailShow">
      <el-row :gutter="0" class="flex studentBack">
        <el-col :span="8">
          <div class="commonRow detail-con-img">
            <img v-if="otherDetail.face" :src="otherDetail.face" class="avatar avatar-single" /><img v-else src="../../../assets/capture.png" />

          </div>
        </el-col>
        <el-col :span="16" style="margin-left:16px; margin-top:12px;">
          <div class="commonRow studentCom">
            <div class="label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</div>
            <div class="value" :title="otherDetail.name">{{ otherDetail.name }}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">联系电话：</div>
            <div class="value" :title="otherDetail.phone">{{ otherDetail.phone}}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">身份证号：</div>
            <div class="value" :title="otherDetail.idCard">{{ otherDetail.idCard}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24" style="margin-top:15px;">
          <div class="commonRow studentCom">
            <div class="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</div>
            <div class="value note-value" :title="otherDetail.note">{{ otherDetail.note}}</div>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top:15px;">
          <div class="commonRow ml-50">
            <el-button size="small" @click="openUpdate(otherDetail)" type="primary" style="margin-left:44%;">编辑</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog> -->
  </div>
</template>
<script lang="ts">
declare function require(string): string;
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action } from "vuex-class";
import config from "@/api/config";
import { addOther, updateOther } from "@/api/peopleApi.ts";
import _axios from "@/plugins/axios.js";
import mixin from "@/config/minxins";
import { getBase64 } from "@/utils/index.js";
import splitPane from "vue-splitpane";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DiaLog = () => import("@/components/dialog.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
import detailDialog from "./components/detailDialog.vue";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DiaLog,
    BigImg,
    TwoImg,
    splitPane,
    detailDialog,
  },
})
export default class CheckManage extends Vue {
  options: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
  };
  selectVal: Array<object> = []; //选择的数据
  TreeData: Array<Object> = []; // 树形结构数据
  queryBuildingId: String = ""; //通过dataTree获取到的宿舍楼id
  queryBuildingName: String = ""; //通过dataTree获取到的宿舍楼名称
  exportUrl: string = config.v1 + "/admin/scence-user/export";
  config: any = config;
  @Action("SET_TOTAL") set_total: any;
  btnLoading: boolean = false;
  faceDisabled: boolean = true;
  faceVisible: boolean = false; //人脸导入
  uploadFaceVisible: boolean = false;
  replayUpfaceLoading: boolean = false; //重新上传
  uploadFaceReplayVisible: boolean = false; //重新上传dialog
  uploadFaceReplaymessage: string = ""; //重新上传dialog 的title
  uploadFaceTitle: string = "上传人脸";
  upfaceLoading: boolean = false;
  uploadImageUrl: string = ""; //单独上传人脸
  rowline: object = {}; //每行数据
  private imageUrl: string = ""; //人脸
  index: number = 0; // 合并单元格参数
  env: string = process.env.NODE_ENV;
  data: Array<object> = []; // 未分单元格人员数据
  Form: any = {
    name: "",
    face: "",
    id: "",
    phone: "",
    note: "",
    idCard: "",
  };
  initForm: object = {
    url: config.v1 + "/admin/other/page",
    method: "get",
  };
  filterForm: object = {
    name: "",
    phone: "",
    idCard: "",
  };
  deleteForm: object = {
    url: config.v1 + "/admin/other",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的人员, 删除后该人员将不存在,请谨慎操作!",
  };
  loading: boolean = false;
  nameDisabled: boolean = false;
  visible: boolean = false; // 批量导入状态
  updateArray: Array<string> = ["noteStatus"];
  rules: any = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    face: [{ required: true, message: "请上传人脸", trigger: "change" }],
    phone: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!this["is_Phone"](value)) {
            callback(new Error("填写正确的手机号"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
    idCard: [
      {
        required: false,
        validator: (rule, value, callback) => {
          if (
            !value ||
            (value && /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))
          ) {
            callback();
          } else {
            callback(new Error("填写正确的身份证号"));
          }
        },
        trigger: "blur",
      },
    ],
  };

  rowId: String = "";
  showProperty: String = "";
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };
  noteString: string = ""; // 修改备注
  isValite: boolean = false;
  overtime: string = ""; //批量设置过期时间
  overTimeLoad: boolean = false;
  isUpdate: boolean = false; //是否为修改
  rowLine: any = {}; //行数据
  otherDetailShow: boolean = false; //详情弹窗
  otherDetail: Object = {};
  @Watch("imageUrl")
  getImageUrl() {
    if (this.isValite)
      this.$refs["Forms"]["validateField"]("face", (valid) => {
        if (valid) {
          this.isValite = false;
        }
      });
  }
  closeFaceVisible(flag: boolean) {
    this.faceVisible = flag;
  }
  showFaceExportIn() {
    this.faceVisible = true;
  }
  showOtherDetails(row) {
    this.otherDetailShow = true;
    this.otherDetail = row;
  }
  closeOtherDetails(val) {
    this.otherDetailShow = false;
    this.openUpdate(this.otherDetail)
  }
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  enterCellChange(row, column, cell, event) {
    this.showProperty = column.property;
    this.rowId = row.id;
  }
  leaveCellChange(row, column) {
    this.showProperty = "";
    this.rowId = "";
  }
  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row["noteStatus"] = true;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }
  // 修改备注
  confirmUpdateNote(row) {
    updateOther({
      id: row.id,
      note: this.noteString,
    })
      .then((res) => {
        if (res.data.code === 200) {
          this["message"]("success", "修改成功");
          row.noteStatus = false;
          this.noteString = "";
          this.fetchData(this.initForm);
        } else {
          row.noteStatus = false;
          this["message"]("error", res.data.message);
        }
      })
      .catch((error) => {
        row.noteStatus = false;
      });
  }
  beforeAvatarUpload(file) {
    getBase64(file.raw).then((res) => {
      this.imageUrl = res;
      this.Form.face = res;
    });
  }
  openUpload(row, type) {
    this.rowline = row;
    this.uploadFaceTitle = type == "update" ? "修改人脸" : "上传人脸";
    this.uploadImageUrl = type == "update" ? row.face : "";
    this.uploadFaceVisible = true;
    this.faceDisabled = true;
  }
  beforeFaceUpload(file) {
    getBase64(file.raw).then((res) => {
      this.uploadImageUrl = res;
      this.faceDisabled = false;
    });
  }
  confirmUploadFace() {
    if (this.uploadImageUrl == "") {
      this.$message.error("请先添加人脸");
      return;
    }
    this.upfaceLoading = true;
    let param = {
      face: this.uploadImageUrl,
      id: this.rowline["id"],
      isForce: true,
    };
    this.uploadFace(param);
  }
  uploadFace(data) {
    if (data.face.indexOf("http://") != -1) {
      this.upfaceLoading = false;
      this.uploadFaceVisible = false;
      this.replayUpfaceLoading = false;
      this.uploadFaceReplayVisible = false;
      this.uploadImageUrl = "";
      return;
    }
    updateOther(data)
      .then((res) => {
        this.upfaceLoading = false;
        this.$message.success("添加成功！");
        this.uploadFaceVisible = false;
        this.replayUpfaceLoading = false;
        this.uploadFaceReplayVisible = false;
        this.uploadImageUrl = "";
        this.fetchData(this.initForm);
      })
      .catch((err) => {
        this.upfaceLoading = false;
        this.replayUpfaceLoading = false;
        if (err.message.indexOf("相似") != -1) {
          this.uploadFaceReplayVisible = true;
          this.uploadFaceReplaymessage = err.message;
        }
      });
  }
  replayConfirmUploadFace() {
    this.replayUpfaceLoading = true;
    if (this["dialogCreate"]) {
      this.addUserConfirm("force");
      return;
    }
    let param = {
      face: this.uploadImageUrl,
      id: this.rowline["id"],
      isForce: true,
    };
    this.uploadFace(param);
  }
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍人脸";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }

  /**
   *
   * @param page 关闭添加/修改框
   */
  handleClose() {
    // for (let key in this.Form) {
    //   this.Form[key] = "";
    // }
    this.Form = {
      name: "",
      face: "",
      id: "",
      phone: "",
      note: "",
      idCard: "",
    };
    this.isValite = false;
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreate"] = false;
    this.nameDisabled = false;
    this.imageUrl = "";
    this.isUpdate = false;
    this.$refs["upload"]["clearFiles"]();
  }

  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }

  // 确定添加人员
  addUserConfirm(type: string) {
    this.btnLoading = true;
    this.$refs["Forms"]["validate"]((valid) => {
      this.isValite = true;
      if (valid) {
        this.isValite = false;
        let param = {
          id: null as any,
          name: this.Form.name,
          idCard: this.Form.idCard,
          phone: this.Form.phone,
          note: this.Form.note,
          face: this.imageUrl as any,
          isForce: false,
        };
        if (this.Form.id) {
          param.id = this.Form.id;
          if (param.face.indexOf("http://") > -1) {
            //图片未修改
            param.face = null;
          }
          updateOther(param)
            .then((res) => {
              if (res.data.code === 200) {
                this["message"]("success", "修改成功");
                this["dialogCreate"] = false;
                this.Form["house"] = [];
                this["handleClose"]();
                this.fetchData(this.initForm);
                this.btnLoading = false;
                this.replayUpfaceLoading = false;
                this.uploadFaceReplayVisible = false;
              }
            })
            .catch((err) => {
              if (err.message.indexOf("相似") != -1) {
                this.uploadFaceReplayVisible = true;
                this.uploadFaceReplaymessage = err.message;
              }
              this.btnLoading = false;
            });
        } else {
          if (type === "force") {
            param.isForce = true;
          }
          addOther(param)
            .then((res) => {
              if (res.data.code === 200) {
                this["message"]("success", "添加成功");
                this["dialogCreate"] = false;
                // this.Form["house"] = [];
                this["handleClose"]();
                this.fetchData(this.initForm);
                this.btnLoading = false;
                this.replayUpfaceLoading = false;
                this.uploadFaceReplayVisible = false;
              }
            })
            .catch((err) => {
              if (err.message.indexOf("相似") != -1) {
                this.uploadFaceReplayVisible = true;
                this.uploadFaceReplaymessage = err.message;
              }
              this.btnLoading = false;
            });
        }
      } else {
        this.btnLoading = false;
      }
    });
  }

  tabRowClassName({ row, rowIndex }) {
    let index = row.indexSort + 1;
    if (row.indexSort % 2 == 0) {
      return "info-row";
    }
    return "";
  }

  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = val;
  }
  openUpdate(row) {
    for (const key in this.Form) {
      this.Form[key] = row[key];
    }
    this.otherDetailShow = false;
    this["dialogCreate"] = true;
    this.imageUrl = row.face;
    this.isUpdate = true;
    this.rowLine = row;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-button--mini {
    padding: 5px 10px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #e4e7ed;
  }
}
.main {
  display: flex;
  .rightContent {
    height: 65vh;
    flex: 1;
    position: relative;
  }
}
.app-container {
  height: calc(100% - 15px);
}
.rightContent {
  height: calc(100vh - 80px);
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
.avatar-uploader {
  text-align: center;
}
.alignLeft {
  text-align: left;
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
  width: 150px;
  height: auto;
  display: block;
}
.avatar-single {
  width: 150px;
}
.mainAddContain {
  width: 100%;
  height: 200px;
  display: flex;
  .pic {
    width: 140px;
    height: 140px;
    flex: none;
    overflow: hidden;
    border: 1px dotted gray;
    font-size: 48px;
    text-align: center;
    line-height: 140px;
    border-radius: 10px;
  }
  .form {
    flex: 1;
  }
}
.floatForm {
  width: 50%;
  float: left;
  position: relative;
  z-index: 999;
}
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
.el-icon-edit {
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
}
.blueCircleBtn {
  cursor: pointer;
  color: #589ff8;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #dcecfd;
  background: #eef5fe;
  border-radius: 20px;
  outline: none;
}
.redCircleBtn {
  cursor: pointer;
  color: #e57471;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #f9e3e3;
  background: #fcf1f0;
  border-radius: 20px;
  outline: none;
}
::v-deep {
  .miniPicker {
    width: 90px;
    input {
      padding-left: 20px;
      padding-right: 5px;
      height: 28px !important;
    }
    .el-icon-date {
      width: 10px;
    }
  }
}
.cur-img {
  cursor: pointer;
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
.reg-face {
  width: 100px;
  height: 100px;
}
.cur {
  cursor: pointer;
  display: inline-block;
  width: 100%;
}
.commonRow {
  // overflow: hidden;
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
.mg-50 {
  margin-top: 50px;
}
.ml-50 {
  margin-left: 50px;
}
.grade-tag {
  display: inline-block;
  margin-right: 10px;
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
