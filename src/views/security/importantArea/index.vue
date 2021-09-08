<template>
  <div class="app-container">
    <div class="components-container">
      <div class="rightContent">
        <el-row>
          <el-col :span="24">
            <ActionHeader :moreStatus="false" :filterStatus="true" :pageStatus="true" :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total" :btnStatus='0'>
              <el-button slot="faceImport" class="createBtn" type="primary" size="small" @click="openCreate">添加</el-button>
              <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                  批量删除
                </el-button>
              </div>
              <div slot="houseNum">
                <div class="word-filter">
                  <span class="filter-name">区域名称:</span>
                  <el-input class="input-filter" maxlength="30" v-model.trim="filterForm.name" size="small"></el-input>
                </div>
              </div>
            </ActionHeader>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-table v-loading="showLoading" :data="list_data" stripe border highlight-current-row @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange" @selection-change="handleSelectionChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>

              <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column class="serial-num" prop="name" label="区域名称" :maxlength="20" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-button @click="openDetail(scope.row)" type="text">
                    {{scope.row.name}}</el-button>
                </template>
              </el-table-column>

              <el-table-column prop="enterTimes" align="center" label="预警人员方式">
                <template slot-scope="scope">
                  <span>
                    {{scope.row.warnType=='BACKLIST'?'黑名单':'白名单'}}</span>
                </template>
              </el-table-column>

              <el-table-column class="serial-num" prop="name" label="人员数量" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-button @click="openDetail(scope.row)" type="text">
                    {{scope.row.scenceUserCount}}</el-button>
                </template>
              </el-table-column>
              <el-table-column class="serial-num" prop="name" label="关联设备" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-button @click="openDetail(scope.row)" type="text">
                    {{scope.row.cameraCount}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" align="center" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="操作" width="120" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="editFrom(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" style="margin-left: 0" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" style="margin-top:10px;" background layout="prev, pager, next,total" :page-size="page.limit" :total="page.total"></el-pagination>
            <!-- <el-pagination @current-change="pageChange" :page-size="page.pageSize" :current-page="page.page" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination> -->
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 添加重点区域 -->
    <el-dialog :title="createForm.id ? '编辑区域' : '添加区域'" class="newDialog noPadding_bot" :visible.sync="dialogCreate" top="50px" width="900px" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="createForm" :rules="rules" ref="dataForm" label-width="110px">
        <el-form-item label="区域名称:" prop="name" :show-message="showMessage" :error="errorMessage.name">
          <el-input v-model.trim="createForm.name" placeholder="输入区域名称" :maxlength="20" clearable @input="constraintLength(createForm.name, '20')" @keyup.enter.native="addPassageway"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:43px" label="关联设备:" prop="cameraIds">
          <el-button size="mini" type="primary" @click="openCameraDialog" style="margin-left: 10px">点击选择</el-button>
          <span style="margin-left:20px">已选择 {{ dialogChooseCamera.selectedIds.length }} 个</span>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item style="margin-top:54px;margin-bottom:43px" label="预警人员方式:" prop="warnType" :show-message="showMessage" :error="errorMessage.note">
          <el-row>
            <el-col :span="12">
              <div class="blacklist_item" :class="createForm.warnType == 'BACKLIST' ? 'choose_list' : ''">
                <el-radio v-model="createForm.warnType" label="BACKLIST">黑名单</el-radio>
                <p>1.选择黑名单，下方添加的人员即为黑名单人员;</p>
                <p>2.当黑名单中的人员进入区域后立即报警，其他人不预警;</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="blacklist_item" :class="createForm.warnType == 'WHITELIST' ? 'choose_list' : ''">
                <el-radio v-model="createForm.warnType" label="WHITELIST">白名单</el-radio>
                <p>1.选择白名单，下方添加的人员即为白名单人员;</p>
                <p>2.当白名单中的人员进入区域后不报警，其他人员都预警;</p>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item style="margin:43px 0" label="人员信息:" prop="persons">
          <el-button size="mini" type="primary" @click="selectPersonClick" style="margin-left: 10px">点击选择</el-button>
          <span style="margin-left:20px">已选择 {{ dialogChoosePerson.selectedRoom.length }} 人</span>
        </el-form-item>
        <el-form-item style="margin:43px 0" label="布防时间段:" prop="persons">
          <el-time-picker is-range v-model="createForm.date" range-separator="-" @change="sureTime" :clearable="true" start-placeholder="开始时间" value-format="HH:mm" format="HH:mm" end-placeholder="结束时间" placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-divider></el-divider>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" style="margin-left:18px" size="small" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <ChooseCamera @close="handleCameraClose" :areaId='createForm.id' :unBind='true' @submit="confirmCamera" :visible="dialogChooseCamera.visible" :camera="dialogChooseCamera.camera"></ChooseCamera>
    <!-- 区域详情 -->
    <el-dialog title="区域详情" class="newDialog noPadding_bot" :visible.sync="dialogDetailShow" width="910px" :before-close="handleDetailClose" :close-on-click-modal="true">
      <div class="detail-item">
        <div class="title-left">区域名称：</div>
        <div class="value-right">{{ detailData.name }}</div>
      </div>
      <div class="detail-item">
        <div class="title-left">预警人员方式：</div>
        <div class="value-right">{{ detailData.warnType == 'BACKLIST' ? '黑名单' : '白名单' }}</div>
      </div>
      <div class="detail-item">
        <el-tabs v-model="activeName">
          <el-tab-pane label="学生" name="first">
            <div class="itemImg_list" v-if="detailData.student_scenceUserVos && detailData.student_scenceUserVos.length > 0">
              <div class="person-one" v-for="(item,i) in detailData.student_scenceUserVos" :key='i'>
                <img :src="item.face || '/static/img/capture.b3fd5b10.png'" />
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
            <div class="itemImg_list" v-else>
              <p class="no-data">暂无数据</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="教师" name="second">
            <div class="itemImg_list" v-if="detailData.teacher_scenceUserVos && detailData.teacher_scenceUserVos.length > 0">
              <div class="person-one" v-for="(item,i) in detailData.teacher_scenceUserVos" :key='i'>
                <img :src="item.face || '/static/img/capture.b3fd5b10.png'" />
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
            <div class="itemImg_list" v-else>
              <p class="no-data">暂无数据</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="职工" name="third">
            <div class="itemImg_list" v-if="detailData.worker_scenceUserVos && detailData.worker_scenceUserVos.length > 0">
              <div class="person-one" v-for="(item,i) in detailData.worker_scenceUserVos" :key='i'>
                <img :src="item.face || '/static/img/capture.b3fd5b10.png'" />
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
            <div class="itemImg_list" v-else>
              <p class="no-data">暂无数据</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="detail-item">
        <div class="title-left">关联设备：</div>
        <div class="value-right">
          <span v-for="(ite,it) in detailData.cameraVos" class='device-one' :key="it">
            {{ite.name}}
          </span>
        </div>
      </div>
      <div class="detail-item">
        <div class="title-left">布防时间段：</div>
        <div class="value-right" v-if="detailData.startTime">{{ (detailData.startTime || '') +'-'+  (detailData.endTime||'')}}</div>
      </div>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDetailShow = false">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="openUpdate(detailObj)">编 辑</el-button>
      </span>
    </el-dialog>
    <!--选择预警人员-->
    <DialogChoosePerson :multiple='true' v-if="dialogChoosePerson.visible" @selectRoom="handleSelectRoom"></DialogChoosePerson>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { getAllCamera, addArea, putArea, getAreaById } from "@/api/police.ts";
import mixin from "@/config/minxins";
import config from "@/api/config";
import tr from "date-fns/esm/locale/tr/index.js";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DialogChoosePerson = () => import("./components/DialogChoosePerson.vue");
import ChooseCamera from "../importantPerson/components/chooseCamera.vue";
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DialogChoosePerson,
    ChooseCamera,
  },
})
export default class importantArea extends Vue {
  selectVal: Array<object> = []; //选中的表格数据
  filterForm: object = {
    name: "",
  }; //根据关键字查询
  // 添加dialog弹框信息
  private createForm: Object = {
    name: "",
    warnType: "BACKLIST",
    cameraIds: [],
    id: "",
    date: "",
  };
  private rules: Object = {
    //添加验证
    name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
    warnType: [{ required: true, message: "选择预警方式", trigger: "change" }],
    cameraIds: [{ required: true, message: "选择关联设备", trigger: "change" }],
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "",
    note: "",
  };
  dialogChooseCamera: Object = {
    visible: false,
    camera: [],
    selectedIds: [],
  };
  activeName: string = "first";
  updateArray: Array<string> = ["noteStatus"];
  initForm: object = {
    //获取车辆列表url
    url: config.v1 + "/admin/area",
    method: "get",
  };
  detailData: Object = {
    student_scenceUserVos: [],
    teacher_scenceUserVos: [],
    worker_scenceUserVos: [],
    cameraVos: [],
    name: "",
    type: "",
    id: "",
    startTime: "",
    endTime: "",
  };
  detailObj: Object = {};
  deleteForm: Object = {
    //单个或批量删除
    url: config.v1 + "/admin/area",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的重点区域,请谨慎操作!`,
  };
  dialogChoosePerson: Object = {
    visible: false,
    selectedRoom: [],
  };
  dialogDetailShow: boolean = false;
  selectList: Array<string> = [];
  cameraSelectedIds: any = [];
  allCameras: any = [];
  handleSelectRoom(item) {
    //选择职工回调
    this.dialogChoosePerson["selectedRoom"] = item;
  }
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  // 添加弹窗
  openCreate() {
    this.getAllCamera();
    this["dialogCreate"] = true;
  }
  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = val;
  }
  // 添加弹窗确认
  confirmAdd() {
    /**@description 添加出入口 */
    this.$refs["dataForm"]["validate"]((valid) => {
      if (valid) {
        let usersId: Array<string> = [];
        let datas = this.dialogChoosePerson["selectedRoom"];
        if (datas && datas.length > 0) {
          datas.map((ele) => {
            usersId.push(ele.scenceUserId);
          });
        }
        let params: object = {
          cameraIds: this.createForm["cameraIds"],
          id: this.createForm["id"],
          name: this.createForm["name"],
          scenceUserIds: usersId,
          warnType: this.createForm["warnType"],
          startTime: this.createForm["date"][0],
          endTime: this.createForm["date"][1],
        };
        if (params["id"]) {
          // 修改
          putArea(params)
            .then((res) => {
              if (res.data.code == 200) {
                this.handleClose();
                this["fetchData"](this.initForm);
                this["message"]("success", `修改区域成功!`);
              }
            })
            .catch((err) => {});
        } else {
          //添加
          addArea(params)
            .then((res) => {
              if (res.data.code == 200) {
                this.handleClose();
                this["fetchData"](this.initForm);
                this["message"]("success", `添加区域成功!`);
              }
            })
            .catch((err) => {});
        }
      }
    });
  }

  async editFrom(item) {
    /**@description 修改状态 */
    let param = {
      limit: 1000,
      page: 1,
      areaId: item.id,
    };
    let { data } = await getAllCamera(param);

    for (const key in this.createForm) {
      this.createForm[key] = item[key];
    }
    this.allCameras = data.data;
    this.selectList = this.createForm["cameraIds"];
    if (item["startTime"]) {
      this.createForm["date"] = [item["startTime"], item["endTime"]];
    } else {
      this.createForm["date"] = "";
    }
    let selectData: any = [];
    data.data.forEach((item) => {
      if (this.createForm["cameraIds"].indexOf(item.id) != -1) {
        // this.$set(item, "chooseOr", true);
        selectData.push(item);
      }
    });
    this.dialogChooseCamera["camera"] = selectData;

    this["dialogCreate"] = true;
    this.dialogChooseCamera["selectedIds"] = this.createForm["cameraIds"];

    let selectRoomz: any = [];
    item["scenceUserIds"].forEach((ele) => {
      selectRoomz.push({ scenceUserId: ele, name: "" });
    });
    this.dialogChoosePerson["selectedRoom"] = selectRoomz;
  }

  handleClose() {
    /** @description 关闭添加/修改dialog */
    this["dialogCreate"] = false;
    this.createForm = {
      name: "",
      id: "",
      cameraIds: [],
      warnType: "BACKLIST",
      date: "",
    };
    this.dialogChoosePerson["selectedRoom"] = [];
    this.dialogChooseCamera["camera"] = [];
    this.dialogChooseCamera["selectedIds"] = [];
    this.$refs["dataForm"]["resetFields"]();
  }
  // 详情弹窗关闭
  handleDetailClose() {
    this.dialogDetailShow = false;
    this.detailData = {
      student_scenceUserVos: [],
      teacher_scenceUserVos: [],
      worker_scenceUserVos: [],
      cameraVos: [],
      name: "",
      warnType: "",
      id: "",
      startTime: "",
      endTime: "",
    };
  }
  // 详情的编辑按钮
  openUpdate(row) {
    this.editFrom(row);

    this.handleDetailClose();
  }
  // 打开详情
  async openDetail(row) {
    this.detailObj = row;
    this.activeName = "first";
    let { data } = await getAreaById({ id: row.id });
    this.detailData = data.data;
    this.dialogDetailShow = true;
  }
  // **选择设备*//
  async getAllCamera() {
    let param = {
      limit: 1000,
      page: 1,
    };
    let { data } = await getAllCamera(param);
    // data.data.forEach((item) => {
    //   if()
    // });
    this.allCameras = data.data;
  }
  openCameraDialog() {
    this.dialogChooseCamera["visible"] = true;
    let arr = this.dialogChooseCamera["selectedIds"];
    console.log(this.dialogChooseCamera["camera"]);
    // this.dialogChooseCamera["camera"].forEach((item) => {
    //   if (arr.indexOf(item.id) != -1) {
    //     this.$set(item, "chooseOr", true);
    //   } else {
    //     this.$set(item, "chooseOr", false);
    //   }
    // });
    // 取消的时候使用
    this.cameraSelectedIds = JSON.parse(JSON.stringify(arr));
  }
  chooseOne(val) {
    val.chooseOr = true;
    this.dialogChooseCamera["selectedIds"].push(val.id);
  }
  getName(val) {
    let name = "";
    let list = this.dialogChooseCamera["camera"];
    if (list && list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == val) {
          name = list[i].name;
        }
      }
    }
    return name;
  }
  delChoose(id) {
    if (
      this.dialogChooseCamera["selectedIds"] &&
      this.dialogChooseCamera["selectedIds"].length > 0
    ) {
      var index = this.dialogChooseCamera["selectedIds"].indexOf(id);
      if (index > -1) {
        this.dialogChooseCamera["selectedIds"].splice(index, 1);
      }

      this.dialogChooseCamera["camera"].forEach((item) => {
        if (item.id === id) {
          item.chooseOr = false;
        }
      });
    }
  }

  handleCameraClose() {
    this.dialogChooseCamera["selectedIds"] = this.cameraSelectedIds;
    let selectData: any = [];
    this.allCameras.forEach((item) => {
      if (this.cameraSelectedIds.indexOf(item.id) != -1) {
        // this.$set(item, "chooseOr", true);
        selectData.push(item);
      }
    });
    this.dialogChooseCamera["camera"] = selectData;
    // this.dialogChooseCamera['camera'] = this.cameraSelectedIds;
    // this.dialogChooseCamera["selectedIds"] = this.selectList;
    this.dialogChooseCamera["visible"] = false;
  }
  confirmCamera(data) {
    if (data.length > 0) {
      this.dialogChooseCamera["selectedIds"] = data.map((item) => {
        return item.id;
      });
      this.dialogChooseCamera["camera"] = data;
      this.createForm["cameraIds"] = this.dialogChooseCamera["selectedIds"];
    } else {
      this.dialogChooseCamera["selectedIds"] = [];
      this.createForm["cameraIds"] = [];
      this.dialogChooseCamera["camera"] = [];
    }

    this.dialogChooseCamera["visible"] = false;
  }
  // 人员选择按钮点击
  async selectPersonClick() {
    if (!this.createForm["id"]) {
      this.dialogChoosePerson["visible"] = true;
      return;
    }
    let data = await getAreaById({ id: this.createForm["id"] });
    this.detailData = JSON.parse(JSON.stringify(data.data.data));
    this.dialogChoosePerson["visible"] = true;
  }
  sureTime(e) {
    this.createForm["date"] = e;
  }
}
</script>

<style lang="scss">
.noPadding_bot {
  .el-dialog__body {
    padding-bottom: 0;
  }
}
.noPadding {
  .el-dialog__body {
    padding: 0;
  }
}
.camera_dialog {
  .el-transfer-panel {
    width: 250px;
  }
  .el-transfer__buttons {
    padding: 0 15px;
  }
}
// .area_form {
//   .el-divider--horizontal {
//     margin: 43px 0;
//   }
// }
.detail-item {
  .el-tabs__item {
    color: #6a7e92;
  }
  .el-tabs__item.is-active {
    color: #409eff;
  }
  .el-tabs__active-bar {
    height: 4px;
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tabs__nav-scroll {
    border-top: 1px solid #f1f3f4;
  }
}
</style>

<style lang="scss" scoped>
.blacklist_item {
  width: 323px;
  height: 126px;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  padding: 0 12px;
  p {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    color: #606266;
    letter-spacing: 0px;
    line-height: 20px;
    margin-bottom: 10px;
  }
}

.choose_list {
  border: 1px solid #409eff;
}

.detail-item {
  overflow: hidden;
  margin-bottom: 20px;
  .title-left,
  .value-right {
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 32px;
    line-height: 32px;
    font-family: PingFang SC, PingFang SC-Medium;
  }
  .title-left {
    width: 120px;
    text-align: right;
    color: #606266;
  }
  .value-right {
    margin-left: 15px;
    width: calc(100% - 200px);
    color: #3a414f;
  }

  .itemImg_list {
    width: 840px;
    height: 296px;
    background: rgba(241, 243, 244, 0.3);
    padding-left: 18px;
    padding-bottom: 18px;
    overflow-y: auto;
    .no-data {
      margin-top: 18px;
    }
  }
  .person-one {
    width: 88px;
    height: 120px;
    float: left;
    margin-right: 14px;
    margin-top: 18px;
    img {
      width: 88px;
      height: 88px;
    }
    .name {
      width: 88px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #3a414f;
    }
  }
}

.noPadding {
  .left {
    border-right: 0.5px solid #f1f3f4;
  }
  .right {
    border-left: 0.5px solid #f1f3f4;
  }
  .header_div {
    height: 45px;
    border-bottom: 1px solid #f1f3f4;
    padding-left: 20px;
    p {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #409eff;
      line-height: 45px;
    }
  }
  .body_div {
    border-bottom: 1px solid #f1f3f4;
    padding: 20px;
  }
}

.checkboxT {
  border: 1px solid #409eff;
  color: #409eff;
  padding: 4px 10px;
  border-radius: 4px;
}
.checkboxF {
  border: 1px solid #e9e9eb;
  padding: 4px 10px;
  border-radius: 4px;
}

.filter-name {
  width: 120px;
}

/deep/.el-transfer-panel {
  width: 340px;
}
</style>
