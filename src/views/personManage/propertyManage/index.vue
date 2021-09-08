<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <DataTree @fetchData="fetchData" :page="page" :TreeData="TreeData" :initFormHeader="initForm" :dataFormate="propsOption" @fetchWorkGroup="fetchWorkGroup" @handleBuildingId="handleGroupId" @getWorkTreeData="getWorkTreeData" :type="'workGroup'" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" ref="actionHeader" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="true">
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
                        导入职工信息
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="showFaceExportIn" v-if="globalUpdateStatus">
                        导入职工人脸
                      </div>
                    </el-dropdown-item>
                    <!-- <el-dropdown-item command="export">导出</el-dropdown-item> -->
                  </el-dropdown-menu>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="20" placeholder="输入需要查找的姓名" v-model.trim="filterForm.name" size="small"></el-input>
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

            <el-table :data="list_data" stripe border v-loading="showLoading" @selection-change="handleSelectionChange" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange" @sort-change="sortChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" align="center"></el-table-column>
              <el-table-column type="index" width="60" align="center" class="indexNum" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" :show-overflow-tooltip="true" align="center" label="姓名">
                <template slot-scope="scope">
                  <el-button @click="showPropertyDetails(scope.row)" type="text">
                    {{ scope.row.name }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="face" align="center" label="人脸图像" width="100">
                <template slot-scope="scope">
                  <span class="high_showIconBtn" v-if="scope.row.face">
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'face')?'':'transparent'}" @click="openUpload(scope.row, 'update')"></i>
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
              <el-table-column prop="status" width="100" align="center" label="状态">
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
              <el-table-column prop="workerGroupName" width="100" align="center" label="分组">
              </el-table-column>
              <el-table-column prop="workerGroupName" width="100" align="center" label="关注公众号">
                <template slot-scope="scope">
                  <span v-if="scope.row.followWechat === '1'" style="color:#67c23a">是</span>
                  <span v-else style="color:#f56c6c">否</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="createTime" align="center" label="创建时间"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
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
                  <el-button type="text" size="mini" @click="openDialogUpdate(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :current-page="page.page" :page-size="page.limit" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
            <div style="z-index: 9" class="menu-control" @click="menuVisible">
              <p class="close-menu">
                <i class="iconfont icon-left icon-class"></i>
              </p>
            </div>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog class="newDialog" :close-on-click-modal="false" :title="isUpdate ? '修改职工人员' : '添加职工人员'" :visible.sync="dialogCreate" width="620px" :before-close="handleClose" @open="openAdd">
      <el-form :model="Form" :rules="FormRules" ref="Forms" label-width="140px">
        <el-form-item label="姓名:" prop="name">
          <el-input clearable v-model.trim="Form.name" maxlength="30" placeholder="输入职工人员姓名"></el-input>
        </el-form-item>
        <el-form-item label="分组:" prop="groupId">
          <el-cascader style="width: 100%" v-model="groupIdArr" :options="TreeDataCans" :props="{
              label: 'name',
              children: 'subWorkerGroups',
              value: 'id',
            }" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="人脸:" prop="face">
          <el-upload ref="upload" class="alignLeft avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item style="height: 40px" label="联系电话:" prop="phone">
          <el-input class="phone-position" v-model="Form.phone" style="height: 40px" placeholder="输入职工人员联系电话" :maxlength="11" clearable @keyup.native="UpNumber" @keydown.native="UpNumber" @change="clearableBtn" @input="hint" @focus="hintFocus" @blur="hintBlur" @mouseover.native="hint(Form.phone)" @mouseout.native="hint(Form.phone)"></el-input>
        </el-form-item>
        <el-form-item label="是否使用小程序:" :rules="{ required: true }">
          <el-radio-group v-model="Form.useMiniApp">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="Form.useMiniApp == '1'" label="是否查看实时监控:" :rules="{ required: true }">
          <el-radio-group v-model="Form.isRealVideo">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="Form.useMiniApp == '1'" label="是否查看抓拍记录:" :rules="{ required: true }">
          <el-radio-group v-model="Form.useSnapRecords">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="Form.useMiniApp == '1'" label="是否查看考勤:" :rules="{ required: true }">
          <el-radio-group v-model="Form.isCheckAttendance">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="Form.useMiniApp === '1'" label="微信接受预警:">
          <el-checkbox-group v-model="Form.warnType">
            <el-checkbox label="CARE_MAN" value="CARE_MAN">关注人员预警</el-checkbox>
            <el-checkbox label="STRANGER" value="STRANGER">陌生人预警</el-checkbox>
            <el-checkbox label="AREA" value="AREA">区域预警</el-checkbox>
            <el-checkbox label="DEVICE_DOWN" value="DEVICE_DOWN">设备离线预警</el-checkbox>
            <el-checkbox label="MOUSE" value="MOUSE">厨房老鼠预警</el-checkbox>
            <el-checkbox label="CHEF_HAT" value="CHEF_HAT">厨师帽预警</el-checkbox>
            <el-checkbox label="VOICE_ALERT" value="VOICE_ALERT">声音预警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="Form.useMiniApp === '1'" label="短信接受预警:">
          <el-checkbox-group v-model="Form.smsWarnType">
            <el-checkbox label="CARE_MAN" value="CARE_MAN">关注人员预警</el-checkbox>
            <el-checkbox label="AREA" value="AREA">区域预警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注:" style="clear: both" prop="note">
          <el-input style="width: 410px" type="textarea" @input="constraintLength(Form.note, '200')" :maxlength="200" v-model.trim="Form.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="confirmAddPropert" :loading="confirmLoading">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog class="newDialog" :close-on-click-modal="false" title="批量设置" :visible.sync="setDialog" width="620px" :before-close="handleSetClose" @open="openAdd">
      <el-form :model="setForm" ref="setForm" label-width="140px">
        <el-form-item label="分组:" prop="groupId">
          <el-cascader style="width: 100%" v-model="setgroupIdArr" :options="TreeDataCans" :props="{
              label: 'name',
              children: 'subWorkerGroups',
              value: 'id',
            }" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="是否使用小程序:">
          <el-radio-group v-model="setForm.useMiniApp">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="setForm.useMiniApp == '1'" label="是否查看实时监控:">
          <el-radio-group v-model="setForm.isRealVideo">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="setForm.useMiniApp == '1'" label="是否查看抓拍记录:">
          <el-radio-group v-model="setForm.useSnapRecords">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="setForm.useMiniApp == '1'" label="是否查看考勤:">
          <el-radio-group v-model="setForm.isCheckAttendance">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="setForm.useMiniApp == '1'" label="微信接受预警:">
          <el-checkbox-group v-model="setForm.warnType">
            <el-checkbox label="CARE_MAN" value="CARE_MAN">关注人员预警</el-checkbox>
            <el-checkbox label="STRANGER" value="STRANGER">陌生人预警</el-checkbox>
            <el-checkbox label="AREA" value="AREA">区域预警</el-checkbox>
            <el-checkbox label="DEVICE_DOWN" value="DEVICE_DOWN">设备离线预警</el-checkbox>
            <el-checkbox label="MOUSE" value="MOUSE">厨房老鼠预警</el-checkbox>
            <el-checkbox label="CHEF_HAT" value="CHEF_HAT">厨师帽预警</el-checkbox>
            <el-checkbox label="VOICE_ALERT" value="VOICE_ALERT">声音预警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="setForm.useMiniApp == '1'" label="短信接受预警:">
          <el-checkbox-group v-model="setForm.smsWarnType">
            <el-checkbox label="CARE_MAN" value="CARE_MAN">关注人员预警</el-checkbox>
            <el-checkbox label="AREA" value="AREA">区域预警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleSetClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="addSetConfirm" :loading="confirmLoading">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 上传人脸 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="300px" :title="uploadFaceTitle" :visible.sync="uploadFaceVisible">
      <el-upload ref="upload" class="avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFaceUpload">
        <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar avatar-single" />
        <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click=" uploadFaceVisible = false; uploadImageUrl = ''; upfaceLoading = false">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" :loading="upfaceLoading" :disabled="faceDisabled" @click="confirmUploadFace">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 人脸相似重新上传 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" title="提示" :visible.sync="uploadFaceReplayVisible">
      <!-- <img :src="uploadImageUrl" class="avatar"> -->
      <p>{{ uploadFaceReplaymessage }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="
            uploadFaceReplayVisible = false;
            replayUpfaceLoading = false;
          ">取 消</el-button>
        <el-button style="margin-left:18px" type="primary" :loading="replayUpfaceLoading" @click="replayConfirmUploadFace">继续上传</el-button>
      </div>
    </el-dialog>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />

    <!--职工详情-->
    <detailDialog :visible="propertyDetailShow" :form="propertyDetail" @edit="closePropertyDetails" @close="propertyDetailShow = false"></detailDialog>

    <!-- 导入人脸 -->
    <ExportIn :uploadUrl=" env === 'production' ? config.v1 + '/admin/worker/import' : config.v1 + '/admin/worker/import'" TmplateName="职工导入模板" :downTemplateUrl="config.v1 + '/admin/worker/model'" @closeVisible="closeVisible" @successUpload="fetchData(initForm)" :visible.sync="visible" />
    <!-- 导入人脸 -->

    <ExportImg :uploadUrl="config.v1 + '/admin/scence-user/importWorkerFace'" :isStudent="false" @closeVisible="closeFaceVisible" @successUpload="fetchData(initForm)" :visible.sync="faceVisible" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import config from "@/api/config";
import _axios from "@/plugins/axios.js";
const BigImg = () => import("@/components/BigImg/index.vue");
import { addWorker, updateWorker, updateWorkers } from "@/api/peopleApi.ts";
import { getWorkGroup } from "@/api/houseApi.ts";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
const ExportImg = () => import("@/components/exportImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
import splitPane from "vue-splitpane";
import { getBase64 } from "@/utils/index.js";
import detailDialog from "./components/detailDialog.vue";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    splitPane,
    BigImg,
    TwoImg,
    ExportIn,
    ExportImg,
    detailDialog,
  },
})
export default class PropertyManage extends Vue {
  config: any = config;
  isUpdate: boolean = false;
  @Action("SET_TOTAL") set_total: any;
  uploadFaceVisible: boolean = false;
  upfaceLoading: boolean = false;
  uploadImageUrl: string = ""; //单独上传人脸
  propertyData: Array<object> = []; //物业权限列表-设备
  rowline: object = {}; //每行数据
  imageUrl: string = "";
  private confirmLoading: boolean = false;
  private rowSpan: number = 15;
  env: string = process.env.NODE_ENV;
  faceDisabled: boolean = true;
  noteString: string = ""; // 备注信息
  rowId: String = "";
  showProperty: String = "";
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  Form: object = {
    name: "",
    phone: "",
    note: "",
    groupId: "",
    useSnapRecords: "0",
    isCheckAttendance: "0",
    warnType: [],
    smsWarnType: [],
    face: "" as any,
    id: "" as any,
    useMiniApp: "0",
    isRealVideo: "0",
  };
  editId: String = "";
  propsOption: object = {
    children: "subWorkerGroups",
    label: "name",
    key: "id",
  };
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };

  propertyDetailShow: boolean = false; //详情弹窗
  propertyDetail: Object = {};
  // 状态
  statusOptions: Array<object> = [
    {
      value: "USED",
      label: "正常",
    },
    {
      value: "DISABLE",
      label: "禁用",
    },
  ];
  pickerOptions: object = {
    disabledDate(time) {
      return time.getTime() > Date.now() - 8.64e7;
    },
  };
  initForm: object = {
    url: config.v1 + "/admin/worker",
    method: "get",
  };
  filterForm: object = {
    name: "",
    // groupId: "",
    phone: "",
    status: "",
  };
  deleteForm: object = {
    url: config.v1 + "/admin/worker",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的职工, 删除后职工将不存在,请谨慎操作!",
  };
  passList: object = {
    scenceUserId: "",
    page: 1,
    limit: 10,
    total: 1,
  };
  TreeDataCans: Array<object> = []; //工作组
  visible: boolean = false; // 导入框状态
  faceVisible: boolean = false; // 人脸导入状态
  phoneString: string = ""; // 手机号
  updateArray: Array<string> = ["noteStatus"]; //需要行内修改的
  TreeData: Array<object> = []; // 工作组
  FormRules: object = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    groupId: [{ required: true, message: "请选择部门", trigger: "change" }],
    face: [{ required: true, message: "请上传人脸", trigger: "change" }],
    phone: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (value.length !== 11 || !/^1[123456789]\d{9}$/.test(value)) {
            callback(new Error("填写正确的手机号"));
          } else {
            callback();
          }
        },
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

  // 批量设置
  setDialog: boolean = false;
  setForm: any = {
    groupId: "",
    useMiniApp: "",
    isRealVideo: "",
    useSnapRecords: "",
    isCheckAttendance: "",
    warnType: [],
    smsWarnType: [],
  };
  setgroupIdArr: Array<string> = [];

  @Watch("imageUrl")
  getImageUrl() {
    if (!this.isValite) {
      return;
    }
    this.$refs["Forms"]["validateField"]("face", (valid) => {});
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
    row.noteStatus = true;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }
  // 修改备注
  confirmUpdateNote(row) {
    updateWorker({
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
  openAdd() {
    getWorkGroup().then((res) => {
      this.TreeDataCans = JSON.parse(JSON.stringify(res.data.data));
      this.initTreeData(this.TreeDataCans);
    });
  }

  /**
   * 获取部门树**/
  handleChange(arr) {
    this.Form["groupId"] = [...arr].pop();
    this.setForm["groupId"] = [...arr].pop();
  }
  handleGroupId(data) {
    /**@description 物业权限id */
    if (!data.id) {
      // this.propertyData = [];
      return;
    }
    this.filterForm["groupId"] = data.id;
  }
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }
  showFaceExportIn() {
    this.faceVisible = true;
  }
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 15;
    } else {
      this.rowSpan = 0;
    }
  }
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍人脸";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }
  resize() {}
  beforeAvatarUpload(file) {
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
  // 获取工作组
  fetchWorkGroup() {
    getWorkGroup().then((res) => {
      this.TreeData = res.data.data;
      this.TreeDataCans = JSON.parse(JSON.stringify(res.data.data));
      this.initTreeData(this.TreeDataCans);
    });
  }
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }

  showPropertyDetails(row) {
    this.propertyDetailShow = true;
    this.propertyDetail = row;
  }
  closePropertyDetails(val) {
    this.propertyDetailShow = false;
    this.openDialogUpdate(this.propertyDetail);
  }

  created() {
    this.fetchWorkGroup();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  beforeFaceUpload(file) {
    getBase64(file.raw).then((res) => {
      this.uploadImageUrl = res;
      this.faceDisabled = false;
      this.Form["face"] = res;
    });
  }
  openUpload(row, type) {
    this.rowline = row;
    this.uploadFaceTitle = type == "update" ? "修改人脸" : "上传人脸";
    this.uploadImageUrl = type == "update" ? row.face : "";
    this.uploadFaceVisible = true;
    this.faceDisabled = true;
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
    if (data.face.indexOf("http") != -1) {
      this.upfaceLoading = false;
      this.uploadFaceVisible = false;
      this.replayUpfaceLoading = false;
      this.uploadFaceReplayVisible = false;
      this.uploadImageUrl = "";
      return;
    }
    updateWorker(data)
      .then((res) => {
        this.upfaceLoading = false;
        this.$message.success("添加成功！");
        this.uploadFaceVisible = false;
        this.uploadImageUrl = "";
        this.fetchData(this.initForm);
        this.replayUpfaceLoading = false;
        this.uploadFaceReplayVisible = false;
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
  // 修改职工门禁状态
  changeStatus(Obj: object) {
    const form = { status: Obj["Status"], id: Obj["id"] };
    updateWorker(form).then((res) => {
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
    this.Form["face"] = this.imageUrl;
    let param = { ...this.Form };
    param["warnType"] = param["warnType"].join(",");
    param["smsWarnType"] = param["smsWarnType"].join(",");
    if (type == "force") {
      param["isForce"] = true;
    }
    this.$refs["Forms"]["validate"]((valid) => {
      this.isValite = true;
      if (valid) {
        this.isValite = false;
        this.confirmLoading = true;
        if (this.isUpdate) {
          if (param["face"].indexOf("http://") > -1) {
            param["face"] = null;
          }
          updateWorker(param)
            .then((res) => {
              if (res.data && res.data.code === 200) {
                this.confirmLoading = false;
                this["message"]("success", "修改成功");
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
        } else {
          addWorker(param)
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
  addSetConfirm() {
    let ids = [];
    this.selectVal.forEach((v: any) => {
      ids.push(v.id);
    });
    this.confirmLoading = true;
    let param = {
      ids: ids,
      isRealVideo: this.setForm.isRealVideo,
      smsWarnType: this.setForm["smsWarnType"].join(","),
      useMiniApp: this.setForm.useMiniApp,
      useSnapRecords: this.setForm.useSnapRecords,
      warnType: this.setForm["warnType"].join(","),
      workerGroupId: this.setForm["groupId"],
      isCheckAttendance: this.setForm.isCheckAttendance,
    };
    updateWorkers(param)
      .then((res) => {
        if (res.data.code == 200) {
          this.confirmLoading = false;
          this["message"]("success", "设置成功");
          this["fetchData"](this.initForm);
          this.handleSetClose();
        }
      })
      .catch((err) => {
        this.confirmLoading = false;
      });
  }

  handleClose() {
    this.imageUrl = "";
    this.groupIdArr = [];
    this["dialogCreate"] = false;
    this.isValite = false;
    this.$refs["Forms"]["resetFields"]();
    this.$refs["upload"]["clearFiles"]();
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    this.Form["useMiniApp"] = "0";
    this.Form["useSnapRecords"] = "0";
    this.Form["isCheckAttendance"] = "0";
    this.Form["isRealVideo"] = "0";
    this.Form["warnType"] = [];
    this.Form["smsWarnType"] = [];
    this.isUpdate = false;
  }
  handleSetClose() {
    this.setgroupIdArr = [];
    this.setForm = {
      groupId: "",
      useSnapRecords: "",
      warnType: [],
      smsWarnType: [],
      useMiniApp: "",
      isRealVideo: "",
      isCheckAttendance: "",
    };
    this.setDialog = false;
  }

  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order == "descending";
    this["fetchData"](this.initForm);
  }
  openDialogUpdate(row) {
    this.propertyDetailShow = false;
    this.editId = row.id;
    this.isUpdate = true;
    for (let key in this.Form) {
      this.Form[key] = row[key];
      if (key === "groupId") {
        this.Form[key] = row["workerGroupId"];
      }
    }
    this.imageUrl = row.face;
    if (this.Form["warnType"]) {
      this.Form["warnType"] = this.Form["warnType"].split(",");
    } else {
      this.Form["warnType"] = [];
    }
    if (this.Form["smsWarnType"]) {
      this.Form["smsWarnType"] = this.Form["smsWarnType"].split(",");
    } else {
      this.Form["smsWarnType"] = [];
    }
    this.groupIdArr = row["groupIdList"];
    this["dialogCreate"] = true;
  }
  // 获取房屋结构
  getWorkTreeData() {
    getWorkGroup().then((res: Object) => {
      this.TreeDataCans = res["data"]["data"];
    });
  } // 表头添加小图标的render 事件
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
  // 导入人脸弹窗
  closeFaceVisible(flag: boolean) {
    this.faceVisible = flag;
  }
}
</script>

<style lang="scss" scoped>
.property-left {
  .content {
    height: 400px;
  }
  .property-device {
    width: 100%;
    height: 70vh;
    text-align: left;
    background: #fff;
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
.rightContent {
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
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
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
.components-container {
  position: relative;
  height: 100%;
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
    width: 84%;
  }
  .value_warn {
    width: 100%;
    span {
      background: #e1efff;
      border: 1px solid rgba(64, 158, 255, 0.52);
      color: #409eff;
      padding: 0 20px;
      height: 34px;
      line-height: 32px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 14px;
      margin-right: 14px;
    }
  }
}
.mg-50 {
  margin-top: 50px;
}
.ml-50 {
  margin-left: 50px;
}
ml-20 {
  margin-left: 20px;
}

// .pd-20 {
//   padding-left: 20px;
//   padding-right: 20px;
// }
// .employ {
//   border-bottom: 1px solid #e4e7ed;
//   border-top: 1px solid #e4e7ed;
//   padding: 12px 0;
//   margin-top: 20px;
//   margin-bottom: 20px;
//   padding-right: 8px;
// }
// .propertyCom {
//   width: 100%;
//   height: 48px;
//   line-height: 48px;
//   background: #f8f8f8;
//   color: #606266;
//   margin-bottom: 10px;
//   padding: 0 10px;
// }
// .propertyInfo {
//   align-items: center;
// }
// .isTrue {
//   color: #409eff;
// }
// .isFalse {
//   color: #f56c6c;
// }
</style>
