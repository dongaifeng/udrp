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
          :height="'calc(100vh - 180px)'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="HospitalDictsGetList"
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
        </comp-table>
      </el-col>

      <el-col :span="8">
        <CompHeader context="编辑" />

        <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="院内系统" prop="SystemCode">
            <el-select v-model="form.SystemCode" clearable placeholder="请选择 ">
              <el-option
                v-for="item in select.HospitalSystem"
                :key="item.ClassCode"
                :label="item.ClassName"
                :value="item.ClassCode"
              />
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
            <el-button type="primary" @click="HospitalDictsAddModels">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getDictName } from '@/utils'
import {
  HospitalDictsGetList,
  HospitalDictsModifyModels,
  HospitalDictsAddModels,
  HospitalDictsRemoveModels
} from '@/api/system'
import base from '@/mixin/base'
export default {
  mixins: [base],
  props: {
    rows: [Object],
    memberMaintainVisible: [Boolean]
  },
  data() {
    const rules = {
      DefinitionId: [
        { required: true, message: '请输入', trigger: 'blur' }
      ],
      DefinitionName: [
        { required: true, message: '请输入', trigger: 'blur' }
      ],
      SystemCode: [{ required: true, message: '请输入', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入', trigger: 'blur' }],
      Sort: [{ required: true, message: '请输入', trigger: 'blur' }]
    }
    return {
      HospitalDictsGetList,
      rules,
      form: {
        IsEnabled: 1,
        Sort: '0'
      },
      select: {
        HospitalSystem: []
      },
      formInfo: {
        ref: null,
        data: {
          ShowDelete: 'false',
          Py: ''
        },
        fieldList: [
          {
            label: '院内系统',
            value: 'SystemCode',
            type: 'select',
            list: 'HospitalSystem'
          },
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
          { label: '院内系统', value: 'SystemName' },
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
            {
              label: '成员维护',
              type: 'primary',
              icon: 'el-icon-ship',
              event: 'memberMaintainBtn',
              show: true
            },
            {
              label: '删除',
              event: 'deleteTableRow',
              show: true
            }
          ]
        }
      }
    }
  },
  computed: {
    toPy2() {
      return this.form.DefinitionName
    }
  },
  watch: {
    toPy2: function(newVal) {
      console.log(newVal, '<------')
      if (newVal) this.form.Py = this.$py.getCamelChars(newVal)
    }
  },

  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.select.HospitalSystem = await this.$store.dispatch(
        'select/GetSelect',
        'HospitalSystem'
      )
    },

    // HospitalDictsModifyModels(formName) {
    //   this.formInfo.ref.validate(valid => {
    //     if (valid) {
    //       HospitalDictsModifyModels({
    //         ...this.formInfo.data,
    //         ProjectId: this.ProjectId
    //       }).then(res => {
    //         this.$message('保存成功')
    //       })
    //     }
    //   })
    // },

    HospitalDictsAddModels() {
      const api = this.form.DefinitionId ? HospitalDictsModifyModels : HospitalDictsAddModels

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const SystemName = getDictName(
            this.select.HospitalSystem,
            this.form.SystemCode
          )
          api({ ...this.form, SystemName }).then(res => {
            this.form = { IsEnabled: 1, Sort: '0' }
            this.$message('保存成功')
            this.updateTable()
          })
        }
      })
    },

    memberMaintainBtn(rows) {
      this.$emit('update:rows', rows)
      this.$emit('update:memberMaintainVisible', true)
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    rowDblClick(rows) {
      this.form = { ...rows }
    },

    async deleteTableRow(data) {
      const res = await HospitalDictsRemoveModels({ DefinitionId: data.DefinitionId })
      const msg = data.DeleteFlag ? '恢复成功' : '删除成功'
      if (res === 1) this.$message(msg)
      this.updateTable()
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
