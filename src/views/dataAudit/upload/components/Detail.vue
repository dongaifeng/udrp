<template>
  <div>
    <CompHeader context="详情">
      <template v-slot:right>
        <i class="el-icon-close" style="margin-right: 10px;" @click="close" />
      </template>
    </CompHeader>

    <CompForm
      :ref-obj.sync="formInfo.ref"
      :form-data="formInfo.data"
      :field-list="formInfo.fieldList"
      :label-width="formInfo.labelWidth"
      :list-type-info.sync="selects"
      :span="23"
      :rules="formInfo.rules"
    >
      <!-- 自定义插槽的使用 -->
      <template v-slot:form-IsEnabled>
        <!-- <el-checkbox v-model="formInfo.data.IsEnabled" :true-label="1" :false-label="0" /> -->
        <el-select v-model="form.DataItemId" clearable placeholder="请选择数据项" @change="DataItemChange">
          <el-option v-for="item in selects.ProjectsDataItem" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
        </el-select>
      </template>

    </CompForm>

    <el-row type="flex" justify="center">
      <el-button v-if="btnShow" type="primary" @click="ModifyTableModels">保存</el-button>
    </el-row>
  </div>
</template>

<script>
import { GetTableModels, GetReportDictItems, ModifyTableModels } from '@/api/dataAudit'

export default {
  props: {
    detailData: [Object],
    dataTableId: [String],
    fieldList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btnShow: false,
      selects: {},
      formInfo: {
        ref: null,
        data: {},
        fieldList: [
        ],
        rules: {}
      }
    }
  },
  // computed: {
  //   ProjectShortName() {
  //     return this.formInfo.data.ProjectShortName
  //   }
  // },
  watch: {

    // fieldList: {
    //   handler: function(newVal) {
    //     this.formInfo.fieldList = newVal.map(i => ({ label: i.label, value: i.value, type: 'input' }))
    //   },
    //   immediate: true
    // },
    // detailData: {
    //   handler: function(newVal) {
    //     this.formInfo.data = newVal
    //   },
    //   immediate: true
    // }

  },
  mounted() {
    this.initSelect()
    // this.formInfo.fieldList = this.fieldList.map(i => ({ label: i.label, value: i.value, type: 'input' }))
    // this.formInfo.data = this.detailData
    // this.GetTableModels()
  },
  methods: {
    async initSelect() {

    },
    close() {

    },
    GetTableModels(DataTableId, RECORD_FLOW) {
      console.log(DataTableId, RECORD_FLOW, '--------')

      GetTableModels({ DataTableId, RECORD_FLOW }).then(res => {
        console.log(res)
        const { ItemList = [], Btn, Models = {}} = res
        this.btnShow = Btn

        this.formInfo.fieldList = ItemList.map(i => {
          const obj = {
            label: i.DataItemName || 'name',
            value: i.DataItemCode,
            type: i.ControlType || 'input',
            list: ''
          }
          this.getSelect(i.RefDictDefinitionId).then(res => {
            obj.list = res
          })
          return obj
        })

        this.formInfo.data = Models[0]
        this.formInfo.data.DataTableId = DataTableId
        this.formInfo.data.RECORD_FLOW = RECORD_FLOW
      })
    },
    async getSelect(DefinitionId) {
      const name = `DefinitionId_${DefinitionId}`
      const res = GetReportDictItems({ DefinitionId })
      this.selects[name] = res
      return res
    },
    ModifyTableModels() {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          ModifyTableModels({ ...this.formInfo.data }).then(res => {
            this.$message('保存成功')
          })
        }
      })
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
