<template>
  <div>
    <el-dialog
      class="statistics-dialog"
      :close-on-click-modal="false"
      title="选择房屋"
      :visible="true"
      width="1000px"
      :before-close="handleClose"
    >
      <div class="mainContentWrapper">
        <div class="leftWrapper">
          <el-tree
            :expand-on-click-node="false"
            node-key="name"
            :current-node-key="currentNodeKey"
            :default-expanded-keys="defaultExpandedKeys"
            highlight-current
            :data="treeData"
            :props="{ children: 'subBuildings', label: 'name' }"
            @node-click="
              currentNode = $event;
              gotoTheFirstPage();
            "
          ></el-tree>
        </div>
        <div class="rightWrapper">
          <div class="searchWrapper">
            <span class="fieldWrapper" style="display:flex">
              <span class="field">
                <span class="label">门牌号：</span>
                <el-input style="width:200px" size="small" v-model="searchField.serialNumber"></el-input>
              </span>
            </span>
            <span class="buttonWrapper">
              <el-button type="primary" size="small" @click="gotoTheFirstPage">查询</el-button>
              <!-- <el-button
                type="primary"
                size="small"
                style="margin-left:10px"
                @click="
                  $util.resetObj(searchField);
                  gotoTheFirstPage();
                "
              >重置</el-button> -->
            </span>
          </div>
          <div class="resultWrapper">
            <!-- <div style="margin-bottom:10px">
              已选择：
              <span
                class="selectedRoom blueCircleBtn"
                :key="index"
                v-for="(item, index) in selectedRoom"
              >
                {{ item.houseName }}
                <i
                  class="el-icon-close"
                  @click="cancelRoom(item)"
                ></i>
              </span>
            </div> -->
            <el-table ref="table" :height="350" :data="tableData" style="width:99%">
              <!-- <el-table-column type="selection" width="60"></el-table-column> -->
              <el-table-column type="index" width="60" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="groupName" label="所属楼栋"></el-table-column>
              <el-table-column show-overflow-tooltip prop="buildingName" label="所属单元"></el-table-column>
              <el-table-column show-overflow-tooltip prop="serialNumber" label="门牌号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="personCnt" label="已入住人数"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.selected"
                    type="danger"
                    size="mini"
                    @click="cancelRoom(scope.row)"
                  >取消</el-button>
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

            <el-pagination
              style="margin-top:15px;margin-left:15px"
              @size-change="
                pagination.pageSize = $event;
                gotoTheFirstPage();
              "
              @current-change="
                pagination.page = $event;
                getTableData();
              "
              :page-sizes="$constant.pagination.pageSizes"
              :page-size="pagination.pageSize"
              layout="prev, pager, next, jumper, total, sizes"
              :total="pagination.total"
            ></el-pagination>
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
  Watch
} from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";

import { getZoom, getHouseTreeData } from "@/api/houseApi.ts";

@Component({
  components: {
  }
})
export default class DialogChooseRoom extends Vue {
  @Prop({ default: false }) multiple:any;
  height_w = window.innerHeight;
  width_w = window.innerWidth;
  searchField = {
    serialNumber: "",
  };
  tableData: any = [];
  pagination = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0]
  };
  currentNodeKey = "所有";
  defaultExpandedKeys = ["所有"];
  treeData: any = [
    {
      name: "所有",
      id: "",
      subBuildings: []
    }
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
      JSON.stringify(this.$parent["dialogChooseRoom"].selectedRoom)
    );
    console.log('sdsfd',this.selectedRoom)
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
    this.$parent["dialogChooseRoom"].visible = false;
  }

  addRoom(row) {
    row.selected = true;
    let obj = { ...row };
    if(this.multiple){
      this.selectedRoom.push(obj);
    }else{
      this.selectedRoom[0]=obj;
      this.confirm()
    }
    
  }
  gotoTheFirstPage() {
    this.tableData=[];
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
      groupId: this.currentNode.type=='group' ? this.currentNode.id : "",
      buildingId: this.currentNode.type=="building" ? this.currentNode.id : "",
      ...this.searchField,
    };
    let { data } = await getZoom(param);
    data = data.data;
    this.pagination.total = parseInt(data.total);

    data.records.map((item: any, i) => {
      data.records[i].type = 1;
      data.records[i].enableInviteVisitor = 1;
      data.records[i].enableRemoteOpen = 1;
      data.records[i].overTime = "";
      let obj = this.selectedRoom.find((item1: any) => item1.id == item.id);
      if (obj) {
        data.records[i].selected = true;
      } else {
        data.records[i].selected = false;
      }
    });
    this.tableData = data.records;
  }

  async getOfficeBuilding() {
    let { data } = await getHouseTreeData();
    this.treeData = [
      {
        name: "所有",
        id: "",
        subBuildings: data.data
      }
    ];
  }

  handleClose() {
    this.$parent["dialogChooseRoom"].visible = false;
  }
}
</script>

<style lang="scss" scoped>
.mainContentWrapper {
  display: flex;
  .leftWrapper {
    width: 220px;
    margin-right: 30px;
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
