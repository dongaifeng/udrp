import request from '@/utils/request'

export function GetSelect(data) {
  return request({
    url: '/api/Selects/GetSelect',
    method: 'post',
    data
  })
}

export function GetProjectsDataItem(data) {
  return request({
    url: '/api/Selects/GetProjectsDataItem',
    method: 'post',
    data
  })
}

export function GetProjects(params) {
  return request({
    url: '/api/Selects/GetProjects',
    method: 'get',
    params
  })
}

export function GetDataItems(params) {
  return request({
    url: '/api/Selects/GetDataItems',
    method: 'get',
    params
  })
}

export function GetDataTables(data) {
  return request({
    url: '/api/Selects/GetDataTables',
    method: 'post',
    data
  })
}

export function GetPushService(data) {
  return request({
    url: '/api/Selects/GetPushService',
    method: 'post',
    data
  })
}

export function GetReadSources(params) {
  return request({
    url: '/api/Selects/GetReadSources',
    method: 'get',
    params
  })
}

export function GetPushSources(data) {
  return request({
    url: '/api/Selects/GetPushSources',
    method: 'post',
    data
  })
}
export function GetServiceName(data) {
  return request({
    url: '/api/Selects/GetServiceName',
    method: 'post',
    data
  })
}

export function GetDataSources(params) {
  return request({
    url: '/api/Selects/GetDataSources',
    method: 'get',
    params
  })
}

export function GetMonitoringRoute(data) {
  return request({
    url: '/api/Selects/GetMonitoringRoute',
    method: 'post',
    data
  })
}
export function GetEsbServer(params) {
  return request({
    url: '/api/Selects/GetEsbServer',
    method: 'get',
    params
  })
}
// 下载模板
// export function DownloadTemplate(params) {
//   return request({
//     url: 'api/Files/DownloadTemplate',
//     method: 'get',
//     params
//   })
// }

export function GetOutPutNode(data) {
  return request({
    url: '/api/Selects/GetOutPutNode',
    method: 'post',
    data
  })
}

