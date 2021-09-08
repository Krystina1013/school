<template>
  <div>
    <div class="module_title">
      <i class="iconfont icon-Group-1"></i><span class="font_w">设备运行状态</span>
    </div>
    <div class="device_dev">
      <div class="device_item">
        <div class="chart_item">
          <div class="chart_back"></div>
          <pieChart style="height:100%" :value="deviceInfo.Camera" :color="'#52CCFF'"></pieChart>
        </div>
        <div class="chart_des">
          <p class="pie_title">摄像机</p>
          <p class="pie_des" style="color:#00EEFF">在线<span class="num">{{ deviceInfo.onlineCamera }}</span></p>
          <p class="pie_des">离线<span class="num">{{ deviceInfo.outlineCamera }}</span></p>
        </div>
      </div>
      <div class="line_two"></div>
      <div class="device_item">
        <div class="chart_item">
          <div class="chart_back_2"></div>
          <pieChart style="height:100%" :value="deviceInfo.Device" :color="'#50CD91'"></pieChart>
        </div>
        <div class="chart_des">
          <p class="pie_title">智能识别门禁</p>
          <p class="pie_des" style="color:#00EEFF">在线<span class="num">{{ deviceInfo.onlineDevice }}</span></p>
          <p class="pie_des">离线<span class="num">{{ deviceInfo.outlineDevice }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pieChart from "./components/pieChart.vue"

export default {
  components: { pieChart },
  props: ["deviceInfo"],

  watch: {
    deviceInfo: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
      },
    },
  },

  data() {
    return {
    };
  },

  created() {

  },

  methods: {
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
  font-size: grid-width(20);
  font-family: PingFang SC, PingFang SC-Heavy;
  color: #44ddff;
  margin-top: grid-height(8);
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
.device_dev {
  height: grid-height(155);
  width: grid-width(515);
  background-image: url("~@/assets/screen/B.png");
  background-size: 100% 100%;
  display: flex;
  padding: grid-height(28) 0;
  .device_item {
    width: grid-width(249);
    display: flex;
  }
}

.chart_item {
  position: relative;
  width: grid-height(99);
  height: grid-height(99);
  margin-left: grid-width(28);
  .chart_back,
  .chart_back_2 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .chart_back {
    height: grid-height(34);
    width: grid-height(31);
    background-image: url("~@/assets/screen/camera.png");
    background-size: 100% 100%;
  }
  .chart_back_2 {
    height: grid-height(34);
    width: grid-height(26);
    background-image: url("~@/assets/screen/aidoor.png");
    background-size: 100% 100%;
  }
}
.chart_des {
  padding: grid-height(7) 0 0 grid-width(7);
  .pie_title {
    height: grid-height(16);
    line-height: grid-height(16);
    font-size: grid-width(16);
    font-family: PingFang SC, PingFang SC-Heavy;
    font-weight: 800;
    color: #ccf6ff;
    margin-bottom: grid-height(19);
  }
  .pie_des {
    font-size: grid-width(14);
    line-height: grid-height(14);
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    margin-bottom: grid-height(8);
    color: #7a93cc;
  }
  .num {
    height: grid-height(20);
    line-height: grid-height(20);
    font-size: grid-width(20);
    font-weight: 800;
    margin-left: grid-width(4);
  }
}
.line_two {
  height: grid-height(100);
  width: grid-width(1);
  border-right: 1px dashed rgba(82, 204, 255, 0.3);
}
</style>