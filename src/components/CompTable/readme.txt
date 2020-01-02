 <comp-table
      :listen-height="true"    表格自适应高度
      :height="'60vh'"    高度设定自适应有两种方式 1 设height 用vh，  2使用listen-height属性 计算window高度
      :refresh="tableInfo.refresh"  改变这个值 刷新表格数据
      :init-curpage="tableInfo.initCurpage"  改变这个值 返回第一页
      :data.sync="tableInfo.data"  //  表格的数据
      :api="handleEvent"  // 请求接口
      :pager="true" 
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"  //  每列的选项
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle" 操作列选项设置
      @handleClick="handleClick"
      @handleEvent="handleEvent"

       @el-row-click="handleBtnClick" // 绑定el-table的原生事件 需要前面加el-
    />



     // 表格相关
      tableInfo: {
        refresh: 23,
        initTable: true, 不知道干嘛的
        initCurpage: 1,
        pager: false,
        data: [{ age: '222', name: 'skfhgd' }, { age: '222', name: 'skfhgd' }, { age: '222', name: 'skfhgd' }],  
        fieldList: [ // 列名
          { label: '姓名', value: 'name' },
          { label: '年龄', value: 'age' }

        ],
        handle: {  // 按钮列
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