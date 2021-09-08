<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <data-tree :page="page" type="gradeInfo" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="false" @fetchData="fetchData" @getClassTreeData="getClassTreeData" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <action-header :moreStatus="false" :filterStatus="true" :pageStatus="true" :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total">
              
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">班级名称:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" maxlength="30" v-model.trim="filterForm.className" placeholder="输入班级名称" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">年级:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.grade" placeholder="输入年级" maxlength="30" size="small"></el-input>
                    </div>
                  </div>
                </action-header>
              </el-col>
            </el-row>
            <el-table v-loading="showLoading" :data="list_data" stripe border highlight-current-row @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange">

              <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column class="serial-num" prop="className" label="班级名称" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-button @click="showGradeDetail(scope.row)" type="text">
                    {{ scope.row.className }}
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column prop="grade" align="center" label="年级" :show-overflow-tooltip="true">
                <!-- <template slot-scope="{ row }">
               {{row.grade}}
              </template> -->
              </el-table-column>
              <el-table-column prop="inSchoolDate" align="center" label="学期" :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  {{ row.inSchoolDate + "入学" }}
                </template>
              </el-table-column>
              <el-table-column prop="locationName" align="center" label="关联教室" :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  {{ row.myRoom.locationName }}
                </template>
              </el-table-column>

              <el-table-column label="操作" width="120" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="openDialogUpdate(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="delteClass(scope.row )">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :current-page="page.page" :page-size="page.limit" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
         
          </div>
        </template>
      </split-pane>
    </div>
    <!-- 添加/编辑班级 -->
    <el-dialog class="newDialog" :title="createForm.id ? '编辑' : '添加'" :visible.sync="dialogCreate" width="550px" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="createForm" :rules="rules" ref="dataForm" label-width="110px" style="margin-right: 40px">
        <el-form-item label="学段:" prop="schoolType">
          <el-select class="select-class" size="small" @change="gradeChange" style="width: 250px" v-model="createForm.schoolType" placeholder="请选择学段">
            <el-option label="幼儿园" value="幼儿园"></el-option>
            <el-option label="小学" value="小学"></el-option>
            <el-option label="初中" value="初中"></el-option>
            <el-option label="高中" value="高中"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期:" prop="inSchoolDate">
          <!-- <el-input
            v-model="createForm.time"
            placeholder="输入出入口名称"
            :maxlength="10"
            clearable
          ></el-input> -->
          <el-date-picker :clearable="false" style="width: 250px" type="year" value-format="yyyy" :disabled="yearSelect" @change="yearPicker" :picker-options="yearOptions" v-model="createForm.inSchoolDate" placeholder="选择年份"></el-date-picker>
          入学
        </el-form-item>
        <el-form-item label="年级:" prop="grade">
          <el-input disabled style="width: 250px" v-model="createForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="班级编号:" prop="classNo">
          <el-input :clearable="true" style="width: 250px" maxlength="4" @input="inputChange" v-model="createForm.classNo"></el-input>
          班
        </el-form-item>
        <el-form-item label="关联教室:" prop="roomId">
          <el-button size="mini" type="primary" @click="dialogChooseClass.visible = true" style="margin-left: 10px">点击选择</el-button>
        </el-form-item>
        <el-form-item label="已选教室:" v-if="
            dialogChooseClass.selectedRoom[0] &&
            dialogChooseClass.selectedRoom[0].locationName
          ">
          <p>
            {{ dialogChooseClass.selectedRoom[0].locationName }}
          </p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="addGrade">确 定</el-button>
      </span>
    </el-dialog>

    <!--班级详情-->
    <el-dialog class="newDialog" :close-on-click-modal="false" width="500px" title="班级详情" :visible.sync="gradeDetailShow">
      <el-row :gutter="0">
        <el-col :span="24">
          <div class="commonRow ml-50">
            <div class="label">班级名称：</div>
            <div class="value" :title="gradeDetail.classNo">
              {{ gradeDetail.className }}
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="commonRow ml-50">
            <div class="label">年级：</div>
            <div class="value" :title="gradeDetail.grade">
              {{ gradeDetail.grade }}
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="commonRow ml-50">
            <div class="label">学期：</div>
            <div class="value" :title="gradeDetail.inSchoolDate">
              {{ gradeDetail.inSchoolDate }} 入学
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="commonRow ml-50">
            <div class="label">已选教室：</div>
            <div class="value" :title="gradeDetail.myRoom.locationName" v-if="gradeDetail.myRoom && gradeDetail.myRoom.locationName">
              {{ gradeDetail.myRoom.locationName }}
            </div>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top: 15px">
          <div >
            <el-button size="small" @click="openDialogUpdate(gradeDetail)" type="primary" style="margin-left: 44%">编辑</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <DialogChooseClass v-if="dialogChooseClass.visible" @selectRoom="handleSelectRoom"></DialogChooseClass>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { creatClass, editClass, getclassTree } from "@/api/houseApi";
import mixin from "@/config/minxins";
import config from "@/api/config";
import { message } from "@/utils";
import Video from "../security/components/DialogPersonDetail/Video.vue";
import { tr } from "date-fns/locale";
import { MessageBox } from "element-ui";
import _axios from "@/plugins/axios.js";
import splitPane from "vue-splitpane";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DialogChooseClass = () => import("./components/DialogChooseClass.vue");

const DataTree = () => import("@/components/DataTree.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DialogChooseClass,
    DataTree,
    splitPane,
  },
})
export default class gradeInfo extends Vue {
  selectVal: Array<object> = []; //选中的表格数据
  filterForm: object = {
    className: "",
    grade: "",
    status: "",
  }; //根据关键字查询
  yearOptions: object = {
    disabledDate: (val) => {
      return val.getFullYear() > new Date().getFullYear();
    },
  };
  TreeData: Array<Object> = []; // 树形结构数据
  private rowSpan: number = 12;
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  // 添加dialog弹框信息
  private createForm: Object = {
    schoolType: "",
    inSchoolDate: "",
    grade: "",
    classNo: "",
    id: "",
    roomId: "",
  };

  private rules: Object = {
    //添加验证
    schoolType: [{ required: true, message: "请选择学段", trigger: "change" }],
    inSchoolDate: [
      { required: true, message: "请选择入学时间", trigger: "change" },
    ],
    grade: [{ required: true, message: "年级不能为空", trigger: "change" }],
    classNo: [{ required: true, message: "请输入班级编号", trigger: "blur" }],
    roomId: [{ required: true, message: "请选择关联教室", trigger: "change" }],
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "",
    note: "",
  };

  private dialogEdit: Boolean = false; // 修改弹出表单
  // private editForm: Object = {
  //   // 修改dialog弹框信息
  //   name: "",
  //   note: "",
  //   id: ""
  // };
  updateArray: Array<string> = ["noteStatus"];
  private noteRewrite: String = ""; //保存未改变的note

  initForm: object = {
    //获取班级列表
    url: config.v1 + "/admin/class",
    method: "get",
  };
  yearSelect: boolean = true;
  deleteForm: Object = {
    //单个或批量删除
    url: config.v1 + "/admin/class",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的班级,请谨慎操作!`,
  };
  dialogChooseClass: any = {
    //教室选择
    visible: false,
    selectedRoom: [{}],
  };

  gradeDetailShow: boolean = false; //详情弹窗
  gradeDetail: Object = {};
  propsOption: object = {
    children: "subWorkerGroups",
    label: "name",
    key: "id",
  };
  // 删除班级
  delteClass(row) {
    MessageBox.confirm(
      `此操作将永久删除选中的班级,请谨慎操作!是否继续?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        _axios({
          url: config.v1 + "/admin/class",
          method: "delete",
          data: [row.id],
        }).then((res) => {
          if (res.data.code === 200) {
            this.deleteForm["data"] = [];
            message("success", "删除成功");
            this.fetchData(this.initForm);
            this.getClassTreeData();
          } else {
            this.deleteForm["data"] = [];
          }
        });
      })
      .catch(() => {
        // this.deleteForm["data"] = [];
        // this.fetchData(this.initForm);
        this.deleteForm["data"] = [];
        message("error", "已取消删除");
      });
  }
  handleSelectRoom(item) {
    //选择教室回调
    this.createForm["roomId"] = item[0].id;
    this.dialogChooseClass.selectedRoom = item;
  }
  gradeChange() {
    let typeStr = this.createForm["schoolType"];
    // let value = this.createForm['inSchoolDate'];
    // if(this.createForm['schoolType'] && value) {
    //   let gradeArr = ['一','二','三','四','五','六']

    //   let gradeStr = Number(new Date().getFullYear()) - Number(value);
    //   if (gradeStr < 0 || (typeStr === '初中' &&  gradeStr > 2) ||  (typeStr === '小学' &&  gradeStr > 5)) {
    //     this.createForm['grade'] = ''
    //     message('error','班级信息不正确')
    //     return;
    //   }
    //   this.createForm['grade'] = typeStr+ gradeArr[gradeStr] + '年级';
    // }
    if (typeStr) {
      this.yearSelect = false;
      this.createForm["grade"] = "";
      this.createForm["inSchoolDate"] = "";
      if (typeStr === "小学") {
        this.yearOptions = {
          disabledDate: (val) => {
            return (
              val.getFullYear() > new Date().getFullYear() ||
              val.getFullYear() < new Date().getFullYear() - 5
            );
          },
        };
      } else {
        this.yearOptions = {
          disabledDate: (val) => {
            return (
              val.getFullYear() > new Date().getFullYear() ||
              val.getFullYear() < new Date().getFullYear() - 2
            );
          },
        };
      }
    } else {
      this.yearSelect = true;
    }
  }
  yearPicker(value) {
    // 学期计算
    if (Number(new Date().getFullYear()) < Number(value)) {
      value = "";
      return;
    }
    if (this.createForm["schoolType"] && value) {
      let gradeArr = ["一", "二", "三", "四", "五", "六"];
      let yeyArr = ["小班", "中班", "大班"];
      let typeStr = this.createForm["schoolType"];
      let gradeStr = Number(new Date().getFullYear()) - Number(value);
      if (
        gradeStr < 0 ||
        (typeStr === "初中" && gradeStr > 2) ||
        (typeStr === "小学" && gradeStr > 5)
      ) {
        this.createForm["grade"] = "";
        message("error", "班级信息不正确");
        return;
      }
      if (typeStr === "幼儿园") {
        this.createForm["grade"] = typeStr + yeyArr[gradeStr];
        return;
      }
      this.createForm["grade"] = typeStr + gradeArr[gradeStr] + "年级";
    }
  }
  resize() {}
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
  created() {
    this.getClassTreeData();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  inputChange() {
    this.createForm["classNo"] = this.createForm["classNo"].replace(
      /[^\d]/g,
      ""
    );
  }
  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = val;
  }
  // 获取班级结构
  getClassTreeData() {
    getclassTree().then((res: Object) => {
      this.TreeData = this.iterator_self(res["data"]["data"]);
    });
  }
  // 递归需要的tree数据
  iterator_self(arr) {
    let obj: any = [];
    for (let key in arr) {
      const name = key;
      let subBuildings: any = [];
      if (JSON.stringify(arr[key]) != "{}") {
        if (arr[key] instanceof Array != true) {
          subBuildings = this.iterator_self(arr[key]);
        }
      }
      if (JSON.stringify(arr[key]) != "{}") {
        if (arr[key] instanceof Array) {
          for (let v = 0; v < arr[key].length; v++) {
            subBuildings.push({ name: arr[key][v] });
          }
        }
        obj.push({
          name,
          subBuildings,
        });
      }
    }
    return obj;
  }
  addGrade() {
    /**@description 添加班级 */
    this.$refs["dataForm"]["validate"]((valid) => {
      if (valid) {
        var form = { ...this.createForm };
        if (form["id"]) {
          editClass(form).then((res) => {
            this.handleClose();
            if (res && res.data.code == 200) {
              this["fetchData"](this.initForm);
              this.getClassTreeData();
              this["message"]("success", "修改班级成功!");
            }
          });
        } else {
          creatClass(form).then((res) => {
            this.handleClose();
            if (res && res.data.code == 200) {
              this["fetchData"](this.initForm);
              this.getClassTreeData();
              this["message"]("success", "添加班级成功!");
            }
          });
        }
      }
    });
  }

  editFrom(item) {
    /**@description 修改状态 */
    for (const key in this.createForm) {
      this.createForm[key] = item[key];
    }
    this.createForm["roomId"] = item.myRoom ? item.myRoom.id : "";
    this.dialogChooseClass.selectedRoom = item.myRoom ? [item.myRoom] : [];
    this.dialogEdit = true;
  }

  showGradeDetail(row) {
    this.gradeDetailShow = true;
    this.gradeDetail = row;
  }
  openDialogUpdate(item) {
    this.gradeDetailShow = false;
    this["dialogCreate"] = true;
    this.editFrom(item);
  }

  // modifPassageway() {
  //   const form = { ...this.editForm };
  //   for (let key in form) {
  //     if (form[key] === "") {
  //       delete form[key];
  //     }
  //   }
  //   editPassageway(form).then(() => {
  //     this.handleClose();
  //     this["fetchData"](this.initForm);
  //     this["message"]("success", `修改出入口${this.editForm["name"]}成功!`);
  //   });
  // }

  // editNote(row) {
  //   /**@description 点击备注*/
  //   this.noteRewrite = row.note;
  //   this.editForm["note"] = row.note;
  //   this.editForm["id"] = row.id;
  //   row.noteStatus = !row.noteStatus;
  //   this.$nextTick(() => {
  //     const input = this.$refs[row.id] as HTMLElement;
  //     input.focus();
  //   });
  // }

  // 修改备注离开输入框
  // noteBlur(row) {
  //   row.noteStatus = false;
  //   // if (this.noteRewrite !== this.editForm["note"]) {
  //   this.confirmUpdateNote(row);
  //   // }
  // }

  // confirmUpdateNote(item) {
  //   /**@description 修改备注 */
  //   const form = { note: this.editForm["note"], id: item.id };
  //   if (item["note"] !== form["note"]) {
  //     editPassageway(form)
  //       .then(() => {
  //         this["message"](
  //           "success",
  //           `修改出入口${item["name"]}的备注信息成功!`
  //         );
  //         this["fetchData"](this.initForm);
  //         item.noteStatus = false;
  //       })
  //       .catch(() => {
  //         item.noteStatus = false;
  //       });
  //   }
  // }

  handleClose() {
    /** @description 关闭添加/修改dialog */
    this["dialogCreate"] = false;
    this.createForm = {
      schoolType: "",
      classNo: "",
      grade: "",
      inSchoolDate: "",
      note: "",
      roomId: "",
      id: "",
    };
    this.dialogEdit = false; //修改dialog
    this.dialogChooseClass = {
      visible: false,
      selectedRoom: [],
    };
    this.$refs["dataForm"]["resetFields"]();
  }
}
</script>

<style lang="scss" scoped>
td {
  padding: 6px 0px;
}
.main {
  display: flex;
  .rightContent {
    height: 65vh;
    flex: 1;
    position: relative;
  }
}
.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
}
.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}

.capture-img {
  width: 60px;
}

.commonRow {
  overflow: hidden;
  margin-bottom: 30px;
  .label {
    float: left;
    margin-left: 30px;
  }
  .value {
    float: left;
  }
}
</style>
