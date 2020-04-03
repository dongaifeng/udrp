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
          <el-button type="primary" @click="clearForm">新建服务</el-button>
        </template>
      </CompHeader>
      <el-col :span="16">
        <!-- 列表 -->
        <comp-table
          :listen-height="false"
          :height="'calc(100vh - 580px)'"
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
          @el-row-dblclick="rowDblClick"
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
            <el-input v-model="form.ServiceDesc" type="textarea" rows="6" />
          </el-form-item>

          <el-form-item label="监控路由" prop="MonitorRouteId">
            <el-select v-model="form.MonitorRouteId" clearable placeholder="请选择">
              <el-option v-for="item in select.MonitoringRoute" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
            </el-select>
          </el-form-item>

          <el-form-item label="启用标志">
            <el-checkbox v-model="form.IsEnabled" label="" name="IsEnabled" :true-label="1" :false-label="0" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="ServicesAddModels">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import base from '@/mixin/base'
import { getDictName } from '@/utils'
import { ServicesAddModels, GetServicesGetProjects, GetServicesList, ServicesModifyProjects, ServicesRemoveModels, ServicesModifyModels } from '@/api/report'
export default {
  mixins: [base],
  data() {
    const rules = {
      ServiceCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      ServiceName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      Py: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      MonitorRouteId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    }

    const list = this.$store.state.select.EnabledState

    return {
      GetServicesList,
      rules,
      form: {
        IsEnabled: 1,
        MonitorRouteName: ''
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
          { label: '输入通信点', value: 'InCommunicationPointId', type: 'select', list: 'OutPutNode' },
          { label: 'web服务地址', value: 'WebService', type: 'input' }
        ],
        rules: {
          EsbServerId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          InCommunicationPointId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
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
          { label: '服务编号', value: 'ServiceCode' },
          { label: '服务名称', value: 'ServiceName' },
          { label: '服务描述', value: 'ServiceDesc' },
          { label: '拼音码', value: 'Py' },
          { label: '监控路由', value: 'MonitorRouteName' },
          { label: '启用标志', value: 'IsEnabled', type: 'state', list: this.$store.state.select.EnabledState }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '删除', event: 'deleteTableRow', show: true }
          ]
        }

      },
      // 过滤相关配置
      filterInfo: {
        query: {
          ProjectId: this.$store.getters.ProjectId
        }
      }
    }
  },
  computed: {
    ProjectId() {
      return this.$store.getters.ProjectId
    },
    toPy() {
      return this.form.ServiceName
    }
  },
  watch: {
    toPy: function(newVal) {
      if (newVal) this.form.Py = this.$py.getCamelChars(newVal)
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
    if (this.ProjectId) this.GetServicesGetProjects()
  },
  methods: {
    async initSelect() {
      this.select.EsbServer = await this.$store.dispatch('select/GetEsbServer')
    },

    GetServicesGetProjects() {
      GetServicesGetProjects({ ProjectId: this.ProjectId }).then(res => {
        this.EsbServerChange(res.EsbServerId)
        this.formInfo.data = res
      })
    },

    ServicesModifyProjects(formName) {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          const InCommunicationPointName = getDictName(this.select.OutPutNode, this.formInfo.data.InCommunicationPointId)

          ServicesModifyProjects({
            ...this.formInfo.data,
            ProjectId: this.ProjectId,
            InCommunicationPointName

          }).then(res => {
            this.$message('保存成功')
          })
        }
      })
    },
    ServicesAddModels() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const MonitorRouteName = getDictName(this.select.MonitoringRoute, this.form.MonitorRouteId)
          const api = this.form.ServiceId ? ServicesModifyModels : ServicesAddModels
          console.log(api, this.form.ServiceId)
          api({ ...this.form, ProjectId: this.ProjectId, MonitorRouteName }).then(res => {
            this.$store.dispatch('report/SetServiceId', res)
            this.$message('保存成功')
            this.updateTable()
            this.clearForm()
          })
        }
      })
    },

    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    rowDblClick(rows) {
      this.form = rows
    },
    clearForm() {
      this.form = {
        IsEnabled: 1
      }
    },
    async deleteTableRow(data) {
      const res = await ServicesRemoveModels({ ServiceId: data.ServiceId })
      const msg = data.DeleteFlag ? '恢复成功' : '删除成功'
      if (res === 1) this.$message(msg)
      this.updateTable()
    },

    async EsbServerChange(EsbServerId) {
      if (!EsbServerId) return false
      this.formInfo.data.InCommunicationPointId = ''
      this.select.OutPutNode = await this.$store.dispatch('select/GetOutPutNode', { EsbServerId })
      this.select.MonitoringRoute = await this.$store.dispatch('select/GetMonitoringRoute', { EsbServerId })
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
