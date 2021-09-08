<template>
  <div>
    <div class="module_title">
      <i class="iconfont icon-Group-3"></i><span class="font_w">预警统计（30天）</span>
    </div>
    <div class="alarm_dev">
      <div class="one_dev">
        <div class="top_item b_right three_color">
          <p class="num">{{ CARE_MAN || 0}}</p>
          <p class="des">关注人员预警</p>
        </div>
        <div class="top_item b_right three_color">
          <p class="num">{{ STRANGER || 0 }}</p>
          <p class="des">陌生人预警</p>
        </div>
        <div class="top_item three_color">
          <p class="num">{{ AREA || 0 }}</p>
          <p class="des">区域预警</p>
        </div>
      </div>
      <div class="line_one"></div>
      <div class="line_two"></div>
      <div class="two_dev">
        <div class="top_item b_right">
          <p class="num">{{ MOUSE || 0 }}</p>
          <p class="des">阳光厨房</p>
        </div>
        <div class="top_item b_right">
          <p class="num">{{ VOICE_ALERT || 0 }}</p>
          <p class="des">声音预警</p>
        </div>
        <div class="top_item ">
          <p class="num">{{ NOT_BACK || 0 }}</p>
          <p class="des">宿舍预警</p>
        </div>
      </div>
      <div class="line_one"></div>
    </div>
  </div>
</template>

<script>
import TWEEN from "@tweenjs/tween.js";

export default {
  components: {},
  props: ["alarmInfo"],

  watch: {
    alarmInfo: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        this.changeNum()
      },
    },
  },

  data() {
    return {
      CARE_MAN: 0,
      STRANGER: 0,
      AREA: 0,
      MOUSE: 0,
      VOICE_ALERT: 0,
      NOT_BACK: 0
    };
  },

  created() {
    window.addEventListener("resize", this.scroll);
    // this.animate();
  },

  methods: {
    changeNum() {
      this.CARE_MAN = this.alarmInfo['CARE_MAN']
      this.STRANGER = this.alarmInfo['STRANGER']
      this.AREA = this.alarmInfo['AREA']
      this.MOUSE = this.alarmInfo['MOUSE'] + this.alarmInfo['CHEF_HAT']
      this.VOICE_ALERT = this.alarmInfo['VOICE_ALERT']
      this.NOT_BACK = this.alarmInfo['NOT_BACK'] + this.alarmInfo['LATE_BACK']

      //  new TWEEN.Tween({
      //     number: 0,
      //     number1: 0,
      //     number2: 0,
      //     number3: 0,
      //     number4: 0,
      //     number5: 0,
      //   })
      //     .to(
      //       {
      //         number: this.alarmInfo['CARE_MAN'],
      //         number1: this.alarmInfo['STRANGER'],
      //         number2: this.alarmInfo['AREA'],
      //         number3: this.alarmInfo['MOUSE'] + this.alarmInfo['CHEF_HAT'],
      //         number4: this.alarmInfo['VOICE_ALERT'],
      //         number5: this.alarmInfo['NOT_BACK'] + this.alarmInfo['LATE_BACK'],
      //       },
      //       3000
      //     )
      //     .onUpdate((tween) => {
      //       this.CARE_MAN = tween.number.toFixed(0);
      //       this.STRANGER = tween.number1.toFixed(0);
      //       this.AREA = tween.number2.toFixed(0);
      //       this.MOUSE = tween.number3.toFixed(0);
      //       this.VOICE_ALERT = tween.number4.toFixed(0);
      //       this.NOT_BACK = tween.number5.toFixed(0);
      //     })
      //     .start();
      //   this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);
      TWEEN.update();
    },
    openDialog(i) {
      //i  0布控 1关注 2身份库 4车辆布控 5手机号布控
      this.visible = true;
      this.type = i;
      switch (i) {
        case 0:
          this.dialogTitle = "布控任务";
          break;
        case 1:
          this.dialogTitle = "关注人员";
          break;
        case 2:
          this.dialogTitle = "身份库";
          break;
        default:
          break;
      }
      let param = {
        visible: this.visible,
        dialogTitle: this.dialogTitle,
        type: i
      }
      this.$emit("open", param)
    },
    openDialogPerson() {
      this.$emit("openPerson")
    },
    close() {
      this.visible = false;
    },
    closePersonDialog() {
      this.personVisible = false;
    }
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
  text-align: right;
  height: grid-width(24);
  font-size: grid-width(20);
  font-family: PingFang SC, PingFang SC-Heavy;
  color: #44ddff;
  margin-bottom: grid-height(10);
  .font_w {
    font-weight: 800;
  }
  i {
    font-size: grid-width(24);
    margin-right: grid-width(8);
    vertical-align: middle;
  }
}
.alarm_dev {
  height: grid-height(211);
  background-image: url("~@/assets/screen/E.png");
  background-size: 100% 100%;
  padding-top: grid-height(30);
  .one_dev,
  .two_dev {
    display: flex;
    font-family: PingFang SC;
    color: #e7ffff;
  }
  .one_dev {
    height: grid-height(81);
  }
  .two_dev {
    height: grid-height(77);
    .num {
      margin-top: grid-height(21);
    }
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
  .three_color {
    color: #ff4165;
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