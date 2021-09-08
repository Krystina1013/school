<template>
  <div class="app-container">
    <div class="rightContent">
      <el-row>
        <el-col :span="24">
          <ActionHeader ref="actionHeader" :btnStatus="0" :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :total="page.total" :moreStatus="false" @clearInput="clearInput">
            <div slot="houseNum">
              <div class="word-filter">
                <span class="filter-name">姓名:</span>
                <el-input class="input-filter" size="small" maxlength="20" v-model.trim="filterForm.name" placeholder="请输入姓名" clearable @keyup.enter.native="emitFetchData"></el-input>
              </div>
            </div>
          </ActionHeader>
        </el-col>
      </el-row>

      <el-table v-loading="showLoading" :data="list_data" stripe border highlight-current-row @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange" @selection-change="handleSelectionChange">
        <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
            <div v-if="globalUpdateStatus" class="fun-btn">
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name" align="center" label="姓名" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-button type="text" v-if="row.name" @click="showDetail(row)">
              {{row.name}}</el-button>
            <span v-else>{{"--"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="face" align="center" label="人脸图像">
          <template slot-scope="scope">
            <img v-if="scope.row.faceImg" class="capture-img cursor" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.faceImg)" :src="scope.row.faceImg" alt />
          </template>
        </el-table-column>
        <el-table-column prop="idNo" align="center" min-width="100" label="身份证号码" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span>
              {{row.idNo || '--'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" align="center" label="联系电话" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span>
              {{row.phone || '--'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="interviewee" align="center" label="被访人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="visitreason" align="center" label="来访目的" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" min-width="100" align="center" label="登记时间" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination @current-change="pageChange" style="margin-top:10px;" background layout="prev, pager, next,total" :page-size="page.limit" :total="page.total"></el-pagination>
    </div>

    <!-- 访客人员详情 -->
    <detailDialog :visible="detailDialogVisible" :form="visitorDialogForm" @close="handleClose"></detailDialog>
    <!-- <el-dialog class="newDialog" width="600px" title="访客人员详情" :visible.sync="detailDialogVisible" :before-close="handleClose">
      <el-row :gutter="0" class="flex">
        <el-col :span="8">
          <div class="commonRow">
            <div class="value detail-con-img"> <img v-if="visitorDialogForm.faceImg" :src="visitorDialogForm.faceImg" class="avatar avatar-single" />
              <img v-else src="../../../assets/capture.png" class="avatar avatar-single" />
            </div>
          </div>
        </el-col>
        <el-col :span="16" style="margin-left:16px;margin-bottom:15px">
          <div class="commonRow studentCom" style="margin-top:10px">
            <div class="label">访客姓名：</div>
            <div class="value" :title="visitorDialogForm.name">{{ visitorDialogForm.name }}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">&nbsp;手&nbsp;机&nbsp;号：</div>
            <div class="value" :title="visitorDialogForm.phone">{{ visitorDialogForm.phone}}</div>
          </div>
          <div class="commonRow studentCom">
            <div class="label">身份证号：</div>
            <div class="value" :title="visitorDialogForm.idNo">{{ visitorDialogForm.idNo }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="commonRow studentCom">
            <div class="label">&nbsp;被&nbsp;访&nbsp;人：</div>
            <div class="value" :title="visitorDialogForm.interviewee">{{ visitorDialogForm.interviewee }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow studentCom">
            <div class="label">登记时间：</div>
            <div class="value" :title="visitorDialogForm.createTime">{{ visitorDialogForm.createTime }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <div class="commonRow studentCom">
            <div class="label">来访目的：</div>
            <div class="value" :title="visitorDialogForm.visitreason">{{ visitorDialogForm.visitreason }}</div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="commonRow studentCom" style="height: auto;">
            <div class="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</div>
            <div class="value note-value" :title="visitorDialogForm.remarks">{{ visitorDialogForm.remarks }}</div>
          </div>
        </el-col>
      </el-row>
    </el-dialog> -->

    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
const BigImg = () => import("@/components/BigImg/index.vue");
import mixin from "@/config/minxins";
import { getOwnerUser } from "@/api/carApi.ts"; //获取目标访客受访人信息
import { getTargrtRecord } from "@/api/peopleApi.ts"; //获取目标车辆通行记录
import { getRegisterHouse } from "@/api/houseApi.ts"; //获取受房人信息的房屋信息
import config from "@/api/config";
const ActionHeader = () => import("@/components/ActionHeader.vue");
import detailDialog from "./components/detailDialog.vue";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    BigImg,
    detailDialog,
  },
  filters: {
    devTypes(val: string) {
      const data = {
        "1": "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
      };
      return data[val] + "设备";
    },
  },
})
export default class VistoryManage extends Vue {
  filterForm: object = {
    name: "", //来访者姓名
  }; //根据关键字查询
  initForm: object = {
    //获取访客名单列表url
    url: config.v3 + "/admin/visitor/page",
    method: "get",
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-visitor/batch-delete/",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的访客,删除后访客将不能通行,请谨慎操作!`,
  };

  private listQuery: Object = {
    // 访客目标通行记录翻页
    total: 0,
    limit: 10,
    page: 1,
  };

  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  private commandType: string = "all"; //根据访客类型筛选 all默认为显示全部
  private commandStatus: String = "0"; //根据访客状态  0 默认显示为全部
  private pitchOn: string = "y"; //选中A
  private unchecked: string = "n"; //未选中
  private interUserDetail: Object = {}; //受访人的身份详细信息
  private houseInviterDetail: Object = {}; //受访人的房屋信息
  private passTarget: Boolean = true; //目标访客通行记录的loadding
  private passList: Array<Object> = []; // 访客目标通行记录

  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private visitorDialogForm: Object = {}; // 访客详情
  private activeName: string = "second"; //目标访客详细信息 tab Title
  private selectType: Array<Object> = [
    {
      command: "1",
      lable: "待访问",
    },
    {
      command: "2",
      lable: "已访问",
    },
    {
      command: "3",
      lable: "过期",
    },
  ];
  invateList: Array<object> = [];
  visitType: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null,
    },
    {
      label: "App",
      value: "1",
    },
    {
      label: "访客机",
      value: "2",
    },
  ];

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间

  passMethod(val) {
    /**@description 过滤通行方式 */
    switch (val) {
      case "1":
        return "人脸开门";
      case "2":
        return "二维码开门";
      case "3":
        return "蓝牙开门";
      case "4":
        return "远程开门";
      case "5":
        return "密码开门";
      case "6":
        return "刷卡开门";
      case "7":
        return "WIFI开门";
    }
  }
  pickerOptions: Object = {};
  dateRange: Array<Object> = [];
  createDateRange: Array<Object> = [];
  mounted() {
    const _this = this;
    this.pickerOptions = {
      // 处理可选的时间范围
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
    };
  }
  dateRangeChange() {
    if (this.dateRange) {
      this.filterForm["validDateStart"] = this.dateRange[0];
      this.filterForm["validDateEnd"] = this.dateRange[1];
    } else {
      this.filterForm["validDateStart"] = null;
      this.filterForm["validDateEnd"] = null;
    }
    if (this.createDateRange) {
      this.filterForm["inviteTimeStart"] = this.createDateRange[0];
      this.filterForm["inviteTimeEnd"] = this.createDateRange[1];
    } else {
      this.filterForm["inviteTimeStart"] = null;
      this.filterForm["inviteTimeEnd"] = null;
    }
    console.log(this.filterForm);
  }

  handleSelectionChange(val) {
    /**@description  获取需要操作的数据列表 */
    this.deleteForm["data"] = [];
    val.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  statusFilter(status) {
    /** @description 状态显示过滤 */
    switch (status) {
      case "1":
        return "待访问";
      case "2":
        return "已访问";
      case "3":
        return "过期";
    }
  }

  typeFilter(type) {
    /**@descripution 过滤邀请人类型*/
    switch (type) {
      case "1":
        return "业主";
        break;
      case "2":
        return "租户";
        break;
      case "3":
        return "家庭成员";
        break;
    }
  }

  refreshInfo() {
    /**@description 刷新数据 */
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    );
    this["fetchData"](this.initForm);
  }

  /**
   * row 列表数据
   */
  showDetail(row, inviter) {
    this.detailDialogVisible = true;
    this.visitorDialogForm = Object.assign({}, row);
    this.fetchUser();
    this.activeName = "second";
    // if (inviter) {
    //   this.activeName = inviter;
    //   this.fetchUser();
    // }
  }

  async handleClick(tab) {
    /**@description 查看车辆管理名单目标详情 */
    if (tab.name === "second") {
      this.fetchUser();
    } else if (tab.name === "thirdly") {
      this.listQuery["page"] = 1;
      // this.fetchPass();
    }
  }

  async fetchUser() {
    /**@description 查看受访人员详情 */
    const info = {
      id: this.visitorDialogForm["id"],
    };
    try {
      const { data } = await getOwnerUser(info);
      this.invateList = data.data;
      // if (data.data.house) {
      //   this.houseInviterDetail = data.data.house[0];
      // }
      // console.log(this.houseInviterDetail, 789456);
    } catch (err) {
      console.log(err.response);
    }

    // try {
    //   const { data } = await getRegisterHouse({
    //     houseId: this.visitorDialogForm["houseId"]
    //   });
    //   console.log(data, 789789);
    //   this.houseInviterDetail = data.data;
    // } catch (err) {
    //   console.log(err);
    // }
  }

  async fetchPass() {
    /**@description 查看访客通行通行记录 */
    this.passTarget = true;
    const info = { ...this.listQuery, id: this.visitorDialogForm["id"] };
    const { data } = await getTargrtRecord(info);
    this.passList = data.data.records;
    this.listQuery["total"] = data.data.total;
    this.passTarget = false;
  }

  handleCurrentChange(val) {
    /** @description 处理目标访客通行记录录翻页事件
     * @augments val: 页数
     */
    this.listQuery["page"] = val;
    this.fetchPass();
  }

  handleClose() {
    /** @description 关闭添加/修改diolog */
    this.detailDialogVisible = false; //车辆详情dialog
    this.activeName = "first";
    this.interUserDetail = {};
    this.houseInviterDetail = {};
  }
  clearInput() {
    this.dateRange = [];
    this.createDateRange = [];
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
    box-shadow: 0px 6px 5px 0px lightgray;
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

.el-dropdown-link {
  color: #20a0ff;
}
.y {
  color: #20a0ff;
  background: #ecf5ff;
}
.n {
  color: black;
  background: #fff;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.cursor {
  cursor: pointer;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.avatar-single {
  width: 150px;
  height: 150px;
  line-height: 150px;
}

.commonRow {
  overflow: hidden;
  display: flex;
  // margin-bottom: 30px;
  .label {
    width: 80px;
    text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
  }
  .note-value {
    padding: 12px 0;
    line-height: 24px;
  }
}
.mg-50 {
  margin-top: 50px;
}
.ml-50 {
  margin-left: 50px;
}
.detail-con-img {
  width: 180px;
  height: 180px;
  border: 1px solid #d8d8d8;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
