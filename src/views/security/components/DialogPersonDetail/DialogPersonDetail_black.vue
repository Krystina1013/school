<template>
  <div class="camera_dia">
    <el-dialog title="抓拍详情" :append-to-body='true' :visible="visible" width="1120px" :before-close="handleClose">
      <template slot="title">
        <i class="iconfont icon-zhuapaitu1" style="margin-right:5px"></i>抓拍详情
      </template>
      <div class="flex">
        <div class="left-layout" v-if="form.faceInfo">
          <div v-if="!hideOriginalFace" class="cap-img">
            <div style="float:left">
              <div class="card_title">» 原像图</div>
              <div class="face_img">
                <img src="" alt="" />
              </div>
            </div>
            <div style="float:right">
              <div class="card_title">» 抓拍图</div>
              <div class="face_img">
                <img v-if="form.faceInfo" :src="form.faceInfo.faceUrl" alt="" />
              </div>
            </div>
          </div>
          <div v-else class="cap-img">
            <div class="card_title">» 抓拍图</div>
            <div class="face_img">
              <img v-if="form.faceInfo" :src="form.faceInfo.faceUrl" alt="" />
            </div>
          </div>
          <div class="similarityDegree" v-if="!hideOriginalFace">
            相似度:{{ getSimilarityDisplay(ruleForm.similarity) }}
          </div>
          <div class="card_title" v-if="form.humanInfo">» 全身图</div>
          <div class="personImg"  v-if="form.humanInfo">
            <img v-if="form.humanInfo && form.humanInfo.humanImg" :src="form.humanInfo.humanImg" alt="" />
          </div>
        </div>

        <div class="center-layout">
          <div class="card_title">» 全景图</div>
          <div class="all_img">
            <img v-if="form.faceInfo && !showVideo" :src="form.faceInfo.panoramaImg" alt="" />
            <div v-if="showVideo" style="height:378px; width:672px;">
              <Video data-name="single" v-if="videoUrl" :style="{ width: '100%', height: '100%' }" :height="height_w - 500" :url="videoUrl" ref="video" :name="1"></Video>
            </div>
          </div>
        </div>

        <div class="right-layout">
          <div v-if="!hidePersonInfo">
            <div class="card_title">» 人员信息</div>
            <div class="alarm_item">姓名：{{ ruleForm.name }} </div>
            <div class="alarm_item">国籍：{{ ruleForm.country }} </div>
            <div class="alarm_item">电话：{{ ruleForm.phone }} </div>
            <div class="alarm_item">证件类型：{{ ruleForm.cardType }} </div>
            <div class="alarm_item">证件号码：{{ ruleForm.cardNo }} </div>
            <div class="alarm_item">出生日期：{{ ruleForm.birthday | date }} </div>
            <div class="alarm_item">住址：{{ ruleForm.address }} </div>
            <div class="alarm_item">工作单位：{{ ruleForm.jobAddress }} </div>
            <div class="alarm_item">籍贯：{{ ruleForm.homeTown }} </div>
            <div class="alarm_item aotu">备注：{{ ruleForm.remark }}未付服务费嘎发送到范德萨发顺丰是dvf </div>
          </div>
          <div class="card_title">» 摄像机详情</div>
          <div v-if="form.cameraCutVo">
            <div class="alarm_item">抓拍摄像机：{{ form.cameraCutVo.name || '--' }} </div>
            <div class="alarm_item" v-if="form.cameraCutVo.addr">抓拍地址：{{ form.cameraCutVo.addr || '--' }} </div>
            <div class="alarm_item">抓拍时间：{{ getTimeByTimeStamp(form.time) }} </div>
          </div>
          <div class="alarm_item">证件类型：{{ ruleForm.cardType }} </div>
          <div class="card_title" style="margin-top:26px">» 人员信息</div>
          <div class="alarm_item" v-if="form.goodFace === 0 && form.scenceUserList.length  === 0">非清晰人脸</div>
          <div class="alarm_item" v-if="form.goodFace === 1 && form.scenceUserList.length  === 0">陌生人</div>
          <div class="type-one-con">
            <div class="type-one" v-for="(item,i) in form.scenceUserList" :key='i'>
              <div class="commonRow" v-if="item.scenceUserType">
                <div class="label">人员类型：</div>
                <div class="value">
                  <span :title="item.scenceUserType">{{
                      item.scenceUserType
                    }}</span>
                </div>
              </div>
              <div class="commonRow" v-if="item.name">
                <div class="label">姓名：</div>
                <div class="value">
                  <span v-if="item.name" :title="item.name">{{
                      item.name
                    }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow" v-if="item.workerGroupName && item.scenceUserType ==='关注人员'">
                <div class="label">关注人员分组：</div>
                <div class="value">
                  <span v-if="item.workerGroupName" :title="item.workerGroupName">{{ item.workerGroupName }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow" v-if="item.workerGroupName && item.scenceUserType ==='职工'">
                <div class="label">职工分组：</div>
                <div class="value">
                  <span v-if="item.workerGroupName" :title="item.workerGroupName">{{ item.workerGroupName }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow" v-if="item.scenceUserType == '学生'">
                <div class="label">学号：</div>
                <div class="value">
                  <span v-if="item.studentNo" :title="item.studentNo">{{
                      item.studentNo
                    }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow" v-if="item.scenceUserType == '学生'">
                <div class="label">班级：</div>
                <div class="value">
                  <span v-if="item.className" :title="item.className">{{ item.className }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow" v-if="item.scenceUserType == '老师' || item.scenceUserType == '职工'">
                <div class="label">手机号：</div>
                <div class="value" :title="item.phone">
                  <span v-if="item.phone">{{ item.phone }}</span>
                  <span v-else>--</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" size="mini" @click="important">
          添加关注人员
        </el-button>
        <el-button type="primary" size="mini" @click="seeVideo" v-show="!showVideo">查看视频</el-button>
        <el-button type="primary" size="mini" @click="seeImg" v-show="showVideo">查看大图</el-button>
        <el-button type="primary" plain size="mini" @click="handleClose">关闭</el-button> -->
      </div>
    </el-dialog>
    <DialogFacialFeature :show="dialogFacialFeature.show" :form="dialogFacialFeature.form" @close="dialogFacialFeature.show = false"></DialogFacialFeature>
    <DialogHumanCharacteristics :visible="dialogHumanCharacteristics.visible" :form="dialogHumanCharacteristics.form" @close="dialogHumanCharacteristics.visible = false"></DialogHumanCharacteristics>
    <DialogAddImportant :visible="dialogAddImportant.visible" :form="dialogAddImportant.form" @close="dialogAddImportant.visible = false"></DialogAddImportant>
  </div>
</template>

<script lang="ts">
import {
  getBase64,
  getTimeByTimeStamp,
  getSimilarityDisplay,
} from "@/utils/index.js";
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import DialogFacialFeature from "./DialogFacialFeature.vue";
import DialogHumanCharacteristics from "./DialogHumanCharacteristics.vue";
import DialogAddImportant from "./DialogAddImportant.vue";
import { playBackTime } from "@/api/police";
import Video from "./Video.vue";
import config from "@/api/config";
@Component({
  components: {
    DialogHumanCharacteristics,
    DialogFacialFeature,
    DialogAddImportant,
    Video,
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
  handleClose() {
    this.showVideo = false;
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
}
</script>

<style lang="scss">
.camera_dia {
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
}
</style>

<style lang="scss" scoped>
.left-layout {
  width: 202px;
  height: 400px;
  margin-top: 13px;
  .cap-img {
    height: 131px;
  }
  .face_img {
    height: 97px;
    width: 97px;
  }
  .similarityDegree {
    margin-top: -10px;
    margin-bottom: 5px;
    font-size: 12px;
    color: #7de0ff;
    text-align: center;
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
  .aotu {
    height: auto;
    line-height: 20px;
    padding: 8px 6px;
    word-break: break-all;
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
      border: 1px solid #112957;
    }
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
// .left-layout {
//   width: 200px;
//   .personImg {
//     width: 200px;
//     height: 280px;
//     object-fit: contain;
//   }
//   .cap-img {
//     width: 100%;

//     .pic {
//       display: flex;
//       height: 100%;
//       > div {
//         flex: 1;
//       }
//       .left {
//         flex: 1;
//         margin-right: 1px;
//       }
//       img {
//         width: 100px;
//         height: 100px;
//         object-fit: contain;
//       }
//     }
//   }
// .similarityDegree {
//   margin-top: 1px;
//   margin-bottom: 5px;
//   text-align: center;
// }
// }
// .center-layout {
//   width: 773px;
//   height: 423px;
//   padding: 0 30px;
//   img {
//     width: 100%;
//     height: calc(100% - 8px);
//     object-fit: contain;
//   }
// }
// .right-layout {
//   .title-list {
//     .title {
//       // margin-left: 10px;
//       margin-bottom: 15px;
//       margin-bottom: 5px;
//       display: flex;
//       font-size: 12px;
//       color: #606266;
//     }
//   }
//   // .cameraDetail {
//   // margin-top: 15px;
//   // }
.commonRow {
  display: flex;
  margin-bottom: 5px;
  font-size: 12px;
  color: #d6e3ff;
  background: #273d65;
  line-height: 34px;
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
// }
.detail-container {
  color: #333;
  background: #172139;
}
/deep/.el-dialog__header {
  background: #172139;
  padding: 10px 20px 10px !important;
  border-bottom: 1px solid #3c4a64;
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
  .el-dialog__close {
    color: #7de0ff;
  }
}
::v-deep {
  .el-dialog__body,
  .el-dialog__footer {
    padding: 15px;
    color: #333;
    background: #172139;
  }
}
.person-con {
  margin-top: 15px;
}
.text-con {
  padding-left: 20px;
}
.type-one-con {
  height: 173px;
  overflow-y: auto;
}
.type-one {
  border: 1px solid #3c4a64;
  padding: 10px 10px 5px 10px;
  margin-bottom: 10px;
}
</style>