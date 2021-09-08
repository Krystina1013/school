<template>
  <div class="app-container">
    <div class="rightContent">
      <div class="header-handle">
        <action-header :initFormHeader="initForm" ref="actionHeader" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false" :capture="true" :btnStatus="0">
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">操作人:</span>
              <el-input clearable placeholder="请输入需要查找的操作人" @keyup.enter.native="emitFetchData" maxlength="30" class="input-filter" v-model="filterForm.createName" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">操作日期: </span>
              <el-date-picker v-model="filterForm.operateDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="false" size="mini" class="input-filter" style="width: 252px">
              </el-date-picker>
            </div>
          </div>
        </action-header>
      </div>
      <div class="layout-main">
        <el-table :data="list_data" border style="width: 100%" stripe highlight-current-row v-loading="showLoading">
          <el-table-column type="index" align="center" class="indexNum" label="序号" width="50">
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" align="center" prop="createUser" label="操作人">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="causeMessage" label="导入类型">
            <template slot-scope="{ row }">
              <span v-if="row.type == 'ROOM_STUDENT'">宿舍学生导入</span>
              <span v-else-if="row.type == 'STUDENT'">学生导入</span>
              <span v-else-if="row.type == 'TEACHER'">老师导入</span>
              <span v-else-if="row.type == 'PHONE_FACE'">老师人脸导入</span>
              <span v-else-if="row.type == 'STUDENT_NO_FACE'">学生人脸导入</span>
              <span v-else-if="row.type == 'WORKER'">职工导入</span>
              <span v-else-if="row.type == 'WORKER_FACE'"
                >职工人脸导入</span
              >
            </template>
          </el-table-column>

          <el-table-column align="center" :show-overflow-tooltip="true" prop="createTime" label="导入时间">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="状态">
            <template slot-scope="{ row }">
              <span v-if="row.status == 'FAILS'" style="color:#FF6058" @click="openDetail(row)" class="canPoint">失败</span>
              <span v-else-if="row.status == 'CREATE'" style="color:#E6A23C">导入中</span>
              <span v-else-if="row.status == 'SUCCESS'" style="color:#409EFF">成功</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="page.page" :page-size="page.limit" layout="prev, pager, next" :total="page.total" @current-change="pageChange" style="margin-top: 10px">
        </el-pagination>
      </div>
    </div>

    <el-dialog class="newDialog" title="批量导入" :visible.sync="dialogVisible" width="540px" :before-close="handleClose">
      <!-- 失败 -->
      <div v-if="rowLine.status == 'FAILS'" class="fail_singal">
        <p>文件中{{ failTotal }}条数据不符合导入要求，请检查修正后，重新全量导入。</p>
        <el-button style="margin:16px 0" type="primary" @click="openExport(rowLine.type)">+ 重新导入</el-button>

        <el-table :data="errData" border stripe height="300px" size="medium" :header-cell-style="{background:'#f5f5f5',color:'#606266', fontWeight: '500'}">
          <el-table-column v-if="
              rowLine.type == 'PHONE_FACE' || rowLine.type == 'STUDENT_NO_FACE'
            " align="center" label="文件名称" width="214">
            <template slot-scope="{ row }">{{ row.marker }}</template>
          </el-table-column>
          <el-table-column v-else align="center" label="位置" width="200">
            <template slot-scope="{ row }">第{{ row.index }}行</template>
          </el-table-column>
          {{ rowLine.type }}
          <el-table-column align="center" prop="caseFail" label="失败原因" :show-overflow-tooltip="true" v-if="
              rowLine.type == 'PHONE_FACE' || rowLine.type == 'STUDENT_NO_FACE'
            ">
            <template slot-scope="{ row }">
              <span>{{ row.error }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="caseFail" label="失败原因" :show-overflow-tooltip="true" v-else>
            <template slot-scope="{ row }">
              <span v-for="(item, index) in row.caseFail" :key="'errMsg' + index">{{ item }},</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 导入中 -->
      <p v-else-if="rowLine.status == 'CREATE'">数据导入中，请耐心等待！</p>
      <!-- 成功 -->
      <p v-else-if="rowLine.status == 'SUCCESS'">导入成功</p>
    </el-dialog>
    <ExportIn :uploadUrl="uploadUrl" :TmplateName="templateName" :downTemplateUrl="downTemplateUrl" @closeVisible="visible = false" @successUpload="uploadSuccess" :visible.sync="visible" />
    <!-- 导入人脸 -->
    <ExportImg :uploadUrl="importFaceUrl" :isStudent="isStudent" @closeVisible="closeFaceVisible" @successUpload="uploadSuccess" :visible.sync="faceVisible" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ExportImg = () => import("@/components/exportImg/index.vue");
import config from "@/api/config";
import mixin from "@/config/minxins";
import { format } from "date-fns";
const ExportIn = () => import("@/components/exportIn/index.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ExportIn,
    ExportImg,
  },
  filters: {},
})
export default class extends Vue {
  config: any = config;
  isUpdate: boolean = false;
  faceVisible: boolean = false;
  btnLoading: boolean = false;
  dialogVisible: boolean = false;
  captureImg: string = "";
  initForm: any = {
    url: config.v1 + "/admin/import-record/importRecord",
    method: "get",
  };
  filterForm: any = {
    operateDate: "",
    createName: "",
  };
  isStudent: boolean = false;
  total: number = 0;
  tableData: Array<object> = [];
  showLoading: boolean = false;
  errData: any = [];
  rowLine: any = {};
  visible: boolean = false;
  uploadUrl: string = "";
  downTemplateUrl: string = "";
  failTotal: any = 0;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  importFaceUrl: string = ""; //人脸
  templateName: string = '';
  created() {
    // const date = new Date();
    // this.filterForm.operateDate = ''format(date, "yyyy-MM-dd")'';
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    let that = this;
  }
  closeFaceVisible() {
    this.faceVisible = false;
    this.isStudent = false;
    this.importFaceUrl = "";
  }
  showFaceExportIn() {
    this.faceVisible = true;
  }
  // 打开导入弹窗
  openExport(type) {
    if (type === "STUDENT") {
      this.uploadUrl = config.v1 + "/admin/student/import";
      this.downTemplateUrl = config.v1 + "/admin/student/model";
      this.importFaceUrl = "";
      this.templateName = '学生导入模板';
    }
    if (type === "TEACHER") {
      this.uploadUrl = config.v1 + "/admin/teacher/import";
      this.downTemplateUrl = config.v1 + "/admin/teacher/model";
      this.importFaceUrl = ""; 
      this.templateName = '教师导入模板';
    }
    if (type === "WORKER") {
      this.uploadUrl = config.v1 + '/admin/worker/import';
      this.downTemplateUrl = config.v1 + "/admin/worker/model";
      this.importFaceUrl = ""; 
      this.templateName = '职工导入模板';
    }
    if (type === "WORKER_FACE") {
      this.isStudent = false;
      this.uploadUrl = "";
      this.importFaceUrl = config.v1 + "/admin/scence-user/importWorkerFace";
    }
    if (type === "PHONE_FACE") { 
      //电话人脸导入
      this.isStudent = false;
      this.uploadUrl = "";
      this.importFaceUrl = config.v1 + "/admin/scence-user/importFace";
    }
    if (type === "STUDENT_NO_FACE") {
      // 学号人脸导入
      this.isStudent = true;
      this.uploadUrl = "";
      this.importFaceUrl = config.v1 + "/admin/scence-user/student/importFace";
    }
    if (this.uploadUrl) {
      this.visible = true;
      this.faceVisible = false;
    }
    if (this.importFaceUrl) {
      this.faceVisible = true;
      this.visible = false;
    }
    if (!this.importFaceUrl && !this.uploadUrl) {
      this.visible = false;
      this.faceVisible = false;
      this.$message.error("数据异常,请检查！");
    }
  }
  handleClose() {
    this.dialogVisible = false;
  }
  openDetail(row: any) {
    if (row.status == "FAILS") {
      this.errData = JSON.parse(row.failsJson);
      if (this.errData) {
        this.failTotal = this.errData.length;
      }
    }
    // if(row.type=="STUDENT"){
    //   this.uploadUrl = config.v1+'/admin/student/import';
    //   this.downTemplateUrl =  config.v1+'/admin/student/model';
    // }else if(row.type=="TEACHER"){
    //   this.uploadUrl = config.v1+'/admin/teacher/import';
    //   this.downTemplateUrl =  config.v1+'/admin/teacher/model';
    // }
    //  if(row.type === 'PHONE_FACE') { //电话人脸导入
    //   this.importUrl = '/admin/student/import'
    //   // this.importModelUrl = '/admin/student/model'
    // }
    // if(row.type === 'STUDENT_NO_FACE') { // 学号人脸导入
    //   this.importUrl = '/admin/student/import'
    //   this.importModelUrl = '/admin/student/model'
    // }
    this.rowLine = row;
    this.dialogVisible = true;
  }
  uploadSuccess() {
    this.fetchData(this.initForm);
    this.dialogVisible = false;
    this.faceVisible = false;
  }
}
</script>

<style lang="scss">
.fail_singal {
  .el-button {
    width: 111px;
    height: 34px;
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
.newDialog {
  font-size: 14px;
  font-family: Noto Sans SC, Noto Sans SC-Regular;
  font-weight: 400;
  color: #606266;
  line-height: 18px;
}
::v-deep {
  .el-table th,
  .el-table td {
    padding: 12px 0px !important;
  }
}
.canPoint {
  cursor: pointer;
}
</style>