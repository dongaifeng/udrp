<template>
  <div class="app-container">

    <el-row>
      <el-col :span="6">
        <CompTree
          :expand-all="true"
          :load-type="1"
          :default-clicked="treeInfo.defaultClicked"
          :default-high-light="treeInfo.defaultHighLight"
          :default-expanded="treeInfo.defaultExpanded"
          :tree-data="treeInfo.treeData"
          :base-data.sync="treeInfo.baseData"
          :node-key="treeInfo.nodeKey"
          :load-info.sync="treeInfo.loadInfo"
          :right-menu-list="treeInfo.rightMenuList"
          :tree-refresh="treeInfo.refresh"
          :refresh-level="treeInfo.refreshLevel"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </el-col>
      <el-col :span="18">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="上报机构">
                <el-select v-model="form.ReportOrganCode" placeholder="请选择活动区域">
                  <el-option v-for="item in selects.projects" :key="item.ClassCode" :label="item.ClassName" :value="item.ClassCode" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="">
                <el-checkbox v-model="form.ShowEnabled">显示禁用</el-checkbox>
                <el-checkbox v-model="form.ShowDelete">显示删除</el-checkbox>
              </el-form-item>
            </el-col>

            <el-col :span="6">

              <el-button type="primary" @click="updateTable">查询</el-button>
              <el-button @click="addProject">新建推送项目</el-button>

            </el-col>
          </el-row>
        </el-form>

        <!-- 列表 -->
        <comp-table
          :listen-height="false"
          :height="'calc(100vh - 180px)'"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :check-box="false"
          :tab-index="true"
          :api="reportedGetLIst"
          :pager="false"
          :query="form"
          :field-list="tableInfo.fieldList"
          :list-type-info="selects"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
          @el-row-dblclick="tableEdit"
        >
          <!-- 自定义插槽显示状态 -->

        </comp-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CompTree from '@/components/CompTree'
import CompTable from '@/components/CompTable'

import { reportedGetLIst, ProjectsRemoveModels, UploadGetProjectList } from '@/api/report'
export default {
  components: { CompTree, CompTable },
  data() {
    return {
      reportedGetLIst,
      UploadGetProjectList,
      createProjectVisible: false,
      editData: null,
      state: 'add',
      selects: {
        projects: []
      },
      // 表单相关
      form: {
        ReportOrganCode: '',
        ProjectType: 'PUSH',
        ShowDelete: false,
        ShowEnabled: false
      },
      // 表格相关
      tableInfo: {
        refresh: 0,
        initTable: true,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '上报机构', value: 'ClassCode' },
          { label: '项目编号', value: 'ProjectCode' },
          { label: '项目简称', value: 'ProjectShortName' },
          { label: '状态', value: 'Status' },
          { label: '项目全称', value: 'ProjectName' },
          { label: '项目描述', value: 'ProjectDesc' },
          { label: '拼音码', value: 'Py' },
          { label: '项目负责人', value: 'ProjectLeader' },
          { label: '输出类型', value: 'TaskOutType' },
          { label: '日志保存天数', value: 'SaveLogDays' },
          { label: '启用标志', value: 'IsEnabled', type: 'state', list: { 0: '启用', 1: '禁用' }}
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

      // 树相关信息
      treeInfo: {
        initTree: true, // 初始化加载
        refresh: 1, // 刷新
        nodeKey: 'key', // 节点绑定字段
        defaultClicked: {}, // 默认点击 (设置为对象，保证数据能被监听到)
        defaultHighLight: '', // 默认高亮
        defaultExpanded: [], // 默认展开
        // 对树删除编辑添加时的临时存储，在树刷新后赋值这些数据的
        defaultClickedAsyc: '', // 默认点击
        defaultHighLightAsyc: '', // 默认高亮
        defaultExpandedAsyc: [], // 默认展开
        treeData: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }], // 树渲染数据(非懒加载时由外部渲染)
        baseData: [], // 树的基础数据，从组件中获取到
        // 加载相关数据
        loadInfo: {
          key: 'id', // 节点id
          pKey: 'pid', // 节点父级id
          label: 'name', // 节点名称字段
          api: UploadGetProjectList, // 获取数据的接口
          params: { data: [{ key: 'type', value: 1 }], type: 'query' },
          resFieldList: ['content'] // 数据所在字段
        },
        leftClickData: {},
        rightClickData: {},
        rightMenuList: []
      },
      // 过滤相关配置
      filterInfo: {
        query: {

        }
      }
    }
  },
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.selects.projects = await this.$store.dispatch('select/GetSelect', 'ReportOrgan')
      // GetProjects().then(res => {
      //   this.projectList = res
      // })
    },
    submit(formName) {
      this.formInfo.ref.validate((valid) => {
        if (valid) {
          alert('submit!')
          console.log(this.formInfo.data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
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
      ProjectsRemoveModels({ ProjectId, DeleteFlag }).then(res => {
        this.$message('删除成功')
        this.updateTable()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
