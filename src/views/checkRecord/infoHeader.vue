<template>
  <div class="info_header">
    <p><i :class="['iconfont', icon]"></i> {{ title }}</p>
    <h3>{{ value }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      default: ""
    },
    title: {
      default: ""
    },
    value: {
      default: 0
    }
  },

  data() {
    return {
    }
  }
}
</script> 

<style lang="scss" scoped>
.info_header {
  height: 92px;
  width: calc(20vw - 62.5px);
  background-color: #fff;
  border: 1px solid #e4e7ed;
  padding: 13px;
  margin-right: 15px;
  .iconfont {
    font-size: 20px;
    color: #409eff;
  }
  p {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    color: #000000;
  }
  p > i {
    display: inline-block;
    vertical-align: middle;
  }
  h3 {
    float: right;
    font-size: 36px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #409eff;
    margin-right: 5px;
  }
}
</style>