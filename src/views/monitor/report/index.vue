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
            <el-row v-if="state === 'read'" class="hang">
              <el-col :span="2" class="lie">通信点</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication && formInfo.data.InCommunication.InCommunicationPointName }}</el-col>
              <el-col :span="2" class="lie">消息总量</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication && formInfo.data.InCommunication.MessageCount }}</el-col>
              <el-col :span="2" class="lie">状态</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication && formInfo.data.InCommunication.State }}</el-col>
              <el-col :span="6" class="lie">
                <el-button
                  v-if="toState(formInfo.data.InCommunication)"
                  type="primary"
                  @click="CommunicationService(formInfo.data.InCommunication.InCommunicationPointId, formInfo.data.InCommunication.State)"
                >{{ toState(formInfo.data.InCommunication) }}</el-button>
              </el-col>
            </el-row>

            <el-row v-if="state === 'push'" class="hang">
              <el-col :span="2" class="lie">通信点-入</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication && formInfo.data.InCommunication.InCommunicationPointName }}</el-col>
              <el-col :span="2" class="lie">消息总量</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication && formInfo.data.InCommunication.MessageCount }}</el-col>
              <el-col :span="2" class="lie">状态</el-col><el-col :span="4" class="lie">{{ formInfo.data.InCommunication && formInfo.data.InCommunication.State }}</el-col>
              <el-col :span="6" class="lie">
                <el-button
                  v-if="toState(formInfo.data.InCommunication)"
                  type="primary"
                  @click="CommunicationService(formInfo.data.InCommunication.InCommunicationPointId, formInfo.data.InCommunication.State)"
                >{{ toState(formInfo.data.InCommunication) }}</el-button>
              </el-col>
            </el-row>

            <el-row v-if="state === 'push'" class="hang">
              <el-col :span="2" class="lie">通信点-出</el-col><el-col :span="4" class="lie">{{ formInfo.data.OutCommunication && formInfo.data.OutCommunication.OutCommunicationPointName }}</el-col>
              <el-col :span="2" class="lie">消息总量</el-col><el-col :span="4" class="lie">{{ formInfo.data.OutCommunication && formInfo.data.OutCommunication.MessageCount }}</el-col>
              <el-col :span="2" class="lie">状态</el-col><el-col :span="4" class="lie">{{ formInfo.data.OutCommunication && formInfo.data.OutCommunication.State }}</el-col>
              <el-col :span="6" class="lie">
                <el-button
                  v-if="toState(formInfo.data.InCommunication)"
                  type="primary"
                  @click="CommunicationService(formInfo.data.OutCommunication.OutCommunicationPointId, formInfo.data.OutCommunication.State)"
                >{{ toState(formInfo.data.OutCommunication) }}</el-button>
              </el-col>
            </el-row>

          </div>

          <!-- 表格 -->
          <comp-table
            :listen-height="false"
            :height="'calc(100vh - 380px)'"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurpage"
            :data.sync="tableInfo.data"
            :check-box="false"
            :tab-index="true"
            :api="GetDictTable"
            :pager="false"
            :query="tableInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="selects"
            :handle="tableInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽的使用 -->
            <template v-slot:col-btn="slotProps">
              <el-button
                type="primary"
                @click="OperationService(slotProps.row)"
              >{{ slotProps.row.STATUS === 'RUNNING' ? 'STOP' : 'START' }}</el-button>
              <!-- <el-button v-if="slotProps.row.STATUS === 'State_01'" type="primary" @click="tableEdit">START</el-button> -->
              <el-button
                type="primary"
                @click="toRecordPage(slotProps.row)"
              >{{ state === 'push' ? '推送记录' : '调阅记录' }}</el-button>
              <!-- <el-button v-if="state === 'read'" type="primary" @click="toRecordPage" /> -->
            </template>
          </comp-table>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import CompForm from '@/components/CompForm'
import { UploadGetTables, GetReported, GetDictTable, OperationService, CommunicationService } from '@/api/monitor'
export default {
  components: { CompTable, CompForm },
  data() {
    return {
      UploadGetTables,
      GetDictTable,
      state: 'push',
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
        query: {},
        fieldList: [
          { state: 'push', hidden: false, label: '标识', value: 'SERVICE_CODE' },
          { state: 'push', hidden: false, label: '服务名', value: 'SERVICE_NAME' },
          { state: 'push', hidden: false, label: '监控路由', value: 'MONITOR_ROUTE_NAME' },
          { state: 'push', hidden: false, label: '状态', value: 'STATUS' },
          { state: 'push', hidden: false, label: '末次上传批次号', value: 'BATCH_NO' },
          { state: 'push', hidden: false, label: '末次上传时间', value: 'UPLOADED_DATE_TIME' },
          { state: 'push', hidden: false, label: '次数', value: 'UPLOAD_TIMES' },

          { state: 'read', hidden: true, label: '类别', value: 'CLASS_NAME' },
          { state: 'read', hidden: true, label: '标识', value: 'SERVICE_NAME' },
          { state: 'read', hidden: true, label: '名称', value: 'SERVICE_NAME' },
          { state: 'read', hidden: true, label: '监控路由', value: 'MONITOR_ROUTE_NAME' },
          { state: 'read', hidden: true, label: '状态', value: 'STATUS' },
          { state: 'read', hidden: true, label: '末次调阅时间', value: 'REQUEST_DATE_TIME' }

          // { label: '操作', value: 'btn', type: 'slot', width: '200' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            // { label: 'STOP', type: 'primary', event: 'OperationService', show: true },
            { label: ({ STATUS }) => STATUS === 'RUNNING' ? 'STOP' : 'START', type: 'primary', event: 'OperationService', show: true },
            { label: '推送记录', type: 'primary', event: 'toRecordPage', show: true },
            { label: '调阅记录', type: 'primary', event: 'toRecordPage', show: true }
          ]
        }
      },

      // 表单配置表
      formInfo: {
        ref: null,
        data: {},
        fieldList: [
          { label: '上报机构', value: 'ReportOrganCode', type: 'input', disabled: true },
          { label: '上报项目', value: 'ProjectShortName', type: 'input', disabled: true },

          { label: '上报周期', value: 'ReportCycle', type: 'input', disabled: true, hidden: false },
          { label: '输出类型', value: 'TaskOutType', type: 'input', disabled: true, hidden: false },

          { label: '数据库服务器', value: 'ServerName', type: 'input', hidden: true },
          { label: '数据库', value: 'Database', type: 'input', hidden: true },

          { label: '日志保存天数', value: 'SaveLogDays', type: 'input', disabled: true },
          { label: 'ESB服务器', value: 'EsbServer', type: 'input', disabled: true },
          { label: 'Web服地址', value: 'WebServer', type: 'input', disabled: true }
        ]
      }
    }
  },
  mounted() {
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.selects.projects = await this.$store.dispatch('select/GetProjects', { Type: '5' })
    },

    OperationService(rows) {
      console.log(rows)

      const { STATUS, MONITOR_ROUTE_ID: keyValue } = rows
      const action = STATUS === 'RUNNING' ? 'STOP' : 'START'
      OperationService({ keyValue, action, ProjectId: this.tableInfo.query.ProjectId }).then(res => {
        this.$message(res)
        this.updateTable()
        this.tableInfo.handle.btList
      })
    },
    CommunicationService(keyValue, state) {
      const action = state === 'RUNNING' ? 'STOP' : 'START'
      CommunicationService({ keyValue, action, ProjectId: this.tableInfo.query.ProjectId }).then(async res => {
        this.$message(res)

        const data = await GetReported({ ProjectId: this.tableInfo.query.ProjectId })
        this.state = data.OutCommunication ? 'push' : 'read'
        this.sideEffect(this.state)
        this.formInfo.data = data
      })
    },
    toState(state) {
      if (state) {
        return state.State === 'RUNNING' ? 'STOP' : 'START'
      }
    },

    // tree方法
    async handleNodeClick(data, node, that) {
      const { ClassCode: ProjectId } = data
      this.tableInfo.query.ProjectId = ProjectId
      const res = await GetReported({ ProjectId })

      this.state = res.OutCommunication ? 'push' : 'read'
      this.sideEffect(this.state)
      this.formInfo.data = res
      this.updateTable()
    },

    sideEffect(state) {
      this.tableInfo.fieldList.forEach(item => {
        if (item.state && item.state === state) {
          item.hidden = false
        } else if (item.state) {
          item.hidden = true
        }
      })

      this.tableInfo.handle.btList[2].show = true
      this.tableInfo.handle.btList[1].show = true

      if (state === 'push') {
        this.tableInfo.handle.btList[2].show = false

        this.formInfo.fieldList[2].hidden = this.formInfo.fieldList[3].hidden = false
        this.formInfo.fieldList[4].hidden = this.formInfo.fieldList[5].hidden = true
      } else {
        this.tableInfo.handle.btList[1].show = false

        this.formInfo.fieldList[2].hidden = this.formInfo.fieldList[3].hidden = true
        this.formInfo.fieldList[4].hidden = this.formInfo.fieldList[5].hidden = false
      }
    },

    loadNode(node, resolve) {
      const { data, level } = node
      if (level === 0) return resolve([{ name: 'region' }])
      if (level > 1) return resolve([])
      this.$store.dispatch('select/GetDataTables', { ProjectId: data.ClassCode }).then(res => {
        resolve(res)
      })
    },

    toRecordPage(rows) {
      if (this.state === 'push') this.$router.push({ path: '/monitor/pushRecord', query: rows })
      if (this.state === 'read') this.$router.push({ path: '/monitor/readRecord', query: rows })
    },

    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
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
