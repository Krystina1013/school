<template>
  <div class="app-container1">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <data-tree :page="page" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="false" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <!-- <FloorControl
              v-show="cutBtnType"
              ref="FloorControl"
              @showHouseDetails="showHouse"
            ></FloorControl> -->
            <el-row>
              <el-col :span="24">
                <!-- :floorControl="queryBuildingId && floorControlStatus ? true : false" -->
                <action-header ref="actionHeader" :initFormHeader="initForm" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :moreStatus="false" :houseStatus="true" :total="page.total" @fetchData="fetchData" @handleCutStatus="handleCutStatus">
                  <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                      批量删除
                    </el-button>
                  </div>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">房屋:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model.trim="filterForm.serialNumber" placeholder="输入房屋名称" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">所属楼层:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" @input="numberInput" maxlength="2" v-model.trim="filterForm.storey" placeholder="输入所属楼层" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">房屋状态:</span> &nbsp;&nbsp;
                      <el-select class="select-class" size="small" v-model="filterForm.full" placeholder="请选择房屋状态筛选">
                        <el-option label="未满" value="false"></el-option>
                        <el-option label="已满" value="true"></el-option>
                      </el-select>
                    </div>
                  </div>
                </action-header>
              </el-col>
            </el-row>
            <el-table v-show="!cutBtnType" :data="list_data" stripe border v-loading="showLoading" highlight-current-row @cell-mouse-enter="enterCellChange" @selection-change="handleSelectionChange" @cell-mouse-leave="leaveCellChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" align="center" width="50"></el-table-column>

              <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" prop="locationName" :show-overflow-tooltip="true" label="房屋">
                <template slot-scope="scope">
                  <span> {{ scope.row.locationName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="storey" align="center" label="所属楼层">
                <template slot-scope="scope">
                  {{ scope.row.storey }}层
                </template>
              </el-table-column>
              <el-table-column align="center" prop="beds" label="入住人数/床位数">
                <template slot-scope="scope">
                  <el-button @click="showPersonsDetails(scope.row)" type="text">
                    {{ scope.row.students }}/{{ scope.row.beds }}</el-button>
                </template>
              </el-table-column>

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
            <el-pagination v-if="!cutBtnType" style="padding: 5px" background layout="prev, pager, next" :current-page.sync="page.page" :page-size="page.limit" :total="page.total" @current-change="pageChange"></el-pagination>
            <div style="z-index: 9" :class="rowSpan === 12 ? menuControl1 : menuControl2" @click="menuVisible">
              <p class="close-menu">
                <i v-if="rowSpan === 12" class="iconfont icon-left icon-class"></i>
                <i v-else class="iconfont icon-zuo icon-class"></i>
              </p>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
    <!-- 新建房屋 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="isUpdate ? '编辑房屋' : '添加房屋'" :visible.sync="dialogCreate" width="500px" :before-close="handleClose">
      <el-form :model="Form" :rules="rules" ref="Forms" label-width="100px" label-position="right" style="margin-right: 40px">
        <el-form-item label="宿舍楼宇:" prop="buildingId">
          <el-cascader style="width: 100%" v-model="Form.buildingId" :disabled="isUpdate" :options="TreeData" :props="{ label: 'name', children: 'subBuildings', value: 'id' }" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="所属楼层:" prop="storeyNum">
          <el-input clearable :disabled="isUpdate" v-model="Form.storeyNum" placeholder="输入所属楼层"></el-input>
          <!-- <p>最大房间数99</p> -->
        </el-form-item>
        <el-form-item label="房间名称:" prop="serialNumber">
          <el-input clearable v-model="Form.serialNumber" maxlength="30" placeholder="输入房间名称"></el-input>
        </el-form-item>
        <el-form-item label="房间床位数:" prop="beds">
          <el-input clearable v-model="Form.beds" placeholder="输入房间床位数(几人间)"></el-input>
        </el-form-item>
        <el-form-item label="备注信息:" prop="note">
          <el-input type="textarea" v-model.trim="Form.note" :maxlength="200" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" :disabled="addStatus" type="primary" @click="addHouseConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 人入住员信息 -->
    <el-dialog class="newDialog" width="916px" :close-on-click-modal="false" title="入住人员" :visible.sync="dialogFormVisible">

      <div class="img-dialog" v-if="imgs.length > 0">
        <div v-for="(item, i) in imgs" :key="i" class="img-col">
          <div class="img-con">
            <img class="img" :src="item.face" alt="" />
          </div>
          <div class="info-con">
            <span class="info-title">姓名：</span><span class="info-value">{{item.name}}</span>
          </div>
          <div class="info-con">
            <span class="info-title">学号：</span><span class="info-value">{{ item.studentNo }}</span>
          </div>
          <div class="info-con">
            <span class="info-title">班级：</span><span class="info-value">{{ item.myClass.className }}</span>
          </div>
        </div>
      </div>
      <h3 v-else>暂无入住学生信息！</h3>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import mixin from "@/config/minxins";
import {
  getHouseTreeData,
  addHouse,
  updateHouse,
  getRoomPeople,
} from "@/api/houseApi.ts";
import { _throttle } from "@/utils";
import config from "@/api/config";
import splitPane from "vue-splitpane";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    splitPane,
  },
})
export default class dormList extends Vue {
  private cutBtnType: Boolean = false;
  private isUpdate: Boolean = false;
  selectVal: Array<object> = []; //选中的表格数据
  dialogCreatePerson: Boolean = false;
  queryBuildingId: String = ""; //通过dataTree获取到的宿舍楼id
  queryBuildingName: String = ""; //通过dataTree获取到的宿舍楼名称
  floorControlStatus: Boolean = false;
  exportUrl: string = config.v1 + "/admin/house/expor";
  config: any = config;
  private rowSpan: number = 12;
  initForm: object = {
    url: config.v1 + "/admin/room",
    method: "get",
    params: {
      type: 1,
    },
  };
  addStatus: boolean = false;
  filterForm: object = {
    serialNumber: "",
    status: [],
    // buildingId: "",
    userName: "",
    idCardNo: "",
    phone: "",
  };
  deleteForm: object = {
    url: config.v1 + "/admin/room",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的房间,删除后房间将不存在,请谨慎操作!`,
  };
  Form: object = {
    buildingId: "",
    note: "",
    serialNumber: "",
    beds: "",
    storeyNum: "",
    id: "",
    roomType: 1,
  };
  personRules: any = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    type: [{ required: true, message: "请选择用户类型", trigger: "blur" }],
    cardName: [{ required: true, message: "请填入证件名", trigger: "change" }],
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
    cardNo: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (
            !(value.length === 15 || value.length === 18) &&
            this.Form["idcardType"] === "身份证"
          ) {
            callback(new Error("填写正确的证件号号"));
          } else {
            callback();
          }
        },
      },
    ],
    idcardType: [{ required: true, trigger: "change", message: "请选择证件" }],
  };
  rules: any = {
    serialNumber: [
      {
        required: true,
        trigger: "blur",
        message: "输入房间名称",
      },
    ],
    beds: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的房间床位数(最大99)"));
          } else {
            if (value > 99) {
              callback(new Error("填写正确的房间床位数(最大99)"));
            } else {
              callback();
            }
          }
        },
      },
    ],
    buildingId: [
      { required: true, message: "请选择房屋所属楼栋", trigger: "change" },
    ],
    storeyNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼栋层数(最大层数99)"));
          } else {
            if (value > 99) {
              callback(new Error("填写正确的楼栋层数(最大层数99)"));
            } else {
              callback();
            }
          }
        },
      },
    ],
  };
  TreeData: Array<Object> = []; // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  updateArray: Array<string> = ["noteStatus", "houseStatus"];
  noteString: string = ""; // 修改的备注
  private dialogFormVisible: Boolean = false;
  houseId: string = "";
  private detailDialog: Object = {
    //查看目标详情
    name: "",
  };
  options: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
  };
  private activeName: String = "详细信息";
  private dtailTable: Array<Object> = []; // 当前房屋下的注册人员

  rowId: String = "";
  showProperty: String = "";
  // 住户详情 后期添加的
  personActiveName: string = "first";
  personDialogFormVisible: boolean = false; // 住户详情弹框状态
  PersonDetailDialog: object = {};
  personPassTable: Array<object> = []; // 人员通行记录
  carDtailTable: Array<object> = []; // 车辆信息
  houseDtailTable: Array<object> = []; // 房屋信息
  faceList: Array<object> = []; // 人脸库信息
  nameDisabled: boolean = false;
  imageUrl: string = "";
  loading: boolean = false;
  btnLoading: boolean = false;
  phoneList: Array<object> = [];
  personForm: any = {
    name: "",
    cardName: "",
    cardNo: "",
    sex: "",
    phone: "",
    house: [],
    note: "",
    birthday: "",
    houseName: "",
    idcardType: "身份证",
    type: "",
    overTime: "",
  };
  imgs: Array<object> = [];

  ComponentCommand(houseStatus: string, row: object) {
    return {
      ...row,
      houseStatus,
    };
  }
  /**房屋编辑弹窗 */
  openDialogUpdate(row) {
    /**@description 修改状态 */
    for (const key in this.Form) {
      if (key === "storeyNum") {
        this.Form[key] = row["storey"];
      } else {
        this.Form[key] = row[key];
      }
    }
    this.isUpdate = true;
    this["dialogCreate"] = true;
  }
  numberInput() {
    // if(!/^\d{1,2}$/.test(this.filterForm['storey'])) {
    //   this.filterForm['storey'] = this.filterForm['storey'][0];
    // }
    this.filterForm["storey"] = this.filterForm["storey"].replace(/\D/g, "");
  }
  handleClose() {
    this.imageUrl = "";
    this["dialogCreate"] = false;
    this.$refs["Forms"]["resetFields"]();
    // this.$refs["upload"]["clearFiles"]();
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    console.log(this.Form);
    this.isUpdate = false;
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
  // 表格选择
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
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
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  resize() {}

  // 查看人员入住的具体信息
  showPersonsDetails(row) {
    this.dialogFormVisible = true;
    this.activeName = "入住人员";
    // 获取在住人员
    this.getRoomPeople(row.id);
  }
  getRoomPeople(id) {
    getRoomPeople(id).then((res) => {
      this.imgs = res.data.data;
    });
  }

  handleBuildingId(data) {
    /**@description 获取宿舍楼id */
    this.queryBuildingId = data.id;
    this.filterForm["buildingId"] = data.id;
    this.queryBuildingName = data.name;
    this.floorControlStatus = !data.subBuildings;
    if (!!data.subBuildings) {
      this.cutBtnType = false;
    }
    // this.$refs["FloorControl"]["listQuery"] = {
    //   buildingId: data.id
    // };
    // this.$refs["FloorControl"]["fetchInfo"]();
  }

  // 获取房屋结构
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

  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    this.noteString = "";
  }

  // 修改备注
  confirmUpdateNote(row) {
    updateHouse({
      id: row.id,
      note: this.noteString,
    }).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        row.noteStatus = false;
        this.noteString = "";
        this.fetchData(this.initForm);
      } else {
        row.noteStatus = false;
        this["message"]("error", res.data.message);
      }
    });
  }

  // 添加房屋
  addHouseConfirm = _throttle(() => {
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        this.Form["roomType"] = 1;
        if (this.Form["id"]) {
          //编辑房屋
          updateHouse(this.Form).then((res) => {
            if (res.data.code === 200) {
              this["message"]("success", "修改成功");
              this["dialogCreate"] = false;
              this["fetchData"](this.initForm);
              this["handleClose"]();
            }
          });
        } else {
          // 添加房屋
          addHouse(this.Form).then((res) => {
            if (res.data.code === 200) {
              this["message"]("success", "添加成功");
              this["dialogCreate"] = false;
              this["fetchData"](this.initForm);
              this["handleClose"]();
            }
          });
        }
        // this.Form["buildingId"] = [...this.Form["buildingIdArr"]].pop();
      }
    });
  }, 1000);

  created() {
    this.getHouseTreeData();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  editType(item) {
    /**@description 修改状态 */
    // this.dialogFormVisible = true;
  }

  handleChange(arr) {
    console.log(arr);
    this.Form["buildingId"] = [...arr].pop();
  }

  queryIdetity(row) {
    this.detailDialog = row;
    this.dialogFormVisible = true;
  }

  // **********  楼控  *************
  handleCutStatus(cut) {
    /**@description 切换楼控与列表视图 */
    this.cutBtnType = cut;
    if (cut) {
      this.initFloorInfo();
    } else {
      // this.initInfo();
    }
  }

  initFloorInfo() {
    // this.$refs["FloorControl"]["listQuery"] = {
    //   buildingId: this.queryBuildingId
    // };
    // this.$refs["FloorControl"]["fetchInfo"]();
  }

  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.rightContent {
  height: 100%;
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
.content {
  height: calc(100vh - 97px) !important;
}

/deep/ .splitter-pane.vertical.splitter-paneR {
  height: calc(100% - 43px);
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
.components-container {
  position: relative;
  height: 100%;
}
.in-personnel {
  width: 100%;
  // height: 352px;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
}
.personnel-item {
  margin: 10px 0 0 16px;
}
.personnel-target {
  box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13), 0 2px 4px rgba(0, 0, 0, 0.12);
  padding: 5px;
}
.personner-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  display: block;
  margin: 0 auto 4px;
}
.personner-text {
  line-height: 20px;
  font-size: 12px;
}
.personner-name {
  width: 110px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  .personner-text {
    .el-date-editor {
      width: 60px;
      height: 20px;
    }
    .el-input__inner {
      width: 30px;
      height: 20px;
      padding: 0 25px;
    }
    .el-input__icon {
      line-height: 20px;
    }
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
.img-dialog {
  display: grid;
  grid-template-columns: 200px 200px 200px 200px;
  grid-row-gap: 10px;
  grid-column-gap: 15px;
  // grid-template-rows: 100px 100px 100px;
  .img-col {
    width: 200px;
    height: 290px;
    border: 1px solid #e0e1e3;
    margin-right: 15px;
    padding: 10px;
  }
}
.img-con {
  width: 180px;
  height: 180px;

  border: 1px solid #d8d8d8;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 15px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .name-item {
    margin-top: 10px;
  }
}
.info-con {
  margin-bottom: 5px;
  font-size: 14px;
  .info-title {
    color: #606266;
  }
  .info-value {
    color: #3a414f;
  }
}
</style>
