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
        let yAxis_1 = this.value.people
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
            data: ['机动车', '非机动车'],
            bottom: '10px',
            itemWidth: 29,
            itemHeight: 8,
            itemGap: 10,
            textStyle: {
              fontSize: 12,
              color: '#63779E'
            }
          },
          grid: {
            left: '3%',
            right: '8%',
            top: '15%',
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
            type: "value",
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
          },
          series: [
            {
              symbol: 'circle',
              data: yAxis_2,
              name: '机动车',
              type: "line",
              itemStyle: {
                normal: {
                  color: '#27CA40',//改变折线点的颜色
                  lineStyle: {
                    color: '#27CA40' //改变折线颜色
                  }
                }
              },
            },
            {
              symbol: 'circle',
              data: yAxis_3,
              name: '非机动车',
              type: "line",
              itemStyle: {
                normal: {
                  color: '#308AE7',//改变折线点的颜色
                  lineStyle: {
                    color: '#308AE7' //改变折线颜色
                  }
                }
              },
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
