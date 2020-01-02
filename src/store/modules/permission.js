import { asyncRoutes, constantRoutes } from '@/router'
import { getRoute } from '@/api/user'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 过滤从后台获取的路由
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes = []) {
  console.log('数据', routes)
  const res = []
  const map = {}

  routes.forEach(route => {
    const { FuncName, Url, FuncIcon, FuncID, ParentID, FuncType, Component, FuncCode } = route
    const item = {}
    item.path = Url || ''
    item.component = FuncType === '1' ? Layout : resolve => require([`@/views${Component}`], resolve)
    item.name = FuncCode || ''
    item.meta = {}
    item.meta.title = FuncName || ''
    item.meta.icon = FuncIcon || ''
    item.id = FuncID || ''
    if (FuncType === '1') {
      item.redirect = Component
      item.children = map[FuncID] ? map[FuncID].children : []
      map[FuncID] = item
    }
    if (FuncType === '2') {
      if (!map[ParentID]) { map[ParentID] = {}; map[ParentID].children = [] }
      map[ParentID].children.push(item)
    }
  })
  console.log('map===========', map)
  Object.keys(map).forEach(key => res.push(map[key]))
  console.log('res===========', res)
  res.push({ path: '*', redirect: '/404', hidden: true })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit }, data) {
    // 从后台加载路由表
    const { menuData } = await getRoute(data)
    return new Promise(resolve => {
      let accessedRoutes
      if (menuData) {
        accessedRoutes = filterAsyncRoutes(menuData)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
