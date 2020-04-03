import request from '@/utils/request'
import store from '@/store'

export function login(data) {
  return request({
    url: '/api/Login/Login',
    method: 'post',
    data: {
      UserName: data.username,
      UserPassword: data.password,
      FunCode: 'UDRP', SystemCode: '125'
    }
  })
}

export function getInfo(data) {
  return request({
    url: '/api/Menu/GetUserInfo',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function apiUpdatePwd(data) {
  return request({
    url: '/api/Login/UpdatePwd',
    method: 'post',
    data
  })
}

export function getRoute(data) {
  return request({
    url: '/api/Menu/GetUserMenu',
    method: 'post',
    data
  })
}
