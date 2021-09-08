<template>
  <div class="app-container">
    <el-row class="headerRow">
      <el-col :span="24">
        <action-header :initFormHeader="initForm" :exportUrl="exportUrl" exportName="重点人员导出.xls" @fetchData="fetchData" :filterForm="filterForm" :total="pageTotal" :moreStatus="false" :btnStatus='0' :pageStatus="false" :police="true" :scroll='true' @clearFilter="clearFilter">
          <el-button slot="faceImport" class="createBtn" type="primary" icon="el-icon-plus" size="small" @click="addHandle">添加</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input clearable placeholder="请输入需要查找的姓名" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.name" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">电&nbsp;&nbsp;&nbsp;话:</span>
              <el-input clearable placeholder="请输入需要查找的电话" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.phone" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">证件号码:</span>
              <el-input clearable placeholder="请输入需要查找的证件号码" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.cardNo" size="small"></el-input>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <div class="components-container">
      <split-pane split="vertical" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <div :class="['treeHeader', highlightStatus ? '' : 'highlight']" @click="handleNodeClick({ id: '' })">所有
              <!-- <i class="iconfont icon-shuji"></i> -->
              <el-dropdown class="dropdownAll" placement="bottom-start">
                <i class="iconfont icon-gengduo"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><span @click="openDialogAdd">新建关注人员分组</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="bottom">
              <el-tree :data="TreeData" node-key="id" accordion :highlight-current="highlightStatus" :default-expand-all="false" :expand-on-click-node="false" @node-click="handleNodeClick" :props="defaultProps">
                <span slot-scope="{ node, data }" @mouseenter="MouseNnter(node.id)" @mouseleave="MouseLeave(node.id)" :class="[
                    'custom-tree-node',
                    currentTreeId == data.id ? 'highlight' : '',
                  ]">
                  <span :title="`${data.name} (${data.count})`">
                    {{
                      node.label.length > 8
                        ? node.label.substring(0, 8) + "..."
                        : node.label
                    }}
                    ({{ data.count }})
                  </span>
                  <div style="position: relative">
                    <el-dropdown v-if="UpdateStatus" placement="bottom-start">
                      <i v-show="node.id === showMenu" class="iconfont icon-gengduo"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><span @click="openDialogUpdate(data)">修改</span></el-dropdown-item>
                        <el-dropdown-item><span @click="deleteGroup(data.id)">删除</span></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </span>
              </el-tree>
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">

            <ScrollList v-loading="showLoading" class="scollList" ref="scrollList" :height="height_w - 245" :canPullUp="canPullUp" @scrollToBottom="scrollToBottom">
              <div class="card" :key="index" v-for="(item, index) in tableData">
                <!-- <div class="card-items"> -->
                <div class="horn">
                  <div class="lt"></div>
                  <div class="rt"></div>
                  <div class="rb"></div>
                  <div class="lb"></div>
                </div>
                <div style="position: relative;z-index:5;">
                  <div class="imgWrapper" @click="showDetailDialog(item)">
                    <img :src="item.faceUrl" style="cursor: pointer" />
                  </div>
                  <div class="detailWrapper">
                    <span class="name moreWord" :title="item.name" style="word-break: break-all">{{ item.name }}</span>
                    <span class="flex-1 moreWord" :title="item.createTime">{{
                    item.createTime | ignoreYearAndSecond
                  }}</span>
                  </div>
                  <div class="buttonWrapper">
                    <!-- <el-button type="text" size="small" class="detailBtn" @click="showDetailDialog(item)">详情</el-button> -->
                    <el-button class="btnClass" type="text" size="mini" @click="showDeleteDialog(item.id)" icon="el-icon-delete">删除</el-button>
                    <el-button class="btnClass" type="text" size="mini" @click="showUpdateDialog(item)" icon="el-icon-edit-outline">修改</el-button>
                  </div>
                </div>
                <!-- </div> -->
              </div>
            </ScrollList>
          </div>
        </template>
      </split-pane>
    </div>
    <AddPersonPic ref="addpersonPic" :dialogCreate="dialogCreate" :groupData='TreeData' @submit="confirmAddOrUpdate" @close="dialogCreate = false"></AddPersonPic>

    <el-dialog class="newDialog" :close-on-click-modal="false" :title="personTitle ? '添加关注人员分组' : '修改关注人员分组'" :visible.sync="dialogAddPerson" width="510px" :before-close="handleClose">
      <el-form :model="libraryRuleForm" :rules="libraryRules" ref="libraryRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称：" prop="name">
          <el-input v-model.trim="libraryRuleForm.name" maxlength="32" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="报警阈值：" prop="alertCnt" :rules="{
            required: true,
            message: '请选择报警阈值',
            trigger: 'change',
          }">
          <el-select v-model="libraryRuleForm.alertCnt" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in similarityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控点位：" prop="cameraList" :rules="{
            required: true,
            message: '请选择监控点位',
            trigger: 'change',
          }">
          <el-button type="primary" size="small" class="aBtn" @click="choosePoint">选择点位</el-button>
        </el-form-item>

        <el-form-item label="已选点位：">
          <span class="dib" style="margin-right: 20px; line-height: 25px" :key="index" v-for="(item, index) in libraryRuleForm.cameraList">{{ item.name }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddPerson" :loading="addGroupLoad">确 定</el-button>
      </span>
    </el-dialog>
    <ChooseCamera :visible="chooseCamera.visible" :camera="chooseCamera.camera" @close="chooseCamera.visible = false" @submit="confirmChoose"></ChooseCamera>
    <DialogDetail :visible="dialogDetail.visible" :form="dialogDetail.form" :title="dialogDetail.title" @close="dialogDetail.visible = false"></DialogDetail>
    <AddOrUpdatePerson @close="dialogEditPortrait.visible = false" :groupData='TreeData' :visible="dialogEditPortrait.visible" :form="dialogEditPortrait.form" :title="dialogEditPortrait.title" @submit="updatePerson"></AddOrUpdatePerson>
  </div>
</template>

<script lang="ts">
import splitPane from "vue-splitpane";
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import {
  importantGroup,
  AddimportantGroup,
  getCameraNoPage,
  updateImportantGroup,
  delateImportantGroup,
  addImportantPerson,
  getImportantPerson,
  deleteImportantPerson,
} from "@/api/police";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
import { getBase64 } from "@/utils/index.js";
import AddPersonPic from "./components/addPersonPic.vue";
import DialogDetail from "./components/dialogDetail.vue";
import ChooseCamera from "./components/chooseCamera.vue";
import AddOrUpdatePerson from "./components/addOrUpdatePerson.vue";
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    splitPane,
    AddPersonPic,
    ScrollList,
    ChooseCamera,
    DialogDetail,
    AddOrUpdatePerson,
  },
})
export default class importantPerson extends Vue {
  defaultProps: object = {
    children: "children",
    label: "name",
  };
  chooseCamera: any = {
    visible: false,
    camera: [],
  };
  config: any = config;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  highlightStatus: boolean = false; // 高亮状态
  private rowSpan: number = 16;
  private showMenu: Number = 0;
  UpdateStatus: boolean = true; // 是否具有修改权限
  initForm: object = {};
  libraryRuleForm: any = {
    name: "",
    alertCnt: "",
    cameraList: [],
    originalCameraList: [],
  };
  currentTreeId: string = "";
  libraryRules: object = {
    name: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
  };

  filterForm: object = {
    name: "",
    cardNo: "",
    phone: "",
  }; // 筛选条件
  exportUrl: string = "";
  TreeData: Array<object> = [];
  dialogAddPerson: boolean = false; //添加人像库
  addGroupLoad: boolean = false; //添加人像库-按钮
  personTitle: boolean = false;
  canPullUp: boolean = true;
  tableData: Array<object> = [];
  //人像详情
  dialogDetail: any = {
    visible: false,
    title: "人像详情",
    form: {},
  };
  //修改人像
  dialogEditPortrait: any = {
    visible: false,
    form: {},
    title: "",
    // groupData: []
  };
  pageTotal: any = "";
  similarityList: Array<object> = JSON.parse(localStorage.similarityList);
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 20,
  };
  showLoading: boolean = false;
  created() {
    this["isPolice"] = true;
    this.getLeftTree();
    this.getTableData();
  }
  clearFilter() {
    this.filterForm = {
      name: "",
      cardNo: "",
      phone: "",
    };
  }
  fetchData() {
    this.getTableData();
  }
  getLeftTree() {
    importantGroup({ page: 1, pageSize: 100 }).then((res) => {
      console.log(res.data.data.records);
      this.TreeData = res.data.data.records;
      // debugger;
      // this.$refs["addpersonPic"]['groupData'] = this.TreeData;
      // this.dialogEditPortrait.groupData = this.TreeData;
    });
  }

  getTableData() {
    if (this.currentTreeId) {
      this.highlightStatus = true;
    }
    this.pagination.page = 1;
    this.tableData = [];
    this.loadData();
  }
  loadData() {
    // console.log(this.initForm)
    this.pagination.pageSize = this.initForm["params"].limit || 20;
    let param = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      alertTaskId: this.currentTreeId,
      ...this.filterForm,
    };
    this.showLoading = true;
    getImportantPerson(param)
      .then((res) => {
        let data1 = res.data.data;
        this.showLoading = false;
        this.pagination.total = parseInt(data1.total);
        this.pageTotal = data1.total;
        if (this.pagination.page == 1) {
          this.tableData = data1.records;
          // this.$refs.scrollList.scrollToTop();
        } else {
          this.tableData = [...this.tableData, ...data1.records];
        }
        this.$nextTick(() => {
          if (this.tableData.length == parseInt(data1.total)) {
            this.canPullUp = false;
          } else {
            this.canPullUp = true;
          }
        });
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  scrollToBottom() {
    this.pagination.page++;
    this.loadData();
  }
  handleNodeClick(data) {
    this.highlightStatus = !!data.id;

    this.currentTreeId = data.id;
    this.getTableData();
  }
  /**显示更多操作图标 */
  MouseNnter(val) {
    this.showMenu = val;
  }
  MouseLeave(val) {
    this.showMenu = 0;
  }
  // 选择监控点位
  choosePoint() {
    this.chooseCamera.camera = JSON.parse(
      JSON.stringify(this.libraryRuleForm.cameraList)
    );
    this.chooseCamera.visible = true;
  }
  //增加重点人员分组
  openDialogAdd() {
    this.personTitle = true;
    this.dialogAddPerson = true;
  }
  addHandle() {
    this.dialogEditPortrait.form = {};
    this.dialogEditPortrait.visible = true;
    this.dialogEditPortrait.title = "添加人员";
  }
  // 修改重点人员分组
  openDialogUpdate(item: object) {
    if (item) {
      this.libraryRuleForm["name"] = item["name"];
      this.libraryRuleForm["alertCnt"] = item["alertCnt"];
      getCameraNoPage({ alertTaskId: item["id"] }).then((res) => {
        this.libraryRuleForm["cameraList"] = [...res.data.data];
        this.libraryRuleForm["originalCameraList"] = [...res.data.data];
      });
      this.currentTreeId = item["id"];
    }
    this.personTitle = false;
    this.dialogAddPerson = true;
  }
  // 删除分组
  deleteGroup(id) {
    this.$confirm(
      "此操作将永久删除选中的分组, 删除后分组将不存在,请谨慎操作!",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(() => {
      let param = [id];
      delateImportantGroup(param).then((res) => {
        this.$message.success("删除成功！");
        this.currentTreeId = "";
        this.highlightStatus = false;
        this.getLeftTree();
        this.getTableData();
      });
    });
  }
  handleClose() {
    this.libraryRuleForm["name"] = "";
    this.libraryRuleForm.cameraList = [];
    this.addGroupLoad = false;
    this.dialogAddPerson = false;
    this.$refs["libraryRuleForm"]["resetFields"]();
  }
  //分组
  confirmAddPerson() {
    this.$refs["libraryRuleForm"]["validate"]((valid) => {
      if (valid) {
        this.addGroupLoad = true;
        let similarity = JSON.parse(localStorage.similarity);
        let examineLevel;
        for (let i in similarity) {
          if (similarity[i] == this.libraryRuleForm.alertCnt) {
            examineLevel = i;
          }
        }
        let cameraIds: any = [];
        this.libraryRuleForm.cameraList.map((item: any) => {
          cameraIds.push(item.id);
        });
        let param = {
          alertCnt: this.libraryRuleForm.alertCnt,
          name: this.libraryRuleForm.name,
          examineLevel,
          cameraIds,
          cameraList: this.libraryRuleForm.cameraList,
        };

        if (this.personTitle) {
          //增加
          this.addGroup(param);
        } else {
          this.updateGroup(param);
        }
      }
    });
  }
  //新增分组
  addGroup(param) {
    AddimportantGroup(param)
      .then((res) => {
        this.addGroupLoad = false;
        this.$message.success("添加成功！");
        this.getLeftTree();
        this.handleClose();
      })
      .catch((err) => {
        this.addGroupLoad = false;
      });
  }
  // 修改分组
  updateGroup(param) {
    param.id = this.currentTreeId;
    let sameList = param.cameraList.filter((item) =>
      this.libraryRuleForm.originalCameraList.find(
        (item1) => item1.id == item.id
      )
    );
    let differentList = param.cameraList.filter(
      (item) =>
        !this.libraryRuleForm.originalCameraList.find(
          (item1) => item1.id == item.id
        )
    );
    let deleteList = this.libraryRuleForm.originalCameraList.filter(
      (item) => !sameList.find((item1) => item1.id == item.id)
    );
    param.cameraIdsAdd = differentList.map((item) => item.id);
    param.cameraIdsDelete = deleteList.map((item) => item.id);
    updateImportantGroup(param)
      .then((res) => {
        this.addGroupLoad = false;
        this.$message.success("修改成功！");
        this.getLeftTree();
        this.handleClose();
      })
      .catch((err) => {
        this.addGroupLoad = false;
      });
  }
  deletePerson(id) {
    this.$confirm("此操作将永久删除该人像库, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
  }
  //人员弹窗
  showDetailDialog(item) {
    this.dialogDetail.form = item;
    this.dialogDetail.visible = true;
  }
  showDeleteDialog(id) {
    this.$confirm("此操作将永久删除该人像, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      deleteImportantPerson([id]).then((res) => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getLeftTree();
        this.getTableData();
      });
    });
  }
  showUpdateDialog(item) {
    this.dialogEditPortrait.form = { ...item };
    // debugger;
    // this.$refs["addpersonPic"]['groupData'] = this.TreeData;
    // this.dialogEditPortrait.groupData = this.TreeData;
    this.dialogEditPortrait.visible = true;
    this.dialogEditPortrait.title = "修改人像";
    console.log(this.dialogEditPortrait.title);
  }
  // 选择的摄像机
  confirmChoose(val) {
    this.libraryRuleForm.cameraList = val;
    this.chooseCamera.visible = false;
  }
  //确认添加重点人员
  confirmAddOrUpdate(val) {
    // val.id = this.currentTreeId;
    addImportantPerson(val).then((res) => {
      this.$message.success("添加成功！");
      this["dialogCreate"] = false;

      this.$refs["addpersonPic"]["clearAllPortrait"]();
      this.getLeftTree();
      this.getTableData();
    });
  }
  //修改人像信息
  updatePerson(val) {
    this.dialogEditPortrait.visible = false;
    this.getLeftTree();
    this.getTableData();
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100% - 15px);
}
.headerRow {
  background: #fff;
  padding: 0 22px;
}
/deep/ .headerRow {
  background: #fff;
  padding: 6px 22px;
  padding-bottom: 8px;
  line-height: 34px;
  .row-bg {
    margin: 0;
  }
}
.leftContent {
  position: relative;
  height: calc(100vh - 52px);
  background: #fff;
  .bottom {
    height: calc(100% - 46px);
    color: #333;
    li {
      cursor: pointer;
      font-size: 14px;
      padding: 5px;
    }
    .active {
      background: #409eff;
      color: #fff;
    }
  }
  .treeHeader {
    /deep/.el-tree .el-tree-node__content {
      height: 40px;
      line-height: 40px;
    }
    &:hover {
      cursor: pointer;
    }
    width: 100%;
    padding: 0 15px;
    height: 40px;
    text-align: left;
    line-height: 40px;
    position: relative;
    i {
      font-size: 20px;
    }
    .icon-gengduo {
      display: none;
    }
    .dropdownAll {
      width: 10px;
      height: 10px;
      position: absolute;
      right: 30px;
      top: 0px;
    }
    &:hover .icon-gengduo {
      display: block;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 0 15px;
  }
  .highlight {
    background-color: #e6f1fc;
    border-right: 4px solid #409eff;
    color: #409eff;
  }
  .highlight .icon-gengduo {
    color: #409eff;
  }
}

.rightContent {
  overflow: hidden;
  background: transparent;
  border: 0;
  margin-left: 0;
  padding: 0;
  margin-top: 0;

  .scollList {
    height: 100% !important;
    padding: 10px;
    color: #333;
    > div {
      display: inline-block;
    }
    .card {
      position: relative;
      margin: 0 9px 20px 9px;
      // box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13),
      //   0 2px 4px rgba(0, 0, 0, 0.12);
      border: 1px solid #e4e7ed;
      background: #fff;
      padding: 5px;
      width: 160px;
      font-size: 12px;
    }
    .horn .lt {
      left: 2px;
      top: 2px;
    }
    .horn .rt {
      right: 2px;
      top: 2px;
    }
    .horn .rb {
      right: 2px;
      bottom: 2px;
    }
    .horn .lb {
      left: 2px;
      bottom: 2px;
    }
    .imgWrapper {
      height: 150px;
      width: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        // width: 150px;
        // height: 150px;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .detailWrapper {
      display: flex;
      margin-top: 10px;
      margin-bottom: 10px;
      width: 100%;
      padding-left: 4px;
      justify-content: flex-start;
      .name {
        width: 60%;
        color: #606266;
        font-size: 13px;
      }
      .commonRow {
        font-size: 12px;
        margin-bottom: 2px;
        > .label {
          width: 70px;
        }
      }
    }
    .buttonWrapper {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: flex-end;
      .btnClass {
        background: #f5f9ff;
        padding-left: 5px;
        padding-right: 5px;
      }
      .btnClass:first-of-type {
        color: #6a7e92;
      }
    }
    .card-items {
      position: relative;
      padding: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
}
::v-deep {
  .el-tree {
    height: 100% !important;
  }
  .el-tree-node__content {
    // padding-left: 8px !important;
  }
  .el-tree-node__expand-icon {
    display: none;
  }
}
.moreWord {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
