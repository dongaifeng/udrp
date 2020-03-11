
export default {
  mounted() {
    this.updateTable()
    this.initSelect()
  },
  // 自动生成拼音码 需要computed 一个 toPy
  watch: {
    toPy: function(newVal) {
      this.formInfo.data.Py = this.$py.getCamelChars(newVal)
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
    }
  }
}
