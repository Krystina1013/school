<template>
  <div class="pass">
    <div class="fun-data">
      <div class="data-statistics" v-for="(item, index) in routes" :key="index">
        <div class="fun-title" v-if="!item.hidden && item.children">
          <div
            @click="showChildren(item.children, item.meta.title, item.path)"
            v-if="item.meta && item.meta.title && !noDialog(item.name)"
          >
            <div class="item">
              <div class="" >
                <i v-if="item.meta && item.meta.icon" :class="['page-icon','page-'+item.name]"></i>
              </div>
              <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
            </div>
          </div>
          <div v-else>
            <div class="item">
              <router-link :to="{ name: item.name }">
                <div >
                  <i v-if="item.meta && item.meta.icon" :class="['page-icon','page-'+item.name]"></i>
                </div>
                <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      width="500px"
      style="overflow: hidden"
      center
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <div class="data-statistics childMenu" v-for="(item, index) in childrenRoute" :key="index">
        <div class="fun-title" v-if="!item.hidden">
          <router-link
            v-if="item.meta && !item.meta.hidden && item.meta.title"
            :to="{ path: item.parentPath + '/' + item.path }"
          >
            <div class="item">
              <div class="sing-svg" :style="{ backgroundColor: item.meta.bg_color }">
                <i v-if="item.meta && item.meta.icon" :class="['iconfont', item.meta.icon]"></i>
              </div>
              <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class ActionManage extends Vue {
  dialogVisible: boolean = false;
  title: string = "";
  childrenRoute: Array<Object> = [];
  @Getter("router") router: Array<object>;
  get routes() {
    // const NewRoute = [].concat(this.$router['options'].routes)
    this.router.forEach((ele, index) => {
      if (ele["name"] === "vistor") {
        this.router.splice(index, 1);
      }
    });
    // return this.router;
    console.log(this.router);
    return [this.router[2], this.router[3], this.router[4]];
  }
  handleClose() {
    this.dialogVisible = false;
  }
  showChildren(childRoute: Array<Object>, title: string, parentPath: string) {
    this.title = title;
    childRoute.forEach(element => {
      element["parentPath"] = parentPath;
    });
    this.childrenRoute = childRoute;
    this.dialogVisible = true;
  }
  // 大屏统计 报表管理 访客登记 不需弹框
  noDialog(routeName) {
    const noDialogList = ["screen", "vistor", "inform", "device", "alarm","person"];
    return noDialogList.includes(routeName);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$size: 48px;
$color: #ffffff;
.routerView{
  background: #f7f7f7;
}
p {
  margin: 5px;
}

.scene-house {
  font-size: 26px;
  margin-right: 4px;
}

.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.fun-data {
  display: flex;
  flex-wrap: wrap;
  // padding: 46px 10px 5px 10px;
}

.data-statistics {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.fun-title {
  font-size: 14px;
  white-space: nowrap;
  &:hover {
    cursor: pointer;
  }
}

.item-text {
  font-size: 16px;
  margin-top: 8px;
  text-align: center;
  color: #515B70;
  // line-height: 68px;
  // margin-left: 20px;
}

.item {
  font-size: 14px;
  width: 136px;
  height: 136px;
  padding: 0;
  background: #fff;
  // margin: 5px 21px;
  background: #fff;
  box-shadow: 0 12px 20px -10px rgba(173,173,173,0.5);
  border-radius: 8px;
  text-align: center;
  margin-right:20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.iconfont {
  font-size: $size;
  color: $color;
}

.sing-svg {
  width: 100px;
  text-align: center;
  line-height: 100px;
  height: 100px;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0 rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.childMenu {
  display: inline-block;
}
.page-icon {
  display: inline-block;
  width: 54px;
  height: 54px;
  background-repeat: no-repeat;
  background-size: cover;
}
.page-person {
  background-image: url("../../../assets/page-person.png");
}
.page-traffic {
  background-image: url("../../../assets/page-car.png");
}
.page-device {
  background-image: url("../../../assets/page-device.png");
}
.page-inform {
  background-image: url("../../../assets/page-inform.png");
}
.page-alarm {
  background-image: url("../../../assets/page-alarm.png");
}
.page-system {
  background-image: url("../../../assets/page-system.png");
}
.page-screen {
  background-image: url("../../../assets/page-screen.png");
}
.page-statementManage {
  background-image: url("../../../assets/page-statementManage.png");
}
</style>
