<template>
  <div>
    <div class="capture_list_dev">
      <div class="capture_list">
        <div class="title">
          <img src="../../assets/screen/capture.png" />
          <p class="title_n">智能抓拍</p>
        </div>
        <div class="list" id="capture_list" @mouseenter="mouse_one()">
          <div class="list_item" v-for="item in captureList" :key="item.id">
            <img :src="item.pic" />
            <p class="name" :title="item.name">{{ item.name || '陌生人' }}</p>
            <p class="time" :title="item.timeString.substring(5,19)">{{ item.timeString.substring(5,19) }}</p>
          </div>
        </div>
      </div>
      <div class="aidoor_list">
        <div class="title">
          <img src="../../assets/screen/menjin.png" />
          <p class="title_n">门禁通行</p>
        </div>
        <div class="list" id="aidoor_list" @mouseenter="mouse_two()">
          <div class="list_item" v-for="item in accessList" :key="item.id">
            <img :src="item.scenceUser.face" />
            <p class="name" v-if='item.scenceUser' :title="item.scenceUser.name">{{ item.scenceUser.name || '' }}</p>
            <p class="name" v-if='item.visitorInfo' :title="item.visitorInfo.name">{{ item.visitorInfo.name || '' }}</p>
            <p class="time" :title="item.passTime.substring(5,19)">{{ item.passTime.substring(5,19) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["captureList", "accessList"],

  watch: {
    captureList: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
      },
    },
    accessList: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
      },
    },
  },

  data() {
    return {
      domObj1: null,
      domObj2: null
    };
  },

  created() { },

  beforeDistroy() {
    if (!this.domObj1 && !this.domObj2) return
    this.domObj1.removeEventListener('DOMMouseScroll', this.mouseScroll)
    this.domObj1.removeEventListener('mousewheel', this.mouseScroll)
    this.domObj2.removeEventListener('DOMMouseScroll', this.mouseScroll)
    this.domObj2.removeEventListener('mousewheel', this.mouseScroll)
  },

  methods: {
    mouse_one() {
      this.scrollFunction(this.domObj1, 'capture_list')
    },
    mouse_two() {
      this.scrollFunction(this.domObj2, 'aidoor_list')
    },
    scrollFunction(obj, id) {
      obj = document.getElementById(id)
      if (obj.attachEvent) {
        obj.attachEvent('onmousewheel', this.mouseScroll(obj))
      } else if (obj.addEventListener) {
        obj.addEventListener('DOMMouseScroll', this.mouseScroll(obj), false)
      }
      obj.onmousewheel = obj.onmousewheel = this.mouseScroll(obj)
    },
    mouseScroll(obj) {
      return function () {
        let e = window.event || document.all ? window.event : arguments[0] ? arguments[0] : event
        let detail, moveForwardStep, moveBackStep
        let step = 0
        if (e.wheelDelta) { // google 下滑负数： -120
          detail = e.wheelDelta
          moveForwardStep = -1
          moveBackStep = 1
        } else if (e.detail) { // firefox 下滑正数：3
          detail = event.detail
          moveForwardStep = 1
          moveBackStep = -1
        }
        step = detail > 0 ? moveForwardStep * 100 : moveBackStep * 100
        e.preventDefault()
        obj.scrollLeft = obj.scrollLeft + step
      }
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

.capture_list_dev {
  height: grid-height(324);
  width: grid-width(979);
  background-image: url("~@/assets/screen/D.png");
  background-size: 100% 100%;
  padding: grid-height(16) grid-width(37);
}
.capture_list,
.aidoor_list {
  display: flex;
  height: grid-height(144);
  width: 100%;
  .title {
    width: grid-width(24);
    text-align: center;
    margin-right: grid-width(16);
    img {
      width: grid-width(24);
      height: grid-width(24);
    }
  }
  .title_n {
    font-size: grid-width(20);
    line-height: grid-height(24);
    font-family: PingFang SC, PingFang SC-Heavy;
    font-weight: 800;
    color: #44ddff;
    letter-spacing: grid-width(1);
  }
  .list {
    flex: 1;
    display: flex;
    overflow-y: auto;
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    height: 0;
  }
}
.aidoor_list {
  margin-top: grid-height(10);
}

.list_item {
  height: grid-height(140);
  width: grid-width(106);
  background: #0b172b;
  padding: grid-height(6) grid-width(9);
  margin-left: grid-width(10);
  background-image: url("~@/assets/screen/list_item.png");
  background-size: 100% 100%;
  img {
    width: grid-width(88);
    height: grid-width(88);
  }
  .name {
    font-size: grid-width(14);
    line-height: 14px;
    font-family: PingFang SC, PingFang SC-Heavy;
    font-weight: 800;
    color: #67d2ff;
    letter-spacing: grid-width(1);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .time {
    font-size: grid-width(10);
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.9);
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #67d2ff;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    width: grid-width(97);
  }
}
</style>