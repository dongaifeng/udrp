<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col style="margin-bottom: 10px;">
        <el-button type="primary">新建</el-button>
        <el-checkbox v-model="tableInfo.query.ShowEnabled">显示禁用</el-checkbox>
      </el-col>
      <el-col :span="16">
        <!-- 表格 -->
        <comp-table
          :listen-height="false"
          :height="'calc(100vh - 180px)'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :api="ESBServersGetList"
          :pager="false"
          :query="form"
          :field-list="tableInfo.fieldList"
          :list-type-info="selects"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 自定义插槽显示状态 -->
          <template v-slot:col-myslot="scope">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </template>
        </comp-table>
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
        <el-button>测试连接</el-button>
        <el-button type="primary" @click="ESBServersAddModels">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import CompHeader from '@/components/CompHeader'
import CompForm from '@/components/CompForm'
import { ESBServersGetList, ESBServersAddModels } from '@/api/system'
export default {
  components: { CompTable, CompHeader, CompForm },
  data() {
    return {
      ESBServersGetList,
      selects: {
        DataBaseType: [],
        DataSourcesType: []
      },
      // 表单相关
      formInfo: {
        ref: null, // 可以拿到el-form
        data: {},
        fieldList: [
          { label: 'ESB服务名称', value: 'EsbServerName', type: 'input' },
          { label: 'IP地址', value: 'Ip', type: 'input' },
          { label: '端口号', value: 'Port', type: 'input' },
          { label: '用户名', value: 'Account', type: 'input' },
          { label: '密码', value: 'Password', type: 'input' }
        ],
        rules: {
          EsbServerName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          Ip: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          Port: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          Account: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          Password: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ]
        }
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        query: {
          ShowEnabled: true
        },
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: 'ID', value: 'EsbServerId' },
          { label: 'ESB服务名称', value: 'EsbServerName' },
          { label: 'IP', value: 'IP' },
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
              type: 'primary',
              icon: 'el-icon-ship',
              event: 'selectFile',
              show: true
            }
          ]
        }
      }
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
    ESBServersAddModels(formName) {
      this.formInfo.ref.validate(valid => {
        if (valid) {
          ESBServersAddModels(this.formInfo.data).then(res => {
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
          })
        }
      })
    },

    updateTable() {
      this.tableInfo.refresh = Math.random()
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleBtnClick(data) {
      console.log('data', data)
    },
    handleEvent() {},
    handleClick() {}
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
