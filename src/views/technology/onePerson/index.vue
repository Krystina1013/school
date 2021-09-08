<template>
  <div class="app-container">
    <div class="tabs-group">
      <el-tabs v-model="activeName">
        <el-tab-pane label="信息搜索" name="1"></el-tab-pane>
        <el-tab-pane label="图片搜索" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="activeName == '1'" v-loading="showLoading">
      <div class="search-group">
        <el-form ref="searchForm" :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" maxlength="10" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="searchForm.studentNo" placeholder="请输入学号" maxlength="20" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="searchForm.phone" placeholder="请输入电话" maxlength="11" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="searchForm.className" placeholder="请输入班级" maxlength="20" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="searchBy">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <ScrollList  class="show-list" ref="scrollList" :height="height_w - 148" :canPullUp="canPullUp" @scrollToBottom="scrollToBottom">
        <div v-if="tableData && tableData.length > 0">
          <div class="list_item" :key="index" v-for="(item, index) in tableData" @click="showPeopleDetail(item)">
            <div class="item_img"><img v-if="item.face && item.face!=''" :src="item.face" />
              <img v-else src="../../../assets/personFace.png" />
            </div>
            <div class="item_des">
              <div class="items">姓名：{{item.name}}</div>
              <div class="items">身份类型：{{item.scenceUserType}}</div>
              <div class="items" v-if="item.scenceUserType=='学生'">学号：{{item.studentNo}}</div>
              <div class="items" v-if="item.scenceUserType=='学生'">班级：{{item.className}}</div>
              <div class="items" v-if="item.scenceUserType!='学生' && item.scenceUserType!='关注人员'">电话：{{item.phone}}</div>
              <div class="items" v-if="item.scenceUserType!='学生' && item.scenceUserType!='关注人员'">备注：{{item.note}}</div>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <div class="empty_img">
            <img src="../../../assets/icon-empty.png" />
          </div>
          <p>未查询到相关记录！</p>
        </div>
      </ScrollList>
    </div>

    <div class="oneperson" v-if="activeName == '2'">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-card class="searchMan_card">
            <div slot="header">
              <span><i class="iconfont icon-guanzhurenyuan"></i>上传图片</span>
            </div>
            <div class="img_info">
              <el-upload class="upload-demo" drag :action="config.v1 + '/admin/scence-user/upFace'" :show-file-list='false' :auto-upload="false" accept='image/jpg,image/jpeg,image/png,image/bmp' :on-change="handleChange">
                <img v-if="form.faceUrl" :src="form.faceUrl" class="avatar" />
                <div v-else>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <div class="card_footer">
                <el-button @click="reset">清空图片</el-button>
                <el-button type="primary" @click="searchOnePerson">搜 索</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="searchMan_card">
            <div slot="header">
              <span><i class="iconfont icon-zhuapaitu"></i>身份信息</span>
            </div>
            <div class="img_info">
              <template v-if="showDetail">
                <div class="person_decard" v-for="(oneData,one) in searchData" :key="one">
                  <div class="person_info">
                    <img :src="oneData.face || '/static/img/capture.b3fd5b10.png'" />
                    <p>{{ oneData.name }}</p>
                  </div>
                  <div class="person_detail">
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <div class="one-con">
                          <div class="left left_right">人员类型：</div>
                          <div class="right">{{ oneData.scenceUserType | personType }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'careMan' && oneData.workerGroupName ">
                        <div class="one-con">
                          <div class="left left_right">所属分组：</div>
                          <div class="right">{{ oneData.workerGroupName }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.phone && oneData.scenceUserType !== 'student'">
                        <div class="one-con">
                          <div class="left left_right">联系电话：</div>
                          <div class="right">{{ oneData.phone }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.workerGroupName &&  oneData.scenceUserType === 'worker'">
                        <div class="one-con">
                          <div class="left left_right">所属部门：</div>
                          <div class="right">{{ oneData.workerGroupName }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.studentName">
                        <div class="one-con">
                          <div class="left left_right">学生姓名：</div>
                          <div class="right">{{ oneData.studentName }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.studentNo">
                        <div class="one-con">
                          <div class="left left_right">学号：</div>
                          <div class="right">{{ oneData.studentNo }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.className">
                        <div class="one-con">
                          <div class="left left_right">班级：</div>
                          <div class="right">{{ oneData.className }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'student'">
                        <div class="one-con">
                          <div class="left left_right">家长1姓名：</div>
                          <div class="right">{{ oneData.relativeName1 }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'student'">
                        <div class="one-con">
                          <div class="left left_right">家长2姓名：</div>
                          <div class="right">{{ oneData.relativeName2 }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'student'">
                        <div class="one-con">
                          <div class="left left_right">家长1关系：</div>
                          <div class="right">{{ oneData.relativeType1 }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'student'">
                        <div class="one-con">
                          <div class="left left_right">家长2关系：</div>
                          <div class="right">{{ oneData.relativeType2 }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'student'">
                        <div class="one-con">
                          <div class="left left_right">家长1电话：</div>
                          <div class="right">{{ oneData.relativePhone1 }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'student'">
                        <div class="one-con">
                          <div class="left left_right">家长2电话：</div>
                          <div class="right">{{ oneData.relativePhone2 }}</div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-if="oneData.scenceUserType === 'personsOther'">
                        <div class="one-con">
                          <div class="left left_right">身份证号：</div>
                          <div class="right">{{ oneData.idCard }}</div>
                        </div>
                      </el-col>
                      <el-col :span="24" class="note-con" v-if="oneData.scenceUserType !== '家长'">
                        <div>
                          <div class="left left_right">备注：</div>
                          <p class="right_note">{{ oneData.note || "--" }}</p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </template>
              <div class="person_search" v-else>
                <div class="round1"></div>
                <div class="round2"></div>
                <div class="round3"></div>
                <i class="iconfont icon-daping-renshu"></i>
                <div class="search_dev clockwise"></div>
                <i></i>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <studentDetail :visible="studentDetailShow" :form="studentDetail" :edit="false" @close="studentDetailShow = false"></studentDetail>
    <teacherDetail :visible="teacherDetailShow" :form="teacherDetail" :edit="false" @close="teacherDetailShow = false"></teacherDetail>
    <propertyDetail :visible="propertyDetailShow" :form="propertyDetail" :edit="false" @close="propertyDetailShow = false"></propertyDetail>
    <otherDetail :visible="otherDetailShow" :form="otherDetail" :edit="false" @close="otherDetailShow = false"></otherDetail>
    <importantDetail :visible="importantDetailShow" :form="importantDetail" :title="'关注人员详情'" @close="importantDetailShow = false"></importantDetail>

  </div>
</template>

<script>
import { getInfoByFace, getInfoSimilar } from "@/api/user.ts";
import { getBase64 } from "@/utils/index.js";
import config from "@/api/config";

const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
import studentDetail from "@/views/personManage/ownerManage/components/detailDialog.vue";
import teacherDetail from "@/views/personManage/checkManage/components/detailDialog.vue";
import propertyDetail from "@/views/personManage/propertyManage/components/detailDialog.vue";
import otherDetail from "@/views/personManage/otherManage/components/detailDialog.vue";
import importantDetail from "@/views/security/importantPerson/components/dialogDetail.vue";
import { tr } from 'date-fns/locale';

export default {
  components: {
    ScrollList,
    studentDetail,
    teacherDetail,
    propertyDetail,
    otherDetail,
    importantDetail,
  },

  data() {
    return {
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      activeName: '1',
      pagination: {
        total: 0,
        page: 1,
        pageSize: 48,
      },
      pageTotal: 0,
      searchForm: {
        name: '',
        studentNo: '',
        phone: '',
        className: ''
      },
      tableData: [],
      canPullUp: true,
      showLoading: false,

      studentDetailShow: false,
      studentDetail: {},
      teacherDetailShow: false,
      teacherDetail: {},
      propertyDetailShow: false,
      propertyDetail: {},
      otherDetailShow: false,
      otherDetail: {},
      importantDetailShow: false,
      importantDetail: {},

      showDetail: false,
      config: config,
      form: {
        faceUrl: "",
      },
      searchData: [],
    };
  },
  filters: {
    personType(val) {
      const data = {
        student: "学生",
        teacher: "教师",
        worker: "职工",
        careMan: "关注人员",
        personsOther: "其他人员",
        "家长": '家长'
      };
      return data[val];
    },
  },
  created() {
    this.searchAll()
  },
  methods: {
    searchBy() {
      this.tableData = []
      this.pagination.page = 1
      this.searchAll()
    },
    searchAll() {
      let params = {
        limit: this.pagination.pageSize,
        page: this.pagination.page,
        name: this.searchForm.name,
        phone: this.searchForm.phone,
        studentNo: this.searchForm.studentNo,
        className: this.searchForm.className
      }
      this.showLoading = true;
      getInfoSimilar(params).then((res) => {
        console.log('resres', res.data.data.records)
        if (this.pagination.page !== 1) {
          this.tableData = this.tableData.concat(res.data.data.records);
        } else {
          this.tableData = res.data.data.records;
        }

        this.pageTotal = res.data.data.total;
        this.$nextTick(() => {
          if (this.tableData && (this.tableData.length == parseInt(this.pageTotal))) {
            this.canPullUp = false;
          } else {
            this.canPullUp = true;
          }
        });
        this.showLoading = false;
      })
        .catch((err) => {
          this.showLoading = false;
        });
    },

    scrollToBottom() {
      this.pagination.page++;
      this.canPullUp = false;
      this.searchAll();
    },

    showPeopleDetail(val) {
      if (val.scenceUserType == '学生') {
        val.relativeFace1 = val.relativeVo.relativeFace1
        val.relativeName1 = val.relativeVo.relativeName1
        val.relativeType1 = val.relativeVo.relativeType1
        val.relativePhone1 = val.relativeVo.relativePhone1
        val.relativeFace2 = val.relativeVo.relativeFace2
        val.relativeName2 = val.relativeVo.relativeName2
        val.relativeType2 = val.relativeVo.relativeType2
        val.relativePhone2 = val.relativeVo.relativePhone2
        this.studentDetailShow = true
        this.studentDetail = val
      } else if (val.scenceUserType == '教师') {
        // val.classes = val.className
        this.teacherDetailShow = true
        this.teacherDetail = val
      } else if (val.scenceUserType == '职工') {
        this.propertyDetailShow = true
        this.propertyDetail = val
      } else if (val.scenceUserType == '其他人员') {
        val.idCard = val.cardNo
        this.otherDetailShow = true
        this.otherDetail = val
      } else if (val.scenceUserType == '关注人员') {
        this.importantDetailShow = true
        this.importantDetail = val
      }
    },

    handleChange(file) {
      let arr = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp']
      if (arr.indexOf(file.raw.type) == -1) {
        this.$message.error('请上传jpg、JPEG、png、bmp格式图片！')
        return
      }
      getBase64(file.raw).then((res) => {
        this.form.faceUrl = res;
      });
    },
    searchOnePerson() {
      if (!this.form.faceUrl) {
        this.$message.error("请选择图片!");
        return;
      }
      getInfoByFace({ base: this.form.faceUrl })
        .then((res1) => {
          let res = res1.data;
          this.searchData = [];
          if (res.data && res.data.length > 0) {
            this.showDetail = true
            // this.searchData = res.data;
            res.data.map(item => {
              if (item !== null) {
                this.searchData.push(item)
              }
            })
          } else {
            this.searchData = [];
            this.showDetail = false;
            this.$message.error("未搜索到相关人员!");
          }
        })
        .catch((error) => {
          this.showDetail = false;
          this.searchData = [];
        });
    },
    reset() {
      this.showDetail = false
      this.form.faceUrl = "";
      this.searchData = [];
    },
  },
};
</script>

<style lang="scss">
.tabs-group {
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
}
</style>

<style lang="scss" scoped>
.tabs-group {
  height: 46px;
  padding: 6px 0 0 30px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}
.search-group {
  height: 46px;
  padding-left: 30px;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
}

.show-list {
  padding: 16px 20px;
  padding-right: 0;
  width: 100%;
  height: calc(100vh - 144px);
  overflow-y: auto;
  .item_img,
  img {
    width: 76px;
    height: 89px;
    float: left;
  }
  .item_des {
    width: 162px;
    height: 89px;
    float: right;
  }
}

.empty {
  .empty_img {
    width: calc(100% - 30px);
    height: 57px;
    text-align: center;
  }
  img {
    width: 57px;
    height: 57px;
    margin-left:calc(50% - 20px);
  }
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 100px;
}

.list_item {
  width: 267px;
  height: 101px;
  background-color: #fff;
  padding: 6px 10px 6px 14px;
  margin: 0 11px 8px 0;
  display: inline-block;
  cursor: pointer;
  .items {
    height: 21px;
    line-height: 21px;
    background-color: #f5f6f6;
    margin-bottom: 2px;
    padding: 0 5px;
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    color: #606266;
    text-overflow: ellipsis;
    white-space: nowrap;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 1;
    overflow: hidden;
  }
}

.clockwise {
  animation: scaning 5s linear infinite;
  transform-origin: 100% 100%;
}
@keyframes scaning {
  to {
    transform: rotate(360deg);
  }
}
.oneperson {
  width: calc(100% - 60px);
  min-width: 1270px;
  margin: 0 auto;
  margin-top: 8vh;
}
.searchMan_card {
  height: calc(80vh - 51px);
  min-height: 500px;
  position: relative;
  overflow-y: auto;
  i {
    font-size: 25px;
    color: #308ae7;
    margin-right: 8px;
  }
  .img_info {
    text-align: center;
    height: auto;
  }
  .upload-demo {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
  .avatar {
    height: 100%;
    width: auto;
  }
  .card_footer {
    position: absolute;
    bottom: 45px;
    right: 45px;
  }
  .person_info {
    float: left;
    width: 180px;
    img {
      width: 150px;
      height: 150px;
    }
  }
  .person_decard {
    position: relative;
    min-height: 215px;
    max-height: calc(80vh - 182px);
    overflow: hidden;
    border: 1px solid #ebeef5;
    padding: 10px;
    margin-bottom: 20px;
  }
  .person_detail {
    position: relative;
    float: right;
    height: auto;
    width: calc(100% - 180px);
    .one-con {
      margin-bottom: 10px;
      background-color: #f5f9ff;
      height: 30px;
      line-height: 30px;
    }

    .left {
      float: left;
      width: 100px;
      text-align: right;
      height: 30px;
    }
    .left_right {
      text-align: right;
    }
    .right_left {
      float: left;
      text-align: right;
      margin-left: 10px;
    }
    .right {
      float: left;
      text-align: left;
      width: calc(100% - 130px);
      height: 100%;
    }
    .note-con {
      background-color: #f5f9ff;
      min-height: 30px;
      line-height: 30px;
      width: calc(100% - 10px);
      margin-left: 5px;
      padding-left: 0 !important;
      .right_note {
        float: left;
        height: auto;
        max-height: calc(80vh - 360px);
        overflow-y: auto;
        line-height: 30px;
        word-break: break-all;
        width: calc(100% - 130px);
        text-align: left;
      }
    }
  }
  .person_search {
    position: relative;
    width: 100%;
    height: calc(80vh - 182px);
    i {
      font-size: 54px;
      position: absolute;
      top: 50%;
      margin-top: -27px;
      margin-left: -27px;
    }
    .round1 {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 50%;
      margin-top: -186px;
      width: 372px;
      height: 372px;
      opacity: 0.05;
      background: rgba(48, 137, 231, 0.6);
      border-radius: 50%;
      z-index: 0;
    }
    .round2 {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 50%;
      margin-top: -128.5px;
      width: 257px;
      height: 257px;
      opacity: 0.08;
      background: rgba(48, 137, 231, 0.6);
      border-radius: 50%;
      z-index: 1;
    }
    .round3 {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 50%;
      margin-top: -82.5px;
      width: 165px;
      height: 165px;
      opacity: 0.1;
      background: rgba(48, 137, 231, 0.6);
      border-radius: 50%;
    }
    .search_dev {
      position: absolute;
      left: 50%;
      margin-left: -186px;
      top: 50%;
      margin-top: -186px;
      width: 186px;
      height: 186px;
      background: linear-gradient(45deg, rgba(0, 0, 0, 0) 50%, #308ae7 100%);
      opacity: 0.1;
      border-top-left-radius: 100%;
    }
  }
}
</style>