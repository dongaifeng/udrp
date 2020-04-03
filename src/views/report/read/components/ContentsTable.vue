<template>
  <div>

    <CompHeader context="数据库服务器设置">
      <template v-slot:right>
        <el-button type="primary" @click="ContentsModifyProjects">保存设置</el-button>
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
      <CompHeader context="内容列表">
        <template v-slot:right>
          <el-button type="primary" @click="clearForm">新建数据表</el-button>
        </template>
      </CompHeader>
      <el-col :span="16">
        <!-- 列表 -->
        <comp-table
          :listen-height="false"
          :height="'calc(100vh - 580px)'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="ContentsGetList"
          :pager="false"
          :query="{ ProjectId }"
          :field-list="tableInfo.fieldList"
          :list-type-info="select"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @selectFile="handleBtnClick"
          @el-row-dblclick="rowDblClick"
        >
          <!-- 自定义插槽显示状态 -->

        </comp-table>
      </el-col>

      <!-- 新增 -->
      <el-col :span="8">
        <CompHeader context="编辑" />

        <el-form ref="DataTableForm" :rules="rules" :model="addForm" label-width="100px">
          <el-form-item label="内容类型" prop="ContentType">
            <el-select v-model="addForm.ContentType" clearable placeholder="请选择活动区域">
              <el-option v-for="item in select.ContentType" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>

          <el-form-item label="内容名" prop="ContentName">
            <el-input v-model="addForm.ContentName" />
          </el-form-item>

          <el-form-item label="中文名" prop="ContentShowName">
            <el-input v-model="addForm.ContentShowName" />
          </el-form-item>

          <el-form-item label="拼音码">
            <el-input v-model="addForm.Py" />
          </el-form-item>

          <el-form-item label="SQL脚本" prop="SqlContent">
            <el-input v-model="addForm.SqlContent" type="textarea" rows="6" />
          </el-form-item>

          <el-form-item label="启用标志">
            <el-checkbox v-model="addForm.IsEnabled" label="" name="IsEnabled" :true-label="1" :false-label="0" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="ContentsAddModels">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompForm from '@/components/CompForm'
import CompHeader from '@/components/CompHeader'
import CompTable from '@/components/CompTable'
import { ContentsGetList, ContentsAddModels, ContentsModifyProjects, ContentsRemoveModels, GetContentsConfig, ContentsModifyModels } from '@/api/report'
export default {
  components: { CompForm, CompHeader, CompTable },
  data() {
    const rules = {
      ContentType: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      ContentName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      ContentShowName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      SqlContent: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }

    return {
      ContentsGetList,
      rules,
      addForm: {
        IsEnabled: 1,
        ReadContentId: null
      },
      select: {
        PushService: [],
        DataSources: [],
        OutPutNode: [],
        ContentType: []
      },
      formInfo: {
        ref: null,
        data: {
          DataSourceId: ''
        },
        fieldList: [
          { label: '数据库连接', value: 'DataSourceId', type: 'select', list: 'DataSources', event: 'DataSourceChange' },
          { label: '服务名', value: 'ServerName', type: 'input' },
          { label: '数据库', value: 'Database', type: 'input' },
          { label: '受限访问用户名', value: 'LimitedUser', type: 'input' },
          { label: '受限访问密码', value: 'LimitedPassword', type: 'input' }
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
          { label: '内容类型', value: 'ContentType' },
          { label: '内容名', value: 'ContentName' },
          { label: '中文名', value: 'ContentShowName' },
          { label: '拼音码', value: 'Py' },
          { label: '启用标志', value: 'IsEnabled', type: 'state', list: this.$store.state.select.EnabledState }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'ContentsRemoveModels', show: true }
          ]
        }

      },
      // 过滤相关配置
      filterInfo: {

      }
    }
  },
  computed: {
    ProjectId() {
      return this.$store.getters.ProjectId
    },
    ServiceId() {
      return this.$store.getters.ServiceId
    },
    toPy() {
      return this.addForm.ContentShowName
    }
  },
  watch: {
    toPy: function(newVal) {
      if (newVal) this.addForm.Py = this.$py.getCamelChars(newVal)
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
    if (this.ProjectId) this.GetContentsConfig()
  },
  methods: {
    async initSelect() {
      this.select.DataSources = await this.$store.dispatch('select/GetDataSources')
      this.select.ContentType = await this.$store.dispatch('select/GetSelect', 'ContentType')
      this.select.PushService = await this.$store.dispatch('select/GetPushService', { ProjectId: this.ProjectId })
    },

    GetContentsConfig() {
      GetContentsConfig({ ProjectId: this.ProjectId }).then(res => {
        console.log(res, '<-----------')
        this.formInfo.data = res
        this.DataSourceChange(res.DataSourceId)
      })
    },
    ContentsModifyProjects() {
      ContentsModifyProjects({ ...this.formInfo.data, ProjectId: this.ProjectId, ServiceId: this.ServiceId }).then(res => {
        this.$message('保存成功')
      })
    },
    ContentsAddModels(formName) {
      this.$refs.DataTableForm.validate((valid) => {
        if (valid) {
          const api = this.addForm.ReadContentId ? ContentsModifyModels : ContentsAddModels
          api({ ...this.addForm, ProjectId: this.ProjectId }).then(res => {
            this.$message('保存成功')
            this.clearForm()
            this.updateTable()
          })
        }
      })
    },
    ContentsRemoveModels(rows) {
      const { ReadContentId, DeleteFlag } = rows
      ContentsRemoveModels({ ReadContentId }).then(res => {
        const msg = DeleteFlag ? '恢复成功' : '删除成功'
        if (res === 1) this.$message(msg)
        this.updateTable()
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },

    rowDblClick(rows) {
      this.addForm = rows
    },
    clearForm() {
      this.addForm = {
        IsEnabled: 1
      }
    },

    handleBtnClick(data) {
      console.log('data', data)
    },
    handleEvent(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    },
    async DataSourceChange(ClassCode) {
      if (!ClassCode) return false
      const res = await this.$store.dispatch('select/GetPushSources', { ClassCode })
      const { ServerName, Database } = res[0]
      this.formInfo.data = { ... this.formInfo.data, ClassCode, ServerName, Database }
    },
    handleClick(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
