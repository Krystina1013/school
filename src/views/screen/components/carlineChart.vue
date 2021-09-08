<template>
  <div :id="id" class="charts chart-line"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ChartLine',
  props: {
    id: String,
    value: Object,
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
        let xAxisData = this.value.date
        let yAxis_2 = this.value.car
        let yAxis_3 = this.value.noCar
        let option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            show: false,
          },
          grid: {
            left: '7%',
            right: '9%',
            top: '22%',
            bottom: '8%',
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
            },
            data: xAxisData,
          },
          yAxis: {
            type: "value",
            splitLine: {
              show: false,
              lineStyle: {
                color: '#F5F9FF',
                width: 1,
              },
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 11,
                fontWeight: 400,
                fontFamily: 'PingFang SC, PingFang SC-Regular',
              }
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          series: [
            {
              symbol: 'none',
              smooth: true,
              data: yAxis_2,
              name: '机动车',
              type: "line",
              itemStyle: {
                normal: {
                  color: '#52CCFF',//改变折线点的颜色
                  lineStyle: {
                    color: '#52CCFF',
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
                    offset: 0, color: '#2bfec0' // 0% 处的颜色
                  }, {
                    offset: 0.5, color: 'rgba(81,201,252,0.50)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            {
              symbol: 'none',
              smooth: true,
              data: yAxis_3,
              name: '非机动车',
              type: "line",
              itemStyle: {
                normal: {
                  color: '#50CD91',//改变折线点的颜色
                  lineStyle: {
                    lineStyle: {
                      color: '#50CD91',
                      width: 2,
                    }
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
                    offset: 0, color: '#5bff7a' // 0% 处的颜色
                  }, {
                    offset: 1, color: 'rgba(105,180,119,0.50)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
          ],
        }
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
