<template>
  <div class="app-container">
    <div class="components-container">
      <div class="rightContent">
        <el-row :gutter="10">
          <el-col :span="24">
            <action-header :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :filterStatus="false" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false" :pageStatus="false">
              <div slot="delBtn" v-if="globalUpdateStatus && deleteVal.length > 1">
                <el-button type="primary" size="small" icon="el-icon-delete" @click="deleteData(deleteVal)">
                  批量删除
                </el-button>
              </div>
            </action-header>
            <el-row>
              <el-col :span="24">

              </el-col>
            </el-row>
            <el-table :data="list_data" stripe border v-loading="showLoading" highlight-current-row @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange" @selection-change="handleSelectionChange">
              <el-table-column align="center" type="selection" width="50"></el-table-column>

              <el-table-column align="center" class="indexNum" type="index" label="序号" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="考勤组名称">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="upTime" label="上班时间">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="downTime" label="下班时间">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" sortable prop="createTime" label="创建时间">
              </el-table-column>
              <el-table-column label="操作" align="center" v-if="globalUpdateStatus" width="260px">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="openDialogPerson(scope.row)">成员管理</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="openDialogPlan(scope.row)">考勤规范</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="editCheckInfo(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" style="margin-left: 0" @click="deleteData(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog class="newDialog" :title="roleTitle === '0' ? '添加考勤组' : '修改考勤组'" :visible.sync="dialogCreate" width="670px" :before-close="closeDialogName">
      <el-form :model="ruleForm" :rules="rule" ref="Forms" label-width="120px">
        <el-form-item label="考勤组名称：" prop="name">
          <el-input v-model.trim="ruleForm.name" :maxlength="20" placeholder="请输入考勤组名称"></el-input>
        </el-form-item>
        <el-form-item label="考勤时间：" required>
          <el-time-picker style="width:100%" is-range format="HH:mm" value-format="HH:mm" v-model="checkTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogName">取 消</el-button>
        <el-button size="small" type="primary" style="margin-left:18px" @click="confirmAdd" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 成员管理 -->
    <el-dialog title="成员管理" :visible.sync="dialogPerson" width="1000px" :before-close="closeDialogPerson" :close-on-click-modal="false">
      <div class="person-height">
        <div class="tabs-group" style="margin-bottom: 10px">
          <el-radio-group v-model="activeName">
            <el-radio-button label="1">教师</el-radio-button>
            <el-radio-button label="2">职工</el-radio-button>
          </el-radio-group>
        </div>
        <el-row :gutter="20" v-if="activeName === '1'">
          <el-col :span="24">
            <el-transfer ref="transfer" style="text-align: left; display: inline-block" v-model="teacherTransferData" filterable @change="teacherChange" :titles="['全选', '已添加']" :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}',
              }" filter-placeholder="请输入姓名" :props="{ key: 'id', label: 'name' }" :data="teacherTableData">
              <span slot-scope="{ option }">
                <span>{{ option.name }}</span> —
                <span>{{
                  option.phone.length > 11 ? "无电话" : option.phone
                }}</span>
              </span>
            </el-transfer>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-else>
          <el-col :span="24">
            <el-transfer ref="transfer" style="text-align: left; display: inline-block" v-model="workerTransferData" @change="workerChange" filterable :titles="['全选', '已添加']" :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}',
              }" filter-placeholder="请输入姓名" :props="{ key: 'id', label: 'name' }" :data="workerTableData">
              <span slot-scope="{ option }">
                <span>{{ option.name }}</span> —
                <span>{{
                  option.phone.length > 11 ? "无电话" : option.phone
                }}</span>
              </span>
            </el-transfer>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogPerson">取 消</el-button>
        <el-button type="primary" @click="confirmAddPerson" :loading="personLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 考勤规范 -->
    <el-dialog title="考勤规范" :visible.sync="dialogPlan" width="1300px" class="plan-dialog" top="50px" :before-close="closeDialogPlan" @open="opendPlan" :close-on-click-modal="false">
      <div class="plan-height">
        <el-row :gutter="30">
          <el-col :span="10">
            <div class="table-title">
              <el-button type="primary" @click="openDialogAddPlan">添加</el-button>
            </div>
            <div class="table-con">
              <el-table :data="planScence" stripe border v-loading="showLoading" height="544px" highlight-current-row @row-click="rowClick">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="类型" width="110">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.isWork ? "自定义工作日" : "自定义假日" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="explain" label="名称" width="180">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="date" label="日期">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="handle" width="80" label="操作">
                  <template scope="{row}">
                    <el-button type="text" @click="deletePlan(row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="choose-date">
              <el-date-picker v-model="planDate" type="month" placeholder="选择日期" @change="dateChange" value-format="yyyy-MM">
              </el-date-picker>
              <el-button style="margin-left: 30px" type="primary" @click="currentBack">返回当前月</el-button>
            </div>
            <div class="plan-calendar" v-if="groupPlanArr">
              <Calendar id="calendar" v-model="planDate">
                <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                <template slot="dateCell" slot-scope="{ data }">
                  <!--自定义内容-->
                  <div v-if="groupPlanArr.indexOf(data.day) != -1" class="calendar-day" :class="[
                      isDay(data).isWork ? 'holiday' : '',
                      `${data.day}`,
                    ]">
                    <div style="text-align: center">
                      <span>{{ data.day.split("-").slice(2).join("-") }}</span>
                      <p class="explain" :title="isDay(data).explain">
                        {{ isDay(data).explain }}
                      </p>
                      <p class="explain" :title="isDay(data).isWork ? '工作日' : '假日'">
                        {{ isDay(data).isWork ? "工作日" : "假日" }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="calendar-day" :class="`${data.day}`">
                    <div class="calendar-day" style="text-align: center">
                      <span>{{ data.day.split("-").slice(2).join("-") }}</span>
                    </div>
                  </div>
                </template>
              </Calendar>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="flex">
              <span>国家法定节假日</span>
              <span></span>
            </div>
            <ul class="plan-layout">
              <li
                :class="item.isWork ? 'active' : ''"
                v-for="(item, i) in planSystem"
                :key="i"
                :title="item.explain + '-' + item.date+'-' + (item.isWork?'工作日':'假日')"
              >
               <span class="title">{{ item.explain }} </span>{{ item.date }} &nbsp;&nbsp;{{ item.isWork?'工作日':'假日' }}
              </li>
            </ul>
          </el-col> -->
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogPlan">取 消</el-button>
        <el-button type="primary" @click="closeDialogPlan">确 定</el-button>
      </span>
    </el-dialog>
    <DialogAddPlan :dialogAddPlanSync="dialogAddPlanSync" :id="attendanceGroupId" @submit="submitPlan" @close="dialogAddPlanSync = false"></DialogAddPlan>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import { formatTimeObj, getMonth } from "@/utils";
import {
  attendanceGroup,
  attendanceGroupDelete,
  attendanceGroupUpdate,
  attendanceGroupinGroup,
  attendanceGroupOutGroup,
  attendanceGroupPlanScence,
  attendanceGroupPlanSystem,
  attendanceGroupPlanTotal,
  attendanceGroupPlanDelete,
} from "@/api/peopleApi";
import { getHouseTreeData } from "@/api/houseApi";
import { jsonp } from "vue";
import { el } from "date-fns/locale";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const DialogAddPlan = () => import("./component/DialogAddPlan.vue");
const Calendar = () => import("./component/calendar/src/main.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    DialogAddPlan,
    Calendar,
  },
})
export default class check extends Vue {
  activeName: String = "1";
  filterForm: object = { tag: "pagination" }; //根据关键字查询
  private roleTitle: String = "0";
  btnLoading: boolean = false;
  personLoading: boolean = false;
  dialogPlan: boolean = false;
  dialogAddPlanSync: boolean = false; //添加自定义节假日
  userDefinedDate: string = ""; //点击高亮
  initForm: object = {
    url: config.v1 + "/admin/attendance-group",
    method: "get",
  };
  ruleForm: any = {
    name: "",
    upTime: "",
    downTime: "",
  };
  checkTime: any = [new Date(2016, 9, 10, 9, 0), new Date(2016, 9, 10, 18, 0)];
  rule: any = {
    name: [{ required: true, message: "请输入考勤组名称", trigger: "blur" }],
    upTime: [
      {
        type: "date",
        required: true,
        message: "请选择时间",
        trigger: "change",
      },
    ],
    downTime: [
      {
        type: "date",
        required: true,
        message: "请选择时间",
        trigger: "change",
      },
    ],
  };
  deleteForm: object = {
    url: config.v1 + "/admin/attendance-group",
    method: "delete",
    data: [],
    message: "此操作将永久删除考勤组,请谨慎操作!",
  };
  rowLineId: string = "";
  deleteVal: Array<any> = [];
  dialogPerson: boolean = false;
  TreeData: Array<object> = [];
  defaultProps: object = {
    children: "subBuildings",
    label: "name",
  };
  workerTableData: Array<any> = []; //没在职工考勤组
  chooseWorkerTableData: Array<any> = []; //职工在考勤组
  teacherTableData: Array<any> = []; //老师没在考勤组
  chooseTeacherTableData: Array<any> = []; //老师在考勤组
  attendanceGroupId: string = ""; //考勤id
  queryOutGroup: any = {
    buildingId: "",
    groupId: "",
    name: "",
    attendanceGroupId: "",
  };
  teacherTransferData: Array<any> = []; //选择要添加的老师
  workerTransferData: Array<any> = []; //选择要添加的职工
  transferInData: Array<any> = []; //已经添加的用户
  planDate: string = ""; //年月
  planScence: Array<object> = []; //自定义节假日
  planSystem: Array<object> = []; //法定节假日
  groupPlanTotal: Array<object> = []; //日历数据
  groupPlanMap: Map<string, object> = new Map(); //日历数据-map
  groupPlanArr: Array<object> = []; //日历数据-arr
  created() {
    this.planDate = getMonth();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  //老师搜索框change时间
  teacherChange(key, type, value) {
    if (type === "left") {
      if (value && value.length > 0) {
        value.forEach((ele) => {
          let eleIndex = this.workerTransferData.indexOf(ele);
          if (eleIndex > -1) {
            this.workerTransferData.splice(eleIndex, 1);
          }
        });
      }
    }
    if (type === "right") {
      if (value && value.length > 0) {
        value.forEach((item) => {
          let eleIndex = this.workerTableData.findIndex((ele) => {
            return ele.id === item;
          });
          if (eleIndex > -1) {
            this.workerTransferData.push(item);
          }
        });
      }
    }
  }
  //职工搜索框change时间
  workerChange(key, type, value) {
    if (type === "left") {
      if (value && value.length > 0) {
        value.forEach((ele) => {
          let eleIndex = this.teacherTransferData.indexOf(ele);
          if (eleIndex > -1) {
            this.teacherTransferData.splice(eleIndex, 1);
          }
        });
      }
    }
    if (type === "right") {
      if (value && value.length > 0) {
        value.forEach((item) => {
          let eleIndex = this.teacherTableData.findIndex((ele) => {
            return ele.id === item;
          });
          if (eleIndex > -1) {
            this.teacherTransferData.push(item);
          }
        });
      }
    }
  }
  // 返回当前月
  currentBack() {
    this.planDate = getMonth();
    this.attendanceGroupPlanTotal();
  }
  mouseenterFun(item) {
    this.$set(item, "isShow", true);
    // item.isShow = true;
  }
  mouseleaveFun(item) {
    item.isShow = false;
  }
  isDay(data) {
    // setTimeout(() => {
    let res;
    if (this.groupPlanMap.get(data.day)) res = this.groupPlanMap.get(data.day);
    return res;
    // }, 500);
  }
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = [
        {
          id: 1,
          name: "所有",
          subBuildings: res["data"]["data"],
          type: "all",
        },
      ];
    });
  }
  //未在考勤组
  getUserGroup(type: string) {
    if (type === "teacher") {
      this.teacherTableData = [];
    } else {
      this.workerTableData = [];
    }
    attendanceGroupOutGroup({
      attendanceGroupId: this.attendanceGroupId,
      teacherOrWorker: type,
    }).then((res) => {
      if (type === "teacher") {
        this.teacherTableData = res.data.data;
        // this.teacherTableData= [];
      } else {
        this.workerTableData = res.data.data;
      }
    });
  }
  // 在考勤组
  getUserInGroup(type: string) {
    if (type === "teacher") {
      this.teacherTransferData = [];
    } else {
      this.workerTransferData = [];
    }
    // this.teacherTransferData= [];
    // this.workerTransferData = [];
    //  this.transferInData= []
    attendanceGroupinGroup({
      attendanceGroupId: this.attendanceGroupId,
      teacherOrWorker: type,
    }).then((res) => {
      res.data.data.map((item) => {
        if (type === "teacher") {
          this.teacherTransferData.push(item.id);
        }
        if (type === "worker") {
          this.workerTransferData.push(item.id);
        }
        // this.transferInData.push(item.id);
      });
    });
  }
  //选择要加入考勤组的用户
  // selectionUser(val) {
  //   this.chooseTableData = val;
  // }
  closeDialogName() {
    /** @description 关闭添加/修改dialog */
    this["dialogCreate"] = false;
    this.roleTitle = "0";
    this.ruleForm = {
      name: "",
      upTime: "",
      downTime: "",
    };
    this.checkTime = [
      new Date(2016, 9, 10, 9, 0),
      new Date(2016, 9, 10, 18, 0),
    ];
    this.$refs["Forms"]["resetFields"]();
  }
  confirmAdd() {
    if (typeof this.checkTime[0] == "object") {
      this.checkTime[0] = formatTimeObj(this.checkTime[0], "time");
      this.checkTime[1] = formatTimeObj(this.checkTime[1], "time");
    }
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        this.btnLoading = true;
        let param: any = {
          name: this.ruleForm.name,
          upTime: this.checkTime[0],
          downTime: this.checkTime[1],
        };
        if (this.roleTitle === "0") {
          attendanceGroup(param)
            .then((res) => {
              this.btnLoading = false;
              this["message"]("success", "添加成功");
              this.closeDialogName();
              this["fetchData"](this.initForm);
            })
            .catch((err) => {
              this.btnLoading = false;
            });
        } else {
          param.id = this.rowLineId;
          attendanceGroupUpdate(param)
            .then((res) => {
              this.btnLoading = false;
              this["message"]("success", "修改成功");
              this.closeDialogName();
              this["fetchData"](this.initForm);
            })
            .catch((err) => {
              this.btnLoading = false;
            });
        }
      } else {
        this.btnLoading = false;
      }
    });
  }
  handleSelectionChange(val) {
    this.deleteVal = val;
  }
  deleteData(row) {
    this.$confirm("此操作将永久删除选中考勤分组, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        let param: any = [];
        if (this.deleteVal.length) {
          this.deleteVal.map((item: any) => {
            param.push(item.id);
          });
        } else {
          param = [row.id];
        }

        attendanceGroupDelete(param).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this["fetchData"](this.initForm);
        });
      })
      .catch(() => {});
  }
  editCheckInfo(row) {
    this.rowLineId = row.id;
    this.ruleForm.name = row.name;
    this.ruleForm.upTime = row.upTime;
    this.ruleForm.downTime = row.downTime;
    this.checkTime = [row.upTime, row.downTime];
    this["dialogCreate"] = true;
    this.roleTitle = "1";
  }

  openDialogPerson(row) {
    this.attendanceGroupId = row.id;
    this.queryOutGroup.attendanceGroupId = row.id;
    this.dialogPerson = true;
    this.activeName = "1";
    // this.transferData=[];
    this.transferInData = [];
    this.getUserInGroup("teacher");
    this.getUserGroup("teacher");
    this.getUserInGroup("worker");
    this.getUserGroup("worker");
  }
  handleNodeClick(data) {
    if (data.type == "group") {
      this.queryOutGroup.groupId = data.id;
      this.queryOutGroup.buildingId = "";
    } else if (data.type == "building") {
      this.queryOutGroup.groupId = "";
      this.queryOutGroup.buildingId = data.id;
    } else {
      this.queryOutGroup.groupId = "";
      this.queryOutGroup.buildingId = "";
    }
    // this.getUserGroup();
  }
  closeDialogPerson() {
    this.dialogPerson = false;
    // this.transferData = [];
    this.workerTableData = [];
    this.chooseWorkerTableData = [];
    this.teacherTableData = [];
    this.chooseTeacherTableData = [];
    this.$refs.transfer["$children"]["0"]._data.query = "";
    this.$refs.transfer["$children"]["3"]._data.query = "";
  }
  confirmAddPerson() {
    let remove: any = [];
    let transferData: any = [];
    transferData = this.teacherTableData
      .map((item) => item.id)
      .concat(this.workerTableData.map((item) => item.id));
    let transferInData = this.teacherTransferData.concat(
      this.workerTransferData
    );
    transferData.map((item) => {
      if (transferInData.indexOf(item) === -1) {
        remove.push(item);
      }
      // if (this.workerTableData.indexOf(item) == -1) {
      //   remove.push(item);
      // }
    });
    let param = {
      insertScenceUserIds: transferInData,
      id: this.attendanceGroupId,
      removeScenceUserIds: remove,
    };
    this.personLoading = true;
    attendanceGroupUpdate(param)
      .then((res) => {
        this.personLoading = false;
        this["message"]("success", "修改成功");
        this.closeDialogPerson();
        this["fetchData"](this.initForm);
      })
      .catch((err) => {
        this.personLoading = false;
      });
  }
  opendPlan() {
    this.attendanceGroupPlanScence();
    this.attendanceGroupPlanSystem();
    this.attendanceGroupPlanTotal();
  }
  // 考勤规范
  openDialogPlan(row) {
    this.attendanceGroupId = row.id;
    this.dialogPlan = true;
  }
  attendanceGroupPlanScence() {
    attendanceGroupPlanScence({
      groupId: this.attendanceGroupId,
    }).then((res) => {
      this.planScence = JSON.parse(JSON.stringify(res.data.data));
      this.planScence.map((item) => {
        return { ...item, isShow: false };
      });
    });
  }
  attendanceGroupPlanSystem() {
    attendanceGroupPlanSystem().then((res) => {
      this.planSystem = res.data.data;
    });
  }
  dateChange() {
    this.attendanceGroupPlanTotal();
  }
  //中间日期数据
  attendanceGroupPlanTotal() {
    let _that = this;
    var p = new Promise(function (resolve, reject) {
      let param = {
        data: _that.planDate,
        groupId: _that.attendanceGroupId,
      };
      attendanceGroupPlanTotal(param).then((res) => {
        _that.groupPlanTotal = res.data.data;
        _that.$nextTick(() => {
          res.data.data.map((item) => {
            _that.groupPlanMap.set(item.date, item);
            _that.groupPlanArr.push(item.date);
          });
        });
        resolve(res);
      });
    });
    return p;
  }
  openDialogAddPlan() {
    this.dialogAddPlanSync = true;
  }
  //添加自定义节假日
  submitPlan() {
    this.attendanceGroupPlanScence();
    this.attendanceGroupPlanTotal();
    this.dialogAddPlanSync = false;
  }
  closeDialogPlan() {
    this.planDate = getMonth();
    this.groupPlanArr = [];
    this.groupPlanMap = new Map();
    this.dialogPlan = false;
  }
  deletePlan(row) {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        attendanceGroupPlanDelete([row.id]).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.groupPlanArr = [];
          this.groupPlanMap = new Map();
          this.attendanceGroupPlanScence();
          this.attendanceGroupPlanTotal();
        });
      })
      .catch(() => {});
  }
  // 行内点击事件
  rowClick(row) {
    if (row.date) {
      this.planDate = row.date.substring(0, 7); //点击的时间
      this.attendanceGroupPlanTotal().then((res: any) => {
        //请求成功后再执行样式操作
        if (res.data.code !== 200) return;
        let dom = document.getElementsByClassName(row.date); // 当前点击的日期  对应上  右边的日期class
        let allClass = document.getElementsByClassName("calendar-day"); // 所有可能需要加上 高亮属性的class
        for (let v in allClass) {
          if (allClass[v].className) {
            if (allClass[v].className.includes("holidayHight")) {
              // 切换高亮，只存在一个 删除其他的
              allClass[v].classList.remove("holidayHight");
            }
          }
        }
        dom[0].className += " holidayHight"; // 为当前点击的对应日期加上高亮属性
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.table-title {
  margin-bottom: 25px;
  height: 40px;
  line-height: 40px;
}
::v-deep .table-con tr {
  cursor: pointer;
}
.plan-layout {
  width: 100%;
  height: 460px;
  box-shadow: 0px 0px 8px 0px lightgrey;
  margin-top: 15px;
  overflow-y: scroll;
  li {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    .title {
      display: inline-block;
      text-align: center;
      width: 150px;
    }

    .del-icon {
      position: absolute;
      color: #409eff;
      top: 0px;
      right: 5px;
      cursor: pointer;
    }
  }
  .active {
    background: #409eff;
    color: #fff;
  }
}
.plan-height {
  height: 550px;
  .choose-date {
    margin-bottom: 15px;
  }
}
.plan-calendar {
  width: 100%;
  height: 420px;
}
.main {
  display: flex;
  .rightContent {
    flex: 1;
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
.marginForm {
  float: left;
  width: 50%;
  margin-bottom: 0px;
}
.person-height {
  height: 500px;
}
::v-deep {
  .el-transfer-panel__body {
    height: 89%;
    .el-transfer-panel__list.is-filterable {
      height: inherit;
    }
  }
  .el-tree-node__content {
    &:hover {
      background: #fff;
    }
  }
  .is-current > .el-tree-node__content {
    background-color: #409eff !important;
    color: #fff;
  }
  .el-table td,
  .el-table th {
    padding: 6px 0 !important;
  }
  .el-button + .el-button {
    margin: 0;
  }
  .el-transfer {
    width: 100%;
    .el-transfer__buttons {
      button {
        display: block;
      }
    }
  }
  .el-transfer-panel {
    width: 420px;
    height: 440px;
  }
  // .el-dialog {
  //   margin-bottom: 0;
  // }
  // .el-dialog__body {
  //   padding: 10px 20px 30px;
  // }
  .el-calendar__header {
    display: none;
  }
  .el-calendar__body,
  .el-calendar-table {
    height: 440px !important;
    padding-left: 0;
  }
  .el-calendar-table .el-calendar-day {
    height: 82px;
    padding: 0;
  }
}
.button-arrow {
  display: flex;
  align-items: center;
  height: 500px;
  .el-button {
    margin-bottom: 20px;
  }
}
.holiday,
.holidayHight {
  display: inline-block;
  background: #409eff;
  color: #fff;
}

.holidayHight {
  background: #67c23a;
}
.calendar-day {
  width: 100%;
  height: 100%;
  padding: 8px;
  .explain {
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
/deep/.el-calendar-table thead th {
  border: 1px solid #ebeef5;
  border-bottom: 0;
  border-right: 0;
}
/deep/.el-calendar-table thead th:last-child {
  border-right: 1px solid #ebeef5;
}
.plan-dialog {
  /deep/ .el-dialog__body {
    height: 640px;
  }
}
.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
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
.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
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
</style>
