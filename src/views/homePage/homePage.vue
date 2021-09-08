<template>
  <div class="layout-content container" v-loading='allLoading'>
    <el-row :gutter="10" class="min-1000">
      <el-col :span="10" class="flex-column">
        <div class="common-layout">
          <div class="ellipsis">
            <div><span class="iconfont icon_color_40 icon-xuexiao"></span><span>{{ scenDataInfo.name }}</span></div>
          </div>
          <div class="school-img">
            <el-row class="panel-group">
              <el-col :span="24" class="card-panel-col">
                <el-carousel height="201px" indicator-position="none">
                  <el-carousel-item v-for="(item, i) in scenDataInfo.imageUrlList" :key="i">
                    <img style="width: 100%; height: 258px" class="scene-image" :src="item" alt />
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>
          </div>
          <div class="build">
            <div class="build-col big_col">
              <div class="title"><span class="iconfont icon_color_63 icon-xueshengzhongshu"></span><span>学生总数/在校</span></div>
              <div class="count-style"><span class="all-student">{{ indexData.studentCount }}</span>
                <el-divider class="divider" direction="vertical"></el-divider><span class="in-school">{{ indexData.inSchoolStudent }}</span>
              </div>
            </div>
            <div class="build-col">
              <div class="title"><span class="iconfont icon_color_63 icon-jiaoshizhongshu"></span><span>教师总数</span></div>
              <div class="count-style">{{ indexData.teacherCount }}</div>
            </div>
            <div class="build-col">
              <div class="title"><span class="iconfont icon_color_63 icon-zhigongzhongshu"></span><span>职工总数</span></div>
              <div class="count-style">{{ indexData.workerCount }}</div>
            </div>
            <div class="build-col">
              <div class="title"><span class="iconfont icon_color_63 icon-loudongshu"></span><span>楼栋数</span></div>
              <div class="count-style">{{ indexData.buildingCount }}</div>
            </div>
            <div class="build-col">
              <div class="title"><span class="iconfont icon_color_63 icon-fangjianshu"></span><span>房间数</span></div>
              <div class="count-style">{{ indexData.roomCount }}</div>
            </div>
          </div>
        </div>
        <div class="common-layout">
          <div class="ellipsis">
            <div><span class="icon_color_40 el-icon-menu"></span><span>设备情况</span></div>
          </div>
          <div class="person-con flex">
            <div class="height device-con">
              <div class="total-con menjin">
                <span class="echart-title ">门禁</span>
                <span class="echart-value">{{indexData.deviceCount}}</span>
              </div>
              <pieChart style="height:200px" :value="indexData.deviceInfo" :color="'#33A5FE'" :pieName="'门禁设备'"></pieChart>
            </div>
            <el-divider class="divider_long" direction="vertical"></el-divider>
            <div class="height device-con">
              <div class="total-con">
                <span class="echart-title">摄像机</span>
                <span class="echart-value">{{indexData.cameraCount}}</span>
              </div>
              <pieChart style="height:200px" :value="indexData.cameraInfo" :color="'#1BB394'" :pieName="'摄像机设备'"></pieChart>
            </div>
          </div>
        </div>
        <div class="common-layout noBot" style="height:270px">
          <div class="ellipsis">
            <div><span class="iconfont icon_color_40 icon-tongxinqingkuang"></span><span>人员通行情况(近7天)</span></div>
          </div>
          <div class="liuliang-con">
            <lineChart style="height:200px" :id="'personPass'" :value="personpassInfo"></lineChart>
          </div>
        </div>
      </el-col>

      <el-col :span="9" class="flex-column">
        <div class="common-layout">
          <div class="ellipsis">
            <div><span class="iconfont icon_color_40 icon-zhuapaitu"></span><span>今日抓拍统计</span></div>
          </div>
          <div class="device">
            <div class="flex-one">
              <span class="capture-title">抓拍总数</span>
              <span class="capture-value">{{this.indexData.todayCapNoVehicle+this.indexData.todayCapPeople+this.indexData.todayCapVehicle}}</span>
            </div>
            <div class="flex-one" style="background:#ebf4ff">
              <span class="capture-title">抓拍人数</span>
              <span class="capture-value">{{this.indexData.todayCapPeople}}</span>
            </div>
            <div class="flex-one">
              <span class="capture-title">抓拍机动车</span>
              <span class="capture-value">{{this.indexData.todayCapVehicle}}</span>
            </div>
            <div class="flex-one" style="background:#ebf4ff">
              <span class="capture-title">抓拍非机动车</span>
              <span class="capture-value">{{this.indexData.todayCapNoVehicle}}</span>
            </div>
          </div>
        </div>
        <div class="common-layout">
          <div class="ellipsis">
            <div><span class="icon_color_40 el-icon-camera-solid"></span><span>抓拍情况(近7天)</span></div>
            <div class="showTab">
              <el-tabs v-model="activeName">
                <el-tab-pane label="人员抓拍" name="first"></el-tab-pane>
                <el-tab-pane label="车辆抓拍" name="second"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="bar-con" @tab-click="handleClick">
            <div v-if="activeName == 'first'">
              <lineChart v-if="this.hasPeoCap" style="height:243px" :id="'personCapture'" :value="personCapture"></lineChart>
              <div v-else class="empty"><img src="../../assets/no-data-alarm.png" alt="">
                <span>暂无数据</span>
              </div>
            </div>
            <div v-if="activeName == 'second'">
              <severalLine v-if="this.hasCapture" style="height:295px" :id="'severalLine'" :value="pictureInfo"></severalLine>
              <div v-else class="empty"><img src="../../assets/no-data-alarm.png" alt="">
                <span>暂无数据</span>
              </div>
            </div>
          </div>
        </div>
        <div class="common-layout noBot">
          <div class="ellipsis">
            <div><span class="iconfont icon_color_40 icon-yujing"></span><span>预警类型(近30天)</span></div>
            <div class="showTab">
              <span>已处理预警次数：</span>
              <div class="show_tab normal"></div>
              <span>预警次数：</span>
              <div class="show_tab formal"></div>
            </div>
          </div>
          <div class="warn-con">
            <div class="height" style="height: 290px" id="myCharts1"></div>
          </div>
        </div>
      </el-col>

      <el-col :span="5" class="flex-column">
        <div class="common-layout" style="height:253px">
          <div class="ellipsis">
            <div><span class="iconfont icon_color_40 icon-guanzhurenyuan"></span><span>关注人员</span></div>
          </div>
          <usernumPie :value="careInfo" style="height:204px"></usernumPie>
        </div>
        <div class="common-layout noBot" style="height:634px;min-width:325px">
          <div class="ellipsis">
            <div><span class="iconfont icon_color_40 icon-yujing"></span><span>预警信息</span></div>
            <span class="view-more" @click="toMore">查看更多<i class="el-icon-arrow-right"></i></span>
          </div>
          <div class="alarm-con" v-loading='showLoading'>
            <div class="alarm-one" v-for="(item,i) in alarmData" :key="i">
              <div class="lt"></div>
              <div class="rt"></div>
              <div class="lb"></div>
              <div class="rb"></div>
              <div class="flex">
                <div class="img-con" @click="alarmClick(item)">
                  <img :src="item.image" />
                </div>
                <ul class="info-data">
                  <li :class="item.status!=='READ' && item.status!=='PROCESSED' ? 'redSpan one-data' : 'one-data'">
                    <span class="iconfont icon-yujing alarm-icon"></span><span>{{item.warnType | warnTypeFilter}}</span>
                  </li>
                  <li class="one-data">
                    <span class="icons_3"><i class="iconfont icon-camera-"></i></span><span style="display:inline-block;width:calc(100% - 30px);" class="word-hidden" :title="item.deviceName">{{item.deviceName}}</span>
                  </li>
                  <li class="one-data">
                    <span class="icons_1"><i class="iconfont icon-Vector"></i></span>
                    <span class="time" :title="item.warnTime">{{item.warnTime}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <person-detail :visible="dialogDetail.dialogVisible" :form="dialogDetail.detail" :hidePersonInfo="true" :hideHandle='false' :hideOriginalFace="true" :hideTrack="true" @close="handleClose" @closeAll="closeAll"></person-detail>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
import { getIndexData, getScene, getZpData, getSchoolData, getPassData, getDeviceData, getDeviceAlarmData } from "@/api/screenApi.ts";
const PersonDetail = () => import("../security/alarm/component/DialogPersonDetail.vue");

import pieChart from "./components/pieChart.vue"
import lineChart from "./components/lineChart.vue"
import severalLine from "./components/severalLine.vue"
import usernumPie from "./components/usernumPie.vue"

require("echarts/theme/macarons"); // echarts theme
import {
  setRead,
  deviceWarnPage
} from "@/api/dev";
import { getToken, getSceneId } from "@/utils/auth";
import { format, parse, subDays } from "date-fns";
import config from "@/api/config";
var _token = getToken(); // 要保证取到
var _scenceId = getSceneId();
export default {
  data() {
    return {
      alarmData: [],//预警数据
      dialogDetail: {
        detail: {},
        dialogVisible: false
      },
      allLoading: false,
      showLoading: false,
      addCountImg: 0,

      allcountsImg: 0,
      indexData: {
        studentCount: "0",
        teacherCount: "0",
        workderCount: "0",
        deviceInfo: [],
        cameraInfo: [],
        deviceCount: "0",
        cameraCount: "0",
        buildingCount: "0",
        todayCapPeople: 0,
        todayCapVehicle: 0,
        todayCapNoVehicle: 0,
        roomCount: "0",
        todayPassCount: "0",
        capMessageCount: "0",
      },
      activeName: 'first',
      hasPeoCap: true,
      personCapture: {
        date: [],
        value: [],
      },
      hasCapture: true,
      pictureInfo: {
        date: [],
        car: [],
        noCar: [],
      },

      personpassInfo: {
        date: [],
        value: [],
      },
      careInfo: {
        data: [],
        allNum: 0
      },
      typeMap: {
        DEVICE_DOWN: "设备离线预警",
        STRANGER: "陌生人预警",
        NOT_BACK: "未归预警",
        LATE_BACK: "晚归预警",
        CARE_MAN: "关注人员预警",
        AREA: "区域预警",
        MOUSE: "厨房老鼠预警",
        CHEF_HAT: "厨师帽预警",
        // CHEF_CLOTHES:"厨师服预警",
        // FACE_MASK:"厨师口罩预警",
        VOICE_ALERT: "声音预警",
      },
      scenDataInfo: {},
      defautBanner: [
        require("../../assets/home_banner1.png"),
        require("../../assets/home_banner2.png"),
        require("../../assets/home_banner3.png"),
        require("../../assets/home_banner4.png"),
        require("../../assets/home_banner5.png"),
        require("../../assets/home_banner6.png"),
      ],
      myCharts1: null, // 柱状图
      option1: {
        color: [
          "#56B972",
          "#66b1ff",
          "#56B972",
          "#66b1ff",
        ],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          show: false,
          // data: ["已处理预警次数", "预警次数"],
          // right: "10%",
        },
        grid: {
          top: '8%',
          left: "3%",
          bottom: "8%",
          show: true,
          containLabel: true,
          borderWidth: '0',
          borderColor: 'transparent'
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          nameTextStyle: {
            color: "#6A7E92",
            fontWeight: '500',
            fontSize: '14'
          },
        },
        yAxis: {
          type: "category",
          name: "",
          nameTextStyle: {
            color: "#6A7E92",
            fontWeight: '600',
            fontSize: '14',
            show: false,
          },
          itemStyle: {
            color: '#6a7e92',
            fontSize: '12',
            show: false,
          },
          data: ["陌生人预警", "晚归预警", "未归预警", "关注人员预警"],
        },
        series: [
          {
            name: "预警次数",
            type: "bar",
            stack: "total",
            // barWidth: "30",
            data: [0, 0, 0],
            itemStyle: {
              normal: {
                color: '#66B1FF',
                label: {
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value + '次';
                    } else {
                      return " ";
                    }
                  },
                  show: true, //开启显示
                  position: ["101%", "40%"], //在上方显示
                },
              },
            },
          },
          {
            name: "已处理预警次数",
            type: "bar",
            // barWidth: "30",
            barGap: "-100%",
            stack: "11",
            data: [0, 0, 0],
            itemStyle: {
              color: '#56B972',
              normal: {
                label: {
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value + '次';
                    } else {
                      return " ";
                    }
                  },
                  color: '#fff',
                  show: false, //开启显示
                  position: ["10%", "40%"], //在上方显示
                },
              },
            },
          },
        ],
      },
      inter: null,
      path: config.wsURL
    };
  },
  filters: {
    deviceTime(val) {
      val = val.split(".")[0];
      return val;
    },
    statusFilterType(status) {
      /** @description 状态显示过滤 */
      const data = {
        WAITING: "danger",
        PROCESSED: "success",
        PROCESSING: "",
        IGNORE: "info",
      };
      return data[status];
    },
    warnTypeFilter(type) {
      const data = {
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
  components: {
    pieChart,
    lineChart,
    severalLine,
    usernumPie,
    PersonDetail
  },

  async created() {
    const { data } = await getScene();
    this.scenDataInfo = Object.assign({}, data.data);
    localStorage.setItem('name', this.scenDataInfo.name) //保存到localStorage
    this.getAlarmData();
    this.getIndexData();
    if (this.scenDataInfo.imageUrlList.length === 0) {
      this.scenDataInfo.imageUrlList = this.defautBanner;
    }
    localStorage.setItem('img', this.scenDataInfo.imageUrlList[1]) //保存到localStorage
    this.path = config.wsURL + _scenceId + "/" + _token;
    this.initSocket();
  },
  mounted() {
    const timer = setInterval(() => {
      if (this.socket) {
        this.socket.send("It`s a heart Beat");;
      }
    },30000)
    this.$once('hook:beforeDestory',()=>{
      clearInterval(timer)
    })
  },
  methods: {
    handleClose() {
      this.dialogDetail.detail = {};
      this.dialogDetail.dialogVisible = false;
    },
    // 保存预警处理
    closeAll() {
      this.dialogDetail.detail = {};
      this.dialogDetail.dialogVisible = false;
      this.getAlarmData()
    },
    handleClick() { },
    getIndexData() {
      this.allLoading = true;
      //抓拍
      getZpData().then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.indexData.todayCapPeople = data.todayCatch.todayCapPeople;
          this.indexData.todayCapVehicle = data.todayCatch.todayCapVehicle;
          this.indexData.todayCapNoVehicle = data.todayCatch.todayCapNoVehicle;
          this.indexData.sevenNoVehicleArrest = data.sevenNoArrest;
          this.indexData.sevenVehicleArrest = data.sevenArrest;
          this.indexData.sevenPeopleArrest = data.peopleResult;

          this.pictureInfo.car = []
          this.pictureInfo.noCar = []
          this.pictureInfo.date = [];
          if (this.indexData.sevenPeopleArrest && this.indexData.sevenPeopleArrest.constructor === Object &&
            Object.keys(this.indexData.sevenPeopleArrest).length > 0) {
            this.hasPeoCap = true;
            for (let item in this.indexData.sevenPeopleArrest) {
              this.personCapture.date.push(item);
              this.personCapture.value.push(this.indexData.sevenPeopleArrest[item]);
            }
          } else {
            this.hasPeoCap = false;
          }
          if (this.indexData.sevenVehicleArrest && this.indexData.sevenNoVehicleArrest &&
            (Object.keys(this.indexData.sevenVehicleArrest).length > 0 || Object.keys(this.indexData.sevenNoVehicleArrest).length > 0)) {
            this.hasCapture = true;
            for (let item in this.indexData.sevenVehicleArrest) {
              this.pictureInfo.date.push(item);
              this.pictureInfo.car.push(this.indexData.sevenVehicleArrest[item]);
            }
            for (let item in this.indexData.sevenNoVehicleArrest) {
              this.pictureInfo.noCar.push(this.indexData.sevenNoVehicleArrest[item]);
            }
          } else {
            this.hasCapture = false;
          }
        }

      })
      //学校信息
      getSchoolData().then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.indexData.buildingCount = data.buildingCount;
          this.indexData.studentCount = data.inSchoolStudent + data.outSchoolStudent;
          this.indexData.inSchoolStudent = data.inSchoolStudent;
          this.indexData.outSchoolStudent = data.outSchoolStudent;
          this.indexData.roomCount = data.roomCount;
          this.indexData.teacherCount = data.teacherCount;
          this.indexData.workerCount = data.workerCount;
        }
      })
      // 通行情况
      getPassData().then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;

          let addAll = 0;
          if (data.carePeople) {
            for (let item in data.carePeople) {
              addAll = addAll + parseInt(data.carePeople[item]);
              this.careInfo.data.push({
                value: data.carePeople[item],
                name: item,
              });
            }
            this.careInfo.allNum = addAll
          }

          if (data.passTendency) {
            for (let item in data.passTendency) {
              this.personpassInfo.date.push(item);
              this.personpassInfo.value.push(data.passTendency[item]);
            }
          }
        }
      })
      // 设备信息
      getDeviceData().then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.indexData.cameraCount = data.cameraCount;
          this.indexData.deviceCount = data.deviceCount;
          this.indexData.deviceInfo.push({
            name: '在线', value: data.onlineDeviceCount
          })
          this.indexData.deviceInfo.push({
            name: '离线', value: data.deviceCount - data.onlineDeviceCount
          })
          this.indexData.cameraInfo.push({
            name: '在线', value: data.onlineCameraCount
          })
          this.indexData.cameraInfo.push({
            name: '离线', value: data.cameraCount - data.onlineCameraCount
          })
        }

      })
      //
      getDeviceAlarmData().then(res => {
        if (res.data.code == 200) {
          let data = res.data.data;
          this.initChart1(
            data.readWarnType,
            data.warnType
          );
        }
      })
      setTimeout(() => {
        this.allLoading = false;
      }, 300)
    },
    initChart1(read, all) {
      // 堆叠柱状图
      this.option1.yAxis.data = [];
      let strArr = [];
      let valueArr = [];
      if (all) {
        for (let item in all) {
          valueArr.push(all[item] || 0);
        }
        valueArr.sort((a, b) => {
          return a - b;
        });
        valueArr.forEach((ite, i) => {
          for (let item in all) {
            if (all[item] == ite && !strArr[i] && strArr.indexOf(item) === -1) {
              strArr[i] = item;
            }
          }
        });
        this.option1.series[0].data = [];
        this.option1.series[1].data = [];
        strArr.forEach((itn, it) => {
          this.option1.yAxis.data.push(this.typeMap[itn]);
          if (read) {
            this.option1.series[1].data[it] = read[itn] || 0;
          }
        });
        this.option1.series[0].data = valueArr;
      }

      this.myCharts1 = echarts.init(document.getElementById("myCharts1"));
      this.myCharts1.setOption(this.option1);
    },

    alarmClick(item) {
      this.dialogDetail.detail = { ...item };
      this.dialogDetail.dialogVisible = true;
      if (item.status === "WAITING") {
        this.changeStatus(item, 0, "notip");
      }
    },
    //修改未读状态
    changeStatus(row, status, tip) {
      // tip 是否提示
      let arr = [];
      if (status) {
        this.alarmData.map((item) => {
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
      row.status = 'READ';
      setRead(arr)
        .then((res) => {
          if (tip === "notip" && res.data.data === true) {
            row.status = 'READ';
            this.getAlarmData()
            this.getUnchecedCount();
          }
        })
        .catch((err) => {
          row.status = "WAITING";
        });
    },
    async getUnchecedCount() {
      /** @description 未读警报信息 */
      this.$store.dispatch("GET_WARNING");
    },
    getAlarmData() {
      let param = {
        limit: 10,
        page: 1,
        includeUserInfo: true,
        neWords: ['DEVICE_DOWN', 'VOICE_ALERT']
      };
      deviceWarnPage(param)
        .then((res1) => {
          const res = res1.data;
          this.alarmData = res.data.records;
        })
        .catch((err) => {
          this.alarmData = [];
        });
    },
    toMore() { // 更多预警
      this.$router.push("/security/alarm");
    },
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
    },
    openSocket() {
      console.log("socket连接成功");
      console.log(this.socket.readyState);
      this.socket.send("连接成功");
    },
    errorSocket() {
      console.log("socket连接错误");
    },
    getSocketMessage(data) {
      console.log(data);
      if (data) {
        let data1 = JSON.parse(data.data)
        if (data1.warnType && data1.warnType !== 'DEVICE_DOWN' && data1.warnType !== 'VOICE_ALERT') {
          this.alarmData.unshift(data1);
          this.alarmData.pop();
        }

      }
    },
    sendSocket() {
      this.socket.send();
    },
    socketClose() {
      console.log("socket已经关闭");
    }
  },
  destroyed() {
    clearInterval(this.inter);
    this.inter = null;
    if(this.socket) {
      this.socket.onclose = this.socketClose;
    }
    

  }
};
</script>

<style lang="scss">
.showTab {
  .el-tabs__item {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
}
</style>

<style lang="scss" scoped>
.container {
  background-color: #f0f2f5;
  position: relative;
  overflow-y: auto;
  overflow-x: auto;
  padding: 10px;
  padding-bottom: 0;
  color: #333;
  .min-1000 {
    min-width: 1600px;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .count-style {
    font-weight: bold;
    font-size: 20px;
  }
  .build {
    font-size: 14px;
    padding: 0 10px 5px;
    display: flex;
  }
  .build-col {
    width: 17.5%;
    height: 80px;
    margin-right: 1.25%;
    padding: 10px;
    background: rgba(224, 225, 227, 0.2);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
    .title {
      color: #63779e;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 15px;
      .icon {
        display: inline-block;
        width: 16px;
        height: 13px;
      }
    }
    .count-style {
      text-align: center;
      font-size: 20px;
      color: #308ae7;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      .all-student {
        color: #6a7e92;
      }
      .divider {
        height: 15px;
        top: -2px;
        background: #b1bdca;
      }
    }
  }
  .build-col:first-child {
    width: 25%;
  }
  .build-col:last-child {
    margin-right: 0;
  }
  .device {
    display: flex;
    padding: 20px 6px;
    .flex-one {
      width: 143px;
      height: 75px;
      display: flex;
      margin-left: 5px;
      flex-direction: column;
      background: #f5f9ff;
      padding: 10px;
      .capture-title {
        color: #313640;
        font-size: 14px;
      }
      .capture-value {
        font-size: 24px;
        color: #308ae7;
      }
    }
  }
  .bar-con {
    height: 300px;
    margin-top: 20px;
    padding: 0 10px;
  }
  .warn-con {
    height: 308px;
    margin-top: 20px;
    padding: 0 10px;
  }
  .pie-con {
    text-align: center;
    margin-top: 20px;
    .circle-style {
      margin: 0 auto;
      margin-top: 90px;
      width: 150px;
      height: 150px;
      border: 2px solid #adadad;
      border-radius: 100%;
      line-height: 150px;
    }
  }
}
.common-layout {
  background: #fff;
}
.common-layout {
  font-size: 18px;
  margin-bottom: 10px;
  border: 1px solid #e4e7ed;
  .ellipsis {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    font-weight: 700;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
    color: #313640;
    border-bottom: 1px solid #e4e7ed;
    .icon {
      display: inline-block;
      width: 14px;
      height: 16px;
    }
  }
  .showTab {
    display: flex;
    padding-right: 25px;
    height: 36px;
    color: #6a7e92;
    font-size: 12px;
    font-weight: 500;
    .show_tab {
      height: 12px;
      width: 22px;
      margin-top: 12px;
    }
    .normal {
      background-color: #56b972;
      margin-right: 30px;
    }
    .formal {
      background-color: #66b1ff;
    }
  }
  .school-img {
    font-size: 16px;
    padding: 10px 10px 5px 10px;
  }
  .school-num {
    line-height: 30px;
    margin-top: 30px;
  }
}
.noBot {
  margin-bottom: 0px;
}
.right-panel {
  background: #fff;
  height: inherit;
}
.person-con {
  margin: 15px 0;
  justify-content: space-around;
  color: #313640;
  font-size: 14px;
  text-align: center;
  .one-col {
    width: 33%;
    .value {
      font-size: 24px;
      font-weight: 600;
      color: #308ae7;
    }
  }
  .divider_long {
    height: 200px;
    background: #e4e7ed;
  }
}
.liuliang-con {
  padding: 0px 30px;
  height: 200px;
}
.icon_color_40,
.icon_color_63 {
  color: #409eff;
  font-size: 14px;
  margin-right: 3px;
}
.icon_color_63 {
  color: #63779e;
}
.device-con {
  width: 320px;
  position: relative;
  .total-con {
    position: absolute;
    top: 34%;
    left: 45%;
    display: flex;
    flex-direction: column;
    font-weight: 700;
    .echart-title {
      color: #63779e;
      font-size: 12px;
    }
    .echart-value {
      font-size: 24px;
      color: #308ae7;
    }
  }
  .menjin {
    left: 46%;
  }
}
.view-more {
  color: #6a7e92;
  font-weight: 400;
  cursor: pointer;
}
.alarm-con {
  padding: 5px 8px;
  overflow-y: auto;
  height: 590px;

  .alarm-one {
    position: relative;
    cursor: pointer;
    padding: 8px;
    margin-bottom: 10px;
    .lt {
      width: 15px;
      height: 15px;
      border: 0;
      border-top: 1px solid rgba(255, 96, 88, 0.1);
      border-left: 1px solid rgba(255, 96, 88, 0.1);
      position: absolute;
      top: 0;
      left: 0;
    }
    .rt {
      width: 15px;
      height: 15px;
      border-top: 1px solid rgba(255, 96, 88, 0.1);
      border-right: 1px solid rgba(255, 96, 88, 0.1);
      position: absolute;
      top: 0;
      right: 0;
    }
    .lb {
      width: 15px;
      height: 15px;
      border-bottom: 1px solid rgba(255, 96, 88, 0.1);
      border-left: 1px solid rgba(255, 96, 88, 0.1);
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .rb {
      width: 15px;
      height: 15px;
      border-bottom: 1px solid rgba(255, 96, 88, 0.1);
      border-right: 1px solid rgba(255, 96, 88, 0.1);
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .img-con {
      width: 117px;
      height: 117px;
      margin-right: 8px;
      flex: 0 0 117px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border: 1px solid #d8d8d8;
      }
    }
  }
}
.info-data {
  width:calc(100% - 123px);
  .one-data {
    height: 32px;
    line-height: 32px;
    margin-top: 8px;
    font-size: 13px;
    color: #6a7e92;
    display: flex;
    padding: 0 5px;
    background: #f5f6f6;
    .time {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .alarm-icon {
      font-size: 14px;
      margin-left: 4px;
      margin-right: 6px;
    }
    .icons_1 {
      width: 22px;
      display: flex;
      i {
        transform: scale(0.8);
      }
    }
    .icons_3 {
      width: 26px;
      display: flex;
      i {
        margin-left: -7px;
      }
    }
  }
  .redSpan {
    color: #ff3939;
  }
  .one-data:first-child {
    margin-top: 3px;
  }
}
.empty {
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-top: 68px;
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