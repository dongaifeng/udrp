import request from '@/utils/request'

export function systemDictGetLIst(data) {
  return request({
    url: '/System/Dict/GetList',
    method: 'post',
    data
  })
}
