<template>
  <div>
    <el-row>
      <el-col :span="16">
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
            <el-button type="primary" @click="updateTable">查询</el-button>
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
          :api="ReportDictsGetList"
          :pager="false"
          :query="formInfo.data"
          :field-list="tableInfo.fieldList"
          :list-type-info="select"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @el-row-dblclick="rowDblClick"
        >
          <!-- 自定义插槽显示状态 -->
          <template v-slot:col-ProjectId="slotProps">
            {{ getDictName(select.Projects, slotProps.row.ProjectId ) }}
          </template>

        </comp-table>
      </el-col>

      <el-col :span="8">
        <CompHeader context="编辑" />

        <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="上报项目" prop="ProjectId">
            <el-select v-model="form.ProjectId" clearable placeholder="请选择活动区域">
              <el-option v-for="item in select.Projects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>

          <el-form-item label="字典编码" prop="DefinitionCode">
            <el-input v-model="form.DefinitionCode" />
          </el-form-item>

          <el-form-item label="字典名称" prop="DefinitionName">
            <el-input v-model="form.DefinitionName" />
          </el-form-item>

          <el-form-item label="字典描述">
            <el-input v-model="form.DefinitionDesc" type="textarea" rows="10" />
          </el-form-item>

          <el-form-item label="拼音码" prop="Py">
            <el-input v-model="form.Py" />
          </el-form-item>

          <el-form-item label="顺序号" prop="Sort">
            <el-input v-model="form.Sort" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="ReportDictsAddModels">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getDictName } from '@/utils'
import CompForm from '@/components/CompForm'
import CompHeader from '@/components/CompHeader'
import CompTable from '@/components/CompTable'
import { ReportDictsGetList, ReportDictsModifyModels, ReportDictsAddModels, ReportDictsRemoveModels } from '@/api/report'
export default {
  components: { CompForm, CompHeader, CompTable },
  props: {
    rows: [Object],
    memberMaintainVisible: [Boolean]
  },
  data() {
    const rules = {
      DefinitionCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      DefinitionName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Sort: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }
    return {
      ReportDictsGetList,
      getDictName,
      rules,
      form: {
        IsEnabled: 1,
        Sort: 0
      },
      select: {
        Projects: [],
        OutPutNode: [],
        MonitoringRoute: []
      },
      formInfo: {
        ref: null,
        data: {},
        fieldList: [ // 每一项定义
          { label: '上报项目', value: 'ProjectId', type: 'select', list: 'Projects' },
          { label: '拼音码', value: 'Py', type: 'input' },
          { label: '显示删除', value: 'ShowDelete', type: 'slot' },
          { label: '', value: 'button', type: 'slot' }
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
          { label: '上报项目', value: 'ProjectId', type: 'slot' },
          { label: '字典编码', value: 'DefinitionCode' },
          { label: '字典名称', value: 'DefinitionName' },
          { label: '拼音码', value: 'Py' },
          { label: '字典描述', value: 'DefinitionDesc' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'tableDelete', show: true },
            { label: '成员维护', type: 'primary', icon: 'el-icon-ship', event: 'memberMaintainBtn', show: true }
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
    toPy2() {
      return this.form.DefinitionName
    }
  },
  watch: {
    toPy2: function(newVal) {
      if (newVal) this.form.Py = this.$py.getCamelChars(newVal)
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

    // ReportDictsModifyModels(formName) {
    //   this.formInfo.ref.validate((valid) => {
    //     if (valid) {
    //       ReportDictsModifyModels({ ...this.formInfo.data }).then(res => {
    //         this.$message('保存成功')
    //         this.updateTable()
    //       })
    //     }
    //   })
    // },
    ReportDictsAddModels() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const api = this.form.DefinitionId ? ReportDictsModifyModels : ReportDictsAddModels
          api({ ...this.form }).then(res => {
            this.$store.dispatch('report/SetDefinition', this.form)
            this.$message('保存成功')
            this.updateTable()
            this.form = { IsEnabled: 1, Sort: '0' }
          })
        }
      })
    },
    memberMaintainBtn(rows) {
      console.log(rows, '<------')
      this.$emit('update:rows', rows)
      this.$emit('update:memberMaintainVisible', true)
    },
    tableDelete(rows) {
      const { DefinitionId } = rows
      ReportDictsRemoveModels({ DefinitionId }).then(res => {
        this.$message('删除成功')
        this.updateTable()
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    rowDblClick(rows) {
      this.form = { ...rows }
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
