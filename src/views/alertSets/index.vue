<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <ActionHeader :initFormHeader="initForm" :filterForm='filterForm' :filterStatus="true" @fetchData="fetchData" ref="actionHeader" :total="page.total" :btnStatus='0' :moreStatus="false">
                <el-button slot="delBtn" type="primary" size="small" icon="el-icon-plus" @click="openCreate('1')">发布通知</el-button>
                <div slot="houseNum">
                  <div class="word-filter">
                    <span class="filter-name">标&emsp;&emsp;题:</span>
                    <el-input clearable placeholder="请输入需要查找的标题" maxlength="60" class="input-filter" v-model.trim="filterForm.title" size="small"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">发布对象:</span>
                    <div class="flex input-filter" style="width: 100%;height: 32px;align-items: center;">
                      <el-select v-model="filterForm.type" placeholder="请选择" size="mini" style="width:100%">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                          {{item.label}}
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">发布时间:</span>
                    <el-date-picker v-model="filterForm.targetTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  </div>

                  <div class="word-filter">
                    <span class="filter-name" style="line-height: 32px;">发布状态:</span>
                    <div class="flex input-filter" style="width: 100%;height: 32px;align-items: center;">
                      <el-radio-group v-model="filterForm.status">
                        <el-radio label="0">草稿</el-radio>
                        <el-radio label="1">已发布</el-radio>
                        <el-radio label="2">定时发布</el-radio>
                      </el-radio-group>

                    </div>
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
            <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="标题">
              <template slot-scope="scope">
                <el-button @click="showTitleDetails(scope.row)" :disabled='detailLoading' type="text">
                  {{scope.row.title}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="type" align="center" label="发布对象">
              <template slot-scope="scope">
                <span>
                  {{scope.row.type==0?"教师":scope.row.type==1?"职工":scope.row.type==2?"家长":scope.row.type==3?'自定义':'全部'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="targetTime" align="center" label="发布时间"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="status" align="center" label="发布状态">
              <template slot-scope="scope">
                <span>
                  {{scope.row.status==0?"草稿":scope.row.status==1?"已发布":'定时发布'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="issuer" align="center" label="发布人"></el-table-column>
            <el-table-column label="操作" width="120" align="center" v-if="globalUpdateStatus">
              <template slot-scope="scope">
                <div v-if="scope.row.status!=1">
                  <el-button type="text" size="mini" @click="fabuHandle(scope.row)" :loading='fabuloading'>发布</el-button>
                  <el-button type="text" style="margin-left:0" size="mini" @click="openCreate('2',scope.row)">修改</el-button>
                  <el-button type="text" style="margin-left:0" size="mini" @click="del(scope.row)">删除</el-button>
                </div>
                <div v-else>
                  <el-button type="text" size="mini" @click="revocation(scope.row)">撤回</el-button>
                  <el-button type="text" style="margin-left:0" size="mini" @click="viewDetail(scope.row)">接收详情</el-button>
                </div>

              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" :current-page="page.page" :page-size="page.limit" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 查看通知内容 -->
    <el-dialog top="10vh" class="rich-text-con" :close-on-click-modal="false" width="1000px" :title="detailTitle" :visible.sync="titleDetailShow">
      <div class="rich-text" v-html="detailContent">
        {{ detailContent }}
      </div>
    </el-dialog>

    <el-dialog title="接收详情" :visible="viewDetailvisible" width="760px" top='50px' :before-close="closeDialogPerson" :close-on-click-modal="false">
      <div class="flex">
        <div class="person-height">
          <div class="tabs-group" style="margin-bottom:10px;">
            <el-radio-group v-model="activeName" @change="changeRadio">
              <el-radio-button label="1">教师</el-radio-button>
              <el-radio-button label="2">职工</el-radio-button>
              <el-radio-button label="3">家长</el-radio-button>
            </el-radio-group>
          </div>
          <div class="filter-con">
            <div class="word-filter">
              <el-input class="input-filter" v-if="activeName === '1'" maxlength="30" placeholder="请输入姓名或者电话号码搜索" v-model.trim="filterForm1.normal" @keyup.enter.native="queryData(1)" size="small"></el-input>
              <el-input class="input-filter" v-if="activeName === '2'" maxlength="30" placeholder="请输入姓名或者电话号码搜索" v-model.trim="filterForm2.normal" @keyup.enter.native="queryData(2)" size="small"></el-input>
              <el-input class="input-filter" v-if="activeName === '3'" maxlength="30" placeholder="请输入姓名或者电话号码搜索" v-model.trim="filterForm3.normal" @keyup.enter.native="queryData(3)" size="small"></el-input>
            </div>
            <div style="margin-left:20px;">
              <el-button size="small" type="primary" @click="queryData(activeName)">查询</el-button>
            </div>
          </div>
          <el-row v-show="activeName === '1'">
            <div class="table-con">
              <el-table ref="table1" tripe border highlight-current-row :height="450" v-loading='tab1Loading' :data="table1Data">
                <el-table-column type="index" align="center" width="60" label="序号"></el-table-column>
                <el-table-column prop="name" align="center" label="教师姓名"></el-table-column>
                <el-table-column prop="phone" align="center" label="电话"></el-table-column>
                <el-table-column prop="groupName" align="center" label="任课组"></el-table-column>
                <el-table-column prop="isRead" align="center" width="100" label="阅读状态">
                  <template slot-scope="scope">
                    <span :style="{'color':scope.row.isRead === '1' ? '#67c23a' : '#f56c6c'}">
                      <!-- 1是关注，0是未关注 -->
                      {{ scope.row.isRead === "1" ? "已读" : "未读" }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                  pagination1.pageSize = $event;
                  getTableData1();
                " @current-change="
                  pagination1.page = $event;
                  getTableData1();
                " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination1.pageSize" layout="prev, pager, next, jumper, total, sizes" :total="pagination1.total"></el-pagination>
            </div>
          </el-row>
          <el-row v-show="activeName === '2'">
            <div class="table-con">
              <el-table ref="table2" tripe border highlight-current-row :height="450" v-loading='tab2Loading' :data="table2Data">
                <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
                <el-table-column prop="name" align="center" label="职工姓名"></el-table-column>
                <el-table-column prop="phone" align="center" label="电话"></el-table-column>
                <el-table-column prop="groupName" align="center" label="分组"></el-table-column>
                <el-table-column prop="isRead" align="center" width="100" label="阅读状态">
                  <template slot-scope="scope">
                    <span :style="{'color':scope.row.isRead === '1' ? '#67c23a' : '#f56c6c'}">
                      <!-- 1是关注，0是未关注 -->
                      {{ scope.row.isRead === "1" ? "已读" : "未读" }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                  pagination2.pageSize = $event;
                  getTableData2();
                " @current-change="
                  pagination2.page = $event;
                  getTableData2();
                " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination2.pageSize" layout="prev, pager, next, jumper, total, sizes" :total="pagination2.total"></el-pagination>
            </div>
          </el-row>
          <el-row v-show="activeName === '3'">
            <div class="table-con">
              <el-table ref="table3" tripe border highlight-current-row :height="450" v-loading='tab3Loading' :data="table3Data">
                <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
                <el-table-column prop="name" align="center" label="家长姓名"></el-table-column>
                <el-table-column prop="phone" align="center" width="120" label="电话"></el-table-column>
                <el-table-column prop="stuName" align="center" label="学生姓名"></el-table-column>
                <el-table-column prop="stuNo" align="center" label="学号"></el-table-column>
                <el-table-column prop="className" align="center" width="140" label="班级">
                </el-table-column>
                <el-table-column prop="studentNo" align="center" width="100" label="阅读状态">
                  <template slot-scope="scope">
                    <span :style="{'color':scope.row.isRead === '1' ? '#67c23a' : '#f56c6c'}">
                      <!-- 1是关注，0是未关注 -->
                      {{ scope.row.isRead === "1" ? "已读" : "未读" }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                  pagination3.pageSize = $event;
                  getTableData3();
                " @current-change="
                  pagination3.page = $event;
                  getTableData3();
                " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination3.pageSize" layout="prev, pager, next, jumper, total, sizes" :total="pagination3.total"></el-pagination>
            </div>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogPerson">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";
import _axios from "../../plugins/axios";
import config from "@/api/config";
import mixin from "@/config/minxins";
import {
  PutMessage,
  DelMessage,
  infoMessage,
  getmessagePage,
  getMessage,
} from "@/api/alertSets";
const ActionHeader = () => import("@/components/ActionHeader.vue");
import { message } from "@/utils";
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
  },
})
export default class accountManage extends Vue {
  dialogCreate: boolean = false;
  value1: string = "";
  config: any = config;
  env: string = process.env.NODE_ENV;
  titleDetailShow: boolean = false;
  isUpdate: boolean = false;
  fabuloading: boolean = false;
  detailLoading: boolean = false; //详情loading
  detailContent: string = "";
  detailTitle: string = "";
  initForm: object = {
    url: config.v1 + "/admin/message/page",
    method: "get",
  };
  filterForm: object = {
    title: "",
    type: "",
    status: "",
    targetTime: "",
  };
  timeForm: object = {};
  // 查看详情相关
  table1Data: any = [];
  table2Data: any = [];
  table3Data: any = [];
  tab1Loading: boolean = false;
  tab2Loading: boolean = false;
  tab3Loading: boolean = false;
  typeOptions: any = [
    { label: "教师", value: 0 },
    { label: "职工", value: 1 },
    { label: "家长", value: 2 },
    { label: "自定义", value: 3 },
  ];
  activeName: string = "1";
  viewDetailvisible: boolean = false;
  viewDetailSerialNo: string = "";
  option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "访问来源",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "40",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "搜索引擎" },
          { value: 735, name: "直接访问" },
          { value: 580, name: "邮件营销" },
          { value: 484, name: "联盟广告" },
          { value: 300, name: "视频广告" },
        ],
      },
    ],
  };
  filterForm1: object = {
    normal: "",
  };
  filterForm2: object = {
    normal: "",
  };
  filterForm3: object = {
    normal: "",
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

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    );
  }
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order == "descending";
    this["fetchData"](this.initForm);
  }
  showTitleDetails(row) {
    this.detailLoading = true;
    getMessage({ id: row.id })
      .then((res) => {
        this.detailLoading = false;
        this.titleDetailShow = true;
        if (res.data.code == 200) {
          // 成功
          let data = res.data.data;
          this.detailTitle = data.title;
          this.detailContent = data.content;
        }
      })
      .catch((err) => {
        this.detailLoading = false;
        this.titleDetailShow = false;
        this.$message.error(err.message);
      });
    // this.detailTitle = row.title;
    // this.detailContent = row.content;
  }
  openCreate(type, row) {
    window.sessionStorage.setItem("type", type);
    if (row) {
      window.sessionStorage.setItem("issueId", row.id);
      this.$router.push("/alertSets/issue");
    } else {
      this.$router.push("/alertSets/issue");
    }

    //
  }
  // 清空筛选
  clearFilterForm() {
    this.filterForm = {
      title: "",
      type: "",
      status: "",
      targetTime: "",
    };
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    );
  }
  viewDetail(item) {
    this.viewDetailvisible = true;
    this.viewDetailSerialNo = item.serialNo;
    this.getTableData1();
  }
  // 改变标签
  changeRadio() {
    if (this.activeName === "1") {
      this.filterForm1["normal"] = "";
      this.getTableData1();
    } else if (this.activeName === "2") {
      this.filterForm2["normal"] = "";
      this.getTableData2();
    } else {
      this.filterForm3["normal"] = "";
      this.getTableData3();
    }
  }
  async getTableData1() {
    let params = {
      limit: this.pagination1["pageSize"],
      page: this.pagination1["page"],
      normal: this.filterForm1["normal"],
      serialNo: this.viewDetailSerialNo,
      type: "0",
    };
    this.tab1Loading = true;
    try {
      let { data } = await infoMessage(params);
      this.tab1Loading = false;
      this.table1Data = data.data.records;
      this.pagination1["total"] = data.data.total;
    } catch (error) {
      this.tab1Loading = false;
    }
  }
  async getTableData2() {
    let params = {
      limit: this.pagination2["pageSize"],
      page: this.pagination2["page"],
      normal: this.filterForm2["normal"],
      serialNo: this.viewDetailSerialNo,
      type: "1",
    };
    this.tab2Loading = true;
    try {
      let { data } = await infoMessage(params);
      this.tab2Loading = false;
      this.table2Data = data.data.records;
      this.pagination2["total"] = data.data.total;
    } catch (error) {
      this.tab2Loading = false;
    }
  }
  async getTableData3() {
    let params = {
      limit: this.pagination3["pageSize"],
      page: this.pagination3["page"],
      normal: this.filterForm3["normal"],
      serialNo: this.viewDetailSerialNo,
      type: "2",
    };
    this.tab3Loading = true;
    try {
      let { data } = await infoMessage(params);
      this.tab3Loading = false;
      this.table3Data = data.data.records;
      this.pagination3["total"] = data.data.total;
    } catch (error) {
      this.tab3Loading = false;
    }
  }
  // 关闭弹窗
  closeDialogPerson() {
    this.viewDetailvisible = false;
    this.activeName = "1";
    this.filterForm1["normal"] = "";
    this.filterForm2["normal"] = "";
    this.filterForm3["normal"] = "";
  }
  queryData(type) {
    if (type == "1") {
      this.getTableData1();
    } else if (type == "2") {
      this.getTableData2();
    } else {
      this.getTableData3();
    }
  }
  revocation(row) {
    this.$confirm(`是否撤销此发布？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        PutMessage({ id: row.id, status: "0", serialNo: row.serialNo })
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("撤回成功！");
              this["fetchData"](this.initForm);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      })
      .catch(() => {
        this.$message.error("已取消撤回");
      });
  }
  fabuHandle(row) {
    // 发布
    this.$confirm(`是否发布此消息？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        // PutMessage({
        //   id: row.id,
        //   type: row.type,
        //   status: "1",
        //   serialNo: row.serialNo,
        //   ids: row.ids,
        // })
        let params = { ...row };
        params["status"] = "1",
        params["targetTime"] = "";
        PutMessage(params)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("发布成功！");
              this["fetchData"](this.initForm);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      })
      .catch(() => {
        this.$message.error("已取消发布");
      });
  }
  del(row) {
    // 删除
    this.$confirm(`是否删除此消息？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        DelMessage(row.serialNo)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
              this["fetchData"](this.initForm);
              //   debugger;
              //  this['fetchData'](this.filterForm)
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      })
      .catch(() => {
        this.$message.error("已取消删除");
      });
  }
}
</script>

<style lang="scss">
.rich-text-con {
  .el-dialog__body img {
    max-width: 920px !important;
  }
}
</style>

<style lang="scss" scoped>
::v-deep {
  .el-table td {
    padding: 5px 0px !important;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
}
.person-height {
  width: 100%;
}
.filter-con {
  display: flex;
  justify-content: flex-end;
  .word-filter {
    width: 320px;
  }
  .filter-btn {
    height: 32px;
    margin-left: 20px;
  }
}
.table-con {
  width: 100%;
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
  .el-tabs__nav-wrap::after {
    background: transparent;
  }
  .el-tabs__header {
    background: #fff;
    padding-left: 22px;
  }
  .el-radio {
    margin-right: 15px;
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
.rich-text {
  overflow: auto;
}
.rich-text-con {
  /deep/.el-dialog__header {
    text-align: center;
    width: 960px;
    border: 0;
  }
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #e4e7ed;
}
</style>
