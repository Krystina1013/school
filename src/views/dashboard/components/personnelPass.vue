<template>
  <div>
    <div class="pass scene-rename">
      <div class="scene-header">
        <!-- <svg-icon icon-class="v_zanbi" class-name="scene-house" /> -->
        <i class="iconfont icon-renyuantongji1"></i>
        <span class="scene-titile">人员通行</span>
        <router-link v-if="permissionList.includes('managementLook')" :to="{ name: 'management' }">
          <el-button style="float:right;padding:5px 0px 0px 0px" type="text">查看更多</el-button>
        </router-link>
      </div>
      <div>
        <el-table
          id="rewrite-table"
          :data="tableData"
          height="340px"
          style="width: 100%; overflow-y: hidden;overflow-x: hidden;"
        >
          <el-table-column prop="date" label="类型" align="center" width="80">
            <template slot-scope="{ row }">
              <span>{{ row.isVisitor ? "访客" : "住户" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="姓名" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.name || "" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="devAddress"
            label="通行位置"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column prop="date" label="开门方式" align="center" :show-overflow-tooltip="true">
            <template slot-scope="{ row }">
              <span>{{ row.passMethod | passMethod }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" align="center" label="抓拍人脸">
              <template slot-scope="scope">
                <img
                  v-if="scope.row.photos"
                  style="margin-top: 3px"
                  class="capture-img"
                  @mouseout="twoImg.visible = false"
                  @mouseover="showImg(scope)"
                  :src="scope.row.photos"
                />
              </template>
            </el-table-column>
          <!-- <el-table-column label="照片" align="center">
            <template slot-scope="{ row }">
              <img
              v-if="row.photos"
                :src="row.photos"
                alt
                @mouseout="imgVisible = false"
                @mouseover="(imgVisible = true), (bigImg = row.photos)"
              />
            </template>
          </el-table-column> -->
          <el-table-column
            width="180px"
            prop="passTime"
            label="时间"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg
      :visible="twoImg.visible"
      :leftTitle="twoImg.leftTitle"
      :leftImg="twoImg.leftImg"
      :rightTitle="twoImg.rightTitle"
      :rightImg="twoImg.rightImg"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { peoplePassList } from "@/api/screenApi.ts";
import { Getter } from "vuex-class";
const BigImg = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
@Component({
  components: {
    BigImg,
    TwoImg,
  },
  filters: {
    passMethod(val: string) {
      const data = {
        "1": "人脸开门",
        "2": "二维码开门",
        "3": "蓝牙开门",
        "4": "远程开门",
        "5": "密码开门",
        "6": "刷卡开门"
      };
      return data[val];
    }
  }
})
export default class openDoor extends Vue {
  @Getter("permissionList") permissionList: Array<string>;
  timer: any = null;
  tableData: Array<object> = [];
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: ""
  };

  created() {
    this.fetchList();
    this.timer = setInterval(() => {
      this.fetchList();
    }, 30000);
  }
  beforeDestroy() {
    clearInterval(this.timer);
  }
  mounted() {}
  showImg(scope) {
    this.twoImg.visible = true;
      this.twoImg.leftImg = scope.row.photos;
      this.twoImg.leftTitle = "抓拍人脸";
      this.twoImg.rightImg = scope.row.facePhone;
      this.twoImg.rightTitle = "注册人脸";
  }
  fetchList() {
    peoplePassList().then(res => {
      this.tableData = res.data.data;
      this.tableData.map(item => {
        if (
          new Date().toDateString() ===
          new Date(item["passTime"]).toDateString()
        ) {
          item["passTime"] = item["passTime"].split(" ")[1];
        }
      });
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$size: 24px;
$wa: #ffa726;
$la: #26c6da;
$lv: #66bb6a;
$block: inline-block;
ul {
  overflow: hidden;
  border-bottom: 1px solid lightgray;
}
ul li {
  float: left;
  list-style: none;
  width: 20%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:first-child {
    width: 10%;
  }
  &:nth-child(2),
  &:nth-last-child(2) {
    width: 10%;
  }
  &:last-child {
    width: 30%;
  }
}
.pass {
  border: solid 1px #e6e6e6;
  background: #fff;
}
.visitor {
  margin-top: 16px;
}
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
}
.iconfont {
  color: #409eff;
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.table-margin {
  margin: 0 10px;
}
.face-img {
  width: 30px;
  height: 30px;
}
.button-list {
  margin: 6px;
  float: right;
}
</style>
