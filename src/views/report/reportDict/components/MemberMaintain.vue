<template>
  <div class="container">

    <el-row>

      <el-col :span="18">
        <CompForm
          :ref-obj.sync="formInfo.ref"
          :form-data="formInfo.data"
          :field-list="formInfo.fieldList"
          :label-width="formInfo.labelWidth"
          :list-type-info="select"
          :rules="formInfo.rules"
          @handleEvent="handleEvent"
        >
          <template v-slot:form-ShowDelete>
            <el-checkbox v-model="formInfo.data.ShowDelete" />
          </template>

          <template v-slot:form-button>

            <el-button type="text" @click="DownloadTemplate">下载模板</el-button>
            <el-button type="primary" @click="updateTable">查询</el-button>

            <comp-upload
              action="/System/HospitalDictMembers/Import"
              :data="formInfo.data"
              :label="'导入'"
            />
          </template>
        </CompForm>

        <!-- 列表 -->
        <comp-table
          :listen-height="false"
          :height="'500px'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="ReportDictMembersGetList"
          :pager="false"
          :query="formInfo.data"
          :field-list="tableInfo.fieldList"
          :list-type-info="select"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 自定义插槽显示状态 -->

        </comp-table>
      </el-col>

      <el-col :span="6">
        <CompHeader context="编辑" />

        <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="外部字典" prop="ProjectId">
            <el-input v-model="form.DefinitionId" />
          </el-form-item>

          <el-form-item label="成员编码" prop="MemberCode">
            <el-input v-model="form.MemberCode" />
          </el-form-item>

          <el-form-item label="成员名称" prop="MemberName">
            <el-input v-model="form.MemberName" />
          </el-form-item>

          <el-form-item label="成员描述">
            <el-input v-model="form.MemberDesc" type="textarea" rows="10" />
          </el-form-item>

          <el-form-item label="拼音码" prop="Py">
            <el-input v-model="form.Py" />
          </el-form-item>

          <el-form-item label="顺序号" prop="Sort">
            <el-input v-model="form.Sort" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="ReportDictMembersAddModels">保存</el-button>
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
import { getDictName } from '@/utils'
import { ReportDictMembersGetList, ReportDictMembersModifyModels, ReportDictMembersAddModels, ReportDictMembersRemoveModels } from '@/api/report'
import { DownloadTemplate } from '@/api/select'
export default {
  components: { CompForm, CompHeader, CompTable },
  props: {
    rows: [Object]
  },
  data() {
    const rules = {
      MemberCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      MemberName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Sort: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }
    return {
      ReportDictMembersGetList,
      DownloadTemplate,
      rules,
      form: {
        IsEnabled: 1,
        DefinitionId: this.rows.DefinitionId
      },
      select: {
        Projects: []
      },
      formInfo: {
        ref: null,
        data: {
          DefinitionId: this.rows.DefinitionId,
          ProjectId: this.rows.ProjectId
        },
        fieldList: [ // 每一项定义
          { label: '上报项目', value: 'ProjectId', type: 'input', span: '5' },
          { label: '上报字典', value: 'DefinitionId', type: 'input', span: '5' },
          { label: '拼音码', value: 'Py', type: 'input', span: '5' },
          { label: '显示删除', value: 'ShowDelete', type: 'slot', span: '2' },
          { label: '', value: 'button', type: 'slot', span: '7' }
        ],
        rules: {}
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '上报项目', value: 'DefinitionName' },
          { label: '成员编码', value: 'MemberCode' },
          { label: '成员名称', value: 'MemberName' },
          { label: '拼音码', value: 'Py' },
          { label: '描述', value: 'MemberDesc' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'tableDelete', show: true }
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
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.select.Projects = await this.$store.dispatch('select/GetProjects')
    },

    ReportDictMembersModifyModels(formName) {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          ReportDictMembersModifyModels({ ...this.formInfo.data, ProjectId: this.ProjectId }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },
    ReportDictMembersAddModels() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const DefinitionName = getDictName(this.select.Projects, this.rows.ProjectId)
          ReportDictMembersAddModels({ ...this.form, DefinitionName }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    tableDelete(rows) {
      const { MemberId } = rows
      ReportDictMembersRemoveModels({ MemberId }).then(res => {
        this.$message('删除成功')
        this.updateTable()
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
  .container{
    padding: 0 20px;
  }
</style>
