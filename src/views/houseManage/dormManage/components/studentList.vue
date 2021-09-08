<template>
  <div class="app-container1">
    <div class="components-container">
      <split-pane split="vertical" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <data-tree :page="page" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="true" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <!-- <FloorControl
              v-show="cutBtnType"
              ref="FloorControl"
              @showHouseDetails="showHouse"
            ></FloorControl> -->
            <el-row>
              <el-col :span="24">
                <!-- :floorControl="queryBuildingId && floorControlStatus ? true : false" -->
                <action-header :btnStatus="0" :initFormHeader="initForm" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :moreStatus="false" :houseStatus="true" :total="page.total" @fetchData="fetchData">
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">姓名:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model.trim="filterForm.studentName" placeholder="输入姓名" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">班级:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model.trim="filterForm.className" placeholder="输入班级" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">学号:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model.trim="filterForm.studentNo" placeholder="输入学号" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">所属楼层:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="2" v-model.trim="filterForm.storey" @input="numberInput" placeholder="输入所属楼层" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">入住房间:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model="filterForm.serialNum" placeholder="输入入住房间号" size="small"></el-input>
                    </div>
                  </div>
                </action-header>
              </el-col>
            </el-row>
            <el-table v-show="!cutBtnType" :data="list_data" stripe border v-loading="showLoading" highlight-current-row @cell-mouse-enter="enterRowChange" @selection-change="handleSelectionChange" @cell-mouse-leave="leaveRowChange" @sort-change="sortChange">

              <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              </el-table-column>
              <el-table-column align="center" prop="name" :show-overflow-tooltip="true" label="姓名">
                <template slot-scope="scope">
                  <span type="text"> {{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="users" align="center" label="班级">
                <template slot-scope="scope">
                  <span type="text"> {{ scope.row.myClass.className }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="studentNo" align="center" label="学号"></el-table-column>
              <!-- <el-table-column
                width="120"
                align="center"
                prop="phone"
                label="电话"
              >
              </el-table-column> -->
              <el-table-column width="120" align="center" prop="type" label="人脸图像">
                <template slot-scope="scope">
                  <img v-if="scope.row.face" class="capture-img cur-img" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" :src="scope.row.face" alt @click="openUpload(scope.row)" />
                </template>
              </el-table-column>
              <el-table-column width="80" align="center" prop="storey" label="所属楼层">
              </el-table-column>
              <el-table-column width="200" align="center" prop="locationName" label="入住房间">
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
                <template slot-scope="scope">
                  <span v-show="!scope.row.noteStatus">{{
                    scope.row.note || "--"
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-if="!cutBtnType" style="padding: 5px" background layout="prev, pager, next" :current-page.sync="page.page" :page-size="page.limit" :total="page.total" @current-change="pageChange"></el-pagination>
            <div style="z-index: 9" class="menu-control">
              <p class="close-menu">
                <i v-if="rowSpan === 12" class="iconfont icon-left icon-class"></i>
                <i v-else class="iconfont icon-zuo icon-class"></i>
              </p>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import mixin from "@/config/minxins";
import { _throttle } from "@/utils";
import splitPane from "vue-splitpane";
import config from "@/api/config";
import { getHouseTreeData } from "@/api/houseApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
// const FloorControl = () =>
//   import("@/views/houseManage/houseList/floorControl.vue"); //楼控

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    BigImg,
    // FloorControl,
    splitPane,
  },
})
export default class studentList extends Vue {
  private cutBtnType: Boolean = false;
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  TreeData: Array<Object> = []; // 树形结构数据
  uploadFaceVisible: boolean = false; //人脸弹窗
  private rowSpan: number = 12;
  queryBuildingId: string = "";
  imageUrl: string = "";
  filterForm: object = {
    roomNumber: "",
    // buildingId: "",
    userName: "",
  };
  initForm: object = {
    url: config.v1 + "/admin/student-room-link/searchAllStudentsByBuilding",
    method: "get",
  };
  Form: object = {
    userName: [],
    buildingId: "",
    note: "",
    serialNumber: "",
    status: "",
    storeyNum: "",
  };
  rules: any = {
    serialNumber: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[0-9]\d*$/.test(value)) {
            callback(new Error("填写正确的房间号"));
          } else {
            callback();
          }
        },
      },
    ],
    buildingId: [
      { required: true, message: "请选择房屋所属楼层", trigger: "change" },
    ],
    userName: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
  };
  handleBuildingId(data) {
    /**@description 获取宿舍楼id */
    this.queryBuildingId = data.id;
    this.filterForm["buildingId"] = data.id;

    // this.$refs["FloorControl"]["listQuery"] = {
    //   buildingId: data.id
    // };
    // this.$refs["FloorControl"]["fetchInfo"]();
  }
  numberInput() {
    // if(!/^\d{1,2}$/.test(this.filterForm['storey'])) {
    //   this.filterForm['storey'] = this.filterForm['storey'][0];
    // }
    this.filterForm["storey"] = this.filterForm["storey"].replace(/\D/g, "");
  }
  // 获取房屋结构
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
      // this.rules["buildingId"].push({
      //   required: true,
      //   trigger: "change",
      //   validator: (rule, value, callback) => {
      //     if (!this.Form["buildingIdArr"].length) {
      //       callback(new Error("请先创建宿舍楼"));
      //     } else {
      //       callback();
      //     }
      //   }
      // });
    });
  }
  openUpload(scope) {
    this.imageUrl = scope.face;
    this.uploadFaceVisible = true;
  }
  // 注册人数排序
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order !== "ascending";
    this["fetchData"](this.initForm);
  }
  created() {
    this.getHouseTreeData();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .rightContent {
    height: 65vh;
    flex: 1;
    position: relative;
  }
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.rightContent {
  height: 100%;
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
.content {
  height: calc(100vh - 92px - 43px) !important;
}
/deep/ .splitter-pane.vertical.splitter-paneR {
  height: calc(100% - 43px);
}
.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
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
.components-container {
  position: relative;
  height: 100%;
}
.in-personnel {
  width: 100%;
  // height: 352px;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
}
.personnel-item {
  margin: 10px 0 0 16px;
}
.personnel-target {
  box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13), 0 2px 4px rgba(0, 0, 0, 0.12);
  padding: 5px;
}
.personner-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  display: block;
  margin: 0 auto 4px;
}
.personner-text {
  line-height: 20px;
  font-size: 12px;
}
.personner-name {
  width: 110px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-button--mini {
    padding: 5px 10px;
  }
  .personner-text {
    .el-date-editor {
      width: 60px;
      height: 20px;
    }
    .el-input__inner {
      width: 30px;
      height: 20px;
      padding: 0 25px;
    }
    .el-input__icon {
      line-height: 20px;
    }
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
