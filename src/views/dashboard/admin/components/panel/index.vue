<template>
  <div>
    <!-- 头部选择框 -->
    <el-row class="echartHeader">
      <el-col :span="2">显示时间范围</el-col>
      <el-col :span="4">

        <el-select v-model="form.PROJECT_ID" clearable placeholder="请选择项目">
          <el-option v-for="item in selects.projects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
        </el-select>
      </el-col>

      <el-col :span="4">

        <el-select v-model="form.REPORT_ORGAN_CODE" clearable placeholder="请选择机构">
          <el-option v-for="item in selects.ReportOrgan" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-radio-group v-model="form.DATEVALUE" size="mini" @click="changeRange">
          <el-radio-button label="1M">近1个月</el-radio-button>
          <el-radio-button label="2M">近2个月</el-radio-button>
          <el-radio-button label="3M">近3个月</el-radio-button>
          <el-radio-button label="6M">近6个月</el-radio-button>
          <el-radio-button label="1Y">一年</el-radio-button>
          <el-radio-button label="2Y">二年</el-radio-button>
          <el-radio-button label="3Y">三年</el-radio-button>
          <!-- <el-radio-button value="1M" label="全部" /> -->
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- PUSH -->
    <el-row>
      <!-- 标题 -->
      <el-col class="col-panel" style="border-right: 1px solid #bbb;" :span="12">
        <div class="panel-contianer">
          <div class="title-box">
            <h4>推送项目汇总</h4>
            <p>上报批次记录 <i class="el-icon-arrow-down" /></p>
          </div>

          <!-- 显示数字 -->
          <NumberShow :res="Push" />
          <!-- 运行 -->

          <!-- 数据表总数 -->
          <div class="data-all">
            <div>数据表总数<span class="number">{{ Push.TABLE_COUNT || '0' }}</span></div>

            <NumberLine left-lable="已采集" right-lable="未采集" :left-number="Push.GATHER || 0" :right-number="Push.UNGATHER || 0" />
            <NumberLine left-lable="已填报" right-lable="未填报" :left-number="Push.COMMITTED || 0" :right-number="Push.UNCOMMITTED || 0" />
            <NumberLine left-lable="已审核" right-lable="未审核" :left-number="Push.PASS || 0" :right-number="Push.NOPASS || 0" />

          </div>

          <!-- 数据记录审核进度 -->
          <el-row class="shenhe-box">
            <el-col :span="12">
              <div class="shenhe-title">数据记录审核进度</div>
              <div>
                <span class="shenhe-num">{{ Push.DATA_TABLE_COUNT || 0 }} /</span>
                <span>{{ Push.TO_AUDIT_COUNT || 0 }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="12" style="line-height: 50px;"><span class="shenhe-num">已审核</span></el-col>
                <el-col :span="12">
                  <el-progress type="circle" :percentage=" parseInt(Push.TO_AUDIT) || 0" :width="45" :stroke-width="3" />
                </el-col>
              </el-row>

            </el-col>
          </el-row>

        </div>
      </el-col>

      <!-- read -->
      <el-col class="col-panel" :span="12">
        <div class="panel-contianer">
          <div class="title-box">
            <h4>调阅项目汇总</h4>
            <p style="color: #bbb;">调阅项目:
              web服务 | 存储过程 | 视图
            </p>
          </div>

          <!-- 显示数字 -->
          <NumberShow :res="Read" />
          <!-- 运行 -->

          <!-- 数据记录审核进度 -->
          <el-row class="shenhe-box">
            <el-col :span="12">
              <div class="cunchu-title">存储过程总数</div>
              <div class="cunchu-title">视图总数</div>
            </el-col>
            <el-col :span="12">
              <div class="cunchu-num">{{ Read.PROCEDURE || '--' }}</div>
              <div class="cunchu-num">{{ Read.VIEW || '--' }}</div>
            </el-col>
          </el-row>

          <div class="date-box">
            <span class="shenhe-num">本次调阅时间：  </span>
            <span style="color: #bbb;">{{ new Date().toLocaleString() }}</span>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Index from '@/api/dashboard'
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
      Push: {
        PROCEDURE: null,
        VIEW: null,
        RUNNING: null,
        EXCEPTION: null,
        SERVICES_COUNT: null
      },
      Read: {
        PROCEDURE: null,
        VIEW: null,
        RUNNING: null,
        EXCEPTION: null,
        SERVICES_COUNT: null
      },
      selects: {
        AuditState: [],
        projects: [],
        DataTables: [],
        pushProjects: []
      },
      form: {
        DATEVALUE: '',
        PROJECT_ID: '',
        REPORT_ORGAN_CODE: 'Org_01'
      },
      dateLine: ''
    }
  },
  watch: {
    form: {
      handler: function(newVal) {
        this.GetIndex(newVal)
      },
      immediate: true,
      deep: true // true 深度监听
    }
  },
  mounted() {
    this.initSelect()
    // this.GetIndex()
  },
  methods: {
    async initSelect() {
      this.selects.ReportOrgan = await this.$store.dispatch('select/GetSelect', 'ReportOrgan')
      this.selects.projects = await this.$store.dispatch('select/GetProjects', { Type: '1' })
    },
    changeRange() {
      this.range = ['a', 'b']
    },
    format(percentage) {
      return percentage
    },
    GetIndex() {
      this.$store.dispatch('dashboard/SetHeaderForm', this.form)
      Index.GetIndex(this.form).then(res => {
        console.log(res)
        const { Push, Read } = res
        this.Push = this.Read = {}
        if (Push) this.Push = Push
        if (Read) this.Read = Read
        this.$emit('changeChart')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.col-panel{
  padding: 10px 20px;
}
.el-select /deep/ .el-input__inner{
  background-color: transparent;
  border: 0px solid #DCDFE6;
  color: #fff;
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
    .el-progress /deep/ .el-progress__text{
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
