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
        let yAxisData = this.value.value
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
            left: '3%',
            right: '8%',
            top: '15%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F5F9FF',
                width: 1,
              },
            },
            axisLine: {
              lineStyle: {
                color: '#6a7e92',
              }
            },
            axisTick: {
              lineStyle: {
                color: '#6a7e92',
              }
            },
            data: xAxisData,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#6a7e92',
              }
            },
            axisTick: {
              lineStyle: {
                color: '#6a7e92',
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F5F9FF',
                width: 1,
              },
            },
          },
          series: [{
            data: yAxisData,
            type: 'line',
            symbol: 'circle',  // 数据级个性化拐点图形
            symbolSize: 6,
            itemStyle: {
              normal: {
                color: "#6BD288",
                lineStyle: {
                  color: '#6BD288',
                  width: 1,
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
                  offset: 0, color: '#6BD288' // 0% 处的颜色
                }, {
                  offset: 0.4, color: '#6BD288' // 100% 处的颜色
                }, {
                  offset: 1, color: '#A8D8D8' // 100% 处的颜色
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
