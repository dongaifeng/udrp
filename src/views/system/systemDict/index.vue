<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <comp-header context="系统字典类别列表" />
        <comp-table
          :listen-height="false"
          :height="'calc(100vh - 180px)'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="systemDictGetLIst"
          :pager="false"
          :query="filterInfo.query"
          :field-list="tableInfo.fieldList"
          :handle="tableInfo.handle"
          highlight-current-row
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @el-current-change="handleCurrentChange"
        />
      </el-col>

      <el-col :span="16">
        <comp-header context="系统字典成员列表">
          <template v-slot:right>
            <el-button type="primary" :disabled="addBtnAbled" @click="editTableRow()">新增</el-button>
          </template>
        </comp-header>
        <!-- 表格 -->
        <comp-table
          :listen-height="false"
          :height="'calc(100vh - 180px)'"
          :refresh="tableInfo2.refresh"
          :init-curpage="tableInfo2.initCurpage"
          :data.sync="tableInfo2.data"
          :check-box="false"
          :tab-index="true"
          :api="systemDictGetMemberList"
          :pager="false"
          :query="filterInfo.query"
          :field-list="tableInfo2.fieldList"
          :handle="tableInfo2.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 自定义插槽显示状态 -->
        </comp-table>
      </el-col>
    </el-row>

    <!-- 新建 -->
    <el-dialog
      v-if="addModelVisible"
      title="编辑推送项目"
      :visible.sync="addModelVisible"
      custom-class="no-padding"
      width="30%"
    >
      <comp-form
        :span="22"
        :ref-obj.sync="formInfo.ref"
        :form-data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
      >
        <!-- 自定义插槽的使用 -->
        <template v-slot:form-IsEnabled>
          <el-checkbox v-model="formInfo.data.IsEnabled" :true-label="1" :false-label="0" />
        </template>
      </comp-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addModelVisible = false">取 消</el-button>
        <el-button type="primary" @click="modelSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { systemDictGetLIst, systemDictGetMemberList, systemDictRemoveModels, systemDictModifyModels, systemDictAddModels } from '@/api/system'
export default {
  data() {
    return {
      systemDictGetLIst,
      systemDictGetMemberList,
      addModelVisible: false,
      addBtnAbled: true,
      state: '',

      // 表单相关
      formInfo: {
        ref: null, // 可以拿到el-form
        data: {},
        fieldList: [
          { label: '编码', value: 'ClassCode', type: 'input', required: true, disabled: true },
          { label: '名称', value: 'ClassName', type: 'input', required: true },
          { label: '显示顺序', value: 'Sort', type: 'input', required: true },
          { label: '启用标志', value: 'IsEnabled', type: 'slot' }
        ],
        rules: {}
      },

      // 表格1
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '编码', value: 'DictCode' },
          { label: '名称', value: 'DictName' }
        ]
      },

      // 表格2
      tableInfo2: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '编码', value: 'ClassCode' },
          { label: '名称', value: 'ClassName' },
          { label: '显示顺序', value: 'Sort' },
          {
            label: '状态',
            value: 'IsEnabled',
            type: 'state',
            list: { 0: '启用', 1: '禁用' }
          }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            {
              label: '编辑',
              type: 'primary',
              icon: 'el-icon-ship',
              event: 'editTableRow',
              show: true
            },
            {
              label: '删除',
              event: 'deleteTableRow',
              show: true
            }
          ]
        }
      },

      // 过滤相关配置
      filterInfo: {
        query: {
          DictCode: ''
        }
      }
    }
  },
  mounted() {
    this.updateTable(1)
  },
  methods: {
    updateTable(ref) {
      switch (ref) {
        case 1:
          this.tableInfo.refresh = Math.random()
          break
        case 2:
          this.tableInfo2.refresh = Math.random()
          break
      }
    },

    handleCurrentChange(row) {
      this.filterInfo.query = row
      this.updateTable(2)
      this.addBtnAbled = false
    },
    editTableRow(data) {
      if (data) {
        this.state = 'modify'
        this.formInfo.fieldList[0].disabled = true
      } else {
        this.state = 'add'
        this.formInfo.fieldList[0].disabled = false
      }

      this.formInfo.data = { ...data, ...this.filterInfo.query }
      this.addModelVisible = true
    },
    modelSubmit() {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          const data = { ...this.formInfo.data }
          const api = this.state === 'add' ? systemDictAddModels : systemDictModifyModels
          api(data).then(res => {
            this.$message('保存成功')
            this.addModelVisible = false
            this.updateTable(2)
          })
        }
      })
    },

    async deleteTableRow(data) {
      const DictCode = this.filterInfo.query.DictCode
      const ClassCode = data.ClassCode
      const res = await systemDictRemoveModels({ ClassCode, DictCode })
      const msg = data.DeleteFlag ? '恢复成功' : '删除成功'
      if (res === 1) this.$message(msg)
      this.updateTable(2)
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

