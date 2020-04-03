import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 白名单路由
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // 获取token
  const hasToken = getToken()
  // 判断cookie里面有没有token
  // 有token，但是去向login页面，直接重定向到首页
  // 没有token，直接去登陆页
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 有token，也不是去首页
      // 判断有没有用户信息 有没有从后台请求路由表
      // 没有的话先请求用户信息，存到store，然后去请求路由表
      // 通过addRoutes 把路由表加入到路由里
      // 然后next过去
      if (store.state.user.name === '' || store.state.permission.addRoutes.length === 0) {
        const { UserID, IsAdmin = true } = await store.dispatch('user/getInfo')
        const accessRoutes = await store.dispatch('permission/generateRoutes', { UserID, IsAdmin })
        router.addRoutes(accessRoutes)
        next({ ...to, replace: true })
      } else {
        // 如果有用户信息，路由表，直接next
        next()
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
