<template>
  <div class="layout-content1">
    <FilterHeader class="filtreHeader" :activeName="activeName" ref="filter" @getFaceCapture="getFaceCapture" :pageInfo="pagination"></FilterHeader>
    <div class="resultWrapper" v-loading="showLoading">
      <ScrollList class="scollList" ref="scrollList" :height="height_w - 170" :canPullUp="canPullUp" @scrollToBottom="scrollToBottomTime" v-if="searchData.length">
        <div class="list" v-for="(item, i) in searchData" :key="i" @click="showDialogPersonDetail(item)">
          <div style="position: relative;padding:2px">
            <div class="horn" style="z-index:1">
              <div class="lt"></div>
              <div class="rt"></div>
              <div class="rb"></div>
              <div class="lb"></div>
            </div>
            <div style="position: relative;z-index: 5;">
              <div class="face">
                <img :src="item.vehicleInfo.vehiclePhoto" alt />
              </div>
              <div class="flex justify-content-between align-items-center rowp" style="margin-top: 5px">
                <span class="flex align-items-center">
                  <div class="icons icons_1">
                    <i class="iconfont icon-shexiangji2"></i>
                  </div>
                  <span>摄像机:</span>
                  <span v-if="item.cameraCutVo" :title="item.cameraCutVo.name" class="moreWord hiddenText">{{ item.cameraCutVo.name }}</span>
                  <span v-else>--</span>
                </span>
                <!-- <span class="aBtn" @click="showDialogPersonDetail(item)">详情</span> -->
              </div>
              <!-- <div class="flex align-items-center rowp">
                <div class="icons icons_2">
                  <i class="el-icon-location"></i>
                </div>
                <span> 抓拍地址:</span>
                <span v-if="item.cameraCutVo" class="moreWord" :title="item.cameraCutVo.addr">{{ item.cameraCutVo.addr }}</span>
                <span v-else class="moreWord">--</span>
              </div> -->
              <div class="flex rowp">
                <div class="icons icons_3">
                  <i class="iconfont icon-Vector"></i>
                </div>
                <span> 时间:</span>
                <span :title="getTimeByTimeStamp(item.time)">{{
                getTimeByTimeStamp(item.time) | ignoreYearAndSecond
              }}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollList>
      <p v-else class="empty">未查询到相关记录！</p>
    </div>
    <DialogCarDetail @close="closeDialogPersonDetail" @trackSearch="track" :visible="DialogPersonDetail.visible" :form="DialogPersonDetail.form" :hidePersonInfo="true" :hideOriginalFace="true" :hideTrack="activeName=='track'"></DialogCarDetail>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import DialogCarDetail from "../components/DialogPersonDetail/DialogCarDetail.vue";
import config from "@/api/config";
import { carSearch, unknownFaceSearch } from "@/api/dev";
import {
  getBase64,
  getTimeByTimeStamp,
  getSimilarityDisplay,
} from "@/utils/index.js";
const FilterHeader = () => import("./components//FilterHeader.vue");
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
@Component({
  components: { FilterHeader, ScrollList, DialogCarDetail },
})
export default class extends Vue {
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  activeName: string = "cap";
  canPullUp: boolean = true;
  searchData: Array<object> = [];
  DialogPersonDetail: any = {
    visible: false,
    form: {},
  };
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 50,
  };
  nowFilter: any = {};
  showLoading: boolean = false;
  created() {
    // if (this.$route.params.type) {
    //   this.activeName = "track";
    //   this.$nextTick(() => {
    //     let data:any = localStorage.getItem("track");
    //     this.trackSearch(JSON.parse(data))
    //   });
    // }
  }
  mounted() {
    window.addEventListener("resize", this.heightResize);
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
  handleClick() {
    this.searchData = [];
    this.pagination.total = 0;
    this.$refs.filter["reset"]();
  }
  scrollToBottomTime() {
    this.pagination.page += 1;
    this.canPullUp = false;
    this.loadFaceData(this.nowFilter);
  }
  scrollToBottomFace() {}
  showDialogPersonDetail(item, type) {
    this.DialogPersonDetail.visible = true;
    item.capTime = getTimeByTimeStamp(item.time);
    this.DialogPersonDetail.form = { ...item };
  }
  closeDialogPersonDetail() {
    this.DialogPersonDetail.visible = false;
  }
  // 人脸抓拍
  getFaceCapture(val, arr) {
    this.nowFilter = { ...val, cameraIds: arr };
    this.pagination.page = 1;
    this.searchData = [];
    let param = { ...val, cameraIds: arr };
    this.loadFaceData(param);
  }
  loadFaceData(val) {
    let param: any = {
      page: this.pagination.page,
      pageSize: val.pageSize || this.pagination.pageSize,
      startTime: val.startTime || null,
      endTime: val.endTime || null,
      type: 1,
      licensePlateType: val.licensePlateType,
      vehicleColor: val.vehicleColor,
      plateNumber: val.plateNumber,
      vehicleType: val.vehicleType,
    };
    if (val.cameraIds && val.cameraIds.length) {
      param.cameraIds = val.cameraIds;
    }
    if (val.faceUrl) {
      param.pic = val.faceUrl;
    }
    if (val.plateNumber) {
      param.plateNumber = val.plateNumber;
    }
    this.showLoading = true;
    carSearch(param)
      .then((res) => {
        let data = res.data.data;
        this.showLoading = false;
        this.pagination.total = parseInt(data.total);
        if (this.pagination.page == 1) {
          this.searchData = data.records;
          // this.$refs.scrollList.scrollToTop();
        } else {
          this.searchData = [...this.searchData, ...data.records];
        }
        this.$nextTick(() => {
          if (this.searchData.length == parseInt(data.total)) {
            this.canPullUp = false;
          } else {
            this.canPullUp = true;
          }
        });
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  //轨迹搜索
  getTrack(val) {
    if (val == "clear") {
      this.searchData = [];
      return;
    }
    if (val.faceUrl == "") {
      this.$message.error("请先上传人脸！");
      return;
    }
    this.$refs.filter["closeFilterDialog"]();
    let param = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      startTime: val.startTime,
      endTime: val.endTime,
      pic: val.faceUrl,
      score: val.score,
    };
    this.showLoading = true;
    unknownFaceSearch(param)
      .then((res) => {
        this.pagination.total = res.data.data.length;
        this.searchData = res.data.data;
        this.showLoading = false;
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  trackSearch(param) {
    this.closeDialogPersonDetail();
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs["filter"]["searchTrack"](param);
      }, 500);
    });
    this.searchData = [];
    this.pagination.total = 0;
  }
  track(param) {
    this.closeDialogPersonDetail();
    this.activeName = "track";
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs["filter"]["searchTrack"](param);
      }, 500);
    });
    this.searchData = [];
    this.pagination.total = 0;
  }
  getTimeByTimeStamp(time) {
    return getTimeByTimeStamp(time);
  }
  getSimilarityDisplay(val) {
    return getSimilarityDisplay(val);
  }
}
</script>

<style lang="scss" scoped>
.layout-content1 {
  padding-top: 1px;
}
/deep/ .filtreHeader {
  background: #fff;
  padding: 6px 0;
  padding-top: 0;
  line-height: 34px;
  .row-bg {
    margin: 0;
  }
}
.resultWrapper {
  // background: #fff;
  // box-shadow: 0px 6px 5px 0px lightgrey;
  padding: 10px;
  padding-top: 24px;
  height: calc(100vh - 90px);
}
::v-deep {
  .el-tabs__nav .is-top {
    background: transparent;
  }
  .el-tabs__active-bar {
    background-color: #409eff !important;
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
    cursor: pointer;
    margin: 0 10px 25px 10px;
    // box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13),
    //   0 2px 4px rgba(0, 0, 0, 0.12);
    border: 1px solid #e4e7ed;
    background: #fff;
    padding: 3px;
    font-size: 12px;
    color: #606266;
    line-height: 24px;
    .hiddenText {
      display: inline-block;
      width: 70px !important;
    }
    img,
    .face {
      width: 150px;
      height: 150px;
      object-fit: contain;
      border: 1px solid #eee;
    }
    .icons {
      width: 30px;
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
      width: 80px;
    }
  }
  .aBtn {
    cursor: pointer;
    color: #409eff;
  }
}
.empty {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 100px;
}
</style>
