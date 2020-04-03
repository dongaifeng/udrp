<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col style="margin-bottom: 10px;">
        <el-button type="primary">新建</el-button>
        <el-checkbox v-model="tableInfo.query.ShowDelete" @change="updateTable">显示删除</el-checkbox>
      </el-col>
      <el-col :span="16">
        <!-- 表格 -->
        <comp-table
          :listen-height="false"
          :height="'calc(100vh - 180px)'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          tab-index
          :api="DataSourcesGetList"
          :pager="false"
          :query="tableInfo.query"
          :field-list="tableInfo.fieldList"
          :list-type-info="selects"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @el-row-dblclick="rowDblClick"
        />
      </el-col>

      <el-col :span="8">
        <comp-header context="编辑" />
        <comp-form
          :span="23"
          :ref-obj.sync="formInfo.ref"
          :form-data="formInfo.data"
          :field-list="formInfo.fieldList"
          :rules="formInfo.rules"
          :label-width="formInfo.labelWidth"
          :list-type-info="selects"
        >
          <!-- 自定义插槽的使用 -->
        </comp-form>
        <el-button @click="TestDataSources">测试连接</el-button>
        <el-button type="primary" @click="DataSourcesAddModels">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import base from '@/mixin/base'
import { getDictName } from '@/utils'
import { DataSourcesGetList, DataSourcesAddModels, DataSourcesModifyModels, DataSourcesRemoveModels, TestDataSources } from '@/api/system'
export default {
  mixins: [base],
  data() {
    return {
      DataSourcesGetList,
      DataSourceId: '',
      selects: {
        DataBaseType: [],
        DataSourcesType: []
      },
      // 表单相关
      formInfo: {
        ref: null, // 可以拿到el-form
        data: {
          StrConnection: this.StrConnection,
          IsEnabled: '1'
        },
        fieldList: [
          {
            label: '数据库类型',
            value: 'DbTypeCode',
            type: 'select',
            list: 'DataBaseType'
          },
          {
            label: '数据源类型',
            value: 'DataSourceType',
            type: 'select',
            list: 'DataSourcesType'
          },
          { label: '数据源名称', value: 'DataSourceName', type: 'input' },
          { label: '服务名', value: 'ServerName', type: 'input' },
          { label: '登录名', value: 'Login', type: 'input' },
          { label: '密码', value: 'Password', type: 'input' },
          { label: '数据库', value: 'Database', type: 'input' },
          { label: '连接字符串', value: 'StrConnection', type: 'textarea', disabled: true, autosize: { minRows: 5, maxRows: 10 }}
        ],
        rules: {
          DbTypeCode: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          DataSourceType: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          DataSourceName: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          ServerName: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          Login: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          Password: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          Database: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          StrConnection: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ]
        }
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        query: { ShowDelete: true },
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: 'ID', value: 'DataSourceId' },
          { label: '数据源名称', value: 'DataSourceName' },
          { label: '数据源类型', value: 'DbTypeName' },
          { label: '连接字符串', value: 'StrConnection' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
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
    StrConnection() {
      const { ServerName, Login, Password, Database } = this.formInfo.data
      return `Data Source=${ServerName};database=${Database};USER ID=${Login};PASSWORD=${Password};`
    }
  },
  watch: {
    StrConnection: function(newVal) {
      this.formInfo.data.StrConnection = newVal
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.selects.DataBaseType = await this.$store.dispatch(
        'select/GetSelect',
        'DataBaseType'
      )
      this.selects.DataSourcesType = await this.$store.dispatch(
        'select/GetSelect',
        'DataSourcesType'
      )
    },

    clearForm() {
      this.formInfo.data = { StrConnection: this.StrConnection, IsEnabled: '0' }
    },

    DataSourcesAddModels(formName) {
      const DbTypeName = getDictName(this.selects.DataBaseType, this.formInfo.data.DbTypeCode)
      const api = this.formInfo.data.DataSourceId ? DataSourcesModifyModels : DataSourcesAddModels
      this.submit({
        api: api,
        data: { ...this.formInfo.data, DbTypeName }
      })
      // this.formInfo.ref.validate(valid => {
      //   if (valid) {
      //     const DbTypeName = getDictName(this.selects.DataBaseType, this.formInfo.data.DbTypeCode)

      //     DataSourcesAddModels({ ...this.formInfo.data, DbTypeName }).then(res => {
      //       this.$message({
      //         message: '保存成功!',
      //         type: 'success'
      //       })
      //       this.updateTable()
      //       this.DataSourceId = res
      //       this.formInfo.data = { StrConnection: this.StrConnection, IsEnabled: '0' }
      //     })
      //   }
      // })
    },

    updateTable() {
      this.tableInfo.refresh = Math.random()
    },
    rowDblClick(rows) {
      this.formInfo.data = {
        StrConnection: this.StrConnection,
        IsEnabled: '1',
        ...rows
      }
    },
    async deleteTableRow(data) {
      const res = await DataSourcesRemoveModels({ DataSourceId: data.DataSourceId })
      const msg = data.DeleteFlag ? '恢复成功' : '删除成功'
      if (res === 1) this.$message(msg)
      this.updateTable()
    },
    TestDataSources() {
      const { ServerName, Login, Password, Database } = this.formInfo.data
      if (ServerName && Login && Password && Database) {
        TestDataSources({ StrConnection: this.formInfo.data.StrConnection }).then(res => {
          this.$message(res)
        })
        return false
      }
      this.$message('请先保存服务器')
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

<style scoped>
.line {
  text-align: center;
}
</style>
