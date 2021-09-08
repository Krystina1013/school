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
          <el-dropdown-item :command="commandObj('addGroup', {})">添加子分组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-if="type === 'classBuild' && UpdateStatus && !hideHandle" class="dropdownAll" @command="commandTreeClick" placement="bottom-start">
        <i class="iconfont icon-gengduo"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="commandObj('addClassBuilding', {})">添加楼栋</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-else-if="type === 'workGroup' && UpdateStatus && !hideHandle" class="dropdownAll" @command="commandTreeClick" placement="bottom-start">
        <i class="iconfont icon-gengduo"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="commandObj('addWorkGroup', {})">添加工作组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-else-if="type === 'role' && UpdateStatus && !hideHandle" class="dropdownAll" @command="commandTreeClick" placement="bottom-start">
        <i class="iconfont icon-gengduo"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="commandObj('addRoleGroup', {})">创建权限组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tree :data="TreeData" node-key="id" :props="dataFormate" accordion :draggable="type !== 'gradeInfo' && type !== 'gradeInfo_student'" :class="{
        'icon_tuozhuai': type !== 'gradeInfo' && type !== 'gradeInfo_student',
      }" :allow-drop="allowDrop" @node-drop="handleDrop" :highlight-current="highlightStatus" :default-expand-all="false" :expand-on-click-node="false" @node-click="handleNodeClick">
      <span slot-scope="{ node }" @mouseenter="MouseNnter(node.id)" @mouseleave="MouseLeave(node.id)" :class="['custom-tree-node']">
        <span>
          {{ node.label }}
        </span>
        <div style="position: relative">
          <el-dropdown v-if="
              UpdateStatus &&
              !hideHandle &&
              type !== 'gradeInfo' &&
              type !== 'gradeInfo_student'
            " @command="commandTreeClick" placement="bottom-start">
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
              <el-dropdown-item v-if="
                  (node.data.subBuildings &&
                    node.data.subBuildings.length === 0) ||
                  (node.data.subBuildings &&
                    node.data.subBuildings.length &&
                    node.data.subBuildings[0].type === 'building')
                " :command="commandObj('addBuilding', node)">添加宿舍楼</el-dropdown-item>
              <el-dropdown-item v-if="node.data.type === 'group'" :command="commandObj('updateGroup', node)">修改分组</el-dropdown-item>
              <el-dropdown-item v-if="node.data.type === 'group'" :command="commandObj('deleteGroup', node)">删除分组</el-dropdown-item>
              <el-dropdown-item v-if="node.data.type === 'building'" :command="commandObj('updateBuilding', node)">修改宿舍楼</el-dropdown-item>
              <el-dropdown-item v-if="node.data.type === 'building'" :command="commandObj('deleteBuilding', node)">删除宿舍楼</el-dropdown-item>
              <el-dropdown-item v-if="node.data.buildingType === '2'" :command="commandObj('updateClassBuilding', node)">修改教学楼</el-dropdown-item>
              <el-dropdown-item v-if="node.data.buildingType === '2'" :command="commandObj('deleteClassBuilding', node)">删除教学楼</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-if="type === 'workGroup'" slot="dropdown">
              <el-dropdown-item :command="commandObj('addWorkGroup', node)" v-if="node.data.groupHide === '0'">添加子分组
              </el-dropdown-item>

              <el-dropdown-item :command="commandObj('updateWorkGroup', node)">修改分组</el-dropdown-item>
              <el-dropdown-item :command="commandObj('deleteWorkGroup', node)">删除分组</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-if="type === 'role'" slot="dropdown">
              <el-dropdown-item :command="commandObj('updateRoleGroup', node)">修改</el-dropdown-item>
              <el-dropdown-item :command="commandObj('deleteRoleGroup', node)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
    <!-- 楼栋dialog宿舍楼 -->
    <el-dialog :before-close="closeDialog" :close-on-click-modal="false" width="500px" class="formDialog" :title="UnitForm.id ? '修改宿舍楼' : '添加宿舍楼'" :visible.sync="HouseUnitVisible">
      <el-form ref="buildings" :rules="unitRules" :model="UnitForm" label-width="100px" label-position="right" style="margin: 20px 40px 0 0">
        <el-form-item label="名称:" prop="name">
          <el-input placeholder="填写楼栋名称" clearable maxlength="10" v-model.trim="UnitForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="楼层数:" prop="storeyNum" v-if="!UnitForm.id">
          <el-input clearable @change="clearableBtn" @input="hint" @focus="hintFocus" @blur="hintBlur" maxlength="2" placeholder="填写楼层数" @mouseover.native="hint(UnitForm.storeyNum)" @mouseout.native="hint(UnitForm.storeyNum)" v-model.number="UnitForm.storeyNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="每层房间数:" prop="houseNum" v-if="!UnitForm.id">
          <el-input clearable maxlength="2" placeholder="填写每层房间数" @change="clearableBtn" @input="hint" @focus="hintFocus" @blur="hintBlur" @mouseover.native="hint(UnitForm.houseNum)" @mouseout.native="hint(UnitForm.houseNum)" v-model.number="UnitForm.houseNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间床位数:" prop="perRoomBeds" v-if="!UnitForm.id">
          <el-input clearable maxlength="2" placeholder="填写房间床位数（几人间）" @change="clearableBtn" @input="hint" @focus="hintFocus" @blur="hintBlur" @mouseover.native="hint(UnitForm.houseNum)" @mouseout.native="hint(UnitForm.houseNum)" v-model.number="UnitForm.perRoomBeds" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="unitBtnLoad" @click="addUpdateUnitConfim()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 楼栋dialog添加分组 -->
    <el-dialog :before-close="closeDialog" @submit.native.prevent :close-on-click-modal="false" width="500px" class="formDialog" :title="HouseForm.title" :visible.sync="HouseVisible">
      <el-tabs v-if="nodeAction !== 'updateGroup'" v-model="activeName" type="card">
        <!-- <el-tab-pane label="批量添加" name="first">
          <el-form
            ref="batchForm"
            :rules="batchRules"
            :model="batchForm"
            label-width="100px"
            label-position="right"
            style="margin:20px 40px 0 0;"
          >
            <el-form-item prop="min" label="编号:">
              <el-input
                clearable
                maxlength="5"
                @keyup.native="UpNumber"
                @keydown.native="UpNumber"
                @change="clearableBtn"
                @input="hint"
                @focus="hintFocus"
                @blur="hintBlur"
                @mouseover.native="hint(batchForm.min)"
                @mouseout.native="hint(batchForm.min)"
                style="width:140px"
                placeholder="开始编号"
                v-model="batchForm.min"
              ></el-input
              >&nbsp;&nbsp;至&nbsp;&nbsp;
              <el-input
                clearable
                placeholder="结束编号"
                style="width:140px"
                @keyup.native="UpNumber"
                @keydown.native="UpNumber"
                @change="clearableBtn"
                @input="hint"
                maxlength="5"
                @focus="hintFocus"
                @blur="hintBlur"
                @mouseover.native="hint(batchForm.max)"
                @mouseout.native="hint(batchForm.max)"
                v-model="batchForm.max"
              ></el-input>
            </el-form-item>
            <el-form-item label="单位:" prop="serialNumberUnit">
              <el-select
                style="width:212px"
                v-model="batchForm.serialNumberUnit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in Tags"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
              <el-button @click="showUnitSetting = !showUnitSetting"
                >单位设置</el-button
              >
              <div v-if="showUnitSetting">
                <el-tag
                  style="margin-left:5px"
                  :key="index"
                  v-for="(tag, index) in Tags"
                  closable
                  :disable-transitions="false"
                  @close="deleteTag(tag, 'group')"
                  >{{ tag.name }}</el-tag
                >
                <el-input
                  maxlength="10"
                  @input="constraintLength(newTagValue)"
                  class="input-new-tag"
                  v-if="newTag"
                  v-model="newTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm('group')"
                  @blur="handleInputConfirm('group')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >添加单位</el-button
                >
              </div>
            </el-form-item>
            <el-form-item label="备注信息:" prop="note">
              <el-input
                maxlength="200"
                placeholder="填写分组的备注信息"
                type="textarea"
                v-model="batchForm.note"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane> -->
        <el-tab-pane label="手动添加" name="second">
          <el-form ref="HouseForm" :rules="HouseRules" :model="HouseForm" label-width="90px" label-position="right" style="margin: 20px 40px 0 0">
            <el-form-item label="别名:" prop="name">
              <el-input clearable maxlength="10" placeholder="填写分组的别名" v-model.trim="HouseForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="备注:" prop="note">
              <el-input
                maxlength="200"
                placeholder="填写分组的备注信息"
                type="textarea"
                v-model.trim="HouseForm.note"
                autocomplete="off"
              ></el-input>
            </el-form-item> -->
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-form v-else ref="HouseForms" @submit.native.prevent :rules="HouseRules" :model="HouseForm" label-width="100px" label-position="right" style="margin: 20px 40px 0 0">
        <el-form-item label="别名:" prop="name">
          <el-input clearable maxlength="10" placeholder="填写分组的别名" v-model.trim="HouseForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注:" prop="note">
          <el-input
            placeholder="填写分组的备注信息"
            maxlength="200"
            type="textarea"
            v-model.trim="HouseForm.note"
            autocomplete="off"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="groupBtnLoad" @click="GroupAction">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 楼栋dialog添加教室楼 -->
    <el-dialog :before-close="closeDialog" :close-on-click-modal="false" width="500px" class="formDialog" :title="classForm.id ? '修改教室楼' : '添加教室楼'" :visible.sync="ClassVisible">
      <el-form ref="classBuildings" :rules="classRules" :model="classForm" label-width="100px" label-position="right" style="margin: 20px 40px 0 0">
        <el-form-item label="楼栋名称:" prop="name">
          <el-input placeholder="填写楼栋名称" clearable maxlength="10" v-model.trim="classForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="楼层数:" prop="storeyNum" v-if="!classForm.id">
          <el-input clearable maxlength="2" placeholder="填写楼层数" v-model.number="classForm.storeyNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="每层教室数:" prop="houseNum" v-if="!classForm.id">
          <el-input clearable maxlength="2" placeholder="填写每层教室数" v-model.number="classForm.houseNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="classBtnLoad" @click="addUpdateClassConfim">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限dialog -->
    <el-dialog :before-close="roleHandClose" :close-on-click-modal="false" width="800px" :title="RoleForm.id ? '修改权限组' : '新建权限组'" :visible.sync="RoleVisible">
      <el-form :rules="RoleRules" style="overflow: hidden" ref="roleForm" :model="RoleForm">
        <el-form-item prop="name" label="权限名称:">
          <el-input placeholder="填写权限名称" clearable maxlength="10" v-model.trim="RoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item
          prop="enableInviteCar"
          style="float:left;width:350px"
          label="邀请车辆:"
        >
          <el-switch
            v-model="RoleForm.enableInviteCar"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item> -->
        <!-- <el-form-item
          prop="enableInviteVisitor"
          style="float:left;width:350px"
          label="邀请访客:"
            >
          <el-switch
            v-model="RoleForm.enableInviteVisitor"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </el-form-item> -->
        <!-- <el-form-item
          prop="enableRemoteOpen"
          style="float:left;width:350px"
          label="远程开门:"
            >
          <el-switch
            v-model="RoleForm.enableRemoteOpen"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </el-form-item> -->
      </el-form>
      <div class="bindDevice">
        <span style="float: left">设备权限</span>
        <el-button style="float: right" type="primary" @click="(bindDeviceListVisible = true), fetchDeviceList(1)">权限设置</el-button>
      </div>
      <el-table :data="bindDeviceList" stripe border style="width: 100%">
        <el-table-column type="index" align="center" prop="date" label="序号" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="位置">
          <template slot-scope="{ row }">
            <span>{{ row.bindingAddress || row.position }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" :show-overflow-tooltip="true" label="设备名"></el-table-column>
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          width="350"
          label="时间"
        >
          <template slot-scope="{ row }">
            <span
              v-if="!row.timeStatus"
              class="rowUpdate"
              @click="timeUpdateStatus(row)"
              >{{ row.startTime }}-{{ row.endTime }}</span
            >
            <div v-else>
              <el-time-select
                :clearable="false"
                style="width:120px"
                v-model="startTime"
                :picker-options="{
                  start: '00:30',
                  step: '00:30',
                  end: '23:30'
                }"
                @blur="confirmEndTime(row)"
                placeholder="开始时间"
              ></el-time-select
              >-
              <el-time-select
                :clearable="false"
                style="width:120px"
                v-model="endTime"
                @change="confirmEndTime(row)"
                :picker-options="{
                  start: startTime,
                  step: '00:30',
                  end: '23:30'
                }"
                placeholder="结束时间"
              ></el-time-select>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="bildDeviceSplice(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleHandClose">取 消</el-button>
        <el-button type="primary" @click="RoleAddConfim">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设备列表 -->
    <el-dialog :close-on-click-modal="false" width="800px" title="设备列表" :visible.sync="bindDeviceListVisible">
      <el-table :data="DeviceList" stripe border ref="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" property="name" align="center" label="位置">
          <template slot-scope="{ row }">
            <span>{{ row.bindingAddress || row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" property="name" label="设备名称"></el-table-column>
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          property="serialNumber"
          label="设备序列号"
        ></el-table-column> -->
      </el-table>
      <!-- <el-pagination
        background
        @current-change="fetchDeviceList"
        layout="prev, pager, next"
        :total="devicePage.total"
      ></el-pagination> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindDeviceListVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBindDevicelist">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import {
  addHouseGroup,
  addWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
  deleteHouseGroup,
  updateHouseGroup,
  updateOrderHouseGroup, // 树形结构排序接口
  updateOrderWorkerGroup, //职工树形结构排序接口
  getUnitList,
  addUnit,
  deleteUnit,
  addBuilding,
  updateBuilding,
  deleteBuilding,
} from "@/api/houseApi.ts";
import { getDeviceList } from "@/api/deviceApi.ts";
import {
  addRoleGroup,
  updateRoleGroup,
  deleteRoleGroup,
} from "@/api/peopleApi.ts";
import { message } from "@/utils";
@Component({})
export default class DataTree extends Vue {
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
  batchForm: object = {
    serialNumber: "", // 序号
    serialNumberUnit: "",
    name: "",
    note: "",
    min: "",
    max: "",
    parentId: "",
    title: "添加子分组",
  }; // 批量添加表单
  activeName: string = "second";
  startTime: string = "18:00";
  endTime: string = "21:00"; // 权限修改时间
  unConfirmDeviceList: Array<object> = []; // 以勾选的设备
  // 分组校验规则
  HouseRules: Object = {
    name: [
      { required: true, message: "请输入别名", trigger: "blur" },
      { min: 1, max: 15, message: "别名长度应在1到15位" },
    ],
    serialNumber: [{ required: true, message: "请输入序号", trigger: "blur" }],
  };
  classForm: object = {
    storeyNum: "", // 序号
    houseNum: "",
    name: "",
    id: "",
    perRoomBeds: 0,
    buildingType: 2,
  }; // 批量添加表单
  classRules: object = {
    name: [{ required: true, message: "请输入楼栋名称", trigger: "blur" }],
    storeyNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼层数"));
          } else {
            callback();
          }
        },
      },
    ],
    houseNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的每层教室数"));
          } else {
            callback();
          }
        },
      },
    ],
  };
  unitRules: object = {
    name: [{ required: true, message: "请输入单元楼名称", trigger: "blur" }],
    // serialNumber: [{ required: true, message: "请输入序号", trigger: "blur" }],
    storeyNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼层数(最大99)"));
          } else {
            callback();
          }
        },
      },
    ],
    houseNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的每层教室数(最大99)"));
          } else {
            callback();
          }
        },
      },
    ],
    perRoomBeds: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的房间床位数(最大99)"));
          } else {
            if (value > 99) {
              callback(new Error("填写正确的房间床位数(最大99)"));
            } else {
              callback();
            }
          }
        },
      },
    ],
  };
  batchRules: object = {
    min: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼栋编号"));
          } else {
            callback();
          }
        },
      },
    ],
    max: [{ required: true, message: "请输入结束编号", trigger: "blur" }],
  };
  // 添加分组表单
  HouseForm: object = {
    serialNumber: "", // 序号
    serialNumberUnit: "",
    name: "",
    note: "",
    parentId: "",
    title: "添加子分组",
  };
  bindIndex: Array<number> = [];
  // 楼栋宿舍楼表单
  UnitForm: object = {
    buildingGroupId: "",
    buildingType: 1,
    name: "", // 名称
    storeyNum: "", // 楼层数
    houseNum: "", // 每层房间数
    bedNum: "", //每间房床位数
  };
  // 楼栋dialog添加分组状态
  HouseVisible: boolean = false;
  // 楼栋dialog添加楼栋状态
  HouseUnitVisible: boolean = false;
  // 楼栋dialog添加教室楼栋状态
  ClassVisible: boolean = false;
  // 权限表单
  RoleForm: object = {
    devIds: [],
    enableInviteCar: "true",
    enableInviteVisitor: "true",
    enableRemoteOpen: "true",
    name: "",
  };
  RoleRules: object = {
    name: [
      { required: true, message: "请输入权限组名称", trigger: "blur" },
      { mix: 1, max: 10, message: "名称在1到10之前", trigger: "blur" },
    ],
  };
  // 查看已有单元设置状态
  showUnitSetting: boolean = false;
  // 单位序号设置 数组
  Tags: Array<object> = [];
  UnitTags: Array<object> = [];
  // 添加序号单元input框状态
  newTag: boolean = false;
  // 添加单元的值
  newTagValue: string = "";
  // 权限dialog状态
  RoleVisible: boolean = false;
  // 弹窗按钮状态
  unitBtnLoad: boolean = false;
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
    this.newTagValue = "";
    // 添加分组表单
    this.HouseForm = {
      serialNumber: "", // 序号
      serialNumberUnit: this.Tags.length && this.Tags[0]["name"],
      name: "",
      note: "",
      parentId: "",
      title: "添加子分组",
    };
    // 楼栋表单
    this.UnitForm = {
      buildingGroupId: "",
      buildingGroupName: "",
      name: "", // 名称
      serialNumber: "", // 编号
      storeyNum: "", // 楼层数
      houseNum: "", // 每层房间数
      perRoomBeds: "", // 每个房间床位数
    };
    this.batchForm = {
      serialNumber: "", // 序号
      serialNumberUnit: "",
      name: "",
      note: "",
      min: "",
      max: "",
      parentId: "",
      title: "添加子分组",
    };
    this.classForm = {
      id: "",
      storeyNum: "",
      houseNum: "",
      name: "",
      perRoomBeds: 0,
      buildingType: 2,
    };
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
  // 将已选中的设备保存
  handleSelectionChange(val) {
    this.unConfirmDeviceList = val;
  }
  // 移除已选设备
  bildDeviceSplice(index) {
    this.bindDeviceList.splice(index, 1);
  }
  // 时间改变状态
  timeUpdateStatus(row) {
    row.timeStatus = !row.timeStatus;
    this.startTime = row.startTime;
    this.endTime = row.endTime;
  }
  // 确定对应设备的时间
  confirmEndTime(row) {
    row.startTime = this.startTime;
    row.endTime = this.endTime;
    this.startTime = "18:00";
    this.endTime = "21:00"; // 权限修改时间
    row.timeStatus = false;
  }
  // 确定添加权限
  RoleAddConfim() {
    this.$refs["roleForm"]["validate"]((valid) => {
      if (valid) {
        let arr: any = [];
        this.bindDeviceList.map((item: any) => {
          arr.push(item.id);
        });
        this.RoleForm["devIds"] = arr;
        if (!this.RoleForm["devIds"].length) {
          return message("error", "请添加权限组的设备");
        }
        if (!this.RoleForm["id"]) {
          addRoleGroup(this.RoleForm).then((res) => {
            if (res.data.code === 200) {
              message("success", "添加权限组成功");
              this.$emit("fetchRoleGroup");
              this["page"]["page"] = 1;
              this.$emit("fetchData", this.initFormHeader);
              this.roleHandClose();
            }
          });
        } else {
          updateRoleGroup(this.RoleForm).then((res) => {
            if (res.data.code === 200) {
              message("success", "修改权限组成功");
              this.$emit("fetchRoleGroup");
              this["page"]["page"] = 1;
              this.$emit("fetchData", this.initFormHeader);
              this.roleHandClose();
            }
          });
        }
      }
    });
  }
  // 添加/修改权限组关闭弹框
  roleHandClose() {
    this.RoleForm["devIds"] = [];
    this.bindDeviceList = [];
    this.$refs["roleForm"]["resetFields"]();
    this.RoleVisible = false;
  }
  // 保存到绑定设备 并验证是否已经存在 已存在不加入
  saveBindDevicelist() {
    const strDevice = JSON.stringify(this.bindDeviceList);
    this.unConfirmDeviceList.forEach((ele, index) => {
      ele["startTime"] = "18:00";
      ele["endTime"] = "21:00";
      ele["deviceId"] = ele["id"];
      ele["deviceSerialNumber"] = ele["serialNumber"];
      this.$set(ele, "timeStatus", false);
    });
    this.bindDeviceList = this.unConfirmDeviceList;
    this.bindDeviceListVisible = false;
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
  // 确定添加/修改教学楼
  addUpdateClassConfim() {
    this.$refs["classBuildings"]["validate"]((valid) => {
      if (valid) {
        this.classBtnLoad = true;
        this.classForm["buildingType"] = 2;
        this.classForm["perRoomBeds"] = 0;
        if (!this.classForm["id"]) {
          addBuilding(this.classForm)
            .then((res) => {
              this.classBtnLoad = false;
              if (res.data.code === 200) {
                message("success", "添加成功");
                let obj = Object.assign(
                  { subBuildings: null, type: "building" },
                  res.data.data
                );
                // this.checkoutGroupId(this.TreeData, obj, "add");
                this.$emit("getHouseTreeData");
                this.TreeData.push(obj);
                this.ClassVisible = false;
                this.$emit("fetchData", this.initFormHeader);
              }
            })
            .catch((error) => {
              this.classBtnLoad = false;
            });
        } else {
          for (let item in this.classForm) {
            if (this.classForm[item] === "") {
              this.classForm[item] = null;
            }
          }
          updateBuilding(this.classForm).then((res) => {
            if (res.data.code === 200) {
              this.classBtnLoad = false;
              message("success", "修改成功");
              this.ClassVisible = false;
              let obj = Object.assign(
                { subBuildings: null, type: "building" },
                this.classForm
              );
              this.TreeData.forEach((item) => {
                if (item["id"] === obj["id"]) {
                  this.$set(item, "name", obj["name"]);
                  // this.$set(item, "storeyNum", obj["storeyNum"]);
                  // this.$set(item, "houseNum", obj["houseNum"]);
                }
              });
              // this.checkoutGroupId(this.TreeData, obj, "update");
              this.$emit("fetchData", this.initFormHeader);
            }
          });
        }
      }
    });
  }
  // 确定添加/修改单元楼
  addUpdateUnitConfim() {
    this.$refs["buildings"]["validate"]((valid) => {
      if (valid) {
        this.unitBtnLoad = true;
        this.UnitForm["buildingType"] = 1;
        if (!this.UnitForm["id"]) {
          addBuilding(this.UnitForm)
            .then((res) => {
              this.unitBtnLoad = false;
              if (res.data.code === 200) {
                message("success", "添加成功");
                let obj = Object.assign(
                  { subBuildings: null, type: "building" },
                  res.data.data
                );
                this.checkoutGroupId(this.TreeData, obj, "add");
                this.$emit("getHouseTreeData");
                this.HouseUnitVisible = false;
              }
            })
            .catch((error) => {
              this.classBtnLoad = false;
            });
        } else {
          updateBuilding(this.UnitForm)
            .then((res) => {
              this.unitBtnLoad = false;
              if (res.data.code === 200) {
                message("success", "修改成功");
                this.HouseUnitVisible = false;
                let obj = Object.assign(
                  { subBuildings: null, type: "building" },
                  this.UnitForm
                );
                this.checkoutGroupId(this.TreeData, obj, "update");
                // this.$emit("getHouseTreeData");
              }
            })
            .catch((error) => {
              this.unitBtnLoad = false;
            });
        }
      }
    });
  }
  // 获取单位列表
  fetchUnitList(type: string = "group") {
    return;
    getUnitList(type).then((res) => {
      if (type === "build") {
        this.UnitTags = res.data.data;
      } else {
        this.Tags = res.data.data;
        if (this.Tags.length > 0) {
          this.HouseForm["serialNumberUnit"] = this.Tags[0]["name"];
          this.batchForm["serialNumberUnit"] = this.Tags[0]["name"];
        }
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
  /** 添加或修改分组信息 */
  async GroupAction() {
    let isgo = false;
    if (this.$refs["HouseForm"]) {
      this.$refs["HouseForm"]["validate"]((valid) => {
        if (valid) {
          isgo = true;
          this.groupBtnLoad = true;
        }
      });
    }
    if (this.$refs["HouseForms"]) {
      this.$refs["HouseForms"]["validate"]((valid) => {
        if (valid) {
          isgo = true;
          this.groupBtnLoad = true;
        }
      });
    }
    if (!isgo) {
      return false;
    }
    if (this.activeName === "second") {
      if (this.nodeAction === "addGroup") {
        addHouseGroup(this.HouseForm)
          .then((res) => {
            this.groupBtnLoad = false;
            if (res.data.code === 200) {
              this.closeDialog();
              message("success", "添加成功");
              if (this.groupId) {
                let obj = Object.assign(
                  { subBuildings: [], type: "group" },
                  res.data.data
                );
                this.checkoutGroupId(this.TreeData, obj, "add");
              } else {
                this.$emit("getHouseTreeData");
              }
              this.HouseVisible = false;
            }
          })
          .catch((error) => {
            this.unitBtnLoad = false;
          });
      } else if (this.nodeAction === "updateGroup") {
        updateHouseGroup(this.HouseForm)
          .then((res) => {
            this.groupBtnLoad = false;
            if (res.data.code === 200) {
              message("success", "修改成功");
              let obj = Object.assign(
                { subBuildings: [], type: "group" },
                this.HouseForm
              );
              this.checkoutGroupId(this.TreeData, obj, "update");
              this.$emit("getHouseTreeData");
              this.closeDialog();
              this.HouseVisible = false;
            }
          })
          .catch((error) => {
            this.unitBtnLoad = false;
          });
      } else if (this.nodeAction === "addWorkGroup") {
        addWorkGroup(this.HouseForm)
          .then((res) => {
            this.groupBtnLoad = false;
            if (res.data.code === 200) {
              this.closeDialog();

              message("success", "添加成功");
              if (this.groupId) {
                let obj = Object.assign(
                  { subWorkerGroups: [], type: "workGroup" },
                  res.data.data
                );
                this.checkoutGroupId(this.TreeData, obj, "add");
              } else {
                this.$emit("fetchWorkGroup");
              }
              this.HouseVisible = false;
            }
          })
          .catch((error) => {
            this.groupBtnLoad = false;
          });
      } else if (this.nodeAction === "updateWorkGroup") {
        updateWorkGroup(this.HouseForm)
          .then((res) => {
            this.groupBtnLoad = false;
            if (res.data.code === 200) {
              this.closeDialog();
              message("success", "修改成功");
              if (this.groupId) {
                // let obj = Object.assign(
                //   { subWorkerGroups: [], type: "Workgroup" },
                //   this.HouseForm
                // );
                // this.checkoutGroupId(this.TreeData, obj, "update");
                this.$emit("fetchWorkGroup");
              } else {
                this.$emit("fetchWorkGroup");
              }
              this.HouseVisible = false;
            }
          })
          .catch((error) => {
            this.groupBtnLoad = false;
          });
      }
    } else {
      const reg = /^[0-9]+$/;
      if (
        !reg.test(this.batchForm["min"]) &&
        !reg.test(this.batchForm["max"])
      ) {
        return message("error", "请填入正整数");
      } else if (
        Number(this.batchForm["min"]) > Number(this.batchForm["max"])
      ) {
        return message("error", "请确保序号由小到大");
      } else {
        this.sortCreated().then((res) => {
          message("success", `创建${res.success}个成功,${res.error}个失败`);
          this.$refs["batchForm"]["resetFields"]();
          this.$emit("getWorkTreeData");
          this.HouseVisible = false;
        });
      }
    }
  }
  // 循环创建
  async sortCreated() {
    let success = 0;
    let error = 0;
    for (
      var i = Number(this.batchForm["min"]);
      i <= Number(this.batchForm["max"]);
      i++
    ) {
      this.batchForm["serialNumber"] = i;
      this.batchForm["name"] = i + this.batchForm["serialNumberUnit"];
      await addHouseGroup(this.batchForm).then((res) => {
        if (res.data.code === 200) {
          success++;
        } else {
          error++;
        }
      });
    }
    return Promise.resolve({ success, error });
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
    if (this.type === "house") {
      if (data.type === "group") {
        this.selectId = data.id;
        if (this.device == "device") {
          if (data.subBuildings) {
            data.subBuildings.map((item) => {
              buildings.push(item.id);
            });
          }
          this.initFormHeader["params"]["buildings"] = buildings;
        } else {
          this.initFormHeader["params"]["buildingId"] = "";
          this.initFormHeader["params"]["storeyId"] = "";
          this.initFormHeader["params"]["groupId"] = data.id;
        }
        this["page"]["page"] = 1;
        this.initFormHeader["params"] = Object.assign(
          this.initFormHeader["params"],
          this.page
        );
        // return this.initFormHeader;
      } else if (data.type === "building") {
        this.selectId = data.id;
        if (this.device == "device") {
          buildings = [data.id];
          this.initFormHeader["params"]["buildings"] = buildings;
        } else {
          this.initFormHeader["params"]["buildingId"] = data.id;
          this.initFormHeader["params"]["storeyId"] = "";
          this.initFormHeader["params"]["groupId"] = "";
        }

        this["page"]["page"] = 1;
        this.initFormHeader["params"] = Object.assign(
          this.initFormHeader["params"],
          this.page
        );
        // return this.initFormHeader;
      } else {
        this.selectId = data.id;
        if (this.device == "device") {
          let storeys = [data.id];
          this.initFormHeader["params"]["storeys"] = storeys;
        } else {
          this.initFormHeader["params"]["storeyId"] = data.id;
          this.initFormHeader["params"]["buildingId"] = "";
          this.initFormHeader["params"]["groupId"] = "";
        }
      }
    } else if (this.type === "workGroup") {
      this["page"]["page"] = 1;
      this.initFormHeader["params"]["groupId"] = data.id;
      this.initFormHeader["params"] = Object.assign(
        this.initFormHeader["params"],
        this.page
      );
    } else if (this.type === "classBuild") {
      this["page"]["page"] = 1;
      this.initFormHeader["params"]["buildingId"] = data.id;
      this.initFormHeader["params"]["groupId"] = "";
      
    } else if (this.type === "gradeInfo") {
      this["page"]["page"] = 1;
      this.highlightStatus = true;
      if (data.type === "building") {
        this.highlightStatus = false;
      }
      if (data.name && data.name.includes("班")) {
        this.initFormHeader["params"]["grade"] = "";
        this.initFormHeader["params"]["className"] = data.name;
      } else {
        this.initFormHeader["params"]["className"] = "";
        this.initFormHeader["params"]["grade"] = data.name;
      }
    } else if (this.type === "gradeInfo_student") {
      this.highlightStatus = true;
      this["page"]["page"] = 1;
      if (data.type === "building") {
        this.highlightStatus = false;
      }
      this.initFormHeader["params"]["className"] = data.name;
    } else {
      this["page"]["page"] = 1;
      this.initFormHeader["params"]["authId"] = data.id;
      this.initFormHeader["params"] = Object.assign(
        this.initFormHeader["params"],
        this.page
      );
      // return this.initFormHeader;
    }
    if (data.type === '"building"') {
      this.$emit("handleBuildingId", data);
    }
    if (data.type === '"storey"') {
      this.$emit("handleBuildingId", data);
    }
    this.initFormHeader["params"] = Object.assign(
      this.initFormHeader["params"],
      this.page
    );  
    return this.initFormHeader;
  }
  //拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'
  allowDrop(draggingNode, dropNode, type) {
    if (draggingNode.level === dropNode.level) {
      if (draggingNode.parent.id === dropNode.parent.id) {
        // 向上拖拽 || 向下拖拽
        return type === "prev" || type === "next";
      }
    } else {
      // 不同级进行处理
      return false;
    }
  }
  // 判断节点能否被拖拽
  // allowDrag(draggingNode) {
  //   return draggingNode.data.name.indexOf("所有") === -1;
  // }
  // 拖拽成功完成时触发的事件
  handleDrop(draggingNode, dropNode, dropType, ev) {
    let arr: any = []; //存放哪个级别下面的childNodes
    let ids: any = []; //传参所有的id
    if (dropNode.level === 1) {
      //级别为1，所有childNodes
      arr = dropNode.store.root.childNodes;
    } else {
      // 其他层级
      arr = dropNode.parent.childNodes;
    }
    // 处理id
    arr.forEach((v: any) => {
      ids.push(v.data.id);
    });
    let callApi = updateOrderHouseGroup;
    let params = {
      ids: ids,
      type: this.type === "classBuild" ? "building" : dropNode.data.type,
    };
    let getTreeData = "getHouseTreeData";
    if (this.type === "workGroup") {
      callApi = updateOrderWorkerGroup;
      delete params.type;
      getTreeData = "fetchWorkGroup";
    }
    // 调用修改排序接口
    callApi(params).then((res) => {
      if (res.data.code === 200) {
        message("success", "操作成功");
        this.$emit(getTreeData);
      }
    });
  }

  /*** 删除序号单元 */
  deleteTag(tag, type) {
    deleteUnit(tag.id).then((res) => {
      if (res.data.code === 200) {
        this.fetchUnitList(type);
      }
    });
  }
  /**显示更多操作图标 */
  MouseNnter(val) {
    this.showMenu = val;
  }
  /*** 添加单元序号 */
  handleInputConfirm(type: string) {
    this.newTag = false;
    addUnit(this.newTagValue, type).then((res) => {
      if (res.data.code === 200) {
        this.fetchUnitList(type);
        this.newTagValue = "";
      }
    });
  }
  /*** 显示添加序号单元框*/
  showInput() {
    this.newTag = true;
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
        if (this.Tags.length > 0) {
          this.HouseForm["serialNumberUnit"] = this.Tags[0]["name"];
          this.batchForm["serialNumberUnit"] = this.Tags[0]["name"];
        }

        this.HouseForm["title"] = "添加子分组";
        this.HouseForm["parentId"] = treeData.data ? treeData.data.id : "";
        this.batchForm["parentId"] = treeData.data ? treeData.data.id : "";
        this.HouseVisible = true;
        this.activeName = "second";
        break;
      case "deleteGroup":
        this.$confirm(
          `此操作将永久删除${treeData.data.name}分组,删除后分组将不存在,请谨慎操作!`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            deleteHouseGroup(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                message("success", "删除成功");
                // this.$emit("getHouseTreeData");
                this.checkoutGroupId(this.TreeData, {}, "delete");
                this.HouseVisible = false;
              }
            });
          })
          .catch(() => {
            message("error", "已取消删除");
          });
        break;
      case "addBuilding":
        this.closeDialog();
        this.UnitForm["buildingGroupId"] = treeData.data.id;
        this.UnitForm["buildingGroupName"] = treeData.data.name;
        this.UnitForm["buildingType"] = 1;
        this.UnitForm["id"] = "";
        this.HouseUnitVisible = true;
        break;
      case "addClassBuilding":
        this.closeDialog();
        this.classForm["buildingType"] = 2;
        // this.classForm["buildingGroupId"] = treeData.data.id;
        // this.classForm["buildingGroupName"] = treeData.data.name;
        this.classForm["id"] = "";
        this.ClassVisible = true;
        break;
      case "updateClassBuilding":
        this.closeDialog();
        // this.classForm['storeyNum'] = treeData.data.storeyNum;
        // this.classForm['houseNum'] = treeData.data.houseNum;
        this.classForm["name"] = treeData.data.name;
        // this.classForm['storeyNum'] = treeData.data.storeyNum;
        // this.classForm["perRoomBeds"] = '0';
        // this.classForm["buildingType"] = '2';
        this.classForm["id"] = treeData.data.id;
        this.ClassVisible = true;
        break;
      case "updateGroup":
        this.activeName = "second";
        this.HouseVisible = true;
        this.HouseForm["title"] = "修改分组";
        this.HouseForm = Object.assign(this.HouseForm, treeData.data);
        break;
      case "updateBuilding":
        this.HouseUnitVisible = true;
        this.UnitForm = Object.assign(this.UnitForm, treeData.data);
        break;
      case "addRoleGroup":
        this.RoleVisible = true;
        this.RoleForm["id"] = "";
        break;
      case "addWorkGroup":
        this.HouseVisible = true;
        this.UnitForm["id"] = "";
        this.HouseForm["parentId"] = treeData.data ? treeData.data.id : "";
        this.batchForm["parentId"] = treeData.data ? treeData.data.id : "";
        break;
      case "updateWorkGroup":
        this.activeName = "second";
        this.HouseVisible = true;
        this.HouseForm["title"] = "修改分组";
        this.HouseForm = Object.assign(this.HouseForm, treeData.data);
        break;
      case "deleteWorkGroup":
        this.$confirm(
          `此操作将永久删除${treeData.data.name}分组,删除后分组将不存在,请谨慎操作!`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            deleteWorkGroup(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                message("success", "删除成功");
                // this.$emit("getHouseTreeData");
                this.checkoutGroupId(this.TreeData, {}, "delete");
                this.HouseVisible = false;
              }
            });
          })
          .catch(() => {
            message("error", "已取消删除");
          });
        break;
      case "updateRoleGroup":
        // getGroupInfoById(treeData.data.id).then(res => {
        //   if (res.data.code === 200) {
        //     this.RoleForm = Object.assign({}, res.data.data);
        //     this.bindDeviceList = res.data.data.devices;
        //   } else {
        //     message("error", "获取权限组信息失败");
        //   }
        // });
        // this.RoleVisible = true;
        break;
      case "deleteRoleGroup":
        this.$confirm(
          `此操作将永久删除${treeData.data.name}权限组,删除后权限组将不存在,请谨慎操作!`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            deleteRoleGroup(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                message("success", "删除成功");
                this.$emit("fetchRoleGroup");
              }
            });
          })
          .catch(() => {
            message("error", "已取消删除");
          });
        break;
      case "deleteBuilding":
        this.$confirm(
          `此操作将永久删除${treeData.data.name}宿舍楼,删除后宿舍楼将不存在,请谨慎操作!`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            deleteBuilding(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                message("success", "删除成功");
                this.checkoutGroupId(this.TreeData, {}, "delete");
              }
            });
          })
          .catch(() => {
            message("error", "已取消删除");
          });
        break;
      case "deleteClassBuilding":
        this.$confirm(
          `此操作将永久删除${treeData.data.name}教学楼,删除后楼宇将不存在,请谨慎操作!`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            deleteBuilding(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                message("success", "删除成功");
                this.checkoutGroupId(this.TreeData, {}, "delete");
                this.$emit("fetchData", this.initFormHeader);
              }
            });
          })
          .catch(() => {
            message("error", "已取消删除");
          });
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

// .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
//   background-color: #e6f1fc;
//   color: #409EFF;
//   border-right: 4px solid #409EFF;
//   .icon-gengduo {
//     color: #409EFF;
//   }
// }
</style>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
  color: white;
}
.content {
  width: 100%;
  height: calc(100vh - 51px);
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
