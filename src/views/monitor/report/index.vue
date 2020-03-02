<template>
  <div class="app-container">

    <el-row>
      <!-- tree 菜单 -->
      <el-col :span="4">
        <el-tree
          :data="selects.projects"
          :props="treeProps"
          accordion
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-col>

      <!-- 右侧 表格 -->
      <el-col :span="20">
        <!-- 上 -->
        <el-row>
          <CompForm
            :ref-obj.sync="formInfo.ref"
            :form-data="formInfo.data"
            :field-list="formInfo.fieldList"
            :label-width="formInfo.labelWidth"
          />

          <div class="sbcp">
            <el-row class="hang">
              <el-col :span="2" class="lie">通信点-入</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication }}</el-col>
              <el-col :span="2" class="lie">消息总量</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication }}</el-col>
              <el-col :span="2" class="lie">状态</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication }}</el-col>
              <el-col :span="6" class="lie">
                <el-button>stop</el-button>
              </el-col>
            </el-row>

            <el-row class="hang">
              <el-col :span="2" class="lie">通信点-出</el-col><el-col :span="4" class="lie">{{ formInfo.data.OutCommunication }}</el-col>
              <el-col :span="2" class="lie">消息总量</el-col><el-col :span="4" class="lie">{{ formInfo.data.OutCommunication }}</el-col>
              <el-col :span="2" class="lie">状态</el-col><el-col :span="4" class="lie">{{ formInfo.data.OutCommunication }}</el-col>
              <el-col :span="6" class="lie">
                <el-button>stop</el-button>
              </el-col>
            </el-row>

          </div>

          <!-- 表格 -->
          <comp-table
            :listen-height="false"
            :height="200"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurpage"
            :data.sync="tableInfo.data"
            :check-box="false"
            :tab-index="true"
            :api="UploadGetTables"
            :pager="false"
            :query="formInfo.data"
            :field-list="tableInfo.fieldList"
            :list-type-info="selects"
            :handle="tableInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
            @el-row-dblclick="tableEdit"
          />
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import CompForm from '@/components/CompForm'
import { UploadGetTables, GetReported } from '@/api/monitor'
export default {
  components: { CompTable, CompForm },
  data() {
    return {
      UploadGetTables,
      treeProps: {
        label: 'ClassName',
        isLeaf: 'leaf'
      },

      selects: {
        projects: []
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],

        fieldList: [
          { label: '批次号', value: 'BATCH_NO' },
          { label: '状态', value: 'AUDIT_STATUS' },
          { label: '填报次数', value: 'FILL_IN_TIMES' },
          { label: '提交时间', value: 'COMMITED_DATE_TIME' },
          { label: '提交人', value: 'COMMITED_USER_NAME' },
          { label: '审核次数', value: 'ReadWay' },
          { label: '审核时间', value: 'ProjectLeader' },
          { label: '审核人', value: 'AUDITED_USER_NAME' },
          { label: '上传次数', value: 'UPLOAD_TIMES' },
          { label: '上传时间', value: 'UPLOADED_DATE_TIME' },
          { label: '上传人', value: 'UPLOADED_USER_NAME' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '编辑', type: 'primary', icon: 'el-icon-ship', event: 'tableEdit', show: true },
            { label: '删除', type: 'primary', icon: 'el-icon-ship', event: 'tableDelete', show: true }
          ]
        }

      },

      // 表单配置表
      formInfo: {
        ref: null,
        data: {},
        fieldList: [
          { label: '上报机构', value: 'ReportOrganCode', type: 'input', disabled: true },
          { label: '上报项目', value: 'ProjectShortName ', type: 'input', disabled: true },
          { label: '上报周期', value: 'ReportCycle', type: 'input', disabled: true },
          { label: '输出类型', value: 'TaskOutType', type: 'input', disabled: true },
          { label: '日志保存天数', value: 'SaveLogDays', type: 'input', disabled: true },
          { label: 'ESB服务器', value: 'EsbServer', type: 'input', disabled: true },
          { label: 'Web服地址', value: 'WebServer', type: 'input', disabled: true }
        ]
      }
    }
  },
  mounted() {
    // this.updateTable()
    this.initSelect()
  },
  methods: {
    // api调用
    async initSelect() {
      this.selects.projects = await this.$store.dispatch('select/GetProjects', { Type: '5' })
    },

    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },

    // tree方法
    handleNodeClick(data, node, that) {
      GetReported({ ProjectId: data.ClassCode }).then(res => {
        const { dataList, ...formData } = res
        this.formInfo.data = formData
        this.tableInfo.data = dataList
      })
    },

    loadNode(node, resolve) {
      const { data, level } = node
      if (level === 0) return resolve([{ name: 'region' }])
      if (level > 1) return resolve([])
      this.$store.dispatch('select/GetDataTables', { ProjectId: data.ClassCode }).then(res => {
        resolve(res)
      })
    },

    handleEvent(event, data) {
      switch (event) {
        case 'list':
          console.log(data)
      }
    },
    handleClick(event, data) {
      console.log(event, data)
      if (typeof this[event] === 'function') this[event](data)
    },
    tableEdit(rows) {
      this.state = 'modify'
      this.editData = rows
      this.createProjectVisible = true
    },
    addProject() {
      this.state = 'add'
      this.editData = null
      this.createProjectVisible = true
    },
    tableDelete(rows) {
      const { ProjectId, DeleteFlag } = rows
    }
  }
}
</script>

<style lang="scss" scoped>
  .sbcp{
    font-size: 14px;
    margin: 0px 0px 20px 0px;
    .hang{
      border: 1px solid #ccc;

      .lie{
        border-right: 1px solid #ccc;
        padding: 3px 5px;
        height: 35px;
        line-height: 30px;
      }
    }
  }
</style>
