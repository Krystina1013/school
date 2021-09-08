<template>
  <div v-if="centerDialogVisible"   class="big-img-box"  :style="itemStyle">
    
    <p class="big-title">{{ bigTitle }}</p>
    <img class="big-image" :src="bigImg" alt="" />

    <!-- <i class="el-icon-close" @click="closeBigImg"></i> -->
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins, Emit, Watch } from "vue-property-decorator";
@Component
export default class BigImg extends Vue {
  @Prop({ default: "图片" }) bigTitle: string;
  @Prop({ default: false }) centerDialogVisible: Boolean;
  @Prop() bigImg: string;
  itemStyle: any = '';
  showImg: boolean = false;

  @Emit("closeBigImg")
  closeBigImg() {
    return false;
  }
  @Watch('centerDialogVisible')
  changeVisiblle (o,n) {
      let posX = 0, posY = 0;
      let event = window.event as any;
      if (event.pageX || event.pageY) {
          posX = event.pageX;
          posY = event.pageY;
      } else if (event.clientX || event.clientY) {
          posX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
          posY = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
      }
        console.log(posX)
      this.itemStyle = {'left': (posX - 330)  +'px','top': (posY - 100)+'px',  'position': 'fixed','z-index': 10000};

    
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.big-img-box {
  width: 260px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 0 25px 40px 25px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  background: #fff;
  
}
.big-title {
  margin: 10px 0;
  font-size: 18px;
}
.big-image {
  width: 200px;
  height: 200px;
  vertical-align: middle;
  object-fit: contain;
}

.el-icon-close {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
