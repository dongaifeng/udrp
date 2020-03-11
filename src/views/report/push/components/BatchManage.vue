<template>
  <div>

    <CompHeader context="批次号规则设置">
      <template v-slot:right>
        <el-button type="primary" @click="AddBatchRule">保存设置</el-button>
      </template>
    </CompHeader>
    <!-- 查询 -->
    <CompForm
      :ref-obj.sync="formInfo.ref"
      :form-data="formInfo.data"
      :field-list="formInfo.fieldList"
      :label-width="formInfo.labelWidth"
      :list-type-info="select"
      :rules="formInfo.rules"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽的使用 -->
      <template v-slot:form-Database>
        <el-checkbox v-model="formInfo.data.YearFlag" :true-label="1" :false-label="0">年</el-checkbox>
        <el-checkbox v-model="formInfo.data.HalfYearFlag" :true-label="1" :false-label="0">半年</el-checkbox>
        <el-checkbox v-model="formInfo.data.QuarterFlag" :true-label="1" :false-label="0">季</el-checkbox>
        <el-checkbox v-model="formInfo.data.MonthFlag" :true-label="1" :false-label="0">月</el-checkbox>
        <el-checkbox v-model="formInfo.data.DayFlag" :true-label="1" :false-label="0">日</el-checkbox>

      </template>

      <template v-slot:form-txt>
        <span style="color: red">[年]+'-'+[半年]+'-'+[季]+'-'+[月]+'-'+[日] ，1900-1-1-01-01</span>
      </template>
    </CompForm>

    <el-row>
      <CompHeader context="上报批次列表">
        <template v-slot:right>
          <el-button type="primary" @click="GetBatch">新建批次号</el-button>
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
          :api="GetBatchList"
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

        <el-form ref="BatchForm" :rules="rules" :model="addForm" label-width="100px">
          <el-form-item label="批次号" prop="BatchNo">
            <el-input v-model="addForm.BatchNo" />
          </el-form-item>

          <el-form-item label="开始日期" prop="StartDate">
            <el-date-picker
              v-model="addForm.StartDate"
              type="date"
              format="yyyy-mm-dd"
              value-format="yyyy-mm-dd"
              placeholder="选择日期"
            />
          </el-form-item>

          <el-form-item label="结束日期" prop="EndDate">
            <el-date-picker
              v-model="addForm.EndDate"
              type="date"
              format="yyyy-mm-dd"
              value-format="yyyy-mm-dd"
              placeholder="选择日期"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="AddBatchModels">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import base from '@/mixin/base'
import { AddBatchRule, GetBatchList, GetBatch, AddBatchModels, BatchRemoveModels } from '@/api/report'
import { mapGetters } from 'vuex'
export default {
  mixins: [base],
  data() {
    const rules = {
      BatchNo: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      EndDate: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      StartDate: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }

    return {
      GetBatchList,
      rules,
      addForm: {},
      select: {
        PushService: [],
        Period: [],
        OutPutNode: [],
        MonitoringRoute: []
      },
      formInfo: {
        ref: null,
        data: {
          YearFlag: 1,
          HalfYearFlag: 0,
          QuarterFlag: 0,
          MonthFlag: 0,
          DayFlag: 0,
          RuleDesc: '年-月-日',
          ConnStri: '-'
        },
        fieldList: [ // 每一项定义
          { label: '上报周期', value: 'ReportCycle', type: 'select', list: 'Period' },
          { label: '自动创建', value: 'AutoFlag', type: 'checkbox', span: 3 },
          { label: '规则', value: 'Database', type: 'slot', span: 8 },
          { label: '连接符', value: 'ConnStri', type: 'input' },
          { label: '规则描述', value: 'RuleDesc', type: 'input', disabled: true },
          { label: '范例说明', value: 'txt', type: 'slot', span: 10 }
        ],
        rules: {
          ReportCycle: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
        }
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '批次号', value: 'BatchNo' },
          { label: '涉及业务日期范围', value: 'BusinessDateRange' },
          { label: '创建日期', value: 'CreatedDateTime' },
          { label: '创建人', value: 'CreatedUserId' },
          { label: '修改日期', value: 'UpdatedDateTime' },
          { label: '修改人', value: 'UpdatedUserId' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '查看记录', type: 'primary', icon: 'el-icon-ship', event: 'selectFile', show: true },
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
    ...mapGetters([
      'ProjectId'
    ])
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.select.Period = await this.$store.dispatch('select/GetSelect', 'Period')
      this.select.PushService = await this.$store.dispatch('select/GetPushService', { ProjectId: '1' })
    },

    AddBatchRule() {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          AddBatchRule({ ...this.formInfo.data, ProjectId: this.ProjectId }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },

    GetBatch() {
      GetBatch({ ProjectId: this.ProjectId }).then(res => {
        console.log(res)
        this.addForm = res
      })
    },

    AddBatchModels() {
      this.$refs.BatchForm.validate((valid) => {
        if (valid) {
          AddBatchModels({ ...this.addForm, ProjectId: this.ProjectId }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },

    async DataSourceChange(ClassCode) {
      const res = await this.$store.dispatch('select/GetPushSources', { ClassCode })
      const { ServerName, Database } = res[0]
      this.formInfo.data = { ClassCode, ServerName, Database }
    },
    async deleteTableRow(data) {
      this.delete(BatchRemoveModels, { RrbId: data.RrbId }, data.DeleteFlag)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
