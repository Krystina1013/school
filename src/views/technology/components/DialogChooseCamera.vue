<template>
  <div>
    <common-dialog
      :visible="visible"
      :width="`${(1200 / width_w) * 100}%`"
      @close="handleClose"
      @submit="handleSubmit"
      :showCancel="true"
      :showSubmit="true"
      title="选择摄像机"
    >
      <template slot="dialogContent">
        <div class="flex justify-content-between align-items-center">
          <div class="search">
            <el-input
              style="width: 200px"
              v-model.trim="searchField.name"
              placeholder="请输入名称"
              class="el-input"
              maxlength="32"
            ></el-input>
            <el-button
              size="mini "
              type="primary"
              style="height: 40px; margin-left: 10px"
              @click="getCameraList"
              :disabled="currentGroup == ''"
              >搜索</el-button
            >
          </div>
        </div>
        <div class="flex">
          <div class="left-tree">
            <el-tree
              :default-expanded-keys="[1]"
              node-key="id"
              highlight-current
              :data="treeData"
              :props="{
                children: 'cameraGroupTreeVoList',
                label: 'name',
                isLeaf: 'leaf',
              }"
              @node-click="singleNodeClick"
            >
              <div class="custom-tree-node" slot-scope="{ node }">
                <div>
                  <span>{{ node.label }}</span>
                </div>
              </div>
            </el-tree>
          </div>
          <div
            class="flex-1"
            :class="{ 'disable-checkbox': cameraList.length == 0 }"
          >
            <el-table
              :data="cameraList"
              tooltip-effect="dark"
              :style="`width: 100%; height:500px`"
              :height="500"
              @current-change="handleSelectionChange"
              ref="singleTable"
              highlight-current-row
            >
              <el-table-column
                type="index"
                width="60"
                label="序号"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="所属分组" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.group">-</span>
                  <span v-else>{{ scope.row.cameraGroupName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createUser"
                label="创建人"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 15px; margin-left: 15px"
              @size-change="changeSize"
              @current-change="handleCurrentChange"
              :page-sizes="$constant.pagination.pageSizes"
              :page-size="pagination.pageSize"
              layout="prev, pager, next, jumper, total, sizes"
              :total="pagination.total"
            ></el-pagination>
          </div>
        </div>
      </template>
    </common-dialog>
  </div>
</template>

<script>
import CommonDialog from './CommonDialog.vue'
export default {
  props: ["visible", "showSearch", "groupId", "camera"], //camera 修改回显的摄像机列表
   components: { CommonDialog},
  data() {
    return {
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      cameraList: [],
      pagination: {
        show: false,
        total: 0,
        page: 1,
        pageSize: this.$constant.pagination.pageSizes[1],
      },
      searchField: {
        name: "",
      },
      rowline: {},
      currentGroup: "",
      treeData: [],
      chooseLine:{}
    };
  },
  watch: {
    visible() {
      if(this.visible){
        this.getTreeData();
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("close")
    },
    handleSubmit() {
      this.$emit("change",this.chooseLine)
    },
    async getTreeData(node, resolve) {
      this.cameraList = [];
      let { code, message, data } = await this.$http.get(
        this.$url.camera.csia_cameraGroup(""),
        {
          groupId: this.groupId,
        }
      );
      if (code != 200) {
        if (message) {
          this.$message.error(message);
        }
        return;
      }
      this.treeData = [
        {
          name: "全部",
          id: 1,
          cameraGroupTreeVoList: data,
        },
      ];
      this.rowline.id = 1;
      this.getCameraList("reset");
    },
    async singleNodeClick(item) {
      this.pagination.page = 1;
      this.changePage = false;
      //点击树节点
      this.rowline = item;
      this.currentGroup = item.id;
      let isSave = false;
      if (isSave) {
        return;
      }
      // this.saveChoose();
      this.getCameraList();
    },
    async getCameraList(type) {
      let param = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        userGroupId: this.groupId,
        cameraGroupId: this.rowline.id == 1 ? "" : this.rowline.id,
        name: this.searchField.name,
      };
      let { code, message, data } = await this.$http.get(
        this.$url.camera.csia_camera_pageQuery,
        param
      );
      if (code != 200) {
        if (message) {
          this.$message.error(message);
        }
        return;
      }
      this.cameraList = data.records;
      this.pagination.total = data.total;
      this.$nextTick(()=>{
        let obj;
        this.cameraList.map(item=>{
          if(item.id==this.camera.id){
            obj = item
          }
        })
        this.$refs.singleTable.setCurrentRow(obj);
      })
      // --------------------------
      if (type == "reset") {
        this.currentGroup = 1;
      }
    },
    handleSelectionChange(val) {
      this.chooseLine=val;
    },
    changeSize(size) {
      this.pagination.page = 1;
      this.pagination.pageSize = size;
      this.changePage = true;
      this.getCameraList();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.changePage = true;
      this.getCameraList();
    },
  },
};
</script>

<style lang='scss' scoped>
.left-tree {
  margin-right: 10px;
  overflow-y: scroll;
  width: 200px;
  display: flex;
  flex-direction: column;
}
.flex {
  width: 100%;
  display: flex;
}
.count {
  padding-right: 20px;
}
.search {
  margin-bottom: 10px;
}
::v-deep {
  .disable-checkbox {
    .el-checkbox:last-of-type {
      display: none;
    }
  }
  .el-tree {
    flex: 1;
  }
  .el-pagination {
    .el-pagination__total {
      color: #fff;
      margin-left: 20px;
      margin-right: 20px;
    }
    .el-pagination__jump {
      color: #fff;
    }
    input,
    button,
    li {
      background-color: #273855 !important;
      color: #fff !important;
    }
    .active {
      color: #4e94cf;
      cursor: default;
    }
  }
  .el-table {
    background: #273855;
    color: #fff;
    font-size: 12px;
    border: 1px solid #273855;
    th {
      background: #202b3d;
      color: #fff;
      padding: 5px;
      border-bottom: 1px #273855 solid;
      text-align: center;
    }
    td {
      border-bottom: 1px #273855 solid;
      padding: 5px;
      text-align: center;
    }
    &::before {
      background: transparent;
    }
    .current-row {
      background-color: #3c72c9 !important;
      td {
        background-color: #3c72c9 !important;
      }
    }
  }
  .el-pagination__editor {
    width: auto !important;
  }
}
</style>