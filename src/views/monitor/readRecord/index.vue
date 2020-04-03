<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>

        <el-col :span="4">
          <el-form-item label="调阅项目">
            <el-select v-model="form.ProjectId" clearable placeholder="请选择" @change="readProjectsChange">
              <el-option v-for="item in selects.readProjects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item label="类别">
            <el-select v-model="form.Readway" clearable placeholder="请选择" @change="readProjectsChange">
              <el-option v-for="item in selects.ReadType" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="名称">
            <el-select v-model="form.ServerId" clearable placeholder="请选择">
              <el-option v-for="item in selects.ServiceName" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="调阅开始时间" label-width="120px">
            <el-date-picker
              v-model="form.StartTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="调阅结束时间" label-width="120px">
            <el-date-picker
              v-model="form.EndTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item label="关键词">
            <el-input v-model="form.FTR" />
          </el-form-item>
        </el-col>

        <el-col :span="1" :push="1">
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
      :api="GetReadRecordList"
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

      <template v-slot:col-READ_WAY="slotProps">
        {{ getDictName(selects.ReadType, slotProps.row.READ_WAY ) }}
      </template>

    </comp-table>

    <!-- 详情 -->
    <el-dialog
      v-if="detailVisible"
      title="查看详细内容"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      custom-class="no-padding"
      width="90%"
      @close="detailClose"
    >
      <!-- <DetailPage :rows.sync="rows" /> -->

      <!-- 列表 -->
      <comp-table
        v-if="DataStyle === 'TABLE'"
        :listen-height="false"
        :height="'calc(100vh - 400px)'"
        :refresh="tableInfo2.refresh"
        :init-curpage="tableInfo2.initCurpage"
        :data.sync="tableInfo2.data"
        :tab-index="true"
        :pager="false"
        :field-list="tableInfo2.fieldList"
      >
        <!-- 自定义插槽显示状态 -->
      </comp-table>

      <div v-if="DataStyle === 'TEXT'" readonly>
        <textarea readonly style="width:100%;height: 500px;">
          {{ xml }}
        </textarea>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { GetReadRecordList, GetReadRecord } from '@/api/monitor'
import { getDictName } from '@/utils'
export default {
  data() {
    return {
      GetReadRecordList,
      GetReadRecord,
      getDictName,
      detailVisible: false,
      DataStyle: '',
      xml: '',
      selects: {
        ReadType: [],
        ServiceName: [],
        readProjects: []
      },
      // 表单相关
      form: {
        ServerId: ''
      },
      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '调阅项目', value: 'PROJECT_NAME' },
          { label: '类别', value: 'READ_WAY', type: 'slot' },
          { label: '标识', value: 'IDENTITY' },
          { label: '服务名', value: 'SERVICE_NAME' },
          { label: '调阅请求时间', value: 'REQUEST_DATE_TIME' },
          { label: '调阅响应时间', value: 'RESPONSE_DATE_TIME' },
          { label: '调阅查询条件', value: 'SERACH_CONDITIONS' }
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
      this.selects.readProjects = await this.$store.dispatch('select/GetProjects', { Type: '3' })
      this.selects.ReadType = await this.$store.dispatch('select/GetSelect', 'ReadType')
    },

    async readProjectsChange() {
      const { ProjectId, Readway: Type } = this.form
      if (ProjectId && Type) {
        this.selects.ServiceName = await this.$store.dispatch('select/GetServiceName', { ProjectId, Type })
      } else {
        this.selects.ServiceName = []
      }
    },

    initByRoute() {
      console.log(this.$route.query, 'dkfjvkdfhvaaaaaaaaaaaa')
      this.form.ProjectId = this.$route.query.PROJECT_ID
      this.form.Readway = this.$route.query.READ_WAY
      this.form.ServerId = this.$route.query.SERVICE_OR_CONTNET_ID
      if (this.form.ProjectId && this.form.Readway) this.readProjectsChange()
      this.$nextTick(function() {
        // this.form.ServerId = this.$route.query.SERVICE_ID
      })
    },

    detail(rows) {
      GetReadRecord({ RrrId: rows.RRR_ID }).then(res => {
        const { DataStyle = 'xml', DataContent = '无详细内容' } = res
        if (res.DataStyle && res.DataContent) {
          this.detailVisible = true
          this.DataStyle = DataStyle
          if (DataStyle === 'TABLE') {
            const data = JSON.parse(DataContent)
            this.tableInfo2.fieldList = Object.keys(data[0]).map(val => ({ label: val, value: val }))
            this.tableInfo2.data = data
          } else {
            this.xml = DataContent
          }
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
