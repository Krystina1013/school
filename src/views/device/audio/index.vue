<template>
  <div class="app-container">
    <div class="components-container">
      <div class="rightContent">
        <el-row>
          <el-col :span="24">
            <action-header :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false" :filterStatus="false" :pageStatus="true" btnStatus="0">
              <div slot="houseNum">
                <div class="word-filter">
                  <span class="filter-name">设备名称:</span>
                  <el-input clearable placeholder="请输入需要查找的名称" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.name" size="small"></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">设备ID:</span>
                  <el-input clearable placeholder="请输入需要查找设备ID" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.deviceId" size="small"></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">状&nbsp;&nbsp;&nbsp;态:</span>&nbsp;&nbsp;
                  <el-select v-model="filterForm.status" placeholder="请选择" class="select-class" size="small">
                    <el-option key="1" label="在线" value="1"></el-option>
                    <el-option key="2" label="离线" value="2"></el-option>
                  </el-select>
                </div>
              </div>
            </action-header>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24" class="table-col">
            <el-table :data="tableData" stripe border highlight-current-row v-loading="showLoad" @selection-change="handleSelectionChange" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
               <el-table-column prop="deviceAddress" label="设备名称" align="center">
                <template slot-scope="scope">
                  <span class="showIconBtn" v-show="!scope.row.addrStatus" >
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'deviceAddress')?'':'transparent'}" @click="focusAddrInput(scope.row)"></i>
                    {{ scope.row.deviceAddress || "--" }}
                  </span>
                  <el-input :ref="scope.row.id + 'wk1'" size="mini" @blur="confirmUpdateAddr(scope.row)" v-model.trim="addressString" v-show="scope.row.addrStatus" :clearable="true" :maxlength="30" placeholder="输入设备位置"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="deviceId" label="设备ID" show-overflow-tooltip align="center"></el-table-column>
             
              <el-table-column label="设备状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">在线</span>
                  <span v-else-if="scope.row.status == 2">离线</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="lastOnlineTime" label="最近上线时间" align="center">
                <template slot-scope="scope">{{
                scope.row.lastOnlineTime || "--"
              }}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="添加时间" align="center">
                <template slot-scope="scope">{{
                scope.row.createTime || "--"
              }}</template>
              </el-table-column>
              <el-table-column prop="note" label="备注" align="center">
                <template slot-scope="scope">
                  <span class="showIconBtn" v-show="!scope.row.noteStatus" >
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'note')?'':'transparent'}" @click="focusNoteInput(scope.row)"></i>
                    {{ scope.row.note || "--" }}
                  </span>
                  <el-input :ref="scope.row.id + 'wk2'" size="mini" @blur="confirmUpdateNote(scope.row)" v-model.trim="noteString" v-show="scope.row.noteStatus" :clearable="true" :maxlength="200" placeholder="输入备注"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :page-size="page.limit" @current-change="pageChange" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { addBox, getAudioList, updateAudio } from "@/api/police.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: { ActionHeader },
})
export default class extends Vue {
  config: any = config;
  showLoad: boolean = false;
  filterForm: any = {
    name: "",
    deviceId: "",
    status: "",
  };
  deleteForm: object = {
    url: config.v4 + "/admin/voice-alert-device",
    method: "delete",
    data: [],
    message:
      "此操作将永久删除选中的视频盒子, 删除后视频盒子将不存在,请谨慎操作!",
  };
  addressString: string = "";
  noteString: string = "";
  showProperty: string = "";
  rowId: string = "";
  tableData: Array<object> = [];
  updateArray: Array<string> = ["noteStatus", "addrStatus"];
  isUpdate: boolean = false;
  ruleForm: any = {
    deviceId: "",
    name: "",
  };
  rules: object = {
    deviceId: [
      { required: true, message: "请输入设备mac地址", trigger: "blur" },
    ],
    name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  };
  load: boolean = false;
  rowLineId: string = "";
  pagination: any = {
    total: 0,
    page: 1,
    limit: 10,
  };
  created() {
    this["isPolice"] = true;
    this.getAudioList();
  }
  // 修改设备位置自动获取焦点
  focusAddrInput(row) {
    this.addressString = row.deviceAddress;
    row.addrStatus = true;
    this.$nextTick(() => {
      let input = this.$refs[row.id + "wk1"] as HTMLElement;
      input.focus();
    });
  }
  // 修改备注
  confirmUpdateAddr(row) {
    row.addrStatus = false;
    updateAudio({
      id: row.id,
      deviceAddress: this.addressString,
    })
      .then((res) => {
        row.addrStatus = false;
        if (res.data.code === 200) {
          this["message"]("success", "修改成功");
          this.addressString = "";
          this.fetchData(this.initForm);
        } else {
          this["message"]("error", res.data.message);
        }
      })
      .catch((eer) => {
        row.addrStatus = false;
      });
  }
  enterCellChange(row, column, cell, event) {
    this.showProperty = column.property;
    this.rowId = row.id;
  }
  leaveCellChange(row, column) {
    this.showProperty = "";
    this.rowId = "";
  }
  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row.noteStatus = true;
    this.$nextTick(() => {
      let input = this.$refs[row.id + "wk2"] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注
  confirmUpdateNote(row) {
    updateAudio({
      id: row.id,
      note: this.noteString,
    })
      .then((res) => {
        row.noteStatus = false;
        if (res.data.code === 200) {
          this["message"]("success", "修改成功");

          this.noteString = "";
          this.fetchData(this.initForm);
        } else {
          this["message"]("error", res.data.message);
        }
      })
      .catch((eer) => {
        row.noteStatus = false;
      });
  }
  fetchData(option: any) {
    // this.pagination.limit = parseInt(option.params.limit);
    this.page["page"] = parseInt(option.params.limit) || 10;
    this.page["page"] = option.params.page || 1;
    this.filterForm["name"] = option.params.name || "";
    // this.filterForm["deviceId"] = option.params.deviceId;
    this.getAudioList();
  }
  getAudioList() {
    let param = {
      ...this.filterForm,
      page: this.page["page"],
      limit: parseInt(this.pagination.limit),
    };
    this.showLoad = true;
    getAudioList(param)
      .then((res) => {
        this.tableData = res.data.data.records;
        this.tableData.forEach((ele) => {
          this.$set(ele, "noteStatus", false);
          this.$set(ele, "addrStatus", false);
          // ele['noteStatus'] = false;
          // ele['addrStatus'] = false;
        });
        this.page["total"] = res.data.data.total;
        this.showLoad = false;
      })
      .catch((err) => {
        this.showLoad = false;
      });
  }
  handleClose() {
    this.$refs["ruleForm"]["resetFields"]();
    this["dialogCreate"] = false;
    this.ruleForm = {
      deviceId: "",
      name: "",
    };
  }
  update(row) {
    this.rowLineId = row.id;
    this.ruleForm.name = row.name;
    this.ruleForm.deviceId = row.deviceId;
    this.isUpdate = true;
    this["dialogCreate"] = true;
  }
  // 表头添加小图标的render 事件
  renderHeader(h, { column }) {
    // h即为cerateElement的简写，具体可看vue官方文档
    return h("div", [
      h("span", column.label),
      h("i", {
        class: "el-icon-edit",
        style: "color:#409eff;margin-left:5px;",
      }),
    ]);
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100% - 15px);
}
.rightContent {
  height: calc(100vh - 80px);
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
</style>
