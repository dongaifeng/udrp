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
          :api="ESBServersGetList"
          :pager="false"
          :query="tableInfo.query"
          :field-list="tableInfo.fieldList"

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
        >
          <!-- 自定义插槽的使用 -->
        </comp-form>
        <el-button @click="TestESBServers">测试连接</el-button>
        <el-button type="primary" @click="ESBServersAddModels">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ESBServersGetList, ESBServersAddModels, ESBServersModifyModels, ESBServersRemoveModels, TestESBServers } from '@/api/system'
import base from '@/mixin/base'
export default {
  mixins: [base],
  data() {
    return {
      ESBServersGetList,
      EsbServerId: '',
      // 表单相关
      formInfo: {
        ref: null, // 可以拿到el-form
        data: { IsEnabled: '1' },
        fieldList: [
          { label: 'ESB服务名称', value: 'EsbServerName', type: 'input' },
          { label: 'IP地址', value: 'Ip', type: 'input' },
          { label: '端口号', value: 'Port', type: 'input' },
          { label: '用户名', value: 'Account', type: 'input' },
          { label: '密码', value: 'Password', type: 'input' }
        ],
        rules: {
          EsbServerName: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          Ip: [{ required: true, message: '请输入 ', trigger: 'blur' }],
          Port: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          Account: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ],
          Password: [
            { required: true, message: '请输入 ', trigger: 'blur' }
          ]
        }
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        query: {
          ShowDelete: true
        },
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: 'ID', value: 'EsbServerId' },
          { label: 'ESB服务名称', value: 'EsbServerName' },
          { label: 'IP', value: 'Ip' },
          { label: '端口', value: 'Port' },
          { label: '用户名', value: 'Account' },
          { label: '密码', value: 'Password' }
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
  mounted() {
    this.updateTable()
  },
  methods: {
    ESBServersAddModels(formName) {
      const api = this.formInfo.data.EsbServerId ? ESBServersModifyModels : ESBServersAddModels
      this.submit({
        api: api,
        data: { ...this.formInfo.data },
        fn: (res) => { this.EsbServerId = res }
      })

      // this.formInfo.ref.validate(valid => {
      //   if (valid) {
      //     ESBServersAddModels(this.formInfo.data).then(res => {
      //       this.$message({
      //         message: '保存成功!',
      //         type: 'success'
      //       })
      //       this.EsbServerId = res
      //     })
      //   }
      // })
    },

    clearForm() {
      this.formInfo.data = { IsEnabled: '1' }
    },

    updateTable() {
      this.tableInfo.refresh = Math.random()
    },
    rowDblClick(rows) {
      this.formInfo.data = { ...rows }
    },
    async deleteTableRow(data) {
      const res = await ESBServersRemoveModels({ EsbServerId: data.EsbServerId })
      const msg = data.DeleteFlag ? '恢复成功' : '删除成功'
      if (res === 1) this.$message(msg)
      this.updateTable()
    },
    TestESBServers() {
      const { Account, Password, Port, Ip } = this.formInfo.data

      if (!Port || !Account || !Password || !Ip) {
        this.$message('请先保存服务器')
        return false
      }
      TestESBServers({ ...this.formInfo.data }).then(res => {
        this.$message(res)
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

<style scoped>
.line {
  text-align: center;
}
</style>
