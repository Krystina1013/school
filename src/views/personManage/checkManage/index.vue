<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" :min-percent="10" :default-percent="12">
        <template slot="paneL">
          <div class="leftContent">
            <DataTree @fetchData="fetchData" :page="page" :TreeData="TreeData" @getHouseTreeData='getHouseTreeData' :initFormHeader="initForm" @handleBuildingId="handleGroupId" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader :initFormHeader="initForm" ref="actionHeader" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total">
                  <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-s-tools" @click="setDialog=true">
                      批量设置
                    </el-button>
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                      批量删除
                    </el-button>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="showExportIn" v-if="globalUpdateStatus">
                        导入教师信息
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="showFaceExportIn" v-if="globalUpdateStatus">
                        导入人脸
                      </div>
                    </el-dropdown-item>
                    <!-- <el-dropdown-item command="export">导出</el-dropdown-item> -->
                  </el-dropdown-menu>
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
                      <span class="filter-name">状&nbsp;&nbsp;&nbsp;态:</span>&nbsp;&nbsp;
                      <el-select v-model="filterForm.status" placeholder="请选择" class="select-class" size="small">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
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
                  <el-button @click="showTeacherDetails(scope.row)" type="text">
                    {{ scope.row.name }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="img" align="center" label="人脸图像" width='100'>
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
              <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="联系电话">
                <template slot-scope="scope">
                  <span v-if="scope.row.phone.length == 11">{{
                    scope.row.phone
                  }}</span>
                  <span v-else>无电话</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" width="100" prop="status" align="center" label="状态">
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
                      <el-dropdown-item :command="ComponentCommand('DISABLED', row.id)">禁用</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column prop="groupName" :show-overflow-tooltip="true" align="center" label="任课组">
                <template slot-scope="{ row }">
                  <span>{{ row.groupName }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="关联班级">
                <template slot-scope="scope">
                  <el-button @click="showgradeDetails(scope.row.classes)" type="text">
                    点击查看</el-button>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="status" width='100' align="center" label="关注公众号"> <template slot-scope="{ row }">
                  <span :style="{'color':row.followWechat === '1' ? '#67c23a' : '#f56c6c'}">
                    <!-- 1是关注，0是未关注 -->
                    {{ row.followWechat === "1" ? "是" : "否" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" :show-overflow-tooltip="true" align="center" label="创建时间">
                <template slot-scope="{ row }">
                  <span>{{ row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" width="300" prop="note" align="center" label="备注">
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
        </template>
      </split-pane>
    </div>

    <el-dialog top="10vh" class="newDialog" :title="isUpdate ? '修改教师' : '添加教师'" width="700px" :close-on-click-modal="false" :visible.sync="dialogCreate" :before-close="handleClose">
      <el-form class="owner" :model="Form" :rules="rules" ref="Forms" label-width="154px" style="margin-right: 40px">
        <el-form-item style="margin-bottom: 16px" label="姓名:" prop="name">
          <el-input :disabled="nameDisabled" clearable maxlength="10" v-model.trim="Form.name" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="phone">
          <el-input :disabled="nameDisabled" clearable maxlength="11" v-model="Form.phone" placeholder="输入教师电话"></el-input>
        </el-form-item>
        <el-form-item label="电话是否对家长开放:" prop="isPhoneOpen" required="">
          <el-radio-group v-model="Form.isPhoneOpen">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="人脸:" width='100' prop="face">
          <el-upload ref="upload" class="alignLeft avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="任课组:" prop="groupId">
          <el-select multiple style="width: 100%" v-model="Form.groupId" placeholder="请选择任课组">
            <el-option v-for="(ite, it) in TreeData" :key="it" :label="ite.name" :value="ite.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联班级:" prop="class">
          <el-button size="mini" type="primary" @click="dialogChooseGrade.visible = true" style="margin-left: 10px">点击选择</el-button>
        </el-form-item>
        <el-form-item label="已选班级:" v-if="
            dialogChooseGrade.selectedRoom &&
            dialogChooseGrade.selectedRoom.length > 0
          ">
          <span class="grade-tag" v-for="(item, i) in dialogChooseGrade.selectedRoom" :key="i">
            {{ item.houseName }}
          </span>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="备注：" prop="note">
          <el-input type="textarea" v-model.trim="Form.note" :maxlength="200" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" :loading="btnLoading" @click="addUserConfirm">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog top="10vh" class="newDialog" title="批量设置" width="700px" :close-on-click-modal="false" :visible.sync="setDialog" :before-close="handleSetClose">
      <el-form class="owner" :model="setForm" ref="setForm" label-width="150px" style="margin-right: 40px">
        <el-form-item label="任课组:" prop="groupId">
          <el-select multiple style="width: 100%" v-model="setForm.groupId" placeholder="请选择任课组">
            <el-option v-for="(ite, it) in TreeData" :key="it" :label="ite.name" :value="ite.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话是否开放给家长:" prop="isPhoneOpen">
          <el-radio-group v-model="setForm.isPhoneOpen">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleSetClose">取 消</el-button>
        <el-button size="small" type="primary" :loading="btnLoading" @click="addSetConfirm">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 上传人脸 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="300px" :title="uploadFaceTitle" :visible.sync="uploadFaceVisible">
      <el-upload ref="upload" class="avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFaceUpload">
        <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar avatar-single" />
        <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFaceVisible = false; uploadImageUrl = ''">取 消</el-button>
        <el-button size="small" type="primary" :loading="upfaceLoading" :disabled="faceDisabled" @click="confirmUploadFace">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 人脸相似重新上传 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" title="提示" :visible.sync="uploadFaceReplayVisible">
      <!-- <img :src="uploadImageUrl" class="avatar"> -->
      <p>{{ uploadFaceReplaymessage }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFaceReplayVisible = false">取 消</el-button>
        <el-button  type="primary" :loading="replayUpfaceLoading" @click="replayConfirmUploadFace">继续上传</el-button>
      </div>
    </el-dialog>

    <!-- 增加房屋时修改房屋 -->
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />
    <!-- 批量设置过期时间 -->
    <ExportIn :uploadUrl=" env === 'production' ? config.v1 + '/admin/teacher/import' : config.v1 + '/admin/teacher/import'" TmplateName="教师导入模板" :downTemplateUrl="config.v1 + '/admin/teacher/model'" @closeVisible="closeVisible" @successUpload="fetchData(initForm)" :visible.sync="visible" />
    <!-- 导入人脸 -->

    <ExportImg :uploadUrl="config.v1 + '/admin/scence-user/importFace'" :isStudent="false" @closeVisible="closeFaceVisible" @successUpload="fetchData(initForm)" :visible.sync="faceVisible" />

    <!--教师详情-->
    <detailDialog :visible="teacherDetailShow" :form="teacherDetail" @edit="closeStudentDetails" @close="teacherDetailShow = false"></detailDialog>

    <!-- 查看关联班级 -->
    <el-dialog top="10vh" class="newDialog" :close-on-click-modal="false" width="480px" title="查看关联班级" :visible.sync="gradeDetailShow">
      <div class="flex align-items-center justify_center flex_column">
        <div class="item" v-for="(item, index) in classesList" :key="index">
          <span v-if="item.type">{{item.className+' - '}}{{item.type==0?'任课老师':'班主任'}}</span>
          <span v-else>{{item.className}}</span>
        </div>
      </div>
    </el-dialog>
    <!--关联班级-->
    <DialogChooseGrade :multiple="true" v-if="dialogChooseGrade.visible" @selectRoom="handleSelectRoom" @delSelectRoom='HandleDelSelectRoom'></DialogChooseGrade>
  </div>
</template>
<script lang="ts">
declare function require(string): string;
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action } from "vuex-class";
import config from "@/api/config";
import {
  addTeacher,
  updateTeacher,
  updateTeachers,
  updateTeacherStatus,
  teacherGroups,
} from "@/api/peopleApi";
import _axios from "@/plugins/axios.js";
import mixin from "@/config/minxins";
import { getBase64 } from "@/utils/index.js";
import splitPane from "vue-splitpane";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DiaLog = () => import("@/components/dialog.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
const ExportImg = () => import("@/components/exportImg/index.vue");
const DialogChooseGrade = () => import("./components/DialogChooseGrade.vue");
const DataTree = () => import("./components/dataTree.vue");
import detailDialog from "./components/detailDialog.vue";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DiaLog,
    BigImg,
    TwoImg,
    ExportIn,
    DataTree,
    splitPane,
    ExportImg,
    DialogChooseGrade,
    detailDialog,
  },
  filters: {
    status(val: string) {
      const data = {
        "1": "离校",
        "2": "在校",
      };
      return data[val];
    },
  },
})
export default class CheckManage extends Vue {
  options: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
  };
  selectVal: Array<object> = []; //选择的数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  TreeData: Array<Object> = []; // 树形结构数据
  classesList: Array<Object> = []; // 树形结构数据
  queryBuildingId: String = ""; //通过dataTree获取到的宿舍楼id
  queryBuildingName: String = ""; //通过dataTree获取到的宿舍楼名称
  exportUrl: string = config.v1 + "/admin/scence-user/export";
  config: any = config;
  dialogChooseGrade: any = {
    visible: false,
    selectedRoom: [],
    delSelectedRoom: [],
  };
  @Action("SET_TOTAL") set_total: any;
  private rowSpan: number = 12;
  gradeDetailShow: boolean = false; // 查看关联班级
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
  UserType: string = "owner";
  spanArray: Array<number> = []; // 合并单元格
  index: number = 0; // 合并单元格参数
  env: string = process.env.NODE_ENV;
  houseIndex: number = 0; // 合并单元格
  data: Array<object> = []; // 未分单元格人员数据
  personImg: string = require("@/assets/defaultPerson.png"); // 人员头像
  Form: any = {
    name: "",
    face: "",
    id: "",
    phone: "",
    isPhoneOpen: "0",
    note: "",
    status: "",
    groupId: "",
  };
  initForm: object = {
    url: config.v1 + "/admin/teacher/page",
    method: "get",
  };
  filterForm: object = {
    name: "",
    phone: "",
    status: "",
    // groupId: "",
  };
  deleteForm: object = {
    url: config.v1 + "/admin/teacher",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的老师, 删除后老师将不存在,请谨慎操作!",
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
    groupId: [{ required: true, message: "请选择任课组", trigger: "blur" }],
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
  userId: string = "";
  phoneCopy: string = "";
  noteString: string = ""; // 修改备注

  private editData: String = ""; //行内修改 保存未改变的值
  private editForm: Object = {
    //修改表单字段
    id: "", //目标联系人id
  };
  isValite: boolean = false;
  overtime: string = ""; //批量设置过期时间
  overTimeLoad: boolean = false;
  isUpdate: boolean = false; //是否为修改
  rowLine: any = {}; //行数据
  teacherDetailShow: boolean = false; //详情弹窗
  teacherDetail: Object = {};
  // 状态
  statusOptions: Array<object> = [
    {
      value: "USED",
      label: "正常",
    },
    {
      value: "DISABLED",
      label: "禁用",
    },
  ];

  // 批量设置
  setDialog: Boolean = false;
  setForm: any = {
    groupId: [],
    isPhoneOpen: "",
  };

  handleSelectRoom(item) {
    this.dialogChooseGrade["selectedRoom"] = item;
  }
  HandleDelSelectRoom(item) {
    this.dialogChooseGrade["delSelectedRoom"] = item;
  }
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
  showTeacherDetails(row) {
    this.teacherDetailShow = true;
    this.teacherDetail = row;
  }
  closeStudentDetails() {
    this.teacherDetailShow = false;
    this.openUpdate(this.teacherDetail);
  }
  showgradeDetails(row) {
    this.classesList = row;
    this.gradeDetailShow = true;
  }
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.getTreeList();
  }
  getHouseTreeData(type) {
    if (type != "add") {
      this.fetchData(this.initForm);
    }
    this.getTreeList();
  }
  async getTreeList() {
    let { data } = await teacherGroups();
    let treeData = [];
    if (data.data) {
      treeData = this.initGrade(data.data);
    }
    this.TreeData = treeData;
  }
  initGrade(dataArr) {
    let arr: any = [];
    if (dataArr && dataArr.length > 0) {
      dataArr.forEach((item: any) => {
        arr.push({
          name: item["groupName"],
          id: item["id"],
        });
      });
    }
    return arr;
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
  // 修改教室门禁状态
  changeStatus(Obj: object) {
    console.log(Obj);
    const form = { status: Obj["Status"], id: Obj["id"] };
    updateTeacherStatus(form).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        this["fetchData"](this.initForm);
      }
    });
  }
  // 修改备注
  confirmUpdateNote(row) {
    updateTeacher({
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
    updateTeacher(data)
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
    this.Form = {
      name: "",
      class: "",
      face: "",
      id: "",
      phone: "",
      note: "",
      status: "",
      groupId: "",
      isPhoneOpen:'0'
    };
    this.isValite = false;
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreate"] = false;
    this.nameDisabled = false;
    this.imageUrl = "";
    this.isUpdate = false;
    this.dialogChooseGrade.selectedRoom = [];
    this.$refs["upload"]["clearFiles"]();
  }

  handleSetClose() {
    this.setForm = {
      groupId: [],
      isPhoneOpen: "",
    };
    this.setDialog = false;
  }

  addSetConfirm() {
    this.btnLoading = true;
    let ids = [];
    this.selectVal.forEach((v: any) => {
      ids.push(v.id);
    });
    let param = {
      ids: ids,
      isPhoneOpen: this.setForm.isPhoneOpen,
      groupIds: this.setForm.groupId,
    };
    updateTeachers(param)
      .then((res) => {
        if (res.data.code == 200) {
          this.btnLoading = false;
          this["message"]("success", "设置成功");
          this.fetchData(this.initForm);
          this.handleSetClose();
        }
      })
      .catch((err) => {
        this.btnLoading = false;
      });
  }

  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }

  ComponentCommand(Status: string, id: string, row: object) {
    return {
      ...row,
      id,
      Status,
    };
  }
  // 确定添加住户
  addUserConfirm(type: string) {
    this.btnLoading = true;
    this.$refs["Forms"]["validate"]((valid) => {
      this.isValite = true;
      let classes: any = null;
      // 新增关联
      if (this.dialogChooseGrade.selectedRoom.length > 0) {
        classes = [];
        this.dialogChooseGrade.selectedRoom.forEach((item) => {
          let type: any = null;
          type = item.type;
          classes.push({ classId: item.id, type });
        });
      } else {
        classes = [];
      }
      if (valid) {
        this.isValite = false;
        let param = {
          id: null as any,
          name: this.Form.name,
          phone: this.Form.phone,
          note: this.Form.note,
          type: this.Form.type,
          face: this.imageUrl as any,
          isForce: false,
          classes: classes,
          groupIds: this.Form.groupId,
          deleteIds: this.dialogChooseGrade.delSelectedRoom,
          isPhoneOpen: this.Form.isPhoneOpen,
        };
        if (this.Form.id) {
          //教师修改
          param.id = this.Form.id;
          if (param.face.indexOf("http://") > -1) {
            //图片未修改
            param.face = null;
          }
          updateTeacher(param)
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
              this.btnLoading = false;
              if (err.message && err.message.indexOf("相似") != -1) {
                this.uploadFaceReplayVisible = true;
                this.uploadFaceReplaymessage = err.message;
              }
            });
        } else {
          if (type === "force") {
            param.isForce = true;
          }
          addTeacher(param)
            .then((res) => {
              if (res.data.code === 200) {
                this["message"]("success", "添加成功");
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
              this.btnLoading = false;
              if (err.message && err.message.indexOf("相似") != -1) {
                this.uploadFaceReplayVisible = true;
                this.uploadFaceReplaymessage = err.message;
              }
            });
        }
      } else {
        this.btnLoading = false;
      }
    });
  }
  handleGroupId(data) {
    /**@description 获取宿舍楼id */
    this.filterForm["groupId"] = data.id;
  }
  resize() {}

  tabRowClassName({ row, rowIndex }) {
    let index = row.indexSort + 1;
    if (row.indexSort % 2 == 0) {
      return "info-row";
    }
    return "";
  }

  // 合并单元格
  objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (
      columnIndex === 0 ||
      columnIndex === 1 ||
      columnIndex === 2 ||
      columnIndex === 3 ||
      columnIndex === 4 ||
      columnIndex === 9
    ) {
      const _row_1 = this.spanArray[rowIndex];
      const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
      return {
        rowspan: _row_1,
        colspan: _col_1,
      };
    }
  }
  handleCommand(val) {}
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = val;
  }
  openUpdate(row) {
    this.Form = { ...row };
    if (!row.isPhoneOpen) {
      this.Form.isPhoneOpen = "0";
    }
    if (this.Form.groupId && this.Form.groupId.length > 1) {
      this.Form.groupId = this.Form.groupId.split(",");
    }
    this.teacherDetailShow = false;
    this["dialogCreate"] = true;
    this.imageUrl = row.face;
    row.classes.forEach((v: any) => {
      let teachName;
      if (v.type != null && v.type != undefined) {
        teachName = v.type == 0 ? "任课老师" : "班主任";
        v.houseName = v.className + " - " + teachName;
      } else {
        v.houseName = v.className;
      }
    });
    this.dialogChooseGrade.selectedRoom = row.classes;
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
.components-container {
  height: 100%;
}
.rightContent {
  height: calc(100vh - 80px);
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
.item {
  width: 200px;
  height: 32px;
  line-height: 32px;
}
.avatar-uploader {
  text-align: center;
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
  width: 178px;
  height: 178px;
  display: block;
}
.detail-person-img {
  width: 180px;
  height: 180px;
  border: 1px solid #d8d8d8;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.avatar-single {
  width: 150px;
}
.alignLeft {
  text-align: left;
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
  overflow: hidden;
  // margin-bottom: 30px;
  .label {
    float: left;
  }
  .value {
    float: left;
  }
  .note-value {
    margin-top: 14px;
    width: 90%;
    padding: 10px 0;
    line-height: 24px;
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
  // margin-right: 10px;
}
// // 详情弹框
// .studentBack {
//   padding: 14px 16px;
// }
// .studentCom {
//   display: flex;
//   align-items: center;
// }
// .noteCom {
//   height: auto;
//   align-items: inherit;
//   min-height: 46px;
// }
</style>
