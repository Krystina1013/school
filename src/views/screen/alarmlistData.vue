<template>
  <div>
    <div class="module_title">
      <i class="iconfont icon-Group-3"></i><span class="font_w">最新预警</span>
    </div>
    <div class="alarm_list_dev">
      <div class="list_dev">
        <div class="alarm_item" v-for="item in alarmList" :key="item.id">
          <div class="item_img"><img :src="item.image" /></div>
          <div class="item_des">
            <p class="type">{{ item.warnType | warnTypeFilter}}</p>
            <p class="name">预警位置：<span class="num">{{ item.deviceName }}</span></p>
            <p class="name">预警时间：<span class="num">{{ item.warnTime }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  props: ["alarmList"],

  watch: {
    alarmList: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
      },
    },
  },

  filters: {
    warnTypeFilter(type) {
      const data = {
        DEVICE_DOWN: "设备离线预警",
        STRANGER: "陌生人预警",
        NOT_BACK: "未归预警",
        LATE_BACK: "晚归预警",
        CARE_MAN: "关注人员预警",
        AREA: "区域预警",
        MOUSE: "厨房老鼠预警",
        CHEF_HAT: "厨师帽预警",
        // CHEF_CLOTHES: "厨师服预警",
        // FACE_MASK: "厨师口罩预警",
        VOICE_ALERT: "声音预警",
      };
      return data[type];
    },
  },

  data() {
    return {
    };
  },

  created() {
    window.addEventListener("resize", this.scroll);
  },

  methods: {
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
  margin-top: grid-height(12);
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
.alarm_list_dev {
  height: grid-height(701);
  background-image: url("~@/assets/screen/F.png");
  background-size: 100% 100%;
  padding: grid-height(28) grid-width(16) grid-height(18);
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 0;
  }
}
.list_dev {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.alarm_item {
  width: grid-width(480);
  height: grid-height(120);
  margin-bottom: grid-height(10);
  display: flex;
  padding: grid-height(12) grid-width(12);
  background-image: url("~@/assets/screen/G.png");
  background-size: 100% 100%;
  .item_img {
    width: grid-height(96);
    height: grid-height(96);
    margin-right: grid-width(10);
  }
  img {
    width: 100%;
    height: 100%;
  }
  .item_des {
    flex: 1;
    height: grid-height(96);
  }
  .type {
    height: grid-height(18);
    line-height: grid-height(18);
    font-size: grid-width(18);
    font-family: PingFang SC, PingFang SC-Heavy;
    font-weight: 800;
    color: #ff4165;
    letter-spacing: grid-width(1);
  }
  .name {
    font-size: grid-width(18);
    height: grid-height(18);
    line-height: grid-height(18);
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #67d2ff;
    margin-top: grid-height(16);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .num {
    margin-left: grid-width(8);
    font-weight: 800;
    letter-spacing: grid-width(1);
  }
}
</style>