import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/Login/Login',
    method: 'post',
    data: {
      UserName: data.username,
      UserPassword: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
