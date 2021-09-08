<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ChartPie',
  props: {
    color: '',
    value: Array,
    text: Boolean,
    subtext: String
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
  data() {
    return {
      dom: null,
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    initChart() {
      this.$nextTick(() => {
        let dataList = this.value
        let valueList = this.value.map(_ => _.value)
        let option = {
          title: {
            show: false,
            text: '',
          },
          legend: {
            show: false,
            left: '57%',
            top: '45%',
            icon: 'circle',
            itemWidth: 0,
            formatter: function (name) {
              var target;
              for (var j = 0; j < dataList.length; j++) {
                if (dataList[j].name === name) {
                  target = dataList[j].value
                }
              }
              var arr = [name + ' ' + target];
              return arr
            },
            textStyle: {
              color: '#7A93CC',
              fontSize: 11,
              fontWeight: 400,
            }
          },
          //点击提示文字
          tooltip: {
            trigger: "item",
            position: [10, 10],
            formatter: "{b}: {c} ({d}%)",
          },
          graphic: [],
          series: [
            {
              name: this.pieName,
              type: 'pie',
              radius: ["75%", "100%"], //两个表示环：内半径,外半径
              center: ["50%", "50%"], //左右，上下
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  scale: false,
                  focus: 'none'
                },
              },
              labelLine: {
                show: false
              },
              data: [
                {
                  value: valueList[0], name: '在线',
                  itemStyle: {
                    normal: {
                      color: this.color,//移入前的颜色
                    },
                    emphasis: {
                      color: this.color,//移入后的颜色
                    }
                  },
                },
                {
                  value: valueList[1], name: '离线',
                  itemStyle: {
                    normal: {//颜色渐变
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: '#355287' },
                          { offset: 1, color: '#213a68' }
                        ]
                      )
                    },
                    emphasis: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: '#355287' },
                          { offset: 1, color: '#213a68' }
                        ]
                      )
                    }
                  }
                }]
            }
          ]
        }
        this.dom = echarts.init(this.$refs.dom, '')
        this.dom.setOption(option)
        window.addEventListener("resize", this.dom.resize); //添加 监听屏幕缩放
      })
    },
  },
  mounted() {
    this.initChart()
  },
}
</script>
