import { getPageTitle } from './prototype' // 全局方法

// 全局组件
import CompForm from '@/components/CompForm'
import CompTable from '@/components/CompTable'
import CompHeader from '@/components/CompHeader'
import CompUpload from '@/components/CompUpload'

const pinyin = require('js-pinyin')
pinyin.setOptions({ checkPolyphone: false, charCase: 0 })

export default {
  install(Vue, options) {
    Vue.prototype.$getPageTitle = getPageTitle
    Vue.prototype.$py = pinyin
    Vue.component('CompForm', CompForm)
    Vue.component('CompTable', CompTable)
    Vue.component('CompHeader', CompHeader)
    Vue.component('CompUpload', CompUpload)
  }
}
