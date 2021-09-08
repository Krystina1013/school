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
    pieName: String,
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
            text: '',
            x: 'center'
          },
          legend: {
            show: true,
            icon: 'circle',
            itemWidth: 10,
            bottom: '10',
            itemGap: 40, // 设置legend的间距
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
              color: '#63779E',
              fontSize: 12,
              fontWeight: 500
            }
          },
          //点击提示文字
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
          },
          graphic: [
            {
              type: "text",
              left: "42%",
              top: "39%",
              z: 10,
            },
          ],
          series: [
            {
              name: this.pieName,
              type: 'pie',
              radius: ["45%", "70%"], //两个表示环：内半径,外半径
              center: ["50%", "43%"], //左右，上下
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: false,
                  position: "center",
                  formatter: "门禁\n\n{c}",
                  fontSize: 16,
                  borderWidth: 20,
                  borderRadius: 4,
                  padding: [20, -50],
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
                    normal: {
                      color: '#E0E1E3',//移入前的颜色
                    },
                    emphasis: {
                      color: '#E0E1E3',//移入后的颜色
                    }
                  }
                }]
            }
          ]
        }
        this.dom = echarts.init(this.$refs.dom, '')
        this.dom.setOption(option)
      })
    },
  },
  mounted() {
    this.initChart()
  },
}
</script>
