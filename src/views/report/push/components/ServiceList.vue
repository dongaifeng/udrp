<template>
  <div>
    <CompHeader context="ESB服务设置">
      <template v-slot:right>
        <el-button type="primary" @click="ServicesModifyProjects">保存设置</el-button>
      </template>
    </CompHeader>
    <CompForm
      :ref-obj.sync="formInfo.ref"
      :form-data="formInfo.data"
      :field-list="formInfo.fieldList"
      :label-width="formInfo.labelWidth"
      :list-type-info="select"
      :rules="formInfo.rules"
      @handleEvent="handleEvent"
    />

    <el-row>
      <CompHeader context="ESB服务设置">
        <template v-slot:right>
          <el-button type="primary" @click="">新建服务</el-button>
        </template>
      </CompHeader>
      <el-col :span="16">
        <!-- 列表 -->
        <comp-table
          :listen-height="false"
          :height="'500px'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="GetServicesList"
          :pager="false"
          :query="filterInfo.query"
          :field-list="tableInfo.fieldList"
          :list-type-info="select"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @selectFile="handleBtnClick"
        >
          <!-- 自定义插槽显示状态 -->

        </comp-table>
      </el-col>

      <el-col :span="8">
        <CompHeader context="编辑" />

        <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="服务编码" prop="ServiceCode">
            <el-input v-model="form.ServiceCode" />
          </el-form-item>

          <el-form-item label="服务名称" prop="ServiceName">
            <el-input v-model="form.ServiceName" />
          </el-form-item>

          <el-form-item label="拼音码" prop="Py">
            <el-input v-model="form.Py" />
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="form.ServiceDesc" type="textarea" rows="10" />
          </el-form-item>

          <el-form-item label="监控路由" prop="MonitorRouteName">
            <el-select v-model="form.MonitorRouteName" placeholder="请选择活动区域">
              <el-option v-for="item in select.EsbServer" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>

          <el-form-item label="启用标志">
            <el-checkbox v-model="form.IsEnabled" label="" name="IsEnabled" :true-label="1" :false-label="0" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="ServicesMAddModels">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompForm from '@/components/CompForm'
import CompHeader from '@/components/CompHeader'
import CompTable from '@/components/CompTable'
import { GetServicesList, ServicesModifyProjects, ServicesMAddModels } from '@/api/report'
export default {
  components: { CompForm, CompHeader, CompTable },
  data() {
    const rules = {
      ServiceCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      ServiceName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      MonitorRouteName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }
    return {
      GetServicesList,
      rules,
      form: {
        IsEnabled: 1
      },
      select: {
        EsbServer: [],
        OutPutNode: [],
        MonitoringRoute: []
      },
      formInfo: {
        ref: null,
        data: {
          EsbServerId: ''
        },
        fieldList: [ // 每一项定义
          { label: 'ESB服务器', value: 'EsbServerId', type: 'select', list: 'EsbServer', event: 'EsbServerChange' },
          { label: '输入通信点', value: 'InCommunicationPointId', type: 'select', list: 'EsbServer' },
          { label: '输出通信点', value: 'OutCommunicationPointId', type: 'select', list: 'EsbServer' },
          { label: 'web服务地址', value: 'ReadWay', type: 'input' }
        ],
        rules: {
          EsbServerId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          InCommunicationPointId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          OutCommunicationPointId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
        }
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '服务编号', value: 'ServiceName' },
          { label: '服务名称', value: 'ServiceDesc' },
          { label: '服务描述', value: 'MonitorRouteId' },
          { label: '拼音码', value: 'Py' },
          { label: '监控路由', value: 'ProjectId' },
          { label: '启用标志', value: 'IsEnabled', type: 'state', list: [{ 0: '启用' }, { 1: '禁用' }] }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'selectFile', show: true }
          ]
        }

      },
      // 过滤相关配置
      filterInfo: {
        query: {
          ProjectId: '1',
          page: 1,
          rows: 100
        }
      }
    }
  },
  computed: {
    ProjectId() {
      return this.$store.getters.ProjectId
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.select.EsbServer = await this.$store.dispatch('select/GetEsbServer')
    },

    ServicesModifyProjects(formName) {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          ServicesModifyProjects({ ...this.formInfo.data, ProjectId: this.ProjectId }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },
    ServicesMAddModels() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          ServicesMAddModels({ ...this.form, ProjectId: this.ProjectId }).then(res => {
            this.$store.dispatch('report/SetServiceId', res)
            this.$message('保存成功')
          })
        }
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },

    handleBtnClick(data) {
      console.log('data', data)
    },
    handleEvent(event, data) {
      // this[event](data)
      switch (event) {
        case 'list':
          console.log(data)
      }
    },
    async EsbServerChange(EsbServerId) {
      this.select.OutPutNode = await this.$store.dispatch('select/GetOutPutNode', { EsbServerId })
      this.select.MonitoringRoute = await this.$store.dispatch('select/GetMonitoringRoute', { EsbServerId })
    },
    handleClick(a) {
      console.log(a)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
