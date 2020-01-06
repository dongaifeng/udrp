import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 注册全局组件
Vue.component('svg-icon', SvgIcon)

// 获取svg目录下的所有.svg结尾的文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// const arr = req.keys()
// arr.map(key => {
//   return req(key)
// })
