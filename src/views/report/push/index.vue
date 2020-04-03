<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="上报机构">
            <el-select v-model="form.ReportOrganCode" clearable placeholder="请选择">
              <el-option
                v-for="item in selects.projects"
                :key="item.ClassCode"
                :label="item.ClassName"
                :value="item.ClassCode"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label>
            <el-checkbox v-model="form.ShowEnabled">显示禁用</el-checkbox>
            <el-checkbox v-model="form.ShowDelete">显示删除</el-checkbox>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-button type="primary" @click="updateTable">查询</el-button>
          <el-button @click="addProject">新建推送项目</el-button>
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
      :api="reportedGetLIst"
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
      <template v-slot:col-ReportOrganCode="slotProps">
        {{ getDictName(selects.projects, slotProps.row.ReportOrganCode) }}
      </template>
    </comp-table>
    <!-- 新建 -->
    <el-dialog
      v-if="createProjectVisible"
      title="编辑推送项目"
      top="6vh"
      :close-on-click-modal="false"
      :visible.sync="createProjectVisible"
      custom-class="no-padding"
      width="90%"
      @close="tabClose"
    >
      <el-tabs v-model="activeTab" :before-leave="tabLeave" type="border-card" tab-position="bottom">
        <el-tab-pane lazy label="项目定义">
          <ProjectDefinition :edit-data="editData" :state.sync="state" @changeTab="changeTab" />
        </el-tab-pane>
        <el-tab-pane name="ServiceList" lazy label="服务列表">
          <ServiceList />
        </el-tab-pane>
        <el-tab-pane name="DataTable" lazy label="数据表">
          <DataTable v-if="activeTab === 'DataTable'" @changeTab="changeTab" />
        </el-tab-pane>
        <el-tab-pane name="DataItem" lazy label="数据项">
          <DataItem v-if="activeTab === 'DataItem'" />
        </el-tab-pane>
        <el-tab-pane name="BatchManage" lazy label="批次管理">
          <BatchManage />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import ProjectDefinition from './components/ProjectDefinition'
import ServiceList from './components/ServiceList'
import DataTable from './components/DataTable'
import DataItem from './components/DataItem'
import BatchManage from './components/BatchManage'
import { reportedGetLIst, ProjectsRemoveModels } from '@/api/report'
import { getDictName } from '@/utils'
export default {
  components: {
    CompTable,
    ProjectDefinition,
    ServiceList,
    DataTable,
    DataItem,
    BatchManage
  },
  data() {
    return {
      reportedGetLIst,
      getDictName,
      createProjectVisible: false,
      editData: null,
      ablePro: false,
      activeTab: '',
      state: 'add',
      selects: {
        projects: []
      },
      // 表单相关
      form: {
        ReportOrganCode: '',
        ProjectType: 'PUSH',
        ShowDelete: false,
        ShowEnabled: true
      },
      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '上报机构', value: 'ReportOrganCode', type: 'slot' },
          { label: '项目编号', value: 'ProjectCode' },
          { label: '项目简称', value: 'ProjectShortName' },
          { label: '项目全称', value: 'ProjectName' },
          { label: '项目描述', value: 'ProjectDesc' },
          { label: '拼音码', value: 'Py' },
          { label: '项目负责人', value: 'ProjectLeader' },
          { label: '输出类型', value: 'TaskOutType' },
          { label: '日志保存天数', value: 'SaveLogDays' },
          {
            label: '启用标志',
            value: 'IsEnabled',
            type: 'state',
            list: { 1: '启用', 0: '禁用' }
          }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            {
              label: '编辑',
              type: 'primary',
              icon: 'el-icon-ship',
              event: 'tableEdit',
              show: true
            },
            {
              label: '删除',
              type: 'primary',
              icon: 'el-icon-ship',
              event: 'tableDelete',
              show: true
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
    this.$store.dispatch('report/SetProjectId', '')
  },
  methods: {
    async initSelect() {
      this.selects.projects = await this.$store.dispatch(
        'select/GetSelect',
        'ReportOrgan'
      )
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
      this.$store.dispatch('report/SetProjectId', rows.ProjectId)
      this.$store.dispatch('report/SetDataTableId', rows.DataTableId)
      this.state = 'modify'
      this.editData = rows
      this.createProjectVisible = true
    },
    addProject() {
      this.state = 'add'
      this.editData = null
      this.createProjectVisible = true
      this.$store.dispatch('report/SetProjectId', '')
    },
    tableDelete(rows) {
      const { ProjectId, DeleteFlag } = rows
      ProjectsRemoveModels({ ProjectId, DeleteFlag }).then(res => {
        const msg = DeleteFlag ? '恢复成功' : '删除成功'
        this.$message(msg)
        this.updateTable()
      })
    },
    changeTab(index) {
      console.log(index)
      this.activeTab = index
    },
    tabClose() {
      this.updateTable()
      this.changeTab('0')
    },
    tabLeave(activeName, oldActiveName) {
      const ProjectId = this.$store.getters.ProjectId
      const DataTableId = this.$store.getters.DataTableId
      const that = this
      const fn = function() {
        if (ProjectId) {
          return true
        } else {
          that.$message('请确定已保存')
          return false
        }
      }

      const fn2 = function() {
        if (DataTableId) {
          return true
        } else {
          // that.$message('请确认数据表已保存')
          return false
        }
      }

      switch (activeName) {
        case 'ServiceList':
          return fn()
          break
        case 'DataTable':
          return fn()
          break
        case 'DataItem':
          return fn()
          break
        case 'BatchManage':
          return fn()
          break

        default:
          return true
      }
      // return true
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
