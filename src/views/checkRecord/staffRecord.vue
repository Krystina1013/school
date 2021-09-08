<template>
  <div class="app-container">
    <div class="searchHeader">
      <el-form ref="form" :inline="true" style="float:right;">
        <el-form-item>
          <el-date-picker v-model="filterForm.date" type="date" placeholder="选择日期" size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="infoHeader flex">
      <!-- <el-row :gutter="15">
        <el-col :span="4"> -->
          <infoHeader :icon="'icon-shangban'" :title="'正常上班'" :value="Form.normalUpCount"></infoHeader>
        <!-- </el-col>
        <el-col :span="4" > -->
          <infoHeader :icon="'icon-xiaban'" :title="'正常下班'" :value="Form.normalDownCount"></infoHeader>
        <!-- </el-col>
        <el-col :span="4"> -->
          <infoHeader :icon="'icon-chidao'" :title="'迟到'" :value="Form.lateCount"></infoHeader>
        <!-- </el-col>
        <el-col :span="4"> -->
          <infoHeader :icon="'icon-zaotui'" :title="'早退'" :value="Form.earlyCount"></infoHeader>
        <!-- </el-col>
        <el-col :span="4"> -->
          <infoHeader :icon="'icon-weidaka'" :title="'未打卡'" :value="Form.noAttendanceCount"></infoHeader>
        <!-- </el-col> -->
        <!-- <el-col :span="4">
          <infoHeader :icon="'icon-gengduo'" :title="'缺勤'" :value="Form.absentCount"></infoHeader>
        </el-col> -->
      <!-- </el-row> -->
    </div>

    <div class="infoTable">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="迟到人员" name="1">
          <tableCom style="margin-top: 10px" :tableData="lateList"></tableCom>
        </el-tab-pane>
        <el-tab-pane label="早退人员" name="2">
          <tableCom style="margin-top: 10px" :tableData="earlyList"></tableCom>
        </el-tab-pane>
        <el-tab-pane label="未打卡" name="3">
          <tableCom style="margin-top: 10px" :tableData="norecordList"></tableCom>
        </el-tab-pane>
        <!-- <el-tab-pane label="缺勤" name="4">
          <tableCom style="margin-top: 10px" :tableData="millList"></tableCom>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import infoHeader from "./infoHeader.vue";
import tableCom from "./tableCom.vue";
import { workRecord, workRecordTable } from "@/api/checkApi"

export default {
  components: { infoHeader, tableCom },

  data() {
    return {
      Form: {},
      filterForm: {
        date: new Date()
      },
      activeName: '1',
      lateList: [],
      earlyList: [],
      norecordList: [],
      millList: []
    }
  },

  created() {
    this.filterForm.date = this.getNowFormatDate()
    this.getRecordNum()
    this.getRecordTable()
  },
  methods: {
    getRecordNum() {
      let params = {
        date: this.filterForm.date
      }
      workRecord(params).then((res) => {
        if (res.data.code == 200) {
          if (res.data.data) {
            this.Form = res.data.data
          } else {
            this.Form = {
              normalUpCount: 0,
              normalDownCount: 0,
              lateCount: 0,
              earlyCount: 0,
              noAttendanceCount: 0,
              absentCount: 0,
            }
          }
        }
      })
    },

    getRecordTable() {
      let params = {
        date: this.filterForm.date
      }
      workRecordTable(params).then((res) => {
        if (res.data.code == 200) {
          this.lateList = res.data.data["迟到"]
          this.earlyList = res.data.data["早退"]
          this.norecordList = res.data.data["未打卡"]
          this.millList = res.data.data["缺勤"]
        }
      })
    },

    search() {
      this.getRecordNum()
      this.getRecordTable()
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

    handleClick() { }
  }
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
.flex {
  display: -webkit-box;
  align-items: center;
  align-items: baseline;
}

.app-container {
  height: 100%;
}
.searchHeader {
  height: 46px;
  width: 100%;
  background-color: #fff;
}

.infoHeader {
  margin: 15px;
}

.infoTable {
  height: calc(100vh - 263px);
  background-color: #fff;
  margin: 15px;
  padding: 15px;
}
</style>