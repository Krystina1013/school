<template>
  <div class="camera_dia">
    <el-dialog title=""  :visible="visible"  :close-on-click-modal="false" :append-to-body='true' :before-close="handleClose" v-if="form.warnType ==='DEVICE_DOWN'||form.warnType ==='VOICE_ALERT'" :class="form.warnType ==='DEVICE_DOWN'?'device-down':'voice-alarm'">
      <template slot="title">
        <i class="iconfont icon-shexiangji" style="margin-right:5px"></i>{{ form.warnType | warnTypeFilter }}
      </template>
      <div class="flex">
        <div class="voice-con" v-if="form.warnType === 'VOICE_ALERT'">
          <img v-if="!voicePlay" @click="playVoice(form.voiceUrl)" src="../../../../assets/voice-unplay.png" alt="" />
          <img v-else src="../../../../assets/voice-playing.png" alt="" />
          <div class="click-word">点击播放报警声音</div>
          <audio ref="audioId" style="display: none" controls>
            <source :src="form.voiceUrl" />
          </audio>
        </div>
        <div class="right-layout">
          <el-tabs v-model="activeName">
            <el-tab-pane label="预警信息" name="first">
              <div class="alarm_item long dark" style="margin-top:8px" v-if="form.warnType === 'VOICE_ALERT'">报警词：{{form.voiceKeyWord}} </div>
              <div class="alarm_item long">预警时间：{{form.warnTime}} </div>
              <div class="alarm_item long">设备名称：{{form.deviceName}} </div>
              <div class="alarm_item long">预警类型：{{form.warnType | warnTypeFilter}} </div>
              <div class="alarm_item long">设备名称：{{form.deviceName}} </div>
              <div class="alarm_item long high">预警信息：{{form.deviceName}} </div>
            </el-tab-pane>
            <el-tab-pane label="处理信息" v-if="form.status === 'PROCESSED'" name="second">
              <div class="card_title" style="margin-top:8px">» 反馈信息</div>
              <div class="alarm_item long high">{{form.remark || '--'}}</div>
              <div class="card_title" style="margin-top:26px">» 反馈图片</div>
              <div class="alarm_item long high fk-img-con" v-if="form.processImages && form.processImages.length > 0">
                <img class="fk-img" v-for="(item, i) in form.processImages" :key="i" :src="item" alt="" @click="bigImgClick(item)" />
              </div>
              <div v-else class="alarm_item long high">--</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center" v-if="form && form.status !== 'PROCESSED'">
        <!-- <el-button type="primary" @click="openHandle(form)">预警处理</el-button> -->
      </div>
    </el-dialog>

    <el-dialog v-else :close-on-click-modal="false" :append-to-body='true' :class="(form.faceImg || form.humanImg)?'has-left':( form.warnType == 'NOT_BACK' || form.warnType == 'LATE_BACK')?'back-img': 'no-left'" :visible="visible" :before-close="handleClose">
      <template slot="title">
        <i class="iconfont icon-shexiangji" style="margin-right:5px"></i>{{ form.warnType | warnTypeFilter }}
      </template>
      <div class="flex">
        <div class="left-layout" v-if="form.faceImg || form.humanImg">
          <div class="card_title">» 抓拍图</div>
          <div class="face_img" v-if="form.faceImg">
            <img :src="form.faceImg" alt="" />
          </div>
          <div class="card_title">» 全身图</div>
          <div class="personImg" v-if="form.humanImg">
            <img :src="form.humanImg" alt="" />
          </div>
        </div>

        <div class="center-layout" v-if="form.panoramaImg || form.image">
          <div class="card_title">» 全景图</div>
          <div class="all_img" v-if="form.panoramaImg || form.image">
            <img v-if="form.warnType == 'MOUSE' || form.warnType == 'NOT_BACK' || form.warnType == 'LATE_BACK' || form.warnType == 'CHEF_HAT'" :src="form.image" alt="" />
            <img v-if="form.warnType == 'STRANGER' || form.warnType == 'CARE_MAN' || form.warnType == 'AREA'" :src="form.panoramaImg" alt="" />
          </div>
        </div>

        <div class="right-layout">
          <el-tabs v-model="activeName">
            <el-tab-pane label="预警信息" name="first">
              <div class="card_title" style="margin-top:8px">» 预警类型</div>
              <div class="alarm_item" style="margin-top:16px">{{form.warnType | warnTypeFilter}}11</div>

              <div class="card_title" style="margin-top:26px">» 预警内容</div>
              <div class="alarm_item auto" style="margin-top:16px">{{form.warnContent}}11</div>

              <div class="card_title" style="margin-top:26px">» 摄像机详情</div>
              <div class="alarm_item" style="margin-top:16px">抓拍摄像机：{{form.deviceName || '--'}} </div>
              <div class="alarm_item">抓拍地址：{{form.address || '--'}} </div>
              <div class="alarm_item">抓拍时间：{{form.warnTime || '--'}} </div>
            </el-tab-pane>
            <el-tab-pane label="处理信息" v-if="form.status === 'PROCESSED'" name="second">
              <div class="card_title" style="margin-top:8px">» 反馈信息</div>
              <div class="alarm_item fk-img-con" style="margin-top:16px">{{form.remark || '--'}}</div>

              <div class="card_title" style="margin-top:26px">» 反馈图片</div>
              <div class="alarm_item fk-img-con" style="margin-top:16px" v-if="form.processImages && form.processImages.length > 0">
                <img class="img" v-for="(item, i) in form.processImages" :key="i" :src="item" alt="" @click="bigImgClick(item)" />
              </div>
              <div v-else class="alarm_item">--</div>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
      <div slot="footer" class="dialog-footer"></div>
      <!-- <div slot="footer" class="dialog-footer" style="text-align:center" v-if="form && form.status !== 'PROCESSED'">
        <el-button type="primary" @click="openHandle(form)">预警处理</el-button>
      </div> -->
    </el-dialog>

    <el-dialog title="" :close-on-click-modal="false" :append-to-body='true' class="big-img-dialog" :visible.sync="bigImgVisible" :before-close="handleCloseBigImg">
      <img v-if="bigImgUrl" :src="bigImgUrl" alt="" class="big-img" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  getBase64,
  getTimeByTimeStamp,
  getSimilarityDisplay,
} from "@/utils/index.js";
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";

import { playBackTime } from "@/api/police";
import config from "@/api/config";
import { Form } from "element-ui";
@Component({
  components: {},
  filters: {
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
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: false }) hideOriginalFace: boolean; //隐藏原图像
  @Prop({ default: false }) hidePersonInfo: boolean; //隐藏人员详情
  @Prop({ default: false }) hideTrack: boolean; //隐藏轨迹搜索
  @Prop({ default: {} }) form: object;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  ruleForm: object = {
    similarity: 0,
  };
  dialogFacialFeature: any = {
    show: false,
    form: {},
  };
  dialogHumanCharacteristics: any = {
    visible: false,
    form: {},
  };
  dialogAddImportant: any = {
    visible: false,
    form: {},
  };
  videoUrl: any = {};
  showVideo: boolean = false;
  activeName: string = "first";
  bigImgVisible: boolean = false;
  bigImgUrl: string = "";
  voicePlay: boolean = false;
  handleCloseBigImg() {
    this.bigImgVisible = false;
  }
  bigImgClick(item) {
    this.bigImgVisible = true;
    this.bigImgUrl = item;
  }
  handleClose() {
    this.showVideo = false;
    this.activeName = "first";
    this.$emit("close");
  }
  getSimilarityDisplay(val) {
    return getSimilarityDisplay(val);
  }
  //轨迹搜索
  goTrack() {
    const params = {
      faceUrl: this.form["faceInfo"].faceUrl,
    };
    this.$emit("trackSearch", params);
  }
  // 改样式之前的添加
  handleCommand(action) {
    if (action == "important") {
      this.dialogAddImportant.visible = true;
      this.dialogAddImportant.form = this.form;
    }
  }
  // 添加关注人员
  important() {
    this.dialogAddImportant.visible = true;
    this.dialogAddImportant.form = this.form;
  }
  seeImg() {
    this.$nextTick(() => {
      // this.$refs.reflv["flv_destroy"]();
      this.showVideo = false;
    });
  }
  seeVideo() {
    console.log(this.form);
    playBackTime({
      id: this.form["cameraId"],
      timestamp: this.form["time"],
    }).then((res) => {
      console.log(res.data.data);
      if (res.data.data && res.data.data.length) {
        this.showVideo = true;
        this.videoUrl = res.data.data[0];
        this.$nextTick(() => {
          this.$refs.video["play"]();
        });
        return;
      }
      this.$message.error("暂无视频");
    });
  }
  getTimeByTimeStamp(val) {
    return getTimeByTimeStamp(val);
  }
  openHandle(form) {
    this.$parent["openHandle"](form);
  }
  // 播放预警声音
  playVoice(vedioUrl) {
    this.voicePlay = true;
    this.$refs["audioId"]["src"] = vedioUrl;
    this.$refs["audioId"]["play"]();
    let audioEle = this.$refs["audioId"];
    audioEle["addEventListener"]("ended", () => {
      this.voicePlay = false;
    });
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .el-dialog__header {
    height: 44px;
    padding: 9px 17px;
    background-color: #172139;
    border-bottom: 1px solid #3c4a64;
    font-size: 18px;
    font-family: Noto Sans SC, Noto Sans SC-Regular;
    font-weight: 400;
    color: #7de0ff;
  }
  .el-dialog__headerbtn {
    top: 14px;
    .el-dialog__close {
      color: #7de0ff;
    }
  }
  .el-dialog__body {
    padding: 20px;
    background-color: #172139;
  }
  .el-dialog__footer {
    background-color: #172139;
  }

  .el-tabs__item {
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #8ba0ca;
  }
  .el-tabs__item.is-active {
    color: #7de0ff;
    font-weight: 700;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #344973;
  }
  .el-tabs__active-bar {
    height: 1px;
  }
}
</style>

<style lang="scss" scoped>
.left-layout {
  width: 202px;
  height: 400px;
  margin-top: 13px;
  .face_img {
    height: 97px;
    width: 97px;
    margin-bottom: 12px;
  }
  .personImg {
    width: 182px;
    height: 247px;
    object-fit: contain;
  }
  img {
    width: 100%;
    height: 100%;
    border: 1px solid #112957;
  }
}
.center-layout {
  width: 692px;
  height: 400px;
  margin-top: 13px;
  .all_img {
    width: 672px;
    height: 378px;
    border: 1px solid #112957;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.right-layout {
  width: 226px;
  height: 400px;
  margin-top: 13px;
  .alarm_item {
    width: 215px;
    height: 34px;
    line-height: 34px;
    background: #273d65;
    margin-left: 10px;
    margin-bottom: 4px;
    padding: 0 6px;
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #d6e3ff;
  }
  .auto {
    height: auto;
    line-height: 20px;
    padding: 9px 6px;
  }
  .long {
    width: 306px;
  }
  .dark {
    background: rgba(255, 96, 88, 0.2);
  }
  .high {
    height: 114px;
  }
  .fk-img-con {
    flex-wrap: wrap;
    height: auto;
    max-height: 135px;
    overflow-y: auto;
    padding: 11px 6px;
    line-height: 20px;
    img {
      width: 75px;
      height: 75px;
      object-fit: contain;
      margin-bottom: 5px;
      margin-right: 5px;
      border: 1px solid #112957;
    }
  }
}

.voice-con {
  width: 287px;
  height: 339px;
  padding: 0 71px;
  margin-top: 13px;
  background: #273d65;
  text-align: center;
  margin-right: 30px;
  img {
    margin-top: 58px;
    width: 145px;
    height: 145px;
  }
  .click-word {
    color: #d6e3ff;
    margin-top: 15px;
  }
}

.card_title {
  height: 17px;
  font-size: 12px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #7de0ff;
  margin-bottom: 5px;
}

.dialog-footer {
  text-align: center;
}

.has-left {
  /deep/.el-dialog {
    width: 1218px;
  }
}
.no-left {
  /deep/.el-dialog {
    width: 1028px;
  }
}
.back-img {
  /deep/.el-dialog {
    width: 606px;
    .right-layout {
      height: 442px;
    }
  }
}
.device-down {
  /deep/.el-dialog {
    width: 676px;
  }
  /deep/.el-dialog__body {
    padding: 20px;
    .right-layout {
      width: 100%;
      flex: auto;
    }
  }
}
.voice-alarm {
  /deep/.el-dialog {
    width: 676px;
  }
  /deep/.el-dialog__body {
    padding: 20px;
    .right-layout {
      width: 100%;
      flex: auto;
    }
  }
}

.right-layout {
  width: 240px;
  flex: 0 0 240px;
}
.img {
  width: 76px;
  height: 76px;
  object-fit: contain;
  cursor: pointer;
}
.big-img-dialog {
  /deep/.el-dialog__header {
    padding: 0;
    border: 0;
  }
  .big-img {
    width: auto;
    text-align: center;
    display: block;
    margin: 0 auto;
    height: 400px;
  }
}
</style>