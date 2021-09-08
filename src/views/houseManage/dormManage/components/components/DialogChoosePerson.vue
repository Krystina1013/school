<template>
  <div>
    <el-dialog class="newDialog noPadding" :close-on-click-modal="false" title="楼栋管理员" :visible="true" width="904px" :before-close="handleClose">
      <div class="mainContentWrapper">
        <div class="leftWrapper">
          <el-tree :expand-on-click-node="false" node-key="name" :current-node-key="currentNodeKey" :default-expanded-keys="defaultExpandedKeys" highlight-current :data="treeData" :props="{ children: 'subWorkerGroups', label: 'name' }" @node-click="
              currentNode = $event;
              gotoTheFirstPage();
            "></el-tree>
        </div>
        <div class="rightWrapper">
          <div class="searchWrapper">
            <span class="field">
              <span class="label">姓名：</span>
              <el-input style="width:280px" size="small" v-model="searchField.name"></el-input>
            </span>
            <el-button type="primary" size="small" @click="gotoTheFirstPage">搜索</el-button>
          </div>

          <div class="resultWrapper">
            <el-table ref="table" :data="tableData" border stripe height="420">
              <el-table-column type="index" width="72" label="序号" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="姓名" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="phone" label="联系电话" align="center"></el-table-column>
              <el-table-column label="操作" align="center" width="155">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.selected" type="primary" plain size="mini" @click="cancelRoom(scope.row)">取消</el-button>
                  <el-button v-else type="primary" size="mini" @click="addRoom(scope.row)">选择</el-button>
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
        <el-button type="primary" @click="confirm">确 定</el-button>
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

import { getWorkGroup } from "@/api/houseApi.ts";
import { getWorkerById } from "@/api/peopleApi.ts";
@Component({
  components: {},
})
export default class DialogChoosePerson extends Vue {
  @Prop({ default: false }) multiple: any;
  height_w = window.innerHeight;
  width_w = window.innerWidth;
  searchField = {
    name: "",
  };
  tableData: any = [];
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

  @Watch("dialog.visible")
  showDialog() {
    // if (this.dialog.visible) {
    // this.gotoTheFirstPage();
    // this.getOfficeBuilding();
    // }
  }

  created() {
    this.selectedRoom = JSON.parse(
      JSON.stringify(this.$parent["dialogChoosePerson"].selectedRoom)
    );
    console.log("sdsfd", this.selectedRoom);
    this.getOfficeBuilding();
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

  cancelRoom(row) {
    let index = this.selectedRoom.findIndex((item: any) => item.id == row.id);
    this.selectedRoom.splice(index, 1);
    let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
    this.tableData[index1]["selected"] = false;
  }

  confirm() {
    this.$emit("selectRoom", this.selectedRoom);
    this.$parent["dialogChoosePerson"].visible = false;
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
      groupId: this.currentNode.id || "",
      ...this.searchField,
    };
    let { data } = await getWorkerById(param);
    data = data.data;
    this.pagination.total = parseInt(data.total);

    data.records.map((item: any, i) => {
      data.records[i].type = 1;
      data.records[i].enableInviteVisitor = 1;
      data.records[i].enableRemoteOpen = 1;
      data.records[i].overTime = "";
      console.log("111", this["selectedRoom"]);
      let obj = this["selectedRoom"].find((item1: any) => item1.id == item.id);
      if (obj) {
        data.records[i].selected = true;
      } else {
        data.records[i].selected = false;
      }
    });
    this.tableData = data.records;
  }

  async getOfficeBuilding() {
    let { data } = await getWorkGroup();
    this.treeData = [
      {
        name: "所有",
        id: "",
        subWorkerGroups: data.data,
      },
    ];
  }

  handleClose() {
    this.$parent["dialogChoosePerson"].visible = false;
  }
}
</script>

<style lang="scss">
.noPadding {
  .el-dialog__body {
    padding: 0;
  }
}
.searchWrapper {
  .el-button--small {
    width: 68px;
    height: 34px;
  }
}
.resultWrapper {
  .el-button--mini {
    width: 68px;
    height: 24px;
  }
}
</style>

<style lang="scss" scoped>
.mainContentWrapper {
  display: flex;
  padding: 20px;
  padding-bottom: 24px;
  .leftWrapper {
    overflow: auto;
    width: 222px;
    height: 524px;
  }
  .rightWrapper {
    flex: 1;
    height: 524px;
    width: 681px;
    padding: 12px;
    .searchWrapper {
      display: flex;
      margin-left: 4px;
      margin-bottom: 14px;
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
