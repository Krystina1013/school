<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" :min-percent="10" :default-percent="16">
        <template slot="paneL">
          <div class="leftContent">
            <div :class="['treeHeader', highlightStatus ? '' : 'highlight']" @click="handleNodeClick({ id: '' })"><span>所有</span><span class="no-read-icon" v-if="!!warningCount">{{warningCount}}</span>
            </div>
            <div class="bottom">
              <el-tree :data="TreeData" node-key="id" accordion :highlight-current="highlightStatus" :default-expand-all="false" :expand-on-click-node="false" @node-click="handleNodeClick" :props="defaultProps">
                <span slot-scope="{ node, data }" :class="[ 'custom-tree-node',currentTreeId == data.id ? 'highlight' : '']">
                  <span :title="`${data.name}`">
                    {{ node.label.length > 8 ? node.label.substring(0, 8) + "..." : node.label }}
                  </span>
                  <span class="no-read-icon" v-if="!!data.counts">{{data.counts}}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </template>
        <template slot="paneR">
          <el-row class="headerRow">
            <el-col :span="24">
              <action-header :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :total="pageTotal" :moreStatus="false" :btnStatus='0' :pageStatus="false" :police="true" :scroll='true' @clearFilter="clearFilter">
                <el-button slot="faceImport" type="primary" size="small" class="all-read" @click="changeAllStatus({}, 1)">全部标记已读</el-button>
                <div slot="houseNum">
                  <div class="word-filter">
                    <span class="filter-name">设备名称:</span>
                    <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model="filterForm.deviceName" placeholder="输入设备名称" size="small"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">是否处理:</span>
                    <el-select v-model="filterForm.isProcess" placeholder="请选择" class="input-filter" size="mini" style="width: 252px">
                      <el-option label="已处理" value="true" />
                      <el-option label="未处理" value="false" />
                    </el-select>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">是否已读:</span>
                    <el-select v-model="filterForm.isRead" placeholder="请选择" class="input-filter" size="mini" style="width: 252px">
                      <el-option label="已读" value="true" />
                      <el-option label="未读" value="false" />
                    </el-select>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">开始时间: </span>
                    <el-date-picker v-model="filterForm.startTime" @change="startChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :picker-options="pickerOptions" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">结束时间: </span>
                    <el-date-picker v-model="filterForm.endTime" @change="endChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :picker-options="endPickerOptions" :clearable="false" size="mini" style="width: 252px" class="input-filter">
                    </el-date-picker>
                  </div>
                </div>
              </action-header>
            </el-col>
          </el-row>
          <div class="rightContent" v-loading="showLoading">

            <ScrollList class="scollList" ref="scrollList" :height="height_w - 245" :canPullUp="canPullUp" @scrollToBottom="scrollToBottom" v-if="tableData.length > 0">
              <div class="list" :key="index" v-for="(item, index) in tableData" :class="item.status !=='WAITING'?'handled':''">
                <div class="card-items" :class="item.status !=='WAITING'?'handled':''">
                  <div class="alarm-type" :style="{color:item.status !=='WAITING' ?'#B1BDCA':'#ff6058'}"><i class="iconfont icon-yujing" :style="{color:item.status !=='WAITING'?'#B1BDCA':'#ff6058'}"></i>{{item.warnType | warnTypeFilter}}</div>
                  <div class="face" @click="openDetail(item)">
                    <img v-if="item.warnType !== 'DEVICE_DOWN'&& item.warnType !== 'VOICE_ALERT'" :src="item.image" alt />
                    <img v-if="item.warnType === 'DEVICE_DOWN'" src="../../../assets/default-sxj.png" alt />
                    <img v-if="item.warnType === 'VOICE_ALERT'" src="../../../assets/default-voice.png" alt />
                  </div>
                  <div class="flex justify-content-between align-items-center rowp" style="margin-top: 5px">
                    <div class="flex align-items-center">
                      <div class="icons icons_1">
                        <i class="iconfont icon-shexiangji2"></i>
                      </div>
                      <span v-if="item.deviceName" :title="item.deviceName" class="moreWord">{{ item.deviceName }}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="flex rowp">
                    <div class="icons icons_3">
                      <i class="iconfont icon-Vector"></i>
                    </div>
                    <span :title="item.warnTime" class="moreWord">{{ item.warnTime }}</span>
                  </div>
                </div>
                <div class="buttonWrapper">
                  <span class="handled" v-if="item.status === 'PROCESSED'">已处理</span>
                  <span class="detailBtn" v-else @click="openHandle(item)">处理预警</span>
                  <i class="line"></i>
                  <span class="detailBtn" @click="openDetail(item)">查看详情</span>
                </div>
              </div>
            </ScrollList>
            <div v-else class="empty"><img src="../../../assets/no-data-alarm.png" alt="">
              <span>暂无预警消息</span>
            </div>
          </div>

        </template>
      </split-pane>
    </div>
    <person-detail ref="personDetail" @close="handleClose" :visible="dialogDetail.dialogVisible" :form="dialogDetail.detail" :hidePersonInfo="true" :hideOriginalFace="true" :hideTrack="true" @closeAll="closeAll"></person-detail>

    <el-dialog title="" class="big-img-dialog" :visible.sync="bigImgVisible" :before-close="handleCloseBigImg">
      <img v-if="bigImgUrl" :src="bigImgUrl" alt="" class="big-img" />
    </el-dialog>

    <alarmDialog :visible="handleDialogVisible" :form="handleForm" @close="handleDialogVisible = false" @update="confirmHandled"></alarmDialog>
  </div>
</template>

<script lang='ts'>
import splitPane from "vue-splitpane";
import { Component, Vue, Watch } from "vue-property-decorator";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
const PersonDetail = () => import("./component/DialogPersonDetail.vue");
import alarmDialog from "./component/handleAlarmDialog.vue";

import config from "@/api/config";
import mixin from "@/config/minxins";
import { getToken } from "@/utils/auth";
import { getSceneId } from "@/utils/auth";
import { addMinutes, format } from "date-fns";
var _token = getToken(); // 要保证取到
var _scenceId = getSceneId();
import store from "@/store";
import {
  updateDeviceWarning,
  setRead,
  setAllRead,
  deviceWarnPage,
  unReadOfType,
  // handleWarn,
  // stopAlarm,
} from "@/api/dev";
import { uploadAlarmImage } from "@/api/user";
import {
  getBase64,
  getTimeByTimeStamp,
  getSimilarityDisplay,
} from "@/utils/index.js";
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ScrollList,
    splitPane,
    PersonDetail,
    alarmDialog,
  },
  computed: {
    warningCount() {
      return store.getters.warningCount;
    },
  },
  filters: {
    deviceTime(val: string) {
      val = val.split(".")[0];
      return val;
    },
    statusFilterType(status: string) {
      /** @description 状态显示过滤 */
      const data: any = {
        WAITING: "danger",
        PROCESSED: "success",
        PROCESSING: "",
        IGNORE: "info",
      };
      return data[status];
    },
    warnTypeFilter(type: string) {
      const data: any = {
        DEVICE_DOWN: "设备离线预警",
        STRANGER: "陌生人预警",
        NOT_BACK: "未归预警",
        LATE_BACK: "晚归预警",
        CARE_MAN: "关注人员预警",
        AREA: "区域预警",
        MOUSE: "厨房老鼠预警",
        CHEF_HAT: "厨师帽预警",
        // CHEF_CLOTHES: "厨师服预警",
        // FACE_MASK: "厨师口罩预警",
        VOICE_ALERT: "声音预警",
      };
      return data[type];
    },
  },
})
export default class extends Vue {
  config: any = config;
  isUpdate: boolean = false;
  btnLoading: boolean = false;
  dialogDetail: object = {
    dialogVisible: false,
    detail: {}, //详情
  };

  read: boolean = false;
  initForm: any = {
    url: config.v2 + "/admin/dev-device-warning/page",
    method: "get",
  };
  filterForm: any = {
    deviceName: "",
    isRead: "",
    endTime: "",
    startTime: "",
    isProcess: "",
  };
  TreeData: Array<Object> = [
    {
      id: "CARE_MAN",
      name: "关注人员预警",
      counts: "",
    },
    {
      id: "STRANGER",
      name: "陌生人预警",
      counts: "",
    },
    {
      id: "AREA",
      name: "区域预警",
      counts: "",
    },
    {
      id: "NOT_BACK",
      name: "未归预警",
      counts: "",
    },
    {
      id: "LATE_BACK",
      name: "晚归预警",
      counts: "",
    },
    {
      id: "MOUSE",
      name: "厨房老鼠预警",
      counts: "",
    },
    {
      id: "CHEF_HAT",
      name: "厨师帽预警",
      counts: "",
    },
    {
      id: "VOICE_ALERT",
      name: "声音预警",
      counts: "",
    },
    {
      id: "DEVICE_DOWN",
      name: "设备离线预警",
      counts: "",
    },
    {
      id: "zaihai_ALERT",
      name: "灾害预警",
      counts: "",
    },
  ];
  currentTreeId: string = "";
  alarmStatus: Array<Object> = [
    //类型筛选
    {
      label: "待处理",
      value: "WAITING",
    },
    {
      label: "处理中",
      value: "PROCESSING",
    },
    {
      label: "处理完成",
      value: "PROCESSED",
    },
    {
      label: "忽略",
      value: "IGNORE",
    },
  ];
  total: number = 0;
  tableData: Array<object> = [];
  bigImgVisible: boolean = false;
  bigImgUrl: string = "";
  showLoading: boolean = false;
  pickerOptions: any = {};
  endPickerOptions: any = {};
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  highlightStatus: boolean = false; // 高亮状态
  canPullUp: boolean = true;
  pageTotal: any = "";
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 40,
  };
  defaultProps: object = {
    children: "children",
    label: "name",
  };
  picList: Array<Object> = [];
  // handleForm
  handleForm: object = {
    id: "",
    handleContent: "",
    picList: [],
    warnSignId: "",
    alarmTime: "",
  };
  handleDialogVisible: boolean = false;
  myHeaders: object = {
    token: _token,
  };
  upPathPerson: any = `${config.v3}/admin/feed_back/upFile`;
  handleLoading: boolean = false;
  voiceVisibile: boolean = false; // 声音弹窗
  interVal: any = null;

  // timeStop: any = null;
  timeout: number = 10;
  path: string = "ws://139.196.14.225:8082/dev/warning/";
  // path: string = "ws://backend.lenfocus.com/dev/warning/";
  socket: any = null;
  created() {
    this.getUnchecedCount();
    this.unReadOfType();
    // 1分钟一次预警未读
    this.interVal = null;
    this.interVal = setInterval(() => {
      this.unReadOfType();
    }, 60 * 1000);
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    let that = this;
    this.pickerOptions = {
      disabledDate(time: any) {
        let end = new Date(that.filterForm.endTime).getTime();
        return time.getTime() > Date.now();
      },
    };
    this.endPickerOptions = {
      disabledDate(time: any) {
        let start = new Date(that.filterForm.startTime).getTime();
        return time.getTime() > Date.now();
      },
    };
  }
  mounted() {
    this.path = config.wsURL + _scenceId + "/" + _token;
    this.initSocket();
    const timer = setInterval(() => {
      this.socket.send("It`s a heart Beat");;
    },30000)
    this.$once('hook:beforeDestory',()=>{
      clearInterval(timer)
    })
  }
  // beforeDestroy() {
  //   clearInterval(this.timeStop);
  //   this.timeStop = null;
  // }
  destroyed() {
    this.interVal = null;
    this.socket.onclose = this.socketClose;
  }
  initSocket() {
    if (typeof WebSocket === "undefined") {
      this.$message.error("您的浏览器不支持socket");
    } else {
      // 实例化socket
      this.socket = new WebSocket(this.path);
      // 监听socket连接
      this.socket.onopen = this.openSocket;
      // 监听socket错误信息
      this.socket.onerror = this.errorSocket;
      // 监听socket消息
      this.socket.onmessage = this.getSocketMessage;
    }
  }
  openSocket() {
    console.log("socket连接成功");
    console.log(this.socket.readyState);
    this.socket.send("连接成功");
  }
  errorSocket() {
    console.log("socket连接错误");
  }
  getSocketMessage(data: any) {
    console.log(data);
    if (data) {
      let data1 = JSON.parse(data.data);
      if (this.currentTreeId) {
        if(data1.warnType && data1.warnType === this.currentTreeId){
          this.tableData.unshift(data1);
        }
      }else {
        if(data1.warnType) {
          this.tableData.unshift(data1);
        }
      }
      // if (data1.warnType && (this.currentTreeId && this.currentTreeId == data1.warnType)) {
      //   this.tableData.unshift(data1);
      // }
    }
  }
  sendSocket() {
    this.socket.send();
  }
  socketClose() {
    console.log("socket已经关闭");
  }
  // setTime() {
  //   if (this.timeout == 0) {
  //     this.timeout = 11;
  //     this.fetchData();
  //   }
  //   this.timeout--;
  // }
  // 播放音频
  audioClick(vedioUrl) {
    this.$refs["audioId"]["src"] = vedioUrl;
    this.$refs["audioId"]["play"]();
  }
  bigImgClick(item) {
    this.bigImgVisible = true;
    this.bigImgUrl = item;
  }

  handleClose() {
    this.dialogDetail["dialogVisible"] = false;
  }
  //修改状态
  handleReportStatus(val: any, row: any) {
    updateDeviceWarning({ status: val.value, id: row.id }).then((res) => {
      this.initForm["params"].page = 1;
      this.fetchData();
    });
  }
  // 修改预警全部状态
  changeAllStatus() {
    setAllRead({ type: this.currentTreeId }).then((res) => {
      if (res.data.code == 200) {
        this.$message.success("标记成功");
        this.initForm["params"].page = 1;
        this.unReadOfType();
        this.getUnchecedCount();
        this.fetchData();
      }
    });
  }
  //修改未读状态
  changeStatus(row: any, status: number, tip: any) {
    let arr: any = [];
    if (status) {
      this.tableData.map((item: any) => {
        if (item.status === "WAITING") {
          arr.push(item.id);
        }
      });
    } else {
      arr.push(row.id);
    }
    if (arr.length === 0) {
      return;
    }
    setRead(arr)
      .then((res) => {
        if (tip === "notip" && res.data.data === true) {
          row.status = "READ";
          this.unReadOfType();
          this.getUnchecedCount();
        }
      })
      .catch((err) => {
        row.status = "WAITING";
      });
  }
  openDetail(row: any) {
    this.dialogDetail["detail"] = { ...row };
    this.dialogDetail["dialogVisible"] = true;
    if (row.status === "WAITING") {
      this.changeStatus(row, 0, "notip");
    }
  }
  async getUnchecedCount() {
    /** @description 未读警报信息 */
    this.$store.dispatch("GET_WARNING");
  }
  fetchData() {
    this.page["limit"] = 20;
    this.page["page"] = this.initForm["params"].page;
    let param = {
      deviceName: this.filterForm.deviceName,
      isRead: this.filterForm.isRead,
      type: this.currentTreeId,
      isProcess: this.filterForm.isProcess,
      startTime: this.filterForm.startTime,
      includeUserInfo: true,
      endTime: this.filterForm.endTime,
      ...this.page,
    };
    this.showLoading = true;
    deviceWarnPage(param)
      .then((res1) => {
        const res = res1.data;
        if (this.page["page"] !== 1) {
          this.tableData = this.tableData.concat(res.data.records);
        } else {
          this.tableData = res.data.records;
        }

        this.pageTotal = res.data.total;
        this.$nextTick(() => {
          if (this.tableData.length == parseInt(this.pageTotal.total)) {
            this.canPullUp = false;
          } else {
            this.canPullUp = true;
          }
        });
        this.showLoading = false;
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  handleCloseBigImg() {
    this.bigImgVisible = false;
  }
  startChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.filterForm.startTime = "";
      this.$message.warning("开始时间不能大于等于结束时间");
    }
  }
  endChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.filterForm.endTime = "";
      this.$message.warning("结束时间不能小于等于开始时间");
    }
  }
  // 时间比较
  comptime() {
    var beginTime = this.filterForm.startTime;
    var endTime = this.filterForm.endTime;
    if (!!beginTime && !!endTime) {
      var beginTimes = beginTime.substring(0, 10).split("-");
      var endTimes = endTime.substring(0, 10).split("-");

      beginTime =
        beginTimes[1] +
        "-" +
        beginTimes[2] +
        "-" +
        beginTimes[0] +
        " " +
        beginTime.substring(10, 19);
      endTime =
        endTimes[1] +
        "-" +
        endTimes[2] +
        "-" +
        endTimes[0] +
        " " +
        endTime.substring(10, 19);

      var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
      return a;
    }
  }
  scrollToBottom() {
    this.initForm["params"].page++;
    this.canPullUp = false;
    this.fetchData();
  }
  handleNodeClick(data) {
    this.highlightStatus = !!data.id;
    this.filterForm.type = data.id;
    this.currentTreeId = data.id;
    this.tableData = [];
    this.initForm["params"].page = 1;
    this.fetchData();
  }
  clearFilter() {
    this.filterForm = {
      name: "",
      cardNo: "",
      phone: "",
    };
  }
  getTimeByTimeStamp(time) {
    return getTimeByTimeStamp(time);
  }

  // 打开预警处理
  openHandle(item) {
    this.handleClose();
    this.handleDialogVisible = true;
    this.handleForm = {
      id: item.id,
      warnSignId: item.warnSignId,
      handleContent: "",
      picList: [],
      alarmTime: "",
    };
    this["picList"] = [];
  }
  closeAll() {
    this.dialogDetail["dialogVisible"] = false;
    this.confirmHandled();
  }
  // 保存预警处理
  confirmHandled() {
    this.unReadOfType();
    this.getUnchecedCount();
    this.initForm["params"].page = 1;
    this.fetchData();
    this.handleDialogVisible = false;
  }

  // 未处理预警次数
  unReadOfType() {
    unReadOfType()
      .then((res) => {
        if (res && res.data.code == "200") {
          let data = res.data.data;
          this.TreeData.map((item) => {
            item["counts"] = data[item["id"]];
          });
        }
      })
      .catch((err) => {
        if (err.code == 401 || err.code == 403) {
          window.clearInterval(this.interVal);
        }
      });
  }

  //  声音预警
  voiceDialogClose() {
    this.voiceVisibile = false;
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
  height: calc(100vh - 97px);
  .scollList {
    height: 100% !important;
    display: grid;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    grid-template-columns: repeat(auto-fill, 180px);
    grid-template-rows: repeat(auto-fill, 288px);
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
      height: 158px;
      width: 158px;
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
        color: #6a7e92;
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

    .card-items {
      padding: 5px 10px;
    }
  }
}
::v-deep {
  .el-tree {
    height: 100% !important;
  }
  // .el-tree-node__content {
  //   // padding-left: 8px !important;
  // }
  .el-tree-node__expand-icon {
    display: none;
  }
}
.scollList {
  > div {
    display: inline-block;
  }
  .moreWord {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .list {
    // margin: 0 10px 25px 10px;
    // box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13),
    //   0 2px 4px rgba(0, 0, 0, 0.12);
    // border: 1px solid #e4e7ed;
    background: #fff;
    font-size: 12px;
    color: #6a7e92;
    border: 1px solid rgba(255, 96, 88, 0.17);
    line-height: 24px;
    .hiddenText {
      display: inline-block;
      width: 70px !important;
    }
    img,
    .face {
      width: 158px;
      height: 158px;
      object-fit: contain;
      border: 1px solid rgba(224, 225, 227, 0.2);
    }
    .icons {
      width: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .rowp {
      background: #f5f6f6;
      margin-top: 5px;
    }

    .icons_1 i {
      transform: scale(0.5);
    }
    .icons_3 i {
      transform: scale(0.6);
    }
    p {
      width: 150px;
    }
    .moreWord {
      width: 125px;
    }
    .warn-content {
      width: 125px;
      letter-spacing: 0;
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2; /*要显示的行数*/
      -webkit-box-orient: vertical;
    }
    .buttonWrapper {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 5px;
      font-size: 13px;
      color: #409eff;
      justify-content: space-around;
      border-top: 1px solid rgba(255, 96, 88, 0.17);
      .btnClass {
        background: #f5f9ff;
        padding-left: 5px;
        padding-right: 5px;
      }
      .btnClass:first-of-type {
        color: #6a7e92;
      }
      .line {
        width: 1px;
        height: 19px;
        background: rgba(255, 96, 88, 0.17);
      }
      .handled {
        color: #b1bdca;
        border: 0;
      }
    }
  }
  .handled {
    border: none;
    .buttonWrapper {
      border-top: 1px solid #f5f7fa;
      .line {
        background: #f5f7fa;
      }
    }
  }
  .aBtn {
    cursor: pointer;
    color: #409eff;
  }
  .align-items-top {
    align-items: flex-start;
    .icons {
      margin-top: 6px;
    }
  }
}
.alarm-type {
  font-size: 13px;
  font-weight: bold;
  .icon-yujing {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
.img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  cursor: pointer;
}

.big-img {
  width: auto;
  text-align: center;
  display: block;
  margin: 0 auto;
  height: 400px;
}
// .handle-ruleForm {
//   padding: 0 30px;
// }
// .shade-position {
//   position: relative;
// }
// .shade-position:hover .shade {
//   display: block;
// }
// .show-img {
//   width: 100px;
//   height: 100px;
//   border-radius: 5px;
//   margin-right: 5px;
//   object-fit: contain;
//   border: 1px solid #d8d8d8;
// }
// .shade {
//   display: none;
//   background-color: rgba(0, 0, 0, 0.6);
//   position: absolute;
//   top: 0px;
//   text-align: center;
// }
.el-icon-delete {
  font-size: 20px;
  color: #ffffff;
  line-height: 100px;
}
// .uplolad-img {
//   display: flex;
//   position: relative;
//   height: 100px !important;
// }
.upload-btn {
  position: absolute;
  bottom: -38px;
  left: 0;
  padding: 9px 38px;
}
/deep/.el-radio-button {
  margin-right: 20px;
  .el-radio-button__inner {
    border: 1px solid rgba(228, 231, 237, 0.52);
    border-radius: 5px;
  }
}
/deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  box-shadow: none;
}
.detailBtn {
  cursor: pointer;
}
.no-read-icon {
  padding: 5px;
  margin-left: 5px;
  color: #fff;
  background: #ff6058;
  border-radius: 30px;
  display: inline-block;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  min-width: 30px;
  padding: 0px 5px;
  text-align: center;
}
.empty {
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 300px;
  img {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
  span {
    color: #b1bdca;
  }
}
</style>