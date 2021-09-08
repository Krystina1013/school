<template>
  <div class="f4">
    <div class="company-con fff">
      <div class="img-con">
        <img class="img" src="../../assets/about-banner.png" />
      </div>

      <div>
        <div class="title"><span class="title-icon"></span><span class="text">公司介绍</span></div>
        <div class="word-con">
          <span class="bold">南风云数字技术有限公司</span>
          <span>（简称“南风云”），是一家致力于公共安全领域，为客户提供基于计算机视觉理解，动态视频特征信息提取，图像识别，
            数字传感分析和人机交互的产品和整体解决方案的人工智能技术企业，致力于整合人工智能在公共安全防卫领域的发展运用的未来。公司拥有人工智能领域前治技术，
            包括多种自主知识产权的核心算法和计算模型，智能识别前端图像采集分析系统，光纤传感等核心技术，同时在物联网应用，大数据分析应用方面有丰富的经验和转化的技术力量。</span>
        </div>

      </div>
    </div>
    <div class="company-product fff">
      <div class="title"><span class="title-icon"></span><span class="text">产品介绍</span></div>
      <ul class="products-con">
        <li class="one-pro">
          <div class="one-left">
            <img class="left-img" src="../../assets/product-1.png" />
          </div>
          <div class="one-right">
            <p class="one-title">智慧平安校园</p>
            <div class="one-text">提供人脸门禁，宿舍管理、校园监控、周界防护预警、重点人员预警、阳光厨房等功能。</div>
          </div>
        </li>
        <li class="one-pro">
          <div class="one-left">
            <img class="left-img" src="../../assets/product-2.png" />
          </div>
          <div class="one-right">
            <p class="one-title">智慧社区</p>
            <div class="one-text">提供人脸识别门禁、住户管理、实时监控、人像抓拍、预警管理等功能。</div>
          </div>
        </li>
        <li class="one-pro">
          <div class="one-left">
            <img class="left-img" src="../../assets/product-3.png" />
          </div>
          <div class="one-right">
            <p class="one-title">智慧园区</p>
            <div class="one-text">提供人脸考勤、考勤统计、会议管理、实时监控、人像抓拍、预警管理等功能。</div>
          </div>
        </li>
        <li class="one-pro">
          <div class="one-left">
            <img class="left-img" src="../../assets/product-4.png" />
          </div>
          <div class="one-right">
            <p class="one-title">智慧别墅</p>
            <div class="one-text">提供重点人员预警、周界入侵预警、预警分析、监控回放、物联设备联动、智能家居场景等功能</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="company-address fff">
      <div class="title"><span class="title-icon"></span><span class="text">联系我们</span></div>
      <div class="map-con">
        <BaiduMap height='200px' :clickStatus='false' :zoom='16' :backStatus="true" :markerStatus="true" :positionList="positionList" :keyword="communityForm.address" :lng="communityForm.longitude" :lat="communityForm.latitude"></BaiduMap>
      </div>
      <div class="addr-con">
        <p><img class="icon" src="../../assets/about-addr.png" /><span>成都市武侯区盛华北路199号汇锦广场A座17楼</span></p>
        <p><img class="icon" src="../../assets/about-email.png" /><span>info@lenfocus.com</span></p>
      </div>
    </div>
    <div class="company-logo">
      <div class="left_logo">
        <span class="iconfont logo-icon icon-logo"></span>
      </div>
      <div class="left_logo flex">
        <span class="logo-span">桂ICP备20200007788号</span>
        <span class="logo-span">南风云技术股份有限公司</span>
      </div>
    </div>
  </div>
</template>

<script>
const BaiduMap = () => import("@/components/baiduMap/index.vue");
export default {
  data() {
    return {
      communityForm: {
        address: '',
        longitude: '104.059987',
        latitude: '30.563383'
      },
      positionList: [
        { position: { lng: "104.059987", lat: "30.563383" }, title: "南风云", address: "汇锦广场", show: false },
      ]
    }
  },
  components: {
    BaiduMap
  },
  created() {
    document.title = '关于我们';
    this.$store.commit("SET_BUILDNAME", '南风云数字技术有限公司');
  },
  mounted() {


  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.f4 {
  background: #f4f4f4;
}
.fff {
  background: #fff;
  padding-bottom: 10px;
}
.title {
  padding-left: 24px;
  margin-top: 20px;
  .title-icon {
    width: 4px;
    height: 14px;
    opacity: 1;
    background: #0047ba;
    display: inline-block;
    margin-right: 4px;
    vertical-align: middle;
    margin-bottom: 3px;
  }
  .text {
    font-size: 18px;
    font-weight: 700;
    color: #333333;
    line-height: 32px;
  }
}

.company-con {
  padding-bottom: 20px;
  .img-con {
    margin-top: 15px;
    width: 100%;
    text-align: center;
    .img {
      width: 340px;
      height: 150px;
    }
  }
  .word-con {
    color: #333;
    margin: 4px 32px;
    .bold {
      font-weight: bold;
    }
  }
}
.company-product {
  padding: 1px 20px;
  .products-con {
    .one-pro {
      display: flex;
      align-items: top;
      padding: 20px 0;
      border-bottom: 1px dashed #d0d0d0;
      .left-img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      .one-title {
        font-size: 16px;
        color: #333;
        font-weight: 700;
        margin-bottom: 3px;
      }
      .one-text {
        color: #333333;
        font-size: 15px;
      }
    }
    .one-pro:last-child {
      border: 0;
    }
  }
}
.company-address {
  padding-top: 1px;
  .map-con {
    margin: 20px auto;
    width: 335px;
    height: 180px;
  }
  .icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    line-height: 22px;
  }
  .addr-con {
    padding: 10px 20px;
    padding-bottom: 20px;
    p {
      margin-top: 15px;
      span {
        margin-left: 4px;
      }
    }
  }
}
.company-logo {
  height: 82px;
  background: #293c5a;
  color: #68768c;
  font-size: 12px;
  padding: 0 26px;
  padding-top: 14px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .logo-icon {
    margin-top: 2px;
    font-size: 16px;
  }
  .left_logo {
    width: 100%;
    display: flex;
    .logo-span {
      padding-top: 20px;
    }
  }
  .left_logo:last-child {
    justify-content: space-between;
  }
}
</style>