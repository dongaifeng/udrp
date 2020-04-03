
import { debuonce } from '@/utils/index'

export default {
  install(Vue, options) {
    Vue.directive('timeClick', {
      // 元素插入父节点时
      inserted: function(el, binding) {
        const callback = binding.value
        el.addEventListener('click', () => {
          debuonce(callback, 300)
        })
      },
      // 指令第一次绑定到元素时，只调用一次
      bind: function() {},
      // 元素VNode更新
      update: function() {},
      // 更新完成
      componentUpdated: function() {},
      // 解除绑定指令 只一次
      unbind: function() {}
    })
  }
}

/**
 *
    el： 所绑定的元素
    binding 一个对象
        name 指令名称
        oldValue  上一次的值  仅在update， componentUpdated
        value 绑定的值
        expression  字符串形式的指令表达式 等号后面的
    vnode
    oldVnode

    除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行
 *
 * */

/*
    指令参数
     v-mydirective:[argument]="value"
     通过binding.arg可以拿到

 */

