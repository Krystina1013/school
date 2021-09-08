<template>
  <div class="app-container" v-loading='detailLoading'>
    <el-page-header @back="goBack" :content="title">
    </el-page-header>
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-form class="owner" :model="Form" :rules="rules" ref="Forms" @submit.native.prevent label-width="100px" style="margin-right: 40px">
            <el-form-item style="margin-bottom: 16px" label="发布对象:" required>
              <el-radio-group v-model="Form.type" @change="radioChange">
                <div v-for="item in radioArr" :key="item.value" style="margin:10px;">
                  <el-radio :label="item.value">{{item.label}}</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="`选择${selectTitle}:`" required v-show="(selectTitle=='教师'||selectTitle=='自定义')&&selectTitle!='全部'">
              <el-radio-group v-if="selectTitle=='教师'" v-model="Form.teacherSendType" @change="titleChange">
                <el-radio :label="'0'" style="margin:10px;">按班级</el-radio>
                <el-radio :label="'1'" style="margin:10px;">按任课组</el-radio>
              </el-radio-group>
              <el-tree :data="TreeDataClass" ref='classTree' :default-checked-keys="bjData" v-show="Form.teacherSendType =='0' && Form.type == '0'" :props="defaultPropsClass" :default-expand-all='false' style="width:300px;" show-checkbox node-key="id" highlight-current>
              </el-tree>
              <el-tree :data="TreeDataRk" ref='rkTree' :default-checked-keys="rkData" v-show="Form.teacherSendType =='1' && Form.type == '0'" :props="defaultProps" :default-expand-all='false' style="width:300px;" show-checkbox node-key="id" highlight-current>
              </el-tree>
              <el-button v-if="Form.type == '3'" size="small" @click="getTableData1">点击选择</el-button> <span v-if="Form.type == '3' && this.zdyData.length>0" style="margin-left:10px;color:#606266">已选{{this.zdyData.length}}人</span>
            </el-form-item>
            <el-form-item :label="`选择${selectTitle}:`" required v-show="selectTitle=='职工'">
              <el-tree ref="zgTree" :data="TreeDataWork" :default-checked-keys="zgData" :props="zgDefaultProps" show-checkbox :default-expand-all='false' node-key="id" style="width:300px;">
              </el-tree>
            </el-form-item>
            <el-form-item :label="`选择${selectTitle}:`" required v-show="selectTitle=='家长'">
              <el-tree :data="TreeDataClass" :props="defaultPropsClass" show-checkbox :default-checked-keys="jzData" :default-expand-all='false' node-key="id" style="width:300px;" ref="jzTree">
              </el-tree>
            </el-form-item>
            <el-form-item label="标题:" prop="title">
              <el-input clearable maxlength="60" v-model.trim="Form.title" placeholder="输入标题"></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 16px" label="内容：" prop="content">
              <tinymce v-model.trim="Form.content" @imageChanage="imageChanage" />
            </el-form-item>
          </el-form>
          <div class="dfooter">
            <el-button size="small" type="primary" :loading="btnLoading" @click="addUserConfirm(1)">发 布</el-button>
            <el-button size="small" type="primary" :disabled='btnLoading' plain @click="addUserConfirm(2)">定时发布</el-button>
            <el-button size="small" type="primary" :disabled='btnLoading' :loading="caogaoLoading" @click="addUserConfirm(0)" plain>保存为草稿</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 定时发布 -->
    <el-dialog :close-on-click-modal="false" width="480px" title="定时发布" :visible.sync="timeDetail">
      <el-date-picker style="width:100%;margin-top: 10px;" :picker-options="pickerOptions0" @change="timeChange" v-model="dateTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" :loading='timeLoading' @click="timeDetailSure">确 定</el-button>
        <el-button size="small" @click="timeDetail=false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 自定义 -->
    <DialogChoosePerson :multiple='true' v-if="dialogChoosePerson.visible" @selectRoom="handleSelectRoom"></DialogChoosePerson>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { teacherGroups } from "@/api/peopleApi";
import { getWorkGroup, getclassTreeFormat } from "@/api/houseApi";
import { addMessage, getMessage, PutMessage } from "@/api/alertSets";
const ActionHeader = () => import("@/components/ActionHeader.vue");
import Tinymce from "@/components/tinymce/index.vue";
const DialogChoosePerson = () => import("./DialogChoosePerson.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    Tinymce,
    DialogChoosePerson,
  },
})
export default class alertSets extends Vue {
  config: any = config;
  env: string = process.env.NODE_ENV;
  dateTime: string = "";
  title: string = "";
  selectTitle: string = "全部";
  sunSelectTitle: string = "";
  btnLoading: boolean = false;
  timeLoading: boolean = false;
  timeDetail: boolean = false;
  caogaoLoading: boolean = false;
  detailLoading: boolean = false;
  TreeData: any = []; // 其他树形结构数据
  TreeDataClass: any = []; // 班级
  TreeDataRk: any = []; // 任课
  TreeDataJz: any = []; // 家长
  TreeDataWork: any = []; // 职工
  zdyData: any = []; // 自定义人员arr
  zgData: any = []; // 职工树默认
  jzData: any = []; // 家长树默认
  bjData: any = []; // 班级教师树默认
  rkData: any = []; // 任课老师树默认
  rules: any = {
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "change" }],
  };
  radioArr: Array<object> = [
    { label: "全部", value: "4" },
    { label: "教师", value: "0" },
    { label: "职工", value: "1" },
    { label: "家长", value: "2" },
    { label: "自定义", value: "3" },
  ];
  Form: object = {
    type: "4",
    note: "",
    teacherSendType: "0",
    ids: [],
    file: [],
  };
  defaultProps: object = {
    label: "groupName",
    key: "id",
    children: "subBuildings",
  };
  defaultPropsClass: object = {
    label: "className",
    key: "id",
    children: "children",
  };
  zgDefaultProps: object = {
    label: "name",
    key: "id",
    children: "subWorkerGroups",
  };
  initClassForm: object = {
    //获取班级列表
    url: config.v1 + "/admin/class",
    method: "get",
  };
  // 时间
  pickerOptions0: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
    },
  };
  dialogChoosePerson: Object = {
    visible: false,
    selectedRoom: [],
  };
  handleSelectRoom(item) {
    console.log("choose111",item);
    //自定义回调
    this.zdyData = [];
    this.dialogChoosePerson["selectedRoom"] = [...item];
    item.forEach((v: any) => {
      if (v.type == 1) {
        // 家长
        this.zdyData.push({
          type: 1,
          userid: v.relativeUserId,
        });
      } else {
        this.zdyData.push({
          type: v.type,
          userid: v.scenceUserId,
        });
      }
    });
    console.log("choose", this.dialogChoosePerson["selectedRoom"]);
  }
  created() {
    let type = window.sessionStorage.getItem("type");
    this.Form["file"] = [];
    this.get_rkzTreeList();
    this.getClassTreeData();
    this.getWorkTreeData();
    setTimeout(() => {
      if (type == "1") {
        this.title = "新建通知";
      } else {
        this.title = "修改通知";
        let id = window.sessionStorage.getItem("issueId");
        this.getDetail(id);
      }
    }, 300);
  }
  getDetail(id) {
    this.detailLoading = true;
    getMessage({ id: id })
      .then((res) => {
        this.detailLoading = false;
        if (res.data.code == 200) {
          // 成功
          let data = res.data.data;
          this.Form = { ...data };
          this.radioArr.map((item: any) => {
            if (item.value == this.Form["type"]) {
              this.selectTitle = item.label;
            }
          });
          if (this.Form["type"] == 3) {
            // 自定义
            let zdyData = this.Form["customList"];
            this.zdyData = [];
            if (zdyData.relative && zdyData.relative.length > 0) {
              zdyData.relative.forEach((v: any) => {
                this.zdyData.push({
                  type: 1,
                  userid: v.id,
                  relativeUserId: v.id,
                  relativeName: v.name,
                  relativePhone: v.phone,
                });
              });
            }
            if (zdyData.teacher && zdyData.teacher.length > 0) {
              zdyData.teacher.forEach((v: any) => {
                this.zdyData.push({
                  type: 2,
                  userid: v.id,
                  scenceUserId: v.id,
                  name: v.name,
                  phone: v.phone,
                });
              });
            }
            if (zdyData.worker && zdyData.worker.length > 0) {
              zdyData.worker.forEach((v: any) => {
                this.zdyData.push({
                  type: 3,
                  userid: v.id,
                  scenceUserId: v.id,
                  name: v.name,
                  phone: v.phone,
                });
              });
            }
            this.dialogChoosePerson["selectedRoom"] = [...this.zdyData];
          } else if (this.Form["type"] == 0) {
            //教师
            if (this.Form["teacherSendType"] == 0) {
              // 班级
              this.bjData = [...this.Form["classOrGroupIds"]];
            } else if (this.Form["teacherSendType"] == 1) {
              //任课组
              this.rkData = [...this.Form["classOrGroupIds"]];
            }
          } else if (this.Form["type"] == 1) {
            //职工
            this.zgData = [...this.Form["classOrGroupIds"]];
          } else if (this.Form["type"] == 2) {
            //家长
            this.jzData = [...this.Form["classOrGroupIds"]];
          }
        }
      })
      .catch((err) => {
        this.detailLoading = false;
        this.$message.error(err.message);
      });
  }
  goBack() {
    this.$router.push("/alertSets/advices");
  }
  imageChanage(obj) {
    this.Form["file"] = this.Form["file"] || [];
    this.Form["file"].push(obj);
  }
  addUserConfirm(type) {
    this.$refs["Forms"]["validate"]((valid) => {
      if (!valid) {
        return;
      }
      if (type == 2) {
        this.timeDetail = true;
        return;
      }
      this.Form["ids"] = [];
      if (this.Form["type"] !== "") {
        switch (this.Form["type"]) {
          case "0": // 教师
            if (this.Form["teacherSendType"] == 0) {
              // 班级
              let data = this.$refs["classTree"]["getCheckedKeys"](true);
              if (data.length === 0) {
                this["message"]("error", "请选择教师");
                return;
              }
              this.Form["ids"] = [].concat(data);
            } else if (this.Form["teacherSendType"] == 1) {
              // 任课组
              let data = this.$refs["rkTree"]["getCheckedKeys"](true);
              if (data.length === 0) {
                this["message"]("error", "请选择教师");
                return;
              }
              this.Form["ids"] = [].concat(data);
            }
            break;
          case "1": //职工
            let data1 = this.$refs["zgTree"]["getCheckedKeys"](true);
            if (data1.length === 0) {
              this["message"]("error", "请选择职工");
              return;
            }
            this.Form["ids"] = [].concat(data1);
            break;
          case "2": //家长
            let data2 = this.$refs["jzTree"]["getCheckedKeys"](true);
            if (data2.length === 0) {
              this["message"]("error", "请选择家长");
              return;
            }
            this.Form["ids"] = [].concat(data2);
            break;
          case "3": //自定义
            if (this.zdyData.length === 0) {
              this["message"]("error", "请选择自定义发布对象");
              return;
            }
            const data3: any[] = [];
            this.zdyData.map((item: any) => {
              data3.push(item["userid"]);
            });
            this.Form["ids"] = ([] as any).concat(data3);
            break;
          default:
            break;
        }
      }
      if (type == 0) {
        this.caogaoLoading = true;
      } else {
        this.btnLoading = true;
      }
      let params = { ...this.Form };
      params["status"] = type;
      params["targetTime"] = "";

      if (this.title == "修改通知") {
        PutMessage(params)
          .then((res) => {
            if (type == 0) {
              this.caogaoLoading = false;
            } else {
              this.btnLoading = false;
            }
            if (res.data.code == 200) {
              if (type == 0) {
                this["message"]("success", "保存成功！");
              } else {
                this["message"]("success", "发布成功！");
              }
              setTimeout(() => {
                this.goBack();
              }, 1000);
            }
          })
          .catch((err) => {
            this.btnLoading = false;
            this.caogaoLoading = false;
          });
      } else {
        addMessage(params)
          .then((res) => {
            if (type == 0) {
              this.caogaoLoading = false;
            } else {
              this.btnLoading = false;
            }
            if (res.data.code == 200) {
              if (type == 0) {
                this["message"]("success", "保存成功！");
              } else {
                this["message"]("success", "发布成功！");
              }
              setTimeout(() => {
                this.goBack();
              }, 1000);
            }
          })
          .catch((err) => {
            this.btnLoading = false;
            this.caogaoLoading = false;
          });
      }
    });
  }
  rkCheckChange(data, checked, indeterminate) {
    if (checked) {
      this.Form["ids"].push(data.id);
    }
  }

  handlezgCheckChange(data, checked) {
    if (checked) {
      this.iterator_zgSelf(data, checked);
    } else {
      this.iterator_zgSelf(data, checked);
    }
  }
  // 递归处理职工需要的id数据
  iterator_zgSelf(arr, checked) {
    if (arr instanceof Array) {
      for (let key = 0; key < arr.length; key++) {
        if (arr[key].subWorkerGroups.length != 0) {
          for (let v = 0; v < arr[key].length; v++) {
            return this.iterator_zgSelf(arr[key].subWorkerGroups, checked);
          }
        } else {
          if (checked) {
            this.Form["ids"].push(arr[key].id);
          } else {
            var index = this.Form["ids"].indexOf(arr[key].id);
            if (index > -1) {
              this.Form["ids"].splice(index, 1);
            }
          }
        }
      }
    } else if (arr.subWorkerGroups.length != 0) {
      if (checked) {
        this.Form["ids"].push(arr.id);
      } else {
        var index = this.Form["ids"].indexOf(arr.id);
        if (index > -1) {
          this.Form["ids"].splice(index, 1);
        }
      }
      return this.iterator_zgSelf(arr.subWorkerGroups, checked);
    } else {
      if (checked) {
        this.Form["ids"].push(arr.id);
      } else {
        var index = this.Form["ids"].indexOf(arr.id);
        if (index > -1) {
          this.Form["ids"].splice(index, 1);
        }
      }
    }
  }
  radioChange(val) {
    this.radioArr.forEach((v: any) => {
      if (val == v.value) {
        this.selectTitle = v.label;
      }
    });
    this.Form["ids"] = [];
    if (val == "0") {
      this.Form["teacherSendType"] = "0";
    } else {
      this.Form["teacherSendType"] = null;
    }
  }
  titleChange(val) {
    this.sunSelectTitle = val;
    this.Form["ids"] = [];
  }
  getTableData1() {
    this.dialogChoosePerson["visible"] = true;
  }
  // 任课组
  async get_rkzTreeList() {
    this.TreeDataRk = [];
    let { data } = await teacherGroups();
    this.TreeDataRk = data.data;
  }
  // 获取房屋结构
  getWorkTreeData() {
    getWorkGroup().then((res: Object) => {
      this.$nextTick(() => {
        this.TreeDataWork = res["data"]["data"];
      });
    });
  }
  // 获取班级结构
  getClassTreeData() {
    this.TreeDataClass = [];
    getclassTreeFormat().then((res: Object) => {
      let data = res["data"]["data"];
      this.$nextTick(() => {
        this.TreeDataClass = this.iterator_self(data);
      });
    });
  }
  // 班级数据
  iterator_self(arr) {
    let schoolArr: any = [];
    arr.forEach((item) => {
      let gradeArr: any = [];
      item.forEach((classItem) => {
        item["className"] = classItem["className"];
        item["children"] = [];
        if (gradeArr.indexOf(classItem["grade"]) == -1) {
          gradeArr.push(classItem["grade"]);
        }
      });
      let gradeObj: any = [];
      gradeArr.forEach((grade) => {
        gradeObj.push({
          className: grade,
          // id:grade,
          children: item.filter((classItem) => classItem["grade"] == grade),
        });
      });
      schoolArr.push({
        className: item[0]["schoolType"],
        children: gradeObj,
        // id: item[0]["schoolType"]
      });
    });

    return schoolArr;
  }
  timeDetailSure() {
    if (this.dateTime == "") {
      this.$message.error("请选择发布时间");
      return;
    }
    this.$refs["Forms"]["validate"]((valid) => {
      if (!valid) {
        return;
      }
      this.Form["ids"] = [];
      if (this.Form["type"] !== "4") {
        switch (this.Form["type"]) {
          case "0": // 教师
            if (this.Form["teacherSendType"] == 0) {
              // 班级
              let data = this.$refs["classTree"]["getCheckedKeys"](true);
              if (data.length === 0) {
                this.$message.error("请选择教师");
                return;
              }
              this.Form["ids"] = [].concat(data);
            } else if (this.Form["teacherSendType"] == 1) {
              // 任课组
              let data = this.$refs["rkTree"]["getCheckedKeys"](true);
              if (data.length === 0) {
                //  this["message"]("error", "请选择教师");
                this.$message.error("请选择教师");
                return;
              }
              this.Form["ids"] = [].concat(data);
            }
            break;
          case "1": //职工
            let data1 = this.$refs["zgTree"]["getCheckedKeys"](true);
            if (data1.length === 0) {
              this.$message.error("请选择职工");
              return;
            }
            this.Form["ids"] = [].concat(data1);
            break;
          case "2": //家长
            let data2 = this.$refs["jzTree"]["getCheckedKeys"](true);
            if (data2.length === 0) {
              this.$message.error("请选择家长");
              return;
            }
            this.Form["ids"] = [].concat(data2);
            break;
          case "3": //自定义
            if (this.zdyData.length === 0) {
              this["message"]("error", "请选择自定义发布对象");
              return;
            }
            const data3: any[] = [];
            this.zdyData.map((item: any) => {
              data3.push(item["userid"]);
            });
            this.Form["ids"] = data3;
            // let data3 = this.zdyData;
            // if (data3.length === 0) {
            //   this.$message.error("请选择自定义发布对象");
            //   return;
            // }
            // this.Form["ids"] = [].concat(data3);
            break;
          default:
            break;
        }
      }
      this.timeLoading = true;
      let params = { ...this.Form };
      params["status"] = 2;
      params["targetTime"] = this.dateTime;
      if (this.title == "修改通知") {
        PutMessage(params)
          .then((res) => {
            this.timeLoading = false;
            if (res.data.code == 200) {
              this.$message.success("发布成功！");
              // this["message"]("success", "发布成功！");
              setTimeout(() => {
                this.goBack();
              }, 1000);
            }
          })
          .catch((err) => {
            this.timeLoading = false;
          });
      } else {
        addMessage(params)
          .then((res) => {
            this.timeLoading = false;
            if (res.data.code == 200) {
              this.$message.success("发布成功！");
              // this["message"]("success", "发布成功！");
              setTimeout(() => {
                this.goBack();
              }, 1000);
            }
          })
          .catch((err) => {
            this.timeLoading = false;
          });
      }

      this.timeDetail = false;
    });
  }
  timeChange(val) {
    if (new Date(val).getTime() < new Date().getTime()) {
      this.$message.error("定时发布时间不能小于当前时间！");
      setTimeout(() => {
        this.dateTime = "";
      }, 300);
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-transfer-panel {
    width: 340px;
  }
  .el-transfer__buttons {
    padding: 0 15px;
  }
  .el-page-header {
    height: 46px;
    line-height: 46px;
    background: #fff;
    padding: 0 24px;
  }
  .el-page-header__content {
    font-size: 14px;
    color: #3a414f;
  }
  .el-radio-group {
    display: flex;
  }
}
.rightContent {
  height: calc(100vh - 126px);
}
.dfooter {
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;
  margin-top: 32px;
}
// 隐藏 ‘此刻’ 按钮
/deep/.el-picker-panel__footer .el-button--text.el-picker-panel__link-btn {
  display: none;
}
</style>
