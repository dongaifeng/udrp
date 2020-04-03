
export default {
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  // 自动生成拼音码 需要computed 一个 toPy
  watch: {
    toPy: function(newVal) {
      // TODO:
      // if (newVal) this.formInfo.data.Py = this.$py.getCamelChars(newVal)
    }
  },
  methods: {
    // 更新表格
    updateTable(ref) {
      this.tableInfo.refresh = Math.random()
    },
    initSelect() {

    },
    // 表格组件，表单组件 时间处理函数
    handleEvent(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    },
    // 表格中按钮点击事件
    handleClick(event, data) {
      if (typeof this[event] === 'function') this[event](data)
    },

    // 表格中按钮删除方法
    async delete(api, params, DeleteFlag) {
      const res = await api(params)
      const msg = DeleteFlag ? '恢复成功' : '删除成功'
      if (res === 1) this.$message(msg)
      this.updateTable()
    },
    // 表单提交
    submit({ api, data, msg, fn }) {
      this.formInfo.ref.validate(valid => {
        if (valid) {
          api(data).then(res => {
            this.$message({
              message: msg || '保存成功!',
              type: 'success'
            })
            this.updateTable()
            if (typeof this.clearForm === 'function') this.clearForm()
            if (fn) fn(res)
          })
        }
      })
    },

    clearForm(str, obj = {}) {
      if (str === 'formInfo') {
        this.formInfo.data = obj
      } else if (str === 'form' || str === 'addForm') {
        this[str] = obj
      } else {
        return
      }
    },

    rowDblClick(rows) {
      this.form = rows
    }

  }
}
