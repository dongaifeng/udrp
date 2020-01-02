import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/Login/Login',
    method: 'post',
    data: {
      UserName: data.username,
      UserPassword: data.password
    }
  })
}

export function getInfo(data) {
  return request({
    url: '/api/Login/GetUserInfo',
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

export function getRoute(data) {
  return request({
    url: '/api/Login/GetUserMenu',
    method: 'post',
    data
  })
}
