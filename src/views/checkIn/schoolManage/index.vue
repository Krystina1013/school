<template>
  <div class="app-container">
    <div class="tabs-group">
      <el-radio-group v-model="activeName" @change="handleClick" size="small">
        <el-radio-button size="mini" label="1">走读生</el-radio-button>
        <el-radio-button size="mini" label="2">住宿生</el-radio-button>
      </el-radio-group>
    </div>
    <div class="components-container" :class="activeName == 2?'has-tab':''">
      <div class="tabsHeader" v-if="activeName == 2">
        <el-tabs v-model="active2Name" @tab-click="changeActive">
          <el-tab-pane label="按班级" name="1"></el-tab-pane>
          <el-tab-pane label="按宿舍" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <DataTree v-if="active2Name=='1'" :page="page" type="gradeInfo_student" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="false" @fetchData="fetchData" @getClassTreeData="getClassTreeData" />
            <DataTree v-if="active2Name=='2'" :page="page" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="true" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" />
          </div>
        </template>
        <template slot="paneR">

          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader ref="actionHeader" :initFormHeader="initForm" :filterForm="filterForm" @fetchData="fetchData" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus='false' :btnStatus=0>
                  <div slot="houseNum">
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

            <el-table ref="table" :key="TableKey" :data="list_data" stripe border highlight-current-row v-loading="tableLoading">
              <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" :show-overflow-tooltip="true" align="center" class="serial-num" label="姓名"></el-table-column>
              <el-table-column prop="img" align="center" width="110" label="人脸">
                <template slot-scope="scope">
                  <img v-if="scope.row.face" class="capture-img" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" :src="scope.row.face" alt />
                  <span v-else> -- </span>
                </template>
              </el-table-column>
              <el-table-column prop="studentNo" :show-overflow-tooltip="true" align="center" class="serial-num" label="学号"></el-table-column>
              <el-table-column prop="className" :show-overflow-tooltip="true" align="center" class="serial-num" label="班级"></el-table-column>
              <el-table-column v-if="activeName == '2'" prop="roomName" :show-overflow-tooltip="true" align="center" class="serial-num" label="宿舍"></el-table-column>
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
              <el-table-column v-if="activeName == '2'" :show-overflow-tooltip="true" prop="status" align="center" label="回寝">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.isLateBack==0 && scope.row.isNoReturn==0" size="mini" type="success">正常</el-tag>
                  <el-tag v-if="scope.row.isNoReturn==1" size="mini" type="danger">未归</el-tag>
                  <el-tag v-if="scope.row.isLateBack==1 && scope.row.isNoReturn==0" size="mini" type="warning">晚归</el-tag>
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

    <el-dialog top="10vh" :close-on-click-modal="false" width="950px" title="通行记录" :visible.sync="detailDialog" :before-close="closeDialog">
      <el-table :data="passlist" stripe border>
        <el-table-column prop="name" :show-overflow-tooltip="true" align="center" label="姓名"></el-table-column>
        <el-table-column prop="studentNo" :show-overflow-tooltip="true" align="center" label="学号"> </el-table-column>
        <el-table-column prop="passMethod" :show-overflow-tooltip="true" align="center" label="通行方式">
          <template slot-scope="scope">
            <span class="serial-num">{{  passMethod(scope.row.passMethod) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="deviceInfo.inOut" label="出入类型">
          <template slot-scope="scope">
            <span class="serial-num">{{scope.row.deviceInfo.inOut }}</span>
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
            <img v-if="scope.row.photos" style="margin-top: 3px" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.photos)" class="capture-img" :src="scope.row.photos" alt />
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="passTime" label="通行时间" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination @current-change="pageChange1" :page-size="Size" :current-page="currentPage" :total="Total" style="margin-top: 10px" background layout="prev, pager, next">
      </el-pagination>
    </el-dialog>

    <BigImg :centerDialogVisible="imgVisible" bigTitle="人脸" :bigImg="bigImg" />
  </div>
</template>

<script>
import mixin from "@/config/minxins";
import config from "@/api/config";
import splitPane from "vue-splitpane";
import DataTree from "@/components/DataTree";
import ActionHeader from "@/components/ActionHeader.vue";
import BigImg from "@/components/BigImg/index.vue";

import { getclassTree, getHouseTree } from "@/api/houseApi";
import { getPassList } from "@/api/peopleApi";

export default {
  mixins: [mixin],
  components: {
    splitPane,
    DataTree,
    ActionHeader,
    BigImg
  },

  data() {
    return {
      config: config,
      rowSpan: 12,
      TreeData: [],
      tableLoading: false,
      initForm: {
        url: config.v1 + "/admin/attendance-record/student",
        method: "get",
      },
      filterForm: {
        date: new Date(),
        name: '',
        className: '',
        studentNo: '',
        buildingId: ''
      },
      activeName: "1",
      active2Name: "1",
      TableKey: 0,
      imgVisible: false, // 控制放大图片的visible
      bigImg: "",
      detailDialog: false,
      passlist: [],
      Size: 10,
      currentPage: 1,
      Total: 0,
      userForm: {}
    }
  },
  created() {
    this.getClassTreeData();
    this.filterForm.date = this.getNowFormatDate()
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  },
  methods: {
    passMethod(val) {
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
    handleBuildingId(data) {
      /**@description 获取宿舍楼id */
      this.queryBuildingId = data.id;
      this.filterForm["buildingId"] = data.id;
      this.queryBuildingName = data.name;
      this.floorControlStatus = !data.subBuildings;
      if (!!data.subBuildings) {
        this.cutBtnType = false;
      }
    },
    changeActive() {
      this.TreeData = [];
      if (this.active2Name == 2) {
        this.getHouseTreeData();
      } else {
        this.getClassTreeData();
      }
    },
    /// 切换导航
    changeRadio(val) {
      if (val === "2") {
        this.active2Name = '1';
      }
    },
    // 获取宿舍结构
    getHouseTreeData() {
      getHouseTree().then((res) => {
        this.TreeData = res["data"]["data"];
      });
    },
    // 获取班级结构
    getClassTreeData() {
      getclassTree().then((res) => {
        this.TreeData = this.iterator_self(res["data"]["data"]);
      });
    },
    // 递归需要的tree数据
    iterator_self(arr) {
      let obj = [];
      for (let key in arr) {
        const name = key;
        let subBuildings = [];
        if (JSON.stringify(arr[key]) != "{}") {
          if (arr[key] instanceof Array != true) {
            subBuildings = this.iterator_self(arr[key]);
          }
        }
        if (JSON.stringify(arr[key]) != "{}") {
          if (arr[key] instanceof Array) {
            for (let v = 0; v < arr[key].length; v++) {
              subBuildings.push({ name: arr[key][v] });
            }
          }
          obj.push({
            name,
            subBuildings,
          });
        }
      }
      return obj;
    },

    showDetail(val) {
      this.getPasslist(val)
      this.detailDialog = true
    },
    closeDialog() {
      this.detailDialog = false;
      this.currentPage = 1;
      this.Size = 10;
    },
    getPasslist(val) {
      this.userForm = val
      let params = {
        scenceUserId: val.scenceUserId,
        page: this.currentPage,
        limit: this.Size,
        startTime: this.filterForm.date + " 00:00:00",
        endTime: this.filterForm.date + " 23:59:59",
      };
      getPassList(params).then((res) => {
        if (res.data.code == 200) {
          res.data.data.records.forEach((i) => {
            i.name = val.name
            i.studentNo = val.studentNo
          });
          this.passlist = res.data.data.records
          this.Total = res.data.data.total
        }
      });
    },

    pageChange1(value) {
      this.currentPage = value
      this.getPasslist(this.userForm)
    },

    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    resize() { },
    // 切换导航
    handleClick() {
      this.active2Name = '1';
      this.getClassTreeData()
      if (this.activeName == "1") {
        this.initForm['url'] = config.v1 + "/admin/attendance-record/student";
      } else if (this.activeName == "2") {      
        this.initForm['url'] = config.v1 + "/admin/attendance-record/student/resident";
      }
      this.page = {
        total: 0,
        page: 1,
        limit: 10
      }
      this.initForm["params"] = Object.assign(
        this.initForm["params"],
        this.page
      ); // 合并参数
      this.fetchData(this.initForm);
      this.TableKey += 1
    },
  }
}
</script>

<style lang="scss" scoped>
.components-container {
  height: calc(100% - 45px);
}
.vue-splitter-container {
  height: 100%;
}
.has-tab {
  height: calc(100% - 45px);
  .vue-splitter-container {
    height: calc(100% - 46px);
  }
  .leftContent {
    height: calc(100vh - 142px);
    /deep/.content {
      height: 100%;
    }
  }
  .rightContent {
    height: calc(100vh - 160px);
  }
}
.leftContent {
  height: calc(100vh - 96px);
  /deep/.content {
    height: 100%;
  }
}
.rightContent {
  height: calc(100vh - 120px);
}
/deep/.el-tabs__nav .is-top {
  background-color: transparent;
}
/deep/.el-tabs__active-bar {
  background-color: #409eff !important;
}

/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  box-shadow: -1px 0 0 0 #b3d8ff;
}
/deep/ .el-radio-button__inner {
  font-size: 14px;
}
.tabs-group {
  padding: 5px 16px;
  border-bottom: 1px solid #e4e7ed;
}
.tabsHeader {
  padding-left: 30px;
  background: #fff;
  .el-tabs__header {
    margin: 0 !important;
    height: 46px;
  }
  .el-tabs__nav-wrap {
    line-height: 46px;
  }
  .el-tabs__nav-wrap::after {
    background: transparent;
  }
}
/deep/.el-tabs__active-bar {
  bottom: 5px;
}
/deep/.el-tabs__nav-wrap::after {
  height: 0;
}
/deep/ .el-tree {
  overflow: auto;
  height: calc(100% - 40px);
  > .el-tree-node {
    /*设置横向滚动条*/
    min-width: 100%;
    display: inline-block;
  }
}
</style>