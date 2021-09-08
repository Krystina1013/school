<template>
  <div>
    <div class="module_title">
      <i class="iconfont icon-Group-4"></i><span class="font_w">智能抓拍统计</span>
    </div>
    <div class="capture_dev">
      <lineChart :id="'capture_line'" :value="captureInfo" style="height:100%"></lineChart>
    </div>
  </div>
</template>

<script>
import lineChart from "./components/lineChart.vue"

export default {
  components: { lineChart },
  props: ["captureInfo"],

  watch: {
    captureInfo: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        console.log('new', newVal)
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
  margin-top: grid-height(6);
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
.capture_dev {
  height: grid-height(197);
  width: grid-width(515);
  background-image: url("~@/assets/screen/C.png");
  background-size: 100% 100%;
}
</style>