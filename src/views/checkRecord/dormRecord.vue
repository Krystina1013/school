<template>
  <div class="app-container">
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
                <ActionHeader :initFormHeader="initForm" ref="actionHeader" @fetchData="fetchData" :filterForm="filterForm" :filterStatus='false' :searchStatus='true' :moreStatus='false' :btnStatus=0 :dialogCreate.sync="dialogCreate" :total="page.total">
                  <div slot="searchNum" style="float:left; margin-right:10px">
                    <el-date-picker v-model="filterForm.date" type="date" placeholder="选择日期" size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                  </div>
                </ActionHeader>
              </el-col>
            </el-row>

            <el-table ref="table" :data="list_data" stripe border highlight-current-row v-loading="tableLoading">
              <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="roomName" :show-overflow-tooltip="true" align="center" class="serial-num" label="宿舍"></el-table-column>
              <el-table-column prop="normalUpCount" :show-overflow-tooltip="true" align="center" class="serial-num" label="正常上学"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="迟到">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#FF6058" @click="showDetail(scope.row, '迟到')">{{ scope.row.lateCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="normalDownCount" :show-overflow-tooltip="true" align="center" label="正常放学"></el-table-column>
              <el-table-column prop="earlyCount" :show-overflow-tooltip="true" align="center" label="早退">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#FF6058" @click="showDetail(scope.row, '早退')">{{ scope.row.earlyCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="noAttendanceCount" :show-overflow-tooltip="true" align="center" label="未打卡">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#ED7D2B" @click="showDetail(scope.row, '未打卡')">{{ scope.row.noAttendanceCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="noReturnCount" :show-overflow-tooltip="true" align="center" label="未归">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#FF6058" @click="showDetail(scope.row, '未归')">{{ scope.row.noReturnCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="lateBackCount" :show-overflow-tooltip="true" align="center" label="晚归">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#ED7D2B" @click="showDetail(scope.row, '晚归')">{{ scope.row.lateBackCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="totalCount" :show-overflow-tooltip="true" align="center" label="宿舍总人数">
                <template slot-scope="scope">
                  <span>{{ scope.row.totalCount }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" :current-page="page.page" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog top="10vh" :close-on-click-modal="false" width="700px" :title="Title" :visible.sync="DetailShow">
      <el-table :data="detailList" stripe border height="600px">
        <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" class="indexNum" align="center" label="姓名"></el-table-column>
        <el-table-column prop="studentNo" class="indexNum" align="center" label="学号"></el-table-column>
        <el-table-column prop="className" class="indexNum" align="center" label="班级"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/api/config";
import mixin from "@/config/minxins";
import splitPane from "vue-splitpane";
import ActionHeader from "@/components/ActionHeader";
import DataTree from "@/components/DataTree";

import { getHouseTree } from "@/api/houseApi";
import { dormRecord } from "@/api/checkApi";

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
      cutBtnType: false,
      queryBuildingId: "", //通过dataTree获取到的宿舍楼id
      queryBuildingName: "", //通过dataTree获取到的宿舍楼名称
      floorControlStatus: false,
      initForm: {
        url: config.v1 + "/admin/attendance-record/student/resident/statistcs",
        method: "get",
        params:{
          groupBy: 'room'
        }
      },
      filterForm: {
        date: new Date()
      },
      TreeData: [], // 树形结构数据
      DetailShow: false,
      Title: '',
      detailList: []
    }
  },

  created() {
    this.getHouseTreeData();
    this.filterForm.date = this.getNowFormatDate();
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

    showDetail(row, index) {
      let name = "";
      if (row.roomName) {
        name = ' - ' + row.roomName
      }
      if (index == '迟到') {
        this.Title = '迟到人员' + name
      } else if (index == '早退') {
        this.Title = '早退人员' + name
      } else if (index == '未打卡') {
        this.Title = '未打卡人员' + name
      } else if (index == '未归') {
        this.Title = '未归人员' + name
      } else if (index == '晚归') {
        this.Title = '晚归人员' + name
      }
      let params = {
        date: this.filterForm.date,
        roomId: row.roomId,
        type: index
      }
      dormRecord(params).then((res) => {
        this.detailList = res.data.data
      })
      this.DetailShow = true
    }
  }
}
</script>