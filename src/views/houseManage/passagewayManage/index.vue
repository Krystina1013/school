<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <action-header :moreStatus="false" :filterStatus="false" :pageStatus="false" :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total">
                <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                  <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                    批量删除
                  </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>统计信息</el-dropdown-item>
                </el-dropdown-menu>
                <!-- <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">发布对象:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
          </div>-->
              </action-header>
            </el-col>
          </el-row>
          <el-table v-loading="showLoading" :data="list_data" stripe border highlight-current-row @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange" @selection-change="handleSelectionChange">
            <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>

            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column class="serial-num" prop="name" label="出入口名称" align="center" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                <div style="height: 40px; line-height: 40px">
                  {{ row.name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="note" align="center" label="备注" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span class="showIconBtn" v-show="!scope.row.noteStatus">
                  <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'note')?'':'transparent'}" @click="focusNoteInput(scope.row)"></i>
                  {{ scope.row.note || "--" }}
                </span>
                <el-input :ref="scope.row.id" size="mini" @blur="confirmUpdateNote(scope.row)" v-model.trim="noteString" v-show="scope.row.noteStatus" :clearable="true" :maxlength="200" placeholder="输入备注"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="150" align="center" v-if="globalUpdateStatus">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="editFrom(scope.row)">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 添加出入口 -->
    <el-dialog class="newDialog" :title="isUpdate ? '编辑' : '添加'" :visible.sync="dialogCreate" width="500px" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="createForm" :rules="rules" ref="dataForm" label-width="110px" style="margin-right: 40px">
        <el-form-item label="出入口名称:" prop="name" :show-message="showMessage" :error="errorMessage.name">
          <el-input v-model.trim="createForm.name" placeholder="输入出入口名称" :maxlength="10" clearable @input="constraintLength(createForm.name, '10')" @keyup.enter.native="addPassageway"></el-input>
        </el-form-item>
        <el-form-item label="备注信息:" prop="note" :show-message="showMessage" :error="errorMessage.note">
          <el-input type="textarea" :rows="9" v-model.trim="createForm.note" :maxlength="200" placeholder="输入备注信息" clearable @input="constraintLength(createForm.note, '200')" @keyup.enter.native="addPassageway"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="addPassageway">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { creatPassageway, editPassageway } from "@/api/houseApi.ts";
import mixin from "@/config/minxins";
import config from "@/api/config";
const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
  },
})
export default class InformIssue extends Vue {
  filterForm: object = { tag: "pagination" }; //根据关键字查询
  selectVal: Array<object> = []; //选中的表格数据
  private isUpdate: Boolean = false;
  // 添加dialog弹框信息
  private createForm: Object = {
    name: "",
    note: "",
    id: "",
  };

  private rules: Object = {
    //添加验证
    name: [{ required: true, message: "请输入出入口名称", trigger: "blur" }],
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "",
    note: "",
  };

  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    // 修改dialog弹框信息
    name: "",
    note: "",
    id: "",
  };
  updateArray: Array<string> = ["noteStatus"];
  private noteRewrite: String = ""; //保存未改变的note

  initForm: object = {
    //获取车辆列表url
    url: config.v1 + "/admin/enter-exit",
    method: "get",
  };

  deleteForm: Object = {
    //单个或批量删除
    url: config.v1 + "/admin/enter-exit",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的出入口,删除后出入口将影响通行,请谨慎操作!`,
  };
  rowId: string = "";
  showProperty: string = "";
  noteString: string = ""; // 修改的备注

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = val;
  }

  addPassageway() {
    /**@description 添加出入口 */
    this.$refs["dataForm"]["validate"]((valid) => {
      if (valid) {
        var form = { ...this.createForm };
        if (form["id"]) {
          for (let key in form) {
            if (form[key] === "") {
              delete form[key];
            }
          }
          editPassageway(form).then(() => {
            this.handleClose();
            this["fetchData"](this.initForm);
            this["message"]("success", `修改出入口成功!`);
          });
        } else {
          creatPassageway(form).then((res) => {
            this.handleClose();
            this["fetchData"](this.initForm);
            this["message"]("success", "添加出入口成功!");
          });
        }
      }
    });
  }

  editFrom(item) {
    /**@description 修改状态 */
    for (const key in this.editForm) {
      this.createForm[key] = item[key];
    }
    this.isUpdate = true;
    this["dialogCreate"] = true;
  }

  focusNoteInput(row) {
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
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

  confirmUpdateNote(row) {
    editPassageway({
      id: row.id,
      note: this.noteString,
    }).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        row.noteStatus = false;
        this.noteString = "";
        this.fetchData(this.initForm);
      } else {
        row.noteStatus = false;
        this["message"]("error", res.data.message);
      }
    });
  }

  handleClose() {
    /** @description 关闭添加/修改dialog */
    this["dialogCreate"] = false;
    this.createForm = {
      name: "",
      note: "",
      id: "",
    };
    this.isUpdate = false;
    this.dialogEdit = false; //修改dialog
    this.editForm = {
      name: "",
      id: "",
      note: "",
    };
    this.$refs["dataForm"]["resetFields"]();
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
td {
  padding: 6px 0px;
}
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.capture-img {
  width: 60px;
}
</style>
