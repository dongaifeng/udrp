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
      :api="GetAuditResultList"
      :pager="false"
      :query="form"
      :field-list="tableInfo.fieldList"
      :list-type-info="selects"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
      @el-row-dblclick="toUploadPage"
    >
      <!-- 自定义插槽显示状态 -->

    </comp-table>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import { GetAuditResultList } from '@/api/dataAudit'
export default {
  components: { CompTable },
  data() {
    return {
      GetAuditResultList,
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
          { label: '上报机构', value: 'ClassCode' },
          { label: '项目名称', value: 'ClassCode' },
          { label: '数据表', value: 'ProjectCode' },
          { label: '批次号', value: 'BATCH_NO' },
          { label: '状态', value: 'AUDIT_STATUS' },
          { label: '填报次数', value: 'FILL_IN_TIMES' },
          { label: '提交时间', value: 'COMMITED_DATE_TIME' },
          { label: '提交人', value: 'COMMITED_USER_NAME' },
          { label: '审核次数', value: 'ReadWay' },
          { label: '审核时间', value: 'ProjectLeader' },
          { label: '审核人', value: 'AUDITED_USER_NAME' },
          { label: '上传次数', value: 'UPLOAD_TIMES' },
          { label: '上传时间', value: 'UPLOADED_DATE_TIME' },
          { label: '上传人', value: 'UPLOADED_USER_NAME' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '进入', type: 'primary', icon: 'el-icon-ship', event: 'toUploadPage', show: true }
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
    toUploadPage(data) {
      const { RRB_ID: RrbId, PROJECT_ID: ProjectId, DATA_TABLE_ID: DataTableId, DATA_TABLE_NAME: DataTableName } = data
      this.$router.push({
        path: '/dataAudit/upload',
        query: { RrbId, ProjectId, DataTableId, DataTableName }
      })
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
