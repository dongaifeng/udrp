<template>
  <div>
    <el-row class="echartHeader">
      <el-col :span="6">调阅时间轴</el-col>
      <el-col :span="3">查看时间范围</el-col>
      <el-col :span="10">
        <el-radio-group v-model="dateLine" size="mini" @click="changeRange">
          <el-radio-button label="分" />
          <el-radio-button label="时" />
          <el-radio-button label="日" />
          <el-radio-button label="月" />
          <el-radio-button label="年" />
        </el-radio-group>
      </el-col>
      <el-col :span="1">类型</el-col>
      <el-col :span="4">
        <el-radio-group v-model="dateLine" size="mini" @click="changeRange">
          <el-radio-button label="合计" />
          <el-radio-button label="项目" />
        </el-radio-group>
      </el-col>
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
    }
  }
}
</script>

<style lang="scss" scoped>
     .echartHeader{
    height: 40px;
    width: 100%;
    background: #073252;
    color: #fff;
    line-height: 40px;
    font-size: 12px;
    padding: 0 10px;
    /deep/ .el-radio-group .el-radio-button .el-radio-button__inner {
      background-color: transparent;
      border-radius: 5;
      color: #5B7E9A;
      border: 0px;
    }
    /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
          background-color: #409EFF;
          border-radius: 0;
          color: #fff;
    }
  }
</style>
