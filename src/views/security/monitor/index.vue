<template>
  <div class="layout-content" style="overflow:hidden">
    <!-- 人脸抓拍详情 -->
    <DialogPersonDetail  @close="closeDialogPersonDetail" @trackSearch="track" :visible="DialogPersonDetail.visible" :form="DialogPersonDetail.form" :hidePersonInfo="true" :hideOriginalFace="true" :hideTrack="activeName == 'track'"></DialogPersonDetail>
    <!-- 预警信息详情 -->
    <PersonDetail @close="handleClose" @closeAll='closeAll' :visible="dialogVisible" :form="detailDialog.detail" :hidePersonInfo="true" :hideOriginalFace="true" :hideTrack="true"></PersonDetail>
   
    <div class="main-content">
      <!-- 一屏 -->
      <div class="single" @drop="ondrop" @dragover.prevent @mousemove="showFull = true" @mouseout="showFull = false">
        <div class="camera-name" v-if="currentPlayCamera.name">
          <p class="conceal"> <span class="iconfont icon-shexiangji2 no-sxj-icon" style="color:#409EFF"></span>{{ currentPlayCamera.name }}</p>
          <div class="top-button">
            <p class="history-btn" @click="openHistory" v-show="reflvUrl" v-if="menu == 1">
              <i class="iconfont icon-Vector"></i><span>历史视频</span>
            </p>
          </div>
        </div>
        <div class="reflv">
          <Reflv data-name="single" v-if="reflvUrl" :style="{ width: '100%', height: '100%'}" :cameraId='cameraId' :url="reflvUrl" ref="reflv" :isPc="isPc"></Reflv>
          <div class="no-camera" v-else>
            <span class="iconfont icon-shexiangji2 no-sxj-icon"></span>
            <div class="no-data-text">未选择摄像机点位，请双击或拖拽左侧摄像机点位列表</div>
          </div>
        </div>
        <i class="iconfont icon-quanping1" v-show="showFull && reflvUrl" @click="openHistory"></i>
      </div>
      <!-- 4屏 -->
      <div v-if="menu == 4" :style="{ width: '100%', height: height_w - 140 + 'px' }" class="four-list">
        <div v-for="(item, i) in cameraFour" :key="i" :style="{ width: '48%', height: height_w - 580 + 'px' }" @drop="ondropFour" @dragover.prevent>
          <p class="flex">
            摄像机名称：<span style="width: 300px; display: inline-block" class="conceal">{{ item.name }}</span>
          </p>

          <div class="reflv-four" :data-name="i" :style="{ height: height_w - 600 + 'px' }">
            <Reflv :data-name="i" v-if="item.reflvUrl" :style="{ width: '100%', height: height_w - 600 + 'px' }" :height="height_w - 600" :url="item.reflvUrl" ref="reflv" :name="i" :isPc="isPc"></Reflv>
          </div>
        </div>
      </div>
      <!-- 9屏 -->
      <div v-if="menu == 9" :style="{ width: '100%', height: height_w - 140 + 'px' }" class="four-list">
        <div v-for="(item, i) in cameraNine" :key="i" :style="{ width: '32%', height: height_w - 680 + 'px' }" @drop="ondropNine" @dragover.prevent>
          <p class="flex">
            摄像机名称：<span style="width: 155px; display: inline-block" class="conceal">{{ item.name }}</span>
          </p>
          <div class="reflv-four" :data-name="i" :style="{ height: height_w - 730 + 'px' }">
            <Reflv :data-name="i" v-if="item.name" :style="{ width: '100%', height: height_w - 730 + 'px' }" :height="height_w - 730" :url="item.reflvUrl" ref="reflv" :isPc="isPc"></Reflv>
          </div>
        </div>
      </div>

    </div>
    <!-- 左侧 摄像机列表 -->
    <transition name="left">
      <div class="left-content" v-show="showCameraCard">
        <div class="card_title"><i class="iconfont icon-shexiangji" style="color:#409eff"></i>
          <span>监控设备</span><span>(<span class="online-color">{{onlineCounts}}</span>/{{allCounts}})</span>
        </div>
        <div class="camera-list scroll-wk">
          <div class="search">
            <i class="el-icon-search" @click="searchEntInfo" />
            <el-input placeholder="请输入摄像机名称" v-model="filterText" @keyup.enter.native="searchEntInfo" size="mini" maxlength="20" style="width:150px" clearable @clear="searchEntInfo"></el-input>
            <div class="search_line"></div>
          </div>
          <el-tree ref="cameraTree" :data="treeData" :props="defaultProps" :filter-node-method="filterNode">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span :draggable="data.leaf" @dblclick="dbclickFun(data)" @dragstart="dragstart($event, data)" class="pointer flex" v-if="isPc">
                <span v-if="data.liveStatus == 'on'">
                  <i class="iconfont icon-bofang icon-play" v-show="cameraId == data.id"></i>
                  <i class="iconfont icon-shexiangji2 icon-canplay" v-show="cameraId != data.id"></i>
                </span>
                <span v-else>
                  <i class="iconfont icon-shexiangji2" style="color:#AAB0B7" v-show="data.liveStatus != 'on'"></i>
                </span>
                <span class="text tree-label tree-label-color1 conceal " :title="node.label">{{ node.label }}</span><span v-if="(data.offLineCount + data.onLineCount > 0)">(<span class="online-color">{{data.onLineCount}}</span>/{{data.offLineCount + data.onLineCount}})</span>
              </span>

              <span :draggable="data.leaf" @dblclick="dbclickFun(data)" @dragstart="dragstart($event, data)" class="pointer flex" v-else>
                <span v-if="data.leaf">
                  <span v-if="data.liveStatus == 'on'">
                    <i class="iconfont icon-bofang icon-play" v-show="cameraId == data.id"></i>
                    <i class="iconfont icon-shexiangji2 icon-canplay" v-show="cameraId != data.id"></i>
                  </span>
                  <span v-else>
                    <i class="iconfont icon-shexiangji2" v-show="data.liveStatus != 'on'"></i>
                  </span>
                </span>
                <span class="text tree-label tree-label-color" :title="node.label">{{ node.label }}</span><span v-if="(data.offLineCount + data.onLineCount > 0)">(<span class="online-color">{{data.onLineCount}}</span>/{{data.offLineCount + data.onLineCount}})</span>
                <span v-if="data.leaf">
                  <span v-if="data.aiEnable == 'on'">
                    <i class="iconfont icon-Frame2 icon-canplay"></i>
                  </span>
                  <span v-else>
                    <i class="iconfont icon-Frame2"></i>
                  </span>
                </span>
              </span>
            </div>
          </el-tree>
        </div>
      </div>
    </transition>
    <i class="icon-a-ziyuan12 iconfont show_icon_left" v-show="!showCameraCard" @click="showCameraCard = true"></i>
    <!-- 抓拍人像 -->
    <transition name="el-zoom-in-bottom">
      <div class="face_card">
        <div class="captureContent" v-show="showFaceCard">
          <div class="card_title card_title_bottom">
            <i class="iconfont icon-renlianzhuapai" style="color:#409eff"></i> 人脸抓拍
          </div>
          <div v-if="searchData.length!=0" class="flex capture-roll scroll-wk-x" v-loading="showLoading">
            <div class="list-item" v-for="(item, i) in searchData" :key="i" @click="showDialogPersonDetail(item)">
              <div class="face">
                <img :src="item.faceInfo.faceUrl" alt />
              </div>
              <p>
                <span v-if="item.scenceUserList.length>0" :title="item.scenceUserList[0].name || '--'">{{ item.scenceUserList[0].name || '--'}}</span>
                <span v-else>--</span>
              </p>
              <p>{{getTimeByTimeStamp(item.time) | ignoreYearAndSecond}}</p>
              <p>
                <span v-if="item.cameraCutVo" :title="item.cameraCutVo.name">{{ item.cameraCutVo.name }}</span>
                <span v-else>--</span>
              </p>
            </div>
          </div>
          <div v-else class="noData">未查询到相关记录！</div>
        </div>
      </div>
    </transition>
    <i class="iconfont icon-a-ziyuan12 show_icon_bottom" v-show="!showFaceCard" @click="showFaceCard = true"></i>
    <!-- 右侧 预警信息 -->
    <transition name="right">
      <div class="right-content scroll-wk" v-show="showAlarmCard">
        <div class="title_back_right"></div>
        <div class="card_title card_title-alarm">
          <!-- <div class="eye-con click_icon_left"><i class="el-icon-view" @click="showAlarmCard = !showAlarmCard"></i></div> -->
          <i class="iconfont icon-yujing" style="color:#409eff"></i> 预警信息
          <!-- <span class="border-bg"></span> -->
        </div>
        <div v-if="searchData1.length!=0" v-loading="show1Loading" class="alarm-list scroll-wk">
          <div class="alarm_item flex" v-for="(item, i) in searchData1" :key="i" :class="item.status !=='WAITING'?'handled':''" @click="openDetail(item)">
            <div class="lt"></div>
            <div class="rt"></div>
            <div class="lb"></div>
            <div class="rb"></div>
            <div class="face">
              <img v-if="item.warnType !== 'DEVICE_DOWN'&& item.warnType !== 'VOICE_ALERT'" :src="item.image" alt />
              <img v-if="item.warnType === 'DEVICE_DOWN'" src="../../../assets/default-sxj.png" alt />
              <img v-if="item.warnType === 'VOICE_ALERT'" src="../../../assets/default-voice.png" alt />
            </div>
            <div class="info">
              <div class="alarm_Word tab" :style="{'color':item.status !=='WAITING'?'#6A7E92':'#FF4848','font-weight':500}"><i class="iconfont icon-yujing"></i>{{ item.warnType | warnTypeFilter}}</div>
              <div class="alarm_Word tab"><i class="iconfont icon-camera-" style="margin-left:-10px"></i>{{item.deviceName}}</div>
              <div class="alarm_Word"><i class="iconfont icon-Vector"></i>{{item.warnTime}}</div>
            </div>
          </div>
        </div>
        <div v-else class="noData">未查询到相关记录！</div>
      </div>
    </transition>
    <i class="iconfont icon-a-ziyuan12 show_icon_right" v-show="!showAlarmCard" @click="showAlarmCard = true"></i>

    <el-dialog :visible.sync="dialogHistory" :append-to-body='true' width="84vw" :before-close="handleCloseHistory">
      <div slot="title">
        <div class="dialog-title"> <i class="iconfont icon-shexiangji"></i><span>历史视频</span></div>
      </div>
      <div class="history-layout">
        <div class="history-video">
          <div class="video">
            <Video data-name="single" v-if="videoUrl" :style="{ width: '100%', height: '100%' }" :height="height_w - 480" :url="videoUrl" controls="controls" ref="video"></Video>
            <div class="no-camera" v-else>
              <span class="iconfont icon-shexiangji2 no-sxj-icon"></span>
              <div class="no-data-text">请点击右侧选择日期查看历史视频</div>
            </div>
          </div>
        </div>
        <div class="history-menu">
          <div class="flex">
            <p class="menu-title">选择日期:</p>
            <el-date-picker v-model="ruleForm.date" type="date" size="small" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="flex">
            <p class="menu-title">选择时段:</p>
            <div>
              <el-select v-model="ruleForm.startTime" placeholder="" size="small" style="width: 90px">
                <el-option v-for="item in startTime" :key="item.value" :label="item.label" :value="item.value" :disabled="
                    item.value > ruleForm.endTime && ruleForm.endTime != ''
                  ">
                </el-option>
              </el-select>
              <span class="line">至</span>
              <el-select v-model="ruleForm.endTime" placeholder="" size="small" style="width: 90px">
                <el-option v-for="item in endTime" :key="item.value" :label="item.label" :value="item.value" :disabled="item.value <= ruleForm.startTime">
                </el-option>
              </el-select>
            </div>

          </div>
          <p class="alert-text">*半小时内的视频存在延迟生成</p>
          <div class="play-list">
            <div v-for="(item, i) in playList" :key="i" @click="playVideo(item)" v-bind:class="{ active: item.active }">
              <i class="el-icon-time time-icon"></i>{{ item.startTime | timeFilter }}-{{ item.endTime | timeFilter }}
            </div>
            <span class="no-data" v-if="!playList.length">暂无数据</span>
            <el-button type="primary" size="mini" class="btn-more" v-if="vedioPage < allPage" :loading="load" @click="loadMore">加载更多</el-button>
          </div>
          <el-button type="primary" size="small" class="btn-width" @click="playHistoryListOne" :loading="load">查询</el-button>
        </div>
      </div>
      <!-- <p style="margin-top: 10px">半小时内的视频存在延迟生成</p> -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseHistory">关闭</el-button>
      </span> -->
    </el-dialog>

    <!-- 处理预警 -->
    <el-dialog title="处理预警" :append-to-body='true' :visible.sync="handleDialogVisible" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleDialogClose">
      <el-form label-position='top' ref="handleForm" label-width="100px" class="handle-ruleForm">
        <el-form-item label="反馈信息：">
          <el-input type="textarea" :rows="5" maxlength="200" placeholder="请输入内容" v-model="handleForm.handleContent"></el-input>
        </el-form-item>
        <el-form-item label="相关图片（最多上传6张）">
          <div class="uplolad-img">
            <span class="shade-position" v-for="(item,index) in picList" :key="index">
              <img class="show-img" :src="item.url" alt />
              <p class="show-img shade" @click="changeImg(item,index)">
                <i class="el-icon-delete"></i>
              </p>
            </span>
            <el-upload class="avatar-uploader" name='file' :multiple='false' :limit='6' :action="upPathPerson" ref="uploadForm" :auto-upload="false" :list-type="picList.length < 6 ? 'picture-card' : ''" :on-change="handlePreview" accept=".jpg, .jpeg, .png, .JPG, .JPEG" :headers="myHeaders" :show-file-list="false" :on-success="succUpdatePerson" :on-error="errorUpdatePerson">
              <i v-if="picList.length < 6" class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="暂停告警时长" v-if="handleForm.warnSignId">
          <el-radio-group v-model="handleForm.alarmTime">
            <el-radio-button :label="30">30分钟</el-radio-button>
            <el-radio-button :label='120'>2小时</el-radio-button>
            <el-radio-button :label='480'>8小时</el-radio-button>
            <el-radio-button :label='1440'>24小时</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose()">取 消</el-button>
        <el-button type="primary" :loading="handleLoading" @click="confirmHandled(handleForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import mixin from "@/config/minxins";
import config from "@/api/config";

import {
  getCameraByGroup,
  play,
  setRead, //处理预警信息
  playBackDate,
  playBackPageList,
} from "@/api/dev";
import { handleWarn, stopAlarm } from "@/api/dev";

import { getTimeByTimeStamp } from "@/utils/index";
import { unknownFaceTimeSearch, deviceWarning } from "@/api/police";
import Reflv from "./components/Reflv.vue";
import Video from "./components/Video.vue";
// const PersonDetail = () => import("../alarm/component/DialogPersonDetail.vue");
import PersonDetail from "../alarm/component/DialogPersonDetail.vue";
import DialogPersonDetail from "../components/DialogPersonDetail/DialogPersonDetail.vue";
import { format, subDays, addMinutes } from "date-fns";
import { getTodayStartTime } from "@/utils/index.js";
import { getToken,getSceneId } from "@/utils/auth";
var _token = getToken(); // 要保证取到
import store from "@/store";
var _scenceId = getSceneId();
@Component({
  mixins: [mixin],
  components: { Reflv, Video, PersonDetail, DialogPersonDetail },
  filters: {
    timeFilter(val: any) {
      let time = val.split(" ")[1];
      return time;
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
        VOICE_ALERT: "声音预警",
      };
      return data[type];
    },
  },
})
export default class extends Vue {
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  fullScreen: boolean = false;
  showCameraCard: boolean = true;
  showFaceCard: boolean = true;
  showAlarmCard: boolean = true;
  config: any = config;
  menu: string = "1";
  treeData: Array<object> = [];
  filterText: string = "";
  isPc: boolean = false;
  defaultProps: any = {
    children: "cameraVos",
    label: "name",
  };
  socket: any = null;
  load: boolean = false;
  camera: any = [];
  reflvUrl: any = null;
  currentPlayCamera: any = {};
  cameraId: string = "";
  cameraFour: any = [
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
  ];
  cameraNine: any = [
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
    {
      name: "",
      reflvUrl: {},
    },
  ];
  showFull: boolean = false;
  dialogHistory: boolean = false;
  ruleForm: any = {
    date: "",
    startTime: "",
    endTime: "",
  };
  startTime: any = [];
  endTime: any = [];
  hasDataDate: any = []; //有数据的日期
  playList: any = []; //播放列表
  videoUrl: any = null; //
  pickerOptions: any = {};
  vedioPage: number = 1;
  allPage: number = 0; // 总页数
  // 抓拍
  showLoading: boolean = false;
  searchData: any = [];
  DialogPersonDetail: any = {
    visible: false,
    form: {},
  };
  activeName: string = "cap";
  // 预警
  show1Loading: boolean = false;
  searchData1: any = [];
  dialogVisible: boolean = false;
  detailDialog: any = {
    detail: {},
  }; //详情

  myHeaders: object = {
    token: _token,
  };
  handleDialogVisible: boolean = false;
  handleForm: object = {
    id: "",
    handleContent: "",
    picList: [],
    warnSignId: "",
    alarmTime: "",
  };
  path: any = config.wsURL;
  picList: Array<Object> = [];
  upPathPerson: any = `${config.v3}/admin/feed_back/upFile`;
  handleLoading: boolean = false;
  timer: any = null;
  allCounts: number = 0;
  onlineCounts: number = 0;
  command(val: any) {
    this.menu = val;
  }
  created() {
    for (let i = 0; i < 25; i++) {
      this.endTime.push({
        value: i,
        label: i,
        disabled: false,
      });
      if (i == 24) break;
      this.startTime.push({
        value: i,
        label: i,
        disabled: false,
      });
    }
    this.getTreeData();
  }
  // websocket推送
  initSocket() {
    if (typeof WebSocket === "undefined") {
      this.$message.error("您的浏览器不支持socket");
    } else {
      if(this.socket) {
        this.socket.close =  this.socketClose;
        this.socket = null;
      }
      // 实例化socket
      this.socket = new WebSocket(this.path);
      // 监听socket连接
      this.socket.onopen = this.openSocket;
      // 监听socket错误信息
      this.socket.onerror = this.errorSocket;
      // 监听socket消息
      this.socket.onmessage = this.getSocketMessage;
      let that = this;
      this.timer = setInterval(() => {
        that.socket.send("It`s a heart Beat");;
      },30000)
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
      if(data1.warnType && data1.deviceId === this.cameraId ) {
        this.searchData1.unshift(data1);
      }
      if(data1.faceInfo && data1.cameraId === this.cameraId) {
        this.searchData.unshift(data1);
      }
      
    }
  }
  sendSocket() {
    this.socket.send();
  }
  socketClose() {
    console.log("socket已经关闭");
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }
  }
  // 视频高度自适应开始
  mounted() {
    window.addEventListener("resize", this.heightResize);
    this.path = config.wsURL + _scenceId + "/" + _token;
    
    this.$once('hook:beforeDestory',()=>{
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null;
      }
      
    })
  }
  heightResize() {
    const that = this;
    window.onresize = () => {
      return (() => {
        let height = document.body.clientHeight;
        that.height_w = height;
      })();
    };
  }

  filterNode(value: any, data: any) {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  }
  fullCreen() {
    if (!this.reflvUrl) {
      this.$message.error("请选择视频!");
      return;
    }
    this.fullScreen = true;
  }
  quitFull() {
    this.fullScreen = false;
  }

  getTreeData() {
    getCameraByGroup().then((res: any) => {
      res.data.data.map((item: any) => {
        item.cameraVos.map((i: any) => {
          i.leaf = true;
        });
      });
      this.treeData = res.data.data;
      this.allCounts = 0;
      this.onlineCounts = 0;
      this.treeData.map((item:any) => {
       this.allCounts = this.allCounts + item.offLineCount + item.onLineCount;
       this.onlineCounts = this.onlineCounts + item.onLineCount;
      })
    });
  }
  //查詢
  searchEntInfo() {
    this.$nextTick(() => {
      (this.$refs["cameraTree"] as any).filter(this.filterText);
    });
  }
  //双击
  dbclickFun(data: any) {
    if (!data.leaf) {
      return;
    }
    this.loadFaceData(data.id);
    this.getAlarm(data.id);
    this.cameraId = data.id;
    if (data.liveStatus != "on") {
      this.$message.error("摄像头无法播放!");
      this.reflvUrl = "";
      this.$refs.reflv["flv_destroy"]();
      return;
    }
    this.currentPlayCamera = data;
    this.playReflv(data.id, "");
    this.initSocket();
  }
  //拖拽
  dragstart(e: any, data: any) {
    this.loadFaceData(data.id);
    this.getAlarm(data.id);
    e.dataTransfer.setData("item", JSON.stringify(data));
  }
  ondrop(e: any) {
    let data = JSON.parse(e.dataTransfer.getData("item"));
    if (data.liveStatus != "on") {
      this.$message.error("摄像头无法播放!");
      this.reflvUrl = "";
      this.$refs.reflv["flv_destroy"]();
      return;
    }
    this.currentPlayCamera = data;
    this.cameraId = data.id;
     this.initSocket();
    this.playReflv(data.id, "");
  }
  ondropFour(e: any) {
    let data = JSON.parse(e.dataTransfer.getData("item"));
    let el = e.target.getAttribute("data-name");
    if (data.liveStatus != "on") {
      this.$message.error("摄像头无法播放!");
      this.reflvUrl = "";
      this.$refs.reflv["flv_destroy"]();
      return;
    }
    this.cameraFour[el].name = data.name;
    this.cameraId = data.id;
    this.initSocket();
    this.playReflv(data.id, el);
  }
  ondropNine(e: any) {
    let data = JSON.parse(e.dataTransfer.getData("item"));
    let el = e.target.getAttribute("data-name");
    if (data.liveStatus != "on") {
      this.$message.error("摄像头无法播放!");
      this.reflvUrl = "";
      this.$refs.reflv["flv_destroy"]();
      return;
    }
    this.cameraNine[el].name = data.name;
    this.cameraId = data.id;
    this.initSocket();
    this.playReflv(data.id, el);
  }
  //播放
  playReflv(id: any, index: any) {
    play({ id })
      .then((res) => {
        if (this.menu == "1") {
          this.reflvUrl = res.data.data;
          this.$nextTick(() => {
            this.$refs.reflv["play"]();
          });
        } else if (this.menu == "4") {
          this.cameraFour[index].reflvUrl = res.data.data.flvUrl;
          this.$nextTick(() => {
            this.$refs.reflv[index]["play"]();
          });
        } else {
          this.cameraNine[index].reflvUrl = res.data.data.flvUrl;
          this.$nextTick(() => {
            this.$refs.reflv[index]["play"]();
          });
        }
      })
      .catch((err) => {
        this.reflvUrl = {};
        this.$nextTick(() => {
          this.$refs.reflv["flv_destroy"]();
        });
      });
  }
  openHistory() {
    this.dialogHistory = true;
    playBackDate({ id: this.cameraId }).then((res) => {
      this.hasDataDate = res.data.data;
      let that = this;
      this.pickerOptions = {
        disabledDate(time: any) {
          let date = format(time, "yyyy-MM-dd");
          return that.hasDataDate.indexOf(date) == -1;
        },
      };
    });
  }
  changeDate() {
    let isEmpty = false;
    for (let i in this.ruleForm) {
      if (this.ruleForm[i] == "") {
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) return;
    this.playHistoryList();
  }
  playVideo(item: any) {
    this.playList.map((jtem) => (jtem.active = false));
    item.active = true;
    this.videoUrl = item;
    this.$nextTick(() => {
      this.$refs.video["play"]();
    });
  }
  // 第一次查询
  playHistoryListOne() {
    this.playList = [];
    this.allPage = 0;
    this.vedioPage = 1;
    this.playHistoryList();
  }
  // 加载更多
  loadMore() {
    this.vedioPage++;
    this.playHistoryList();
  }
  playHistoryList() {
    let isEmpty = false;
    if (!this.ruleForm.date) {
      this.$message.error("请选择历史日期");
      return;
    }
    for (let i in this.ruleForm) {
      if (this.ruleForm[i] === "") {
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) {
      this.$message.error("请选择完整的时间段");
      return;
    }
    this.load = true;
    let param = {
      cameraId: this.cameraId,
      selectDate: this.ruleForm.date,
      startTime:
        this.ruleForm.startTime < 10
          ? `0${this.ruleForm.startTime}:00:00`
          : `${this.ruleForm.startTime}:00:00`,
      endTime:
        this.ruleForm.endTime < 10
          ? `0${this.ruleForm.endTime}:00:00`
          : `${this.ruleForm.endTime}:00:00`,
      page: this.vedioPage,
      pageSize: 20,
    };
    playBackPageList(param)
      .then((res) => {
        this.playList = this.playList.concat(res.data.data.records);
        this.allPage = res.data.data.pages;
        this.load = false;
      })
      .catch((error) => {
        this.load = false;
      });
  }
  // 关闭历史视频
  handleCloseHistory() {
    this.dialogHistory = false;
    this.ruleForm = {
      date: "",
      startTime: "",
      endTime: "",
    };
    this.playList = [];
    this.allPage = 0;
    this.vedioPage = 1;
    this.$nextTick(() => {
      if (this.$refs.video) {
        this.$refs.video["hls_destyoy"]();
        this.$refs.video["flv_destroy"]();
      }
    });
    this.videoUrl = null;
  }
  //判断pc还是平板
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
  // 获取人像抓拍
  loadFaceData(val) {
    let param: any = {
      page: 1,
      pageSize: 20,
      startTime: getTodayStartTime(),
      endTime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      cameraIds: [val],
    };
    this.showLoading = true;
    unknownFaceTimeSearch(param)
      .then((res) => {
        let data = res.data.data;
        this.showLoading = false;
        this.searchData = data.records;
        this.searchData.forEach((v: any) => {});
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  track(param) {
    this.closeDialogPersonDetail();
    this.activeName = "track";
    this.searchData = [];
  }
  // 打开详情
  showDialogPersonDetail(item, type) {
    this.DialogPersonDetail.visible = true;
    item.capTime = getTimeByTimeStamp(item.time);
    this.DialogPersonDetail.form = { ...item };
  }
  // 关闭详情
  closeDialogPersonDetail() {
    this.DialogPersonDetail.visible = false;
    this.DialogPersonDetail.form = {};
  }
  // 获取预警信息
  getAlarm(val) {
    let param: any = {
      page: 1,
      limit: 20,
      startTime: getTodayStartTime(),
      endTime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      deviceName: "",
      includeUserInfo: true,
      isRead: "",
      type: "",
      isProcess: "",
      deviceId: val,
      notInType: ["DEVICE_DOWN"],
    };
    deviceWarning(param)
      .then((res) => {
        let data = res.data.data;
        this.show1Loading = false;
        this.searchData1 = data.records;
        
      })
      .catch((err) => {
        this.show1Loading = false;
      });
  }
  // 打开预警详情
  openDetail(row: any) {
    this.detailDialog.detail = { ...row };
    this.dialogVisible = true;
    if (row.status === "WAITING") {
      row.status = "READ";
      this.changeStatus(row, 0, "notip");
    }
  }

  //修改未读状态
  changeStatus(row: any, status: number, tip: any) {
    // tip 是否提示
    let arr: any = [];
    if (status) {
      this.searchData1.map((item: any) => {
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
          this.getUnchecedCount();
          this.getAlarm(this.cameraId);
        }
      })
      .catch((err) => {
        row.status = "WAITING";
      });
  }
  // 关闭预警详情
  handleClose() {
    this.dialogVisible = false;
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
  }
  // 关闭预警弹窗
  handleDialogClose() {
    this.handleForm = {
      handleContent: "",
      picList: [],
      warnSignId: "",
      alarmTime: "",
      id: "",
    };
    this["picList"] = [];
    this.handleDialogVisible = false;
  }
  // 保存预警处理
  confirmHandled(item) {
    this.dialogVisible = false;
    this.getAlarm(this.cameraId);
    this.$refs.uploadForm["submit"]();
    setTimeout(() => {
      this.handledFun();
      if (item.warnSignId) {
        this.stopAlarm();
      }
    }, 1000);
  }
  // 暂停告警
  stopAlarm() {
    let stopStillTime = format(
      addMinutes(new Date(), parseInt(this.handleForm["alarmTime"])),
      "yyyy-MM-dd HH:mm:ss"
    );
    stopAlarm({
      warnSignId: this.handleForm["warnSignId"],
      stopStillTime: stopStillTime,
    });
  }
  // 预警处理
  handledFun() {
    let data = {
      id: this.handleForm["id"],
      images: this.handleForm["picList"],
      remark: this.handleForm["handleContent"],
    };
    handleWarn(data).then((res) => {
      if (res && res.data.code == "200") {
        this.$message.success("处理成功！");
        this.getUnchecedCount();
        this.handleDialogClose();
        this.getAlarm(this.cameraId);
      } else {
        this.$message.error("处理失败");
      }
    });
  }
  async getUnchecedCount() {
    /** @description 未读警报信息 */
    this.$store.dispatch("GET_WARNING");
  }
  succUpdatePerson(response, file, fileList) {
    if (response.code == 200) {
      this.handleForm["picList"].push(response.data);
    }
  }
  handlePreview(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.$message.error("上传图片大小不能超过 2MB!");
      return;
    }
    if (file.status === "ready" && this["picList"].length < 6) {
      this["picList"].push(file);
    }
  }
  errorUpdatePerson() {}
  destroyed() {
    this.$refs.reflv && this.$refs.reflv["flv_destroy"]();
    if(this.socket) {
      this.socket.close =  this.socketClose;
      this.socket = null;
    }
  }
  getTimeByTimeStamp(time) {
    return getTimeByTimeStamp(time);
  }
  // 删图片
  changeImg(v, i) {
    this["picList"].splice(i, 1);
  }
  closeAll() {
    this.dialogVisible = false;
    this.getAlarm(this.cameraId)
  }
}
</script>

<style lang="scss">
.camera-list {
  .el-tree {
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    i {
      font-size: 10px;
      color: #606266;
    }
    .el-tree-node:focus > .el-tree-node__content,
    .el-tree-node.is-current > .el-tree-node__content {
      background-color: transparent !important;
    }
    .el-tree-node__content {
      height: 32px;
      line-height: 32px;
    }
    .el-tree-node__content:hover {
      background: transparent;
    }
    .is-current {
      background: transparent;
      background: #e6f1fc;
      .tree-label-color {
        color: #409eff;
      }
      .el-tree-node__children {
        .is-current {
          .tree-label-color {
            color: #409eff;
          }
        }
        .tree-label-color {
          color: #606266;
        }
      }
    }
  }
  > .el-tree {
    > .el-tree-node {
      min-width: 100%;
      height: 32px;
      line-height: 32px;
      display: inline-block;
    }
  }
  .el-input__inner {
    background: transparent;
    border: none;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    padding-right: 20px;
  }
  .el-input__inner::placeholder {
    color: #606266;
  }
}
</style>

<style lang="scss" scoped>
.left-enter {
  opacity: 0;
  transform: translateX(-100%);
}
.left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
  // 解决页面从上往下位移问题
  position: absolute;
}
.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
  transition: all 0.35s ease;
}
.right-enter {
  opacity: 0;
  transform: translateX(100%);
}
.right-leave-to {
  opacity: 0;
  transform: translateX(100%);
  // 解决页面从上往下位移问题
  position: absolute;
}

.layout-content {
  display: flex;
  padding: 0;
  background-color: #f5f7fa;
  position: relative;

  z-index: 0;
  .back-content {
    position: absolute;
    width: calc(100vw - 296px);
    height: calc(100vh - 110px);
    top: 37px;
    left: 0;
    background: url("~@/assets/madkGroup.png");
    background-size: 100% 100%;
    opacity: 0.5;
    z-index: 0;
  }

  .main-content {
    position: absolute;
    width: calc(100vw - 296px);
    height: calc(100vh - 110px);
    z-index: 0;
  }
}
.single {
  width: calc(100% - 465px);
  height: calc(100% - 180px);
  margin-left: 235px;
  background: #fff;
  padding: 15px;
  margin-top: 15px;
  position: relative;

  .reflv {
    background: #000;
    width: 100%;
    height: calc(100% - 49px);
    position: relative;
  }
}
.conceal {
  float: left;
  width: 439px;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #606266;
  letter-spacing: 0px;
  text-shadow: 0px 4px 4px 0px #183266;
}
.top-button {
  float: right;
  margin-right: 95px;
}
.history-btn {
  padding: 0 15px;
  border-radius: 4px;
  position: relative;
  height: 32px;
  line-height: 32px;
  margin-left: 34px;
  background: #409eff;
  color: #fff;
  font-size: 16px;
  text-align: center;
  display: inline-block;
  .history-btn-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(
      0deg,
      #063172 0%,
      rgba(3, 112, 214, 0) 100%
    );
    filter: blur(3px);
    z-index: -1;
  }
  i {
    font-size: 14px;
    margin-right: 4px;
  }
  span,
  i {
    color: #fff;
    opacity: 1;
    line-height: 32px;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 500;
  }
}

.left-content {
  position: absolute;
  left: 0;
  width: 220px;
  height: calc(100vh - 50px);
  z-index: 2;
  color: #606266;
  background: #fff;

  .title_back_left {
    position: absolute;
    width: 203px;
    height: 46px;
    margin-top: -5px;
    margin-left: -20px;
    background: url("../../../assets/title_back_1.png") 100% 100%;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
  }

  .card_title {
    width: 203px;
    position: relative;
    margin-top: 13px;
    i {
      font-size: 18px;
    }
  }
}
.show_icon_left {
  position: absolute;
  top: 150px;
  left: 37px;
  font-size: 18px;
  color: #78a2be;
  cursor: pointer;
  transform: rotate(90deg);
  z-index: 5;
}
.camera-list {
  height: calc(100% - 50px);
  flex-direction: column;
  overflow-y: auto;
  .search {
    height: 32px;
    color: #606266;
    padding-left: 21px;
    margin-top: 13px;
    margin-bottom: 6px;
    i {
      font-size: 15px;
    }
  }
  .search_line {
    height: 1px;
    width: 100%;
    opacity: 0.5;
    background-color: #606266;
  }
  .custom-tree-node {
    height: 32px;
    line-height: 32px;
  }
  .icon-canplay {
    color: #409eff;
  }
  .icon-play {
    font-size: 18px;
    color: #409eff;
  }
}

.right-content {
  position: absolute;
  right: 0px;
  width: 288px;
  height: calc(100vh - 50px);
  min-width: 288px;
  z-index: 2;
  background: #fff;
  .title_back_right {
    position: absolute;
    width: 359px;
    height: 46px;
    margin-top: -2px;
    margin-left: -36px;
    // background: url("../../../assets/screen/right_header.png") 100% 100%;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    z-index: -1;
  }
  .card_title {
    text-align: left;
    padding-right: 25px;
    width: 288px;
    margin-top: 13px;
    // margin-bottom: 22px;
    i {
      font-size: 18px;
    }
  }
}
.show_icon_right {
  position: absolute;
  top: 150px;
  right: 37px;
  font-size: 18px;
  color: #78a2be;
  cursor: pointer;
  transform: rotate(-90deg);
  z-index: 5;
}
.alarm-list {
  height: calc(100vh - 100px);
  padding: 0 3px;
  overflow-y: auto;
  .alarm_item {
    cursor: pointer;
    width: 267px;
    height: 101px;
    color: #6a7e92;
    position: relative;
    // background: #f5f6f6;
    border: 1px solid rgba(245, 246, 246, 0.2);
    padding: 16px;
    // margin-bottom: 9px;
    .face {
      width: 74px;
      height: 74px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      width: 154px;
      margin-left: 6px;
      .alarm_Word {
        width: 154px;
        height: 21px;
        background: #f5f6f6;
        padding: 0 5px;
        font-size: 13px;
        font-weight: 500;
        color: #6a7e92;
        line-height: 21px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        i {
          margin-right: 5px;
          font-size: 12px;
        }
      }
      .tab {
        margin-bottom: 6px;
      }
    }
    .lt {
      position: absolute;
      top: 3px;
      left: 0;
      width: 10px;
      height: 10px;
      border-left: 2px solid rgba(255, 96, 88, 0.1);
      border-top: 2px solid rgba(255, 96, 88, 0.1);
    }
    .rt {
      position: absolute;
      top: 3px;
      right: 3px;
      width: 10px;
      height: 10px;
      border-right: 2px solid rgba(255, 96, 88, 0.1);
      border-top: 2px solid rgba(255, 96, 88, 0.1);
    }
    .lb {
      position: absolute;
      bottom: 3px;
      left: 0;
      width: 10px;
      height: 10px;
      border-left: 2px solid rgba(255, 96, 88, 0.1);
      border-bottom: 2px solid rgba(255, 96, 88, 0.1);
    }
    .rb {
      position: absolute;
      bottom: 3px;
      right: 0px;
      width: 10px;
      height: 10px;
      border-right: 2px solid rgba(255, 96, 88, 0.1);
      border-bottom: 2px solid rgba(255, 96, 88, 0.1);
    }
  }
}

.face_card {
  position: absolute;
  height: 195px;
  width: calc(100vw - 760px);
  left: 235px;
  bottom: 15px;
  background: #fff;
}
.captureContent {
  height: 195px;
  width: 100%;
  min-width: 288px;
  overflow: hidden;
  .capture-roll {
    width: calc(100vw - 805px);
    overflow-x: auto;
  }
  .title_back_face {
    position: absolute;
    width: 203px;
    height: 46px;
    margin-top: -20px;
    margin-left: -20px;
    background: url("../../../assets/title_back_2.png") 100% 100%;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
  }
  .card_title {
    width: 197px;
  }
  i {
    font-size: 18px;
  }
  .list-item {
    cursor: pointer;
    width: 94px;
    height: 151px;
    background: #f5f7fa;
    margin-top: 1px;
    margin-right: 9px;
    text-align: center;
    padding: 4px 5px;
    .face {
      width: 84px;
      height: 84px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      font-size: 12px;
      font-weight: 500;
      color: #3a414f;
      line-height: 12px;
      letter-spacing: 0px;
      margin: 5px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}
.show_icon_bottom {
  position: absolute;
  bottom: 29px;
  left: 462px;
  font-size: 18px;
  color: #78a2be;
  cursor: pointer;
  z-index: 5;
}

.card_title {
  height: 36px;
  line-height: 36px;
  font-size: 18px;
  font-weight: 500;
  color: #606266;
  padding-left: 14px;
  position: relative;
  // .border-bg{
  //   background: url(/static/img/title_header.ae240dcc.png) no-repeat center center;
  //   position: absolute;
  //   bottom: -3px;
  //   width: 316px;
  //   height: 11px;
  //   left: 46px;
  //   transform: scale(0.5);
  // }
  .border-bg-left {
    left: -106px;
  }
  .border-bg-bottom {
    left: -106px;
  }

  // border-bottom: 2px solid;
  // border-image: linear-gradient(
  //     135deg,
  //     rgba(30, 152, 219, 0) 59%,
  //     #d4f0ff,
  //     rgba(30, 152, 219, 0) 96%
  //   )
  //   2 2;
}
.ifonfont {
  display: inline-block;
}
.flex {
  display: flex;
  align-items: center;
}
.click_icon {
  float: right;
  line-height: 36px;
  font-size: 14px !important;
  cursor: pointer;
}
.click_icon_left {
  float: left;
  line-height: 36px;
  font-size: 14px !important;
  cursor: pointer;
}

.icon-quanping1 {
  position: absolute;
  right: 50px;
  bottom: 50px;
  color: #fff;
  font-size: 40px;
  cursor: pointer;
}
.four-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  p {
    margin-bottom: 15px;
  }
  > div {
    width: 48%;
  }
  .reflv-four {
    background: #000;
  }
}
.history-layout {
  display: flex;
  height: 60vh;
  .history-video {
    flex: 1;
    display: flex;
    flex-direction: column;
    .video {
      flex: 1;
      width: 100%;
      position: relative;
      background: #000;
      margin-bottom: 10px;
    }
  }
  .history-menu {
    margin-left: 15px;
    padding: 15px;
    width: 350px;
    position: relative;
    > div {
      margin-bottom: 10px;
    }
    .line {
      display: inline-block;
      margin: 0 13px;
    }
    .menu-title {
      margin-bottom: 5px;
      margin-right: 5px;
      color: #606266;
    }
  }
  /deep/.el-date-editor.el-input {
    width: 200px;
  }
}

.no-camera {
  position: absolute;
  text-align: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #33415e;
  .no-sxj-icon {
    font-size: 40px;
  }
  .no-data-text {
    width: 605px;
    text-align: center;
    line-height: 60px;
    height: 141px;
    color: #ccc;
    opacity: 0.3;
    background: linear-gradient(181deg, #243047 0%, rgba(26, 36, 56, 0) 100%);
    border-radius: 50%;
  }
}

//  弹窗title
.dialog-title {
  font-size: 18px;
  color: #303133;
}
// 查询按钮
.btn-width {
  position: absolute;
  top: 15px;
  right: 0;
}
.alert-text {
  font-size: 14px;
  color: #ff6058;
}
.no-data {
  display: inline-block;
  color: #606266;
  padding-top: 20px;
  margin-left: 15px;
}

.play-list {
  width: 100%;
  height: 380px;
  margin-top: 15px;
  white-space: nowrap;
  text-align: center;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  div {
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    color: #606266;
    padding: 10px 5px;
    cursor: pointer;
    text-align: center;
  }
  .active {
    background: rgb(64, 158, 255);
    color: #fff;
    .time-icon {
      color: #fff;
    }
  }
  .time-icon {
    color: #606266;
    margin-right: 10px;
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

.alarm_Word:first-child {
  margin-top: 0;
}
.noData {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 48px);
  color: #d8d8d8;
}
.shade-position {
  position: relative;
  border: 1px solid #d8d8d8;
  width: 100px;
  height: 100px;
  margin-right: 5px;
}
.shade-position:hover .shade {
  display: block;
}
.show-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.shade {
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0px;
  text-align: center;
}
.el-icon-delete {
  font-size: 20px;
  color: #ffffff;
  line-height: 100px;
}
.uplolad-img {
  display: flex;
  position: relative;
  height: 100px !important;
}
.scroll-wk::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  display: none;
}
.scroll-wk-x::-webkit-scrollbar {
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
.scroll-wk-x::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 3px;
  // box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #3a414f;
  // display: none;
}
.scroll-wk-x::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: #fff;
  // display: none;
}
.tree-label {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 5px;
  margin-left: 5px;
}
.top-bk {
  position: absolute;
  width: calc(100vw - 297px);
  height: 100px;
  min-width: 288px;
  left: 37px;
  z-index: 1;
  top: 30px;
  background: linear-gradient(
    0deg,
    rgba(12, 71, 141, 0) 0%,
    rgba(13, 33, 72, 0.63) 63%,
    #1a3059 100%
  );
}
.camera-name {
  height: 36px;
  line-height: 36px;
  margin-bottom: 12px;
  width: 100%;
  z-index: 1;
  .line-bottom {
    position: absolute;
    width: 439px;
    height: 1px;
    opacity: 0.2;
    border: 1px solid #7de0ff;
    bottom: 4px;
  }
  .line-border {
    position: absolute;
    width: 439px;
    height: 1px;
    opacity: 0.5;
    border: 1px solid #7de0ff;
    bottom: 0;
  }
}
// ::v-deep{
//   .el-dialog{
//     margin-left: 470px;
//   }
// }
.fullMain {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #000;
  z-index: 10;
  .main-content {
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }
  .left-content {
    top: 0;
    left: 0;
    height: 100vh;
  }
  .right-content {
    top: 0;
    right: 0;
    height: 100vh;
  }
  .top-bk {
    width: 100vw;
    top: 0;
    left: 0;
  }
  .face_card {
    width: 100vw;
    left: 0;
    bottom: 0;
    .captureContent {
      width: calc(100vw - 760px);
      left: 230px;
    }
  }
  .camera-name {
    left: 260px;
    width: calc(100vw - 540px);
  }
}
.btn-border {
  width: 100%;
  height: 0px;
  opacity: 0.5;
  border: 1px solid #1e98db;
  filter: blur(0.5px);
  position: absolute;
  bottom: 0;
  left: 0;
}
.online-color{
  color: #409eff;
}
</style>