<template>
  <div class="app-container1">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <DataTree :page="page" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="true" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader ref="actionHeader" :initFormHeader="initForm" :filterForm="filterForm" @fetchData="fetchData" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus='false' :btnStatus='0'>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">班&nbsp;&nbsp;&nbsp;级:</span>
                      <el-input clearable placeholder="请输入需要查找的班级" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.className" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                      <el-input clearable placeholder="请输入需要查找的姓名" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.name" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">学&nbsp;&nbsp;&nbsp;号:</span>
                      <el-input clearable placeholder="请输入需要查找的学号" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.studentNo" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">日&nbsp;&nbsp;&nbsp;期:</span>&nbsp;&nbsp;
                      <el-date-picker v-model="filterForm.date" type="date" placeholder="选择日期" size="small" style="width:252px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                  </div>
                </ActionHeader>
              </el-col>
            </el-row>
            <el-table ref="table" :data="list_data" stripe border highlight-current-row v-loading="showLoading">
              <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" :show-overflow-tooltip="true" width="80" align="center" label="姓名"></el-table-column>
              <el-table-column prop="img" align="center" width="110" label="人脸图像">
                <template slot-scope="scope">
                  <img v-if="scope.row.face" class="capture-img cur-img" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" :src="scope.row.face" alt />
                  <span v-else> -- </span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" label="学号">
                <template slot-scope="scope">
                  <span>{{ scope.row.studentNo }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="className" :show-overflow-tooltip="true" align="center" label="班级"></el-table-column>
              <el-table-column prop="roomName" :show-overflow-tooltip="true" align="center" class="serial-num" label="宿舍"></el-table-column>
              <el-table-column prop="upRecord" :show-overflow-tooltip="true" align="center" class="serial-num" label="上学">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.upRecord == '正常'" size="mini" type="success">正常</el-tag>
                  <el-tag v-if="scope.row.upRecord == '迟到'" size="mini" type="danger">迟到</el-tag>
                  <el-tag v-if="scope.row.upRecord == '未打卡'" size="mini" type="warning">未打卡</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="downRecord" :show-overflow-tooltip="true" align="center" label="放学">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.downRecord == '正常'" size="mini" type="success">正常</el-tag>
                  <el-tag v-if="scope.row.downRecord == '早退'" size="mini" type="danger">早退</el-tag>
                  <el-tag v-if="scope.row.downRecord == '未打卡'" size="mini" type="warning">未打卡</el-tag>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="status" align="center" label="回寝">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.isLateBack===0 && scope.row.isNoReturn===0" size="mini" type="success">正常</el-tag>
                  <el-tag v-if="scope.row.isNoReturn===1" size="mini" type="danger">未归</el-tag>
                  <el-tag v-if="scope.row.isLateBack===1 && scope.row.isNoReturn===0" size="mini" type="warning">晚归</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="通行记录" width="110" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" :current-page="page.page" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog top="10vh" :close-on-click-modal="false" width="950px" title="通行记录" :visible.sync="detailDialog"  :before-close="closeDialog">
      <el-table :data="passlist" stripe border>
        <el-table-column prop="name" :show-overflow-tooltip="true" align="center" label="姓名"></el-table-column>
        <el-table-column prop="studentNo" :show-overflow-tooltip="true" align="center" label="学号"> </el-table-column>
        <el-table-column prop="passMethod" :show-overflow-tooltip="true" align="center" label="通行方式">
          <template slot-scope="scope">
            <span class="serial-num">{{ scope.row.passMethod | passMethod }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="deviceInfo.inOut" label="出入类型">
          <template slot-scope="scope">
            <span class="serial-num">{{ scope.row.deviceInfo.inOut }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="120" align="center" prop="devId" label="通行设备">
          <template slot-scope="scope">
            <span class="serial-num">{{ scope.row.deviceInfo.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="devType" label="通行位置" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="serial-num">{{ scope.row.deviceInfo.bindingAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" align="center" prop="img" label="抓拍人脸">
          <template slot-scope="scope">
            <img v-if="scope.row.photos"  @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.photos)"  style="margin-top: 3px" class="capture-img" :src="scope.row.photos" alt />
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="passTime" label="通行时间" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination @current-change="pageChange1" :page-size="Size" :current-page="currentPage" :total="Total" style="margin-top: 10px" background layout="prev, pager, next">
      </el-pagination>
    </el-dialog>

    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import mixin from "@/config/minxins";
import config from "@/api/config";
import splitPane from "vue-splitpane";
import ActionHeader from "@/components/ActionHeader.vue";
import DataTree from "@/components/DataTree.vue";
import BigImg from "@/components/BigImg/index.vue";

import { getHouseTree } from "@/api/houseApi";
import { getPassList } from "@/api/peopleApi";
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    splitPane,
    BigImg,
  },
  filters: {
    passMethod(val: string) {
      const data = {
        FACE_OPEN: "人脸开门",
        VISITOR_OPEN: "访客开门",
        SCAN_OPEN: "二维码开门",
        REMOTE_OPEN: "远程开门",
        CARD_OPEN: "刷卡开门",
        DYNAMIC_CODE_OPEN: "动态密码",
      };
      return data[val];
    },
  },
})
export default class dormList extends Vue {
  config: any = config;
  private rowSpan: number = 12;
  private cutBtnType: Boolean = false;
  queryBuildingId: String = ""; //通过dataTree获取到的宿舍楼id
  queryBuildingName: String = ""; //通过dataTree获取到的宿舍楼名称
  floorControlStatus: Boolean = false;
  initForm: object = {
    url: config.v1 + "/admin/attendance-record/student/resident",
    method: "get",
  };
  filterForm: object = {
    date: new Date(),
    name: "",
    className: "",
    studentNo: "",
  };
  // page: object = {
  //   page: 1,
  //   limit: 10,
  //   total:0
  // };
  imgVisible: Boolean = false; // 控制放大图片的visible
  bigImg: String = "";
  TreeData: Array<Object> = []; // 树形结构数据
  detailDialog: Boolean = false;
  passlist: Array<Object> = [];
  Size: number = 10;
  currentPage: number = 1;
  Total: number = 0;
  userForm: Object = {};

  created() {
    this.getHouseTreeData();
    this.filterForm["date"] = this.getNowFormatDate();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  closeDialog() {
    this['detailDialog'] = false;
    this['currentPage'] = 1;
    this['Size'] =10;
  }
  resize() {}
  // 获取班级结构
  getHouseTreeData() {
    getHouseTree().then((res: Object) => {
      this.TreeData = res["data"]["data"];
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
  }

  showDetail(val) {
    this.getPasslist(val);
    this.detailDialog = true;
  }

  getPasslist(val) {
    this.userForm = val;
    let params = {
      scenceUserId: val.scenceUserId,
      page: this.currentPage,
      limit: this.Size,
      startTime: this.filterForm["date"] + " 00:00:00",
      endTime: this.filterForm["date"] + " 23:59:59",
    };
    getPassList(params).then((res) => {
      if (res.data.code == 200) {
        res.data.data.records.forEach((i) => {
          i.name = val.name;
          i.studentNo = val.studentNo;
        });
        this.passlist = res.data.data.records;
        this.Total = res.data.data.total;
      }
    });
  }

  pageChange1(value) {
    this.currentPage = value;
    this.getPasslist(this.userForm);
  }

  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month: any = date.getMonth() + 1;
    var strDate: any = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }

  // handleClose() {
  //   this["dialogCreate"] = false;
  // }
}
</script>

<style lang="scss" scoped>
.components-container {
  position: relative;
  height: 100%;
}
.rightContent {
  height: calc(100vh - 80px);
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}

/deep/ .splitter-pane.vertical.splitter-paneR {
  height: calc(100% - 43px);
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
  margin-bottom: 30px;
  .img-col {
    margin-top: 30px;
  }
}
.img-con {
  width: 100%;
  height: 100%;
  text-align: center;
  img {
    width: 100px;
    height: 100px;
  }
  .name-item {
    margin-top: 10px;
  }
}
</style>
