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
          <el-button @click="addProject">新建调阅项目</el-button>
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
      :close-on-click-modal="false"
      title="编辑调阅项目"
      :visible.sync="createProjectVisible"
      custom-class="no-padding"
      width="90%"
      top="7vh"
      @close="tabClose"
    >
      <el-tabs v-model="activeTab" :before-leave="tabLeave" type="border-card" tab-position="bottom">
        <el-tab-pane lazy label="项目定义">
          <ProjectDefinition :edit-data="editData" :state.sync="state" @updateTable="updateTable" />
        </el-tab-pane>
        <el-tab-pane name="ServiceList" lazy label="服务列表">
          <ServiceList />
        </el-tab-pane>
        <el-tab-pane name="ContentsTable" lazy label="内容列表">
          <ContentsTable />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import ProjectDefinition from './components/ProjectDefinition'
import ServiceList from './components/ServiceList'
import ContentsTable from './components/ContentsTable'
import { reportedGetLIst, ProjectsRemoveModels } from '@/api/report'
import { getDictName } from '@/utils'
export default {
  components: { ProjectDefinition, ServiceList, ContentsTable },
  data() {
    return {
      reportedGetLIst,
      getDictName,
      activeTab: '',
      createProjectVisible: false,
      editData: null,
      state: 'add',
      selects: {
        projects: []
      },
      // 表单相关
      form: {
        ReportOrganCode: '',
        ProjectType: 'READ',
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
          { label: '调阅方式', value: 'ReadWay' },
          { label: '项目负责人', value: 'ProjectLeader' },
          { label: '日志保存天数', value: 'SaveLogDays' },
          {
            label: '启用标志',
            value: 'IsEnabled',
            type: 'state',
            list: { 0: '启用', 1: '禁用' }
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
      },
      // 过滤相关配置
      filterInfo: {
        query: {}
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
      // GetProjects().then(res => {
      //   this.projectList = res
      // })
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
      ProjectsRemoveModels({ ProjectId, DeleteFlag }).then(res => {
        this.$message('删除成功')
        this.updateTable()
      })
    },
    tabClose() {
      this.updateTable()
      this.activeTab = '0'
    },
    tabLeave(activeName, oldActiveName) {
      const ProjectId = this.$store.getters.ProjectId
      const that = this
      const fn = function() {
        if (ProjectId) {
          return true
        } else {
          that.$message('请确定已保存')
          return false
        }
      }
      // ServiceList, ContentsTable
      switch (activeName) {
        case 'ServiceList':
          return fn()
          break
        case 'ContentsTable':
          return fn()
          break

        default:
          return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
