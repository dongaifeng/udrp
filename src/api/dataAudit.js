import request from '@/utils/request'

// 审核上传
export function UploadGetProjectList(data) {
  return request({
    url: '/DataAudit/Upload/GetProjectList',
    method: 'post',
    data
  })
}
export function UploadGetList(data) {
  return request({
    url: '/DataAudit/Upload/GetList',
    method: 'post',
    data
  })
}
export function UploadGetDictTable(data) {
  return request({
    url: '/DataAudit/Upload/GetDictTable',
    method: 'post',
    data
  })
}
export function OperationDictTable(data) {
  return request({
    url: '/DataAudit/Upload/OperationDictTableStatus',
    method: 'post',
    data
  })
}
export function OperationService(data) {
  return request({
    url: '/DataAudit/Upload/OperationService',
    method: 'post',
    data
  })
}
export function RemoveTable(data) {
  return request({
    url: '/DataAudit/Upload/RemoveTable',
    method: 'post',
    data
  })
}
export function PassTable(data) {
  return request({
    url: '/DataAudit/Upload/PassTable',
    method: 'post',
    data
  })
}
export function NoPassTable(data) {
  return request({
    url: '/DataAudit/Upload/NoPassTable',
    method: 'post',
    data
  })
}
export function GetTableModels(data) {
  return request({
    url: '/DataAudit/Upload/GetTableModels',
    method: 'post',
    data
  })
}
export function GetReportDictItems(data) {
  return request({
    url: '/api/Selects/GetReportDictItems',
    method: 'post',
    data
  })
}
export function ModifyTableModels(data) {
  return request({
    url: '/DataAudit/Upload/ModifyTableModels',
    method: 'post',
    data
  })
}

// 审核结果
export function GetAuditResultList(data) {
  return request({
    url: '/DataAudit/Result/GetAuditResultList',
    method: 'post',
    data
  })
}
