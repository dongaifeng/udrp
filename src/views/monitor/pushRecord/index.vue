<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="上报机构">
            <el-select v-model="form.ReportOrganCode" placeholder="请选择">
              <el-option v-for="item in selects.projects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="推送项目">
            <el-select v-model="form.ProjectId" placeholder="请选择" @change="pushProjectsChange">
              <el-option v-for="item in selects.pushProjects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="数据表">
            <el-select v-model="form.DataTableId" placeholder="请选择">
              <el-option v-for="item in selects.DataTables" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="批次号">
            <el-input v-model="form.BatchNo" />
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="状态">
            <el-select v-model="form.AuditStatus" placeholder="请选择">
              <el-option v-for="item in selects.AuditState" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
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
      @el-row-dblclick="tableEdit"
    >
      <!-- 自定义插槽显示状态 -->

    </comp-table>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import { GetPushRecordList, GetPushRecord } from '@/api/monitor'
export default {
  components: { CompTable },
  data() {
    return {
      GetPushRecordList,
      selects: {
        AuditState: [],
        projects: [],
        DataTables: [],
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
          { label: '推送项目', value: 'PROJECT_ID' },
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
            { label: '查看详细内容', type: 'primary', icon: 'el-icon-ship', event: 'tableEdit', show: true }
          ]
        }

      }

    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.selects.AuditState = await this.$store.dispatch('select/GetSelect', 'AuditState')
      this.selects.projects = await this.$store.dispatch('select/GetSelect', 'ReportOrgan')
      this.selects.pushProjects = await this.$store.dispatch('select/GetProjects', { Type: '2' })
    },

    async pushProjectsChange(ProjectId) {
      console.log(ProjectId)
      this.selects.DataTables = await this.$store.dispatch('select/GetDataTables', { ProjectId })
    },

    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    handleEvent(event, data) {
      switch (event) {
        case 'list':
          console.log(data)
      }
    },
    handleClick(event, data) {
      console.log(event, data)
      if (typeof this[event] === 'function') this[event](data)
    },
    tableEdit(rows) {
      this.state = 'modify'
      this.editData = rows
      this.createProjectVisible = true
    },
    addProject() {
      this.state = 'add'
      this.editData = null
      this.createProjectVisible = true
    },
    tableDelete(rows) {
      const { ProjectId, DeleteFlag } = rows
      GetPushRecord({ ProjectId, DeleteFlag }).then(res => {
        this.$message('删除成功')
        this.updateTable()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
