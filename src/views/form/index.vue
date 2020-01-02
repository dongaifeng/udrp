<template>
  <div class="app-container">

    <comp-form
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
    <el-button @click="submit">提交</el-button>
  </div>
</template>

<script>
import CompForm from '@/components/CompForm'
export default {
  components: { CompForm },
  data() {
    return {
      listTypeInfo: {
        tagTypeList: [],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
        ]
      },
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
          { label: '标签名称', value: 'name', type: 'input' },
          { label: '标签名称', value: 'name', type: 'input', hidden: true },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '状态', value: 'status', type: 'select', list: 'statusList' }
        ],
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        labelWidth: '120px'
      }
    }
  },
  methods: {
    handleClick() {},
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

<style lang="scss" scoped>

</style>
