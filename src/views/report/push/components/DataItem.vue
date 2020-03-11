<template>
  <div>

    <CompHeader context="数据表设置">
      <template v-slot:right>
        <el-button type="primary" @click="AddDataItemsTables">保存设置</el-button>
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
      :span="4"
      @handleEvent="handleEvent"
    />

    <el-row>
      <CompHeader context="数据项列表">
        <template v-slot:right>
          <el-button type="primary" @click="AddTableList">批量保存设置</el-button>
          <el-button type="primary" @click="ProduceSql">SQL脚本</el-button>
          <el-button type="primary">新建数据项</el-button>
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
          :check-box="true"
          :tab-index="true"
          :api="GetDataItemsList"
          :pager="false"
          :query="{...filterInfo.query, DataTableId}"
          :field-list="tableInfo.fieldList"
          :list-type-info="select"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @el-selection-change="selectionChange"
        >
          <!-- 自定义插槽显示状态 -->
          <template v-slot:col-IsAuditEdit="slotProps">
            <el-checkbox v-model="slotProps.row.IsAuditEdit" :true-label="1" :false-label="0" />
          </template>

          <template v-slot:col-IsFuzzy="slotProps">
            <el-select v-model="slotProps.row.IsFuzzy" placeholder="请选择" @change="DataTypeChange">
              <el-option v-for="item in select.ControlType" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </template>

          <template v-slot:col-IsFillIn="slotProps">
            <el-checkbox v-model="slotProps.row.IsFillIn" :true-label="1" :false-label="0" />
          </template>

          <template v-slot:col-IsFillInEdit="slotProps">
            <el-checkbox v-model="slotProps.row.IsFillInEdit" :true-label="1" :false-label="0" />
          </template>

          <template v-slot:col-ControlType="slotProps">
            <el-input v-model="slotProps.row.ControlType" />
          </template>

        </comp-table>
      </el-col>

      <!-- 新增 -->
      <el-col :span="8">
        <CompHeader context="编辑" />
        <div style="height: 460px; overflow-x: hidden; overflow-y: scroll;">

          <el-form ref="rulesForm" :rules="rules" :model="addForm" label-width="100px">
            <el-form-item label="字段名称" prop="DataItemCode">
              <el-input v-model="addForm.DataItemCode" />
            </el-form-item>

            <el-form-item label="数据项" prop="DataItemName">
              <el-input v-model="addForm.DataItemName" />
            </el-form-item>

            <el-form-item label="拼音码" prop="Py">
              <el-input v-model="addForm.Py" />
            </el-form-item>

            <el-form-item label="描述">
              <el-input v-model="addForm.DataItemDesc" type="textarea" rows="10" />
            </el-form-item>

            <el-form-item label="数据类型" prop="DataType">
              <el-select v-model="addForm.DataType" placeholder="请选择活动区域" @change="DataTypeChange">
                <el-option v-for="item in select.DataType" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
              </el-select>
            </el-form-item>

            <el-form-item label="长度" prop="LimitLength" :rules="[{ required: DataTypeChangeHandle[2], message: '请输入活动名称' }]">
              <el-input v-model="addForm.LimitLength" :readonly="DataTypeChangeHandle[1]" />
            </el-form-item>

            <el-form-item label="精度" prop="Precision" :rules="[{ required: DataTypeChangeHandle[5], message: '请输入活动名称' }]">
              <el-input v-model="addForm.Precision" :readonly="DataTypeChangeHandle[4]" />
            </el-form-item>

            <el-form-item label="非空标志">
              <el-checkbox v-model="addForm.NotnullFlag" label="" name="NotnullFlag" :true-label="1" :false-label="0" />
            </el-form-item>

            <el-form-item label="引用字典" prop="RefDictDefinitionId" :rules="[{ required: DataTypeChangeHandle[7], message: '请输入活动名称' }]">
              <el-select v-model="addForm.RefDictDefinitionId" filterable placeholder="请选择活动区域" :readonly="DataTypeChangeHandle[6]">
                <el-option v-for="item in select.DataItems" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
              </el-select>
            </el-form-item>

            <el-form-item label="默认值" prop="Default">
              <el-input v-model="addForm.Default" />
            </el-form-item>

            <el-form-item label="启用标志">
              <el-checkbox v-model="addForm.IsEnabled" label="" name="IsEnabled" :true-label="1" :false-label="0" />
            </el-form-item>
            <el-form-item label="审核列表">
              <el-checkbox v-model="addForm.IsAudit" label="" name="IsAudit" :true-label="1" :false-label="0" />
            </el-form-item>
            <el-form-item v-if="flag1" label="审核编辑">
              <el-checkbox v-model="addForm.IsAuditEdit" label="" name="IsAuditEdit" :true-label="1" :false-label="0" />
            </el-form-item>
            <el-form-item v-if="flag2" label="填报列表">
              <el-checkbox v-model="addForm.IsFillIn" label="" name="IsFillIn" :true-label="1" :false-label="0" />
            </el-form-item>
            <el-form-item v-if="flag2" label="填报编辑">
              <el-checkbox v-model="addForm.IsFillInEdit" label="" name="IsFillInEdit" :true-label="1" :false-label="0" />
            </el-form-item>

            <el-form-item v-if="flag2" label="显示宽度" prop="ControlType">
              <el-input v-model="addForm.ControlType" />
            </el-form-item>

            <el-form-item v-if="flag1 || flag2" label="控件类型" prop="ConditioinControlType">
              <el-select v-model="addForm.ConditioinControlType" placeholder="请选择活动区域">
                <el-option v-for="item in select.ControlType" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="DataItemsAddModels">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- sql显示弹框 -->
    <el-dialog
      v-if="innerVisible"
      width="30%"
      title="SQL建立脚本"
      :visible.sync="innerVisible"
      append-to-body
    >
      <div>{{ sql }}</div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleCopy(sql, $event)">复制</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import base from '@/mixin/base'
import { GetDataItemsList, AddDataItemsTables, DataItemsRemoveModels, DataItemsAddModels, ProduceSql, AddTableList } from '@/api/report'
import { mapGetters } from 'vuex'
import clip from '@/utils/clipboard' // use clipboard directly
export default {
  mixins: [base],
  data() {
    const rules = {
      DataItemName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      DataItemCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      DataType: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      // LimitLength: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      // Precision: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }

    return {
      GetDataItemsList,
      rules,
      innerVisible: false,
      flag1: false,
      flag2: false,
      sql: 'select * from database',
      TableList: [],
      addForm: {
        IsEnabled: 1
      },
      // LimitLength, LimitLength-Editable, LimitLength-nullable,  Precision, Precision-Editable, Precision-nullable, RefDictDefinitionId-Editable, RefDictDefinitionId-nullable
      DataTypeChangeHandle: ['', true, false, '', false, true, true, false],
      select: {
        DataTables: [],
        FillStyle: [],
        ControlType: [],
        DataType: [],
        DataItems: [],
        MonitoringRoute: []
      },
      formInfo: {
        ref: null,
        data: {
          DataTableId: '',
          DataAudit: '',
          AuditModify: '',
          Handwork: ''
        },
        fieldList: [
          { label: '数据表', value: 'DataTableId', type: 'select', list: 'DataTables' },
          { label: '数据审核', value: 'DataAudit', type: 'checkbox', event: 'DataAuditChange' },
          { label: '审核修改', value: 'AuditModify', type: 'checkbox', hidden: true },
          { label: '手工填报', value: 'Handwork', type: 'checkbox', event: 'HandworkChange' },
          { label: '填报样式', value: 'FillStyle', type: 'select', list: 'FillStyle', hidden: true }
        ],
        rules: {
          DataTableId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          FillStyle: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
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
          { label: '字段名称', value: 'LimitLength' },
          { label: '数据项', value: 'DataItemName' },
          { label: '数据项描述', value: 'DataItemDesc' },
          { label: '拼音码', value: 'Py' },
          { label: '数据类型', value: 'DataType' },
          { label: '长度', value: 'LimitLength' },
          { label: '精度', value: 'Precision' },
          { label: '主键', value: 'PkFlag' },
          { label: '非空', value: 'NotnullFlag' },
          { label: '引用字典', value: 'RefDictDefinitionId' },
          { label: '默认值', value: 'Default' },
          { label: '状态', value: 'IsEnabled' },

          { label: '审核编辑', value: 'IsAuditEdit', type: 'slot', hidden: true },
          { label: '控件类型', value: 'IsFuzzy', type: 'slot', hidden: true },

          { label: '填报列表', value: 'IsFillIn', type: 'slot', hidden: true },
          { label: '填报编辑', value: 'IsFillInEdit', type: 'slot', hidden: true },
          { label: '显示宽度', value: 'ControlType', type: 'slot', hidden: true }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'deleteTableRow', show: true }
          ]
        }

      },
      // 过滤相关配置
      filterInfo: {
        query: {
          DataTableId: '',
          page: 1,
          rows: 100
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'ProjectId',
      'DataTableId'
    ])
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.select.DataTables = await this.$store.dispatch('select/GetDataTables', { ProjectId: '1' })
      this.select.DataType = await this.$store.dispatch('select/GetSelect', 'DataType')
      this.select.FillStyle = await this.$store.dispatch('select/GetSelect', 'FillStyle')
      this.select.DataItems = await this.$store.dispatch('select/GetSelect', 'DataItems')
      this.select.ControlType = await this.$store.dispatch('select/GetSelect', 'ControlType')
    },
    AddTableList() {
      AddTableList(this.TableList).then(res => {
        console.log(res)
        this.$message('保存成功')
      })
    },
    AddDataItemsTables(formName) {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          AddDataItemsTables(this.formInfo.data).then(res => {
            this.$message('保存成功')
            const { AuditModify, Handwork } = this.formInfo.data
            // const arr = this.tableInfo.fieldList
            if (AuditModify) {
              this.tableInfo.fieldList[12].hidden = false
              this.tableInfo.fieldList[13].hidden = false
              this.flag1 = true
              // this.tableInfo.fieldList[this.findIndex(arr, 'IsAuditEdit')].hidden = false
              // this.tableInfo.fieldList[this.findIndex(arr, 'IsFuzzy')].hidden = false
            }

            if (Handwork) {
              this.tableInfo.fieldList[13].hidden = false
              this.tableInfo.fieldList[14].hidden = false
              this.tableInfo.fieldList[15].hidden = false
              this.tableInfo.fieldList[16].hidden = false
              this.flag2 = true
              // this.tableInfo.fieldList[this.findIndex(arr, 'IsFillIn')].hidden = false
              // this.tableInfo.fieldList[this.findIndex(arr, 'IsFuzzy')].hidden = false
              // this.tableInfo.fieldList[this.findIndex(arr, 'IsFillInEdit')].hidden = false
              // this.tableInfo.fieldList[this.findIndex(arr, 'ControlType')].hidden = false
            }
          })
        }
      })
    },
    findIndex(arr, name) {
      return arr.findIndex(item => item.value === name)
    },
    async deleteTableRow(data) {
      this.delete(DataItemsRemoveModels, { DataItemId: data.DataItemId }, data.DeleteFlag)
    },
    DataItemsAddModels() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          DataItemsAddModels({ ...this.addForm, DataTableId: this.DataTableId }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },
    ProduceSql() {
      ProduceSql({ DataTableId: this.DataTableId }).then(res => {
        console.log(res)
        this.sql = res
        this.innerVisible = true
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    selectionChange(rows) {
      console.log(rows)
      this.TableList = rows
    },

    DataTypeChange(data) {
      const obj = {
        // LimitLength, LimitLength-Editable, LimitLength-nullable,  Precision, Precision-Editable, Precision-nullable, RefDictDefinitionId-Editable, RefDictDefinitionId-nullable
        String: ['50', true, false, '', false, false, false, false],
        Reference: ['50', true, false, '', false, false, true, true],
        Text: ['max', true, false, '', false, false, false, false],
        Double: ['12', true, false, '2', true, false, false, false],
        Integer: ['', false, true, '', false, false, false, false],
        DateTime: ['', false, true, '', false, false, false, false]
      }

      const { ClassName } = this.select.DataType.find((item) => item.ClassCode === data)

      console.log(data, ClassName, obj[ClassName], obj[ClassName][0])
      this.DataTypeChangeHandle = obj[ClassName]
      this.addForm.LimitLength = obj[ClassName][0]
      this.addForm.Precision = obj[ClassName][3]
      this.addForm.RefDictDefinitionId = ''

      // this.LimitLengthReadonly = obj[data][1]
      // this.PrecisionReadonly = obj[data][4]
    },

    DataAuditChange(data) {
      this.formInfo.fieldList[2].hidden = !data
    },
    HandworkChange(data) {
      this.formInfo.fieldList[4].hidden = !data
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
