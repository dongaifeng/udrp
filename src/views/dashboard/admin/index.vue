<template>
  <div class="dashboard-container">

    <el-row :gutter="20">
      <!-- 数字显示 -->
      <el-col :span="24" style="margin-bottom: 20px;">
        <div class="chart-container">
          <Panel @changeChart="changeChart" />
        </div>
      </el-col>

      <!-- 折线图 -->
      <el-col :span="12">
        <div class="chart-container">
          <chart-header v-if="initTime.read" :title="'调阅时间轴'" :init-time.sync="initTime.read" @timeChange="readTimeChange" />
          <line-chart :chart-data="read.y" :range="read.x" />
          <div class="chart-x">{{ read.show }}</div>
        </div>
      </el-col>

      <!-- 柱状图 -->
      <el-col :span="12">
        <div class="chart-container">
          <chart-header v-if="initTime.push" :title="'推送时间轴'" :init-time.sync="initTime.push" @timeChange="pushTimeChange" />
          <bar-chart :chart-data="push.y" :range="push.x" />
          <div class="chart-x">{{ push.show }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Index from '@/api/dashboard'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart.vue'
import ChartHeader from './components/ChartHeader'
import Panel from './components/panel'
import { ConfigGetConfig } from '@/api/system'
export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    BarChart,
    ChartHeader,
    Panel
  },
  data() {
    return {
      push: { x: [], y: [], show: '时间' },
      read: {
        x: [100, 120, 161, 134, 105],
        y: ['1', '2', '3', '4', '5'],
        show: '时间'
      },
      initTime: { push: '', read: '' }
    }
  },

  created() {
    this.initConfig()
  },

  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    initConfig(rows) {
      ConfigGetConfig().then(res => {
        this.initTime.push = res[0].ConfigContent
        this.initTime.read = res[1].ConfigContent
      })
    },
    GetIndexReadTime(THISDATE, TYPE) {
      Index.GetIndexReadTime({ ...this.$store.state.dashboard.headerForm, THISDATE, TYPE }).then(res => {
        const { x, y } = this.formatData(res, 'line')
        this.read.x = x
        this.read.y = y
        this.read.THISDATE = THISDATE
        this.read.TYPE = TYPE
      })
    },
    GetIndexPushTime(THISDATE, TYPE) {
      Index.GetIndexPushTime({ ...this.$store.state.dashboard.headerForm, THISDATE, TYPE }).then(res => {
        const { x, y } = this.formatData(res, 'bar')
        this.push.x = x
        this.push.y = y
        this.push.THISDATE = THISDATE
        this.push.TYPE = TYPE
      })
    },
    formatData({ X = [], Y = [] }, type) {
      const y = Y.map(ele => ({
        name: ele.name,
        type,
        data: ele.data
      }))

      // const y = []; const x = []
      // res.forEach(ele => {
      //   y.push(ele.TABLE_COUNT)
      //   x.push(ele.TABLE_DATATIME)
      // })

      return { x: X, y }
    },
    changeChart() {
      this.GetIndexReadTime(this.read.THISDATE, this.read.TYPE)
      this.GetIndexPushTime(this.push.THISDATE, this.push.TYPE)
    },
    readTimeChange({ val, name, TYPE }) {
      this.GetIndexReadTime(val, TYPE)
      this.timeChange({ val, name, type: 'read' })
    },
    pushTimeChange({ val, name, TYPE }) {
      this.GetIndexPushTime(val, TYPE)
      this.timeChange({ val, name, type: 'push' })
    },

    timeChange({ val, name, type }) {
      const [t, d] = name.split(',')
      this[type].show = `时间(${t}) (显示${d})`
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    padding: 10px 20px;
    background-color: rgb(240, 242, 245);
    position: relative;
    height: 70vh;
  }
}
.chart-container{
  border-radius: 5px;
  background: linear-gradient(#235b94,#5b9cd0, );
  padding: 0 !important;
   overflow: hidden;
  .chart-x{
    color: #ddd;
    float: right;
    margin: 3px 30px 3px 0px;
    font-size: 12px;
  }
}
</style>
