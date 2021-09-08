<template>
  <div class="contentOut">
    <div class="navMenu" id="navMenu" v-if="status">
      <siderBar @MenuStatus="changeStatus" />
      <!-- <NavMenu @MenuStatus="changeStatus" /> -->
      <div class="logo">
        <span class="iconfont logo-icon icon-logo"></span>
        <span class="logo-span">校园智安管理系统1.7.0</span>
      </div>
    </div>
    <div
      class="routerView"
      id="routerView1"
      :style="{ width: disableMenu ? '100%' : 'calc(100% - 222px)' }"
    >
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
      <!-- <el-row>
        <el-col :span="24">
          <div class="footer">
            <p class="footer-title">南风云智安管理系统</p>
          </div>
        </el-col>
      </el-row> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import NavMenu from "@/components/NavMenu/index.vue";
import siderBar from "./siderBar.vue";
import { systemSetting } from "@/api/police";
@Component({
  components: {
    NavMenu,
    siderBar,
  },
})
export default class AppMain extends Vue {
  private disableMenu: Boolean = true;
  timeOut: any = null;
  get status(): boolean {
    const whiteList = ["dashboard", "statistics"];
    return !whiteList.includes(this.$route.name as string);
  }

  created() {
    this.timeOut = null;
    // 1分钟一次预警未读
    this.getUnchecedCount();

    this.timeOut = setInterval(() => {
      this.getUnchecedCount();
    }, 60000);
    this.routeChange();
    this.getSet();
  }
  getSet() {
    systemSetting().then((res) => {
      let data = res.data.data.data;
      let similarity = {
        high: data.high,
        medium: data.medium,
        low: data.low,
      };
      let similarityList = [
        { label: `高（${data.high}%）`, value: data.high },
        { label: `中（${data.medium}%）`, value: data.medium },
        { label: `低（${data.low}%）`, value: data.low },
      ];
      localStorage.setItem("similarity", JSON.stringify(similarity));
      localStorage.setItem("similarityList", JSON.stringify(similarityList));
    });
  }
  async getUnchecedCount() {
    /** @description 未读警报信息 */
      this.$store.dispatch("GET_WARNING").then( res => {
        // window.clearInterval(this.timeOut);
      }).catch(err =>{
        if (err.code == 401 || err.code == 403){
          window.clearInterval(this.timeOut);
        }
      })
    // .catch(err => {
      
    // });
  }
  changeStatus(status) {
    const wW = document.documentElement.clientWidth;
    const dom1 = document.getElementById("routerView1") as HTMLElement;
    const dom = document.getElementById("navMenu") as HTMLElement;
    if (!status) {
      dom.style.width = "58px";
      dom1.style.width = wW - 70 + "px";
      dom1.style.marginLeft = "58px";
    } else {
      dom.style.width = "180px";
      dom1.style.width = wW - 192 + "px";
      dom1.style.marginLeft = "180px";
    }
  }
  @Watch("$route")
  routeChange() {
    const whiteList = ["dashboard", "statistics"];
    // const dom = document.getElementById("routerView1") as HTMLElement;
    if (whiteList.includes(this.$route.name as string)) {
      this.disableMenu = true;
    } else {
      this.disableMenu = false;
    }
  }
}
</script>
>
<style lang="scss">
.contentOut {
  width: 100%;
  display: flex;
  // box-shadow: inset 0px 15px 10px -15px lightgray;
}
.navMenu {
  height: calc(100vh - 101px);
  background: #313640;
  color: #fff;
  overflow-y: auto;
  flex: none;
  transition: all linear 0.3s;
  position: fixed;
  z-index: 5;
  // width: 177px;
  // box-shadow: 2px 0px 10px 2px lightgray;
}
.routerView {
  height: calc(100vh - 51px);
  overflow-x: hidden;
  overflow-y: auto;
  margin-left: 222px;
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave {
  opacity: 1;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0.5s;
}
.footer {
  width: 100%;
  height: 70px;
  padding: 20px 0;
  /* border-top: 1px solid rgba(71, 71, 88, 0.15); */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 24px;
}
.footer-title {
  color: #909399;
}
.logo{
  background: #313640;
  color:rgba(255,255,255,0.2);
  height: 50px;
  font-size: 14px;
  position: fixed;
  width: 222px;
  bottom:0;
  left: 0;
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: center;
  .logo-icon{
    margin-top:2px;
   font-size: 16px;
  }
  // .logo-span{
  //   margin-right: 12px;
  // }
}
</style>
