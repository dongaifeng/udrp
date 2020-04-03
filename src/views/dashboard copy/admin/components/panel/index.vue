<template>
  <div>
    <!-- 头部选择框 -->
    <el-row class="echartHeader">
      <el-col :span="2">显示时间范围</el-col>
      <el-col :span="4">

        <el-select v-model="form.ReportOrganCode" clearable placeholder="请选择项目">
          <el-option v-for="item in selects.projects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
        </el-select>
      </el-col>

      <el-col :span="4">

        <el-select v-model="form.ReportOrganCode" clearable placeholder="请选择机构">
          <el-option v-for="item in selects.projects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-radio-group v-model="dateLine" size="mini" @click="changeRange">
          <el-radio-button label="近1个月" />
          <el-radio-button label="近2个月" />
          <el-radio-button label="近3个月" />
          <el-radio-button label="近4个月" />
          <el-radio-button label="近5个月" />
          <el-radio-button label="近6个月" />
          <el-radio-button label="近7个月" />
          <el-radio-button label="全部" />
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- 内容部分 -->
    <el-row>
      <!-- 标题 -->
      <el-col class="col-panel" style="border-right: 1px solid #bbb;" :span="12">
        <div class="panel-contianer">
          <div class="title-box">
            <h4>推送项目汇总</h4>
            <p>上报批次记录 <i class="el-icon-arrow-down" /></p>
          </div>

          <!-- 显示数字 -->
          <NumberShow />
          <!-- 运行 -->

          <!-- 数据表总数 -->
          <div class="data-all">
            <div>数据表总数<span class="number">52</span></div>

            <NumberLine />
            <NumberLine />
            <NumberLine />

          </div>

          <!-- 数据记录审核进度 -->
          <el-row class="shenhe-box">
            <el-col :span="12">
              <div class="shenhe-title">数据记录审核进度</div>
              <div>
                <span class="shenhe-num">10080 /</span>
                <span>10080</span>
              </div>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="12" style="line-height: 50px;"><span class="shenhe-num">已审核</span></el-col>
                <el-col :span="12">
                  <el-progress type="circle" :percentage="25" :width="45" :stroke-width="3" />
                </el-col>
              </el-row>

            </el-col>
          </el-row>

        </div>
      </el-col>

      <!-- right -->
      <el-col class="col-panel" :span="12">
        <div class="panel-contianer">
          <div class="title-box">
            <h4>调阅项目汇总</h4>
            <p style="color: #bbb;">调阅项目:
              web服务 | 村粗过程 | 视图
            </p>
          </div>

          <!-- 显示数字 -->
          <NumberShow />
          <!-- 运行 -->

          <!-- 数据记录审核进度 -->
          <el-row class="shenhe-box">
            <el-col :span="12">
              <div class="cunchu-title">存储过程总数</div>
              <div class="cunchu-title">视图总数</div>
            </el-col>
            <el-col :span="12">
              <div class="cunchu-num">14</div>
              <div class="cunchu-num">14</div>
            </el-col>
          </el-row>

          <div class="date-box">
            <span class="shenhe-num">本次调阅时间：  </span>
            <span style="color: #bbb;">2000-12-1 12:12:12</span>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import NumberShow from './components/NumberShow'
import NumberLine from './components/NumberLine'
export default {
  components: {
    CountTo,
    NumberLine,
    NumberShow
  },
  data() {
    return {
      selects: {
        AuditState: [],
        projects: [],
        DataTables: [],
        pushProjects: []
      },
      form: {

      },
      dateLine: ''
    }
  },
  mounted() {
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.selects.projects = await this.$store.dispatch('select/GetSelect', 'ReportOrgan')
    },
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
.col-panel{
  padding: 20px;
}
.el-select /deep/ .el-input__inner{
  background-color: transparent;
  border: 0px solid #DCDFE6;
}
.panel-contianer{
  color: #fff;
  padding: 0px 20px;

    .title-box{
      margin-bottom: 20px;
    h4{
      margin: 0px 0px 10px 0px;
    }
    p{
      margin: 0px;
      font-size: 10px;
      color: #568CE4;
    }
  }

  .number-box{
    text-align: center;
    .card-panel-num{
      font-size: 35px;
    }
    .server-number{
      margin: 5px;
      color: #ccc;
    }

  }

  .data-all{
    font-size: 14px;
    margin-top: 20px;
    .number{
      font-size: 16px;
      padding-left: 20px;
    }
  }
  .tiao-box{
    margin: 10px 0px;
    .tiao-title{
      font-size: 12px;
      text-align: center;
    }
  }
  .shenhe-box{
    background: #0F5A91;
    border-radius: 4px;
    padding: 12px;
    font-size: 12px;
    margin-top: 20px;
    .shenhe-title{
      font-size: 14px;
      padding-bottom: 10px;
    }
    .shenhe-num{
      color: #bbb;
    }
    .el-progress__text{
      color: #fff;
    }

    .cunchu-title{
      font-size: 14px;
      padding: 10px;
      text-align: right;
    }
    .cunchu-num{
      font-size: 14px;
       padding: 10px;
    }
  }
  .date-box{
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
  }
}
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
