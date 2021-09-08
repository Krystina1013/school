<template>
  <div>
    <el-dialog class="newDialog" title="人脸导入" :visible.sync="visible" width="670px" :before-close="handleClose">
      <el-upload class="upload-demo" drag :action="uploadUrl" accept='.zip,.xls' :headers="header" :multiple="false" :on-change="changeFile" :show-file-list="false" :on-error="errorUpload" :on-success="successUpload" ref="upload" :auto-upload="false">
        <div>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <br />
          <span style="color:black">{{ fileName }}</span>
        </div>
        <div class="el-upload__tip" slot="tip">
          <p style="color:#606266">目前仅支持*.zip；添加文件后，请到<span style="color:#409EFF">【导入记录】中查看导入结果。</span></p>
          <p style="margin-top:7px">导入说明：</p>
          <p>1.图片为清晰人脸图片;</p>
          <p v-if="isStudent">2.图片用对应学生学号命名;</p>
          <p v-else>2.图片用对应老师/职工电话号码命名;</p>
        </div>
      </el-upload>
      <!-- <h3 class="margin">导入说明</h3>
      <h4>1) 图片为清晰人脸图片</h4>
      <h4 v-if="isStudent">2) 图片用对应学生学号命名</h4>
      <h4 v-else>2) 图片用对应老师电话号码命名</h4> -->

      <!-- <h4>3) 所有数据必须按模板要求填写，否则系统将无法正常导入数据</h4>
      <h4>4) 目前仅支持xlsx格式的文件导入</h4>
      <h4>5) 由于兼容性的问题，如果WPS文件导入失败，建议更换为office后再次导入</h4> -->
      <!-- <div @click="exportFunc(TmplateName, downTemplateUrl)" class="margin">
        <i class="el-icon-download color"></i>
        <span class="color" style="padding:0px">下载导入模板</span>
      </div> -->

      <!-- <h3 class="margin">上传数据文件</h3>
      <el-upload class="upload-demo color" style="display:inline-block;margin-right:5px;text-align:left" :show-file-list="false" :on-error="errorUpload" :on-success="successUpload" 
      :multiple="false" :headers="header" :action="uploadUrl" accept=".zip,.xls" :on-change="changeFile" ref="upload" :auto-upload="false">
        <i class="el-icon-plus"></i>
        添加文件
        <br />
        <span style="color:black">{{ fileName }}</span>
      </el-upload>
      <h4>目前仅支持*.zip；添加文件后，<span style="color:#ff0342">请到【导入记录】中查看导入结果</span>。</h4> -->
      <span slot="footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmUpload">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="失败详情" width="1000px" :visible.sync="dialogTableVisible">
      <el-table height="300px" stripe border :data="errData">
        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1 || uploadUrl.indexOf('/admin/teacher/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="name" label="姓名" width="150"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="studentNu" label="学号" width="150"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1 || uploadUrl.indexOf('/admin/teacher/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="phone" label="电话" width="150">
          <template slot-scope="{row}">
            <span>{{row.phone.length==11?row.phone:''}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="intime" label="入校时间" width="50"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="outTime" label="离校时间" width="150"></el-table-column>
        <!-- <el-table-column 
          v-if="uploadUrl.indexOf('/admin/scence-user/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carNo"
          label="车牌"
          width="150"
        ></el-table-column> -->
        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1 || uploadUrl.indexOf('/admin/teacher/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="note" label="备注" width="150"></el-table-column>
        <!-- <el-table-column
          v-if="uploadUrl.indexOf('/admin/door-card/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="buildingName"
          label="单元名称"
          width="150"
        ></el-table-column> -->
        <!-- <el-table-column
          v-if="uploadUrl.indexOf('/admin/door-card/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="groupName"
          label="所属楼栋"
          width="120"
        ></el-table-column> -->
        <!-- <el-table-column
          v-if="uploadUrl.indexOf('/admin/door-card/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="120"
          property="validDate"
          label="有效时间"
        ></el-table-column> -->
        <!-- <el-table-column
          v-if="uploadUrl.indexOf('/admin/door-card/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="160"
          property="cardNo"
          label="卡号"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/door-card/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="120"
          property="houseName"
          label="房号"
        ></el-table-column>
         -->

        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1 || uploadUrl.indexOf('/admin/teacher/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="失败原因">
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.caseFail" :key="'caseFail' + index">{{item}},</span>
          </template>
        </el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/student/import') !== -1 || uploadUrl.indexOf('/admin/teacher/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="错误定位">
          <template slot-scope="{row}">
            <span>第 {{row.index}} 行</span>
          </template>
        </el-table-column>

        <!-- 车辆 -->

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carNo" label="车牌"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="name" label="车主姓名"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="phone" label="车主电话"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="status" label="状态"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carModel" label="车辆品牌"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carType" label="车辆型号"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="note" label="备注"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="status" label="状态"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="ownerName" label="业主姓名"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="失败原因">
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.caseFail" :key="'caseFail' + index">{{item}},</span>
          </template>
        </el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="错误定位">
          <template slot-scope="{row}">
            <span>第 {{row.index}} 行</span>
          </template>
        </el-table-column>

        <!-- 车位 -->

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="groupName" label="所属分组"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="serialNumber" label="编号"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="status" label="状态"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carOwnerName" label="业主"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carOwnerPhone" label="业主电话"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carSpaceTypeName" label="车位类型"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="bindCarName" label="绑定车辆"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="失败原因">
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.errMsg" :key="'errMsg' + index">{{item}},</span>
          </template>
        </el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="错误定位">
          <template slot-scope="{row}">
            <span>第 {{row.rowIndex}} 行</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { exportList } from "@/api/user.ts";
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { message } from "@/utils";
import qs from "qs";
@Component({})
export default class ExportImg extends Vue {
  @Prop({ default: "" }) downTemplateUrl: string;
  @Prop({ default: "" }) uploadUrl: string;
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: false }) isStudent: string;
  @Getter("token") token: string;
  @Prop({ default: "用户导入模板.xlsx" }) TmplateName: string;
  header: object = {};
  loading: any = null;
  errData: Array<object> = []; // 失败路径
  fileName: string = ""; // 文件名字
  dialogTableVisible: boolean = false; // 导出失败状态
  @Emit("errorUpload")
  errorUpload(err, file, list) {
    this.$nextTick(() => {
      this.fileName = "";
    });
    this.loading.close();
    this.errData = [];
    if (JSON.parse(err.message).code === 400) {
      message("error", JSON.parse(err.message).message);
    } else {
      console.log(JSON.parse(err.message));
      this.errData = JSON.parse(err.message);
      this.dialogTableVisible = true;
      this.$refs.upload["clearFiles"]();
    }
    this.handleClose();
  }
  @Emit("successUpload")
  successUpload(file) {
    this.$nextTick(() => {
      this.fileName = "";
    });
    this.loading.close();
    message("success", `上传成功`);
    this.$refs.upload["clearFiles"]();
    this.handleClose();
  }
  changeFile(file) {
    if (file.raw.type.indexOf("zip") === -1) {
      message("error", `只支持zip格式的文件！`);
      return false;
    }
    this.fileName = file.name;
  }
  mounted() {
    this.header = {
      token: this.token,
    };
  }

  @Emit("closeVisible")
  handleClose() {
    this.fileName = "";
    return false;
  }

  exportFunc(fileNames: string, exportUrl: string): void {
    const filterUrl = qs.stringify({ isData: false });
    if (process.env.NODE_ENV === "production") {
      // exportUrl = exportUrl.replace("", "http://47.103.184.184");
    }

    exportList(exportUrl + "/?" + filterUrl).then((res) => {
      const fileName = fileNames;
      var blob = new Blob([res.data], {
        type: "application/vnd.ms-excel;charset=UTF-8",
      });
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    });
  }
  // 确定上传
  confirmUpload() {
    if (!this.fileName) {
      return message("error", `未选择文件`);
    }
    this.loading = this.$loading({
      lock: true,
      text: "上传中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    this.$refs["upload"]["submit"]();
  }
}
</script>

<style lang="scss">
.el-upload-dragger {
  width: 425px;
  height: 223px;
}
</style>
<style scoped lang='scss'>
.upload-demo {
  text-align: center;
}
.el-upload__tip {
  width: 425px;
  margin: 8px auto;
  p {
    text-align: left;
    font-size: 14px;
    color: #6a7e92;
    line-height: 18px;
  }
}
h4 {
  color: gray;
  padding: 0px 0px 0px 20px;
  margin: 10px 0px;
}
.color {
  color: rgb(65, 199, 219);
  padding: 0px 0px 0px 20px;
}
.margin {
  margin: 10px 0px;
  &:hover {
    cursor: pointer;
  }
}
</style>
