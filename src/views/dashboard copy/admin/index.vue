<template>
  <div class="dashboard-container">

    <el-row :gutter="20">

      <el-col :span="24" style="margin-bottom: 20px;">
        <div class="chart-container">
          <Panel />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">

          <chart-header />
          <line-chart :chart-data="lineChartData" :range="range" />

        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">
          <chart-header />
          <bar-chart :chart-data="lineChartData" :range="range" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Api from '@/api/dashboard'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart.vue'
import ChartHeader from './components/ChartHeader'
import Panel from './components/panel'

const lineChartData = [100, 120, 161, 134, 105, 160, 165, 100, 120, 161, 134, 105, 160, 165, 100, 120, 161, 134, 105, 160, 165]
const range = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']

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
      lineChartData: lineChartData,
      range,
      dateLine: ''
    }
  },

  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    changeRange() {
      this.range = ['a', 'b']
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
  }
}
.chart-container{
  border-radius: 5px;
  background: linear-gradient(#235b94,#5b9cd0, );
  padding: 0 !important;
}
</style>
