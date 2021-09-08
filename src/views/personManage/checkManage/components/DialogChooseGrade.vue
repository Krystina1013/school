<template>
  <div>
    <el-dialog class="statistics-dialog" :close-on-click-modal="false" title="关联班级" :visible="true" width="1000px" :before-close="handleClose">
      <div class="mainContentWrapper">
        <div class="leftWrapper">
          <el-tree :expand-on-click-node="false" node-key="name" :current-node-key="currentNodeKey" :default-expanded-keys="defaultExpandedKeys" highlight-current :data="treeData" :props="{ children: 'subBuildings', label: 'name' }" @node-click="
              currentNode = $event;
              gotoTheFirstPage();
            "></el-tree>
        </div>
        <div class="rightWrapper">
          <div class="resultWrapper">
            <div style="margin-bottom:10px">
              已选择：
              <span class="selectedRoom blueCircleBtn" :key="index" v-for="(item, index) in selectedRoom">
                {{ item.houseName }}
                <i class="el-icon-close" @click="cancelRoom(item)"></i>
              </span>
            </div>
            <el-table ref="table" :height="350" :data="tableData" style="width:99%">
              <el-table-column type="index" width="60" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="className" width="460" label="班级"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button :type="scope.row.bzrSelected?'primary':'normal'" size="mini" @click="clickBzr(scope.row)">班主任</el-button>
                  <el-button :type="scope.row.rkSelected?'primary':'normal'" size="mini" @click="clickRk(scope.row)">任课老师</el-button>
                </template>
              </el-table-column>

              <template slot="empty">
                <div class="flex-row align-items-center justify-content-center empty-text">
                  <i class="iconfont icon-tishi"></i>
                  <span style="margin-left:5px">
                    {{
                    $constant.msg.hasNoData
                    }}
                  </span>
                </div>
              </template>
            </el-table>

            <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                pagination.pageSize = $event;
                gotoTheFirstPage();
              " @current-change="
                pagination.page = $event;
                getTableData();
              " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination.pageSize" layout="prev, pager, next, jumper, total, sizes" :total="pagination.total"></el-pagination>
          </div>
        </div>
      </div>

      <span slot="footer" v-if="multiple">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :disabled='this.selectedRoom.length === 0' @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Mixins,
  Emit,
  Watch,
} from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";

import { getClassByGrade, getClassTree } from "@/api/houseApi";
@Component({
  components: {},
})
export default class DialogChooseGrade extends Vue {
  @Prop({ default: false }) multiple: any;
  height_w = window.innerHeight;
  width_w = window.innerWidth;
  searchField = {
    name: "",
  };
  btnDisabled: boolean = true;
  tableData: any = [];
  selectType: any = null;
  pagination = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0],
  };
  currentNodeKey = "所有";
  defaultExpandedKeys = ["所有"];
  treeData: any = [
    {
      name: "所有",
      id: "",
      subBuildings: [],
    },
  ];
  currentNode: any = "";
  selectedRoom: any = [];
  checkSelectedRoom: any = [];
  delSelectedRoom: any = [];

  @Watch("dialog.visible")
  showDialog() {
    // if (this.dialog.visible) {
    // this.gotoTheFirstPage();
    // this.getClassBuilding();
    // }
  }
  clickBzr(row) {
    if (row.bzrSelected) {
      let index = this.selectedRoom.findIndex((item: any) => item.id == row.id);
      this.selectedRoom.splice(index, 1);
      let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
      this.tableData[index1]["bzrSelected"] = false;
      this.tableData[index1].type = null;

      this.checkClick(row.id);
    } else {
      row.bzrSelected = true;
      row.type = 1;
      let obj = { ...row };
      // 任课老师与班主任只能选其一  需要查询存不存在 如果存在就删除之前的 存入最新的
      this.selectedRoom.forEach((v: any, index) => {
        if (obj.id == v.id) {
          row.rkSelected = false;
          this.selectedRoom.splice(index, 1);
        }
      });
      let teachName = "班主任";
      obj.houseName = obj.className + " - " + teachName;
      if (this.multiple) {
        this.selectedRoom.push(obj);
      }
    }
  }
  clickRk(row) {
    if (row.rkSelected) {
      let index = this.selectedRoom.findIndex((item: any) => item.id == row.id);
      this.selectedRoom.splice(index, 1);
      let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
      this.tableData[index1]["rkSelected"] = false;
      this.tableData[index1].type = null;

      this.checkClick(row.id);
    } else {
      row.rkSelected = true;
      row.type = 0;
      let obj = { ...row };
      // 任课老师与班主任只能选其一  需要查询存不存在 如果存在就删除之前的 存入最新的
      this.selectedRoom.forEach((v: any, index) => {
        if (obj.id == v.id) {
          row.bzrSelected = false;
          this.selectedRoom.splice(index, 1);
        }
      });
      let teachName = "任课老师";
      obj.houseName = obj.className + " - " + teachName;
      if (this.multiple) {
        this.selectedRoom.push(obj);
      }
    }
  }
  cancelRoom(row) {
    let index = this.selectedRoom.findIndex((item: any) => item.id == row.id);
    this.selectedRoom.splice(index, 1);
    this.checkClick(row.id);
    let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
    if (index1 === -1) {
      return;
    }
    if (this.tableData[index1]["rkSelected"]) {
      this.tableData[index1]["rkSelected"] = false;
    }
    if (this.tableData[index1]["bzrSelected"]) {
      this.tableData[index1]["bzrSelected"] = false;
    }
    this.tableData[index1]["selected"] = false;
  }
  checkClick(id) {
    this.checkSelectedRoom.forEach((item: any) => {
      if (id == item.id) {
        this.delSelectedRoom.push(item.id);
      }
    });

    console.log(this.delSelectedRoom);
  }
  created() {
    this.selectedRoom = JSON.parse(
      JSON.stringify(this.$parent["dialogChooseGrade"].selectedRoom)
    );
    this.checkSelectedRoom = JSON.parse(
      JSON.stringify(this.$parent["dialogChooseGrade"].selectedRoom)
    );

    this.getClassBuilding();
    this.gotoTheFirstPage();
  }

  mounted() {
    window.addEventListener("resize", this.windowResize);
  }
  destroyed() {
    window.removeEventListener("resize", this.windowResize);
  }
  windowResize() {
    this.height_w = window.innerHeight;
  }

  Room(row) {
    let index = this.selectedRoom.findIndex((item: any) => item.id == row.id);
    this.selectedRoom.splice(index, 1);
    let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
    this.tableData[index1]["selected"] = false;
  }

  confirm() {
    this.$emit("selectRoom", this.selectedRoom);
    this.$emit("delSelectRoom", this.delSelectedRoom);
    this.$parent["dialogChooseGrade"].visible = false;
  }

  addRoom(row) {
    row.selected = true;
    let obj = { ...row };
    if (this.multiple) {
      this.selectedRoom.push(obj);
    } else {
      this.selectedRoom[0] = obj;
      this.confirm();
    }
  }
  gotoTheFirstPage() {
    this.tableData = [];
    this.pagination.page = 1;
    //重新载入翻页组件，回到第一页
    this.pagination.show = false;
    this.$nextTick(() => {
      this.pagination.show = true;
    });
    this.getTableData();
  }
  async getTableData() {
    let param = {
      limit: this.pagination.pageSize,
      page: this.pagination.page,
      grade: this.currentNode.id || "",
      ...this.searchField,
    };
    let { data } = await getClassByGrade(param);
    data = data.data;
    this.pagination.total = parseInt(data.total);

    data.records.map((item: any, i) => {
      data.records[i].type = null;
      data.records[i].bzrSelected = false;
      data.records[i].rkSelected = false;
      data.records[i].enableInviteVisitor = 1;
      data.records[i].enableRemoteOpen = 1;
      data.records[i].overTime = "";

      let obj = this["selectedRoom"].find((item1: any) => item1.id == item.id);
      if (obj) {
        data.records[i].type = obj.type;
        if (data.records[i].type == 1) {
          data.records[i].bzrSelected = true;
          data.records[i].rkSelected = false;
        } else if (data.records[i].type == 0) {
          data.records[i].rkSelected = true;
          data.records[i].bzrSelected = false;
        }
        data.records[i].selected = true;
      } else {
        data.records[i].selected = false;
      }
    });
    this.tableData = data.records;
    console.log(this.delSelectedRoom);
  }
  initGrade(dataArr) {
    let arr: any = [];
    if (dataArr && dataArr.length > 0) {
      dataArr.forEach((item) => {
        arr.push({
          id: item,
          name: item,
        });
      });
    }
    return arr;
  }
  async getClassBuilding() {
    let { data } = await getClassTree();
    let treeData: any = [];
    if (data.data) {
      for (let item in data.data) {
        let dataArr = this.initGrade(data.data[item]);
        console.log(dataArr);
        treeData.push({
          name: item,
          id: item,
          subBuildings: dataArr,
        });
      }
    }
    this.treeData = [
      {
        name: "所有",
        id: "",
        subBuildings: treeData,
      },
    ];
  }

  handleClose() {
    this.$parent["dialogChooseGrade"].visible = false;
  }
}
</script>

<style lang="scss" scoped>
.mainContentWrapper {
  display: flex;
  .leftWrapper {
    width: 220px;
    margin-right: 30px;

    .el-tree {
      height: 447px;
      overflow-y: auto;
    }
  }
  .rightWrapper {
    flex: 1;
    .searchWrapper {
      display: flex;
      margin-bottom: 20px;
      .field {
        margin-right: 20px;
        display: flex;
        align-items: center;
        .label {
          white-space: nowrap;
        }
      }
    }
    .selectedRoom {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      .el-icon-close {
        position: absolute;
        top: -8px;
        right: -8px;
        color: #f56c6c;
        cursor: pointer;
        font-size: 16px;
      }
    }
  }
}
::v-deep {
  .el-pagination__total {
    margin-left: 20px;
  }
}
.blueCircleBtn {
  color: #589ff8;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #dcecfd;
  background: #eef5fe;
  outline: none;
}
</style>
