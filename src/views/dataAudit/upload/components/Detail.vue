<template>
  <div>
    <CompHeader context="详情">
      <template v-slot:right>
        <el-button type="primary">保存设置</el-button>
      </template>
    </CompHeader>

    <CompForm
      :ref-obj.sync="formInfo.ref"
      :form-data="formInfo.data"
      :field-list="formInfo.fieldList"
      :label-width="formInfo.labelWidth"
      :list-type-info="listTypeInfo"
      :span="24"
      :rules="formInfo.rules"
    >
      <!-- 自定义插槽的使用 -->

    </CompForm>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="addProject">保存</el-button>
    </el-row>
  </div>
</template>

<script>
import CompForm from '@/components/CompForm'
import { ProjectsAddModels, ProjectsModifyModels } from '@/api/report'
export default {
  components: { CompForm },
  props: ['editData', 'state'],
  data() {
    return {
      listTypeInfo: {
        GetProjects: [],
        OutPutType: [],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
        ]
      },
      formInfo: {
        ref: null,
        data: {
          ProjectDesc: '',
          ProjectShortName: '',
          ProjectCode: '',
          IsEnabled: true
        },
        fieldList: [
          { label: '上报机构', value: 'ProjectCode', type: 'select', list: 'GetProjects' },
          { label: '项目编码', value: 'ReportOrganCode', type: 'input' },
          { label: '项目简称', value: 'ProjectShortName', type: 'input' },
          { label: '标签全称', value: 'ProjectName', type: 'input' },
          { label: '拼音码', value: 'Py', type: 'input' },
          { label: '院方负责人', value: 'ProjectLeader', type: 'input' },
          { label: '输出类型', value: 'status', type: 'select', list: 'OutPutType' },
          { label: '日志保存天数', value: 'SaveLogDays', type: 'input' },
          { label: '显示顺序', value: 'Sort', type: 'input' },
          { label: '启用标志', value: 'IsEnabled', type: 'slot' }
        ],
        rules: {
          ProjectCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          ReportOrganCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          ProjectShortName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          ProjectName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          status: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          SaveLogDays: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          Sort: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
        }
      }
    }
  },
  computed: {
    ProjectShortName() {
      return this.formInfo.data.ProjectShortName
    }
  },
  watch: {
    ProjectShortName: function(newVal) {
      this.formInfo.data.Py = this.$py.getCamelChars(newVal)
    }
  },
  mounted() {
    this.initSelect()
    if (this.editData) this.formInfo.data = this.editData
  },
  methods: {
    addProject(formName) {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          const data = { ...this.formInfo.data, IsEnabled: Number(this.formInfo.data.IsEnabled), CreatedUserId: '1', ProjectType: 'PUSH' }
          const api = this.state === 'add' ? ProjectsAddModels : ProjectsModifyModels
          api(data).then(res => {
            this.$store.dispatch('report/SetProjectId', res)
            this.$message('保存成功')
          })
        }
      })
    },

    async initSelect() {
      this.listTypeInfo.GetProjects = await this.$store.dispatch('select/GetSelect', 'ReportOrgan')
      this.listTypeInfo.OutPutType = await this.$store.dispatch('select/GetSelect', 'OutPutType')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__body {
    padding: 0px;
}
.center{
  text-align: center;
  margin: 0 auto;
}
</style>
