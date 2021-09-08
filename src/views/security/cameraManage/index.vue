<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
          :moreStatus="false"
          :pageStatus="true"
          :police="true"
          @clearFilter="clearFilterForm"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">名&nbsp;&nbsp;&nbsp;称:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的名称"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model.trim="filterForm.name"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">IP&nbsp;地&nbsp;址:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的IP地址"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.ipAddr"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">状&nbsp;&nbsp;&nbsp;态:</span>&nbsp;&nbsp;
              <el-select
                v-model="filterForm.status"
                placeholder="请选择"
                class="select-class"
                size="small"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            height="65vh"
            :data="tableData"
            stripe
            border
            highlight-current-row
            v-loading="tableLoading"
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column
              v-if="globalUpdateStatus"
              type="selection"
              width="50"
            ></el-table-column>

            <el-table-column
              type="index"
              align="center"
              class="indexNum"
              label="序号"
              width="50"
            >
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown
                    trigger="click"
                    placement="bottom-start"
                    @command="commandClick"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="点击操作"
                      placement="top"
                    >
                      <i v-show="scope.row.showMenu" class="iconfont icon-gengduo"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <div @click="update(scope.row)">
                        <el-dropdown-item command="update">修改</el-dropdown-item>
                      </div>
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length>1 ? "批量删除" : "删除" }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column
              prop="ipAddr"
              label="IP地址"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column label="状态" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.status == 1">在线</span>
                  <span v-if="scope.row.status == 2">离线</span>
                  <span v-if="scope.row.status == 3">故障</span>
                  <span v-if="scope.row.status == 4">用户名或密码错误</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="addr"
              label="详细地址"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <!-- <el-table-column
              prop="createUser"
              label="创建人"
              show-overflow-tooltip
              align="center"
            ></el-table-column> -->
            <el-table-column
              prop="createTime"
              label="添加时间"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column label="操作" width="140" align="center">
              <template slot-scope="scope">
                <div class="table-btn">
                  <el-button
                    type="text"
                    size="mini"
                    @click="viewVideo(scope.row)"
                    v-if="scope.row.status == 1"
                    >实况</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          :page-size="page.limit"
          @current-change="pageChange"
          style="margin-top: 10px"
          background
          layout="prev, pager, next"
          :total="tableTotal"
        ></el-pagination>
      </el-col>
    </el-row>
    <AddOrUpdate
      :title="addOrUpdate.title"
      :visible="dialogCreate"
      :update="addOrUpdate.form"
      @close="close"
      @refresh="getCameraList"
    ></AddOrUpdate>
    <el-dialog :title="'实况：'+currentPlayCamera.name" :visible.sync="dialogVisible" :before-close="handleClose">
      <Reflv
        data-name="single"
        :style="{ width: '100%', height: height_w - 480 + 'px' }"
        :name="'single'"
        :height="height_w - 480"
        :url="reflvUrl"
        :cameraId='currentPlayCamera.id'
        ref="reflv"
        :isPc="isPc"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { getCamera,play } from "@/api/police";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const AddOrUpdate = () => import("./components/AddOrUpdate.vue");
const Reflv = () => import("../realTimeMonitor/components/Reflv.vue");
@Component({
  mixins: [mixin],
  components: { ActionHeader, AddOrUpdate,Reflv },
})
export default class extends Vue {
  dialogVisible: boolean = false;
  isPc: boolean = true;
  config: any = config;
  tableTotal: number = 0;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  tableData: Array<object> = [];
  reflvUrl:string='';
  statusOptions: Array<object> = [
    {
      value: "1",
      label: "在线",
    },
    {
      value: "2",
      label: "离线",
    },
    {
      value: "3",
      label: "故障",
    },
    {
      value: "4",
      label: "用户名或密码错误",
    },
  ];
  filterForm: object = {
    name: "",
    ipAddr: "",
    status: "",
  };
  deleteForm: object = {
    url: config.v4 + "/csia/camera",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的摄像机, 删除后摄像机将不存在,请谨慎操作!",
  };
  tableLoading: boolean = false;
  addOrUpdate: any = {
    title: "添加",
    form: {},
  };
  pageSize: any = 10;
  currentPlayCamera:object={}
  created() {
    this["isPolice"] = true;
    this.getCameraList();
    this.check();
  }
  handleClose(){
    this.dialogVisible=false;
    this.reflvUrl = '';
    this.$refs.reflv['flv_destroy']();
    // this.$emit('flv_destroy')
  }
  fetchData(option: any) {
    this.pageSize = option.params.limit;
     this.page["page"]=option.params.page;
    this.filterForm["name"] = option.params.name;
    this.filterForm["ipAddr"] = option.params.ipAddr;
    this.filterForm["status"] = option.params.status;
    this.getCameraList();
  }
  // 摄像机列表
  getCameraList() {
    let param = {
      ...this.filterForm,
      page: this.page["page"],
      pageSize: this.pageSize,
    };
    this.tableLoading = true;
    getCamera(param)
      .then((res) => {
        this.tableData = res.data.data.records;
        this.tableLoading = false;
        this["tableTotal"] = res.data.data.total;
        this.page["total"] = res.data.data.total;
      })
      .catch((err) => {
        this.tableLoading = false;
      });
  }
  clearFilterForm() {
    this.filterForm = {
      name: "",
      ipAddr: "",
      status: "",
    };
    this.page["page"] = 1;
    this.getCameraList();
  }
  //修改
  update(row) {
    this.addOrUpdate.title = "修改";
    this.addOrUpdate.form = { ...row };
    this["dialogCreate"] = true;
  }
  close() {
    this["dialogCreate"] = false;
    this.addOrUpdate.title = "添加";
  }
  // 查看实况
  viewVideo(data) {
    debugger;
    this.currentPlayCamera = data;
    this.dialogVisible=true;
    this.playReflv(data.id);
  }
   //播放
  playReflv(id) {
    play({ id }).then((res) => {
      this.reflvUrl = res.data.data;
      this.$nextTick(() => {
        this.$refs.reflv["play"]();
      });
    });
  }
  check() {
    var os = (function () {
      var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet =
          /(?:iPad|PlayBook)/.test(ua) ||
          (isAndroid && !/(?:Mobile)/.test(ua)) ||
          (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
      };
    })();
    if (os.isTablet) {
      // 平板
      this.isPc = false;
    } else if (os.isPc) {
      // pc
      this.isPc = true;
    }
  }
}
</script>

<style></style>
