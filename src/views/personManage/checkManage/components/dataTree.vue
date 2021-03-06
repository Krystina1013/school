<!--
  数据页面对应左边的树形结构
  TreeData: 传入的数据
-->
<template>
  <div class="content tree-rename">
    <div @click="handleNodeClick({ type: 'building', id: '' })" :class="['treeHeader', highlightStatus ? '' : 'highlight']">
      <i class="iconfont icon-shuji"></i>
      所有
      <el-dropdown v-if="type === 'house' && UpdateStatus && !hideHandle" class="dropdownAll" @command="commandTreeClick" placement="bottom-start">
        <i class="iconfont icon-gengduo"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="commandObj('addGroup', {})">添加任课组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- draggable class="icon_tuozhuai" :allow-drop="allowDrop"-->
    <el-tree :data="TreeData" node-key="id" :props="dataFormate" accordion :highlight-current="highlightStatus" :default-expand-all="false" :expand-on-click-node="false" @node-click="handleNodeClick">
      <span slot-scope="{ node }" @mouseenter="MouseNnter(node.id)" @mouseleave="MouseLeave(node.id)" :class="['custom-tree-node']">
        <span>
          {{ node.label }}
        </span>
        <div style="position: relative">
          <el-dropdown @command="commandTreeClick" placement="bottom-start">
            <i v-show="node.id === showMenu && !hideHandle" class="iconfont icon-gengduo"></i>
            <el-dropdown-menu v-if="type === 'house' || node.data.buildingType === '2'" slot="dropdown">
              <!-- <el-dropdown-item
                v-if="
                  (node.data.subBuildings &&
                    node.data.subBuildings.length === 0) ||
                    (node.data.subBuildings &&
                      node.data.subBuildings.length &&
                      node.data.subBuildings[0].type === 'group')
                "
                :command="commandObj('addGroup', node)"
                >添加子分组
              </el-dropdown-item> -->
              <el-dropdown-item :command="commandObj('updateGroup', node)">修改任课组</el-dropdown-item>
              <el-dropdown-item :command="commandObj('deleteGroup', node)">删除任课组</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
    <!-- 任课组dialog -->
    <el-dialog :before-close="closeDialog" :close-on-click-modal="false" width="500px" class="formDialog" :title="HouseForm.id ? '修改任课组' : '添加任课组'" :visible.sync="HouseUnitVisible">
      <el-form ref="buildings" :rules="HouseRules" :model="HouseForm" label-width="100px" label-position="right" style="margin: 20px 40px 0 0">
        <el-form-item label="任课组名称:" prop="groupName">
          <el-input placeholder="填写任课组名称" clearable maxlength="10" v-model.trim="HouseForm.groupName" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="unitBtnLoad" @click="addUpdateUnitConfim()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import {
  addTeacherGroups,
  editTeacherGroups,
  delTeacherGroups,
} from "@/api/peopleApi";
import { getDeviceList } from "@/api/deviceApi";
import {
  addRoleGroup,
  updateRoleGroup,
  deleteRoleGroup,
} from "@/api/peopleApi";
import { message } from "@/utils";

@Component({})
export default class dataTree extends Vue {
  private showMenu: Number = 0;
  UpdateStatus: boolean = true; // 是否具有修改权限
  @Getter("permissionList") permissionList: Array<string>;
  @Prop({ default: "house" }) type: string;
  @Prop({ default: "" }) device: string;
  @Prop({ default: false }) hideHandle: boolean;
  @Prop({
    default: () => {
      return []; // 必须是函数式返回
    },
  })
  TreeData: Array<Object>;
  unitBtnLoad: boolean = false;
  groupId: string = "";
  // private data: Array<Object> =
  @Prop({
    default: () => {
      return {
        children: "subBuildings",
        label: "name",
        key: "id",
      };
    },
  })
  dataFormate: Object;
  @Prop({ default: true }) needAction: any;
  @Prop({
    default: () => {
      return {};
    },
  })
  initFormHeader: object;
  @Prop({
    default: () => {
      return {};
    },
  })
  page: object;
  selectId: any = "";
  highlightStatus: boolean = false; // 高亮状态
  nodeAction: string = ""; // 记录执行的操作
  bindDeviceList: Array<object> = []; // 已选择绑定的设备列表
  bindDeviceListVisible: boolean = false; // 设备列表弹框状态
  DeviceList: Array<object> = []; // 所有设备列表
  devicePage: object = {
    page: 1,
    total: 1,
  };
  // 分组校验规则
  HouseRules: Object = {
    groupName: [
      { required: true, message: "请输入任课组名称", trigger: "blur" },
      { min: 1, max: 10, message: "长度应在1到10位" },
    ],
  };
  // 添加任课组表单
  HouseForm: object = {
    id: "",
    groupName: "",
    title: "添加任课组",
  };
  bindIndex: Array<number> = [];

  // 楼栋dialog添加分组状态
  HouseVisible: boolean = false;
  // 楼栋dialog添加楼栋状态
  HouseUnitVisible: boolean = false;
  // 楼栋dialog添加教室楼栋状态
  ClassVisible: boolean = false;
  groupBtnLoad: boolean = false;
  classBtnLoad: boolean = false;
  mounted() {
    this.UpdateStatus = this.permissionList.includes(
      this.$route.name + "Update"
    );
  }
  created() {
    // this.fetchUnitList('build')
  }
  // 获取设备列表
  fetchDeviceList(page: number) {
    this.bindIndex = [];
    // console.log(this.bindDeviceList, '已绑定设备列表')
    getDeviceList({ page, limit: 999 }).then((res) => {
      res.data.data.records.forEach((ele, index: number) => {
        this.bindDeviceList.forEach((item) => {
          if (ele["serialNumber"] === item["deviceSerialNumber"]) {
            this.bindIndex.push(index);
          }
        });
      });
      this.DeviceList = res.data.data.records;
      this.devicePage["total"] = res.data.data.total;
      // console.log(this.bindIndex, 'index')
      this.$nextTick(() => {
        if (this.$refs["deviceList"]) {
          this.bindIndex.forEach((i) => {
            this.$refs["deviceList"]["toggleRowSelection"](this.DeviceList[i]);
          });
        }
      });
    });
  }
  // 自动补充别名
  // autoName() {
  //   this.HouseForm['name'] = this.HouseForm['serialNumber'] + this.HouseForm['serialNumberUnit']
  // }
  // 关闭弹框
  closeDialog() {
    // 添加分组表单
    this.HouseForm = {
      id: "",
      groupName: "",
    };
    // 楼栋表单
    if (this.ClassVisible) {
      this.$refs["classBuildings"]["resetFields"]();
    }
    if (this.HouseUnitVisible) {
      this.$refs["buildings"]["resetFields"]();
    }
    if (this.HouseVisible) {
      this.$refs["batchForm"] && this.$refs["batchForm"]["resetFields"]();
      this.$refs["HouseForm"] && this.$refs["HouseForm"]["resetFields"]();
      this.$refs["HouseForms"] && this.$refs["HouseForms"]["resetFields"]();
    }
    this.HouseUnitVisible = false;
    this.ClassVisible = false;
    this.HouseVisible = false;
  }

  // 移除已选设备
  bildDeviceSplice(index) {
    this.bindDeviceList.splice(index, 1);
  }

  // 递归查询分组id
  checkoutGroupId(list: Array<object>, addObj: object, type: string) {
    list.forEach((item, index) => {
      if (this.groupId === item["id"]) {
        switch (type) {
          case "add":
            item["subBuildings"] && item["subBuildings"].push(addObj);
            item["subWorkerGroups"] && item["subWorkerGroups"].push(addObj);
            break;
          case "update":
            this.$set(item, "name", addObj["name"]);
            this.$set(item, "storeyNum", addObj["storeyNum"]);
            this.$set(item, "houseNum", addObj["houseNum"]);
            break;
          case "delete":
            list.splice(index, 1);
        }
      } else {
        item["subBuildings"] &&
          item["subBuildings"].length > 0 &&
          this.checkoutGroupId(item["subBuildings"], addObj, type);
        item["subWorkerGroups"] &&
          item["subWorkerGroups"].length > 0 &&
          this.checkoutGroupId(item["subWorkerGroups"], addObj, type);
      }
    });
  }
  // 查找对应的父级元素 不关闭楼栋分组
  checkParent(treeData: Array<object>, data: object) {
    let flag = false;
    let dataList: Array<object> = [];
    try {
      treeData.forEach((ele) => {
        if (
          ele["id"] === data["parentId"] ||
          ele["id"] === data["buildingGroupId"]
        ) {
          flag = true;
          treeData.push(data);
          throw "find parent";
        } else {
          dataList = treeData;
        }
      });
    } catch (err) {
      console.log(err);
    }
    if (!flag && dataList["subBuildings"] && dataList["subBuildings"].length) {
      return this.checkParent(dataList, data);
    }
  }
  constraintLength(value: string) {
    if (value.length === 10) {
      return message("error", "此项不能超过10个字符");
    }
  }
  // 关闭添加/修改单元楼
  closeBuildingAction() {
    this.$refs["buildings"]["resetFields"]();
    this.HouseUnitVisible = false;
  }
  @Emit("fetchData")
  handleNodeClick(data) {
    this.highlightStatus = !!data.id;
    let buildings: any = [];
    /**@description 树节点点击事件 */
    this["page"]["page"] = 1;
    this.initFormHeader["params"]["groupId"] = data.id;
    this.initFormHeader["params"] = Object.assign(
      this.initFormHeader["params"],
      this.page
    );

    return this.initFormHeader;
  }
  //拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'
  // allowDrop(draggingNode, dropNode, type) {
  //   if (draggingNode.level === dropNode.level) {
  //     if (draggingNode.parent.id === dropNode.parent.id) {
  //       // 向上拖拽 || 向下拖拽
  //       return type === "prev" || type === "next";
  //     }
  //   } else {
  //     // 不同级进行处理
  //     return false;
  //   }
  // }
  // 判断节点能否被拖拽
  // allowDrag(draggingNode) {
  //   return draggingNode.data.name.indexOf("所有") === -1;
  // }
  // 拖拽成功完成时触发的事件
  // handleDrop(draggingNode, dropNode, dropType, ev) {
  //   let arr: any = []; //存放哪个级别下面的childNodes
  //   let ids: any = []; //传参所有的id
  //   if (dropNode.level === 1) {
  //     //级别为1，所有childNodes
  //     arr = dropNode.store.root.childNodes;
  //   } else {
  //     // 其他层级
  //     arr = dropNode.parent.childNodes;
  //   }
  //   // 处理id
  //   arr.forEach((v: any) => {
  //     ids.push(v.data.id);
  //   });
  //   let callApi = updateOrderHouseGroup;
  //   let params = {
  //     ids: ids,
  //     type: this.type === "classBuild" ? "building" : dropNode.data.type,
  //   };
  //   let getTreeData = "getHouseTreeData";
  //   if (this.type === "workGroup") {
  //     callApi = updateOrderWorkerGroup;
  //     delete params.type;
  //     getTreeData = "fetchWorkGroup";
  //   }
  //   // 调用修改排序接口
  //   callApi(params).then((res) => {
  //     if (res.data.code === 200) {
  //       message("success", "操作成功");
  //       this.$emit(getTreeData);
  //     }
  //   });
  // }

  /**显示更多操作图标 */
  MouseNnter(val) {
    this.showMenu = val;
  }

  MouseLeave(val) {
    this.showMenu = 0;
  }
  /**
   * action 分类
   */
  commandTreeClick(treeData) {
    this.groupId = treeData.data && treeData.data.id;
    this.nodeAction = treeData.action;
    switch (treeData.action) {
      case "addGroup":
        this.closeDialog();

        this.HouseForm["title"] = "添加任课组";
        this.HouseUnitVisible = true;
        break;
      case "deleteGroup":
        this.$confirm(
          `此操作将永久删除${treeData.data.name}任课组,删除后任课组将不存在,请谨慎操作!`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            delTeacherGroups(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                message("success", "删除成功");
                this.$emit("getHouseTreeData", "del");
                this.checkoutGroupId(this.TreeData, {}, "delete");
                this.HouseVisible = false;
              }
            });
          })
          .catch(() => {
            message("error", "已取消删除");
          });
        break;

      case "updateGroup":
        this.HouseUnitVisible = true;
        this.HouseForm["title"] = "编辑任课组";
        this.HouseForm = Object.assign(this.HouseForm, treeData.data);
        this.HouseForm["groupName"] = treeData.data.name;
        break;
    }
  }
  /**
   *  返回执行的操作及id
   */
  commandObj(action, node) {
    return {
      action,
      ...node,
    };
  }
  // 修改  编辑
  addUpdateUnitConfim() {
    this.$refs["buildings"]["validate"]((valid) => {
      if (valid) {
        this.groupBtnLoad = true;
        let params = { ...this.HouseForm };
        delete params["title"];
        if (!this.HouseForm["id"]) {
          addTeacherGroups(params)
            .then((res) => {
              this.groupBtnLoad = false;
              if (res.data.code === 200) {
                message("success", "添加成功");
                let obj = Object.assign(
                  { subBuildings: null, type: "building" },
                  res.data.data
                );
                this.checkoutGroupId(this.TreeData, obj, "add");
                this.$emit("getHouseTreeData", "add");
                this.HouseUnitVisible = false;
              }
            })
            .catch((error) => {
              this.classBtnLoad = false;
            });
        } else {
          editTeacherGroups(params)
            .then((res) => {
              this.groupBtnLoad = false;
              if (res.data.code === 200) {
                message("success", "修改成功");
                this.HouseUnitVisible = false;
                let obj = Object.assign(
                  { subBuildings: null, type: "building" },
                  this.HouseForm
                );
                this.checkoutGroupId(this.TreeData, obj, "update");
                this.$emit("getHouseTreeData", "updated");
              }
            })
            .catch((error) => {
              this.groupBtnLoad = false;
            });
        }
      }
    });
  }

  ///
  public phoneNum: any = 0;
  public regPos = /^\d+(\.\d+)?$/;
  public upNum = /[^\d]/g;
  public hintPhone: any = false;
  // phone只可输入数字
  UpNumber(e: any) {
    var v = e.target.value;
    e.target.value = v.replace(this.upNum, "");
  }

  clearableBtn(v) {
    //清除
    this.phoneNum = v ? v.length : 0;
  }

  hint(v: any) {
    this.hintPhone = v ? true : false;
  }

  hintFocus(e: any) {
    this.hintPhone = e.target.value ? true : false;
  }

  hintBlur() {
    this.hintPhone = false;
  }
}
</script>

<style lang="scss">
/* .el-tree-node__content {
  position: relative;
} */
/* .el-tree-node__content:hover {
  color: #409eff;
  font-weight: bold;
} */
.icon_tuozhuai .el-tree-node__content {
  position: relative;
  &::before {
    top: 0;
    left: 0;
    content: "::::";
    opacity: 0;
    transform: rotate(90deg);
    width: 16px;
    height: 100%;
  }
  &:hover::before {
    top: 0;
    left: 0;
    opacity: 1;
    content: "::::";
    transform: rotate(90deg);
  }
}
</style>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
  color: white;
}
.content {
  width: 100%;
  // height: 70vh;
  height: calc(100vh - 52px);
  text-align: left;
  overflow-y: auto;
  overflow-x: auto;
  box-shadow: none;
  border-top: 0;
  background: #fff;
}
.treeHeader {
  &:hover {
    cursor: pointer;
  }
  width: 100%;
  height: 40px;
  text-align: left;
  text-indent: 1em;
  line-height: 40px;
  position: relative;
  i {
    font-size: 20px;
  }
  .icon-gengduo {
    display: none;
  }
  .dropdownAll {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 30px;
    top: 0px;
  }
  &:hover .icon-gengduo {
    display: block;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.formDialog {
  .input {
    width: 220px;
  }
}
.input-new-tag {
  width: 120px;
}
.bindDevice {
  height: 60px;
  line-height: 40px;
  overflow: hidden;
  padding: 10px 0px;
}
.highlight {
  background-color: #409eff;
  color: white;
}
.highlight .icon-gengduo {
  color: white;
}
.tree-rename {
  overflow: auto;
}
</style>
