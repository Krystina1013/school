<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ChartPie',
  props: {
    value: Object,
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
        let dataList = this.value.data
        let allNum = this.value.allNum
        let option = {
          title: {
            text: '',
            x: 'center'
          },
          legend: {
            show: false,
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
          },
          color: ["#0C7BE3", "#5BA1E3", "#88B7E3", "#5C9AEE", "#F26F6F", '#D2E8FF', '#66B1FF', '#EBF4FF'],
          series: [
            {
              name: "关注人员库",
              type: "pie",
              radius: ["50%", "75%"], //两个表示环：内半径,外半径
              center: ["50%", "50%"], //左右，上下
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: true,
                  position: "center",
                  formatter: "总人数\n" + allNum + "人",
                  color: '#6a7e92',
                  fontSize: 12,
                  fontWeight: 500,
                  borderWidth: 20,
                },
                emphasis: {
                  label: {},
                  scale: false,
                },
              },
              labelLine: {
                show: false
              },
              data: dataList
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
