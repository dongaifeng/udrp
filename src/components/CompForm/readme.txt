 <comp-form
      :ref-obj.sync="formInfo.ref" // 可获取el-form的ref 初始定义为null 会自动绑定 
      :form-data="formInfo.data"  表单的数据
      :field-list="formInfo.fieldList"  表单的每一项
      :rules="formInfo.rules" 表单的验证规则
      :label-width="formInfo.labelWidth"  
      :list-type-info="listTypeInfo"
    >


     // 表单相关
      formInfo: {
        ref: null, // 可以拿到el-form  直接写成null就行
        
        data: {  // 表单的数据model
          id: '', 
        },
        fieldList: [  //每一项定义
          { label: '标签名称', value: 'name', type: 'input' },
        ],
        rules: {  校验规则
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        labelWidth: '120px'
        calssName
      }

      fieldList 参数项：
        label： 名称
        value：对应字段
        type： 类型 input，select， textarea，inputNumber，date，slot为自定义项目，设置v-slot=form加slot的这一项设置的value
        calssName
        hidden
        event: 指定事件  可以在 handleEvent获取到你指定的事件 然后判断事件来处理
        required  设置必填项 如果有多项验证规则 请使用rules