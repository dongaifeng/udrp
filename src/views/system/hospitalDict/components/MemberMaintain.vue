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
          <template v-slot:form-DeleteFlag>
            <el-checkbox v-model="formInfo.data.ShowDelete" />
          </template>

          <template v-slot:form-button>
            <el-button type="text" @click="DownloadTemplate">下载模板</el-button>
            <el-button type="primary" @click="updateTable">查询</el-button>

            <comp-upload
              action="/System/HospitalDictMembers/Import"
              :data="formInfo.data"
              :on-success="updateTable"
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
          :api="HospitalDictsMembersGetList"
          :pager="false"
          :query="{Py: formInfo.data.Py, ShowDelete: formInfo.data.ShowDelete, DefinitionCode: formInfo.data.DefinitionCode}"
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

      <el-col :span="6">
        <CompHeader context="编辑" />

        <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="院内字典" prop="ProjectId">
            <el-input v-model="form.DefinitionName" disabled />
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
            <el-button type="primary" @click="HospitalDictsMembersAddModels">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {
  HospitalDictsMembersGetList,
  HospitalDictsMembersModifyModels,
  HospitalDictsMembersAddModels,
  HospitalDictsMembersRemoveModels,
  DownloadTemplate
} from '@/api/system'
// import { DownloadTemplate } from '@/api/select'
import base from '@/mixin/base'
export default {
  mixins: [base],
  props: {
    rows: [Object]
  },
  data() {
    const rules = {
      MemberCode: [{ required: true, message: '请输入  ', trigger: 'blur' }],
      MemberName: [{ required: true, message: '请输入  ', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入  ', trigger: 'blur' }],
      Sort: [{ required: true, message: '请输入  ', trigger: 'blur' }]
    }
    return {
      HospitalDictsMembersGetList,
      DownloadTemplate,
      rules,
      loading: false,
      form: {
        IsEnabled: 1,
        Sort: 0,
        DefinitionName: this.rows.DefinitionName
      },
      select: {
        Projects: []
      },
      formInfo: {
        ref: null,
        data: {
          ShowDelete: false,
          DefinitionId: '',
          DefinitionName: ''

        },
        fieldList: [
          // 每一项定义
          { label: '院内系统', value: 'SystemName', type: 'input', span: 5, disabled: true },
          { label: '院内字典', value: 'DefinitionName', type: 'input', span: 5, disabled: true },
          { label: '拼音码', value: 'Py', type: 'input', span: 5 },
          { label: '显示删除', value: 'DeleteFlag', type: 'slot', span: 2, disabled: true },
          { label: '', value: 'button', type: 'slot', span: 7 }
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
          { label: '院内字典', value: 'DefinitionCode' },
          { label: '成员编码', value: 'MemberCode' },
          { label: '成员名称', value: 'MemberName' },
          { label: '拼音码', value: 'Py' },
          { label: '描述', value: 'MemberDesc' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [{ label: '删除', event: 'deleteTableRow', show: true }]
        }
      }

    }
  },
  computed: {
    ProjectId() {
      return this.$store.getters.ProjectId
    },
    toPy2() {
      return this.form.MemberName
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
    const { Py, ShowDelete, ...another } = this.rows
    this.formInfo.data = another
  },
  methods: {
    async initSelect() {
      this.select.Projects = await this.$store.dispatch('select/GetProjects')
    },

    HospitalDictsMembersAddModels() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { SystemCode, DefinitionCode } = this.rows
          const api = this.form.MemberId ? HospitalDictsMembersModifyModels : HospitalDictsMembersAddModels
          api({ ...this.form, SystemCode, DefinitionCode }).then(res => {
            this.$message('保存成功')
            this.updateTable()
            this.form = {
              IsEnabled: 1,
              Sort: 0,
              DefinitionName: this.rows.DefinitionName
            }
          }
          )
        }
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    rowDblClick(rows) {
      this.form = { ...rows }
    },

    async deleteTableRow(data) {
      console.log(data)
      const res = await HospitalDictsMembersRemoveModels({ MemberId: data.MemberId })
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
.container {
  padding: 0 20px;
}
.upload-btn{
  display: inline-block;
}
</style>
