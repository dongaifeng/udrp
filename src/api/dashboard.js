import request from '@/utils/request'

class Index {
  constructor() {
    this.arr = [
      '/System/Index/GetIndex',
      '/System/Index/GetIndexReadTime',
      '/System/Index/GetIndexPushTime'
    ]

    this.createFn()
  }

  createFn() {
    this.arr.forEach(i => {
      const name = i.substr(i.lastIndexOf('/') + 1)
      this[name] = function(data) {
        return request({
          url: i,
          method: 'post',
          data
        })
      }
    })
  }
}

export default new Index()

export function GetIndex(data) {
  return request({
    url: '/System/Index/GetIndex',
    method: 'post',
    data
  })
}

export function GetIndexReadTime(data) {
  return request({
    url: '/System/Index/GetIndexReadTime',
    method: 'post',
    data
  })
}
