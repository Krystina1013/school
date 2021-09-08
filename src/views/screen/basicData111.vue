<template>
  <div>
    <div class="module_title">
      <i class="iconfont icon-Group-2"></i><span class="font_w">学校基础数据</span>
    </div>
    <div class="module_dev">
      <div class="top_dev">
        <div class="top_item border">
          <p class="des one_color">学生总人数</p>
          <p class="num one_color">{{ studentCount || 0}}</p>
        </div>
        <div class="top_item item_mid border">
          <p class="des one_color">教师总人数</p>
          <p class="num one_color">{{ teacherCount || 0}}</p>
        </div>
        <div class="top_item item_rig border">
          <p class="des one_color">职工总人数</p>
          <p class="num one_color">{{ workerCount || 0}}</p>
        </div>
      </div>
      <div class="top_dev">
        <div class="top_item border">
          <p class="des two_color">在校学生</p>
          <p class="num two_color">{{ inSchoolStudent || 0}}</p>
        </div>
        <div class="top_item item_mid border">
          <p class="des two_color">在校老师</p>
          <p class="num two_color">{{ teacherInCount || 0}}</p>
        </div>
        <div class="top_item item_rig border">
          <p class="des two_color">在校职工</p>
          <p class="num two_color">{{ workerInCount || 0}}</p>
        </div>
      </div>
      <div class="top_dev">
        <div class="top_item">
          <p class="des three_color">离校学生</p>
          <p class="num three_color">{{ outSchoolStudent || 0}}</p>
        </div>
        <div class="top_item item_mid">
          <p class="des three_color">离校老师</p>
          <p class="num three_color">{{ teacherOutCount || 0}}</p>
        </div>
        <div class="top_item item_rig">
          <p class="des three_color">离校职工</p>
          <p class="num three_color">{{ workerOutCount || 0}}</p>
        </div>
      </div>
      <div class="line_one"></div>
      <div class="bottom_dev">
        <div class="bottom_item">
          <span class="des left_d four_color">请假学生</span>
          <span class="num right four_color">{{ leaveStudentCount }}</span>
        </div>
        <div class="bottom_item">
          <span class="des left_d one_color">今日访客</span>
          <span class="num right one_color">{{ visitorCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TWEEN from "@tweenjs/tween.js";

export default {
  components: {},
  props: ["basicInfo", 'visitor'],

  watch: {
    basicInfo: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        this.changeNum()
      },
    },
  },

  data() {
    return {
      studentCount: 0,
      inSchoolStudent: 0,
      outSchoolStudent: 0,

      teacherCount: 0,
      teacherInCount: 0,
      teacherOutCount: 0,

      workerCount: 0,
      workerInCount: 0,
      workerOutCount: 0,

      leaveStudentCount: 0,
      visitorCount: 0
    };
  },

  created() {
    window.addEventListener("resize", this.scroll);
    this.animate();
  },

  methods: {
    changeNum() {
      new TWEEN.Tween({
        number: 0,
        number1: 0,
        number2: 0,
        number3: 0,
        number4: 0,
        number5: 0,
        number6: 0,
        number7: 0,
        number8: 0,
        number9: 0,
        number10: 0,
      })
        .to(
          {
            number: this.basicInfo.studentCount,
            number1: this.basicInfo.teacherCount,
            number2: this.basicInfo.workerCount,
            number3: this.basicInfo.inSchoolStudent,
            number4: this.basicInfo.teacherInCount,
            number5: this.basicInfo.workerInCount,
            number6: this.basicInfo.outSchoolStudent,
            number7: this.basicInfo.teacherOutCount,
            number8: this.basicInfo.workerOutCount,
            number9: this.basicInfo.leaveStudentCount,
            number10: this.visitor
          },
          3000
        )
        .onUpdate((tween) => {
          this.studentCount = tween.number.toFixed(0);
          this.teacherCount = tween.number1.toFixed(0);
          this.workerCount = tween.number2.toFixed(0);
          this.inSchoolStudent = tween.number3.toFixed(0);
          this.teacherInCount = tween.number4.toFixed(0);
          this.workerInCount = tween.number5.toFixed(0);
          this.outSchoolStudent = tween.number6.toFixed(0);
          this.teacherOutCount = tween.number7.toFixed(0);
          this.workerOutCount = tween.number8.toFixed(0);
          this.leaveStudentCount = tween.number9.toFixed(0);
          this.visitorCount = tween.number10.toFixed(0);
        })
        .start();
      this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);
      TWEEN.update();
    },
  },
};
</script>

<style lang="scss" scoped>
$width: 2080;
$height: 1080;
@function grid-width($n) {
  @return ($n/$width) * 100vw;
}
@function grid-height($n) {
  @return ($n/$height) * 100vh;
}

.module_title {
  font-size: grid-width(20);
  font-family: PingFang SC, PingFang SC-Heavy;
  color: #44ddff;
  margin-bottom: grid-height(4);
  .font_w {
    font-weight: 800;
  }
  i {
    font-size: grid-width(24);
    margin-right: grid-width(8);
    vertical-align: middle;
  }
}
.module_dev {
  height: grid-height(289);
  background-image: url("~@/assets/screen/A.png");
  background-size: 100% 100%;
  padding-top: grid-height(22);
  padding-left: grid-width(18);
  .top_dev {
    height: grid-height(65);
    display: flex;
  }
  .top_item {
    width: grid-width(136);
    padding-top: grid-height(8);
    padding-left: grid-width(20);
  }
  .item_mid {
    margin-left: grid-width(24);
  }
  .item_rig {
    margin-left: grid-width(34);
  }
  .border {
    border-bottom: 1px solid rgba(82, 204, 255, 0.1);
  }
  .des {
    font-size: grid-width(18);
    line-height: grid-width(18);
    font-weight: 400;
    margin: 0;
    margin-bottom: grid-height(5);
  }
  .num {
    height: grid-height(21);
    font-size: grid-width(28);
    font-family: PingFang SC, PingFang SC-Heavy;
    line-height: grid-width(28);
    font-weight: 800;
    margin: 0;
  }
  .left_d {
    float: left;
    font-weight: 500;
    line-height: grid-height(56);
    margin-right: 15px;
  }
  .right {
    margin-top: grid-height(17);
    font-size: grid-width(32);
    font-weight: 800;
    letter-spacing: 11px;
    line-height: grid-height(56);
  }

  .one_color {
    color: #44ddff;
  }
  .two_color {
    color: #22ebb9;
  }
  .three_color {
    color: #dcfdfd;
  }
  .four_color {
    color: #ff4165;
  }

  .line_one {
    width: grid-width(474);
    height: grid-height(1);
    border-top: 1px solid;
    border-image: linear-gradient(0deg, #355287 0%, #213a68 100%) 1 1;
  }
  .bottom_dev {
    display: flex;
    height: grid-height(56);
  }
  .bottom_item {
    width: grid-width(234);
    background: rgba(2, 8, 22, 0.45);
    margin-right: grid-width(6);
    padding-left: grid-width(14);
  }
}
</style>