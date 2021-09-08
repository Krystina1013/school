<template>
  <div>
    <el-dialog :title=" form.warnType | warnTypeFilter" :append-to-body='true' :visible="visible" :close-on-click-modal="false" :before-close="handleClose" v-if="form.warnType ==='DEVICE_DOWN'||form.warnType ==='VOICE_ALERT'" :class="form.warnType ==='DEVICE_DOWN'?'device-down':'voice-alarm'">
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
              <div v-if="form.warnType === 'VOICE_ALERT'" class="alarm-word commonRow">
                <div class="label">报警词：</div>
                <div class="value">
                  <span>
                    {{form.voiceKeyWord}}
                  </span>
                </div>
              </div>
              <div class="commonRow">
                <div class="label">预警时间：</div>
                <div class="value">
                  <span>
                    {{form.warnTime}}
                  </span>
                </div>
              </div>
              <div class="commonRow">
                <div class="label">设备名称：</div>
                <div class="value">
                  <span>{{
                    form.deviceName
                  }}</span>
                </div>
              </div>
              <div class="commonRow">
                <div class="label">预警类型：</div>
                <div class="value">
                  <span>
                    {{form.warnType | warnTypeFilter}}
                  </span>
                </div>
              </div>
              <div class="commonRow alert-data">
                <div class="label">预警信息：</div>
                <div class="value more-content">
                  <span :title="form.warnContent">
                    {{form.warnContent}}
                  </span>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="处理信息" v-if="form.status === 'PROCESSED'" name="second">
              <div class="fk-con">
                <div class="label">反馈内容：</div>
                <div class="value more-content fk-content">
                  <span>
                    {{form.remark || '--'}}
                  </span>
                </div>
              </div>
              <div class="fk-con">
                <div class="label">反馈图片：</div>
                <div class="value more-content">
                  <div v-if="form.processImages && form.processImages.length > 0">
                    <img class="fk-img" v-for="(item, i) in form.processImages" :key="i" :src="item" alt="" @click="bigImgClick(item)" />
                  </div>
                  <div v-else class="no-img">--</div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center" v-if="form && form.status !== 'PROCESSED'">
        <el-button type="primary" @click="handleDialogVisible = true">预警处理</el-button>
      </div>
    </el-dialog>

    <el-dialog v-else :title=" form.warnType | warnTypeFilter" :append-to-body='true' :close-on-click-modal="false" :class="(form.faceImg || form.humanImg)?'has-left':( form.warnType == 'NOT_BACK' || form.warnType == 'LATE_BACK')?'back-img': 'no-left'" :visible="visible" :before-close="handleClose">
      <div class="detail-container flex">
        <div class="left-layout" v-if="form.faceImg || form.humanImg">
          <div class="cap-img" v-if="form.faceImg">
            <div class="img-title">
              <span>» 抓拍图</span>
            </div>
            <div class="pic pic-center">
              <div>
                <img style="border: 1px solid rgb(216, 216, 216);" :src="form.faceImg" alt="" />
              </div>
            </div>
          </div>
          <div class="img-title" style="margin-top:12px" v-if="form.humanImg">
            <span>» 全身图</span>
          </div>
          <img style="border: 1px solid rgb(216, 216, 216);" class="personImg" v-if="form.humanImg" :src="form.humanImg" alt="" />
        </div>
        <div class="center-layout" v-if="form.panoramaImg || form.image">
          <div class="img-title">
            <span>» 全景图</span>
          </div>
          <img style="border: 1px solid rgb(216, 216, 216);" v-if="form.warnType == 'MOUSE' || form.warnType == 'NOT_BACK' || form.warnType == 'LATE_BACK' || form.warnType == 'CHEF_HAT'" :src="form.image" alt="" />
          <img style="border: 1px solid rgb(216, 216, 216);" v-if="form.warnType == 'STRANGER' || form.warnType == 'CARE_MAN' || form.warnType == 'AREA'" :src="form.panoramaImg" alt="" />
        </div>
        <div class="right-layout">
          <el-tabs v-model="activeName">
            <el-tab-pane label="预警信息" name="first">
              <div class="personDetail title-list">
                <h2 class="title">» 预警类型</h2>
                <div class="commonRow">
                  {{form.warnType | warnTypeFilter}}
                </div>
                <div class="commonRow" v-if="form.isOutStrange && form.warnType ==='STRANGER'">
                  校外陌生人
                </div>
                <div class="commonRow" v-if="!form.isOutStrange && form.warnType ==='STRANGER'">
                  非本楼栋人员
                </div>
              </div>
              <div class="personDetail title-list">
                <h2 class="title title-top">» 预警内容</h2>
                <div class="commonRow more-content">
                  {{form.warnContent}}
                </div>
              </div>
              <div class="cameraDetail title-list" v-if="form.warnType == 'CARE_MAN' ||form.warnType == 'NOT_BACK' || form.warnType == 'LATE_BACK' || form.warnType == 'AREA' ||  (form.warnType === 'STRANGER' && !form.isOutStrange )">
                <h2 class="title title-top">» 人员详情：</h2>
                <div class="commonRow">
                  <div class="label">姓名：</div>
                  <div class="value">
                    <span v-if="form.warnType === 'CARE_MAN' && form.alertPhotoVo" :title="form.alertPhotoVo.name || ''">{{
                        (form.alertPhotoVo && form.alertPhotoVo.name)?form.alertPhotoVo.name:'--'
                    }}</span>
                    <span v-else-if="form.name" :title="form.name">{{
                        form.name || '--'
                    }}</span>
                    <span v-else>--</span>
                  </div>
                </div>
                 <div class="commonRow" v-if="form.warnType === 'CARE_MAN'">
                  <div class="label">关注人员分组：</div>
                  <div class="value">{{ (form.alertPhotoVo && form.alertPhotoVo.alertTaskName)?form.alertPhotoVo.alertTaskName:'--'  }}</div>
                </div>
                <div class="commonRow" v-if="form.className">
                  <div class="label">班级：</div>
                  <div class="value">{{ form.className }}</div>
                </div>
                <div class="commonRow" v-if="form.studentNo ">
                  <div class="label">学号：</div>
                  <div class="value">{{ form.studentNo }}</div>
                </div>
                <div class="commonRow" v-if="form.phone">
                  <div class="label">手机号：</div>
                  <div class="value">{{ form.phone }}</div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="处理信息" v-if="form.status === 'PROCESSED'" name="second">
              <div class="cameraDetail title-list">
                <h2 class="title">» 反馈信息</h2>
                <div class="commonRow more-content" style="height:150px;overflow:auto;">
                  {{form.remark || '--'}}
                </div>
                <h2 class="title title-top">» 反馈图片</h2>
                <div class="commonRow fk-img-con" v-if="form.processImages && form.processImages.length > 0">
                  <img class="img" v-for="(item, i) in form.processImages" :key="i" :src="item" alt="" @click="bigImgClick(item)" />
                </div>
                <div v-else class="commonRow more-content">
                  --
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center" v-if="form && form.status !== 'PROCESSED' && !hideHandle">
        <el-button type="primary" @click="handleDialogVisible = true">预警处理</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :append-to-body='true' :close-on-click-modal="false" class="big-img-dialog" :visible.sync="bigImgVisible" :before-close="handleCloseBigImg">
      <img v-if="bigImgUrl" :src="bigImgUrl" alt="" class="big-img" />
    </el-dialog>

    <alarmDialog :visible="handleDialogVisible" :form="form" @close="handleDialogVisible = false" @update="confirmHandled"></alarmDialog>
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

import alarmDialog from "./handleAlarmDialog.vue";
@Component({
  components: { alarmDialog },
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
        DEVICE_STRANGER: "陌生人预警",
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
  @Prop({ default: false }) hideHandle: boolean; //隐藏轨迹搜索
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

  handleDialogVisible: boolean = false;
  confirmHandled(val) {
    this.handleDialogVisible = false;
    this.$emit('closeAll')
  }

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
      this.showVideo = false;
    });
  }
  seeVideo() {
    playBackTime({
      id: this.form["cameraId"],
      timestamp: this.form["time"],
    }).then((res) => {
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
.dialog-footer {
  text-align: center;
}
.pic-center {
  > div {
    margin: 0 auto;
    // text-align: center;
  }
}
.img-title {
  margin-bottom: 5px;
  display: flex;
  font-size: 12px;
  color: #606266;
  span {
    flex: 1;
  }
}
.left-layout {
  width: 168px;
  flex: 0 0 168px;
  margin-right: 20px;
  .personImg {
    width: 168px;
    height: 278px;
    object-fit: contain;
    border: 1px solid #d8d8d8;
  }
  // .borderColor {
  // border: 1px solid #d8d8d8;
  // }
  .cap-img {
    width: 100%;

    .pic {
      display: flex;
      height: 100%;
      > div {
        flex: 1;
      }
      .left {
        flex: 1;
        margin-right: 1px;
      }
      img {
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
    }
  }
  .similarityDegree {
    margin-top: 1px;
    margin-bottom: 5px;
    text-align: center;
  }
}
.center-layout {
  width: 737px;
  flex: 0 0 737px;
  height: 423px;
  margin-right: 20px;
  img {
    width: 100%;
    height: calc(100% - 8px);
    object-fit: contain;
  }
}
.back-img {
  .center-layout {
    width: 312px;
    flex: 0 0 312px;
    height: 423px;
    padding: 0;
    margin-right: 20px;
    img {
      width: 100%;
      height: calc(100% - 8px);
      object-fit: contain;
    }
  }
}
.right-layout {
  .title-list {
    .title {
      // margin-left: 10px;
      margin-bottom: 5px;
      display: flex;
      font-size: 12px;
      color: #606266;
    }
    .title-top {
      margin-top: 20px;
    }
  }
  // .cameraDetail {
  // margin-top: 15px;
  // }
  .commonRow {
    display: flex;
    margin-bottom: 5px;
    font-size: 12px;
    color: #606266;
    background: #f8f8f8;
    line-height: 28px;
    padding-left: 6px;
    padding-right: 6px;
    > .label {
      // width: 100px;
      text-align: right;
      font-weight: 600;
    }
    > .value {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .fk-img-con {
    padding: 4px 0;
    flex-wrap: wrap;
    img {
      width: 75px;
      height: 75px;
      object-fit: contain;
      margin-bottom: 5px;
      margin-right: 5px;
      border: 1px solid #d8d8d8;
    }
  }
  .fk-con {
    margin-bottom: 5px;
    font-size: 12px;
    color: #606266;
    background: #f8f8f8;
    line-height: 34px;
    padding: 0 6px 15px;
    display: block;
    .label {
      text-align: left;
    }
    .fk-content {
      height: 102px;
    }
    .fk-img {
      width: 87px;
      height: 87px;
      margin-right: 16px;
    }
    .fk-img:last-child {
      margin-right: 0;
    }
  }
  .more-content {
    line-height: 28px;
  }
}
.detail-container {
  color: #333;
  background: #fff;
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
    padding: 10px 24px;
    .right-layout {
      width: 100%;
      flex: auto;
      .commonRow {
        background: #f8f8f8;
        color: #606266;
        margin-bottom: 6px;
        > .label {
          // width: 100px;
          text-align: right;
          font-weight: 400;
        }
      }

      .alert-data {
        display: block;
        padding-bottom: 20px;
        .label {
          text-align: left;
        }
      }
    }
  }
}
.voice-alarm {
  /deep/.el-dialog {
    width: 900px;
  }
  /deep/.el-dialog__body {
    padding: 10px 24px;
    .right-layout {
      width: 100%;
      flex: auto;
      .commonRow {
        background: #f8f8f8;
        color: #606266;
        margin-bottom: 6px;
        > .label {
          // width: 100px;
          text-align: right;
          font-weight: 400;
        }
      }
      .alarm-word {
        background: rgba(255, 96, 88, 0.2);
        > .label {
          font-weight: 700;
        }
        > .value {
          font-weight: 700;
        }
      }
      .alert-data {
        display: block;
        height: 164px;
        padding-bottom: 20px;
        .label {
          text-align: left;
        }
        > .value {
          flex: 1;
          overflow: auto;
          white-space: normal;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
// .voice-alarm{
//   /deep/.el-dialog {
//     width: 676px;
//   }
//   /deep/.el-dialog__body{
//     padding:20px 24px;
//     .right-layout{
//       width: 306px;
//     }
//   }
// }
/deep/.el-dialog__header {
  background: #fff;
  padding: 10px 20px 10px !important;
  border-bottom: 1px solid #efefef;
}
/deep/.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #333;
}
/deep/.el-dialog__headerbtn {
  position: absolute;
  top: 9px;
  right: 7px;
  font-size: 20px;
}
::v-deep {
  .el-dialog__body,
  .el-dialog__footer {
    padding: 15px;
    padding-bottom: 20px;
    color: #333;
    background: #fff;
    .el-tabs__header {
      margin-bottom: 17px !important;
    }
    .el-tabs__nav .is-top {
      background: transparent;
    }
    .el-tabs__nav .el-tabs__active-bar {
      background: #409eff;
    }
  }
}
.person-con {
  margin-top: 15px;
}
.text-con {
  padding-left: 20px;
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
    border: 0;
  }
  /deep/.el-dialog__body {
    overflow-x: auto;
    padding: 15px;
    text-align: center;
  }
  .big-img {
    width: auto;
    height: 400px;
  }
}
.voice-con {
  width: 287px;
  height: 356px;
  background: #f8f8f8;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  img {
    margin-top: 75px;
    width: 145px;
    height: 145px;
  }
  .click-word {
    color: #606266;
    margin-top: 15px;
  }
}
</style>