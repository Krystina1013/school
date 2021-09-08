<template>
  <div>
    <div class="module_title">
      <i class="iconfont icon-Group-2"></i><span class="font_w">学校基础数据</span>
    </div>
    <div class="module_dev">
      <div class="one_dev">
        <div class="top_item b_right">
          <p class="num">{{ studentCount || 0}}</p>
          <p class="des">学生人数</p>
        </div>
        <div class="top_item b_right one_color">
          <p class="num">{{ residentStudent || 0}}</p>
          <p class="des">住校人数</p>
        </div>
        <div class="top_item">
          <p class="num">{{ teacherCount || 0 }}</p>
          <p class="des">教师人数</p>
        </div>
      </div>
      <div class="line_one"></div>
      <div class="line_two"></div>
      <div class="two_dev">
        <div class="top_item b_right two_color">
          <p class="num">{{ inSchoolStudent || 0 }}</p>
          <p class="des">在校人数</p>
        </div>
        <div class="top_item b_right three_color">
          <p class="num">{{ outSchoolStudent || 0 }}</p>
          <p class="des">离校人数</p>
        </div>
        <div class="top_item ">
          <p class="num">{{ workerCount || 0 }}</p>
          <p class="des">职工人数</p>
        </div>
      </div>
      <div class="line_one"></div>
      <div class="three_dev">
        <div class="bottom_item">
          <p class="num">{{ teachingBuildingCount || 0 }}</p>
          <p class="des">教学楼</p>
        </div>
        <div class="bottom_item">
          <p class="num">{{ classRoomCount || 0 }}</p>
          <p class="des">教室</p>
        </div>
        <div class="bottom_item">
          <p class="num">{{ dormitoryBuildingCount || 0 }}</p>
          <p class="des">宿舍</p>
        </div>
        <div class="bottom_item">
          <p class="num">{{ dormitoryRoomCount || 0 }}</p>
          <p class="des">宿舍房间</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TWEEN from "@tweenjs/tween.js";

export default {
  components: {},
  props: ["basicInfo"],

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
      residentStudent: 0,
      teacherCount: 0,
      inSchoolStudent: 0,
      outSchoolStudent: 0,
      workerCount: 0,
      teachingBuildingCount: 0,
      classRoomCount: 0,
      dormitoryBuildingCount: 0,
      dormitoryRoomCount: 0,
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
      })
        .to(
          {
            number: this.basicInfo.studentCount,
            number1: this.basicInfo.residentStudent,
            number2: this.basicInfo.teacherCount,
            number3: this.basicInfo.inSchoolStudent,
            number4: this.basicInfo.outSchoolStudent,
            number5: this.basicInfo.workerCount,
            number6: this.basicInfo.teachingBuildingCount,
            number7: this.basicInfo.classRoomCount,
            number8: this.basicInfo.dormitoryBuildingCount,
            number9: this.basicInfo.dormitoryRoomCount,
          },
          3000
        )
        .onUpdate((tween) => {
          this.studentCount = tween.number.toFixed(0);
          this.residentStudent = tween.number1.toFixed(0);
          this.teacherCount = tween.number2.toFixed(0);
          this.inSchoolStudent = tween.number3.toFixed(0);
          this.outSchoolStudent = tween.number4.toFixed(0);
          this.workerCount = tween.number5.toFixed(0);
          this.teachingBuildingCount = tween.number6.toFixed(0);
          this.classRoomCount = tween.number7.toFixed(0);
          this.dormitoryBuildingCount = tween.number8.toFixed(0);
          this.dormitoryRoomCount = tween.number9.toFixed(0);
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
  height: grid-height(285);
  background-image: url("~@/assets/screen/A.png");
  background-size: 100% 100%;
  padding: grid-height(12) 0;
  .one_dev,
  .two_dev,
  .three_dev {
    display: flex;
    font-family: PingFang SC;
    color: #e7ffff;
  }
  .one_dev {
    height: grid-height(86);
    padding-top: grid-height(16);
  }
  .two_dev {
    height: grid-height(86);
    .num {
      margin-top: grid-height(16);
    }
  }
  .three_dev {
    height: grid-height(68);
    margin-top: grid-height(13);
    padding-left: grid-width(15);
  }

  .num {
    height: grid-height(32);
    line-height: grid-height(32);
    font-size: grid-width(32);
    font-weight: 800;
  }
  .des {
    font-size: grid-width(18);
    font-weight: 400;
    margin-top: 0;
  }

  .b_right {
    border-right: 1px dashed rgba(82, 204, 255, 0.1) !important;
  }

  .top_item {
    width: grid-width(170);
    text-align: center;
  }
  .one_color {
    color: #67d2ff;
  }
  .two_color {
    color: #22ebb9;
  }
  .three_color {
    color: #ff4165;
  }
  .bottom_item {
    width: grid-width(107);
    height: grid-height(68);
    margin-left: grid-width(10);
    background: rgba(2, 8, 22, 0.45);
    text-align: center;
  }

  .line_one {
    position: absolute;
    width: grid-width(436);
    height: grid-height(1);
    left: grid-width(36);
    border-top: 1px dashed #52ccff;
    opacity: 0.1;
  }
}
</style>