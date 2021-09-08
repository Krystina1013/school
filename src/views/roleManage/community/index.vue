<template>
  <div class="app-container">
    <!--当前经度28px -->
    <div class="rightContent">
      <el-row>
        <el-col :span="12" class="formInfo">
          <el-form ref="formInfo" :rules="userRules" :model="communityForm" label-width="110px" style="margin-top:12px">
            <el-form-item label="学校名称" prop="name">
              <el-input v-model.trim="communityForm.name" placeholder="填写学校名称" auto-complete="off" maxlength="25" style="width:348px"></el-input>
            </el-form-item>
            <el-form-item label="学校地址" prop="address">
              <el-input @input="getlocLat" v-model="communityForm.address" placeholder="填写学校地址" auto-complete="off" style="width:348px"></el-input>
            </el-form-item>
            <el-form-item label="学校行政区" prop="address">
              <el-cascader :key="isShow" size="large" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>
              <!-- <el-input @input="getlocLat" v-model="communityForm.address" placeholder="填写学校地址" auto-complete="off" style="width:348px"></el-input> -->
            </el-form-item>
            <el-form-item label="图片展示" style="margin-top:20px">
              <div class="uplolad-img">
                <span class="shade-position" v-for="(item,index) in picList" :key="index">
                  <img class="show-img" :src="item" alt />
                  <p class="show-img shade" @click="changeImg(item,index)">
                    <i class="el-icon-delete"></i>
                  </p>
                </span>
                <el-upload class="avatar-uploader" :action="upPathPerson" ref="personForm" :list-type="picList.length < 5 ? 'picture-card' : ''" accept=".jpg, .jpeg, .png, .JPG, .JPEG" name="picture" :headers="myHeaders" :show-file-list="false" :auto-upload="true" :before-upload="beforeAvatarUpload" :on-success="succUpdatePerson" :on-error="errorUpdatePerson">
                  <i v-if="picList.length < 5" class="el-icon-plus"></i>
                </el-upload>
              </div>
              <div class="el-upload__tip">*请上传4:3图片，否则首页展示图片会出现拉伸</div>
            </el-form-item>
            <el-form-item label="学校简介">
              <el-input type="textarea" :rows="20" v-model="communityForm.description" placeholder="输入学校介绍" @input="constraintLength(communityForm.description,'200')" :maxlength="200" style="width:533px"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div class="mapBaid">
            <span class="maptext">当前经纬度(经度:{{ communityForm.longitude}}, 纬度: {{ communityForm.latitude }})</span>
            <BaiduMap height='665px' style="margin-top:6px" :backStatus="false" :markerStatus="false" @pointClick="getPoint" :keyword="communityForm.address" :positionList="positionList" :lng="communityForm.longitude" :lat="communityForm.latitude"></BaiduMap>
          </div>
        </el-col>
      </el-row>
      <div class="btnEdit">
        <el-button type="primary" @click="onSubmit">保存修改</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { editCommunity, getScene, deleteImg } from "@/api/screenApi.ts";
import config from "@/api/config";
import _axios from "axios";
import { getToken } from "@/utils/auth";
import { regionData, CodeToText } from "element-china-area-data";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const BaiduMap = () => import("@/components/baiduMap/index.vue");
var _token = getToken(); // 要保证取到

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    BaiduMap,
  },
})
export default class InformIssue extends Vue {
  filterForm: object = {
    tag: "no",
  }; //根据关键字查询
  initForm: object = {}; //获取数据的url
  options: any = regionData;
  selectedOptions: Array<any> = [];
  isShow: number = 0;
  private communityForm: Object = {
    address: "",
    provinceCode: "",
    cityCode: "",
    areaCode: "",
    latitude: "", //纬度
    longitude: "", //经度
    name: "", //名称
    description: "", //备注
  };
  private positionList: Array<Object> = [
    { position: { lng: "", lat: "" }, title: "", address: "" },
  ];
  private selectPic: Object = {};
  private userRules: Object = {
    name: [{ required: true, message: "请输入学校名称", trigger: "blur" }],
    address: [{ required: true, message: "请输入具体位置", trigger: "blur" }],
  };
  private upPathPerson: any = `${config.v1}/admin/hs-scence/picture`;
  private myHeaders: object = {
    token: _token,
  };

  private imageUrl: any = "";
  private dialogVisible: Boolean = false;
  private fileList: Array<Object> = [];
  private picList: Array<Object> = [];
  private showPic: Boolean = true;
  private sceneId: string = "";
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.getSceneData();
  }

  async getSceneData() {
    this.selectedOptions = [];
    const { data } = await getScene();
    this.sceneId = data.data.id;

    Vue.set(this.selectedOptions, 0, data.data.provinceCode);
    Vue.set(this.selectedOptions, 1, data.data.cityCode);
    Vue.set(this.selectedOptions, 2, data.data.areaCode);
    this.isShow ++

    this.positionList[0]["position"]["lng"] = data.data.longitude;
    this.positionList[0]["position"]["lat"] = data.data.latitude;
    this.positionList[0]["title"] = data.data.name;
    this.positionList[0]["address"] = data.data.address;
    this.$store.commit("SET_BUILDNAME", data.data.name);
    for (const key in this.communityForm) {
      this.communityForm[key] = data.data[key];
    }

    this.picList = data.data.imageUrlList || [];
  }

  beyondFile(files, fileList) {
    this.$message({ message: "只能上传5张", type: "error" });
  }

  removefile(file, fileList) {
    delete this.selectPic[`${file.uid}`];
  }

  async onSubmit() {
    this.$refs["formInfo"]["validate"]((valid) => {
      if (valid) {
        let param = {
          ...this.communityForm,
          id: this.sceneId,
        };
        console.log(param);
        editCommunity(param).then((res) => {
          this.$message({ message: "修改成功", type: "success" });
          this.showPic = true;
          this.getSceneData();
        });
      }
    });
  }

  succUpdatePerson(response, file, fileList) {
    this["picList"].push(file.url);
    this.$message({ message: "添加图片成功", type: "success" });
  }

  errorUpdatePerson() {
    this.$message({ message: "添加图片失败", type: "error" });
    this["message"]("error", "失败", "添加图片失败");
  }

  beforeAvatarUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.$message.error("上传图片大小不能超过 2MB!");
    }
    return isLt2M;
  }

  changeImg(v, i) {
    deleteImg(i).then(() => {
      this.$message.success("删除图片成功");
      this["picList"].splice(i, 1);
    });
  }

  /** 获取经纬度 */
  getPoint(add) {
    console.log(add);
    this["$jsonp"]("http://api.map.baidu.com/geocoder/v2/", {
      address: "",
      output: "json",
      pois: "0",
      coordtype: "wgs84ll",
      callback: "renderReverse",
      ak: "vCZU88Guz4BmAODWTm8k9BP0WlwId1V0",
      location: add.location,
    }).then((res) => {
      if (res.status === 0) {
        this.communityForm["address"] = res.result.formatted_address;
        this.communityForm["latitude"] = add.lat;
        this.communityForm["longitude"] = add.lng;
      } else {
        // this["notify"]("warning", "警告", "没有找到对应的位置信息");
        this.$message.error("没有找到对应的位置信息");
        this.communityForm["longitude"] = "";
        this.communityForm["latitude"] = "";
      }
    });
  }

  getlocLat() {
    this["$jsonp"]("http://api.map.baidu.com/geocoder/v2/", {
      address: this.communityForm["address"],
      output: "json",
      pois: "0",
      coordtype: "wgs84ll",
      callback: "renderReverse",
      ak: "vCZU88Guz4BmAODWTm8k9BP0WlwId1V0",
    }).then((res) => {
      console.log(res);
      if (res.status === 0) {
        this.communityForm["longitude"] = res.result.location.lng;
        this.communityForm["latitude"] = res.result.location.lat;
      } else {
        this.$message.error("没有找到对应的位置信息");
        this.communityForm["longitude"] = "";
        this.communityForm["latitude"] = "";
      }
    });
  }
  // 行政区域级联选择
  handleChange() {
    console.log("aaa", this.selectedOptions);
    this.communityForm["provinceCode"] = this.selectedOptions[0];
    this.communityForm["cityCode"] = this.selectedOptions[1];
    this.communityForm["areaCode"] = this.selectedOptions[2];
  }
}
</script>

<style lang="scss">
.formInfo {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 82px);
}
.rightContent {
  height: calc(100vh - 82px);
  padding: 25px;
}

.show-img {
  width: 97px;
  height: 97px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin-right: 12px;
}
.shade-position {
  position: relative;
}
.shade-position:hover .shade {
  display: block;
}
.mapBaid {
  width: 680px;
  margin-top: 10px;
}
.maptext {
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: LEFT;
  color: #606266;
  line-height: 22px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #409eff;
}
.el-upload__tip {
  font-size: 8px;
  line-height: 15px;
  color: rgb(250, 24, 24);
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
}

.shade {
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0px;
  text-align: center;
}
.el-icon-delete {
  font-size: 20px;
  color: #ffffff;
  line-height: 100px;
}
.uplolad-img {
  display: flex;
  position: relative;
  height: 97px !important;
}
.el-icon-plus {
  text-align: center;
}

.btnEdit {
  text-align: center;
  margin-top: 60px;
}
/deep/.el-cascader {
  width: 348px;
}
</style>
