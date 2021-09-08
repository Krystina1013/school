<template>
  <div>
    <!-- 选择预警人员 -->
    <el-dialog class="newDialog noPadding" title="选择预警人员" :visible="true" width="1200px" top='50px' :before-close="closeDialogPerson" :close-on-click-modal="false">
      <el-row>
        <el-col :span="19">
          <div class="header_div left">
            <el-tabs v-model="activeName" @tab-click="changeRadio">
              <el-tab-pane label="学生" name="1"></el-tab-pane>
              <el-tab-pane label="教师" name="2"></el-tab-pane>
              <el-tab-pane label="职工" name="3"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="body_div left">
            <div v-if="activeName === '1'">
              <el-form ref="form" :model="filterForm1" :inline="true">
                <el-form-item label="学生姓名:">
                  <el-input maxlength="30" v-model.trim="filterForm1.name" size="small" placeholder="请输入学生姓名" class="input_search"></el-input>
                </el-form-item>
                <el-form-item label="学号:">
                  <el-input maxlength="30" v-model.trim="filterForm1.studentNo" size="small" placeholder="请输入学号" class="input_search"></el-input>
                </el-form-item>
                <el-form-item label="班级:">
                  <el-input maxlength="30" v-model.trim="filterForm1.className" size="small" placeholder="请输入班级" class="input_search"></el-input>
                </el-form-item>
                <el-form-item style="float:right">
                  <el-button type="primary" size="mini" @click="getTableData1">查询</el-button>
                </el-form-item>
              </el-form>
              <el-table ref="table1" height="498" :data="tableStudentsData" border stripe :header-cell-style="{background:'#f5f5f5',color:'#606266', fontWeight: '500'}">
                <el-table-column type="index" width="60" label="序号" align="center" v-if="activeName === '1'"></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="姓名" align="center" v-if="activeName === '1'">
                  <template slot-scope='scope'>
                    <span>{{ scope.row.name || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="className" label="班级" align="center" v-if="activeName === '1'">
                  <template slot-scope='scope'>
                    <span>{{scope.row.myClass?scope.row.myClass.className: '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="studentNo" label="学号" align="center" v-if="activeName === '1'">
                  <template slot-scope='scope'>
                    <span>{{ scope.row.studentNo || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="-" width="102" align="center" v-if="activeName === '1'">
                  <template slot-scope="scope">
                    <el-checkbox class="checkboxT" v-model="scope.row.selected" v-if="scope.row.selected" @change="cancelRoom(scope.row)">已选</el-checkbox>
                    <el-checkbox class="checkboxF" v-model="scope.row.selected" v-else @change="addRoom(scope.row)">未选</el-checkbox>
                  </template>
                </el-table-column>

                <template slot="empty">
                  <div class="flex-row align-items-center justify-content-center empty-text">
                    <i class="iconfont icon-tishi"></i>
                    <span style="margin-left:5px">
                      {{ $constant.msg.hasNoData }}
                    </span>
                  </div>
                </template>
              </el-table>

              <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                  pagination1.pageSize = $event;
                  getTableData1();
                " @current-change="
                  pagination1.page = $event;
                  getTableData1();
                " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination1.pageSize" layout="prev, pager, next, jumper, total" :total="pagination1.total"></el-pagination>
            </div>

            <div v-if="activeName === '2'">
              <el-form ref="form" :model="filterForm2" :inline="true">
                <el-form-item label="老师姓名:">
                  <el-input maxlength="30" v-model.trim="filterForm2.name" size="small" placeholder="请输入老师姓名" class="input_search"></el-input>
                </el-form-item>
                <el-form-item label="手机号:">
                  <el-input maxlength="11" v-model.trim="filterForm2.phone" size="small" placeholder="请输入手机号" class="input_search"></el-input>
                </el-form-item>
                <el-form-item style="float:right">
                  <el-button type="primary" size="mini" @click="getTableData2">查询</el-button>
                </el-form-item>
              </el-form>
              <el-table ref="table2" height="498" :data="tableTeachersData" border stripe :header-cell-style="{background:'#f5f5f5',color:'#606266', fontWeight: '500'}">
                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="phone" label="手机号" align="center">
                  <template slot-scope='scope'>
                    <span>{{scope.row.phone || '-'}}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column show-overflow-tooltip prop="groupName" label="科目组" align="center"></el-table-column> -->
                <el-table-column label="操作" width="102" align="center">
                  <template slot-scope="scope">
                    <el-checkbox class="checkboxT" v-model="scope.row.selected" v-if="scope.row.selected" @change="cancelRoom(scope.row)">已选</el-checkbox>
                    <el-checkbox class="checkboxF" v-model="scope.row.selected" v-else @change="addRoom(scope.row)">未选</el-checkbox>
                  </template>
                </el-table-column>

                <template slot="empty">
                  <div class="flex-row align-items-center justify-content-center empty-text">
                    <i class="iconfont icon-tishi"></i>
                    <span style="margin-left:5px">
                      {{ $constant.msg.hasNoData }}
                    </span>
                  </div>
                </template>
              </el-table>

              <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                  pagination2.pageSize = $event;
                  getTableData2();
                " @current-change="
                  pagination2.page = $event;
                  getTableData2();
                " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination2.pageSize" layout="prev, pager, next, jumper, total" :total="pagination2.total"></el-pagination>
            </div>

            <div v-if="activeName === '3'">
              <el-form ref="form" :model="filterForm3" :inline="true">
                <el-form-item label="职工姓名:">
                  <el-input maxlength="30" v-model.trim="filterForm3.name" size="small" placeholder="请输入职工姓名" class="input_search"></el-input>
                </el-form-item>
                <el-form-item label="手机号:">
                  <el-input maxlength="11" v-model.trim="filterForm3.phone" size="small" placeholder="请输入手机号" class="input_search"></el-input>
                </el-form-item>
                <el-form-item label="部门:">
                  <el-cascader style="width:100%;" size="small" v-model="groupIdArr" :options="TreeDataCans" :props="{ label: 'name', children: 'subWorkerGroups', value: 'id',checkStrictly:'true' }" @change="handleChange" class="input_search"></el-cascader>
                </el-form-item>
                <el-form-item style="float:right">
                  <el-button type="primary" size="mini" @click="getTableData3">查询</el-button>
                </el-form-item>
              </el-form>
              <el-table ref="table3" height="498" :data="tableWorkersData" border stripe :header-cell-style="{background:'#f5f5f5',color:'#606266', fontWeight: '500'}">
                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="workerGroupName" label="部门" align="center">
                  <template slot-scope='scope'>
                    <span>{{scope.row.workerGroupName || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="phone" label="手机号" align="center">
                  <template slot-scope='scope'>
                    <span>{{scope.row.phone || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="-" width="102" align="center">
                  <template slot-scope="scope">
                    <el-checkbox class="checkboxT" v-model="scope.row.selected" v-if="scope.row.selected" @change="cancelRoom(scope.row)">已选</el-checkbox>
                    <el-checkbox class="checkboxF" v-model="scope.row.selected" v-else @change="addRoom(scope.row)">未选</el-checkbox>
                  </template>
                </el-table-column>

                <template slot="empty">
                  <div class="flex-row align-items-center justify-content-center empty-text">
                    <i class="iconfont icon-tishi"></i>
                    <span style="margin-left:5px">
                      {{ $constant.msg.hasNoData }}
                    </span>
                  </div>
                </template>
              </el-table>

              <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                  pagination3.pageSize = $event;
                  getTableData3();
                " @current-change="
                  pagination3.page = $event;
                  getTableData3();
                " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination3.pageSize" layout="prev, pager, next, jumper, total" :total="pagination3.total"></el-pagination>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="header_div right">
            <p>已选择</p>
          </div>
          <div class="body_div right">
            <div class="person-con">
              <h3 class="one-title">学生</h3>
              <div class="one-value">
                <template v-for="(item,i) in selectedRoomAll">
                  <p v-if="item.type == 1" :key="i" class="select-times">
                    {{item.name+'-'+item.studentNo}}
                  </p>
                </template>
              </div>
              <h3 class="one-title">教师</h3>
              <div class="one-value">
                <template v-for="(jtem,j) in selectedRoomAll">
                  <p v-if="jtem.type == 2" :key="j" class="select-times">
                    {{jtem.name+'-'+jtem.phone}}
                  </p>
                </template>
              </div>
              <h3 class="one-title">职工</h3>
              <div class="one-value">
                <template v-for="(ktem,k) in selectedRoomAll">
                  <p v-if="ktem.type == 3" :key="k" class="select-times">
                    {{ktem.name+'-'+ktem.phone}}
                  </p>
                </template>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogPerson">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="confirmAddPerson" :loading="personLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import {
  Component,
  Prop,
  Vue,
  Mixins,
  Emit,
  Watch,
} from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";

import {
  getBuildingTreeData,
  getWorkGroup,
  getClassTree,
  getClass,
} from "@/api/houseApi";
import {
  getWorkerById,
  getStudents,
  getTeacher,
  getWorker,
} from "@/api/peopleApi";
@Component({
  components: {},
})
export default class DialogChoosePerson extends Vue {
  @Prop({ default: false }) multiple: any;
  height_w = window.innerHeight;
  width_w = window.innerWidth;
  searchField = {
    name: "",
  };
  defaultProps: object = {
    children: "children",
    label: "name",
    isLeaf: "leaf",
  };
  tableStudentsData: any = [];
  tableTeachersData: any = [];
  tableWorkersData: any = [];
  tableImportantsData: any = [];
  studentTableData: any = [];
  studentTransferData: any = [];
  teacherTableData: any = [];
  teacherTransferData: any = [];
  workerTableData: any = [];
  workerTransferData: any = [];
  filterForm1: object = {
    name: "",
    className: "",
    studentNo: "",
  };
  filterForm2: object = {
    name: "",
    phone: "",
  };
  filterForm3: object = {
    name: "",
    phone: "",
    groupId: "",
  };
  pagination1: object = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0],
  };
  pagination2: object = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0],
  };
  pagination3: object = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0],
  };
  currentNodeKey = "所有";
  defaultExpandedKeys = ["所有"];
  activeName: string = "1";
  currentNode: any = "";
  selectedRoom: any = [];
  oldSelectedRoom: any = [];
  selectedRoomAll: any = []; // 已选人员数据
  treeData1: any = [];
  treeData2: any = [
    {
      id: "",
      name: "所有",
    },
  ];
  treeData3: any = [];
  page1: any = {
    pageSize: 20,
    total: 0,
    page: 1,
  };
  page2: any = {
    pageSize: 20,
    total: 0,
    page: 1,
  };
  page3: any = {
    pageSize: 20,
    total: 0,
    page: 1,
  };
  TreeDataCans: Array<object> = []; //工作组
  groupIdArr: Array<string> = [];
  personLoading: boolean = false;
  // 改变标签
  changeRadio() {
    if (this.activeName === "1") {
      this.getTableData1();
    } else if (this.activeName === "2") {
      this.getTableData2();
    } else {
      this.getTableData3();
    }
  }
  // 学生table
  async getTableData1() {
    let params = {
      limit: this.pagination1["pageSize"],
      page: this.pagination1["page"],
      name: this.filterForm1["name"],
      studentNo: this.filterForm1["studentNo"],
      className: this.filterForm1["className"],
      hasFace: true,
    };
    let { data } = await getStudents(params);
    data = data.data;
    this.pagination1["total"] = parseInt(data.total);
    if (data.records.length > 0) {
      data.records.map((item: any, i) => {
        data.records[i].type = 1;
        data.records[i].enableInviteVisitor = 1;
        data.records[i].enableRemoteOpen = 1;
        data.records[i].overTime = "";
        let obj = this["selectedRoom"].find(
          (item1: any) => item1.scenceUserId == item.scenceUserId
        );
        if (obj) {
          data.records[i].selected = true;
        } else {
          data.records[i].selected = false;
        }
      });
    }
    this.tableStudentsData = data.records;
  }
  // 老师table
  async getTableData2() {
    let params = {
      limit: this.pagination2["pageSize"],
      page: this.pagination2["page"],
      name: this.filterForm2["name"],
      phone: this.filterForm2["phone"],
      hasFace: true,
    };
    let { data } = await getTeacher(params);
    data = data.data;
    this.pagination2["total"] = parseInt(data.total);
    if (data.records.length > 0) {
      data.records.map((item: any, i) => {
        data.records[i].type = 2;
        data.records[i].enableInviteVisitor = 1;
        data.records[i].enableRemoteOpen = 1;
        data.records[i].overTime = "";
        let obj = this["selectedRoom"].find(
          (item1: any) => item1.scenceUserId == item.scenceUserId
        );
        if (obj) {
          data.records[i].selected = true;
        } else {
          data.records[i].selected = false;
        }
      });
    }
    this.tableTeachersData = data.records;
  }
  // 职工table
  async getTableData3() {
    let params = {
      limit: this.pagination3["pageSize"],
      page: this.pagination3["page"],
      name: this.filterForm3["name"],
      groupId: this.filterForm3["groupId"],
      phone: this.filterForm3["phone"],
      hasFace: true,
    };
    let { data } = await getWorker(params);
    data = data.data;
    this.pagination3["total"] = parseInt(data.total);
    if (data.records.length > 0) {
      data.records.map((item: any, i) => {
        data.records[i].type = 3;
        data.records[i].enableInviteVisitor = 1;
        data.records[i].enableRemoteOpen = 1;
        data.records[i].overTime = "";
        let obj = this["selectedRoom"].find(
          (item1: any) => item1.scenceUserId == item.scenceUserId
        );
        if (obj) {
          data.records[i].selected = true;
        } else {
          data.records[i].selected = false;
        }
      });
    }
    this.tableWorkersData = data.records;
  }
  handleChange(arr) {
    this.filterForm3["groupId"] = [...arr].pop();
  }
  // 部门级联
  getGroupTree() {
    getWorkGroup().then((res) => {
      this.TreeDataCans = JSON.parse(JSON.stringify(res.data.data));
      this.initTreeData(this.TreeDataCans);
    });
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
  created() {
    this.selectedRoomAll = [];
    this.selectedRoom = JSON.parse(
      JSON.stringify(this.$parent["dialogChoosePerson"].selectedRoom)
    );
    this.oldSelectedRoom = JSON.parse(
      JSON.stringify(this.$parent["dialogChoosePerson"].selectedRoom)
    );
    // 暂时选定 保存选定状态
    let type1:any = [];
    let type2:any = [];
    let type3:any = [];
    _.mapValues(this.selectedRoom, (item) => {
      // console.log("nnnnnnn", item.type);
      if (item.type === 1) {
        type1.push(item);
      } else if (item.type === 2) {
        type2.push(item);
      } else if (item.type === 3) {
        type3.push(item);
      }
    });

    let datas = this.$parent["detailData"];
    if (datas) {
      if (datas.student_scenceUserVos) {
        let students = _.uniq(_.concat(datas.student_scenceUserVos, type1));
        students.map((stu) => {
          this.selectedRoomAll.push({
            type: 1,
            name: stu.name,
            studentNo: stu.studentNo,
          });
        });
        console.log("bbbbb", this.selectedRoomAll);
      } else {
        type1.map((stu) => {
          this.selectedRoomAll.push({
            type: 1,
            name: stu.name,
            studentNo: stu.studentNo
            });
        });
      }

      if (datas.teacher_scenceUserVos) {
        let teachers = _.uniq(_.concat(datas.teacher_scenceUserVos, type2));
        teachers.map((tea) => {
          this.selectedRoomAll.push({
            type: 2,
            name: tea.name,
            phone: tea.phone,
          });
        });
      } else {
        type2.map((tea) => {
          this.selectedRoomAll.push({
            type: 2,
            name: tea.name,
            phone: tea.phone,
          });
        });
      }

      if (datas.worker_scenceUserVos) {
        let workers = _.uniq(_.concat(datas.worker_scenceUserVos, type3));
        workers.map((worker) => {
          this.selectedRoomAll.push({
            type: 3,
            name: worker.name,
            phone: worker.phone,
          });
        });
      } else {
        type3.map((worker) => {
          this.selectedRoomAll.push({
            type: 3,
            name: worker.name,
            phone: worker.phone,
          });
        });
      }
    }
    this.getGroupTree();
    this.getTableData1();
  }
  // 第一个穿梭框的分页
  handleCurrentChange1() {}
  mounted() {
    window.addEventListener("resize", this.windowResize);
  }
  destroyed() {
    window.removeEventListener("resize", this.windowResize);
  }
  windowResize() {
    this.height_w = window.innerHeight;
  }

  cancelRoom(row) {
    row.selected = false;
    let index1 = this.selectedRoom.findIndex(
      (item: any) => item.scenceUserId == row.scenceUserId 
    );
    this.selectedRoomAll = this.selectedRoomAll.filter(
      (item: any) => item.phone !== row.phone
    );
    debugger;
    this.selectedRoom.splice(index1, 1);
    // this.selectedRoomAll.splice(index2, 1);
  }

  confirm() {
    this.$emit("selectRoom", this.selectedRoom);
    this.$parent["dialogChoosePerson"].visible = false;
  }
  // 关闭弹窗
  closeDialogPerson() {
    this.selectedRoom = this.oldSelectedRoom;
    this.$parent["dialogChoosePerson"].visible = false;
  }
  addRoom(row) {
    row.selected = true;
    let obj = { ...row };
    if (this.multiple) {
      this.selectedRoom.push(obj);
      this.selectedRoomAll.push(obj);
    } else {
      this.selectedRoom[0] = obj;
      this.confirm();
    }
  }
  confirmAddPerson() {
    this.confirm();
  }

  //班级信息树数据初始化
  initGrade(dataArr) {
    let arr: any = [];
    if (dataArr && dataArr.length > 0) {
      dataArr.forEach((item) => {
        arr.push({
          id: item,
          name: item,
          type: "grade",
          children: [],
        });
      });
    }
    return arr;
  }
  //班级具体信息树数据初始化
  initClass(dataArr) {
    let arr: any = [];
    if (dataArr && dataArr.length > 0) {
      dataArr.forEach((item) => {
        arr.push({
          id: item.id,
          name: item.className,
          type: "class",
          leaf: true,
        });
      });
    }
    return arr;
  }
  // 班级信息获取
  async getClassBuilding() {
    let { data } = await getClassTree();
    let treeData: any = [];
    if (data.data) {
      for (let item in data.data) {
        let dataArr = this.initGrade(data.data[item]);
        treeData.push({
          name: item,
          id: item,
          children: dataArr,
        });
      }
    }
    this.treeData1 = [
      {
        name: "所有",
        id: "",
        children: treeData,
      },
    ];
    console.log("123", this.treeData1);
  }
  // 展开班级节点
  async loadNode1(node, resolve) {
    if (node.data.type === "grade") {
      let { data } = await getClass(node.data.id);
      resolve(this.initClass(data.data.records));
    } else {
      if (node.leaf) {
        resolve([]);
      } else {
        resolve(node.data.children);
      }
    }
  }
  // 班级节点点击
  async handleNodeClickGrade(node) {
    let params = {
      className: node.name,
      limit: this.page1.pageSize,
      page: this.page1.page,
    };
    let { data } = await getStudents(params);
    this.studentTableData = data.data.records;
    this.page1.total = data.data.total;
  }
}
</script>

<style lang="scss">
.noPadding {
  .el-dialog__body {
    padding: 0;
  }
}

.header_div {
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
}
</style>

<style lang="scss" scoped>
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
      color: #606266;
      line-height: 45px;
    }
  }
  .body_div {
    padding: 20px;
  }
  .input_search {
    width: 180px;
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
  .person-con {
    height: 560px;
    width: 100%;
    overflow-y: auto;
    font-size: 14px;
    line-height: 22px;
  }
  .one-title {
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #409eff;
  }
  .one-value {
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    color: #606266;
    min-height: 150px;
    height: auto;
    margin-top: 13px;
  }
  .select-times {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
