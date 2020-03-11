<template>
  <div>

    <CompHeader context="数据库服务设置">
      <template v-slot:right>
        <el-button type="primary" @click="ModifyProjects">保存设置</el-button>
      </template>
    </CompHeader>
    <!-- 查询 -->
    <CompForm
      :ref-obj.sync="formInfo.ref"
      :form-data="formInfo.data"
      :field-list="formInfo.fieldList"
      :label-width="formInfo.labelWidth"
      :list-type-info="select"
      @handleEvent="handleEvent"
    />

    <el-row>
      <CompHeader context="数据表列表">
        <template v-slot:right>
          <el-button type="primary">新建数据表</el-button>
        </template>
      </CompHeader>
      <el-col :span="16">
        <!-- 列表 -->
        <comp-table
          :listen-height="false"
          :height="'500px'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="GetDataTableList"
          :pager="false"
          :query="filterInfo.query"
          :field-list="tableInfo.fieldList"
          :list-type-info="select"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 自定义插槽显示状态 -->

        </comp-table>
      </el-col>

      <!-- 新增 -->
      <el-col :span="8">
        <CompHeader context="编辑" />

        <el-form ref="DataTableForm" :rules="rules" :model="addForm" label-width="100px">
          <el-form-item label="数据表名称" prop="DataTableName">
            <el-input v-model="addForm.DataTableName" />
          </el-form-item>

          <el-form-item label="数据表" prop="DataTableCode">
            <el-input v-model="addForm.DataTableCode" />
          </el-form-item>

          <el-form-item label="拼音码" prop="Py">
            <el-input v-model="addForm.Py" />
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="addForm.DataTableDesc" type="textarea" rows="10" />
          </el-form-item>

          <el-form-item label="依托服务" prop="ServiceId">
            <el-select v-model="addForm.ServiceId" placeholder="请选择活动区域">
              <el-option v-for="item in select.PushService" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>

          <el-form-item label="启用标志">
            <el-checkbox v-model="addForm.IsEnabled" label="" name="IsEnabled" :true-label="1" :false-label="0" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="AddDataTable">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import base from '@/mixin/base'
import { GetDataTableList, AddDataTable, ModifyProjects, DataTablesRemoveModels } from '@/api/report'
export default {
  mixins: [base],
  data() {
    const rules = {
      DataTableCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      DataTableName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }

    return {
      GetDataTableList,
      rules,
      addForm: {
        IsEnabled: 1
      },
      select: {
        PushService: [],
        DataSources: [],
        OutPutNode: [],
        MonitoringRoute: []
      },
      formInfo: {
        ref: null,
        data: {
          DataSourceId: ''
        },
        fieldList: [ // 每一项定义
          { label: '数据库连接', value: 'DataSourceId', type: 'select', list: 'DataSources', event: 'DataSourceChange' },
          { label: '服务名', value: 'ServerName', type: 'input' },
          { label: '数据库', value: 'Database', type: 'input' }
        ]
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '数据表名称', value: 'DataTableName' },
          { label: '数据表', value: 'DataTableCode' },
          { label: '描述', value: 'DataTableDesc' },
          { label: '拼音码', value: 'Py' },
          { label: '启用标志', value: 'IsEnabled', type: 'state', list: this.$store.state.select.EnabledState }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '数据项', type: 'primary', icon: 'el-icon-ship', event: 'toDataItem', show: true },
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'deleteTableRow', show: true }
          ]
        }

      },
      // 过滤相关配置
      filterInfo: {
        query: {
          ProjectId: '1',
          page: 1,
          rows: 100
        }
      }
    }
  },
  computed: {
    ProjectId() {
      return this.$store.getters.ProjectId
    },
    ServiceId() {
      return this.$store.getters.ServiceId
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.select.DataSources = await this.$store.dispatch('select/GetDataSources')
      this.select.PushService = await this.$store.dispatch('select/GetPushService', { ProjectId: this.ProjectId })
    },
    ModifyProjects() {
      ModifyProjects({ ...this.formInfo.data, ProjectId: this.ProjectId, ServiceId: this.ServiceId }).then(res => {
        this.$message('保存成功')
      })
    },
    AddDataTable(formName) {
      this.$refs.DataTableForm.validate((valid) => {
        if (valid) {
          AddDataTable({ ...this.addForm, ProjectId: this.ProjectId }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    toDataItem() {
      this.$emit('changeTab', 'DataItem')
    },
    async deleteTableRow(data) {
      const res = await DataTablesRemoveModels({ DataTableId: data.DataTableId })
      const msg = data.DeleteFlag ? '恢复成功' : '删除成功'
      if (res === 1) this.$message(msg)
      this.updateTable()
    },

    async DataSourceChange(ClassCode) {
      const res = await this.$store.dispatch('select/GetPushSources', { ClassCode })
      const { ServerName, Database } = res[0]
      this.formInfo.data = { ClassCode, ServerName, Database }
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
