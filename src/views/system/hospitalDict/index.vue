<template>
  <div class="app-container">
    <el-row :gutter="20">

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

      <el-col :span="8">
        <comp-header context="编辑" />
        <comp-form
          :span="23"
          :ref-obj.sync="formInfo.ref"
          :form-data="formInfo.data"
          :field-list="formInfo.fieldList"
          :rules="formInfo.rules"
          :label-width="formInfo.labelWidth"
          :list-type-info="listTypeInfo"
        >

          <!-- 自定义插槽的使用 -->
          <template v-slot:form-icon>
            <div class="slot-icon">
              <img
                :src="formInfo.data.icon"
                style="height: 30px;"
              >
              <span v-if=" !formInfo.data.icon">暂未设置图标</span>
              <el-button
                type="primary"
                icon="el-icon-picture"
                size="mini"
                @click="handleClick('selectFile')"
              >
                {{ formInfo.data.icon ? '更换图标' : '选择图标' }}
              </el-button>
            </div>
          </template>
        </comp-form>
        <el-button @click="submit">测试连接</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import CompHeader from '@/components/CompHeader'
import CompForm from '@/components/CompForm'
export default {
  components: { CompTable, CompHeader, CompForm },
  data() {
    return {
      // 表单相关
      formInfo: {
        ref: null, // 可以拿到el-form
        data: {
          id: '', // *唯一ID
          name: '', // *标签名称
          icon: '', // 图标
          sort: '2222', // 排序
          wikipedia: '', // 标签百科
          status: 1 // *状态: 0：停用，1：启用(默认为1)',
        },
        fieldList: [
          { label: '数据库类型', value: 'name', type: 'select' },
          { label: '数据源类型', value: 'name', type: 'select' },
          { label: '标签名称', value: 'name', type: 'input', hidden: true },
          { label: '数据源名称', value: 'sort', type: 'input' },
          { label: '服务名', value: 'sort', type: 'input' },
          { label: '登录名', value: 'sort', type: 'input' },
          { label: '密码', value: 'sort', type: 'input' },
          { label: '数据库', value: 'sort', type: 'input' },
          { label: '连接字符串', value: 'sort', type: 'textarea' }
        ],
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        labelWidth: '120px'
      },
      listTypeInfo: {
        tagTypeList: [],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
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

    },
    submit(formName) {
      console.log(this.formInfo.ref, '???<===')
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          alert('submit!')
          console.log(this.formInfo.data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

