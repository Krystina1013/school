<template>
  <div>
    <common-dialog
      :visible="visible"
      :width="`${(1200 / width_w) * 100}%`"
      @close="handleClose"
      @submit="handleSubmit"
      :showCancel="false"
      :showSubmit="false"
      title="轨迹档案"
    >
      <template slot="dialogContent">
        <div
          class="flex justify-content-center align-items-center"
          v-if="!isUpdate"
        >
          <div class="face-url" v-if="!topHidden">
            <img :src="data.faceUrl" alt />
          </div>
          <div class="person-info flex flex-1" v-if="!topHidden">
            <div class="hidden">
              <p>
                <span class="title">姓名：</span>
                <span :title="data.name" class="break">{{ data.name }}</span>
              </p>
              <p>
                <span class="title">国籍：</span>
                <span :title="data.country">{{ data.country }}</span>
              </p>
              <p>
                <span class="title">{{data.studentNo?'学号':'电话'}}：</span>
                <span :title="data.phone">{{ data.studentNo?data.studentNo:data.phone }}</span>
              </p>
              <p>
                <span class="title">证件类型：</span>
                <span :title="data.cardType">{{ data.cardType }}</span>
              </p>
              <p>
                <span class="title">证件号码：</span>
                <span :title="data.cardNo">{{ data.cardNo }}</span>
              </p>
            </div>
            <div style="margin-left: 50px" class="hidden">
              <p v-if="data.birthday">
                <span class="title">出生日期：</span>
                <span>{{ data.birthday.split(" ")[0] }}</span>
              </p>
              <p v-else>
                <span class="title">出生日期：</span>
                <span>{{ data.birthday }}</span>
              </p>
              <p>
                <span class="title">住址：</span>
                <span :title="data.address">{{ data.address }}</span>
              </p>
              <p>
                <span class="title">工作单位：</span>
                <span :title="data.jobAddress">{{ data.jobAddress }}</span>
              </p>
              <p>
                <span class="title">籍贯：</span>
                <span :title="data.homeTown">{{ data.homeTown }}</span>
              </p>
              <p>
                <span class="title">备注：</span>
                <span :title="data.remark" class="break">{{
                  data.remark
                }}</span>
              </p>
            </div>
          </div>
          <span class="top-hidden" @click="topHidden = !topHidden">{{
            !topHidden ? "隐藏" : "显示"
          }}</span>
        </div>
        <div
          class="flex justify-content-center align-items-center"
          v-if="isUpdate"
        >
          <div class="face-url" v-if="!topHidden">
            <img :src="updateData.faceUrl" alt />
          </div>
          <div class="person-info flex flex-1" v-if="!topHidden">
            <div class="hidden">
              <p>
                <span>姓名：</span>
                <span :title="updateData.name" class="break">{{
                  updateData.name
                }}</span>
              </p>
              <p>
                <span>国籍：</span>
                <span :title="updateData.country">{{
                  updateData.country
                }}</span>
              </p>
              <p>
                <span>电话：</span>
                <span :title="updateData.phone">{{ updateData.phone }}</span>
              </p>
              <p>
                <span>证件类型：</span>
                <span :title="updateData.cardType">{{
                  updateData.cardType
                }}</span>
              </p>
              <p>
                <span>证件号码：</span>
                <span :title="updateData.cardNo">{{ updateData.cardNo }}</span>
              </p>
            </div>
            <div style="margin-left: 50px" class="hidden">
              <p v-if="updateData.birthday">
                <span>出生日期：</span>
                <span>{{ updateData.birthday.split(" ")[0] }}</span>
              </p>
              <p v-else>
                <span>出生日期：</span>
                <span>{{ updateData.birthday }}</span>
              </p>
              <p>
                <span>住址：</span>
                <span :title="updateData.address">{{
                  updateData.address
                }}</span>
              </p>
              <p>
                <span>工作单位：</span>
                <span :title="updateData.jobAddress">{{
                  updateData.jobAddress
                }}</span>
              </p>
              <p>
                <span>籍贯：</span>
                <span :title="updateData.homeTown">{{
                  updateData.homeTown
                }}</span>
              </p>
              <p>
                <span>备注：</span>
                <span :title="updateData.remark" class="break">{{
                  updateData.remark
                }}</span>
              </p>
            </div>
          </div>
          <span class="top-hidden" @click="topHidden = !topHidden">{{
            !topHidden ? "隐藏" : "显示"
          }}</span>
        </div>
        <!-- <div class="hidden-img">
          <i @click="topHidden=!topHidden" :class="{'hidden':topHidden}"></i>
        </div> -->
        <div class="search-box">
          <div class="flex search-result">
            <div>
              <span class="label">时间范围：</span>
              <el-select
                v-model="time"
                placeholder="请选择"
                style="margin-right: 20px; width: 100px"
                @change="changeTime"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-date-picker
                @change="datePicker"
                v-show="time == 4"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="form.date"
                type="datetimerange"
                style="margin-right: 20px"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
            <!-- <span
              v-if="
                JSON.parse(localStorage.user).type != 1 && onePerson != 'person'
              "
              @click="showDeleteDialog()"
              class="aBtn"
              >删除</span
            >
            <span
              v-if="
                JSON.parse(localStorage.user).type != 1 && onePerson == 'person'
              "
              @click="showDeleteDialog()"
              class="aBtn"
              >删除</span
            >
            <span
              v-if="
                JSON.parse(localStorage.user).type != 1
              "
              @click="showUpdateDialog()"
              class="aBtn"
              >修改</span
            > -->
          </div>
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="列表展示" name="first">
              <!-- <searchList :height="height_w - 320" :list="list"></searchList> -->
              <p style="margin-bottom: 8px">共{{ total }}条记录</p>
              <div
                class="list-layout"
                style="overflow: auto"
                :style="{
                  height: !topHidden
                    ? height_w - 550 + 'px'
                    : height_w - 370 + 'px',
                }"
              >
                <ScrollList
                  ref="scrollList"
                  :height="!topHidden ? height_w - 550 : height_w - 370"
                  :canPullUp="canPullUp"
                  @scrollToBottom="scrollToBottom"
                >
                  <div class="scollList" v-if="list.length > 0">
                    <div v-if="onePerson != 'person'">
                      <div class="list" v-for="(item, i) in list" :key="i">
                        <div class="face">
                          <img
                            :src="item.faceInfo.faceUrl"
                            alt
                          />
                        </div>
                        <p class="flex justify-content-between align-items-center">
                          <span
                            >相似度：{{
                              getSimilarityDisplay(
                                Math.round(item.score * 100) / 100
                              )
                            }}</span
                          >
                          <span
                            class="aBtn"
                            @click="showDialogPersonDetail(item)"
                            >详情</span
                          >
                        </p>
                        <p class="flex align-items-center">
                          摄像机：
                          <span
                            v-if="item.capMessage.cameraCutVo"
                            :title="item.capMessage.cameraCutVo.name"
                            class="moreWord"
                            >{{ item.capMessage.cameraCutVo.name }}</span
                          >
                          <span v-else class="moreWord">--</span>
                        </p>
                        <!-- <p class="flex align-items-center">
                          抓拍地址：
                          <span
                            v-if="item.capMessage.cameraCutVo"
                            class="moreWord"
                            :title="item.capMessage.cameraCutVo.addr"
                            >{{ item.capMessage.cameraCutVo.addr }}</span
                          >
                          <span v-else class="moreWord">--</span>
                        </p> -->
                        <p>
                          时间：{{ getTimeByTimeStamp(item.capMessage.time) }}
                        </p>
                      </div>
                    </div>
                    <div v-else>
                      <div class="list" v-for="(item, i) in list" :key="i">
                        <div class="face" v-if="item.archivesInfo" :class="(item.archivesInfo.isReplace&&item.archivesInfo.score!=100.0)?'active':''">
                          <img :src="item.faceInfo.faceUrl" alt />
                        </div>
                        <div class="face" v-else>
                          <img :src="item.faceInfo.faceUrl" alt />
                        </div>
                        <p class="flex justify-content-between align-items-center">
                          <span v-if="item.archivesInfo"
                            >相似度：{{
                              getSimilarityDisplay(
                                Math.round((item.archivesInfo.score) * 100) / 100
                              )
                            }}</span
                          >
                          <span v-else>相似度：{{getSimilarityDisplay(
                                Math.round((item.score) * 100) / 100
                              )}}</span>
                          <span
                            class="aBtn"
                            @click="showDialogPersonDetail(item)"
                            >详情</span
                          >
                        </p>
                        <p class="flex align-items-center">
                          摄像机：
                          <span
                            v-if="item.cameraCutVo"
                            :title="item.cameraCutVo.name"
                            class="moreWord"
                            >{{ item.cameraCutVo.name }}</span
                          >
                          <span v-else class="moreWord">--</span>
                        </p>
                        <!-- <p class="flex align-items-center">
                          抓拍地址：
                          <span
                            v-if="item.cameraCutVo"
                            class="moreWord"
                            :title="item.cameraCutVo.addr"
                            >{{ item.cameraCutVo.addr }}</span
                          >
                          <span v-else class="moreWord">--</span>
                        </p> -->
                        <p>时间：{{ getTimeByTimeStamp(item.time) }}</p>
                      </div>
                    </div>
                  </div>
                  <p v-else class="empty">未查询到相关记录！</p>
                </ScrollList>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="地图展示" name="second">
              <trackMap
                ref="trackmap"
                :type="'track'"
                :isOnePerson="onePerson"
                :height="!topHidden ? height_w - 510 : height_w - 370"
                :noticeList="noticeList"
                :PointerList="PointerList"
                :center="center"
                :showMapDialog="showMapDialog"
                :hiddenHandleBtn="true"
                :person="data"
                :start="startTime"
                :end="endTime"
                :faceId="faceId"
              ></trackMap>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </template>
    </common-dialog>
    <DialogPersonDetail
      :visible="dialogPersonDetail.visible"
      :hiddenHistoryAlarm="true"
      :hideOriginalFace='true'
      :hiddenHandleBtn="false"
      :hidePersonInfo='true'
      :form="dialogPersonDetail.form"
      @close="dialogPersonDetail.visible = false"
    ></DialogPersonDetail>
    <!-- <DialogAddOrUpdate
      :visible="dialogAddOrUpdate.visible"
      :form="dialogAddOrUpdate.form"
      :title="dialogAddOrUpdate.title"
      :curState="dialogAddOrUpdate.curState"
      @close="dialogAddOrUpdate.visible = false"
      @submit="addOrUpdate"
      :onePerson="onePerson"
    ></DialogAddOrUpdate> -->
  </div>
</template>

<script>
// import searchList from "../../track/components/searchList";
// import DialogAddOrUpdate from "./DialogAddOrUpdate";
// import trackMap from "./trackMap";
import {
  getTodayStartTime,
  getBase64FromUrl,
  getSimilarityDisplay,
  getTimeByTimeStamp,
  message
} from "@/utils";
import { subDays, format, isMonday } from "date-fns";
import CommonDialog from './CommonDialog.vue'
import DialogPersonDetail from "../../security/components/DialogPersonDetail/DialogPersonDetail.vue";
import {
  searchOnePersonTrack
} from "@/api/police.ts";
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
const date = new Date();
export default {
  props: ["visible", "data", "currentTreeNode", "onePerson"],
  components: { CommonDialog,DialogPersonDetail,ScrollList},
  data() {
    return {
      topHidden: false,
      dialogPersonDetail: {
        visible: false,
        form: {},
      },
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      activeName: "first",
      list: [],
      showMapDialog: true,
      PointerList: [],
      noticeList: [],
      center: { lng: 104.06792346, lat: 30.67994285 },
      time: 1,
      sortRule: 1,
      options: [
        {
          value: 1,
          label: "全部",
        },
        {
          value: 4,
          label: "自定义",
        },
      ],
      order: [
        {
          value: 1,
          label: "抓拍时间由近及远",
        },
        {
          value: 2,
          label: "相似度由高到低",
        },
      ],
      similarityList: [],
      form: {
        date: [],
        faceUrl: "",
      },
      startTime: null,
      endTime: null,
      loading: false,
      page: 1,
      row: 10,
      searchData: [],
      noMore: false,
      faceId: "",
      personInfo: {},
      pagination: {
        show: false,
        total: 0,
        page: 1,
        pageSize: 30,
      },
      canPullUp: true,
      total: 0,
      dialogAddOrUpdate: {
        visible: false,
        curState: "",
        title: "",
        form: {
          faceUrl: "",
          name: "",
          phone: "",
          cardType: "",
          cardNo: "",
          birthday: "",
          sex: 3,
          homeTown: "",
          jobAddress: "",
          address: "",
          country: "",
        },
      },
      isUpdate: false,
      updateData: {}, //修改完返回的人员数据
    };
  },
  computed: {
    disabled() {
      return this.loading;
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        this.form.faceUrl = this.data.faceUrl;
        this.faceId = this.data.id;
        this.search();
      }
    },
  },
  created() {},
  methods: {
    handleClose() {
      this.activeName = "first";
      this.noticeList = [];
      this.PointerList = [];
      this.list = [];
      this.time = 1;
      this.sortRule = 1;
      this.startTime = null;
      this.endTime = null;
      this.canPullUp = true;
      this.total = 0;
      this.pagination.page = 1;
      this.$emit("close",this.isUpdate);
      this.$emit("refresh");
      this.isUpdate = false;
    },
    handleSubmit() {},
    tabClick() {
      if (this.activeName == "second") {
        // this.search();
        // this.$refs.trackmap.getData();
        // this.$refs.trackmap.setCenterAndRoom();
        // this.time=1;
      }
    },
    changeTime(i) {
      // this.endTime=format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      switch (i) {
        case 1:
          this.startTime = null;
          this.endTime = null;
          this.search();
          if (this.activeName == "second") {
            // this.$refs.trackmap.getData();
          }
          break;
        case 2:
          this.startTime = format(
            subDays(new Date(), 7),
            "yyyy-MM-dd HH:mm:ss"
          );
          break;
        case 3:
          this.startTime = format(
            subDays(new Date(), 30),
            "yyyy-MM-dd HH:mm:ss"
          );
          break;
        default:
          break;
      }
      //
    },
    datePicker() {
      this.startTime = this.form.date[0];
      this.endTime = this.form.date[1];
      if (this.activeName == "second") {
        // this.$refs.trackmap.getData(this.startTime, this.endTime);
      } else {
        this.pagination.page = 1;
        this.search();
      }
    },
    scrollToBottom() {
      this.pagination.page++;
      this.search();
    },
    async search() {
      // let url =
      //   this.onePerson == "person"
      //     ? this.$url.tech.csia_personArchives_trackArchive
      //     : this.onePerson=="night"?this.$url.tech.csia_nightOut_info:this.$url.portraitLibrary.csia_faces_trackArchive;
      // let param = {
      //   endTime: this.endTime,
      //   startTime: this.startTime,
      //   page: this.pagination.page,
      //   pageSize: this.pagination.pageSize,
      // };
      // let method ;
      // if(this.onePerson=="person"){
      //   param.archivesId= this.faceId;
      //   method ="post";
      // }else if(this.onePerson=="night"){
      //    param={
      //      id:this.faceId
      //    }
      //    method ="get";
      // }else{
      //   param.faceId= this.faceId
      //   method ="post";
      // }
      // let { code, message, data } = await this.$http[method](url, param);
      let params = {
        archivesId: this.faceId,
        endTime: this.endTime,
        startTime: this.startTime,
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
      }
      
      let res1 =  await searchOnePersonTrack(params);
      let { code, message, data } = res1.data;
      if (code != 200) {
        if (message) {
          message('error',message)
        }
        return;
      }
      this.total = data.total;
      if (data.records.length == 0) {
        this.canPullUp = false;
      }
      if (this.pagination.page == 1) {
        this.list = data.records;
        this.$refs.scrollList.scrollToTop();
      } else {
        this.list = [...this.list, ...data.records];
      }
      if(this.list.length == this.total) {
        this.canPullUp = false;
      }
    },
    showDeleteDialog() {
      this.$confirm("删除人像,轨迹档案也会一并删除,确定吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {

          this.delete();
        })
        .catch(() => {});
    },
    async delete() {
      let url = this.onePerson=="person"?this.$url.tech.csia_personArchives:this.$url.portraitLibrary.csia_faces;
      let param = { id: this.data.id };
      let { code, message, data } = await this.$http.delete(url, param);
      if (code != 200) {
        if (message) {
          message('error',message)
        }
        return;
      }
      message('success',this.$constant.msg.deleteSuccess)
      // this.$message.success();
      this.onePerson=="person"?this.isUpdate=true:this.isUpdate=false;
      this.handleClose();
    },
    showDialogPersonDetail(item) {
      console.log(item)
      let isPerson = this.onePerson == "person";
      let currentRow;
      if (!isPerson) {
        currentRow = {
          ...this.data,
          name: this.data.name || "",
          cameraId: item.capMessage.cameraId,
          capTime: getTimeByTimeStamp(item.capMessage.time),
          humanImg: item.capMessage.humanInfo.humanImg,
          panoramaImg: item.capMessage.faceInfo.panoramaImg,
          faceInfo:item.capMessage.faceInfo,
          originFace: item.capMessage.cameraCutVo
            ? item.capMessage.cameraCutVo.originPiv
            : "",
          capFace: item.capMessage.faceInfo.faceUrl,
          similarity: item.score,
          hiddenPerson: false,
          trackLibrary: true,
          cameraCutVo: item.capMessage.cameraCutVo || {
            name: "",
            gps: null,
            addr: "",
            cameraGroupId: "",
            cameraGroupName: "",
          },
        };
      } else {
        currentRow = {
          ...this.data,
          name: this.data.name || "",
          cameraId: item.cameraId,
          capTime: getTimeByTimeStamp(item.time),
          humanImg: item.humanInfo.humanImg,
          panoramaImg: item.faceInfo.panoramaImg,
          faceInfo:item.faceInfo,
          originFace: item.cameraCutVo ? item.cameraCutVo.originPiv : "",
          capFace: item.faceInfo.faceUrl,
          similarity: item.archivesInfo.score,
          hiddenPerson: false,
          trackLibrary: true,
          cameraCutVo: item.cameraCutVo || {
            name: "",
            gps: null,
            addr: "",
            cameraGroupId: "",
            cameraGroupName: "",
          },
        };
      }
      currentRow.originFace = this.data.faceUrl;
      currentRow.time = item.time;
      currentRow.humanInfo = isPerson
        ? item.humanInfo
        : item.capMessage.humanInfo;
      this.dialogPersonDetail.visible = true;
      this.dialogPersonDetail.form = currentRow;
    },
    showUpdateDialog() {
      this.dialogAddOrUpdate.curState = "update";
      this.dialogAddOrUpdate.title = "修改人像";
      this.dialogAddOrUpdate.visible = true;
      let currentRow = { ...this.data };
      this.dialogAddOrUpdate.form = currentRow;
    },
    async addOrUpdate(form) {
      if(this.onePerson!='person'){
        form.faceDbId = this.currentTreeNode.id;
      }
      let url = this.onePerson=='person'?this.$url.tech.csia_personArchives:this.$url.portraitLibrary.csia_faces;
      let method;
      let successMsg;
      if (this.dialogAddOrUpdate.curState == "add") {
        method = "post";
        successMsg = "新增成功";
      } else {
        method = "put";
        successMsg = "修改成功";
      }
      
      let { code, message, data } = await this.$http[method](url, form);
      this.$store.commit("disableHttpLoading", false);
      this.$store.commit("showLoading", false);
      if (code != 200) {
        if (message) {
          message('error',message)
        }
        return;
      }
      message('success',successMsg)
      this.dialogAddOrUpdate.visible = false;
      this.isUpdate = true;
      this.updateData = data;
      // this.handleClose();
    },
    getSimilarityDisplay,
    getTimeByTimeStamp,
  },
};
</script>

<style lang='scss' scoped>
.top-hidden {
  cursor: pointer;
  position: absolute;
  right: 40px;
  top: 50px;
}
.aBtn {
  line-height: 40px;
  margin-right: 15px;
  color:#409eff;
  cursor: pointer;
}
.break {
  word-break: break-all !important;
}
.list-layout {
  .list {
    margin: 0 20px 15px 0;
    box-shadow: 4px 0 4px 0 rgba(22,87,184,.13), 0 2px 4px rgba(0,0,0,.12);
    img,
    .face {
      width: 200px;
      height: 200px;
      object-fit: contain;
      overflow: hidden;
      border: 0;
    }
    font-size: 14px;
    line-height: 24px;
    p {
      width: 200px;
    }
    .moreWord {
      width: 130px;
    }
  }
}
.hidden {
  width: 40%;
  p {
    display: flex;
    align-items: center;
    width: 100%;
  }
  p > span:last-child {
    // width: 60%;
    flex: 1;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.flex {
  display: flex;
}
.scollList {
  // display: grid;
  // align-items: flex-start;
  // grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  .list {
    display: inline-block;
  }
}
.empty {
  text-align: center;
  line-height: 100px;
  box-sizing: border-box;
}
.face-url {
  width: 140px;
  height: 140px;
  margin: 0 50px 0 100px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.flex {
  display: flex;
  .person-info {
    line-height: 24px;
    span {
      display: inline-block;
      text-align: left;
      width: 120px;
    }
    .title{
      text-align: right;
      width: 90px;
    }
  }
}
.search-box {
  margin-top: 20px;
  position: relative;
  .search-result {
    position: absolute;
    right: 5px;
    top: -5px;
    z-index: 10;
  }
}
::v-deep {
  .el-range-input,.el-input__inner,.el-range-separator {
    background: #fff;
    border: 1px solid rgba(61, 73, 101, 1);
    border-radius: 3px;
    color: #333;
  }
  .el-range-separator{
    padding-right:20px;
     border:0;
  }
  .el-range-input{
    border:0;
  }
  .el-date-editor {
    width: 400px;
  }
}
.active{
  border: 2px solid rgb(192, 21, 21);
}
 /deep/.el-tabs__nav{
    .is-top{
      background: transparent;
      color:#e4edef;
    }
    .el-tabs__item.is-active{
      color:#409EFF;
    }
    .el-tabs__active-bar{
      background-color: #409EFF;
      color:#409EFF;
    }
 }
  /deep/.el-dialog__body{
    color: #fff;
  }
</style>