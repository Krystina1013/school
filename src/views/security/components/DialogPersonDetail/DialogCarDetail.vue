<template>
  <div>
    <el-dialog title="详情" :visible="visible" :append-to-body='true' :width="`${(1200 / width_w) * 100}%`" :before-close="handleClose">
      <div class="detail-container flex">
        <div class="left-layout" v-if="form.vehicleInfo">
          <div class="cap-img" v-if="!hideOriginalFace">
            <div class="img-title">
              <span>» 原图像</span>
              <span>» 抓拍图</span>
            </div>
            <div class="pic">
              <div class="left">
                <img src="" alt="" />
              </div>
              <div>
                <img :src="form.faceInfo.faceUrl" alt="" />
              </div>
            </div>
          </div>
          <div class="cap-img" v-else>
            <div class="img-title" v-if="form.vehicleInfo.platePic">
              <span>» 抓拍图</span>
            </div>
            <div class="pic pic-center">
              <div>
                <img v-if="form.vehicleInfo.platePic" :src="form.vehicleInfo.platePic || '/'" alt="" />
                <!-- <span v-else>无车牌抓拍</span> -->
              </div>
            </div>
          </div>
          <!-- <div class="similarityDegree" v-if="!hideOriginalFace">
            相似度:{{ getSimilarityDisplay(ruleForm.similarity) }}
          </div> -->
          <div class="img-title">
            <span>» 全车图</span>
          </div>
          <img class="personImg" v-if="form.vehicleInfo.vehiclePhoto" :src="form.vehicleInfo.vehiclePhoto" alt="" />
        </div>
        <div class="center-layout">
          <div class="img-title">
            <span>» 全景图</span>
          </div>
          <img v-if="form.vehicleInfo && !showVideo" :src="form.vehicleInfo.vehiclePanorama" alt="" />
          <div v-if="showVideo" style="height:423px">
            <Video data-name="single" v-if="videoUrl" :style="{ width: '100%', height: '100%' }" :height="height_w - 500" :url="videoUrl" ref="video" :name="1"></Video>
          </div>
        </div>
        <div class="right-layout">
          <div class="cameraDetail title-list">
            <h2 class="title">» 摄像机详情：</h2>
            <div class="commonRow">
              <div class="label">抓拍摄像机：</div>
              <div class="value">
                <span v-if="form.cameraCutVo" :title="form.cameraCutVo.name">{{
                  form.cameraCutVo.name
                }}</span>
                <span v-else>--</span>
              </div>
            </div>
            <div class="commonRow">
              <div class="label">抓拍地址：</div>
              <div class="value" v-if="form.cameraCutVo" :title="form.cameraCutVo.addr">
                <span v-if="form.cameraCutVo">{{ form.cameraCutVo.addr }}</span>
                <span v-else>--</span>
              </div>
            </div>
            <div class="commonRow">
              <div class="label">抓拍时间：</div>
              <div class="value">{{ getTimeByTimeStamp(form.time) }}</div>
            </div>
            <div class="person-con">
              <h2 class="title">» 车辆详情：</h2>
              <!-- <div class="commonRow text-con" v-if="form.goodFace === 0 && !form.name">
                非清晰人脸
              </div>
              <div class="commonRow text-con" v-if="form.goodFace === 1 && !form.name">
                陌生人
              </div> -->
              <div class="commonRow">
                <div class="label">车牌：</div>
                <div class="value">
                  <span v-if="form.vehicleInfo && form.vehicleInfo.plateNumber" :title="form.vehicleInfo.plateNumber">{{
                    form.vehicleInfo.plateNumber
                  }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow">
                <div class="label">车牌类型：</div>
                <div class="value">
                  <span v-if="form.vehicleInfo && form.vehicleInfo.plateType" :title="form.vehicleInfo.plateType">{{
                    form.vehicleInfo.plateType
                  }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow">
                <div class="label">车辆类型：</div>
                <div class="value">
                  <span v-if="form.vehicleInfo && form.vehicleInfo.vehicleType">{{ form.vehicleInfo.vehicleType }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow">
                <div class="label">品牌：</div>
                <div class="value">
                  <span v-if="form.vehicleInfo && form.vehicleInfo.charPreBrand">{{ form.vehicleInfo.charPreBrand }}</span>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="commonRow">
                <div class="label">车辆颜色：</div>
                <div class="value">
                  <span v-if="form.vehicleInfo && form.vehicleInfo.vehicleColor">{{ form.vehicleInfo.vehicleColor }}</span>
                  <span v-else>--</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-dropdown @command="handleCommand" >
          <el-button type="primary" size="mini">
            添加<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="important">关注人员</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <!-- <el-button
          type="primary"
          size="mini"
          @click="
            dialogFacialFeature.show = true;
            dialogFacialFeature.form = form.faceInfo;
          "
          >人脸特征信息</el-button
        > -->
        <!-- <el-button type="primary" size="mini" @click="goTrack" v-if="!hideTrack"
          >轨迹搜索</el-button
        > -->
        <!-- <el-button
          type="primary"
          size="mini"
          @click="
            dialogHumanCharacteristics.visible = true;
            dialogHumanCharacteristics.form = form.humanInfo;
          "
          >人体特征</el-button
        > -->
        <el-button type="primary" size="mini" @click="seeVideo" v-show="!showVideo">查看视频</el-button>
        <el-button type="primary" size="mini" @click="seeImg" v-show="showVideo">查看大图</el-button>
        <el-button type="primary" size="mini" @click="handleClose">关闭</el-button>
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

  handleCommand(action) {
    if (action == "important") {
      this.dialogAddImportant.visible = true;
      this.dialogAddImportant.form = this.form;
    }
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

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
.pic-center {
  > div {
    margin: 0 auto;
    text-align: center;
  }
}
.img-title {
  margin-bottom: 5px;
  display: flex;
  font-size: 12px;
  span {
    flex: 1;
  }
}
.left-layout {
  width: 200px;
  margin-right: 10px;
  .personImg {
    width: 200px;
    height: 274px;
    object-fit: contain;
  }

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
  width: 773px;
  height: 423px;
  padding: 0 30px;
  img {
    width: 100%;
    height: calc(100% - 8px);
    object-fit: contain;
  }
}
.right-layout {
  .title-list {
    .title {
      margin-bottom: 15px;
      display: flex;
      font-size: 12px;
      color: #606266;
    }
  }
  .cameraDetail {
    // margin-top: 15px;
  }
  .commonRow {
    display: flex;
    margin-bottom: 5px;
    font-size: 12px;
    color: #333;
    background: #f8f8f8;
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
}
.detail-container {
  color: #333;
  background: #fff;
}
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
  .el-dialog__close {
    color: #333;
  }
}
::v-deep {
  .el-dialog__body,
  .el-dialog__footer {
    padding: 15px;
    color: #333;
    background: #fff;
  }
}
.person-con {
  margin-top: 15px;
}
.text-con {
  padding-left: 20px;
}
</style>