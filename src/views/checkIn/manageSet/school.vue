<template>
  <div>
    <div class="components-container">
      <div class="rightContent">
        <div class="all-school">
          <div class="title">全校考勤设置</div>
          <div class="flex">
            <el-card class="school_set_card">
              <div slot="header" class="clearfix">
                <span>
                  <img style="width:16px;height:16px;object-fit: contain;" src="../../../assets/zds.png" alt=""> 走读生</span>
                <span style="float: right; padding: 3px 0" type="text">是否开启
                  <el-switch v-model="isAttendance" active-value="1" inactive-value="0" @change="setSchoolStatus"></el-switch>
                </span>
              </div>
              <div class="school_set_cardbody">
                <el-table :data="schoolForm" @cell-mouse-enter="enterCellChange1" @cell-mouse-leave="leaveCellChange1">
                  <el-table-column prop="upTime" label="上学时间" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-time-picker v-model="scope.row.upTime" v-if="showInput == `upTime`" v-focus @change="setSchoolCheck" @blur="getSchoolCheck" format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                      <span v-else class="showIconBtn">
                        <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'upTime')?'':'transparent'}" @click="getSchoolFocus(scope.row,'upTime')"></i>
                        {{ scope.row.upTime || "--" }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="downTime" label="放学时间" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-time-picker v-model="scope.row.downTime" v-if="showInput == `downTime`" v-focus @change="setSchoolCheck" @blur="getSchoolCheck" format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                      <span v-else class="showIconBtn">
                        <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'downTime')?'':'transparent'}" @click="getSchoolFocus(scope.row,'downTime')"></i>
                        {{ scope.row.downTime || "--" }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
            <el-card class="school_set_card">
              <div slot="header" class="clearfix">
                <span><i class="iconfont icon-xuexiao" style="color:#10A9FF;padding-right:6px"></i>住宿生</span>
                <span style="float: right; padding: 3px 0" type="text">是否开启
                  <el-switch v-model="residentIsAttendance" active-value="1" inactive-value="0" @change="setResStatus"></el-switch>
                </span>
              </div>
              <div class="school_set_cardbody">
                <el-table :data="schoolForm" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
                  <el-table-column prop="residentUpTime" label="上学时间" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-time-picker v-model="scope.row.residentUpTime" v-if="showInput == `residentUpTime`" v-focus @change="setSchoolCheck" @blur="getSchoolCheck" format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                      <span v-else class="showIconBtn">
                        <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'residentUpTime')?'':'transparent'}" @click="getSchoolFocus(scope.row,'residentUpTime')"></i>
                        {{ scope.row.residentUpTime || "--" }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="residentDownTime" label="放学时间" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-time-picker v-model="scope.row.residentDownTime" v-if="showInput == `residentDownTime`" v-focus @change="setSchoolCheck" @blur="getSchoolCheck" format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                      <span v-else class="showIconBtn">
                        <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'residentDownTime')?'':'transparent'}" @click="getSchoolFocus(scope.row,'residentDownTime')"></i>
                        {{ scope.row.residentDownTime || "--" }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>
        </div>
        <div class="class-con">
          <div class="title"><span>年级考勤设置</span><span class="note">*年级考勤时间权重大于全校考勤时间</span></div>
          <div>
            <el-card class="grade_set_card">
              <div slot="header" class="clearfix">
                <span>
                  <img style="width:16px;height:16px;object-fit: contain;" src="../../../assets/zds.png" alt=""> 走读生</span>
              </div>
              <el-table ref="table" :data="daylist" stripe border height="calc(50vh - 155px)" highlight-current-row v-loading=" tableLoading" @cell-click="tableDbEdit" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
                <el-table-column prop="schoolType" :show-overflow-tooltip="true" align="center" class="serial-num" label="学段"></el-table-column>
                <el-table-column prop="grade" :show-overflow-tooltip="true" align="center" class="serial-num" label="年级"></el-table-column>
                <el-table-column prop="upTime" label="上学时间" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-time-picker v-model="scope.row.upTime" v-if="showInput == `upTime${scope.row.id}`" @blur='blurInput(scope.row,"upTime",scope.row.upTime)' v-focus format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                    <span v-else class="showIconBtn">
                      <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'upTime')?'':'transparent'}" @click="getFocus(scope.row, 'upTime')"></i>
                      {{ scope.row.upTime || "--" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="downTime" label="放学时间" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-time-picker v-model="scope.row.downTime" v-if="showInput == `downTime${scope.row.id}`" @blur='blurInput(scope.row,"downTime",scope.row.downTime)' v-focus format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                    <span v-else class="showIconBtn">
                      <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'downTime')?'':'transparent'}" @click="getFocus(scope.row, 'downTime')"></i>
                      {{ scope.row.downTime || "--" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="isAttendance" label="考勤设置" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.isAttendance" active-value="1" inactive-value="0" @change='setGradeCheck(scope.row)'></el-switch>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>

            <el-card class="grade_set_card">
              <div slot="header" class="clearfix">
                <span><i class="iconfont icon-xuexiao" style="color:#10A9FF;padding-right:6px"></i>住宿生</span>
              </div>
              <el-table ref="table" :data="dormlist" stripe border height="calc(50vh - 155px)" highlight-current-row v-loading="tableLoading" @cell-click="tableDbEdit" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
                <el-table-column prop="schoolType" :show-overflow-tooltip="true" align="center" class="serial-num" label="学段"></el-table-column>
                <el-table-column prop="grade" :show-overflow-tooltip="true" align="center" class="serial-num" label="年级"></el-table-column>
                <el-table-column prop="residentUpTime" label="上学时间" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-time-picker v-model="scope.row.residentUpTime" v-if="showInput == `residentUpTime${scope.row.id}`" @blur='blurInput(scope.row,"residentUpTime",scope.row.residentUpTime)' v-focus format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                    <span v-else class="showIconBtn">
                      <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'residentUpTime')?'':'transparent'}" @click="getFocus(scope.row, 'residentUpTime')"></i>
                      {{ scope.row.residentUpTime || "--" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="residentDownTime" label="放学时间" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-time-picker v-model="scope.row.residentDownTime" v-if="showInput == `residentDownTime${scope.row.id}`" @blur='blurInput(scope.row,"residentDownTime",scope.row.residentDownTime)' v-focus format="HH:mm" value-format="HH:mm" size="small"></el-time-picker>
                    <span v-else class="showIconBtn">
                      <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'residentDownTime')?'':'transparent'}" @click="getFocus(scope.row, 'residentDownTime')"></i>
                      {{ scope.row.residentDownTime || "--" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="residentIsAttendance" label="考勤设置" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.residentIsAttendance" active-value="1" inactive-value="0" @change='setGradeCheck(scope.row)'></el-switch>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { getSchoolCheck, setSchoolCheck, setGradeCheck } from "@/api/checkApi";
import { getGradeList } from "@/api/houseApi";
export default {
  data() {
    return {
      dayOpen: false,
      dormOpen: false,
      schoolForm: [],
      isAttendance: '',
      residentIsAttendance: '',
      tableLoading: false,
      daylist: [],
      dormlist: [],
      // form: {
      //   downTime: '18:00',
      //   upTime: '8:00',
      //   residentDownTime: '18:00',
      //   residentUpTime: '8:00'
      // },
      showInput: "",
      oldData: {},
      rowId: '',
      showProperty: '',
    }
  },

  directives: {
    // 通过自定义指令实现的表单自动获得光标的操作
    focus: {
      inserted: function (el) {
        if (el.tagName.toLocaleLowerCase() == "input") {
          el.focus();
        } else {
          if (el.getElementsByTagName("input")) {
            el.getElementsByTagName("input")[0].focus();
          }
        }
        el.focus();
      },
    },
  },

  created() {
    this.getSchoolCheck()
    this.getGradeList()
    // this.getSchoolCheck()
  },
  methods: {
    getSchoolCheck() {
      getSchoolCheck().then((res) => {
        if (res.data.code === 200) {
          this.isAttendance = res.data.data.isAttendance + ''
          this.residentIsAttendance = res.data.data.residentIsAttendance + ''
          let arr = []
          arr.push(res.data.data)
          this.schoolForm = arr
        }
        this.showInput = ''
      })
    },

    setSchoolStatus() {
      this.schoolForm[0].isAttendance = this.isAttendance
      this.setSchoolCheck()
    },
    setResStatus() {
      this.schoolForm[0].residentIsAttendance = this.residentIsAttendance
      this.setSchoolCheck()
    },

    setSchoolCheck() {
      if ((this.schoolForm[0].downTime < this.schoolForm[0].upTime) || (this.schoolForm[0].residentDownTime < this.schoolForm[0].residentUpTime)) {
        this.$message({
          message: '放学时间需大于上学时间！',
          type: "warning",
        });
        this.getSchoolCheck()
        return
      }
      let params = this.schoolForm[0]
      setSchoolCheck(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getSchoolCheck()
          this.getGradeList()
        } else {
          this.$message({
            message: res.data.messa,
            type: "error",
          });
        }
        this.showInput = ''
      })
    },

    enterCellChange1(row, column, cell, event) {
      this.showProperty = column.property
      this.rowId = row.id
    },
    leaveCellChange1(row, column) {
      this.showProperty = ''
      this.rowId = ''
    },

    // 获取班级结构
    getGradeList() {
      getGradeList().then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          this.daylist = _.forEach(res.data.data, function (item, key) {
            item.id = 'day' + key
            item.isAttendance = item.isAttendance + ''
            item.residentIsAttendance = item.residentIsAttendance + ''
          })
          this.dormlist = _.forEach(res.data.data, function (item, key) {
            item.id = 'dorm' + key
            item.isAttendance = item.isAttendance + ''
            item.residentIsAttendance = item.residentIsAttendance + ''
          })
        }
      });
    },
    // 设置考勤
    setGradeCheck(row) {
      if ((row.downTime < row.upTime) || (row.residentDownTime < row.residentUpTime)) {
        this.$message({
          message: '放学时间需大于上学时间！',
          type: "warning",
        });
        this.getGradeList()
        this.getSchoolCheck()
        return
      }
      let params = {
        upTime: row.upTime,
        downTime: row.downTime,
        grade: row.grade,
        isAttendance: row.isAttendance,
        residentIsAttendance: row.residentIsAttendance,
        residentDownTime: row.residentDownTime,
        residentUpTime: row.residentUpTime,
        schoolType: row.schoolType,
      }
      setGradeCheck(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getSchoolCheck()
          this.getGradeList()
        } else {
          this.$message({
            message: res.data.messa,
            type: "error",
          });
        }
      })
    },

    enterCellChange(row, column, cell, event) {
      this.showProperty = column.property
      this.rowId = row.id
    },
    leaveCellChange(row, column) {
      this.showProperty = ''
      this.rowId = ''
    },

    async blurInput(row, name, value) {
      let obj = {};
      // 判断数据是否有所改变，如果数据有改变则调用修改接口
      if (this.oldData[name] != value) {
        obj[name] = value; //被改变的数据
        this.setGradeCheck(row,)
      }
      this.showInput = "";
    },
    getSchoolFocus(row, name) {
      this.showInput = name
    },
    getFocus(row, name) {
      this.showInput = name + row.id
    },
    tableDbEdit(row, column, event) {
      this.oldData[column.property] = row[column.property];
    },

  }
}
</script>

<style lang="scss" scoped]>
.school_set_card {
  .el-table,
  .el-table th.is-leaf,
  .el-table td {
    border: 1px solid #fff;
  }
  .el-table--group::after,
  .el-table--border::after,
  .el-table::before {
    background-color: #fff;
  }
  .el-table tbody tr:hover > td {
    background-color: #ffffff !important;
  }

  .el-table tbody tr:hover {
    background-color: #ffffff !important;
  }
}
</style>

<style lang="scss" scoped>
.routerView {
  color: #f5f7fa;
}
.components-container {
  position: relative;
  height: 100%;
}
.school_set_card {
  border: 1px solid #e4e7ed;
  height: 170px;
  margin-top: 14px;
  width: 49.2%;
}
.school_set_cardbody {
  height: 77px;
  width: 100%;
}
::v-deep {
  .el-card.is-always-shadow {
    box-shadow: none;
  }
}
.showTime {
  cursor: pointer;
}

.note {
  font-size: 14px;
  font-weight: 400;
  opacity: 0.8;
  color: #ff6058;
}
.all-school {
  padding: 10px 20px;
  border: 1px solid #e4e7ed;
  .flex {
    justify-content: space-between;
  }
}
.class-con {
  padding: 10px 20px;
  margin-top: 20px;
  border: 1px solid #e4e7ed;
  .title {
    display: flex;
    margin-bottom: 15px;
    justify-content: space-between;
  }
}
.tabs-group {
  padding: 5px 16px;
  border-bottom: 1px solid #e4e7ed;
}
.components-container {
  position: relative;
  height: 100%;
  padding: 15px;
}
.grade_set_card {
  height: calc(50vh - 62px);
  margin-bottom: 15px;
  .note {
    font-size: 14px;
    font-weight: 400;
    opacity: 0.8;
    color: #ff6058;
    float: right;
  }
}
</style>