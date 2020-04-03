<template>
  <div>
    <el-row class="tiao-box" type="flex" justify="space-between" align="middle">
      <el-col class="tiao-title" :span="5">已采集 22</el-col>
      <el-col :span="14">
        <el-progress class="tiao" :percentage="10" :show-text="false" />
      </el-col>
      <el-col class="tiao-title" :span="5">已采集 33</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateLine: ''
    }
  },
  methods: {
    changeRange() {
      this.range = ['a', 'b']
    },
    format(percentage) {
      return percentage
    }
  }
}
</script>

<style lang="scss" scoped>

   .tiao-box{
    margin: 10px 0px;
    .tiao-title{
      font-size: 12px;
      text-align: center;
    }
  }
</style>
