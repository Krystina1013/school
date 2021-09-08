<template>
  <div class="app-container">
    <div class="components-container">
      <div class="rightContent">
        <el-row>
          <el-col :span="24">
            <action-header :initFormHeader="initForm" :exportUrl="exportUrl" exportName="设备导出.xls" @fetchData="fetchData" :filterForm="filterForm" :filterStatus="true" :dialogCreate.sync="dialogCreate" :moreStatus="false" :total="page.total">
              <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                  批量解绑
                </el-button>
              </div>
              <div slot="houseNum">
                <div class="word-filter">
                  <span class="filter-name">设备名称:</span>
                  <el-input clearable placeholder="请输入需要查找的设备名称" @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model.trim="filterForm.name" size="small"></el-input>
                </div>
              </div>
            </action-header>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24" class="table-col">
            <el-table :data="list_data" stripe border v-loading="showLoading" @sort-change="sortChange" highlight-current-row @selection-change="handleSelectionChange" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
              <el-table-column v-if="globalUpdateStatus" align="center" type="selection" width="50"></el-table-column>
              <el-table-column align="center" class="indexNum" type="index" label="序号" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="设备名字">
                <template slot-scope="scope">
                  <el-button @click="showDetails(scope.row)" type="text">
                    {{ scope.row.name }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="serialNumber" label="设备编号" width="90"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="inOut" label="设备进出" width="80">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="clientIp" label="ip"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="设备位置">
                <template slot-scope="{ row }">
                  <span>{{ row.bindingAddress }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="type" label="状态" min-width="80" sortable="custom">
                <template slot-scope="scope">
                  <span :style="{
                      color:
                        scope.row.status === 'online' ? '#67c23a' : '#f56c6c',
                    }">{{ scope.row.status === "online" ? "正常" : "离线" }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" :show-overflow-tooltip="true" min-width="110" prop="upTime" label="最近上线时间">
                <template slot-scope="{ row }">
                  <span>{{ row.upTime | deviceTime }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" min-width="110" prop="downTime" label="最近离线时间">
                <template slot-scope="{ row }">
                  <span>{{ row.downTime | deviceTime }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="bindTime" min-width="110" label="设备绑定时间" :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  <span>{{ row.bindingTime || "" }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="note" align="center" label="备注">
                <template slot-scope="scope">
                  <span class="showIconBtn" v-show="!scope.row.noteStatus" >
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'note')?'':'transparent'}" @click="focusNoteInput(scope.row)"></i>
                    {{ scope.row.note || "--" }}
                  </span>
                  <el-input :ref="scope.row.id" size="mini" @blur="confirmUpdateNote(scope.row)" v-model.trim="noteString" v-show="scope.row.noteStatus" :clearable="true" :maxlength="200" placeholder="输入备注"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="同步数据" width="80" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" :disabled="scope.row.status !=='online'" @click="changeSyncData(scope.row)">同步</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="editDeviceName(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">解绑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog class="newDialog" width="900px" :title="detailDialogForm.name + '详情'" :visible.sync="detailDialogVisible" :close-on-click-modal="false">
      <el-row>
        <el-form label-width="130px" :model="detailDialogForm" size="mini">
          <el-col :span="12">
            <el-form-item label="设备序列号:"><span style="font-weight: bold;">{{ detailDialogForm.serialNumber }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备位置:"><span>{{ detailDialogForm.bindingAddress }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门禁类型:"><span>{{ detailDialogForm.type | devTypes }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备进出:"><span>{{ detailDialogForm.inOut }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP:"><span>{{ detailDialogForm.clientIp }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:">
              <span :style="{ color: detailDialogForm.status === 'online' ? '#67c23a' : '#f56c6c'}">
                {{ detailDialogForm.status === "online" ? "正常" : "离线" }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最近上线时间:"><span>{{ detailDialogForm.upTime || "" }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备绑定时间:"><span>{{ detailDialogForm.bindingTime || "" }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最近离线时间:"><span>{{ detailDialogForm.downTime || "" }}</span></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:"><span>{{ detailDialogForm.note || "" }}</span></el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-divider></el-divider>
      <!-- <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
        </el-tab-pane>
        <el-tab-pane v-if="detailDialogForm.type === '1' || detailDialogForm.type === '2'" :label="currentTabLabel" name="second">
          <el-table v-show="detailDialogForm.type === '1'" :data="doorRecordTable" style="width: 100%" stripe border>
            <el-table-column align="center" prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="passTime" label="通行时间" width="150px"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="通行地址"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" label="是否访客">
              <template slot-scope="{ row }">
                <span>{{ row.isVisitor ? "是" : "否" }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="抓拍人脸">
              <template slot-scope="scope">
                <img v-if="scope.row.photos" style="margin-top: 3px" @mouseout="twoImg.visible = false" @mouseover="showImg(scope)" :src="scope.row.photos" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs> -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加或修改弹出表单 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="roleTitle === '0' ? '添加设备' : '修改设备'" :visible.sync="dialogCreate" width="600px" :before-close="handleClose">
      <el-form ref="Forms" :rules="rules" :model="Form" label-position="right" label-width="110px">
        <el-form-item class="phone-input" label="设备名字: " prop="name">
          <el-input clearable style="width: 340px" placeholder="请输入设备名字" maxlength="30" v-model.trim="Form.name"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备序列号: " prop="devSerial">
          <el-input @input="checkDevice" clearable style="width: 340px" placeholder="请输入设备序列号" v-model.trim="Form.devSerial"></el-input>
          <h5 style="height: 20px; line-height: 20px">
            {{ deviceType | devType }}
          </h5>
        </el-form-item>
        <el-form-item v-if="deviceType === '5'" class="phone-input" label="设备绑定编号: " prop="bindDevSerialNumber">
          <el-input clearable style="width: 340px" placeholder="请输入设备绑定编号" v-model.trim="Form.bindDevSerialNumber"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备进出: " prop="inOut">
          <el-switch v-model="Form.inOut" active-text="进" inactive-text="出" active-color="#13ce66" inactive-color="#ff4949" active-value="进" inactive-value="出"></el-switch>
        </el-form-item>
        <el-form-item label="是否同步数据" :rules="{ required: true }">
          <el-radio-group v-model="Form.isSync">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="deviceType !== '5'" class="phone-input" label="绑定位置: " prop="bindingAddress">
          <el-input clearable style="width: 240px" placeholder="点击右方设备绑定选择对应设备" v-model="Form.bindingAddress"></el-input>
          <el-button @click="deviceBindBtn">设备绑定</el-button>
        </el-form-item>

        <el-form-item class="phone-input" label="设备备注: " prop="note">
          <el-input clearable type="textarea" placeholder="请输入设备备注" style="width: 340px" :maxlength="200" v-model.trim="Form.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmBind" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设备绑定 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" width="600px" title="设备绑定" :visible.sync="deviceBindingVisible" :before-close="closeAddress">
      <el-form :model="Form">
        <el-form-item label="设备区分:" :label-width="formLabelWidth">
          <el-select @change="bindingTypeChange" style="width: 310px" v-model="Form.bindingType" placeholder="请选择设备区分">
            <el-option v-show="deviceType != 'ENTER_EXIT'" label="宿舍楼" value="BUILDING"></el-option>
            <el-option label="出入口" value="ENTER_EXIT"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table height="400px" :data="deviceBindingData" border stripe>
        <el-table-column type="index" label="序号" align="center" width="72"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="locationName" align="center" label="地址" v-if="Form.bindingType == 'BUILDING'"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="地址" v-if="Form.bindingType == 'ENTER_EXIT'"></el-table-column>
        <el-table-column prop="note" :show-overflow-tooltip="true" align="center" label="备注">
          <template slot-scope="{ row }">
            <span>{{ row.note || "暂无" }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="address" align="center" label="操作" width="155">
          <template slot-scope="{ row }">
            <el-button :style="{ color: '#409EFF' }" type="text" @click="bindDevice(row)">{{ "点击绑定" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 设备地址选择 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" title="选取设备地址" :visible.sync="mapVisible">
      <el-input clearable v-model="Form.address" placeholder="输入设备地址"></el-input>
      <BaiduMap @pointClick="pointClick" :keyword="Form.address" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="mapVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="mapVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设备名称 -->
    <el-dialog class="newDialog" title="修改设备" :visible.sync="dialogEdit" width="510px" :before-close="closeDialogName" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="editForm" label-position="right" label-width="100px" style="margin-right: 40px">
        <el-form-item label="设备序列号:" prop="name" :show-message="showMessage" :error="errorMessage.name">
          <span>{{ editForm.serialNumber }}</span>
        </el-form-item>

        <el-form-item v-if="deviceType !== '3'" class="phone-input" label="绑定位置: " prop="bindingAddress">
          <span>{{ editForm.bindingAddress }}</span>
        </el-form-item>

        <el-form-item label="设备名称:" prop="name" :show-message="showMessage" :error="errorMessage.name" :rules="{
            required: true,
            message: '设备名称不能为空',
            trigger: 'blur',
          }">
          <el-input v-model.trim="editForm.name" placeholder="请输入设备名称" :maxlength="30" @input="constraintLength(editForm.name, '30')" clearable></el-input>
        </el-form-item>

        <el-form-item label="备注:" prop="note" :show-message="showMessage" :error="errorMessage.note">
          <el-input v-model.trim="editForm.note" placeholder="请输入设备备注" :maxlength="200" @input="constraintLength(editForm.note, '200')" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogName">取 消</el-button>
        <el-button size="small" type="primary" @click="modifDeviceName">确 定</el-button>
      </span>
    </el-dialog>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />
    <ExportIn :uploadUrl="config.v1 + '/admin/device-link/import'" :downTemplateUrl="config.v1 + '/admin/device-link/model'" TmplateName="设备导入模板" @closeVisible="closeVisible" @successUpload="fetchData(initForm)" :visible.sync="visible" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import {
  createDevice,
  checkdeviceByNum,
  editDeviceName,
  deviceSyncData,
} from "@/api/deviceApi";
import { debounce } from "@/utils";
import axios from "axios";
import { searchHouse, getInoutList, getHouseTreeData } from "@/api/houseApi";
import { getUserPass, getCarPass } from "@/api/peopleApi";
import { getScene } from "@/api/screenApi";
import Cookie from "js-cookie";
import splitPane from "vue-splitpane";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const BaiduMap = () => import("@/components/baiduMap/index.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
const DataTree = () => import("@/components/DataTree.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    BaiduMap,
    BigImg,
    TwoImg,
    splitPane,
    DataTree,
    ExportIn,
  },
  filters: {
    devType(val: string) {
      if (val === "") {
        return "";
      }
      const data = {
        "1": "门禁",
        DOOR: "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
        "5": "摄像头",
        "6": "华为摄像头",
      };
      return data[val] ? `此设备序列号对应的是${data[val]}设备` : "未找到设备";
    },
    devTypes(val: string) {
      const data = {
        DOOR: "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
        "5": "摄像头",
        "6": "华为摄像头",
      };
      return data[val] + "设备";
    },
    deviceTime(val: string) {
      val = val.split(".")[0];
      return val;
    },
  },
})
export default class DeviceManage extends Vue {
  config: any = config;
  private rowSpan: number = 12;
  TreeData: Array<Object> = []; // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private confirmLoading: Boolean = false; //
  private bigImg: String = ""; // 保存放大图片的地址
  rowId: String = "";
  showProperty: String = "";
  noteString: string = ""; // 修改备注
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };
  filterForm: object = {
    // loc: "",
    // deviceStatus: "",
    orderColumn: "",
    isAsc: false,
    buildings: [],
  }; // 筛选条件
  initForm: object = {
    url: config.v2 + "/admin/dev-device-info/page-query",
    method: "get",
  };
  exportUrl: string = `${config.v2}/admin/dev-device-info/export`;
  selectVal: Array<object> = []; //选中的表格数据
  deleteForm: object = {
    url: config.v1 + "/admin/device-link/unbind",
    method: "delete",
    data: [],
    message: "此操作将永久解绑选中的设备,请谨慎操作!",
  };
  passPage: object = {
    total: 1,
    limit: 10,
    page: 1,
  };
  mapVisible: boolean = false; // 地图显示框状态
  detailDialogVisible: boolean = false; // 设备详情dialog弹框状态
  private formLabelWidth: String = "120px";
  detailDialogForm: Object = {}; // 设备详情
  // doorRecordTable: Array<Object> = []; // 设备抓拍的通行记录
  currentTabLabel = "门禁记录";
  private roleTitle: String = "0";
  private Form: Object = {
    // 创建设备表单
    // address: "四川省成都市",
    bindingId: "",
    bindingAddress: "",
    bindingType: "BUILDING",
    inOut: "进",
    name: "",
    // latitude: "",
    // longitude: "",
    note: "",
    devSerial: "",
    // subAddress: "",
    bindDevSerialNumber: "",
    isSync: false,
  };
  deviceType: string = ""; // 设备类型
  deviceBindingVisible: boolean = false; // 设备绑定dialog状态
  deviceBindingData: Array<Object> = [];
  rules: object = {
    name: [{ required: true, message: "请输入设备名字", trigger: "blur" }],
    devSerial: [
      { required: true, message: "请输入设备序列号", trigger: "blur" },
    ],
    address: [
      { required: true, message: "请输入设备所在位置", trigger: "blur" },
    ],
    bindingAddress: [
      { required: true, message: "请选择设备绑定位置", trigger: "blur" },
    ],
    bindDevSerialNumber: [
      { required: true, message: "请填写设备绑定编号", trigger: "blur" },
    ],
  };
  deviceId: string = "";
  devId: string = "";
  tongbuClick: boolean = false;

  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "",
  };
  private dialogEdit: Boolean = false; // 修改弹出表单
  private editInfo: Object = {}; //保存初始值
  private editForm: Object = {
    //修改表单字段
    id: "",
    name: "",
    note: "",
    devSerial: "",
    address: "",
    bindingAddress: "",
    latitude: "",
    longitude: "",
    serialNumber: "",
  };
  visible: boolean = false;
  updateArray: Array<string> = ["noteStatus"];
  private editData: String = ""; //行内修改 保存未改变的值
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  checkDevice(e) {
    Cookie.set("error", Date.now(), {
      expires: new Date(new Date().getTime() + 3 * 1000),
    }); // 五秒钟内不会重复出现提示框
    checkdeviceByNum(this.Form["devSerial"])
      .then((res) => {
        this.deviceType = res.data.data.type;
        this.devId = res.data.data.id;
        this.Form["bindingAddress"] = "";
      })
      .catch(() => {
        this.deviceType = "";
        this.devId = "";
        this.Form["bindingAddress"] = "";
      });
  }
  // 表格选择
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }
  closeAddress() {
    this.deviceBindingVisible = false;
  }
  created() {
    this.getHouseTreeData();
    this.fetchBuilding();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.fetchScene();
  }
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍图片";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }
  // 获取场景信息
  fetchScene() {
    getScene().then((res) => {
      this.Form["address"] = res.data.data.address;
      this.Form["latitude"] = res.data.data.latitude;
      this.Form["longitude"] = res.data.data.longitude;
    });
  }
  /** 获取经纬度 */
  getlocLat() {
    this["$jsonp"]("http://api.map.baidu.com/geocoder/v2/", {
      address: this.Form["address"],
      output: "json",
      pois: "0",
      coordtype: "wgs84ll",
      callback: "renderReverse",
      ak: "vCZU88Guz4BmAODWTm8k9BP0WlwId1V0",
    }).then((res) => {
      if (res.status === 0) {
        this.Form["longitude"] = res.result.location.lng;
        this.Form["latitude"] = res.result.location.lat;
      } else {
        this["message"]("error", `没有找到对应的位置信息`);
        this.Form["longitude"] = "";
        this.Form["latitude"] = "";
      }
    });
  }
  // 点击地图选取地址
  pointClick(Object: object) {
    this.Form["address"] =
      Object["province"] +
      Object["city"] +
      Object["district"] +
      Object["street"];
    this.Form["latitude"] = Object["lat"];
    this.Form["longitude"] = Object["lng"];

    this.editForm["address"] =
      Object["province"] +
      Object["city"] +
      Object["district"] +
      Object["street"];
    this.editForm["latitude"] = Object["lat"];
    this.editForm["longitude"] = Object["lng"];
  }
  // 获取宿舍楼列表
  fetchBuilding() {
    searchHouse("1").then((res) => {
      res.data.data.forEach((element) => {
        this.$set(element, "bindStatus", false);
      });
      this.deviceBindingData = res.data.data;
    });
  }
  deviceBindBtn() {
    if (!this.Form["devSerial"]) {
      this.$message.error("请先输入设备序列号");
      return;
    }
    if (!this.deviceType) {
      this.$message.error("设备不存在或者已被绑定");
      return;
    }
    this.deviceType == "BUILDING";
    if (this.deviceType == "ENTER_EXIT") {
      this.Form["bindingType"] = "ENTER_EXIT";
      this.fetchInputList();
    } else {
      this.Form["bindingType"] = "BUILDING";
      this.fetchBuilding();
    }
    this.deviceBindingVisible = true;
    this.deviceBindingData.forEach((ele) => {
      if (ele["id"] === this.Form["bindingId"]) {
        this.$set(ele, "bindStatus", true);
      } else {
        ele["bindStatus"] = false;
      }
    });
  }
  // 绑定设备
  bindDevice(row) {
    console.log(row);
    if (row.bindStatus) {
      return (row.bindStatus = false);
    }
    this.deviceBindingData.forEach((ele) => {
      ele["bindStatus"] = false;
    });
    row.bindStatus = true;
    this.Form["bindingId"] = row.id;
    this.Form["bindingAddress"] = row.locationName || row.name;
    this.deviceBindingVisible = false;
  }
  // 获取出入口列表
  fetchInputList() {
    getInoutList().then((res) => {
      res.data.data.forEach((element) => {
        this.$set(element, "bindStatus", false);
      });
      this.deviceBindingData = res.data.data;
    });
  }
  // 切换单元楼/出入口
  bindingTypeChange(val: string) {
    return val === "BUILDING" ? this.fetchBuilding() : this.fetchInputList();
  }
  // 确定绑定设备
  confirmBind() {
    this["Form"]["isSync"] = this["Form"]["isSync"] ? true : false;
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        // if (this.Form["longitude"] === "" || this.Form["latitude"] === "") {
        //   return this["message"]("error", `请输入正确的设备地址`);
        // } else {
        let param = { ...this.Form };
        param["devId"] = this.devId;
        this.confirmLoading = true;
        createDevice(param)
          .then((res) => {
            if (res.data.code === 200) {
              this["handleClose"]();
              this["fetchData"](this.initForm);
            }
            this.confirmLoading = false;
          })
          .catch((err) => {
            this.confirmLoading = false;
          });
        // }
      }
    });
  }
  handleClose() {
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    this.Form["bindingType"] = "BUILDING";
    this.Form["isSync"] = false;
    this.Form["inOut"] = "出";
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreate"] = false;
    this.fetchScene();
    this.deviceType = "";
  }
  /*** 查看设备详情*/
  showDetails(row) {
    this.passPage["page"] = 1;
    this.detailDialogVisible = true;
    this.deviceId = row.id;
    this.detailDialogForm = Object.assign({}, row);
  }

  editDeviceName(item) {
    /**@description 修改设备名称 */
    this.editInfo = item;
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.dialogEdit = true;
  }

  modifDeviceName() {
    /**@description 修改 */
    const form = { ...this.editForm };
    this.$refs["dataForm"]["validate"]((valid) => {
      if (valid) {
        for (let key in form) {
          if (form[key] === "") {
            delete form[key];
          }
        }

        editDeviceName(form).then(() => {
          this.closeDialogName();
          this["fetchData"](this.initForm);
          this["message"]("success", `修改设备名称成功`);
        });
      }
    });
  }

  closeDialogName() {
    /** @description 关闭添加/修改dialog */
    this.dialogEdit = false; //修改dialog
    this.$refs["dataForm"]["resetFields"]();
  }

  focusNoteInput(row, value, type) {
    // /**@description 点击备注*/
    // this.editData = row[value];
    // this.editForm[value] = row[value];
    // this.editForm["id"] = row.id;
    // row[type] = !row[type];
    // this.$nextTick(() => {
    //   const input = this.$refs[value] as HTMLElement;
    //   input.focus();
    // });
    this.noteString = row.note;
    row["noteStatus"] = true;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }
  enterCellChange(row, column, cell, event) {
    this.showProperty = column.property;
    this.rowId = row.id;
  }
  leaveCellChange(row, column) {
    this.showProperty = "";
    this.rowId = "";
  }

  // 修改备注离开输入框
  // confirmUpdateNote(row, value, type) {
  //   row[type] = false;
  //   if (this.editData !== row[value]) {
  //     const form = { [value]: row[value], id: row.id };
  //     editDeviceName(form)
  //       .then(() => {
  //         this["message"]("success", `修改设备备注成功!`);
  //         this.fetchData(this.initForm);
  //       })
  //       .catch(() => {
  //         row[value] = this.editData;
  //       });
  //   }
  // }
  confirmUpdateNote(row) {
    const form = {
      id: row.id,
      note: this.noteString,
    };
    editDeviceName(form)
      .then((res) => {
        if (res.data.code === 200) {
          this["message"]("success", `修改设备备注成功!`);
          row.noteStatus = false;
          this.noteString = "";
          this.fetchData(this.initForm);
        } else {
          row.noteStatus = false;
          this["message"]("error", res.data.message);
        }
      })
      .catch(() => {
        row.noteStatus = false;
      });
  }

  handleBuildingId(data) {
    /**@description 获取宿舍楼id */
    // let buildings:any=[];
    // if(data.type=='group'){
    //   if(data.subBuildings){
    //     data.subBuildings.map(item=>{
    //       buildings.push(item.id)
    //     })
    //   }
    // }else{
    //   buildings=[data.id]
    // }
    // this.filterForm['buildings']=buildings;
  }
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
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
  }
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
  // 同步数据
  changeSyncData(row) {
    this.$confirm(
      "同步人脸数据的时候，门禁设备不能使用人脸开门，请选择合适的时间执行同步",
      "",
      {
        confirmButtonText: "立即执行",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        deviceSyncData({ devId: row.id }).then((res) => {
          this.tongbuClick = false;
          this.$message.success("数据同步中，稍后在设备上查看！");
          this.fetchData(this.initForm);
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消",
        });
      });
    // if (!this.tongbuClick) {
    //   this.tongbuClick = true;
    // }else {
    //   return
    // }
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
  // 排序
  sortChange(option) {
    this.filterForm["orderColumn"] = option.order === null ? "" : "status";
    this.filterForm["isAsc"] = option.order === "ascending";
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.fetchData(this.initForm);
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-divider--horizontal {
    margin: 16px 0;
  }
  .noPadding_bot {
    .el-dialog__title {
      color: #303133;
      font-size: 18px;
    }
    .el-dialog__body {
      padding-bottom: 0;
    }
    span {
      color: #3a414f;
    }
  }
}
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -8px;
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

.capture-img {
  width: 60px;
}
</style>
