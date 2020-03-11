<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>

        <el-col :span="4">
          <el-form-item label="推送项目">
            <el-select v-model="form.ProjectId" placeholder="请选择" @change="pushProjectsChange">
              <el-option v-for="item in selects.pushProjects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="服务名">
            <el-select v-model="form.ServerId" placeholder="请选择">
              <el-option v-for="item in selects.PushService" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="批次号">
            <el-input v-model="form.BatchNo" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="上传开始时间" label-width="120px">
            <el-date-picker
              v-model="form.StartTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="上传结束时间" label-width="120px">
            <el-date-picker
              v-model="form.EndTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="关键词">
            <el-input v-model="form.FTR" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="多次上传">
            <el-checkbox v-model="form.ShowReportTimes" label="" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="上传失败">
            <el-checkbox v-model="form.ShowSucceed" label="" />
          </el-form-item>
        </el-col>

        <el-col :span="2" :push="1">
          <el-button type="primary" @click="updateTable">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 列表 -->
    <comp-table
      :listen-height="false"
      :height="'calc(100vh - 180px)'"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :check-box="false"
      :tab-index="true"
      :api="GetPushRecordList"
      :pager="false"
      :query="form"
      :field-list="tableInfo.fieldList"
      :list-type-info="selects"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
      @el-row-dblclick="detail"
    >
      <!-- 自定义插槽显示状态 -->

    </comp-table>

    <!-- 详情 -->
    <el-dialog
      v-if="detailVisible"
      title="查看详细内容"
      :visible.sync="detailVisible"
      custom-class="no-padding"
      width="90%"
      @close="detailClose"
    >
      <!-- <DetailPage :rows.sync="rows" /> -->

      <!-- 列表 -->
      <comp-table
        v-if="DataStyle === 'TABLE'"
        :listen-height="false"
        :height="'600px'"
        :refresh="tableInfo2.refresh"
        :init-curpage="tableInfo2.initCurpage"
        :data.sync="tableInfo2.data"
        :tab-index="true"
        :pager="false"
        :field-list="tableInfo2.fieldList"
      >
        <!-- 自定义插槽显示状态 -->
      </comp-table>

      <div v-if="DataStyle === 'FORM'">{{ xml }}</div>
    </el-dialog>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import DetailPage from './components/DetailPage'
import { GetPushRecordList, GetPushRecord } from '@/api/monitor'
export default {
  components: { CompTable, DetailPage },
  data() {
    return {
      GetPushRecordList,
      GetPushRecord,
      detailVisible: false,
      DataStyle: '',
      xml: '',
      selects: {
        PushService: [],
        pushProjects: []
      },
      // 表单相关
      form: {},
      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '推送项目', value: 'PROJECT_NAME' },
          { label: '批次号', value: 'BATCH_NO' },
          { label: '上传次数', value: 'UPLOAD_TIMES' },
          { label: '服务名', value: 'SERVICE_NAME' },
          { label: '输出类型', value: 'CLASS_NAME' },
          { label: '上传时间', value: 'UPLOADED_DATE_TIME' },
          { label: '上传人', value: 'UPLOADED_USER_ID' },
          { label: '是否成功', value: 'UPLOAD_STATUS' },
          { label: '异常结果反馈', value: 'RESULT_CONTENT' },
          { label: '备注说明', value: 'REMARK' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '查看详细内容', type: 'primary', icon: 'el-icon-ship', event: 'detail', show: true }
          ]
        }

      },

      tableInfo2: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        query: {
          DataTableId: ''
        },
        fieldList: []
      }
    }
  },
  mounted() {
    this.updateTable(1)
    this.initSelect()
    if (this.$route.query) this.initByRoute()
  },
  methods: {
    async initSelect() {
      this.selects.pushProjects = await this.$store.dispatch('select/GetProjects', { Type: '2' })
    },

    async pushProjectsChange(ProjectId) {
      console.log(ProjectId)
      this.selects.PushService = await this.$store.dispatch('select/GetPushService', { ProjectId })
    },

    initByRoute() {
      this.form.ProjectId = this.$route.query.PROJECT_ID
      if (this.form.ProjectId) this.pushProjectsChange(this.form.ProjectId)
      this.$nextTick(function() {
        this.form.ServerId = this.$route.query.SERVICE_ID
      })
    },

    detail(rows) {
      this.detailVisible = true
      GetPushRecord({ RruId: rows.RRB_ID }).then(res => {
        console.log(res)
        const { DataStyle, DataContent } = res
        this.DataStyle = DataStyle
        if (DataStyle === 'TABLE') {
          const data = JSON.parse(DataContent)
          this.tableInfo2.fieldList = Object.keys(data[0]).map(val => ({ label: val, value: val }))
          this.tableInfo2.data = data
        } else {
          this.xml = DataContent
        }
      })
    },

    detailClose() {
      this.tableInfo2.data = this.tableInfo2.fieldList = []
      this.xml = this.DataStyle = ''
    },

    updateTable(ref) {
      if (ref && ref === 2) {
        this.tableInfo2.refresh = Math.random()
      } else {
        this.tableInfo.refresh = Math.random()
      }
    },
    handleEvent(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    },
    handleClick(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
