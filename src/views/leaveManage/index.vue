<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <ActionHeader :initFormHeader="initForm" :filterStatus="true" @fetchData="fetchData" ref="actionHeader" :filterForm="filterForm" :total="page.total" :moreStatus="false" :btnStatus="0">
                <div slot="houseNum">
                  <div class="word-filter">
                    <span class="filter-name">姓&emsp;&emsp;名:</span>
                    <el-input clearable placeholder="请输入需要查找的姓名" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.name" size="small"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">学&emsp;&emsp;号:</span>
                    <el-input clearable placeholder="请输入需要查找的学号" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.studentNo" size="small"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">班&emsp;&emsp;级:</span>
                    <el-input clearable placeholder="请输入需要查找的班级" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.className" size="small"></el-input>
                  </div>

                  <div class="word-filter">
                    <span class="filter-name">请假类型:</span>
                    <el-select v-model="filterForm.type" placeholder="请选择" class="select-class input-filter" size="small">
                      <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
              </ActionHeader>
            </el-col>
          </el-row>
          <el-table :data="list_data" stripe border highlight-current-row v-loading="showLoading" @selection-change="handleSelectionChange" @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange" @sort-change="sortChange">
            <el-table-column type="index" width="60" align="center" class="indexNum" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名"></el-table-column>
            <el-table-column width="100" align="center" label="人脸图像">
              <template slot-scope="scope">
                <img v-if="scope.row.face" style="margin-top: 3px" class="capture-img" :src="scope.row.face" @mouseout="twoImg.visible = false" @mouseover="showImg(scope.row.face)" />
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="studentNo" align="center" label="学号"></el-table-column>
            <el-table-column prop="className" align="center" label="班级"></el-table-column>
            <el-table-column prop="type" align="center" label="请假类型"></el-table-column>
            <el-table-column prop="content" align="center" :show-overflow-tooltip="true" label="事由"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="startTime" align="center" label="开始时间"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="endTime" align="center" label="结束时间"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="proposer" align="center" label="申请人"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="applicationTime" align="center" label="申请时间"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="approver" align="center" label="审批人"></el-table-column>
            <el-table-column prop="status" align="center" label="审批状态">
              <template slot-scope="scope">
                <span v-if='scope.row.status === 1' style="color:#FF5449">未通过</span>
                <span v-else-if='scope.row.status === 0' style="color:#6DCB9F">通过</span>
                <span v-else style="color:#FFAA05">待审批</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="approvalTime" align="center" label="审批时间"></el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" :current-page="page.page" :page-size="page.limit" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    TwoImg,
  },
})
export default class accountManage extends Vue {
  config: any = config;
  env: string = process.env.NODE_ENV;
  initForm: object = {
    url: config.v1 + "/admin/leave-record",
    method: "get",
  };
  filterForm: object = {
    name: "",
    studentNo: "",
    className: "",
    type: "",
  };
  twoImg: any = {
    visible: false,
    leftTitle: "",
    leftImg: "",
  };
  typeOptions: Array<object> = [
    { value: "病假", label: "病假" },
    { value: "事假", label: "事假" },
    { value: "其他", label: "其他" },
  ];
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order == "descending";
    this["fetchData"](this.initForm);
  }
  showImg(face) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = face;
    this.twoImg.leftTitle = "抓拍人脸";
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table td {
    padding: 12px 0px !important;
  }
}
.property-left {
  .content {
    height: 400px;
  }
  .property-device {
    width: 100%;
    height: 70vh;
    text-align: left;
    background: #fff;
    border: 1px solid #ebeef5;
    overflow-y: auto;
    overflow-x: auto;
    box-shadow: 0px 0px 8px 0px lightgrey;
    padding-bottom: 10px;
  }
}
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
// .rightContent {
//   flex: 1;
//   box-shadow: 0px 6px 5px 0px lightgray;
//   position: relative;
// }
.float {
  width: 250px;
  float: left;
  position: relative;
  z-index: 99;
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
.singleInfo {
  width: 40%;
  height: 40px;
  padding: 0px 10px;
  text-align: left;
  line-height: 40px;
  float: left;
  &:nth-child(2),
  &:nth-child(3),
  &:nth-child(5),
  &:nth-child(8),
  &:nth-child(9),
  &:nth-child(6) {
    width: 30%;
  }
}
.reg-face {
  padding: 0 10px;
}
.reg-face img {
  width: 100px;
  height: 100px;
}
.cursor {
  cursor: pointer;
}
.texthidden {
  display: inline-block;
  width: 89px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 30px;
}
.flex {
  display: flex;
  align-items: center;
  align-items: baseline;
}
.top-info {
  align-items: baseline;
}
.pswd {
  /deep/ .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>
