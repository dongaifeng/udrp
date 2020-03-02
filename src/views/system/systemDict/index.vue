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
          :list-type-info="listTypeInfo"
          :handle="tableInfo.handle"
          highlight-current-row
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @selectFile="handleBtnClick"
          @el-current-change="handleCurrentChange"
        />
      </el-col>

      <el-col :span="16">
        <comp-header context="系统字典成员列表" />
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
          :list-type-info="listTypeInfo"
          :handle="tableInfo2.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @selectFile="handleBtnClick"
        >
          <!-- 自定义插槽显示状态 -->
        </comp-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { systemDictGetLIst, systemDictGetMemberList } from '@/api/system'
import CompTable from '@/components/CompTable'
import CompHeader from '@/components/CompHeader'
export default {
  components: { CompTable, CompHeader },
  data() {
    return {
      systemDictGetLIst,
      systemDictGetMemberList,

      listTypeInfo: {
        treeList: []
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
            list: [{ 0: '启用' }, { 1: '禁用' }]
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
              event: 'selectFile',
              show: true
            },
            {
              label: '删除',
              type: 'primary',
              icon: 'el-icon-ship',
              event: 'selectFile',
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
      this.filterInfo.query.DictCode = row.DictCode
      this.updateTable(2)
    },

    handleBtnClick(data) {
      console.log('data', data)
    },
    handleEvent(event, data) {
      switch (event) {
        case 'list':
          console.log(data)
      }
    },
    handleClick(a) {
      console.log(a)
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

