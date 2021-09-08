<template>
  <div class="app-container">
    <div class="components-container">
      <div class="rightContent">
        <el-row>
          <el-col :span="24">
            <action-header ref="actionHeader" :initFormHeader="initForm" @fetchData="fetchData" @clearFilter='clearFilter' :police='true' :filterForm="filterForm" :btnStatus="0" :moreStatus='false' linkUrl="/statementManage/personPassChart" :total="page.total">
              <div slot="houseNum">
                <div class="word-filter">
                  <span class="filter-name">姓名:</span>
                  <el-input style="width:250px" clearable @keyup.enter.native="emitFetchData" placeholder="请输入需查找的姓名" class="input-filter" maxlength="20" v-model.trim="filterForm.name" size="small"></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">手机号:</span>
                  <el-input style="width:250px" clearable @keyup.enter.native="emitFetchData" placeholder="请输入需查找的手机号" class="input-filter" maxlength="11" v-model.trim="filterForm.phone" size="small"></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">学号:</span>
                  <el-input style="width:250px" clearable @keyup.enter.native="emitFetchData" placeholder="请输入需查找的学号" class="input-filter" maxlength="30" v-model.trim="filterForm.studentNo" size="small"></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">通行位置:</span>
                  <el-input class="input-filter" style="width:250px" clearable size="small" maxlength="30" @keyup.enter.native="emitFetchData" v-model="filterForm.bindName" placeholder="请输入通行位置查找">
                  </el-input>
                </div>
                <!-- <div class="word-filter">
                  <span class="filter-name">通行时间:</span> &nbsp;&nbsp;
                  <el-date-picker style="width:300px;" v-model="timeRange" type="datetimerange" range-separator="-" size="small" @change="timeRangeChange" format="yyyy - MM - dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" :clearable="true" :picker-options="pickerOptions" end-placeholder="结束日期"></el-date-picker>
                </div> -->
                 <div class="word-filter">
                  <span class="filter-name">开始时间:</span>
                  <el-date-picker v-model="filterForm.startTime"  @change="startChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  <!-- <el-date-picker  value-format="yyyy-MM-dd HH:mm:ss" v-model="dateRange" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker> -->
                </div>
                <div class="word-filter">
                  <span class="filter-name">结束时间:</span>
                  <el-date-picker v-model="filterForm.endTime" @change="endChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  <!-- <el-date-picker v-show="time == 4" value-format="yyyy-MM-dd HH:mm:ss" v-model="dateRange" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker> -->
                </div>
                <div class="word-filter">
                  <span class="filter-name">出入类型:</span>
                  <el-select class="input-filter" style="width:250px" clearable v-model="filterForm.inOut" placeholder="请选择" size="small">
                    <el-option label="进" value="进"></el-option>
                    <el-option label="出" value="出"></el-option>
                  </el-select>
                </div>
                <div class="word-filter">
                  <span class="filter-name">人员类型:</span>
                  <el-select class="input-filter" style="width:250px" clearable v-model="filterForm.userType" placeholder="请选择" size="small">
                    <el-option label="学生" value="STUDENT"></el-option>
                    <el-option label="老师" value="TEACHER"></el-option>
                    <el-option label="职工" value="WORKER"></el-option>
                    <el-option label="访客" value="VISITOR"></el-option>
                    <el-option label="家长" value="PARENT"></el-option>
                    <el-option label="其他人员" value="PERSONSOTHER"></el-option>
                  </el-select>
                </div>
              </div>
            </action-header>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24" class="table-col">
            <el-table :data="list_data" stripe v-loading="showLoading" border highlight-current-row @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange">
              <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="姓名">
                <template slot-scope="scope">
                  <div v-if='scope.row.userType!="VISITOR"' class="large-span">
                    <span class="serial-num click-span" @click="openDetail(scope.row)" v-if='scope.row.scenceUser'>{{ scope.row.scenceUser.name||'' }}</span>
                    <span class="serial-num" v-else>--</span>
                  </div>
                  <div v-else class="large-span">
                    <span class="serial-num click-span" @click="openDetail(scope.row)" v-if='scope.row.visitorInfo'>{{ scope.row.visitorInfo.name||'' }}</span>
                    <span class="serial-num" v-else>--</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="scenceUser" label="手机号">
                <template slot-scope="{ row }">
                  <span>{{row.userType!="VISITOR"?(row.scenceUser?(row.scenceUser.phone || '--'):'--'):(row.visitorInfo?(row.visitorInfo.phone || '--'):'--')}}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="studentNo" label="学号">
                <template slot-scope="{ row }">
                  <span v-if='row.studentNo'>{{row.studentNo}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="passMethod" label="通行方式">
                <template slot-scope="{ row }">
                  <span>{{ row.passMethod | passMethod }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="deviceInfo.inOut" label="出入类型"></el-table-column>

              <el-table-column :show-overflow-tooltip="true" width="120" align="center" prop="devId" label="通行设备">
                <template slot-scope="scope">
                  <span class="serial-num">{{ scope.row.deviceInfo.name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="devType" label="通行位置">
                <template slot-scope="scope">
                  <span class="serial-num">{{ scope.row.deviceInfo.bindingAddress }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="isVisitor" label="人员类型">
                <template slot-scope="{ row }">
                  <span>{{ row.userType | userType }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" align="center" prop="img" label="抓拍人脸">
                <template slot-scope="scope">
                  <img v-if="scope.row.photos" style="margin-top: 3px" class="capture-img" @mouseout="twoImg.visible = false" @mouseover="showImg(scope)" :src="scope.row.photos" alt />
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="passTime" label="通行时间" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- <ImageMagni :centerDialogVisible="imgVisible" :bigTitle="imgTitle"  :bigImg="bigImg" /> -->
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="600px" title="门禁通行详情" :visible.sync="detailShow">
      <el-row :gutter="0" class="flex">
        <el-col :span="8" style="margin-right:20px">
          <div class="commonRow">
            <!-- <div class="label">人像：</div> -->
            <div class="value renxiang-con"> <img :src="detailData.userType ==='VISITOR'?(detailData.visitorInfo?(detailData.visitorInfo.faceImg ||'/static/img/capture.b3fd5b10.png') :'/static/img/capture.b3fd5b10.png') :
              detailData.scenceUser?(detailData.scenceUser.face ||'/static/img/capture.b3fd5b10.png'):'/static/img/capture.b3fd5b10.png'" class="avatar avatar-single" />
            </div>
          </div>
          <!-- <div class="commonRow studentCom" style="margin-top:14px;">
            <div class="label">通行设备：</div>
            <div class="value">{{ detailData.deviceInfo?detailData.deviceInfo.name:""}}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">人员类型：</div>
            <div class="value">{{ detailData.userType | userType}}</div>
          </div>
          <div class="commonRow studentCom" v-if="detailData.userType === 'VISITOR'">
            <div class="label">被访人：</div>
            <div class="value">{{ '--'}}</div>
          </div> -->
        </el-col>
        <el-col :span="16">
          <div class="commonRow studentCom" style="margin-top:40px;">
            <div class="label">姓名：</div>
            <div class="value">{{ detailData.userType!=='VISITOR'?(detailData.scenceUser?detailData.scenceUser.name:'--'): (detailData.visitorInfo?detailData.visitorInfo.name:"--")}}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label"> {{detailData.userType=== 'STUDENT'?'学号':'手机号'}}：</div>
            <div class="value">{{ detailData.userType=== 'STUDENT'?(detailData.studentNo || '--'):detailData.userType!== 'VISITOR'?(detailData.scenceUser?detailData.scenceUser.phone|| '--':'--'):(detailData.visitorInfo?detailData.visitorInfo.phone|| '--':"--") }}</div>
          </div>
         
          <!-- <div class="commonRow studentCom" style="margin-top:40px">
            <div class="label">出入类型：</div>
            <div class="value">{{ detailData.deviceInfo?detailData.deviceInfo.inOut:''}}</div>
          </div> -->
          <!-- <div class="commonRow studentCom">
            <div class="label">通行位置：</div>
            <div class="value">{{ detailData.deviceInfo?detailData.deviceInfo.bindingAddress:''}}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">通行时间：</div>
            <div class="value">{{ detailData.passTime}}</div>
          </div>
          <div class="commonRow studentCom" v-if="detailData.userType === 'VISITOR'">
            <div class="label">身份证号：</div>
            <div class="value">{{ detailData.visitorInfo.idNo || "--"}}</div>
          </div>
          <div class="commonRow studentCom" v-if="detailData.userType === 'VISITOR'">
            <div class="label">来访目的：</div>
            <div class="value">{{detailData.visitorInfo.visitReason || "--"}}</div>
          </div> -->
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top:15px;">
        <el-col :span="12">
          <div class="commonRow studentCom" >
            <div class="label">通行方式：</div>
            <div class="value">{{ detailData.passMethod | passMethod}}</div>
          </div>
        </el-col>
        <el-col :span="12">
           <div class="commonRow studentCom">
            <div class="label">人员类型：</div>
            <div class="value">{{ detailData.userType | userType}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24" >
        <el-col :span="12">
          <div class="commonRow studentCom" >
            <div class="label">出入类型：</div>
            <div class="value">{{ detailData.deviceInfo?detailData.deviceInfo.inOut:''}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow studentCom" >
            <div class="label">通行设备：</div>
            <div class="value">{{ detailData.deviceInfo?detailData.deviceInfo.name:""}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24" >
        <el-col :span="12">
          <div class="commonRow studentCom" >
            <div class="label">通行位置：</div>
            <div class="value" :title="detailData.deviceInfo?detailData.deviceInfo.bindingAddress:''">{{  detailData.deviceInfo?detailData.deviceInfo.bindingAddress:'' }}</div>
          </div>
        </el-col>
        <el-col :span="12">
            <div class="commonRow studentCom">
            <div class="label">通行时间：</div>
            <div class="value">{{ detailData.passTime}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="commonRow studentCom" v-if="detailData.userType === 'VISITOR'">
            <div class="label">身份证号：</div>
            <div class="value">{{ detailData.visitorInfo.idNo || "--"}}</div>
          </div>
        </el-col>
        <el-col :span="12">
           <div class="commonRow studentCom" v-if="detailData.userType === 'VISITOR'">
            <div class="label">来访目的：</div>
            <div class="value">{{detailData.visitorInfo.visitReason || "--"}}</div>
          </div>
        </el-col>
      </el-row>
       <el-row :gutter="24">
        <el-col :span="12">
         <div class="commonRow studentCom" v-if="detailData.userType === 'VISITOR'">
            <div class="label">被访人：</div>
            <div class="value">{{ '--'}}</div>
          </div>
        </el-col>
        <el-col :span="12">
           <!-- <div class="commonRow studentCom" v-if="detailData.userType === 'VISITOR'">
            <div class="label">来访目的：</div>
            <div class="value">{{detailData.visitorInfo.visitReason || "--"}}</div>
          </div> -->
        </el-col>
      </el-row>
       
      <!-- <el-row :gutter="0">
        <el-col :span='12'>
         
        </el-col>
        <el-col :span="12" v-if="studentDetail.hasRelative">
          
        </el-col>
         <el-col :span="24"  style="margin-top:15px;">
         <div class="commonRow" >
            <div class="label">备注：</div>
            <div class="value" :title="studentDetail.note">{{ studentDetail.note}}</div>
          </div>
        </el-col> 
      </el-row> 
       </div> -->
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { getPassAddress } from "@/api/peopleApi.ts";
import { formatTimeObj } from "@/utils";
import mixin from "@/config/minxins";
import config from "@/api/config";
const ActionHeader = () => import("@/components/ActionHeader.vue");
// const ImageMagni = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    // ImageMagni,
    TwoImg,
  },
  filters: {
    passMethod(val: string) {
      const data = {
        FACE_OPEN: "人脸开门",
        VISITOR_OPEN: "访客开门",
        SCAN_OPEN: "二维码开门",
        REMOTE_OPEN: "远程开门",
        CARD_OPEN: "刷卡开门",
        DYNAMIC_CODE_OPEN: "动态密码",
      };
      return data[val];
    },
    devType(val: string) {
      const data = {
        "1": "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
      };
      return data[val];
    },
    userType(val: string) {
      const data = {
        STUDENT: "学生",
        TEACHER: "老师",
        WORKER: "职工",
        VISITOR: "访客",
        PARENT: "家长",
        PERSONSOTHER: "其他人员",
      };
      return data[val];
    },
  },
})
export default class PersonPass extends Vue {
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  imgTitle: string = "人脸";
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };
  filterForm: object = {
    bindName: "",
    buildingId: "",
    bindingType: "",
    name: "",
    phone: "",
    studentNo: "",
    startTime: "",
    endTime: "",
    passMethod: [],
    inOut: "",
    userType: "",
    isVisitor: null,
  };
  timeRange: Array<string> = [];
  detailData: any = {};
  pickerOptions: object = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };
  initForm: object = {
    url: config.v2 + "/admin/peoplePass/ktwelve",
    method: "get",
  };
  detailShow: boolean = false; //详情窗口
  pickOptionStart: any = [];
  pickOptionEnd: any = [];
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍人脸";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }
  // 时间变化
  timeRangeChange(val) {
    if (val && val.length) {
      this.filterForm["startTime"] = val[0];
      this.filterForm["endTime"] = val[1];
    } else {
      this.filterForm["startTime"] = "";
      this.filterForm["endTime"] = "";
    }
  }
   startChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.filterForm["startTime"] = "";
      this.$message.warning("开始时间不能大于等于结束时间");
    }
  }
  endChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.filterForm["endTime"] = "";
      this.$message.warning("结束时间不能小于等于开始时间");
    }
  }
      // 时间比较
  comptime() {
    var beginTime = this.filterForm["startTime"];
    var endTime = this.filterForm["endTime"];
    if (!!beginTime && !!endTime) {
      var beginTimes = beginTime.substring(0, 10).split("-");
      var endTimes = endTime.substring(0, 10).split("-");

      beginTime =
        beginTimes[1] +
        "-" +
        beginTimes[2] +
        "-" +
        beginTimes[0] +
        " " +
        beginTime.substring(10, 19);
      endTime =
        endTimes[1] +
        "-" +
        endTimes[2] +
        "-" +
        endTimes[0] +
        " " +
        endTime.substring(10, 19);

      var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
      return a;
    }
  }
  clearFilter() {
    this.setTime();
    this.filterForm["bindName"] = "";
    this.filterForm["name"] = "";
    this.filterForm["phone"] = "";
    this.filterForm["studentNo"] = "";
    this.filterForm["startTime"] = "";
    this.filterForm["endTime"] = "";
    this.filterForm["inOut"] = "";
    this.filterForm["userType"] = "";
  }
  setTime() {
    const today = new Date().getTime();
    const sevenDay = today - 30 * 24 * 60 * 60 * 1000;
    this.filterForm["startTime"] = formatTimeObj(sevenDay, "detail");
    this.filterForm["endTime"] = formatTimeObj(today, "detail");
    this.timeRange = [
      formatTimeObj(sevenDay, "detail"),
      formatTimeObj(today, "detail"),
    ];
  }
  openDetail(row) {
    this.detailData = row;
    this.detailShow = true;
  }
  created() {
    this.setTime();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  // 通行位置搜索建议
  querySearch(string: string, cb) {
    let result = [];
    getPassAddress(string).then((res) => {
      if (res.data.data) {
        result = res.data.data;
        result.splice(10);
        cb(result);
      }
    });
  }
  // 改变通行位置时 清空id
  changeLoc() {
    console.log(this.filterForm);
    this.filterForm["buildingId"] = "";
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    this.filterForm["bindName"] = val["locationName"];
    this.filterForm["buildingId"] = val["id"];
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    border-bottom: 1px solid #e4e7ed;
  }
  .el-dialog__body {
    padding: 30px;
  }
}
.main {
  display: flex;
  .rightContent {
    flex: 1;
  }
}
.app-container {
  height: calc(100% - 15px);
}
.rightContent {
  height: calc(100vh - 80px);
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.fun-btn {
  position: absolute;
  left: -64px;
  top: 38%;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -8px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}

.capture-img {
  width: 30px;
  height: 30px;
}
.floatForm {
  height: 32px;
}
.commonRow {
  overflow: hidden;
  // margin-bottom: 30px;
  .label {
    float: left;
  }
  .value {
    float: left;
    
    .avatar {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .renxiang-con{
    width: 178px;
    height: 178px;
    border: 1px solid #d8d8d8;
  }
}
.large-span {
  height: 42px;
  line-height: 42px;
}
.click-span {
  color: #3a8ee6;
  cursor: pointer;
}

</style>
