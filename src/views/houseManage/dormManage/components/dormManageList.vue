<template>
  <div class="app-container1">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <data-tree :page="page" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="true" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <action-header ref="actionHeader" :initFormHeader="initForm" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :moreStatus="false" :houseStatus="true" :total="list_data.length" @fetchData="fetchData">
                  <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="
                        commandClick({ action: 'delete', row: selectVal })
                      ">
                      批量删除
                    </el-button>
                  </div>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">姓名:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model.trim="filterForm.name" placeholder="输入姓名" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">电话:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="11" v-model.trim="filterForm.phone" placeholder="输入电话" size="small"></el-input>
                    </div>
                  </div>
                </action-header>
              </el-col>
            </el-row>
            <el-table :data="list_data" stripe border v-loading="showLoading" highlight-current-row @cell-mouse-enter="enterCellChange" @selection-change="handleSelectionChange" @cell-mouse-leave="leaveCellChange" @sort-change="sortChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" align="center" width="50"></el-table-column>

              <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" prop="name" :show-overflow-tooltip="true" label="姓名">
                <template slot-scope="scope">
                  <el-button type="text" @click="toDetail(scope.row)">
                    {{ scope.row.name }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="buildingName" :show-overflow-tooltip="true" align="center" label="楼栋名称"></el-table-column>

              <el-table-column prop="phone" align="center" label="电话">
                <template slot-scope="scope">
                  <span v-if="scope.row.phone.length == 11">{{
                    scope.row.phone
                  }}</span>
                  <span v-else>无电话</span>
                </template>
              </el-table-column>
              <el-table-column width="120" align="center" prop="face" label="人脸图像">
                <template slot-scope="scope">
                  <img v-if="scope.row.face" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" class="capture-img cur-img" :src="scope.row.face" alt />
                  <div v-else style="padding: 7px 0">
                    <span>暂无人脸</span>
                  </div>
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
            <el-pagination style="padding: 5px" background layout="prev, pager, next" :current-page.sync="page.page" :page-size="page.limit" :total="page.total" @current-change="pageChange"></el-pagination>
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
    <!-- 新建楼栋管理员 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="isUpdate ? '修改楼栋管理员' : '添加楼栋管理员'" :visible.sync="dialogCreate" width="500px" :before-close="handleClose">
      <el-form :model="Form" :rules="rules" ref="Forms" label-width="100px" label-position="right" style="margin-right: 40px">
        <el-form-item label="宿舍楼宇:" prop="buildingId">
          <el-cascader style="width: 100%"  v-model="Form.buildingIdArr" @change="handleChange" :options="TreeData" :props="{ label: 'name', children: 'subBuildings', value: 'id',multiple: true}"></el-cascader>
        </el-form-item>
        <el-form-item label="姓名:" prop="face">
          <el-button size="mini" type="primary" @click="dialogChoosePerson.visible = true" style="margin-left: 10px">点击选择</el-button>
        </el-form-item>
        <el-form-item label="已选人员:" v-if="dialogChoosePerson.selectedRoom[0].name">
          <p>
            {{ dialogChoosePerson.selectedRoom[0].name }}
          </p>
        </el-form-item>
        <el-form-item label="电话:">
          <el-input clearable disabled v-model="dialogChoosePerson.selectedRoom[0].phone"></el-input>
        </el-form-item>
        <el-form-item label="人脸:">
          <img v-if="dialogChoosePerson.selectedRoom[0].face" class="avatar" :src="dialogChoosePerson.selectedRoom[0].face" />
        </el-form-item>
        <el-form-item label="备注:" prop="note">
          <el-input type="textarea" v-model.trim="Form.note" :maxlength="200" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" :disabled="addStatus" type="primary" @click="addHouseConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <DialogChoosePerson v-if="dialogChoosePerson.visible" @selectRoom="handleSelectRoom"></DialogChoosePerson>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <!--宿管详情-->
    <el-dialog top="10vh" class="newDialog" :close-on-click-modal="false" width="750px" title="楼栋管理员详情" :visible.sync="dormDetailShow">
      <div class="flex">
        <div class="detail-con-img">
          <img class="face-single" v-if="dormDetail.face" :src="dormDetail.face" />
          <img v-else src="../../../../assets/capture.png" class="face-single" />
        </div>
        <div class="right_detail" style="padding-top:10px;height:auto">
          <div class="right_item">
            姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：{{ dormDetail.name }}
          </div>
          <div class="right_item">
            联系电话：{{ dormDetail.phone }}
          </div>
          <div class="right_item">
            楼栋名称：{{ dormDetail.buildingName }}
          </div>
        </div>
      </div>
      <div class="note_detail flex" style="height:auto;">
        <div class="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</div>
        <div class="value note-value">{{ dormDetail.note }}</div>
      </div>
      <div slot="footer">
        <el-button size="small" @click="dormDetailShow = false">取 消</el-button>
        <el-button size="small" style="margin-left:18px" @click="openUpdate(dormDetail)" type="primary">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getBase64 } from "@/utils/index.js";
import {
  getHouseTreeData,
  addHouse,
  deleteTheHousePeople,
  getHouseListByUserId,
  getCardListByHouseId,
  deleteDoorCard,
} from "@/api/houseApi.ts";
import { _throttle } from "@/utils";
import config from "@/api/config";
import { getUserPropertyCar } from "@/api/carApi.ts";
const BigImg = () => import("@/components/BigImg/index.vue");
import { addBuildingAdmin, updateAdmin } from "@/api/peopleApi.ts";
import splitPane from "vue-splitpane";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const DialogChoosePerson = () => import("./components/DialogChoosePerson.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    splitPane,
    DialogChoosePerson,
    BigImg,
  },
})
export default class dormManageList extends Vue {
  private cutBtnType: Boolean = false;
  private dialogPerson: Boolean = false;
  dialogCreatePerson: Boolean = false;
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  queryBuildingId: String = ""; //通过dataTree获取到的宿舍楼id
  queryBuildingName: String = ""; //通过dataTree获取到的宿舍楼名称
  floorControlStatus: Boolean = false;
  exportUrl: string = config.v1 + "/admin/house/expor";
  config: any = config;
  private rowSpan: number = 12;
  initForm: object = {
    url: config.v1 + "/admin/building-admin",
    method: "get",
  };
  addStatus: boolean = false;
  filterForm: object = {
    // buildingId: "",
    name: "",
    phone: "",
  };
  deleteForm: object = {
    url: config.v1 + "/admin/building-admin",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的宿舍管理员， 删除后宿舍管理员将不存在,请谨慎操作!`,
  };
  Form: object = {
    buildingIdArr: [],
    buildingId: "",
    buildingIds: [],
    note: "",
    phone: "",
    name: "",
    face: "",
    id: "",
  };
  rowId: String = "";
  showProperty: String = "";
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  rules: any = {
    buildingIds: [
      { required: true, message: "请选择宿舍楼", trigger: "change" },
    ],
    face: [
      { required: true, message: "请选择职工", trigger: "change" },
    ],
  };
  TreeData: Array<Object> = []; // 树形结构数据
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
  private isUpdate: boolean = false; //创建编辑状态判断
  private dtailTable: Array<Object> = []; // 当前房屋下的注册人员
  selectVal: Array<object> = []; //选中的表格数据
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
  passList: object = {
    id: "",
    limit: 10,
    page: 1,
  };
  facePage: object = {
    id: "",
  };
  dormDetailShow: boolean = false;
  dialogChoosePerson: any = {
    //职工选择
    visible: false,
    selectedRoom: [{ name: "", phone: "", face: "", id: "" }],
  };
  // 宿管详情数据
  dormDetail: object = {};
  handleSelectRoom(item) {
    //选择职工回调
    console.log(item);
    this.Form["workerId"] = item[0].id;
    this.Form["face"] = item[0].face;
    this.$nextTick(() => {
      this.$refs["Forms"]["validateField"]("face", (valid) => {
        // console.log(valid)
      });
    });

    this.dialogChoosePerson.selectedRoom = item;
  }
  ComponentCommand(houseStatus: string, row: object) {
    return {
      ...row,
      houseStatus,
    };
  }

  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }
  handleClose() {
    this.imageUrl = "";
    this["dialogCreate"] = false;
    this.$refs["Forms"]["resetFields"]();
    for (let key in this.Form) {
      this.Form[key] = "";
      if (key === 'buildingIds') {
         this.Form[key] = [];
      }
    }
    // this.Form['buildingIds'] = [];
    // console.log(this.Form)
    this.dialogChoosePerson.selectedRoom = [
      {
        name: "",
        phone: "",
        face: "",
        id: "",
      },
    ];
    this.isUpdate = false;
  }
  handleClosePerson() {
    for (let key in this.personForm) {
      this.personForm[key] = "";
    }
    this.personForm["house"] = [];
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreatePerson"] = false;
    this.nameDisabled = false;
    this.imageUrl = "";
  }
  // 注册人数排序
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order !== "ascending";
    this["fetchData"](this.initForm);
  }
  resize() {}

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
  // 获取房屋结构
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
      this.initTreeData(this.TreeData);
      // this.rules["buildingId"].push({
      //   required: true,
      //   trigger: "change",
      //   validator: (rule, value, callback) => {
      //     if (!this.Form["buildingIdArr"].length) {
      //       callback(new Error("请先创建分组和宿舍楼"));
      //     } else {
      //       callback();
      //     }
      //   }
      // });
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
  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }
  // 修改备注
  confirmUpdateNote(row) {
    updateAdmin({
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
  // //处理回填数据
  // treeDataHandle(arrObj: Array<OB>,id: string){
  //   let arr: Array<string> = [];
  //   if(this.TreeData.length>0){
  //     this.TreeData.forEach(item => {
  //       if (item['id'] === id) {
  //         arr.push(id);
  //       }else {
  //         if (item['subBuildings'].length > 0){

  //         }
  //       }
  //     })
  //   }
  // }
  openDialogUpdate(row) {
    console.log("123", row);
    console.log(this.$refs);
    this.isUpdate = true;
    this.Form["name"] = row.name;
    this.Form["phone"] = row.phone;
    this.Form["id"] = row.id;
    this.Form["face"] = row.face;
    this.Form["workerId"] = row.workerId;
    this.Form["buildingId"] = row.buildingId;
    let arrId = [];
    if(row.groupList && row.groupList.length > 0) {
      row.groupList.map( (item: any) => {
        arrId.push([item['goupId'],item['buildingId']])
      })
    }

    // let arrId = [...row.groupIdList];
    //  let arrId = [...row.buildingId];
    // this.Form["buildingIdArr"] =row.buildingId;
    // arrId.push(row.buildingId);
    this.Form["buildingIdArr"] = arrId;
    this.Form["note"] = row.note;
    console.log("123", this.Form["buildingIdArr"]);
    this.dialogChoosePerson.selectedRoom = [
      {
        name: row.name,
        phone: row.phone,
        face: row.face,
        id: row.workerId,
      },
    ];
    // this.Form = {
    //   name: row.name,
    //   phone: row.phone,
    //   id: row.id,
    //   face: row.face,
    //   workerId: row.id
    // };
    this.imageUrl = row.face;
    this["dialogCreate"] = true;
  }
  // 添加管理员
  addHouseConfirm = _throttle(() => {
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        console.log('111',this.Form["buildingIdArr"]);
        console.log("buildingIds:"+this.Form["buildingIds"]);
        if (Array.isArray(this.Form["buildingIds"])) {
          this.Form["buildingIds"] = [...this.Form["buildingIds"]];
        }
        if (this.Form["id"]) {
          let addObj = {
            buildingIds: this.Form["buildingIds"],
            workerId: this.Form["workerId"],
            note: this.Form["note"],
            id: this.Form["id"],
          };
          updateAdmin(addObj).then((res) => {
            if (res.data.code === 200) {
              this["message"]("success", "修改成功");
              this["dialogCreate"] = false;
              this["fetchData"](this.initForm);
              this["handleClose"]();
            }
          });
        } else {
          let addObj = {
            buildingIds: this.Form["buildingIds"],
            workerId: this.Form["workerId"],
            note: this.Form["note"],
          };
          addBuildingAdmin(addObj).then((res) => {
            if (res.data.code === 200) {
              this["message"]("success", "添加成功");
              this["dialogCreate"] = false;
              this["fetchData"](this.initForm);

              this["handleClose"]();
            }
          });
        }
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
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
  handleChange() {
    debugger;
    const buildingIdArr = [...this.Form["buildingIdArr"]];
    const arr: any[] = [];
    for(let i=0;i<buildingIdArr.length;i++){
      arr.push(buildingIdArr[i][1]);
    }
    this.Form["buildingIds"] = arr;
  }
  // 姓名点击查看宿管详情
  toDetail(row) {
    this.dormDetailShow = true;
    this.dormDetail = Object.assign(this.dormDetail, row);
    // for(let item in this.dormDetail) {
    //   this.dormDetail[item] = row.item;
    // }
  }
  // 详情编辑按钮
  openUpdate(row) {
    this.dormDetailShow = false;
    this.openDialogUpdate(row);
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
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}
.content {
  height: calc(100vh - 92px - 43px) !important;
}
/deep/ .splitter-pane.vertical.splitter-paneR {
  height: calc(100% - 43px);
}
.rightContent {
  height: 100%;
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
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

//   .value_warn {
//     float: left;
//     width: 500px;
//     span {
//       padding: 0 20px;
//       display: inline-block;
//       margin-bottom: 10px;
//     }
//   }
// }
.mg-50 {
  margin-top: 50px;
}
.ml-50 {
  margin-left: 50px;
}
.detail-con-img {
  width: 180px;
  height: 180px;
  border: 1px solid #d8d8d8;
  margin-right: 20px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.note_detail {
  background: #f8f8f8;
  padding: 15px 10px;
  width: 670px;

  .lael {
    width: 80px;
    flex: 0 0 80px;
  }
  .note-value {
    line-height: 24px;
  }
}
</style>
