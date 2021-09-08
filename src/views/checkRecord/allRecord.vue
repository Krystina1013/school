<template>
  <div class="app-container">

    <div class="components-container">
      <div class="tabsHeader">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全校学生" name="1"></el-tab-pane>
          <el-tab-pane label="住宿生" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <DataTree v-if="activeName == 1" :page="page" type="gradeInfo_student" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="false" @fetchData="fetchData" @getClassTreeData="getClassTreeData" />
            <DataTree v-if="activeName == 2" :page="page" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="true" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" />
          </div>
        </template>
        <template slot="paneR">

          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader :initFormHeader="initForm" ref="actionHeader" @fetchData="fetchData" :filterForm="filterForm" :filterStatus='false' :moreStatus='false' :searchStatus='true' :btnStatus=0 :dialogCreate.sync="dialogCreate" :total="page.total">
                  <div slot="searchNum" style="float:left; margin-right:10px;">
                    <el-date-picker v-model="filterForm.date" type="date" placeholder="选择日期" size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
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
              <el-table-column v-if="activeName == '1'" prop="className" :show-overflow-tooltip="true" align="center" class="serial-num" label="班级"></el-table-column>
              <el-table-column v-if="activeName == '2'" prop="roomName" :show-overflow-tooltip="true" align="center" class="serial-num" label="宿舍"></el-table-column>
              <el-table-column prop="normalUpCount" :show-overflow-tooltip="true" align="center" class="serial-num" label="正常上学"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="迟到">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#FF6058" @click="showTypeDetail(scope.row, '迟到')">{{ scope.row.lateCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="normalDownCount" :show-overflow-tooltip="true" align="center" label="正常放学"></el-table-column>
              <el-table-column prop="create_time" :show-overflow-tooltip="true" align="center" label="早退">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#FF6058" @click="showTypeDetail(scope.row, '早退')">{{ scope.row.earlyCount }}</el-button>
                </template>
              </el-table-column>

              <el-table-column prop="create_time" :show-overflow-tooltip="true" align="center" label="未打卡">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#ED7D2B" @click="showTypeDetail(scope.row, '未打卡')">{{ scope.row.noAttendanceCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="create_time" :show-overflow-tooltip="true" align="center" label="未归">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#FF6058" @click="showDetail(scope.row, '未归')">{{ scope.row.noReturnCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="create_time" :show-overflow-tooltip="true" align="center" label="晚归">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#ED7D2B" @click="showDetail(scope.row, '晚归')">{{ scope.row.lateBackCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="create_time" :show-overflow-tooltip="true" align="center" label="总人数">
                <template slot-scope="{ row }">
                  <span>{{ row.totalCount }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" :current-page="page.page" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog top="10vh" :close-on-click-modal="false" width="850px" :title="Title" :visible.sync="typeDetailShow">
      <el-tabs v-model="activeNameDialog" @tab-click="handleClickDialog">
        <el-tab-pane label="走读生" name="1" v-if="activeName == '1'">
          <el-table :data="detailList" stripe border height="600px">
            <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" class="indexNum" align="center" label="姓名"></el-table-column>
            <el-table-column prop="studentNo" class="indexNum" align="center" label="学号"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="住宿生" name="2">
          <el-table :data="detailList" stripe border height="600px">
            <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" class="indexNum" align="center" label="姓名"></el-table-column>
            <el-table-column prop="studentNo" class="indexNum" align="center" label="学号"></el-table-column>
            <el-table-column prop="roomName" class="indexNum" align="center" label="宿舍"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog top="10vh" :close-on-click-modal="false" width="700px" :title="Title" :visible.sync="DetailShow">
      <el-table :data="detailList" stripe border height="600px">
        <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" class="indexNum" align="center" label="姓名"></el-table-column>
        <el-table-column prop="studentNo" class="indexNum" align="center" label="学号"></el-table-column>
        <el-table-column prop="roomName" class="indexNum" align="center" label="宿舍"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@/config/minxins";
import config from "@/api/config";
import splitPane from "vue-splitpane";
import DataTree from "@/components/DataTree";
import ActionHeader from "@/components/ActionHeader";

import { getclassTree, getHouseTree } from "@/api/houseApi";
import { classRecord, dormRecord } from "@/api/checkApi";

export default {
  mixins: [mixin],
  components: {
    splitPane,
    ActionHeader,
    DataTree
  },

  data() {
    return {
      rowSpan: 12,
      tableLoading: false,
      config: config,
      initForm: {
        url: config.v1 + "/admin/attendance-record/student/statistcs",
        method: "get",
      },
      filterForm: {
        date: new Date()
      },

      TreeData: [], // 树形结构数据
      activeName: '1',
      TableKey: 0,
      list_data: [],
      page: {
        total: 0,
        page: 1,
        limit: 10,
      },
      typeDetailShow: false,
      DetailShow: false,
      Title: '',
      detailList: [],
      activeNameDialog: '1',
      searchForm: {}
    }
  },

  created() {
    this.getClassTreeData();
    // this.getTableData()
    this.filterForm.date = this.getNowFormatDate()
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  },

  methods: {
    resize() { },
    // 获取班级结构
    getHouseTreeData() {
      getHouseTree().then((res) => {
        this.TreeData = res["data"]["data"];
      });
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
    // 获取班级结构
    getClassTreeData() {
      getclassTree().then((res) => {
        this.TreeData = this.iterator_self(res["data"]["data"]);
      });
    }, // 递归需要的tree数据
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

    handleClick() {
      this.TreeData = [];
      this.filterForm.date = new Date()
      if (this.activeName == "1") {
        this.getClassTreeData();
        this.initForm = {
          url: config.v1 + "/admin/attendance-record/student/statistcs",
          method: "get",
          params: {}
        }
      } else if (this.activeName == "2") {
        this.getHouseTreeData();
        this.initForm = {
          url: config.v1 + "/admin/attendance-record/student/resident/statistcs",
          method: "get",
          params: {
            groupBy: 'room'
          }
        }
      }
      this.page = {
        total: 0,
        page: 1,
        limit: 10
      }
      this.filterForm.date = this.getNowFormatDate()
      this.initForm["params"] = Object.assign(
        this.initForm["params"],
        this.page,
        this.filterForm
      ); // 合并参数
      this.fetchData(this.initForm);
      this.TableKey += 1
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

    getTableData() { },
    showTypeDetail(row, index) {
      this.Title = row.className + ' ' + index + '人员'
      this.typeDetailShow = true
      this.searchForm.date = this.filterForm.date
      this.searchForm.type = index
      if (this.activeName == '1') {
        this.activeNameDialog = "1"
        this.searchForm.studentType = '走读生'
        this.searchForm.roomId = ''
        this.searchForm.classId = row.classId
        this.getDayList()
      } else {
        console.log('dddd',row)
        this.activeNameDialog = "2"
        this.searchForm.studentType = '住宿生'
        this.Title = row.roomName + ' ' + index + '人员'
        this.searchForm.classId = ''
        this.searchForm.roomId = row.roomId
        this.getDormList()
      }
    },

    getDayList() {
      let params = this.searchForm
      classRecord(params).then((res) => {
        this.detailList = res.data.data
      })
    },

    getDormList() {
      let params = this.searchForm
      dormRecord(params).then((res) => {
        this.detailList = res.data.data
      })
    },

    handleClickDialog() {
      if (this.activeNameDialog == '1') {
        this.searchForm.studentType = '走读生'
      } else {
        this.searchForm.studentType = '住宿生'
      }
      this.getDayList()
    },

    showDetail(row, index) {
      this.Title = row.className + ' ' + index + '人员'
      this.DetailShow = true
      this.searchForm.classId = row.classId
      this.searchForm.date = this.filterForm.date
      this.searchForm.type = index
      this.searchForm.studentType = '住宿生'
      this.getDormList()
    }
  }
}
</script>

<style lang="scss">
.tabsHeader {
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
</style>

<style lang="scss" scoped>
.tabsHeader {
  margin-left: -5px;
  padding-left: 24px;
  background-color: #fff;
}
.vue-splitter-container {
  height: calc(100% - 46px);
}
.leftContent {
  height: calc(100vh - 97px);
  /deep/.content {
    height: 100%;
  }
}
.rightContent {
  padding-top: 0;
  height: calc(100vh - 120px);
}
/deep/.el-tabs__active-bar {
  bottom: 5px;
}
</style>