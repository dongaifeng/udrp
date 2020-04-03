<template>
  <div>
    <el-row class="echartHeader">
      <el-col :span="6">{{ title }}</el-col>
      <el-col :span="3">查看时间范围</el-col>
      <el-col :span="10">
        <el-radio-group v-model="value" size="mini" @change="changeRange">
          <el-radio-button
            v-for="item in selects.SystemConfig"
            :key="item.ClassCode"
            :label="item.ClassCode"
          >{{ item.ClassName.split(',')[0] }}</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="1">类型</el-col>
      <el-col :span="4">
        <el-radio-group v-model="TYPE" size="mini" @change="changeRange">
          <el-radio-button label="1">合计</el-radio-button>
          <el-radio-button label="2">项目</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDictName } from '@/utils'
export default {
  props: {
    initTime: {
      type: String
    },
    type: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      TYPE: '1',
      // value: this.initTime,
      selects: {
        SystemConfig: []
      }
    }
  },
  computed: {
    value: {
      get: function() {
        return this.initTime
      },
      set: function(newValue) { this.$emit('update:initTime', newValue) }
    }
  },
  mounted() {
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.selects.SystemConfig = await this.$store.dispatch(
        'select/GetSelect',
        'SystemConfig'
      )
      this.changeRange(this.initTime)
    },

    changeRange(val) {
      const name = getDictName(this.selects.SystemConfig, this.initTime)
      this.$emit('timeChange', { val: this.initTime, name, TYPE: this.TYPE })
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
