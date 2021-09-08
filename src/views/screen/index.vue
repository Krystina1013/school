<template>
  <div class="container" v-loading='allLoading'>
    <!-- <img class="back_img" :src="currentImg" /> -->
    <div class="layout">
      <div class="header">
        <div class="left_title"><img src="../../assets/screen/title_img.png" /><span>智安校园可视化大屏</span></div>
        <div class="project-Title">{{ name }}</div>
        <div class="time_data">
          <p><img src="../../assets/screen/date.png" />{{ header.date }} <img src="../../assets/screen/time.png" />{{ header.time }}</p>
        </div>
        <div class="login_out">
          <p @click="loginOut"><i class="iconfont icon-tuichu"></i>退出</p>
        </div>
      </div>
      <div class="layout-left">
        <basicData class="flex_1" :basicInfo="basicInfo" :visitor="visitor"></basicData>
        <deviceData class="flex_1" :deviceInfo="deviceInfo"></deviceData>
        <captureData class="flex_1" :captureInfo="captureInfo"></captureData>
        <carcaptureData class="flex_1" :carcaptureInfo="carcaptureInfo"></carcaptureData>
      </div>
      <div class="layout-right">
        <alarmData class="flex_1" :alarmInfo="alarmInfo"></alarmData>
        <alarmlistData class="flex_1" :alarmList="alarmList"></alarmlistData>
      </div>
      <div class="layout-bottom">
        <captureList :captureList="captureList" :accessList="accessList"></captureList>
      </div>
    </div>
  </div>
</template>

<script>
import { getTime } from "@/utils/index.js";
import basicData from "./basicData111.vue"; //基础数据
import deviceData from "./deviceData.vue";
import captureData from "./captureData.vue";
import carcaptureData from "./carcaptureData.vue";
import alarmData from "./alarmData.vue";
import alarmlistData from "./alarmlistData.vue";
import captureList from "./captureList.vue";

import { userInfo, visitor, captureInfo, accessInfo } from "@/api/screenShow.ts";
import { getDeviceData, getZpData, getDeviceAlarmData } from "@/api/screenApi.ts";
import { deviceWarnPage } from "@/api/dev";
export default {
  components: {
    basicData,
    deviceData,
    captureData,
    carcaptureData,
    alarmData,
    alarmlistData,
    captureList,
  },
  data() {
    return {
      allLoading: false,
      currentImg: '',
      name: '',
      header: {
        time: "",
        date: ""
      },
      basicInfo: {},
      visitor: 0,
      deviceInfo: {
        onlineCamera: 0,
        outlineCamera: 0,
        onlineDevice: 0,
        outlineDevice: 0,
        Camera: [],
        Device: [],
      },
      captureInfo: [],
      carcaptureInfo: {
        date: [],
        car: [],
        noCar: []
      },

      alarmInfo: {},
      alarmList: [],

      captureList: [],
      accessList: [],
    };
  },
  created() {
    this.name = localStorage.getItem('name')
    this.currentImg = JSON.parse(JSON.stringify(localStorage.getItem('img')))
    console.log('bbbb',this.currentImg)
    this.currentTime();
    this.getData()
  },
  mounted() {
    this.interval = setInterval(() => {
      this.getDataReset();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.interval);
  },

  methods: {
    getDataReset() {
      // this.clearAll()
      // this.getDeviceInfo()
      // this.getCaptureInfo()

      this.getCaptureList()
      this.getAccessList()

      this.getAlarmInfo()
      this.getAlarmData()
    },

    getData() {
      this.allLoading = true;

      this.getUserInfo()
      this.getVisitor()
      this.getDeviceInfo()
      this.getCaptureInfo()

      this.getCaptureList()
      this.getAccessList()

      this.getAlarmInfo()
      this.getAlarmData()
      setTimeout(() => {
        this.allLoading = false;
      }, 500)
    },

    getUserInfo() {
      userInfo().then((res) => {
        this.basicInfo = res.data.data
      })
    },
    getVisitor() {
      visitor().then((res) => {
        this.visitor = res.data.data
      })
    },
    getDeviceInfo() {
      getDeviceData().then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.deviceInfo.onlineCamera = data.onlineCameraCount;
          this.deviceInfo.outlineCamera = data.cameraCount - data.onlineCameraCount;
          this.deviceInfo.onlineDevice = data.onlineDeviceCount;
          this.deviceInfo.outlineDevice = data.deviceCount - data.onlineDeviceCount;
          this.deviceInfo.Camera.push({
            name: '在线', value: data.onlineCameraCount
          })
          this.deviceInfo.Camera.push({
            name: '离线', value: data.cameraCount - data.onlineCameraCount
          })
          this.deviceInfo.Device.push({
            name: '在线', value: data.onlineDeviceCount
          })
          this.deviceInfo.Device.push({
            name: '离线', value: data.deviceCount - data.onlineDeviceCount
          })
        }
      })
    },
    getCaptureInfo() {
      getZpData().then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data.peopleResult
          for (let item in data) {
            this.captureInfo.push({
              date: item.substring(5, 10),
              value: data[item]
            })
          }

          this.carcaptureInfo.car = []
          this.carcaptureInfo.noCar = []
          this.carcaptureInfo.date = [];
          let sevenCar = res.data.data.sevenArrest
          for (let i in sevenCar) {
            this.carcaptureInfo.date.push(i.substring(5, 10))
            this.carcaptureInfo.car.push(sevenCar[i])
          }
          let sevenNocar = res.data.data.sevenNoArrest
          for (let j in sevenNocar) {
            this.carcaptureInfo.noCar.push(sevenNocar[j])
          }
        }

      })
    },

    getCaptureList() {
      captureInfo().then((res) => {
        this.captureList = res.data.data;
      })
        .catch((err) => {
        });
    },
    getAccessList() {
      let params = {
        page: 1,
        limit: 10,
        startTime: this.getNowFormatDate(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)),
        endTime: this.getNowFormatDate(new Date())
      }
      accessInfo(params).then((res) => {
        this.accessList = res.data.data.records
      })
    },

    getAlarmInfo() {
      getDeviceAlarmData().then(res => {
        if (res.data.code == 200) {
          this.alarmInfo = res.data.data.warnType;
        }
      })
    },
    getAlarmData() {
      let param = {
        limit: 10,
        page: 1,
        neWords: ['DEVICE_DOWN', 'VOICE_ALERT', 'MOUSE', 'CHEF_HAT', 'NOT_BACK', 'LATE_BACK']
      };
      deviceWarnPage(param).then((res) => {
        this.alarmList = res.data.data.records;
      })
        .catch((err) => {
          this.alarmList = [];
        });
    },

    clearAll() {
      // this.deviceInfo = {
      //   onlineCamera: 0,
      //   outlineCamera: 0,
      //   onlineDevice: 0,
      //   outlineDevice: 0,
      //   Camera: [],
      //   Device: [],
      // }
      // this.captureInfo = []
      // this.carcaptureInfo = {
      //   date: [],
      //   car: [],
      //   noCar: []
      // }

      this.alarmInfo = {}
      this.alarmList = []

      this.captureList = []
      this.accessList = []
    },

    // 退出
    loginOut() {
      this.$router.back();
    },

    getNowFormatDate(date) {
      var date = date;
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate + ' 23:59:59';
      return currentdate;
    },

    // 实时时间
    currentTime() {
      this.timer = setInterval(() => {
        let { time, day } = getTime();
        this.header.time = time;
        this.header.date = day;
      }, 500);
    },
  },

};
</script>

<style lang="scss" scoped>
$width: 2080;
$height: 1080;
@function grid-width($n) {
  @return ($n/$width) * 100vw;
}
@function grid-height($n) {
  @return ($n/$height) * 100vh;
}
#map {
  width: 100%;
  height: 100vh;
}
.load-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: #091220;
  z-index: 98;
  top: 0;
  left: 0;
  div {
    width: inherit;
    height: inherit;
  }
}
.back_img {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: inline-block;
  z-index: 0;
}
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #000;
  background-image: url("../../assets/screen/background.png");
  background-size: cover;
  .layout {
    overflow-x: hidden;
    .header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: grid-width(2080);
      height: grid-height(127);
      background: linear-gradient(
        0deg,
        rgba(7, 58, 152, 0.6) 0%,
        rgba(7, 58, 152, 0.03) 67%
      );
      background-image: url("../../assets/screen/header.png");
      background-size: 100% 100%;
      color: #67d2ff;
      font-size: grid-width(24);
      font-weight: bold;
      font-family: PingFang SC, PingFang SC-Medium;
      z-index: 999;
      .left_title {
        position: absolute;
        top: grid-height(15);
        left: grid-width(31);
        img {
          height: grid-width(30);
          width: grid-width(30);
          margin-right: grid-width(10);
          vertical-align: middle;
        }
      }
      .project-Title {
        position: absolute;
        left: 50%;
        top: grid-height(18);
        transform: translateX(-50%);
        font-size: grid-width(44);
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: bold;
        color: #ffffff;
      }
      .time_data {
        position: absolute;
        top: grid-height(15);
        right: grid-width(100);
        margin-right: 76px;
        p {
          font-size: grid-width(24);
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: bold;
        }
        img {
          width: 22px;
          height: 22px;
          margin-right: 10px;
          margin-left: 68px;
        }
        p > img {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .login_out {
        position: absolute;
        top: grid-height(16);
        right: grid-width(24);
        width: grid-width(90);
        font-size: grid-width(24);
        cursor: pointer;
        justify-content: center;
        z-index: 999;
        // p > i {
        //   display: inline-block;
        //   vertical-align: middle;
        // }
        .iconfont {
          font-size: grid-width(22) !important;
          margin-right: 8px;
          font-weight: 500;
        }
      }
    }
  }
}
.layout-left {
  flex: 1;
  display: flex;
  flex-flow: column;
  position: absolute;
  width: grid-width(515);
  height: 100vh - grid-height(85);
  top: grid-height(70);
  left: grid-width(20);
  transition: all linear 0.2s;
  z-index: 8;
}
.layout-right {
  flex: 1;
  display: flex;
  flex-flow: column;
  position: absolute;
  width: grid-width(515);
  height: 100vh - grid-height(85);
  top: grid-height(70);
  right: grid-width(20);
  transition: all linear 0.2s;
  z-index: 8;
}
.flex_1 {
  flex: 1;
}
.layout-bottom {
  position: absolute;
  width: grid-width(979);
  // height: 100vh - grid-height(85);
  // padding-top: grid-height(740);
  height: grid-height(324);
  bottom: grid-height(15);
  left: grid-width(550);
  transition: all linear 0.2s;
  color: #9df0ff;
  z-index: 8;
}
</style>
