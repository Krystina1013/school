<template>
  <div>
    <el-dialog title="选择摄像机" stripe :visible="visible" width="1000px" :before-close="handleClose">
    
    <div class="mains-con">
      <div class="left-con">
           <div class="search-con">
        <el-form ref="form" :model="filterForm" :inline="true" @submit.native.prevent>
          <el-form-item >
            <el-input maxlength="30" v-model.trim="filterForm.name" size="small"  placeholder="请输入摄像机名称" clearable class="input_search"></el-input>
          </el-form-item>
          <el-form-item style="float:right;margin-right:10px">
            <el-button type="primary" size="mini" @click="getCameraList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
         <el-tree :default-expand-all="true" :data='TreeData' :props="dataFormate" node-key="id" current-node-key=''  :highlight-current='true' @node-click="nodeClick"></el-tree>
      </div>
      <div class="right-con"> 
        <div class="top-con">
          <div class="selects">
            <div v-for="(item,i) in selectedCamera" class="one-select" :key="i">
              <span class="name">{{item.name}}</span>
              <i class="el-icon-close icon" @click="cancelRoom(item)"></i>
            </div>
            <div class="clear-btn" @click.stop="clearCameraAll" v-if="selectedCamera.length>0">清空</div>
          </div>
        <el-table ref="singleTable" v-loading='tabLoad' :data="tableData" @select="rowSelect"  @selection-change="handleSelectionChange" stripe border highlight-current-row  style="width: 100%" height="510px">
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column type="index" width="50" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称" show-overflow-tooltip align="center"></el-table-column>
          <!-- <el-table-column
            prop="createUser"
            label="创建人"
            show-overflow-tooltip
            align="center"
          ></el-table-column> -->
          <!-- <el-table-column label="操作" align="center" type="selection">
            <template slot-scope="scope">
              <el-checkbox class="checkboxT" v-model="scope.row.selected" v-if="scope.row.selected == true" @change="cancelRoom(scope.row)">已选</el-checkbox>
              <el-checkbox class="checkboxF" v-model="scope.row.selected" v-else @change="addRoom(scope.row)">未选</el-checkbox>
              <el-button v-if="scope.row.selected" type="danger" size="mini" @click="cancelRoom(scope.row)">取消</el-button>
              <el-button v-else type="primary" size="mini" @click="addRoom(scope.row)">选择</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
        <el-pagination style="margin-top: 15px; margin-left: 15px" @size-change="changeSize" @current-change="handleCurrentChange" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="prev, pager, next, total, sizes" :total="pagination.total"></el-pagination>
      </div>
    </div>
    
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmChoose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import { getCamera,getCameraTree,getUnbindCamera } from "@/api/police";
const DataTree = () => import("../../../device/cameraManage/components/DataTree.vue");
@Component({
  components: { DataTree },
})
export default class extends Vue {
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: false }) unBind: boolean;
  @Prop({ default: '' }) areaId: string;
  @Prop({ default: [] }) camera: Array<object>;
  @Prop({
    default: () => {
      return {
        label: "name",
        key: "id",
        children:'children'
      };
    },
  })
  dataFormate: Object;
  tabLoad: boolean = false;
  groupId: string = '';
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  multipleSelection: Array<object> = [];
  pagination: any = {
    show: false,
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 30, 50],
  };
  TreeData: any = [
    {
      name: "所有",
      id: "",
      children: [],
    },
  ];
  selectedCamera: any = [];
  tableData: Array<object> = [];
  filterForm:object = {
    name:''
  }
  created() {
    // debugger;
    // this.selectedCamera = this.camera;
    // this.getCameraList();
    this.getTreeData();
  }
  @Watch("visible")
  choose() {
    if (this.visible) {
      this.selectedCamera = this.camera;
      this.getCameraList();
    } 
  }
  // 摄像机分组
  async getTreeData() {
    let { data } = await getCameraTree({});
    let treeData = [];
    if (data.data && data.data.length > 0) {
      treeData = this.initGrade(data.data);
      this.TreeData[0].children = treeData;
    }
  }
  initGrade(dataArr) {
    let arr:any = [];
    if (dataArr && dataArr.length > 0) {
      dataArr.forEach((item) => {
        arr.push({
          name: item["name"],
          id: item["id"],
        });
      });
    }
    return arr;
  }
  // 点击树形
  nodeClick(data) {
    if (data.id === this.groupId) {
      return;
    }
    this.groupId = data.id;
    this.getCameraList();
    
  }
  getCameraList() {
    this.tabLoad = true;
    this.tableData = [];
    let param = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      name: this.filterForm['name'],
      groupId:this.groupId
    };
    if (this.unBind){
      param['areaId'] = this.areaId;
      getUnbindCamera(param).then((res) => {
      this.tabLoad = false;
      let data = res.data.data;
      this.tableData = data.records;
      this.pagination.total = data.total;
      this.$nextTick(()=>{
         this.tableData.map((item: any, i) => {
          let obj = this.selectedCamera.find((item1: any) => item1.id == item.id);
          if (obj) {
            this.$refs.singleTable['toggleRowSelection'](item,true);
          } else {
            // this.$refs.singleTable['toggleRowSelection'](item.tableData[i],false);
          }
        });
      })
    }).catch(err=>{
      this.tabLoad = false;
    });
    } else {
      getCamera(param).then((res) => {
        this.tabLoad = false;
        let data = res.data.data;
        
        this.tableData = data.records;
        data.records.map((item: any, i) => {
          let obj = this.selectedCamera.find((item1: any) => item1.id == item.id);
          if (obj) {
            data.records[i].selected = true;
          } else {
            data.records[i].selected = false;
          }
        });
        this.pagination.total = data.total;
      }).catch(err=>{
        this.tabLoad = false;
      });
    }
    // getCamera(param).then((res) => {
    //   let data = res.data.data;
    //   data.records.map((item: any, i) => {
    //     let obj = this.selectedCamera.find((item1: any) => item1.id == item.id);
    //     if (obj) {
    //       data.records[i].selected = true;
    //     } else {
    //       data.records[i].selected = false;
    //     }
    //   });
    //   this.tableData = data.records;
    //   this.pagination.total = data.total;
    // });
  }
  handleClose() {
    this.tableData = [];
    this.pagination = {
    show: false,
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 30, 50],
  };
    this.$emit("close");
  }
  confirmChoose() {
    this.$emit("submit", [...this.selectedCamera]);
  }
  changeSize(size) {
    this.pagination.page = 1;
    this.pagination.pageSize = size;
    this.getCameraList();
  }
  handleCurrentChange(page) {
    this.pagination.page = page;
    this.getCameraList();
  }
  handleSelectionChange(val) {
    if(val && val.length>0) {
      val.map(item => {
        let index = this.selectedCamera.findIndex((j:any) => 
           item.id == j.id
          )
        if(index == -1) {
          this.selectedCamera.push(item);
        } 
      })
      // this.selectedCamera = this.selectedCamera.concat(val);
    } else {
      this.tableData.map( (item:any) => {
        let index = this.selectedCamera.findIndex((j: any) =>  j.id == item.id);
        this.selectedCamera.splice(index, 1);
      })
    }
  }
  //单选
  rowSelect(selection,row) {
    if(selection.findIndex(item => item.id == row.id) == -1) {
      let index = this.selectedCamera.findIndex((j: any) =>  j.id == row.id);
      this.selectedCamera.splice(index, 1);
    }

  }

  cancelRoom(row) {
    let index = this.selectedCamera.findIndex((item: any) => item.id == row.id);
    this.selectedCamera.splice(index, 1);
    let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
    this.$refs.singleTable['toggleRowSelection'](this.tableData[index1],false);
  }
  // addRoom(row) {
  //   row.selected = true;
  //   let obj = { ...row };
  //   if(this.tableData.findIndex(item => {return item['selected'] === false}) === - 1) {

  //   }
  //   this.selectedCamera.push(obj);
  // }
  clearCameraAll(){ 
    this.selectedCamera.forEach(el => {
     let index1 = this.tableData.findIndex((item: any) => item.id == el.id);
     this.$refs.singleTable['toggleRowSelection'](this.tableData[index1],false)
    //  if (this.tableData[index1] && this.tableData[index1]["selected"] === true) {
    //    this.tableData[index1]["selected"] = false;
    //  }
      
    });
    
    // cancelRoom
    this.selectedCamera = [];
  }
  
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-pagination__total {
    margin-left: 15px;
  }
  .el-table .cell.el-tooltip {
    padding:5px 0;
  }
}
.checkboxT {
  border: 1px solid #409eff;
  color: #409eff;
  padding: 4px 10px;
  border-radius: 4px;
}
.checkboxF {
  border: 1px solid #e9e9eb;
  padding: 4px 10px;
  border-radius: 4px;
}
.mains-con{
  display: flex;
  
  overflow:auto;
  .left-con{
    width:300px; 
    height: 550px;
    margin-right:20px;
    overflow: auto;
  }
  .right-con{
    width:600px;
    .search-con{
      text-align: right;
    }
    .top-con{
      height: 590px;
      overflow: auto;
    }
  }
}
.selects{
  display: flex;
  min-height: 44px;
   flex-wrap:wrap;
  margin-bottom:10px;
  .one-select{
    padding:0 10px;
    border: 1px solid #33a5fe;
    color:#33a5fe;
    border-radius: 4px;
    display: flex;
    height: 32px;
    line-height: 32px;
    margin-right: 5px;
    margin-bottom:10px;
    .name{
      line-height:30px;
    }
    .icon{
      font-size: 18px;
      line-height: 30px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
.clear-btn{
  color:#33a5fe;
  border: 1px solid #33a5fe;
  padding:0 10px;
  border-radius: 6px;
  margin-top:4px;
  height: 24px;
  line-height: 22px;
  cursor: pointer;
}
/deep/ .el-dialog__header{
  border-bottom:1px solid #e4e7ed;
}
/deep/.el-dialog__body{
   padding-top:10px;
  padding-bottom:10px;
}
/deep/.el-form-item{
margin-bottom:10px;
}
</style>