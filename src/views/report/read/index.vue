<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="上报机构">
            <el-select v-model="form.ReportOrganCode" placeholder="请选择上报机构">
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
    </comp-table>
    <!-- 新建 -->
    <el-dialog
      v-if="createProjectVisible"
      title="编辑推送项目"
      :visible.sync="createProjectVisible"
      custom-class="no-padding"
      width="80%"
    >
      <el-tabs type="border-card" tab-position="bottom">
        <el-tab-pane lazy label="项目定义">
          <ProjectDefinition :edit-data="editData" :state="state" />
        </el-tab-pane>
        <el-tab-pane lazy label="服务列表">
          <ServiceList />
        </el-tab-pane>
        <el-tab-pane lazy label="内容列表">
          <ContentsTable />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import ProjectDefinition from './components/ProjectDefinition'
import ServiceList from './components/ServiceList'
import ContentsTable from './components/ContentsTable'
import { reportedGetLIst, ProjectsRemoveModels } from '@/api/report'
export default {
  components: { CompTable, ProjectDefinition, ServiceList, ContentsTable },
  data() {
    return {
      reportedGetLIst,
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
        ShowEnabled: false
      },
      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '上报机构', value: 'ClassCode' },
          { label: '项目编号', value: 'ProjectCode' },
          { label: '项目简称', value: 'ProjectShortName' },
          { label: '状态', value: 'Status' },
          { label: '项目全称', value: 'ProjectName' },
          { label: '项目描述', value: 'ProjectDesc' },
          { label: '拼音码', value: 'Py' },
          { label: '调阅方式', value: 'ReadWay' },
          { label: '项目负责人', value: 'ProjectLeader' },
          { label: '输出类型', value: 'TaskOutType' },
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
    submit(formName) {
      this.formInfo.ref.validate(valid => {
        if (valid) {
          alert('submit!')
          console.log(this.formInfo.data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      ProjectsRemoveModels({ ProjectId, DeleteFlag }).then(res => {
        this.$message('删除成功')
        this.updateTable()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
