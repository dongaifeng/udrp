<template>
  <div class="app-container">

    <el-row>
      <!-- tree 菜单 -->
      <el-col :span="5">
        <el-tree
          ref="tree"
          :data="selects.projects"
          :props="treeProps"
          :load="loadNode"
          node-key="ClassCode"
          :default-expanded-keys="[$route.query.ProjectId || 0]"
          lazy
          highlight-current
          :current-node-key="currentNode"
          @node-click="handleNodeClick"
        />
      </el-col>

      <!-- 右侧 表格 -->
      <el-col :span="19">
        <!-- 上 -->
        <el-row>
          <CompForm
            :ref-obj.sync="formInfo.ref"
            :form-data="formInfo.data"
            :field-list="formInfo.fieldList"
            :label-width="formInfo.labelWidth"
          />
          <!-- 表格 -->
          <comp-table
            :listen-height="false"
            :height="200"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurpage"
            :data.sync="tableInfo.data"
            :check-box="false"
            :tab-index="true"
            :api="UploadGetList"
            :pager="false"
            :query="tableInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="selects"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
            @el-row-dblclick="rowDblClick"
          >
            <!-- 自定义插槽的使用 -->
            <template v-slot:col-AUDIT_STATUS="slotProps">
              {{ getDictName(selects.AuditState, slotProps.row.AUDIT_STATUS ) }}
            </template>

            <template v-slot:col-btn="slotProps">
              <el-button v-if="slotProps.row.AUDIT_STATUS === 'State_01'" type="primary" @click="operationBtn(slotProps.row.RRB_ID, '1')">通过</el-button>
              <el-button v-if="slotProps.row.AUDIT_STATUS === 'State_01'" type="primary" @click="operationBtn(slotProps.row.RRB_ID, '2')">打回</el-button>
              <el-button v-if="slotProps.row.AUDIT_STATUS === 'State_04'" type="primary" @click="operationBtn(slotProps.row.RRB_ID, '3')">上传</el-button>
              <el-button v-if="slotProps.row.AUDIT_STATUS === 'State_05'" type="primary" @click="operationBtn(slotProps.row.RRB_ID, '4', slotProps.row.UPLOAD_TIMES)">召回</el-button>
            </template>

          </comp-table>
        </el-row>

        <!-- 下面的表格 -->
        <el-row style="margin-top: 20px">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="4">
                <el-form-item label="数据项">
                  <el-select v-model="form.DataItemId" clearable placeholder="请选择数据项" @change="DataItemChange">
                    <el-option v-for="item in selects.ProjectsDataItem" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label="form.DataItemName" label-width="120px">
                  <el-input v-model="form.DataValue" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label="状态">
                  <el-select v-model="form.Status" clearable placeholder="请选择">
                    <el-option v-for="item in selects.ListAuditState" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8" :push="2">
                <el-button type="primary" :disabled="btnStatus" @click="batchAction('RemoveTable')">废除</el-button>
                <el-button type="primary" :disabled="btnStatus" @click="batchAction('PassTable')">通过</el-button>
                <el-button type="primary" :disabled="btnStatus" @click="batchAction('NoPassTable')">不通过</el-button>
                <el-button type="primary" @click="updateTable(2)">查询</el-button>
                <!-- <el-button @click="addProject">详情</el-button> -->
              </el-col>
            </el-row>
          </el-form>

          <el-col :span="addMOdelVisiable ? 18 : 24">
            <!-- 列表 -->
            <comp-table
              :listen-height="false"
              :height="'calc(100vh - 450px)'"
              :refresh="tableInfo2.refresh"
              :init-curpage="tableInfo2.initCurpage"
              :data.sync="tableInfo2.data"
              :check-box="true"
              :tab-index="true"
              :api="UploadGetDictTable"
              :pager="false"
              :query="form"
              :field-list.sync="tableInfo2.fieldList"
              :checked-list="[]"
              auto-header
              :handle="tableInfo2.handle"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
              @el-selection-change="selectionChange"
              @el-row-dblclick="rowDblClick2"
            >
              <!-- 自定义插槽显示状态 -->
            </comp-table>
          </el-col>
          <el-col :span="addMOdelVisiable ? 6: 0" style="height: calc(100vh - 440px); overflow-y: scroll">
            <Detail
              v-if="addMOdelVisiable"
              ref="detail"
              :data-table-id="form.DataTableId"
              :detail-data="detailData"
              :field-list="tableInfo2.fieldList"
              @updateTable="updateTable(2)"
              @close="close"
            />
          </el-col>

        </el-row>

      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompTable from '@/components/CompTable'
import CompForm from '@/components/CompForm'
import Detail from './components/Detail'
import { UploadGetList, UploadGetDictTable, OperationService, OperationDictTable, RemoveTable, PassTable, NoPassTable } from '@/api/dataAudit'
import { getDictName } from '@/utils'
export default {
  components: { CompTable, CompForm, Detail },
  data() {
    return {
      UploadGetList,
      UploadGetDictTable,
      addMOdelVisiable: false,
      btnStatus: true,
      currentNode: null,
      routeProps: null,
      detailData: {},
      treeProps: {
        label: 'ClassName',
        // isLeaf: 'leaf',
        children: 'ClassName'
      },

      selects: {
        projects: [],
        AuditState: [],
        ProjectsDataItem: [],
        ListAuditState: []
      },

      // 表单相关
      form: {
        DataItemName: '无数据项'
      },

      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        query: {
          DataTableId: ''
        },
        fieldList: [
          { label: '批次号', value: 'BATCH_NO' },
          { label: '状态', value: 'AUDIT_STATUS', type: 'slot' },
          { label: '填报次数', value: 'FILL_IN_TIMES' },
          { label: '提交时间', value: 'COMMITED_DATE_TIME' },
          { label: '提交人', value: 'COMMITED_USER_NAME' },
          //
          { label: '审核次数', value: 'AUDIT_TIMES' },
          { label: '审核时间', value: 'AUDITED_DATE_TIME' },
          { label: '审核人', value: 'AUDITED_USER_NAME' },
          { label: '上传次数', value: 'UPLOAD_TIMES' },
          { label: '上传时间', value: 'UPLOADED_DATE_TIME' },
          { label: '上传人', value: 'UPLOADED_USER_NAME' },
          { label: '操作', value: 'btn', type: 'slot', width: '200', fixed: 'right' }
        ]
      },

      // 表格相关
      tableInfo2: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        selectData: [],
        query: {
          DataTableId: '',
          RrbId: ''
        },
        fieldList: [],
        handle: {
          fixed: 'left',
          label: '操作',
          width: '200',
          btList: [
            { label: '通过', type: 'primary', icon: 'el-icon-ship', event: 'allow', show: true },
            { label: '不通过', type: 'primary', icon: 'el-icon-ship', event: 'notAllow', show: true }
          ]
        }

      },
      // 表单配置表
      formInfo: {
        ref: null,
        data: {},
        fieldList: [
          { label: '数据表', value: 'DataTableName', type: 'input', disabled: true },
          { label: '服务名', value: 'ServerName', type: 'input', disabled: true },
          { label: '数据库服务名', value: 'DataServerName', type: 'input', disabled: true },
          { label: '数据库', value: 'Database', type: 'input', disabled: true }
        ]
      }
    }
  },
  created() {
    this.initSelect()
    this.routeProps = this.$route.query
  },
  mounted() {
    // console.log(this.$refs.tree.getCurrentKey(), '------tree.getCurrentKey------')
    // console.log(this.$refs.tree.getCurrentNode(), '------tree.getCurrentNode------')
    // this.$nextTick(function() {
    //   this.$refs.tree.setCurrentKey(['1'])
    // })
  },
  methods: {
    // api调用
    async initSelect() {
      this.selects.projects = await this.$store.dispatch('select/GetProjects', { Type: '4' })
      this.selects.ListAuditState = await this.$store.dispatch('select/GetSelect', 'ListAuditState')
      this.selects.AuditState = await this.$store.dispatch('select/GetSelect', 'AuditState')
    },
    batchAction(name) {
      const api = { RemoveTable, PassTable, NoPassTable }
      api[name]({ DataTableId: this.form.DataTableId, ListParam: this.tableInfo2.selectData }).then(res => {
        this.$message('修改成功')
        this.updateTable(2)
      })
    },
    allow(rows) {
      const { RECORD_FLOW, RRB_ID } = rows
      OperationDictTable({ DataTableId: this.form.DataTableId, RECORD_FLOW, RRB_ID, Action: '2' }).then(res => {
        this.$message('修改成功')
        this.updateTable(2)
      })
    },
    notAllow(rows) {
      const { RECORD_FLOW, RRB_ID } = rows
      OperationDictTable({ DataTableId: this.form.DataTableId, RECORD_FLOW, RRB_ID, Action: '3' }).then(res => {
        this.$message('修改成功')
        this.updateTable(2)
      })
    },
    operationBtn(RrbId, Action, UPLOAD_TIMES = '') {
      this.addMOdelVisiable = false
      switch (Action) {
        case '4':
          this.OperationService(RrbId, Action, UPLOAD_TIMES)
          break
        default:
          this.OperationService(RrbId, Action)
          break
      }
    },
    OperationService(RrbId, Action, UPLOAD_TIMES) {
      this.$confirm('是否继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.post(RrbId, Action, UPLOAD_TIMES)
      })
    },
    // promptOperationService(RrbId, Action) {
    //   this.$confirm('是否继续此操作?', '提示', {
    //     confirmButtonText: '召回本批次',
    //     cancelButtonText: '召回新批次',
    //     type: 'warning'
    //   }).then(() => {
    //     this.post(RrbId, Action)
    //   }).catch(() => {
    //     this.post(RrbId, '5')
    //   })
    // },
    post(RrbId, Action, UPLOAD_TIMES) {
      OperationService({ DataTableId: this.form.DataTableId, RrbId, Action, UPLOAD_TIMES }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })

        UploadGetList({ DataTableId: this.form.DataTableId }).then(res => {
          const { BatchAudit, ...data } = res
          this.formInfo.data = data

          if (typeof BatchAudit === 'object') {
            this.tableInfo.data = BatchAudit
          } else {
            this.tableInfo.data = []
          }
        })
      })
    },

    updateTable(ref) {
      if (ref && ref === 2) {
        this.tableInfo2.refresh = Math.random()
      } else {
        this.tableInfo.refresh = Math.random()
      }
    },

    rowDblClick2(rows) {
      this.detailData = rows
      this.addMOdelVisiable = true
      this.$nextTick(function() {
        this.$refs.detail.GetTableModels(this.form.DataTableId, rows.RECORD_FLOW)
      })
    },

    // tree方法
    async handleNodeClick(data, node, that) {
      this.addMOdelVisiable = false
      console.log(data, node, 'tree====')
      if (node.level === 2) {
        this.selects.ProjectsDataItem = await this.$store.dispatch('select/GetProjectsDataItem', { DataTableId: data.ClassCode })
        this.tableInfo.query.DataTableId = data.ClassCode
        this.form.DataTableId = data.ClassCode
        // this.tableInfo2.query.DataTableId = data.ClassCode
        this.tableInfo2.data = []
        UploadGetList({ DataTableId: data.ClassCode }).then(res => {
          const { BatchAudit, ...data } = res
          this.formInfo.data = data
          if (typeof BatchAudit === 'object') {
            this.tableInfo.data = BatchAudit
          } else {
            this.tableInfo.data = []
          }
        })
      }
    },
    getDictName(arr, val) {
      return getDictName(arr, val)
    },
    DataItemChange(val) {
      this.form.DataItemName = getDictName(this.selects.ProjectsDataItem, val)
    },

    async loadNode(node, resolve) {
      const { data, level } = node

      if (level === 0) return resolve([{ name: 'region' }])
      if (level > 1) return resolve([])

      const res = await this.$store.dispatch('select/GetDataTables', { ProjectId: data.ClassCode, type: 1 })
      resolve(res)
      // console.log(this.$refs.tree.getCurrentKey(), '------tree.getCurrentKey------')
      // console.log(this.$refs.tree.getCurrentNode(), '------tree.getCurrentNode------')

      if (this.routeProps.DataTableId) {
        this.handleNodeClick(
          { ClassCode: this.routeProps.DataTableId, ClassName: this.routeProps.DataTableName },
          { level: 2 },
          this.$refs.tree
        )
      }
    },
    selectionChange(rows) {
      console.log(rows)
      this.tableInfo2.selectData = rows
    },
    handleEvent(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    },
    handleClick(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    },
    rowDblClick({ RRB_ID, DataTableId, AUDIT_STATUS }) {
      this.addMOdelVisiable = false
      this.tableInfo2.query.RrbId = RRB_ID
      this.form.RrbId = RRB_ID
      // TODO
      this.tableInfo2.handle.btList[0].disabled = true
      this.tableInfo2.handle.btList[1].disabled = true
      this.btnStatus = true
      if (AUDIT_STATUS === 'State_01') {
        this.btnStatus = false
        this.tableInfo2.handle.btList[0].disabled = false
        this.tableInfo2.handle.btList[1].disabled = false
      }

      this.updateTable(2)
    },
    close() {
      this.addMOdelVisiable = !this.addMOdelVisiable
    },
    tableDelete(rows) {
      // const { ProjectId, DeleteFlag } = rows
      // ProjectsRemoveModels({ ProjectId, DeleteFlag }).then(res => {
      //   this.$message('删除成功')
      //   this.updateTable()
      // })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
