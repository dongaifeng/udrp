<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <comp-header context="系统字典类别列表" />
        <comp-table
          :listen-height="false"
          :height="'60vh'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :table-data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="systemDictGetLIst"
          :pager="true"
          :query="filterInfo.query"
          :field-list="tableInfo.fieldList"
          :list-type-info="listTypeInfo"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @selectFile="handleBtnClick"
        />
      </el-col>

      <el-col :span="16">
        <comp-header context="头部信息" />
        <!-- 表格 -->
        <comp-table
          :listen-height="false"
          :height="'60vh'"
          :refresh="tableInfo2.refresh"
          :init-curpage="tableInfo2.initCurpage"
          :table-data.sync="tableInfo2.data"
          :check-box="true"
          :tab-index="true"
          :api="handleEvent"
          :pager="true"
          :query="filterInfo.query"
          :field-list="tableInfo2.fieldList"
          :list-type-info="listTypeInfo"
          :handle="tableInfo2.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @selectFile="handleBtnClick"
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
    </el-row>

  </div>
</template>

<script>
import { systemDictGetLIst } from '@/api/system'
import CompTable from '@/components/CompTable'
import CompHeader from '@/components/CompHeader'
export default {
  components: { CompTable, CompHeader },
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
       
      },
      listTypeInfo: {
        treeList: []
      },
      // 表格相关
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

      // 表格相关
      tableInfo2: {
        refresh: 23,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [{ age: '222', name: 'skfhgd' }, { age: '222', name: 'skfhgd' }, { age: '222', name: 'skfhgd' }],
        fieldList: [
          { label: '编码', value: 'name' },
          { label: '名称', value: 'myslot' },
          { label: '显示顺序', value: 'myslot' },
          { label: '状态', value: 'myslot' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '编辑', type: 'primary', icon: 'el-icon-ship', event: 'selectFile', show: true },
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'selectFile', show: true }
          ]
        }

      },

      // 过滤相关配置
      filterInfo: {
        query: {
          name: '',
          suffix: '',
          f_id: '',
          type: this.type
        },
        list: [
          { type: 'input', label: '名称', value: 'name' },
          // {type: 'input', label: initType(this.type) + '类型', value: 'suffix'},
          { type: 'select', label: '所在目录', value: 'f_id', list: 'treeList' },
          // {type: 'date', label: '创建时间', value: 'create_time'},
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
        ]
      }
    }
  },
  mounted() {
    this.systemDictGetLIst = systemDictGetLIst
    this.tableInfo.refresh++
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
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
    handleEvent() {

    },
    handleClick() {

    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

