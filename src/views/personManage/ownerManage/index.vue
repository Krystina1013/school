<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <data-tree :page="page" type="gradeInfo_student" :initFormHeader="initForm" :TreeData="TreeData" :hideHandle="false" @fetchData="fetchData" @getClassTreeData="getClassTreeData" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader ref="actionHeader" :initFormHeader="initForm" :filterForm="filterForm" @fetchData="fetchData" :dialogCreate.sync="dialogCreate" :total="page.total">
                  <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                      批量删除
                    </el-button>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="showExportIn">导入学生信息</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="showFaceExportIn">导入人脸</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">班&nbsp;&nbsp;&nbsp;级:</span>
                      <el-input clearable placeholder="请输入需要查找的班级" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.className" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                      <el-input clearable placeholder="请输入需要查找的姓名" maxlength="15" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.name" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">学&nbsp;&nbsp;&nbsp;号:</span>
                      <el-input clearable placeholder="请输入需要查找的学号" maxlength="30" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.studentNo" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">状&nbsp;&nbsp;&nbsp;态:</span>&nbsp;&nbsp;
                      <el-select v-model="filterForm.status" placeholder="请选择" class="select-class" size="small">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </ActionHeader>
              </el-col>
            </el-row>
            <el-table ref="table" :data="list_data" stripe border highlight-current-row v-loading="tableLoading" @cell-click="tableDbEdit" :row-class-name="tabRowClassName" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange" @selection-change="handleSelectionChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" align="center"></el-table-column>
              <el-table-column type="index" width="50" class="indexNum" align="center" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="班级"><template slot-scope="scope">
                  <span>{{
                  scope.row.myClass ? scope.row.myClass.className : ""
                }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" width="80" align="center" class="serial-num" label="姓名">
                <template slot-scope="scope">
                  <el-button @click="showStudentDetails(scope.row)" type="text">{{
                  scope.row.name
                }}</el-button>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="学号">
                <template slot-scope="scope">
                  <span>{{ scope.row.studentNo }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="学生类型">
                <template slot-scope="scope">
                  <span>{{ scope.row.studentType }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="img" align="center" width="110" label="人脸图像">
                <template slot-scope="scope">
                  <span class="high_showIconBtn" v-if="scope.row.face">
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'img')?'':'transparent'}" @click="openUpload(scope.row, 'update')"></i>
                    <img class="capture-img cur-img" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" :src="scope.row.face" alt />
                  </span>
                  <span v-else>
                    <el-button size="mini" type="primary" @click="openUpload(scope.row)">上传人脸</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="relativeName1" width="110" label="家长1姓名" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.relativeVo.relativeName1" :maxlength="20" v-if="showInput == `relativeName1${scope.row.id}`" v-focus @blur="blurInput(scope.row, 'relativeName1' , scope.row.relativeVo.relativeName1)"></el-input>
                  <span v-else class="showIconBtn">
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'relativeName1')?'':'transparent'}" @click="getFocus(scope.row, 'relativeName1')"></i>
                    {{ scope.row.relativeVo.relativeName1 || "--" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="relativePhone1" width="110" label="家长1电话" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.relativeVo.relativePhone1" :maxlength="11" v-if="showInput == `relativePhone1${scope.row.id}`" v-focus @blur="blurInput(scope.row, 'relativePhone1' , scope.row.relativeVo.relativePhone1)"></el-input>
                  <span v-else class="showIconBtn">
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'relativePhone1')?'':'transparent'}" @click="getFocus(scope.row, 'relativePhone1')"></i>
                    {{ scope.row.relativeVo.relativePhone1 || "--" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="relativeName1" width="110" label="关注公众号" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-if="scope.row.relativeVo.followWechat1 == 1" style="color:#67c23a">是</span>
                  <span v-else style="color:#f56c6c">否</span>
                </template>
              </el-table-column>
              <el-table-column prop="relativeName2" width="110" label="家长2姓名" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.relativeVo.relativeName2" :maxlength="20" v-if="showInput == `relativeName2${scope.row.id}`" v-focus @blur="blurInput(scope.row, 'relativeName2' , scope.row.relativeVo.relativeName2)"></el-input>
                  <span v-else class="showIconBtn">
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'relativeName2')?'':'transparent'}" @click="getFocus(scope.row, 'relativeName2')"></i>
                    {{ scope.row.relativeVo.relativeName2 || "--" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="relativePhone2" width="110" label="家长2电话" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.relativeVo.relativePhone2" :maxlength="11" v-if="showInput == `relativePhone2${scope.row.id}`" v-focus @blur="blurInput(scope.row, 'relativePhone2' , scope.row.relativeVo.relativePhone2)"></el-input>
                  <span v-else class="showIconBtn">
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'relativePhone2')?'':'transparent'}" @click="getFocus(scope.row, 'relativePhone2')"></i>
                    {{ scope.row.relativeVo.relativePhone2 || "--" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="relativeName1" width="110" label="关注公众号" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-if="scope.row.relativeVo.followWechat2 == 1" style="color:#67c23a">是</span>
                  <span v-else style="color:#f56c6c">否</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" min-width="90" prop="status" align="center" label="状态">
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.status == 'USED'">在校</el-tag>
                  <el-tag type="danger" v-else-if="scope.row.status == 'DISABLE'">离校</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="create_time" :show-overflow-tooltip="true" min-width="160" align="center" label="创建时间">
                <template slot-scope="{ row }">
                  <span>{{ row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="note" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.note" :maxlength="200" clearable v-if="showInput == `note${scope.row.id}`" v-focus @blur="blurInput(scope.row, 'note' , scope.row.note)"></el-input>
                  <span v-else class="showIconBtn">
                    <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'note')?'':'transparent'}" @click="getFocus(scope.row, 'note')"></i>
                    {{ scope.row.note || "--" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="openUpdate(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" :current-page="page.page" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
            <div style="z-index: 9" :class="rowSpan === 12 ? menuControl1 : menuControl2" @click="menuVisible">
              <p class="close-menu">
                <i v-if="rowSpan === 12" class="iconfont icon-left icon-class"></i>
                <i v-else class="iconfont icon-zuo icon-class"></i>
              </p>
            </div>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog top="10vh" class="newDialog" :title="isUpdate ? '修改学生' : '添加学生'" width="950px" :close-on-click-modal="false" :visible.sync="dialogCreate" :before-close="handleClose">
      <el-form class="owner" :model="Form" :rules="rules" ref="Forms" label-width="100px" style="margin-right: 40px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="学段:" prop="schoolType">
              <el-select @change="typeChange" style="width: 100%" v-model="Form.schoolType" placeholder="请选择学段">
                <el-option label="幼儿园" value="幼儿园"></el-option>
                <el-option label="小学" value="小学"></el-option>
                <el-option label="初中" value="初中"></el-option>
                <el-option label="高中" value="高中"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年级:" prop="grade">
              <el-select @change="gradeChange" :disabled="gradeSelect" style="width: 100%" v-model="Form.grade" placeholder="请选择学段">
                <el-option v-for="(ite, it) in gradeArr" :key="it" :label="ite.label" :value="ite.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班级:" prop="classId">
              <el-select style="width: 100%" v-model="Form.classId" placeholder="请选择班级">
                <el-option v-for="(item, i) in classArr" :key="i" :label="item.className" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学号:" prop="studentNo">
              <el-input style="width: 100%" clearable @input="inputChange" maxlength="30" v-model.trim="Form.studentNo" placeholder="输入学号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名:" prop="name">
              <el-input style="width: 100%" clearable maxlength="30" v-model.trim="Form.name" placeholder="输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="学生类型:" prop="name">
              <el-select style="width: 100%" v-model="Form.studentType" placeholder="请选择学生类型">
                <el-option label="住宿生" value="1"></el-option>
                <el-option label="走读生" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-form-item style="margin-bottom: 16px" label="人脸:" prop="face">
          <el-upload ref="upload" class="avatar-uploader alignLeft" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFace0Upload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <div class="parent-con">
          <div class="parent-title">家长信息:</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="家长1姓名">
                <el-input :disabled="nameDisabled" clearable maxlength="20" v-model.trim="Form.relativeName1" style="width: 100%" placeholder="输入家长姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="家长关系">
                <el-select style="width: 100%" :disabled="nameDisabled" size="small" v-model="Form.relativeType1" placeholder="请选择">
                  <el-option label="父亲" value="父亲"></el-option>
                  <el-option label="母亲" value="母亲"></el-option>
                  <el-option label="爷爷" value="爷爷"></el-option>
                  <el-option label="奶奶" value="奶奶"></el-option>
                  <el-option label="外公" value="外公"></el-option>
                  <el-option label="外婆" value="外婆"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="relativePhone1">
                <el-input :disabled="nameDisabled" clearable maxlength="11" v-model="Form.relativePhone1" style="width: 100%" placeholder="输入家长联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item style="margin-bottom: 16px" label="人脸:">
            <div v-if="relativeImage1" class="img_del">
              <img :src="relativeImage1" class="back_img" /><i class="el-icon-delete icon_del" @click="handleRemove(0)"></i>
            </div>
            <el-upload ref="uploadFace" class="avatar-uploader alignLeft" action="" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFace1Upload">
              <img v-if="relativeImage1" :src="relativeImage1" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item label="家长2姓名">
                <el-input :disabled="nameDisabled" clearable maxlength="20" v-model.trim="Form.relativeName2" style="width: 100%" placeholder="输入家长姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="家长关系">
                <el-select style="width: 100%" :disabled="nameDisabled" size="small" v-model="Form.relativeType2" placeholder="请选择">
                  <el-option label="父亲" value="父亲"></el-option>
                  <el-option label="母亲" value="母亲"></el-option>
                  <el-option label="爷爷" value="爷爷"></el-option>
                  <el-option label="奶奶" value="奶奶"></el-option>
                  <el-option label="外公" value="外公"></el-option>
                  <el-option label="外婆" value="外婆"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="relativePhone2">
                <el-input :disabled="nameDisabled" clearable maxlength="11" v-model="Form.relativePhone2" style="width: 100%" placeholder="输入家长联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="margin-bottom: 16px" label="人脸:">
            <!-- <i v-if="relativeImage2" class="el-icon-delete del_icon" @click="handleRemove(1)"></i>
            <el-upload ref="uploadFace" class="avatar-uploader" :style="{'text-align':isUpdate?'':'left'}" action="" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFace1Upload">
              <img v-if="relativeImage2" :src="relativeImage2" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
            <div v-if="relativeImage2" class="img_del">
              <img :src="relativeImage2" class="back_img" /><i class="el-icon-delete icon_del" @click="handleRemove(1)"></i>
            </div>
            <el-upload ref="uploadFace" class="avatar-uploader alignLeft" action="" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFace2Upload">
              <img v-if="relativeImage2" :src="relativeImage2" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-row>
            <el-col :span="16">
              <el-form-item style="margin-bottom: 16px" label="备注：" prop="note">
                <el-input type="textarea" v-model.trim="Form.note" :maxlength="200" placeholder="输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" :loading="btnLoading" @click="addUserConfirm">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 详情 -->
    <detailDialog :visible="studentDetailShow" :form="studentDetail" @edit="closeStudentDetails" @close="studentDetailShow = false"></detailDialog>
   
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />

    <!-- 上传人脸 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="300px" :title="uploadFaceTitle" :visible.sync="uploadFaceVisible">
      <el-upload ref="upload" class="avatar-uploader" :action="config.v1 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFaceUpload">
        <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar avatar-single" />
        <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFaceVisible = false; uploadImageUrl = ''">取 消</el-button>
        <el-button size="small" type="primary" :disabled="faceDisabled" :loading="upfaceLoading" @click="confirmUploadFace">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 人脸相似重新上传 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" title="提示" :visible.sync="uploadFaceReplayVisible">
      <p>{{ uploadFaceReplaymessage }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFaceReplayVisible = false">取 消</el-button>
        <el-button type="primary" :loading="replayUpfaceLoading" @click="replayConfirmUploadFace">继续上传</el-button>
      </div>
    </el-dialog>

    <!-- 导入学生 -->
    <ExportIn :uploadUrl="config.v1 + '/admin/student/import'" TmplateName="学生导入模板" :downTemplateUrl="config.v1 + '/admin/student/model'" @closeVisible="closeVisible" @successUpload="fetchData(initForm)" :visible.sync="visible" />
    <!-- 导入人脸 -->
    <ExportImg :uploadUrl="config.v1 + '/admin/scence-user/student/importFace'" :isStudent="true" @closeVisible="closeFaceVisible" @successUpload="fetchData(initForm)" :visible.sync="faceVisible" />
  </div>
</template>

<script>
import config from "@/api/config";
import mixin from "@/config/minxins";
import splitPane from "vue-splitpane";

import { getClass, getclassTree } from "@/api/houseApi";
import { addStudent, updateStudent } from "@/api/peopleApi";
import { getBase64 } from "@/utils/index.js";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
const ExportImg = () => import("@/components/exportImg/index.vue");
const DataTree = () => import("@/components/DataTree.vue");
import detailDialog from "./components/detailDialog.vue"

export default {
  mixins: [mixin],
  components: {
    ActionHeader,
    BigImg,
    TwoImg,
    ExportIn,
    ExportImg,
    splitPane,
    DataTree,
    detailDialog
  },
  data() {
    return {
      tableLoading: false,
      config: config,
      initForm: {
        url: config.v1 + "/admin/student/page",
        method: "get",
      },
      deleteForm: {
        url: config.v1 + "/admin/student",
        method: "delete",
        data: [],
        message: "此操作将永久删除选中的学生, 删除后学生将不存在,请谨慎操作!",
      },
      filterForm: {
        name: "",
        studentNo: "",
        status: "",
        className: "",
      },
      statusOptions: [
        { value: "USED", label: "在校" },
        { value: "DISABLE", label: "离校" },
      ],
      dialogCreate: false,

      gradeArr: [], //年级信息
      classArr: [], //班级信息
      TreeData: [], // 树形结构数据
      rowSpan: 12,
      menuControl1: "menu-control",
      menuControl2: "menu-visible",
      page: {},

      rowId: '',
      showProperty: '',
      showInput: "",
      oldData: {},

      selectVal: [], //选择的数据
      imgVisible: false, // 控制放大图片的visible
      bigImg: "", // 保存放大图片的地址
      twoImg: {
        visible: false,
        leftTitle: "",
        rightTitle: "",
        leftImg: "",
        rightImg: "",
      },
      passList: {
        scenceUserId: "",
        limit: 10,
        page: 1,
      },
      userId: "",
      phoneCopy: "",
      overtime: "", //批量设置过期时间
      overTimeLoad: false,
      isUpdate: false, //是否为修改

      //学生详情
      studentDetailShow: false,
      btnLoading: false,
      Form: {
        name: "",
        schoolType: "",
        grade: "",
        className: "",
        classId: "",
        note: "",
        studentNo: "",
        face: "",
        studentType: "",
        id: "",
        relativeName1: "",
        relativeName2: "",
        relativePhone1: "",
        relativePhone2: "",
        relativeType1: "",
        relativeType2: "",
        relativeFace1: "",
        relativeFace2: "",
        relativeId: "",
      },

      faceDisabled: false,
      uploadFaceVisible: false,
      replayUpfaceLoading: false, //重新上传
      uploadFaceReplayVisible: false, //重新上传dialog
      uploadFaceReplaymessage: "", //重新上传dialog 的title
      upfaceLoading: false,
      uploadFaceTitle: "上传人脸",
      uploadImageUrl: "", //单独上传人脸
      imageUrl: "", //人脸
      relativeImage1: "", //家长1人脸
      relativeImage2: "", //家长2人脸
      rowline: {}, //每行数据

      parentsArr: [],
      studentDetail: {
        face: "",
        name: "",
        className: "",
        studentNo: "",
        note: "",
        studentType: '',
        relativeName1: "",
        relativeName2: "",
        relativePhone1: "",
        relativePhone2: "",
        relativeType1: "",
        relativeType2: "",
        relativeFace1: "",
        relativeFace2: "",
        hasRelative: false,
      },
      gradeSelect: true,
      studentDetailObj: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      }, // 离校时间限制
      pickerOptionsUser: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      loading: false,
      nameDisabled: false,
      visible: false, // 批量导入状态
      faceVisible: false, // 人脸导入状态
      rules: {
        studentNo: [{ required: true, message: "请输入学号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        schoolType: [
          { required: true, message: "请选择学段", trigger: "change" },
        ],
        grade: [{ required: true, message: "请选择年级", trigger: "change" }],
        classId: [{ required: true, message: "请选择班级", trigger: "change" }],
        face: [
          { required: true, message: "请上传人脸照片", trigger: "change" },
        ],
        relativePhone1: [
          {
            validator: (rule, value, callback) => {
              if (value && !this["is_Phone"](value)) {
                callback(new Error("填写正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        relativePhone2: [
          {
            validator: (rule, value, callback) => {
              if (value && !this["is_Phone"](value)) {
                callback(new Error("填写正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },

  directives: {
    // 通过自定义指令实现的表单自动获得光标的操作
    focus: {
      inserted: function (el) {
        if (el.tagName.toLocaleLowerCase() == "input") {
          el.focus();
        } else {
          if (el.getElementsByTagName("input")) {
            el.getElementsByTagName("input")[0].focus();
          }
        }
        el.focus();
      },
    },
  },

  created() {
    this.getClassTreeData();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  },

  methods: {
    resize() { },
    tabRowClassName({ row, rowIndex }) {
      let index = row.indexSort + 1;
      if (row.indexSort % 2 == 0) {
        return "info-row";
      }
      return "";
    },

    enterCellChange(row, column, cell, event) {
      this.showProperty = column.property
      this.rowId = row.id
    },
    leaveCellChange(row, column) {
      this.showProperty = ''
      this.rowId = ''
    },

    async blurInput(row, name, value) {
      let obj = {};

      // 判断数据是否有所改变，如果数据有改变则调用修改接口
      if (this.oldData[name] === undefined && value == '') {
        this.showInput = "";
        return
      }
      if (this.oldData[name] != value) {
        obj[name] = value; //被改变的数据
        let params = {
          id: row.id,
          relativeVo: {
            id: row.relativeVo.id,
          },
        };
        if (name == "relativeName1") {
          params.relativeVo.relativeName1 = value;
          this.updateStudentInfo(params);
        } else if (name == "relativePhone1") {
          if (this["is_Phone"](value)) {
            params.relativeVo.relativePhone1 = value;
            this.updateStudentInfo(params);
          } else {
            this.$message.error("电话号码格式错误！");
            row.relativeVo.relativePhone1 = '';
            value = '';
            this.showInput = '';
            return;
          }
          // params.relativeVo.relativePhone1 = value;

        } else if (name == "relativeName2") {
          params.relativeVo.relativeName2 = value;
          this.updateStudentInfo(params);
        } else if (name == "relativePhone2") {
          if (this["is_Phone"](value)) {
            params.relativeVo.relativePhone2 = value;
            this.updateStudentInfo(params);
          } else {
            this.$message.error("电话号码格式错误！");
            this.showInput = '';
            row.relativeVo.relativePhone2 = '';
            return;
          }
          // params.relativeVo.relativePhone2 = value;
          // this.updateStudentInfo(params);
        } else if (name == "note") {
          params.note = value;
          this.updateStudentInfo(params);
        }
      }
      this.showInput = "";
    },
    getFocus(row, name) {
      this.showInput = name + row.id
    },

    updateStudentInfo(params) {
      updateStudent(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.fetchData(this.initForm);
        } else {
          this.$message({
            message: res.data.messa,
            type: "error",
          });
        }
      });
    },

    tableDbEdit(row, column, event) {
      this.oldData[column.property] = row.relativeVo[column.property];
    },

    handleSelectionChange(val) {
      this.deleteForm["data"] = [];
      val.forEach((ele) => {
        this.deleteForm["data"].push(ele.id);
      });
      this.selectVal = val;
    },

    closeVisible(flag) {
      this.visible = flag;
    },
    showExportIn() {
      this.visible = true;
    },
    closeFaceVisible(flag) {
      this.faceVisible = flag;
    },
    showFaceExportIn() {
      this.faceVisible = true;
    },

    // 获取班级结构
    getClassTreeData() {
      getclassTree().then((res) => {
        this.TreeData = this.iterator_self(res["data"]["data"]);
      });
    }, // 递归需要的tree数据
    iterator_self(arr) {
      let obj = [];
      for (let key in arr) {
        const name = key;
        let subBuildings = [];
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
    },

    handleClose() {
      this.Form = {
        name: "",
        schoolType: "",
        grade: "",
        className: "",
        classId: "",
        note: "",
        studentNo: "",
        face: "",
        id: "",
        relativeId: "",
        relativeName1: "",
        relativeName2: "",
        relativePhone1: "",
        relativePhone2: "",
        relativeType1: "",
        relativeType2: "",
        relativeFace1: "",
        relativeFace2: "",
        studentType: ''
      };
      this.parentsArr = [0];
      this.$refs["Forms"]["resetFields"]();
      this["dialogCreate"] = false;
      this.nameDisabled = false;
      this.classArr = [];
      this.imageUrl = "";
      this.relativeImage1 = "";
      this.relativeImage2 = "";
      this.isUpdate = false;
      this.gradeSelect = true;
      this.$refs["upload"]["clearFiles"]();
    },

    openUpload(row, type) {
      this.rowline = row;
      this.uploadFaceTitle = type == "update" ? "修改人脸" : "上传人脸";
      this.uploadImageUrl = type == "update" ? row.face : "";
      this.uploadFaceVisible = true;
      this.faceDisabled = true;
      this.showInput = type == "update" ? 'img' + row.id : ''
    },
    beforeFaceUpload(file) {
      getBase64(file.raw).then((res) => {
        this.uploadImageUrl = res;
        this.faceDisabled = false;
      });
    },
    confirmUploadFace() {
      if (this.uploadImageUrl == "") {
        this.$message.error("请先添加人脸");
        return;
      }
      this.upfaceLoading = true;
      let param = {
        face: this.uploadImageUrl,
        id: this.rowline["id"],
      };
      this.uploadFace(param);
    },
    replayConfirmUploadFace() {
      this.replayUpfaceLoading = true;
      if (this["dialogCreate"]) {
        this.addUserConfirm("force");
        return;
      }
      let param = {
        face: this.uploadImageUrl,
        id: this.rowline["id"],
        isForce: true,
      };
      this.uploadFace(param);
    },
    uploadFace(data) {
      if (data.face.indexOf("http://") != -1) {
        this.upfaceLoading = false;
        this.uploadFaceVisible = false;
        this.replayUpfaceLoading = false;
        this.uploadFaceReplayVisible = false;
        this.uploadImageUrl = "";
        return;
      }
      updateStudent(data)
        .then((res) => {
          this.upfaceLoading = false;
          this.$message.success("修改成功！");
          this.uploadFaceVisible = false;
          this.replayUpfaceLoading = false;
          this.uploadFaceReplayVisible = false;
          this.uploadImageUrl = "";
          this.fetchData(this.initForm);
        })
        .catch((err) => {
          this.upfaceLoading = false;
          this.replayUpfaceLoading = false
          if (err.message.indexOf("相似") != -1) {
            this.uploadFaceReplayVisible = true;
            this.uploadFaceReplaymessage = err.message;
          }
        });
    },

    // 添加/编辑
    openUpdate(row) {
      this.studentDetailShow = false;
      this.Form = {
        name: row.name,
        schoolType: row.myClass ? row.myClass.schoolType : "",
        grade: row.myClass.grade,
        className: row.myClass ? row.myClass.className : "",
        classId: row.classId,
        note: row.note,
        studentNo: row.studentNo,
        face: row.face,
        id: row.id,
        relativeId: row.relativeVo ? row.relativeVo.id : "",
        relativeName1: row.relativeVo ? row.relativeVo.relativeName1 : "",
        relativeName2: row.relativeVo ? row.relativeVo.relativeName2 : "",
        relativePhone1: row.relativeVo ? row.relativeVo.relativePhone1 : "",
        relativePhone2: row.relativeVo ? row.relativeVo.relativePhone2 : "",
        relativeType1: row.relativeVo ? row.relativeVo.relativeType1 : "",
        relativeType2: row.relativeVo ? row.relativeVo.relativeType2 : "",
        relativeFace1: row.relativeVo ? row.relativeVo.relativeFace1 : "",
        relativeFace2: row.relativeVo ? row.relativeVo.relativeFace2 : "",
      };
      if (this.Form.schoolType) {
        let val = this.Form.schoolType;
        if (val == "小学") {
          // 1.小学 2.初中3.高中
          this.gradeArr = [
            { label: val + "一年级" },
            { label: val + "二年级" },
            { label: val + "三年级" },
            { label: val + "四年级" },
            { label: val + "五年级" },
            { label: val + "六年级" },
          ];
        }
        if (val == "初中" || val == "高中") {
          this.gradeArr = [
            { label: val + "一年级" },
            { label: val + "二年级" },
            { label: val + "三年级" },
          ];
        }
        if (val == "幼儿园") {
          this.gradeArr = [
            { label: val + "大班" },
            { label: val + "中班" },
            { label: val + "小班" },
          ];
        }
      }

      if (this.Form.grade) {
        if (this.Form.schoolType && this.Form.grade) {
          let grade = this.Form.grade;
          getClass(grade).then((res) => {
            this.dialogCreate = true;
            this.classArr = res.data.data.records;
            this.Form.classId = row.myClass.id;
          });
        }
      }
      this.imageUrl = row.face;
      this.relativeImage1 = row.relativeVo.relativeFace1;
      this.relativeImage2 = row.relativeVo.relativeFace2;
      this.isUpdate = true;
      this.gradeSelect = false;
    },
    typeChange(val) {
      this.gradeSelect = false; //学段选择
      if (val == "小学") {
        // 1.小学 2.初中3.高中
        this.gradeArr = [
          { label: val + "一年级" },
          { label: val + "二年级" },
          { label: val + "三年级" },
          { label: val + "四年级" },
          { label: val + "五年级" },
          { label: val + "六年级" },
        ];
      }
      if (val == "初中" || val == "高中") {
        this.gradeArr = [
          { label: val + "一年级" },
          { label: val + "二年级" },
          { label: val + "三年级" },
        ];
      }
      if (val == "幼儿园") {
        this.gradeArr = [
          { label: val + "大班" },
          { label: val + "中班" },
          { label: val + "小班" },
        ];
      }
      this.Form.grade = "";
      this.Form.classId = "";
    },
    gradeChange() {
      if (this.Form.schoolType && this.Form.grade) {
        let grade = this.Form.grade;
        getClass(grade).then((res) => {
          this.Form.classId = "";
          this.classArr = res.data.data.records;
        });
      }
    },
    inputChange() {
      this.Form.studentNo = this.Form.studentNo.replace(/[\W]/g, "");
    },
    // 确定添加学生
    addUserConfirm(type) {
      this.btnLoading = true;
      this.$refs["Forms"]["validate"]((valid) => {
        if (valid) {
          let param = {
            classId: this.Form.classId,
            studentNo: this.Form.studentNo,
            name: this.Form.name,
            note: this.Form.note,
            relativeVo: {
              relativeName1: this.Form.relativeName1,
              relativeName2: this.Form.relativeName2,
              relativePhone1: this.Form.relativePhone1,
              relativePhone2: this.Form.relativePhone2,
              relativeType1: this.Form.relativeType1,
              relativeType2: this.Form.relativeType2,
              relativeFace1: this.relativeImage1,
              relativeFace2: this.relativeImage2,
              id: this.Form.relativeId,
            },
            outSchoolDate: this.Form.outSchoolDate,
            inSchoolDate: this.Form.inSchoolDate,
            face: this.imageUrl,
            id: "",
            studentType: this.Form.studentType
          };
          if (type == "force") {
            param["isForce"] = true;
          }
          if (this.Form.id) {
            param.id = this.Form.id;
            if (param.face.indexOf("http://") > -1) {
              param.face = null; //图片未修改
            }
            updateStudent(param)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                  });
                  this.dialogCreate = false;
                  this["handleClose"]();
                  this.fetchData(this.initForm);
                  this.btnLoading = false;
                  this.imageUrl = "";
                  this.relativeImage1 = "";
                  this.relativeImage2 = "";
                  this.replayUpfaceLoading = false;
                  this.uploadFaceReplayVisible = false;
                }
              })
              .catch((err) => {
                if (err.message.indexOf("相似") != -1) {
                  this.uploadFaceReplayVisible = true;
                  this.uploadFaceReplaymessage = err.message;
                }
                this.btnLoading = false;
              });
          } else {
            addStudent(param)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message({
                    message: "添加成功",
                    type: "success",
                  });
                  this.dialogCreate = false;
                  this["handleClose"]();
                  this.fetchData(this.initForm);
                  this.btnLoading = false;
                  this.imageUrl = "";
                  this.relativeImage1 = "";
                  this.relativeImage2 = "";
                  this.replayUpfaceLoading = false;
                  this.uploadFaceReplayVisible = false;
                }
              })
              .catch((err) => {
                if (err.message.indexOf("相似") != -1) {
                  this.uploadFaceReplayVisible = true;
                  this.uploadFaceReplaymessage = err.message;
                }
                this.btnLoading = false;
              });
          }
        } else {
          this.btnLoading = false;
        }
      });
    },
    delOne(p) {
      //删除家长信息
      this.parentsArr.splice(p, 1);
      if (p === 0) {
        this.Form.relativeName1 = "";
        this.Form.relativePhone1 = "";
        this.Form.relativeType1 = "";
      } else {
        this.Form.relativeName2 = "";
        this.Form.relativePhone2 = "";
        this.Form.relativeType2 = "";
      }
    },
    addOne() {
      this.parentsArr.push(1);
    },

    beforeFace0Upload(file) {
      this.getBase(file, 1);
    },
    beforeFace1Upload(file) {
      this.getBase(file, 2);
    },
    handleRemove(index, file) {
      if (index == 0) {
        this.relativeImage1 = "";
      } else if (index == 1) {
        this.relativeImage2 = "";
      }
    },
    beforeFace2Upload(file) {
      this.getBase(file, 3);
    },
    getBase(file, index) {
      getBase64(file.raw).then((res) => {
        if (index == 1) {
          this.imageUrl = res;
          this.Form["face"] = res;
        } else if (index == 2) {
          this.relativeImage1 = res;
          this.Form["relativeFace1"] = res;
        } else if (index == 3) {
          this.relativeImage2 = res;
          this.Form["relativeFace2"] = res;
        }
      });
    },

    // 详情
    showStudentDetails(row) {
      this.studentDetailObj = row;
      this.studentDetail["name"] = row.name;
      this.studentDetail["className"] = row.myClass
        ? row.myClass.className
        : "";
      this.studentDetail["studentNo"] = row.studentNo;
      this.studentDetail["face"] = row.face;
      this.studentDetail["studentType"] = row.studentType;
      if (row.relativeVo) {
        this.studentDetail["relativeName1"] = row.relativeVo.relativeName1;
        this.studentDetail["relativeName2"] = row.relativeVo.relativeName2;
        this.studentDetail["relativePhone1"] = row.relativeVo.relativePhone1;
        this.studentDetail["relativePhone2"] = row.relativeVo.relativePhone2;
        this.studentDetail["relativeType1"] = row.relativeVo.relativeType1;
        this.studentDetail["relativeType2"] = row.relativeVo.relativeType2;
        this.studentDetail["relativeFace1"] = row.relativeVo.relativeFace1;
        this.studentDetail["relativeFace2"] = row.relativeVo.relativeFace2;
      }
      let allNo = true;
      for (let key in row.relativeVo) {
        if (row.relativeVo[key]) {
          allNo = false;
        }
      }
      this.studentDetail["hasRelative"] = allNo;
      this.studentDetail["note"] = row.note;
      this.studentDetailShow = true;
    },
    closeStudentDetails(val) {
      this.studentDetailShow = false
      this.openUpdate(this.studentDetailObj)
    },

    menuVisible() {
      /**@description 控制楼栋 */
      if (this.rowSpan === 0) {
        this.rowSpan = 12;
      } else {
        this.rowSpan = 0;
      }
    },

    // 表头添加小图标的render 事件
    renderHeader(h, { column }) {
      return h("div", [
        h("span", column.label),
        h("i", {
          class: "el-icon-edit",
          style: "color:#409eff;margin-left:5px;",
        }),
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-button--mini {
    padding: 5px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #e4e7ed;
  }
}
.main {
  display: flex;
  .rightContent {
    height: 65vh;
    flex: 1;
    position: relative;
  }
}
.components-container {
  height: 100%;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: auto;
  display: block;
}
.avatar-single {
  width: 150px;
}
.img_del {
  position: absolute;
  width: 150px;
  min-height: 150px;
  height: auto;
  display: block;
  z-index: 10;
}
.back_img {
  position: relative;
  width: 150px;
  height: auto;
  display: block;
  opacity: 0;
}
.icon_del {
  position: absolute;
  color: transparent;
  font-size: 20px;
  top: 50%;
  margin-top: -10px;
  left: 65px;
}

.img_del:hover {
  background-color: #000;
  opacity: 0.5;
  .icon_del {
    color: #fff;
  }
}

.mainAddContain {
  width: 100%;
  height: 200px;
  display: flex;
  .pic {
    width: 140px;
    height: 140px;
    flex: none;
    overflow: hidden;
    border: 1px dotted gray;
    font-size: 48px;
    text-align: center;
    line-height: 140px;
    border-radius: 10px;
  }
  .form {
    flex: 1;
  }
}
.floatForm {
  width: 50%;
  float: left;
  position: relative;
  z-index: 999;
}
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
.el-icon-edit {
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
}
.blueCircleBtn {
  cursor: pointer;
  color: #589ff8;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #dcecfd;
  background: #eef5fe;
  border-radius: 20px;
  outline: none;
}
.redCircleBtn {
  cursor: pointer;
  color: #e57471;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #f9e3e3;
  background: #fcf1f0;
  border-radius: 20px;
  outline: none;
}
::v-deep {
  .miniPicker {
    width: 90px;
    input {
      padding-left: 20px;
      padding-right: 5px;
      height: 28px !important;
    }
    .el-icon-date {
      width: 10px;
    }
  }
}
.cur-img {
  cursor: pointer;
}
.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
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
.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
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
.reg-face {
  width: 100px;
  height: 100px;
}
.cur {
  cursor: pointer;
  display: inline-block;
  width: 100%;
}
.parent-con {
  overflow: hidden;
  position: relative;
  padding-bottom: 50px;
  .parent-title {
    width: 100px;
    padding-right: 12px;
    text-align: right;
    margin-bottom: 30px;
  }
  .del-btn {
    position: absolute;
    right: 0;
    bottom: 10px;
  }
  .parent-add {
    position: absolute;
    left: 40%;
    bottom: 30px;
  }
}
// .commonRow {
//   overflow: hidden;
//   .label {
//     float: left;
//   }
//   .value {
//     float: left;
//   }
//   .note-value {
//     width: 84%;
//   }
// }
.mg-40 {
  margin-top: 46px;
}
.ml-50 {
  margin-left: 50px;
}
.alignLeft {
  text-align: left;
}
.mg-0 {
  margin: 0;
}
// // 详情弹框
// .studentBack {
//   background: rgba(124, 189, 255, 0.3);
//   padding: 14px 16px;
// }
// .studentCom {
//   background: #a7d2ff;
//   color: #ffffff;
// }
// .studentCom:last-child {
//   margin-bottom: 0;
// }
// .patriarchCom {
//   width: 100%;
//   height: 38px;
//   display: flex;
//   align-items: center;
//   background: #f5f9ff;
//   margin-bottom: 10px;
//   padding: 8px 10px;
// }
// .patriarchImg {
//   height: 60px;
// }
// .valueImg img {
//   width: 44px;
//   height: 44px;
// }
// .noteCom {
//   min-height: 38px;
//   height: auto;
//   align-items: inherit;
// }
</style>
