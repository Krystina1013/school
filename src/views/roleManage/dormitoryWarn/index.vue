<template>
  <div class="app-container">
    <div class="rightContent">
      <div class="school_setcard">
        <div class="header">
          <i class="iconfont icon-Frame-2"></i>
          <span>晚归预警类型</span>
          <el-button class="right" type="text" @click="update"><i class="el-icon-edit"></i>编辑</el-button>
        </div>
        <div class="body">
          <el-form ref="form" label-width="100px" size="small">
            <el-form-item label="晚归时段：">
              <span>{{ lateBackConfig.startTime }} -- {{ lateBackConfig.endTime }}</span>
            </el-form-item>
            <el-form-item label="条件1：">
              <span>在【晚归时间段】内有进【宿舍楼门禁】的通行记录；</span>
            </el-form-item>
            <!-- <el-form-item label="条件2">
              <span>当学生回宿舍时，被抓拍到人脸的时间在【晚归时间段】内；</span>
            </el-form-item> -->
            <el-form-item label="算法：">
              <div class="arithmetic">
                <div class="button">条件1</div>
                <i class="el-icon-right"></i>
                <div class="button">预警</div>
              </div>
            </el-form-item>
            <el-form-item label="是否开启：">
              <el-switch v-model="lateBackConfig.status" @change="changeLateBack" active-value="ENABLE" inactive-value="DISABLE" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="school_setcard">
        <div class="header">
          <i class="iconfont icon-Frame-1"></i>
          <span>未归预警类型</span>
          <!-- <el-button class="right" type="text" @click="updateNoBack"><i class="el-icon-edit"></i>编辑</el-button> -->
        </div>
        <div class="body">
          <el-form ref="form" label-width="100px" size="small">
            <el-form-item label="未归时段">
              <span>{{ lateBackConfig.endTime }} 之后</span>
            </el-form-item>
            <el-form-item label="条件1：">
              <span>在【未归时间段】之前的最后一条通行记录是出【宿舍楼门禁】</span>
            </el-form-item>
            <!-- <el-form-item label="条件2">
              <span>在【未归时间段】内没有通行记录</span>
            </el-form-item> -->
            <el-form-item label="算法：">
              <div class="arithmetic">
                <div class="button">条件1</div>
                <i class="el-icon-right"></i>
                <div class="button">预警</div>
              </div>
            </el-form-item>
            <el-form-item label="是否开启：">
              <el-switch v-model="noBackConfig.status" @change="changeNoBack" active-value="ENABLE" inactive-value="DISABLE" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="school_setcard little">
        <div class="header">
          <i class="iconfont icon-Frame1"></i>
          <span>家长是否允许进入校园</span>
        </div>
        <div class="body">
          <el-form>
            <el-form-item label="学生家长是否允许进入校园" prop="allowFamilyPass">
              <el-radio-group v-model="allowFamilyPass" @change="updateSet">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="school_setcard little">
        <div class="header">
          <i class="iconfont icon-Frame1"></i>
          <span>预警设置</span>
        </div>
        <div class="body">
          <el-form @submit.native.prevent>
            <el-form-item prop="allowFamilyPass" label="设备离线预警：设备超过">
              <el-input
                clearable
                maxlength="4"
                @keyup.native="UpNumber"
                @keydown.native="UpNumber"
                @input="hint"
                @focus="hintFocus"
                @blur="submitMinute"
                style="width:80px"
                v-model="devWarnMinute"
              ></el-input>&nbsp;&nbsp;分钟未上线预警
            </el-form-item>
          </el-form>
        </div>
      </div>

    </div>

    <!-- <div class="layout-col flex">
      <div>
        <div class="flex model-title">
          <p>走读生门禁设置</p>
          <el-button type="text" size="mini" @click="updateEntrance(1)">编辑</el-button>
        </div>
        <div class="model-bottom">
          <el-form ref="form" label-width="100px">
            <el-form-item label="时间段">
              <ul>
                <li>
                  <span>星期一</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期二</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期三</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期四</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期五</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期六</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期日</span>
                  <span> 8:00 - 17:00 </span>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="节假日">
              <span>同步</span>
            </el-form-item>
            <el-form-item label="说明">
              <span>设置的时间段内不允许学生外出</span>
              <span>若同步节假日则节假日学生外出不受限制</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <div class="flex model-title">
          <p>住校生门禁设置</p>
          <el-button type="text" size="mini" @click="updateEntrance(1)">编辑</el-button>
        </div>
        <div class="model-bottom">
          <el-form ref="form" label-width="100px">
            <el-form-item label="时间段">
              <ul>
                <li>
                  <span>星期一</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期二</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期三</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期四</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期五</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期六</span>
                  <span> 8:00 - 17:00 </span>
                </li>
                <li>
                  <span>星期日</span>
                  <span> 8:00 - 17:00 </span>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="节假日">
              <span>同步</span>
            </el-form-item>
            <el-form-item label="说明">
              <span>设置的时间段内不允许学生外出</span>
              <span>若同步节假日则节假日学生外出不受限制</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div> -->

    <!-- 晚归 -->
    <el-dialog class="newDialog" title="晚归预警" :visible.sync="backLate.visible" width="690px" :before-close="handleClose">
      <el-form ref="backLateform" label-width="100px">
        <el-form-item label="晚归时段">
          <!-- <el-time-picker
              is-range
              v-model="backLate.date"
              range-separator="-"
              :clearable="false"
              start-placeholder="开始时间"
              value-format="HH:mm"
              format="HH:mm"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
          </el-time-picker> -->
          <el-time-select style="width:150px" placeholder="开始时间" v-model="backLate.startTime" :clearable="false" :picker-options="{
              start: '18:00',
              step: '00:30',
              end: '24:00'
            }">
          </el-time-select>
          -
          <el-time-select style="width:150px" placeholder="结束时间" v-model="backLate.endTime" :clearable="false" @change="endChange" :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00'
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="条件1">
          <span>在【晚归时间段】内有进【宿舍楼门禁】的通行记录；</span>
        </el-form-item>
        <!-- <el-form-item label="条件2">
          <span>当学生回宿舍时，被抓拍到人脸的时间在【晚归时间段】内；</span>
        </el-form-item> -->
        <el-form-item label="算法">
          <div class="arithmetic">
            <div class="button">条件1</div>
            <!-- <div style="position:relative;">
              <span class="label">或</span>
              <label class="line"></label>
            </div>
            <div class="button">条件2</div> -->
            <i class="el-icon-right"></i>
            <div class="button">预警</div>
          </div>
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch v-model="backLate.comeBackLate" active-value="ENABLE" inactive-value="DISABLE" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="comfirmSetBackLate" :loading="backLate.load">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 未归 -->
    <el-dialog class="newDialog" title="未归预警" :visible.sync="noBack.visible" width="690px" :before-close="handleClose">
      <el-form ref="noBackform" label-width="100px">
        <el-form-item label="未归时段">
          <!-- <el-time-picker
              :clearable="false"
              is-range
              v-model="noBack.date"
              range-separator="-"
              start-placeholder="开始时间"
              value-format="HH:mm"
              format="HH:mm"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
          </el-time-picker> -->
          <el-time-select style="width:150px" placeholder="开始时间" v-model="noBack.startTime" :clearable="false" :picker-options="{
              start: '18:00',
              step: '00:30',
              end: '23:30'
            }">
          </el-time-select>
          -
          <el-time-select style="width:150px" placeholder="结束时间" v-model="noBack.endTime" :clearable="false" :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '08:00'
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="条件1">
          <span>在【未归时间段】之前的最后一条通行记录是出【宿舍楼门禁】</span>
        </el-form-item>
        <!-- <el-form-item label="条件2">
          <span>在【未归时间段】内没有通行记录</span>
        </el-form-item> -->
        <el-form-item label="算法">
          <div class="arithmetic">
            <div class="button">条件1</div>
            <!-- <div style="position:relative;">
              <span class="label">且</span>
              <label class="line"></label>
            </div>
            <div class="button">条件2</div>-->
            <i class="el-icon-right"></i>
            <div class="button">预警</div>
          </div>
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch v-model="noBack.noBackLate" active-value="ENABLE" inactive-value="DISABLE" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmSetNoBack" :loading="noBack.load">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 走读生 住校生门禁设置 -->
    <!-- <el-dialog :title="studentSetTitle" :visible.sync="entrance.visible" width="650px" :before-close="handleClose">
      <div class="model-bottom">
        <el-form ref="form" label-width="100px">
          <el-form-item label="时间段">
            <ul>
              <li>
                <span>星期一</span>
                <span>
                  <el-time-picker is-range v-model="timeForm.Mon" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="mini" format="HH:mm">
                  </el-time-picker>
                </span>
              </li>
              <li>
                <span>星期二</span>
                <span>
                  <el-time-picker is-range v-model="timeForm.Tue" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="mini" format="HH:mm">
                  </el-time-picker>
                </span>
              </li>
              <li>
                <span>星期三</span>
                <span>
                  <el-time-picker is-range v-model="timeForm.Wed" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="mini" format="HH:mm">
                  </el-time-picker>
                </span>
              </li>
              <li>
                <span>星期四</span>
                <span>
                  <el-time-picker is-range v-model="timeForm.Thur" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="mini" format="HH:mm">
                  </el-time-picker>
                </span>
              </li>
              <li>
                <span>星期五</span>
                <span>
                  <el-time-picker is-range v-model="timeForm.Fri" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="mini" format="HH:mm">
                  </el-time-picker>
                </span>
              </li>
              <li>
                <span>星期六</span>
                <span>
                  <el-time-picker is-range v-model="timeForm.Sat" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="mini" format="HH:mm">
                  </el-time-picker>
                </span>
              </li>
              <li>
                <span>星期日</span>
                <span>
                  <el-time-picker is-range v-model="timeForm.Sun" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="mini" format="HH:mm">
                  </el-time-picker>
                </span>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="节假日">
            <span>
              <el-radio-group v-model="timeForm.syncHoliday">
                <el-radio :label="1">同步</el-radio>
                <el-radio :label="0">不同步</el-radio>
              </el-radio-group>
            </span>
          </el-form-item>
          <el-form-item label="说明">
            <span>设置的时间段内不允许学生外出</span>
            <span>若同步节假日则节假日学生外出不受限制</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="comfirmSetEntrance" :loading="entrance.load">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { getScene, updateFamilyPass } from "@/api/screenApi";
import { getSchoolCheck, setSchoolCheck, setGradeCheck } from "@/api/checkApi";
import { dormitoryConfig, updateDormitoryConfig } from "@/api/peopleApi";
@Component({
  mixins: [mixin],
})
export default class extends Vue {
  config: any = config;
  height_w: number = window.innerHeight;
  switchArr: any = {
    comeBackLate: 1,
    noBackLate: 1,
    entrance: 1,
  };
  set: any = {
    comeBackLate: 1,
    noBackLate: 1,
    entrance: 1,
  };
  backLate: any = {
    visible: false,
    load: false,
    comeBackLate: "",
    startTime: "",
    endTime: "",
  };
  noBack: any = {
    visible: false,
    load: false,
    noBackLate: "",
    startTime: "",
    endTime: "",
  };
  entrance: any = {
    visible: false,
    load: false,
    date: [],
    entra: 1,
  };
  noBackConfig: any = {};
  lateBackConfig: any = {};
  treeData: Array<object> = [];
  current: string = "";
  devWarnMinute:string = "0";
  scenceId:string = "";
  sceneForm: Object = {};
  allowFamilyPass: Number = 0;
  studentSetTitle: string = "走读生门禁设置";

  timeForm: Object = {
    Mon: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Tue: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Wed: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Thur: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Fri: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Sat: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Sun: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    syncHoliday: 1,
  };

  time2Form: Object = {
    Mon: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Tue: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Wed: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Thur: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Fri: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Sat: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    Sun: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)],
    syncHoliday: 1,
  };

  created() {
    this.getConfig();
    this.getOutorIn();
    getScene().then((res) => {
      debugger;
      const minute = res.data.data.devWarnIntervalMinute
      const id = res.data.data.id
      this.devWarnMinute = minute?minute:"0";
      this.scenceId = id;
    });
  }
  changeBuild(id) {
    this.current = id;
    this.getConfig();
  }
  getConfig() {
    dormitoryConfig({ buildingId: "" }).then((res) => {
      let data = res.data.data;
      data.map((item) => {
        if (item.alertType == "NOT_BACK") {
          this.noBackConfig = item;
        } else if (item.alertType == "LATE_BACK") {
          this.lateBackConfig = item;
        }
      });
    });
  }
  getOutorIn() {
    getScene().then((res) => {
      this.sceneForm = res.data.data;
      this.allowFamilyPass = res.data.data.allowFamilyPass
        ? parseInt(res.data.data.allowFamilyPass)
        : 0;
    });
  }

  public upNum = /[^\d]/g;
  // 分钟只可输入数字
  UpNumber(e: any) {
    var v = e.target.value;
    e.target.value = v.replace(this.upNum, "");
  }

  // 是否允许家长进入
  updateSet(val: any) {
    let param = {
      address: this.sceneForm["address"],
      allowFamilyPass: val + "",
      description: this.sceneForm["description"],
      id: this.sceneForm["id"],
      latitude: this.sceneForm["latitude"],
      longitude: this.sceneForm["longitude"],
      name: this.sceneForm["name"],
    };
    updateFamilyPass(param)
      .then((res) => {
        this.$message.success("设置成功！");
      })
      .catch((err) => {});
  }

  // 结束时间的监听
  endChange(e) {
    let arr: any = [
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ];
    arr.forEach((v) => {
      if (e == v) {
        this.backLate.endTime = "";
        return this.$message.warning("不能选择12:00~18:00之间的值");
      }
    });
    if (this.backLate.startTime) {
      if (
        this.compareDate("17:30", e) &&
        !this.compareDate(this.backLate.startTime, e)
      ) {
        this.backLate.endTime = "";
        return this.$message.warning("晚归时段结束时间不能小于开始时间！");
      }
    }
  }
  // 时分对比
  compareDate(t1, t2) {
    var date = new Date();
    var a = t1.split(":");
    var b = t2.split(":");
    return date.setHours(a[0], a[1]) < date.setHours(b[0], b[1]);
  }
  update() {
    this.backLate.comeBackLate = this.lateBackConfig.status;
    this.backLate.startTime = this.lateBackConfig.startTime;
    this.backLate.endTime = this.lateBackConfig.endTime;
    this.backLate.visible = true;
  }
  //晚归
  comfirmSetBackLate() {
    let param = {
      id: this.lateBackConfig.id,
      startTime: this.backLate.startTime,
      endTime: this.backLate.endTime,
      status: this.backLate.comeBackLate,
      alertType: "LATE_BACK",
    };
    this.backLate.load = true;
    updateDormitoryConfig(param)
      .then((res) => {
        this.$message.success("设置成功！");
        this.backLate.load = false;
        this.handleClose();
      })
      .catch((err) => {
        this.backLate.load = false;
      });
  }
  handleClose() {
    this.backLate.visible = false;
    this.noBack.visible = false;
    this.entrance.visible = false;
    this.getConfig();
  }
  
  submitMinute(){
    let params = {
        id:this.scenceId,
        devWarnMinute: this.devWarnMinute,
      }
    setSchoolCheck(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        } else {
          this.$message({
            message: res.data.messa,
            type: "error",
          });
        }
      })
  }
  // 未归
  updateNoBack() {
    this.noBack.noBackLate = this.noBackConfig.status;
    this.noBack.startTime = this.noBackConfig.startTime;
    this.noBack.endTime = this.noBackConfig.endTime;
    this.noBack.visible = true;
  }
  changeLateBack(val: any) {
    let param = {
      id: this.lateBackConfig.id,
      status: val,
      alertType: "LATE_BACK",
    };
    updateDormitoryConfig(param)
      .then((res) => {
        this.$message.success("设置成功！");
        this.handleClose();
      })
      .catch((err) => {});
  }
  changeNoBack(val: any) {
    let param = {
      id: this.noBackConfig.id,
      status: val,
      alertType: "NOT_BACK",
    };
    // this.noBack.load = true;
    updateDormitoryConfig(param)
      .then((res) => {
        this.$message.success("设置成功！");
        // this.noBack.load = false;
        this.handleClose();
      })
      .catch((err) => {
        // this.noBack.load = false;
      });
  }
  // 宿舍门禁
  updateEntrance(index: any) {
    if (index == 0) {
      this.studentSetTitle = "走读生门禁设置";
    } else if (index == 1) {
      this.studentSetTitle = "住校生门禁设置";
    }
    this.entrance.visible = true;
  }
  comfirmSetEntrance() {}
  // 未归
  confirmSetNoBack() {
    let param = {
      id: this.noBackConfig.id,
      startTime: this.noBack.startTime,
      endTime: this.noBack.endTime,
      status: this.noBack.noBackLate,
    };
    this.noBack.load = true;
    updateDormitoryConfig(param)
      .then((res) => {
        this.$message.success("设置成功！");
        this.noBack.load = false;
        this.handleClose();
      })
      .catch((err) => {
        this.noBack.load = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 82px);
}
.rightContent {
  height: calc(100vh - 82px);
  padding: 25px;
}

.school_setcard {
  width: 730px;
  border: 1px solid #e4e7ed;
  margin-bottom: 20px;
  .header {
    height: 58px;
    border-bottom: 1px solid #e4e7ed;
    padding-left: 13px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #313640;
    line-height: 58px;
  }
  .right {
    float: right;
    padding-right: 40px;
    margin-top: 9px;
  }
  .body {
    padding: 20px;
    height: 224px;
    span {
      color: #606266;
    }
  }
  .iconfont {
    font-size: 14px;
    color: #409eff;
  }
}
.little {
  .body {
    height: 70px;
  }
}
.button {
  width: 82px;
  height: 34px;
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  text-align: center;
  line-height: 33px;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}
.layout-col {
  width: 100%;
  color: #333;
  > div {
    width: 49%;
    min-height: 358px;
    background: #fff;
    padding: 15px;
  }
  .model-title {
    margin-bottom: 10px;
  }
  .model-bottom {
    padding: 20px 10px 0;
    span {
      margin: 5px 10px;
    }
  }
}

.arithmetic {
  display: flex;
  align-items: center;
  i {
    margin: 0 7px;
    color: #bfbfbf;
  }
}
.el-input__inner{
  widows: 40px;
}
</style>