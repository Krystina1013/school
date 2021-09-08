<template>
  <div :id="id" class="charts chart-line"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ChartLine',
  props: {
    id: String,
    value: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null,
      option: {},
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.value = newValue;  //把新值赋值给我们的属性数据
        this.initChart();  //刷新echarts图表
      },
      deep: true
    },
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    initChart() {
      this.$nextTick(() => {
        let xAxisData = this.value.map(_ => _.date)
        let yAxisData = this.value.map(_ => _.value)
        let option = {
          title: {
            subtext: this.subtext,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: "{b} <br/> {c} 人",
          },
          grid: {
            left: '7%',
            right: '9%',
            top: '22%',
            bottom: '7%',
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#F5F9FF',
                width: 1,
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#6a7e92',
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 11,
                fontWeight: 400,
                fontFamily: 'Source Han Sans CN, Source Han Sans CN-Medium',
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#6a7e92',
              }
            },
            data: xAxisData,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#6a7e92',
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 11,
                fontWeight: 400,
                fontFamily: 'PingFang SC, PingFang SC-Regular',
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#6a7e92',
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#F5F9FF',
                width: 1,
              },
            },
          },
          series: [{
            data: yAxisData,
            type: 'line',
            symbol: 'none',  // 数据级个性化拐点图形
            symbolSize: 0,
            smooth: true,
            itemStyle: {
              normal: {
                color: "#01FAF2",
                lineStyle: {
                  color: '#01FAF2',
                  width: 2,
                }
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(43, 254, 192, 0.50)' // 0% 处的颜色
                }, {
                  offset: 1, color: '#213A68' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }]
        }
        // document.getElementById(this.id).style.width = this.width + "px";
        this.dom = echarts.init(document.getElementById(this.id))
        this.dom.setOption(option)
        window.addEventListener("resize", this.dom.resize);        //添加 监听屏幕缩放
      }, 500)
    }
  },
  mounted() {
    this.initChart()
  },
}
</script>
