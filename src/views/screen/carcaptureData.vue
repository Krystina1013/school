<template>
  <div>
    <div class="module_title">
      <i class="iconfont icon-Group"></i><span class="font_w">车辆抓拍统计</span>
    </div>
    <div class="carcapture_dev">
      <div class="dev_title">
        <div class="line_dev car"></div>
        <p class="name car_n">机动车</p>
        <div class="line_dev nocar"></div>
        <p class="name nocar_n">非机动车</p>
      </div>
      <carlineChart :id="'car_capture_line'" :value="carcaptureInfo" style="height:100%"></carlineChart>
    </div>
  </div>
</template>

<script>
import carlineChart from "./components/carlineChart.vue"

export default {
  components: { carlineChart },
  props: ["carcaptureInfo"],

  watch: {
    carcaptureInfo: {
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
.carcapture_dev {
  height: grid-height(197);
  width: grid-width(515);
  background-image: url("~@/assets/screen/C.png");
  background-size: 100% 100%;
  .dev_title {
    position: absolute;
    margin-top: grid-height(20);
    right: grid-width(55);
    display: flex;
    align-items: center;
  }
  .line_dev {
    width: grid-width(30);
    height: grid-height(1);
    margin-left: grid-width(35);
  }
  .car {
    background: #51c9fc;
  }
  .nocar {
    background: #50cd91;
  }
  .name {
    font-size: grid-width(14);
    font-weight: 800;
    margin-left: grid-width(7);
  }
  .car_n {
    color: #51c9fc;
  }
  .nocar_n {
    color: #50cd91;
  }
}
</style>