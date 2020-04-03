<template>
  <div>
    <el-row>
      <div class="number-box">
        <!-- <div>
          <count-to :start-val="0" :end-val="18" :duration="3000" class="card-panel-num" />
        </div>
        <div class="server-number">服务总数</div>
      </div> -->
        <el-col class="state-box" :span="8">
          <div style="border-right: 1px solid #bbb;">
            <span class="name">服务总数</span>
            <span class="number" @click="goPage">{{ res.SERVICES_COUNT || '--' }}</span>
          </div>
        </el-col>

        <el-col class="state-box" :span="8">
          <div style="border-right: 1px solid #bbb;">
            <span class="name">运行</span>
            <span class="number">{{ res.RUNNING || '--' }}</span>
          </div>
        </el-col>
        <el-col class="state-box" :span="8">
          <span class="name ">异常</span>
          <span class="number red">{{ res.EXCEPTION ||'--' }}</span>
        </el-col>
      </div></el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  props: {
    res: [Object]
  },
  data() {
    return {
      dateLine: ''
    }
  },
  methods: {
    changeRange() {
      this.range = ['a', 'b']
    },
    goPage() {
      this.$router.push({ path: '/monitor/report', query: { a: 'a' }})
    },
    format(percentage) {
      return percentage
    }
  }
}
</script>

<style  lang="scss" scoped>
  .number-box{
    text-align: center;
    .card-panel-num{
      font-size: 30px;
    }
    .server-number{
      margin: 5px;
      color: #ccc;
    }

  }
    .state-box{
    border-bottom: 1px solid #bbb;
    text-align: center;
    margin-top: 0px;
    padding-bottom: 5px;
    &:first-child{

    }
    .name{
      color: #ccc;
      font-size: 14px;
      padding-right: 10px;
    }
    .number{
      font-size: 20px;
    }
     .red{
      color: red;
    }
  }
</style>
