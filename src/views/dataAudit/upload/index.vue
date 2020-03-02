<template>
  <div class="app-container">

    <el-row>
      <!-- tree 菜单 -->
      <el-col :span="4">
        <el-tree
          :data="selects.projects"
          :props="treeProps"
          :load="loadNode"
          lazy
          accordion
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-col>

      <!-- 右侧 表格 -->
      <el-col :span="20">
        <!-- 上 -->
        <el-row>
          <CompForm
            :ref-obj.sync="formInfo.ref"
            :form-data="formInfo.data"
            :field-list="formInfo.fieldList"
            :label-width="formInfo.labelWidth"
          />
          <!-- 表格 -->
          <comp-table
            :listen-height="false"
            :height="200"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurpage"
            :data.sync="tableInfo.data"
            :check-box="false"
            :tab-index="true"
            :api="UploadGetList"
            :pager="false"
            :query="tableInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="selects"
            :handle="tableInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
            @el-row-dblclick="tableEdit"
          />
        </el-row>

        <!-- 下 -->
        <el-row style="margin-top: 20px">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="上报机构">
                  <el-select v-model="form.ReportOrganCode" placeholder="请选择活动区域">
                    <el-option v-for="item in selects.projects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="">
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
            :height="'calc(100vh - 450px)'"
            :refresh="tableInfo2.refresh"
            :init-curpage="tableInfo2.initCurpage"
            :data.sync="tableInfo2.data"
            :check-box="false"
            :tab-index="true"
            :api="UploadGetDictTable"
            :pager="false"
            :query="form"
            :field-list="tableInfo2.fieldList"
            :handle="tableInfo2.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
            @el-row-dblclick="tableEdit"
          >
          <!-- 自定义插槽显示状态 -->

          </comp-table>
        </el-row>

      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import CompForm from '@/components/CompForm'
import { UploadGetList, UploadGetDictTable } from '@/api/dataAudit'
export default {
  components: { CompTable, CompForm },
  data() {
    return {
      UploadGetList,
      UploadGetDictTable,
      treeProps: {
        label: 'ClassName',
        // isLeaf: 'leaf',
        children: 'ClassName'
      },

      selects: {
        projects: []
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
        query: {
          DataTableId: ''
        },
        fieldList: [
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
            { label: '编辑', type: 'primary', icon: 'el-icon-ship', event: 'tableEdit', show: true },
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'tableDelete', show: true }
          ]
        }

      },

      // 表格相关
      tableInfo2: {
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
          { label: '项目负责人', value: 'ProjectLeader' },
          { label: '输出类型', value: 'TaskOutType' },
          { label: '日志保存天数', value: 'SaveLogDays' },
          { label: '启用标志', value: 'IsEnabled', type: 'state', list: { 0: '启用', 1: '禁用' }}
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '编辑', type: 'primary', icon: 'el-icon-ship', event: 'tableEdit', show: true },
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'tableDelete', show: true }
          ]
        }

      },
      // 表单配置表
      formInfo: {
        ref: null,
        data: {},
        fieldList: [
          { label: '数据表', value: 'DataTableName', type: 'input', disabled: true },
          { label: '服务名', value: 'ServerName', type: 'input', disabled: true },
          { label: '数据库服务名', value: 'DataServerName', type: 'input', disabled: true },
          { label: '数据库', value: 'Database', type: 'input', disabled: true }
        ]
      }
    }
  },
  mounted() {
    // this.updateTable()
    this.initSelect()
  },
  methods: {
    // api调用
    async initSelect() {
      this.selects.projects = await this.$store.dispatch('select/GetProjects', { Type: '4' })
    },

    updateTable(ref) {
      if (ref && ref === 2) {
        this.tableInfo2.refresh = Math.random()
      } else {
        this.tableInfo.refresh = Math.random()
      }
    },

    // tree方法
    handleNodeClick(data, node, that) {
      if (node.level === 2) {
        console.log(data.ClassCode, '<---------')
        this.tableInfo.query.DataTableId = data.ClassCode
        // this.updateTable()
        UploadGetList({ DataTableId: data.ClassCode }).then(res => {
          const { BatchAudit, ...data } = res
          this.formInfo.data = data
          this.tableInfo.data = BatchAudit
        })
      }
    },

    loadNode(node, resolve) {
      const { data, level } = node

      if (level === 0) return resolve([{ name: 'region' }])
      if (level > 1) return resolve([])

      this.$store.dispatch('select/GetDataTables', { ProjectId: data.ClassCode }).then(res => {
        resolve(res)
      })
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
      // ProjectsRemoveModels({ ProjectId, DeleteFlag }).then(res => {
      //   this.$message('删除成功')
      //   this.updateTable()
      // })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
