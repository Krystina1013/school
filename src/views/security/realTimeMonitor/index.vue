<template>
  <div class="app-container">
    <div class="layout-top">
      <div class="left-tree">
        <div class="left-tree-title">
          <p class="c-title">摄像机列表</p>
          <div class="search">
            <el-input
              placeholder="请输入关键字"
              size="small"
              style="width: 150px"
              v-model="searchVal"
              clearable
              @clear="search"
            ></el-input>
            <el-button size="mini" type="primary" @click="search">搜索</el-button>
          </div>
        </div>
        <div class="tree-list" :style="`height:${height_w - 450}px`">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span
                @dblclick="dbClick(node, data)"
                :draggable="data.leaf"
                @dragstart="dragstart($event, data)"
                class="pointer"
                v-if="isPc"
              >
                <span v-if="data.status == 1">
                  <i
                    class="iconfont icon-bofang icon-play"
                    v-show="cameraId == data.id"
                  ></i>
                  <i
                    class="iconfont icon-shexiangji icon-canplay"
                    v-show="cameraId != data.id"
                  ></i>
                </span>
                <span v-else>
                  <i class="iconfont icon-shexiangji" v-show="data.status != 1"></i>
                </span>
                <span class="text">{{ node.label }}</span>
              </span>
              <span
                @click="dbClick(node, data)"
                :draggable="data.leaf"
                @dragstart="dragstart($event, data)"
                class="pointer"
                v-else
              >
                <span v-if="data.status == 1">
                  <i
                    class="iconfont icon-bofang icon-play"
                    v-show="cameraId == data.id"
                  ></i>
                  <i
                    class="iconfont icon-shexiangji icon-canplay"
                    v-show="cameraId != data.id"
                  ></i>
                </span>
                <span v-else>
                  <i class="iconfont icon-shexiangji" v-show="data.status != 1"></i>
                </span>
                <span class="text">{{ node.label }}</span>
              </span>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="middle-camera" @drop="ondrop" @dragover.prevent>
        <p class="c-title">摄像机</p>
        <div class="camera-info">
          <p :title="currentPlayCamera.name">名称：{{ currentPlayCamera.name }}</p>
          <p :title="currentPlayCamera.addr">地址：{{ currentPlayCamera.addr }}</p>
        </div>
        <div data-name="single" class="single-camera">
          <div style="min-width: 400px" data-name="single">
            <Reflv
              data-name="single"
              v-if="reflvUrl"
              :style="{ width: '100%', height: height_w - 480 + 'px' }"
              :height="height_w - 480"
              :url="reflvUrl"
              :cameraId='cameraId'
              ref="reflv"
              :isPc="isPc"
            />
          </div>
        </div>
      </div>
      <!-- <div class="right-alarm">
        <p class="c-title">告警</p>
        <div class="alarm-list" :style="`height:${height_w - 425}px`">
          <div v-if="alertList.length">
            <div v-for="(item, i) in alertList" :key="i">
              <div class="capture-img">
                <img :src="item.originFace" alt="" />
                <img :src="item.capFace" alt="" />
                <span>{{ item.similarity | percent }}</span>
              </div>
              <div style="padding: 0 10px">
                <div class="flex list-name">
                  <span :title="item.photoName" class="noread">{{ item.photoName }}</span>
                  <el-button type="text" size="small" @click="openDialog(item)"
                    >详情</el-button
                  >
                </div>
                <p>{{item.capTime}}</p>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="capture-img">
              <img src="../../../assets/defaultHead.jpg" alt="" />
              <img src="../../../assets/defaultHead.jpg" alt="" />
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="layout-bottom">
      <p class="c-title">抓拍记录</p>
      <div class="pic-list">
        <div v-for="(item, i) in capture" :key="i">
          <div class="capture-img">
            <img :src="item.faceInfo.faceUrl" alt="" @click="openDialogDetail(item)" />
          </div>
          <p>{{ getTimeByTimeStamp(item.time) }}</p>
          <p v-if="item.cameraCutVo">{{ item.cameraCutVo.name||"" }}</p>
        </div>
      </div>
    </div>
    <DialogPersonDetail
      @close="dialogPersonDetail.visible = false"
      @trackSearch="trackSearch"
      :visible="dialogPersonDetail.visible"
      :form="dialogPersonDetail.form"
      :hidePersonInfo="true"
      :hideOriginalFace="true"
    ></DialogPersonDetail>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import { getTimeByTimeStamp } from "@/utils/index";
import {
  getCameraNoPage,
  play,
  unknownFaceRecentCap,
  allAlert,
  capMessage,
  alertRead
} from "@/api/police";
import DialogPersonDetail from "../components/DialogPersonDetail/DialogPersonDetail.vue";
import Reflv from "./components/Reflv.vue";
import { jsonp } from "vue";
@Component({
  components: { DialogPersonDetail, Reflv },
})
export default class extends Vue {
  config: any = config;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  searchVal: string = "";
  treeData: Array<object> = [];
  defaultProps: any = {
    children: "children",
    label: "name",
  };
  currentPlayCamera: object = {}; //正在播放的摄像机
  cameraId: string = "";
  isDrop: boolean = false;
  isPc: boolean = true;
  reflvUrl: object = {};
  dialogPersonDetail: any = {
    visible: false,
    form: {},
  };
  capture: Array<object> = [];
  alertList: Array<object> = [];
  created() {
    this.check();
    this.getTreeData();
    // this.getNotice();
  }
  getNotice() {
    let param = {
      page: 1,
      pageSize: 15,
      read: false,
    };
    allAlert(param).then((res) => {
      this.alertList = res.data.data.records;
    });
  }
  getTreeData() {
    getCameraNoPage({}).then((res) => {
      res.data.data.map((item) => {
        item.leaf = true;
      });
      this.treeData = res.data.data;
    });
  }
  search() {
    this.$refs.tree["filter"](this.searchVal);
  }
  filterNode(value, data) {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  }
  dbClick(node, data) {
    if (data.liveStatus != 'on') {
      this.$message.error("摄像头无法播放!");
      return;
    }
    this.currentPlayCamera = data;
    this.cameraId = data.id;
    this.playReflv(data.id);
    this.getFaceData(data.id);
  }
  dragstart(e, data) {
    this.isDrop = true;
    e.dataTransfer.setData("item", JSON.stringify(data));
  }
  ondrop(e) {
    let data = JSON.parse(e.dataTransfer.getData("item"));
    if (data.liveStatus != 'on') {
      this.$message.error("摄像头无法播放!");
      return;
    }
    // this.isCaptureFace = data.isCaptureFace;
    this.currentPlayCamera = data;
    this.cameraId = data.id;
    this.playReflv(data.id);
    this.getFaceData(data.id);
  }
  //抓拍列表
  getFaceData(id) {
    let param = {
      id,
      page: 1,
      pageSize: 15,
    };
    unknownFaceRecentCap(param).then((res) => {
      this.capture = res.data.data.records;
    });
  }
  //播放
  playReflv(id) {
    
    play({ id }).then((res) => {
      this.reflvUrl = res.data.data;
      this.$nextTick(() => {
        this.$refs.reflv["play"]();
      });
    }).catch(err=>{
      this.reflvUrl={};
      this.$nextTick(()=>{
        this.$refs.reflv["flv_destroy"]();
      })
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
  //告警
  openDialog(item) {
    capMessage({ id: item.cameraMetadataId }).then((res) => {
      let data = res.data.data;
      this.dialogPersonDetail.visible = true;
      data.capTime = getTimeByTimeStamp(data.time);
      this.dialogPersonDetail.form = { ...data };
    });
  }
  openDialogDetail(item){
    this.dialogPersonDetail.visible = true;
    item.capTime=getTimeByTimeStamp(item.time);
    this.dialogPersonDetail.form = {...item};
  }
  trackSearch(param){
    localStorage.setItem('track',JSON.stringify(param));
    this.$router.push({name:"capture",params:{type:'track'}});
  }
  getTimeByTimeStamp(time) {
    return getTimeByTimeStamp(time);
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 20px;
}
.c-title {
  color: #333;
  font-size: 16px;
}
.layout-top {
  flex: 1;
  display: flex;
  margin-bottom: 10px;
  .left-tree {
    width: 240px;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
    .tree-list {
      overflow-y: scroll;
      flex: 1;
    }
    .left-tree-title {
      .search {
        display: flex;
        justify-content: space-between;
        margin: 10px 0 15px;
      }
    }
    .pointer {
      display: flex;
      align-items: center;
    }
    .text {
      user-select: none;
      font-size: 14px;
    }
    .iconfont {
      display: inline-block;
      width: 25px;
      font-size: 22px;
    }
    .icon-canplay {
      color: rgb(0, 163, 0);
    }
    .icon-play {
      font-size: 18px;
      color: rgb(0, 163, 0);
    }
  }
  .middle-camera {
    flex: 1;
    background: #fff;
    padding: 10px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    .camera-info {
      font-size: 14px;
      margin-top: 10px;
    }
    .single-camera {
      flex: 1;
      background: #000;
      margin-top: 20px;
    }
  }
  .right-alarm {
    width: 230px;
    background: #fff;
    padding: 10px;
    font-size: 14px;
    color: #333;
    .capture-img {
      position: relative;
      font-size: 0;
      width: 100%;
      height: 100px;
      img {
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
      span {
        display: inline-block;
        font-size: 14px;
        padding: 0px 3px;
        background: #c03535;
        color: #fff;
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translate(-50%, 0);
        opacity: 0.7;
      }
    }
    .alarm-list {
      margin-top: 10px;
      overflow-y: scroll;
      > div>div {
        margin-bottom: 20px;
        
      }
      .list-name {
        align-items: center;
        justify-content: space-between;
        .noread {
          color: #f6501c;
        }
        > span {
          display: inline-block;
          width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.layout-bottom {
  height: 190px;
  background: #fff;
  font-size: 14px;
  color: #333;
  padding: 10px;
  .capture-img {
    width: 100px;
    height: 100px;
    img {
      width: inherit;
      height: inherit;
      object-fit: contain;
      cursor: pointer;
    }
  }
  .pic-list {
    height: 142px;
    margin-top: 5px;
    overflow-x: scroll;
    white-space: nowrap;
    > div {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
::v-deep {
  .el-tree {
    flex: 1;
  }
  .is-current > .el-tree-node__content {
    background-color: #a9b2c7 !important;
    .text {
      color: #fff;
    }
  }
  .el-tree .el-tree-node__label {
    font-size: 14px !important;
  }
}
</style>
