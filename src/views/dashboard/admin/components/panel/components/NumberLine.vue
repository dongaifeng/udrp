<template>
  <div>
    <el-row class="tiao-box" type="flex" justify="space-between" align="middle">
      <el-col class="tiao-title" :span="5">{{ leftLable }} {{ leftNumber }}</el-col>
      <el-col :span="14">
        <el-progress class="tiao" :percentage="per" :show-text="false" />
      </el-col>
      <el-col class="tiao-title" :span="5">{{ rightLable }} {{ rightNumber }}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    leftLable: [String],
    rightLable: [String],
    rightNumber: [String, Number],
    leftNumber: [String, Number]
  },
  data() {
    return {
      dateLine: ''
    }
  },
  computed: {
    per() {
      const rightNumber = Number(this.rightNumber)
      const leftNumber = Number(this.leftNumber)
      const num = rightNumber + leftNumber
      if (num !== 0) {
        return leftNumber / num * 100
      }
      return 0
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
