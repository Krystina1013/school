<template>
  <common-dialog
    :visible="visible"
    title="详情"
    :width="`${(1400 / width_w) * 100}%`"
    @close="handleClose"
    @addToPortraitLibrary="showDialogAddToPortraitLibrary"
    @facialFeature="facialFeature"
    @addToArrangeControl="showDialogAddToArrangeControl"
    @humanCharacteristics="showHumanCharacteristics"
    @historyAlarm="dialogHistoricalAlarm.visible = true"
    @viewVideo="viewVideo"
    @viewImg="viewImg"
    @trackSearch="handleTrackSearch"
    :showClose="true"
    :showPersonDetail="true"
    :showVideo="showVideo"
    :hiddenHistoryAlarm="hiddenHistoryAlarm"
    :hiddenHandleBtn="hiddenHandleBtn"
    :hiddenAddToPortraitLibrary="JSON.parse(localStorage.user).type == 1"
    :hiddenAddToArrangeControl="JSON.parse(localStorage.user).type == 1"
  >
    <template slot="dialogContent">
      <div class="dialogContent">
        <div class="left">
          <SimilarPicture
            v-if="ruleForm.originFace"
            :originFace="ruleForm.originFace"
            :capFace="ruleForm.capFace"
            :showTitle="true"
          ></SimilarPicture>
          <div v-else style="text-align: center">
            <img
              :src="frequently ? capMessage.faceInfo.faceUrl : ruleForm.capFace"
              style="width: 100px; height: 100px"
            />
          </div>
          <div
            class="similarityDegree"
            v-if="!ruleForm.hiddenPerson && !frequently"
          >
            相似度:{{ $util.getSimilarityDisplay(ruleForm.similarity) }}
          </div>
          <div v-if="
              (!ruleForm.hiddenPerson && !form.trackLibrary) ||
              (!ruleForm.hiddenPerson && frequently)
            ">
              <img
                class="personImg"
                :src="capMessage.humanInfo.humanImg"
                v-if="capMessage.humanInfo.humanImg"
              />
          </div>
          <div v-else class="personImg">
            <img
            class="personImg"
            style="margin-top: 22px"
            v-if="ruleForm.humanImg"
            :src="ruleForm.humanImg"
          />
          </div>
        </div>
        <div class="center">
          <div
            style="width: 773px; height: 423px; background: #000"
            v-show="showVideo"
          >
            <!-- <Reflv
              v-if="url"
              style="width:100%;height:423px"
              name="single"
              :height="423"
              :url="url"
              ref="video"
            /> -->
            <Reflv
              data-name="single"
              v-if="reflvUrl"
              style="width: 100%; height: 423px"
              :name="'single'"
              :height="423"
              :url="reflvUrl"
              ref="reflv"
              :isPc="isPc"
            />
          </div>
          <span v-if="!ruleForm.hiddenPerson && !form.trackLibrary">
            <div class="personImg">
              <img
              class="personImg"
              v-if="capMessage.faceInfo.panoramaImg"
              :src="capMessage.faceInfo.panoramaImg"
              v-show="!showVideo"
            />
            </div>
            
          </span>
          <span v-else>
            <img
              class="personImg"
              :src="ruleForm.panoramaImg"
              v-show="!showVideo"
            />
          </span>
        </div>
        <div class="right">
          <div
            class="personDetail title-list"
            v-if="!ruleForm.hiddenPerson && !frequently"
          >
            <h2 class="title">人员信息：</h2>
            <div class="commonRow" v-if="!form.trackLibrary">
              <div class="label">人像库：</div>
              <div
                class="value"
                style="word-break: break-all"
                :title="ruleForm.groupName + '-' + ruleForm.alertTaskName"
              >
                {{ ruleForm.groupName }}-{{ ruleForm.alertTaskName }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">姓名：</div>
              <div
                class="value"
                :title="ruleForm.name"
                style="word-break: break-all"
              >
                {{ ruleForm.name }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">国籍：</div>
              <div class="value" :title="ruleForm.country">
                {{ ruleForm.country }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">电话：</div>
              <div class="value">{{ ruleForm.phone }}</div>
            </div>
            <div class="commonRow">
              <div class="label">证件类型：</div>
              <div class="value" :title="ruleForm.cardType">
                {{ ruleForm.cardType }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">证件号码：</div>
              <div class="value" :title="ruleForm.cardNo">
                {{ ruleForm.cardNo }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">出生日期：</div>
              <div class="value">{{ ruleForm.birthday | date }}</div>
            </div>
            <div class="commonRow">
              <div class="label">住址：</div>
              <div class="value" :title="ruleForm.address">
                {{ ruleForm.address }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">工作单位：</div>
              <div class="value" :title="ruleForm.jobAddress">
                {{ ruleForm.jobAddress }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">籍贯：</div>
              <div class="value" :title="ruleForm.homeTown">
                {{ ruleForm.homeTown }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">备注：</div>
              <div
                class="value"
                :title="ruleForm.remark"
                style="word-break: break-all"
              >
                {{ ruleForm.remark }}
              </div>
            </div>
          </div>
          <div class="cameraDetail title-list">
            <h2 class="title">摄像机详情：</h2>
            <div class="commonRow">
              <div class="label">抓拍摄像机：</div>
              <div
                class="value"
                v-if="!form.hiddenPerson && !form.trackLibrary"
              >
                <span
                  v-if="capMessage.cameraCutVo"
                  :title="capMessage.cameraCutVo.name"
                  >{{ capMessage.cameraCutVo.name }}</span
                >
                <span v-else>--</span>
              </div>
              <div class="value" v-else>
                <span v-if="form.cameraCutVo" :title="form.cameraCutVo.name">{{
                  form.cameraCutVo.name
                }}</span>
                <span v-else>--</span>
              </div>
            </div>
            <!-- <div class="commonRow">
              <div class="label">抓拍地址：</div>
              <div
                class="value"
                v-if="!form.hiddenPerson && !form.trackLibrary"
              >
                <span
                  v-if="capMessage.cameraCutVo"
                  :title="capMessage.cameraCutVo.addr"
                  >{{ capMessage.cameraCutVo.addr }}</span
                >
                <span v-else>--</span>
              </div>
              <div class="value" :title="form.cameraCutVo.addr" v-else>
                <span v-if="form.cameraCutVo">{{ form.cameraCutVo.addr }}</span>
                <span v-else>--</span>
              </div>
            </div> -->
            <div class="commonRow">
              <div class="label">摄像机分组：</div>
              <div
                class="value"
                v-if="!form.hiddenPerson && !form.trackLibrary"
              >
                <span
                  v-if="capMessage.cameraCutVo"
                  :title="capMessage.cameraCutVo.cameraGroupName"
                  >{{ capMessage.cameraCutVo.cameraGroupName }}</span
                >
                <span v-else>--</span>
              </div>
              <div class="value" v-else>
                <span
                  v-if="form.cameraCutVo"
                  :title="form.cameraCutVo.cameraGroupName"
                  >{{ form.cameraCutVo.cameraGroupName }}</span
                >
                <span v-else>--</span>
              </div>
            </div>
            <div class="commonRow">
              <div class="label">抓拍时间：</div>
              <div class="value">{{ ruleForm.capTime }}</div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </common-dialog>
</template>
<script>
export default {
  name: "DialogPersonDetail",

  // props: ["visible", "title", "form",'hiddenHistoryAlarm','hiddenHandleBtn' ],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    form: {
      type: Object,
      default: () => ({})
    },
    hiddenHistoryAlarm: {
      type: Boolean,
      default: false,
    },
    hiddenHandleBtn: {
      type: Boolean,
      default: false,
    },
    frequently: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isPc: false,
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      personDetail: {},
      camera: {},
      capMessage: { faceInfo: {}, humanInfo: {}, cameraCutVo: {} },
      dialogAddToPortraitLibrary: {
        visible: false,
        form: {},
      },
      dialogAddToArrangeControl: {
        visible: false,
        form: {},
      },
      dialogFacialFeature: {
        visible: false,
        form: {},
      },
      dialogHumanCharacteristics: {
        visible: false,
        form: {},
      },
      dialogVideo: {
        visible: false,
      },
      dialogHistoricalAlarm: {
        visible: false,
        form: {},
      },
      reflvUrl: "",
      showVideo: false,
      interval: null,
    };
  },
  computed: {
    ruleForm() {
      return this.form;
    },
  },
  watch: {
    form(val) {
      if (
        (!val.hiddenPerson && val.alert) ||
        (!val.hiddenPerson && val.frequently)
      ) {
        if (val.alert) {
          this.$store.dispatch("setAlarmToRead", { ids: [val.id] });
        }
        this.getCapMessage();
      }
    },
  },
  created() {
    this.check();
  },
  methods: {
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
    },
    //人脸特征
    facialFeature() {
      let param;
      if (this.ruleForm.alert || this.ruleForm.frequently) {
        param = { ...this.capMessage.faceInfo };
      } else {
        param = { ...this.ruleForm.faceInfo };
      }
      console.log(param);
      this.dialogFacialFeature.visible = true;
      this.dialogFacialFeature.form = param;
    },
    handleTrackSearch() {
      const params = {
        faceUrl: this.ruleForm.capFace,
      };
      let routeData = this.$router.resolve({
        name: "track",
        query: params,
      });
      window.open(routeData.href, "_blank");
    },
    showDialogAddToPortraitLibrary(isAttention) {
      this.dialogAddToPortraitLibrary.visible = true;
      this.dialogAddToPortraitLibrary.form = { ...this.ruleForm };
      this.dialogAddToPortraitLibrary.form.faceUrl = this.ruleForm.capFace;
      this.dialogAddToPortraitLibrary.form.isAttention = isAttention;
      // this.dialogAddToPortraitLibrary.form.faceUrl =
      //   "go-fast/group1/default/20200428/10/12/0/7f985501-a8a2-4f87-9e63-3e7a409b188a.jpg";
    },
    showDialogAddToArrangeControl() {
      this.dialogAddToArrangeControl.visible = true;
      this.dialogAddToArrangeControl.form = { ...this.ruleForm };
      this.dialogAddToArrangeControl.form.faceUrl = this.ruleForm.capFace;
      // this.dialogAddToArrangeControl.form.faceUrl =
      //   "go-fast/group1/default/20200428/10/12/0/7f985501-a8a2-4f87-9e63-3e7a409b188a.jpg";
    },
    showHumanCharacteristics() {
      this.dialogHumanCharacteristics.visible = true;

      if (!this.ruleForm.hiddenPerson && !this.ruleForm.trackLibrary) {
        this.dialogHumanCharacteristics.form = {
          ...this.capMessage.humanInfo,
          ...this.capMessage.faceInfo,
        };
      } else {
        this.dialogHumanCharacteristics.form = {
          ...this.ruleForm.humanInfo,
          ...this.ruleForm.faceInfo,
        };
      }
    },
    async getCapMessage() {
      let param = {
        id: this.ruleForm.cameraMetadataId,
      };
      let { code, message, data } = await this.$http.get(
        this.$url.alarm.csia_alert_queryCapMessage,
        param
      );
      if (code != 200) {
        if (message) {
          this.$message.error(message);
        }
        return;
      }
      this.capMessage = data || {
        humanInfo: {},
        faceInfo: {},
      };
    },
    viewImg() {
      this.showVideo = false;
      this.$refs.reflv.flv_destroy();
    },
    async viewVideo() {
      console.log(this.ruleForm);
      let metaId = this.ruleForm.cameraMetadataId
        ? this.ruleForm.cameraMetadataId
        : this.ruleForm.metadataId?this.ruleForm.metadataId:this.ruleForm.id;
      console.log("metaId", metaId);

      this.showVideo = true;
      let { code, message, data } = await this.$http.get(
        this.$url.camera.csia_camera_replay,
        { metaId }
      );
      if (code != 200) {
        if (message) {
          this.$message.error(message);
        }
        return;
      }
      this.reflvUrl = data;
      this.$nextTick(() => {
        this.$refs.reflv.play();
      });
    },

    handleClose() {
      this.reflvUrl="";
      this.showVideo = false;
      this.$nextTick(()=>{
        if(this.$refs.reflv){
          this.$refs.reflv.flv_destroy();
        }
      })
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.dialogContent {
  display: flex;
  .left {
    .similarityDegree {
      margin-top: 1px;
      margin-bottom: 5px;
      text-align: center;
    }
    .personImg {
      width: 198px;
      height: 274px;
    }
  }
  .center {
    margin: 0px 15px;
    // padding-top: 21px;
    .personImg {
      width: 773px;
      height: 423px;
    }
  }
  .right {
    width: 350px;
    .title-list {
      .title {
        margin-bottom: 5px;
        color: #A8B9E7;
      }
    }
    .cameraDetail {
      margin-top: 15px;
    }
  }
}
  /deep/.el-dialog__body{
    color: #fff;
  }
</style>