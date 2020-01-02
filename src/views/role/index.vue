<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="系统">
            <el-select v-model="form.region" placeholder="please select your zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色名称">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色描述">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="form.region" placeholder="please select your zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onCancel">添加</el-button>
            <el-button @click="onCancel">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <!-- 表格 -->
    <comp-table
      :listen-height="false"
      :height="'60vh'"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :table-data.sync="tableInfo.data"
      :check-box="true"
      :tab-index="true"
      :api="handleEvent"
      :pager="true"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
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
  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import { getInfo } from '@/api/user'
export default {
  components: { CompTable },
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
        desc: getInfo
      },
      listTypeInfo: {
        treeList: []
      },
      // 表格相关
      tableInfo: {
        refresh: 23,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [{ age: '222', name: 'skfhgd' }, { age: '222', name: 'skfhgd' }, { age: '222', name: 'skfhgd' }],
        fieldList: [
          { label: '姓名', value: 'name' },
          { label: '下拉框', value: 'myslot', type: 'slot' },
          { label: '年龄', value: 'age' }

        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-ship', event: 'selectFile', show: true },
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'selectFile', show: false },
            { label: '修改', type: 'info', icon: 'el-icon-ship', event: 'selectFile', show: true }
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

