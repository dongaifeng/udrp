<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    },
    range: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log(val, '--------')
        this.setOptions(val)
      }
    },
    range: {
      deep: true,
      handler(val) {
        this.setOptions2(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },

    setOptions2(range = []) {
      this.chart.setOption({
        xAxis: {
          data: range
        }
      })
    },

    setOptions(chartData = []) {
      this.chart.setOption({
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        textStyle: {
          color: '#ddd'
        },
        // lineStyle: {
        //   color: '#ddd'
        // },
        xAxis: {
          // name: '时间(时) (显示最近24小时)',
          // nameLocation: 'center',
          // nameTextStyle: {
          //   algin: 'center',
          //   color: '#ddd'
          // },
          // splitLine: {
          //   lineStyle: {
          //     color: '#ddd'
          //   }
          // },
          // nameGap: 25,
          data: this.range,
          boundaryGap: true,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: '访问量(次)',
          type: 'value',
          axisTick: {
            show: true
          }
        },
        grid: {
          left: 10,
          right: 0,
          bottom: 0,
          top: 35,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              formatter: '{value} 时'
            }
          },
          padding: [5, 5]
          // position: function(point, params, dom, rect, size) {
          //   // 设置离鼠标位置
          //   return [point[0] + 10, point[1] + 10]
          // }
        },

        // legend: {
        //   data: ['访问量']
        // },
        series: chartData
        // series: [{
        //   name: '访问量',
        //   type: 'line',
        //   itemStyle: {
        //     normal: {
        //       color: '#fff',
        //       lineStyle: {
        //         color: '#ddd',
        //         width: 2
        //       }
        //     }
        //   },
        //   smooth: true,
        //   data: chartData,
        //   animationDuration: 500,
        //   animationEasing: 'cubicInOut'
        // }]
      }, true)
    }
  }
}
</script>
